/**
 * Sun.jsx — The Solar System's Focal Point
 * 
 * Uses MeshStandardMaterial with high emissive for reliable rendering.
 * Additive-blended outer glow spheres for corona effect.
 * The bloom post-processing catches the emissive output.
 */

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Sun({ isDayMode }) {
    const meshRef = useRef()
    const glowRef1 = useRef()
    const glowRef2 = useRef()
    const lightRef = useRef()

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime()

        // Slow axial rotation
        if (meshRef.current) {
            meshRef.current.rotation.y = t * 0.05
            meshRef.current.rotation.x = t * 0.02
        }

        // Pulsing glow
        if (glowRef1.current) {
            glowRef1.current.scale.setScalar(1.35 + Math.sin(t * 0.5) * 0.05)
        }
        if (glowRef2.current) {
            glowRef2.current.scale.setScalar(1.7 + Math.sin(t * 0.3) * 0.08)
        }

        // Animate light
        if (lightRef.current) {
            lightRef.current.intensity = 2.5 + Math.sin(t * 0.3) * 0.3
        }
    })

    return (
        <group>
            {/* Main sun body — emissive material for bloom */}
            <mesh ref={meshRef}>
                <sphereGeometry args={[2, 48, 48]} />
                <meshStandardMaterial
                    emissive="#FF6600"
                    emissiveIntensity={3.0}
                    color="#FF4400"
                    roughness={1}
                    metalness={0}
                />
            </mesh>

            {/* Inner corona glow */}
            <mesh ref={glowRef1}>
                <sphereGeometry args={[2, 24, 24]} />
                <meshBasicMaterial
                    color="#FF6600"
                    transparent
                    opacity={0.15}
                    side={THREE.BackSide}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            {/* Outer corona glow */}
            <mesh ref={glowRef2}>
                <sphereGeometry args={[2, 16, 16]} />
                <meshBasicMaterial
                    color="#FF4400"
                    transparent
                    opacity={0.06}
                    side={THREE.BackSide}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            {/* Point light at center — illuminates all planets */}
            <pointLight
                ref={lightRef}
                position={[0, 0, 0]}
                intensity={2.5}
                color="#FFF0E0"
                distance={80}
                decay={1.5}
            />
        </group>
    )
}
