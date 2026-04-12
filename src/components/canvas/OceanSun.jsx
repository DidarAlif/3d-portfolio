/**
 * OceanSun.jsx — Cinematic Rising/Setting Sun with Scroll Descent
 *
 * The sun's vertical position is driven by TWO factors:
 * 1. isDayMode: controls whether the sun is above or below horizon
 * 2. scrollProgress: as user scrolls down, the sun descends toward
 *    the horizon and eventually below it, creating a sunset effect
 *
 * Sun Y position formula:
 *   Base: isDayMode ? 8.0 (fully risen) : -6.0 (below horizon)
 *   Scroll offset: -scrollProgress * 14 (descends ~14 units over full scroll)
 *   Result: at top of page → sun high | at bottom → sun sets
 *
 * Features:
 * - Scroll-driven sunset animation
 * - Multi-layered glow corona with pulsing
 * - Dynamic color shift (orange sunrise → golden day → red sunset)
 * - Directional light follows sun height and color
 */

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function OceanSun({ isDayMode, scrollProgress, onSunPositionUpdate }) {
    const groupRef = useRef()
    const meshRef = useRef()
    const glow1Ref = useRef()
    const glow2Ref = useRef()
    const glow3Ref = useRef()
    const lightRef = useRef()
    const sunYRef = useRef(-4) // Start below horizon
    const smoothScrollRef = useRef(0)

    // Color targets at different sun heights
    const sunriseColor = new THREE.Color('#FF4400') // Deep orange at horizon
    const goldenColor = new THREE.Color('#FFcc44')  // Golden high noon
    const sunsetColor = new THREE.Color('#FF2200')  // Red sunset
    const nightColor = new THREE.Color('#220800')   // Dark when below

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime()

        // ---- Smooth scroll interpolation ----
        smoothScrollRef.current += (scrollProgress - smoothScrollRef.current) * 0.03

        // ---- Sun vertical position ----
        // Base height from day/night mode
        const baseY = isDayMode ? 8.0 : -6.0
        // Scroll descent: full scroll pushes sun 14 units down (past horizon)
        const scrollOffset = smoothScrollRef.current * -14.0
        const targetY = baseY + scrollOffset

        // Smooth lerp to target
        sunYRef.current += (targetY - sunYRef.current) * 0.015

        if (groupRef.current) {
            groupRef.current.position.set(0, sunYRef.current, -60)
        }

        // Report position to parent for water reflections
        if (onSunPositionUpdate) {
            onSunPositionUpdate(new THREE.Vector3(0, sunYRef.current, -60))
        }

        // ---- Sun progress (0=fully set, 1=fully risen) ----
        const sunProgress = THREE.MathUtils.clamp(
            (sunYRef.current + 6) / 14, 0, 1
        )

        // ---- Color transitions based on sun height ----
        // Low sun = orange/red (sunrise/sunset), high = golden, below = dark
        if (meshRef.current) {
            meshRef.current.rotation.y = t * 0.03

            let targetColor
            if (sunProgress < 0.1) {
                // Below horizon → dark
                targetColor = nightColor
            } else if (sunProgress < 0.35) {
                // Near horizon → sunrise/sunset orange-red
                const t2 = (sunProgress - 0.1) / 0.25
                targetColor = sunriseColor.clone().lerp(sunsetColor, smoothScrollRef.current)
                targetColor.lerp(goldenColor, t2 * 0.3)
            } else if (sunProgress < 0.6) {
                // Rising → warm gold
                const t2 = (sunProgress - 0.35) / 0.25
                targetColor = sunriseColor.clone().lerp(goldenColor, t2)
            } else {
                // High → bright golden
                targetColor = goldenColor.clone()
            }

            meshRef.current.material.emissive.lerp(targetColor, 0.025)
            meshRef.current.material.emissiveIntensity +=
                ((sunProgress > 0.08 ? 2.8 : 0.0) - meshRef.current.material.emissiveIntensity) * 0.02
        }

        // ---- Pulsing glow layers ----
        const glowOpacity = sunProgress > 0.08 ? 1.0 : 0.0
        if (glow1Ref.current) {
            glow1Ref.current.scale.setScalar(1.3 + Math.sin(t * 0.4) * 0.05)
            glow1Ref.current.material.opacity +=
                ((glowOpacity * 0.22) - glow1Ref.current.material.opacity) * 0.02
        }
        if (glow2Ref.current) {
            glow2Ref.current.scale.setScalar(1.8 + Math.sin(t * 0.25) * 0.08)
            glow2Ref.current.material.opacity +=
                ((glowOpacity * 0.12) - glow2Ref.current.material.opacity) * 0.02
        }
        if (glow3Ref.current) {
            glow3Ref.current.scale.setScalar(2.5 + Math.sin(t * 0.15) * 0.12)
            glow3Ref.current.material.opacity +=
                ((glowOpacity * 0.06) - glow3Ref.current.material.opacity) * 0.02
        }

        // ---- Directional light intensity + color follows sun ----
        if (lightRef.current) {
            lightRef.current.intensity += (
                (sunProgress > 0.08 ? 2.2 + Math.sin(t * 0.3) * 0.2 : 0.0) -
                lightRef.current.intensity
            ) * 0.02

            // Light color shifts: warm sunrise → bright day → warm sunset
            let lightTarget
            if (sunProgress < 0.3) {
                lightTarget = new THREE.Color('#FF8844') // Warm
            } else if (sunProgress > 0.7) {
                lightTarget = new THREE.Color('#FFF0DD') // Bright
            } else {
                lightTarget = new THREE.Color('#FFcc88') // Medium
            }
            // Redden during scroll descent (sunset)
            if (smoothScrollRef.current > 0.3) {
                const sunsetMix = (smoothScrollRef.current - 0.3) / 0.7
                lightTarget.lerp(new THREE.Color('#FF6633'), sunsetMix * 0.6)
            }
            lightRef.current.color.lerp(lightTarget, 0.02)
        }
    })

    return (
        <group ref={groupRef} position={[0, -4, -60]}>
            {/* Main sun sphere — large and emissive for bloom */}
            <mesh ref={meshRef}>
                <sphereGeometry args={[5, 48, 48]} />
                <meshStandardMaterial
                    emissive="#FF5500"
                    emissiveIntensity={0}
                    color="#000000"
                    roughness={1}
                    metalness={0}
                    toneMapped={false}
                />
            </mesh>

            {/* Inner corona glow */}
            <mesh ref={glow1Ref}>
                <sphereGeometry args={[5, 32, 32]} />
                <meshBasicMaterial
                    color="#FF7733"
                    transparent
                    opacity={0}
                    side={THREE.BackSide}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            {/* Mid corona */}
            <mesh ref={glow2Ref}>
                <sphereGeometry args={[5, 24, 24]} />
                <meshBasicMaterial
                    color="#FF5500"
                    transparent
                    opacity={0}
                    side={THREE.BackSide}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            {/* Outer halo */}
            <mesh ref={glow3Ref}>
                <sphereGeometry args={[5, 16, 16]} />
                <meshBasicMaterial
                    color="#FF4400"
                    transparent
                    opacity={0}
                    side={THREE.BackSide}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            {/* Directional illumination from the sun */}
            <directionalLight
                ref={lightRef}
                position={[0, 0, 1]}
                intensity={0}
                color="#FFaa55"
                castShadow={false}
            />
        </group>
    )
}
