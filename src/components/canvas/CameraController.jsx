/**
 * CameraController.jsx — Cinematic Camera with Mouse Parallax
 * 
 * 1. Mouse parallax: solar system shifts when cursor moves
 * 2. Click-to-zoom: GSAP tweens camera to target planet
 * 3. Damped OrbitControls for manual exploration
 * 4. Auto-reset to overview after navigation
 * 
 * Parallax Math:
 * - Mouse position is read from window.__mouseX/Y (set by CustomCursor)
 * - Camera position is offset by mouseX * parallaxStrength, mouseY * parallaxStrength
 * - Lerping creates smooth, laggy movement for cinematic feel
 */

import { useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import gsap from 'gsap'
import * as THREE from 'three'

export default function CameraController({
    targetPlanet,
    onCameraArrived,
    scrollProgress,
    isDayMode,
}) {
    const controlsRef = useRef()
    const { camera } = useThree()
    const isAnimating = useRef(false)
    const defaultPos = useRef(new THREE.Vector3(0, 12, 30))
    const defaultTarget = useRef(new THREE.Vector3(0, 0, 0))
    // Smoothed mouse parallax values
    const mouseSmooth = useRef({ x: 0, y: 0 })

    // Set initial camera position
    useEffect(() => {
        camera.position.set(0, 12, 30)
        camera.lookAt(0, 0, 0)
    }, [camera])

    // Animate to planet when targetPlanet changes
    useEffect(() => {
        if (!targetPlanet || !controlsRef.current) return

        const { position } = targetPlanet
        isAnimating.current = true
        controlsRef.current.enabled = false

        const offset = new THREE.Vector3(0, 2, 6)
        const dest = position.clone().add(offset)

        gsap.to(camera.position, {
            x: dest.x,
            y: dest.y,
            z: dest.z,
            duration: 2.5,
            ease: 'expo.out',
            onUpdate: () => {
                camera.lookAt(position)
                if (controlsRef.current) {
                    controlsRef.current.target.copy(position)
                }
            },
            onComplete: () => {
                isAnimating.current = false
                if (controlsRef.current) {
                    controlsRef.current.enabled = true
                    controlsRef.current.target.copy(position)
                }
                if (onCameraArrived) onCameraArrived()

                // Auto-return to overview after 2s
                gsap.to(camera.position, {
                    x: defaultPos.current.x,
                    y: defaultPos.current.y,
                    z: defaultPos.current.z,
                    duration: 3.0,
                    delay: 2.0,
                    ease: 'power2.inOut',
                    onUpdate: () => {
                        if (controlsRef.current) {
                            controlsRef.current.target.lerp(defaultTarget.current, 0.02)
                        }
                    },
                    onStart: () => {
                        if (controlsRef.current) controlsRef.current.enabled = false
                    },
                    onComplete: () => {
                        if (controlsRef.current) {
                            controlsRef.current.target.copy(defaultTarget.current)
                            controlsRef.current.enabled = true
                        }
                    },
                })
            },
        })

        return () => {
            gsap.killTweensOf(camera.position)
        }
    }, [targetPlanet, camera, onCameraArrived])

    // Per-frame: mouse parallax + scroll offset
    useFrame(() => {
        if (isAnimating.current || !controlsRef.current) return

        // Read mouse position from window (set by CustomCursor)
        const mx = window.__mouseX || 0
        const my = window.__mouseY || 0

        // Smooth lerp for buttery feel
        mouseSmooth.current.x += (mx - mouseSmooth.current.x) * 0.03
        mouseSmooth.current.y += (my - mouseSmooth.current.y) * 0.03

        // Apply parallax offset to camera position
        // Parallax strength: how far the camera shifts
        const parallaxX = mouseSmooth.current.x * 3.5
        const parallaxY = mouseSmooth.current.y * -2.0

        // Camera stays at fixed height — no scroll offset
        // This prevents the "zoom" feel when scrolling the page

        // Blend: default position + parallax (no scroll movement)
        const targetX = defaultPos.current.x + parallaxX
        const targetY = defaultPos.current.y + parallaxY
        const targetZ = defaultPos.current.z

        // Smoothly move camera toward target
        camera.position.x += (targetX - camera.position.x) * 0.05
        camera.position.y += (targetY - camera.position.y) * 0.05
        camera.position.z += (targetZ - camera.position.z) * 0.05
    })

    return (
        <OrbitControls
            ref={controlsRef}
            makeDefault
            enablePan={false}
            enableZoom={false}
            enableRotate={true}
            enableDamping={true}
            dampingFactor={0.03}
            maxPolarAngle={Math.PI * 0.85}
            minPolarAngle={Math.PI * 0.15}
            rotateSpeed={0.3}
        />
    )
}
