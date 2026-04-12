/**
 * OceanCameraController.jsx — Ocean Scene Camera with Mouse Parallax
 *
 * Purpose-built camera controller for the ocean scene:
 * - Positions camera looking out over the ocean toward the horizon
 * - Smooth mouse parallax for immersive depth
 * - Scroll-driven vertical offset
 * - Gentle ambient sway for "breathing" effect
 *
 * Unlike the solar system camera, this controller has no orbit controls
 * or planet navigation — it's a fixed scenic viewpoint with subtle motion.
 */

import { useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function OceanCameraController({ scrollProgress, isDayMode }) {
    const { camera } = useThree()
    const mouseSmooth = useRef({ x: 0, y: 0 })
    const defaultPos = useRef(new THREE.Vector3(0, 3, 15))
    const lookTarget = useRef(new THREE.Vector3(0, 1, -20))

    // Set initial ocean camera position
    useEffect(() => {
        camera.position.set(0, 3, 15)
        camera.lookAt(0, 1, -20)
        camera.fov = 55
        camera.updateProjectionMatrix()
    }, [camera])

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime()

        // Read mouse position (set by CustomCursor component)
        const mx = window.__mouseX || 0
        const my = window.__mouseY || 0

        // Smooth lerp for buttery parallax
        mouseSmooth.current.x += (mx - mouseSmooth.current.x) * 0.02
        mouseSmooth.current.y += (my - mouseSmooth.current.y) * 0.02

        // Parallax offset from mouse
        const parallaxX = mouseSmooth.current.x * 2.0
        const parallaxY = mouseSmooth.current.y * -1.0

        // Scroll offset
        const scrollY = (scrollProgress || 0) * -3

        // Ambient breathing sway
        const swayX = Math.sin(t * 0.15) * 0.3
        const swayY = Math.cos(t * 0.1) * 0.15

        // Target camera position
        const targetX = defaultPos.current.x + parallaxX + swayX
        const targetY = defaultPos.current.y + scrollY + parallaxY + swayY
        const targetZ = defaultPos.current.z

        // Smooth camera movement
        camera.position.x += (targetX - camera.position.x) * 0.04
        camera.position.y += (targetY - camera.position.y) * 0.04
        camera.position.z += (targetZ - camera.position.z) * 0.04

        // Look target with subtle parallax
        const lookX = lookTarget.current.x + parallaxX * 0.3
        const lookY = lookTarget.current.y + parallaxY * 0.3 + scrollY * 0.2
        const lookZ = lookTarget.current.z

        camera.lookAt(lookX, lookY, lookZ)
    })

    return null
}
