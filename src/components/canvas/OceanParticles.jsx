/**
 * OceanParticles.jsx — Atmospheric Floating Particles
 *
 * Subtle glowing particles that float above the ocean surface,
 * representing sea spray, mist, or fireflies at night.
 *
 * Day mode: warm-toned light particles (sea spray / sunlit mist)
 * Night mode: cool bioluminescent particles
 *
 * Uses Points geometry for extreme performance (thousands of particles).
 * Each particle gently bobs and drifts with unique phase offsets.
 */

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function OceanParticles({ count = 500, isDayMode }) {
    const pointsRef = useRef()
    const materialRef = useRef()

    // Generate particle positions and phase data
    const { positions, phases } = useMemo(() => {
        const positions = new Float32Array(count * 3)
        const phases = new Float32Array(count * 3) // phase, speed, amplitude

        for (let i = 0; i < count; i++) {
            const i3 = i * 3
            // Spread across ocean surface area
            positions[i3] = (Math.random() - 0.5) * 80
            positions[i3 + 1] = Math.random() * 6 + 0.5 // Above water
            positions[i3 + 2] = (Math.random() - 0.5) * 80

            // Unique animation parameters per particle
            phases[i3] = Math.random() * Math.PI * 2       // Phase offset
            phases[i3 + 1] = 0.3 + Math.random() * 0.7     // Speed
            phases[i3 + 2] = 0.2 + Math.random() * 0.8     // Amplitude
        }

        return { positions, phases }
    }, [count])

    // Day/night color targets
    const dayColor = useMemo(() => new THREE.Color('#FFddaa'), [])
    const nightColor = useMemo(() => new THREE.Color('#44aacc'), [])

    useFrame(({ clock }) => {
        if (!pointsRef.current) return
        const t = clock.getElapsedTime()
        const posArray = pointsRef.current.geometry.attributes.position.array

        // Animate each particle with gentle bobbing motion
        for (let i = 0; i < count; i++) {
            const i3 = i * 3
            const phase = phases[i3]
            const speed = phases[i3 + 1]
            const amplitude = phases[i3 + 2]

            // Vertical bobbing
            posArray[i3 + 1] += Math.sin(t * speed + phase) * 0.003 * amplitude
            // Gentle horizontal drift
            posArray[i3] += Math.cos(t * speed * 0.5 + phase) * 0.002
        }
        pointsRef.current.geometry.attributes.position.needsUpdate = true

        // Smooth color transition
        if (materialRef.current) {
            const target = isDayMode ? dayColor : nightColor
            materialRef.current.color.lerp(target, 0.02)
            // Fade opacity based on mode
            const targetOpacity = isDayMode ? 0.3 : 0.5
            materialRef.current.opacity += (targetOpacity - materialRef.current.opacity) * 0.02
        }
    })

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                ref={materialRef}
                size={0.15}
                color={isDayMode ? '#FFddaa' : '#44aacc'}
                transparent
                opacity={0.4}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                sizeAttenuation={true}
            />
        </points>
    )
}
