/**
 * ParticleField.jsx — Cosmic Particle System
 * 
 * Creates a field of floating particles that respond to mouse movement.
 * Particles shift color between cyan (night) and warm gold (day).
 * Uses instanced buffers for performance.
 */

import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

export default function ParticleField({ isDayMode, count = 1500 }) {
    const points = useRef()
    const mousePos = useRef({ x: 0, y: 0 })
    const { viewport } = useThree()

    // Generate random positions and sizes
    const { positions, sizes, speeds } = useMemo(() => {
        const positions = new Float32Array(count * 3)
        const sizes = new Float32Array(count)
        const speeds = new Float32Array(count)

        for (let i = 0; i < count; i++) {
            // Spread particles in a large 3D volume
            positions[i * 3] = (Math.random() - 0.5) * 30       // x
            positions[i * 3 + 1] = (Math.random() - 0.5) * 30   // y
            positions[i * 3 + 2] = (Math.random() - 0.5) * 20   // z
            sizes[i] = Math.random() * 3 + 0.5
            speeds[i] = Math.random() * 0.3 + 0.1
        }

        return { positions, sizes, speeds }
    }, [count])

    // Track mouse for subtle parallax
    useFrame(({ clock, pointer }) => {
        if (!points.current) return

        mousePos.current.x += (pointer.x * 0.5 - mousePos.current.x) * 0.02
        mousePos.current.y += (pointer.y * 0.5 - mousePos.current.y) * 0.02

        const time = clock.getElapsedTime()

        // Gentle rotation and mouse influence
        points.current.rotation.y = time * 0.015 + mousePos.current.x * 0.3
        points.current.rotation.x = time * 0.01 + mousePos.current.y * 0.2

        // Animate individual particle positions for subtle breathing
        const posArray = points.current.geometry.attributes.position.array
        for (let i = 0; i < count; i++) {
            const i3 = i * 3
            posArray[i3 + 1] += Math.sin(time * speeds[i] + i) * 0.001
        }
        points.current.geometry.attributes.position.needsUpdate = true
    })

    // Color transitions based on mode
    const particleColor = isDayMode
        ? new THREE.Color('#d97706')  // Warm amber for day
        : new THREE.Color('#00d4ff')  // Cyan for night

    return (
        <points ref={points}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-size"
                    count={count}
                    array={sizes}
                    itemSize={1}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.035}
                color={particleColor}
                transparent
                opacity={isDayMode ? 0.4 : 0.6}
                sizeAttenuation
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    )
}
