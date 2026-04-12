/**
 * Starfield.jsx — Depth-Layered Instanced Star Background
 * 
 * Uses InstancedMesh for high performance (single draw call).
 * Stars are set up once via useEffect, not per-frame.
 */

import { useRef, useMemo, useEffect } from 'react'
import * as THREE from 'three'

export default function Starfield({ count = 4000, isDayMode }) {
    const meshRef = useRef()

    // Pre-compute transforms and colors once
    const { matrices, colors } = useMemo(() => {
        const matrices = []
        const colors = []
        const tempMatrix = new THREE.Matrix4()
        const tempColor = new THREE.Color()

        for (let i = 0; i < count; i++) {
            const theta = Math.random() * Math.PI * 2
            const phi = Math.acos(2 * Math.random() - 1)

            // Three depth layers for parallax
            const layer = Math.random()
            let radius
            if (layer < 0.5) {
                radius = 40 + Math.random() * 20
            } else if (layer < 0.85) {
                radius = 60 + Math.random() * 30
            } else {
                radius = 90 + Math.random() * 40
            }

            const x = radius * Math.sin(phi) * Math.cos(theta)
            const y = radius * Math.sin(phi) * Math.sin(theta)
            const z = radius * Math.cos(phi)

            const scale = 0.02 + Math.random() * 0.06

            tempMatrix.identity()
            tempMatrix.makeTranslation(x, y, z)
            tempMatrix.scale(new THREE.Vector3(scale, scale, scale))
            matrices.push(tempMatrix.clone())

            // Star color variation
            const colorRoll = Math.random()
            if (colorRoll < 0.7) {
                tempColor.setHSL(0, 0, 0.8 + Math.random() * 0.2)
            } else if (colorRoll < 0.85) {
                tempColor.setHSL(0.6, 0.5, 0.7 + Math.random() * 0.3)
            } else if (colorRoll < 0.95) {
                tempColor.setHSL(0.12, 0.6, 0.7 + Math.random() * 0.3)
            } else {
                tempColor.setHSL(0.05, 0.8, 0.6 + Math.random() * 0.3)
            }
            colors.push(tempColor.clone())
        }

        return { matrices, colors }
    }, [count])

    // Set up instances ONCE on mount (not per-frame)
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

    return (
        <instancedMesh
            ref={meshRef}
            args={[null, null, count]}
            frustumCulled={false}
        >
            <sphereGeometry args={[1, 4, 4]} />
            <meshBasicMaterial
                transparent
                opacity={isDayMode ? 0.15 : 0.9}
                depthWrite={false}
            />
        </instancedMesh>
    )
}
