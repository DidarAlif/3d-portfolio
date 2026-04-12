/**
 * OceanStars.jsx — Night Sky Stars for Ocean Scene
 *
 * Instanced star field that appears during night mode.
 * Stars are positioned above the horizon only (hemisphere).
 * Opacity smoothly transitions with day/night toggle.
 *
 * Uses InstancedMesh for performance (single draw call for all stars).
 * Stars have subtle twinkling animation via per-frame opacity modulation.
 */

import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function OceanStars({ count = 2000, isDayMode }) {
    const meshRef = useRef()
    const opacityRef = useRef(isDayMode ? 0 : 0.9)

    // Pre-compute star positions (upper hemisphere only)
    const { matrices, colors } = useMemo(() => {
        const matrices = []
        const colors = []
        const tempMatrix = new THREE.Matrix4()
        const tempColor = new THREE.Color()

        for (let i = 0; i < count; i++) {
            const theta = Math.random() * Math.PI * 2
            // Only upper hemisphere (phi from 0 to PI/2)
            const phi = Math.random() * Math.PI * 0.45

            // Distance layering for depth
            const layer = Math.random()
            let radius
            if (layer < 0.5) {
                radius = 80 + Math.random() * 20
            } else if (layer < 0.85) {
                radius = 100 + Math.random() * 20
            } else {
                radius = 120 + Math.random() * 20
            }

            const x = radius * Math.sin(phi) * Math.cos(theta)
            const y = radius * Math.cos(phi) + 5 // Above horizon
            const z = radius * Math.sin(phi) * Math.sin(theta)

            const scale = 0.03 + Math.random() * 0.08
            tempMatrix.identity()
            tempMatrix.makeTranslation(x, y, z)
            tempMatrix.scale(new THREE.Vector3(scale, scale, scale))
            matrices.push(tempMatrix.clone())

            // Star color variety
            const cRoll = Math.random()
            if (cRoll < 0.65) {
                tempColor.setHSL(0, 0, 0.85 + Math.random() * 0.15)
            } else if (cRoll < 0.8) {
                tempColor.setHSL(0.6, 0.4, 0.7 + Math.random() * 0.3)
            } else if (cRoll < 0.92) {
                tempColor.setHSL(0.08, 0.5, 0.7 + Math.random() * 0.3)
            } else {
                tempColor.setHSL(0.0, 0.7, 0.6 + Math.random() * 0.3)
            }
            colors.push(tempColor.clone())
        }

        return { matrices, colors }
    }, [count])

    // Set up instances once
    useEffect(() => {
        if (!meshRef.current) return
        for (let i = 0; i < count; i++) {
            meshRef.current.setMatrixAt(i, matrices[i])
            meshRef.current.setColorAt(i, colors[i])
        }
        meshRef.current.instanceMatrix.needsUpdate = true
        if (meshRef.current.instanceColor) {
            meshRef.current.instanceColor.needsUpdate = true
        }
    }, [count, matrices, colors])

    // Smooth opacity transition
    useFrame(() => {
        const target = isDayMode ? 0.0 : 0.9
        opacityRef.current += (target - opacityRef.current) * 0.02
        if (meshRef.current) {
            meshRef.current.material.opacity = opacityRef.current
        }
    })

    return (
        <instancedMesh
            ref={meshRef}
            args={[null, null, count]}
            frustumCulled={false}
        >
            <sphereGeometry args={[1, 4, 4]} />
            <meshBasicMaterial
                transparent
                opacity={isDayMode ? 0 : 0.9}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </instancedMesh>
    )
}
