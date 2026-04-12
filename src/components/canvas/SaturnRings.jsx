/**
 * SaturnRings.jsx — Beautiful Ring System
 * 
 * Creates Saturn's iconic rings as a flat disc geometry
 * with procedural alpha/color banding.
 * Uses custom ring geometry (annulus) and transparent material.
 * 
 * The rings are composed of concentric bands with varying
 * opacity and color, simulating the Cassini Division and
 * other ring gaps.
 */

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function SaturnRings({ innerRadius = 1.3, outerRadius = 2.2, tilt = 0.47 }) {
    const meshRef = useRef()

    // Create ring geometry — a flat annulus (donut disc)
    const geometry = useMemo(() => {
        const segments = 128
        const rings = 64
        const geo = new THREE.RingGeometry(innerRadius, outerRadius, segments, rings)

        // Generate procedural alpha and color data per vertex
        const pos = geo.attributes.position
        const colors = new Float32Array(pos.count * 3)

        for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i)
            const y = pos.getY(i)
            const dist = Math.sqrt(x * x + y * y)

            // Normalize distance within ring range [0,1]
            const t = (dist - innerRadius) / (outerRadius - innerRadius)

            // Ring bands with gaps
            // Cassini Division at ~0.55
            const cassiniGap = 1.0 - Math.exp(-Math.pow((t - 0.55) * 10, 2)) * 0.7
            // Inner dark ring gap
            const innerGap = 1.0 - Math.exp(-Math.pow((t - 0.15) * 12, 2)) * 0.4
            // Fine ring structure
            const fineStructure = 0.8 + Math.sin(t * 40) * 0.15 + Math.sin(t * 80) * 0.05

            const brightness = cassiniGap * innerGap * fineStructure

            // Warm golden-tan color with variation
            colors[i * 3] = (0.85 + t * 0.15) * brightness      // R
            colors[i * 3 + 1] = (0.75 + t * 0.1) * brightness   // G
            colors[i * 3 + 2] = (0.55 + t * 0.05) * brightness   // B
        }

        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
        return geo
    }, [innerRadius, outerRadius])

    useFrame(({ clock }) => {
        if (meshRef.current) {
            // Very slow ring rotation (rings orbit with planet)
            meshRef.current.rotation.z = clock.getElapsedTime() * 0.003
        }
    })

    return (
        <mesh
            ref={meshRef}
            geometry={geometry}
            rotation={[Math.PI * 0.5, 0, tilt]}
        >
            <meshBasicMaterial
                vertexColors
                transparent
                opacity={0.75}
                side={THREE.DoubleSide}
                depthWrite={false}
                blending={THREE.NormalBlending}
            />
        </mesh>
    )
}
