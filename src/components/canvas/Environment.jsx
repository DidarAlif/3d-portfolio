/**
 * Environment.jsx — Dynamic Lighting System
 * 
 * Manages all 3D scene lighting with smooth transitions
 * between Day and Night modes. Uses multiple light types
 * for cinematic depth and atmosphere.
 */

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Environment({ isDayMode }) {
    const ambientRef = useRef()
    const pointRef1 = useRef()
    const pointRef2 = useRef()
    const pointRef3 = useRef()

    // Night mode targets
    const nightAmbient = 0.08
    const nightPoint1Color = new THREE.Color('#00d4ff')
    const nightPoint2Color = new THREE.Color('#7c3aed')
    const nightPoint3Color = new THREE.Color('#10b981')

    // Day mode targets
    const dayAmbient = 0.35
    const dayPoint1Color = new THREE.Color('#fbbf24')
    const dayPoint2Color = new THREE.Color('#f59e0b')
    const dayPoint3Color = new THREE.Color('#d97706')

    useFrame(() => {
        const targetAmbient = isDayMode ? dayAmbient : nightAmbient
        const t1 = isDayMode ? dayPoint1Color : nightPoint1Color
        const t2 = isDayMode ? dayPoint2Color : nightPoint2Color
        const t3 = isDayMode ? dayPoint3Color : nightPoint3Color

        // Smooth interpolation (lerp) for transitions
        if (ambientRef.current) {
            ambientRef.current.intensity += (targetAmbient - ambientRef.current.intensity) * 0.03
        }
        if (pointRef1.current) {
            pointRef1.current.color.lerp(t1, 0.03)
        }
        if (pointRef2.current) {
            pointRef2.current.color.lerp(t2, 0.03)
        }
        if (pointRef3.current) {
            pointRef3.current.color.lerp(t3, 0.03)
        }
    })

    return (
        <>
            {/* Ambient base light */}
            <ambientLight ref={ambientRef} intensity={isDayMode ? dayAmbient : nightAmbient} />

            {/* Key light — main illumination */}
            <pointLight
                ref={pointRef1}
                position={[5, 5, 5]}
                intensity={isDayMode ? 1.5 : 0.8}
                color={isDayMode ? '#fbbf24' : '#00d4ff'}
                distance={20}
            />

            {/* Fill light — adds depth and color */}
            <pointLight
                ref={pointRef2}
                position={[-5, 3, -3]}
                intensity={isDayMode ? 0.8 : 0.5}
                color={isDayMode ? '#f59e0b' : '#7c3aed'}
                distance={15}
            />

            {/* Accent light — subtle rim/back light */}
            <pointLight
                ref={pointRef3}
                position={[0, -5, 5]}
                intensity={isDayMode ? 0.6 : 0.3}
                color={isDayMode ? '#d97706' : '#10b981'}
                distance={15}
            />

            {/* Fog for atmospheric depth */}
            <fog
                attach="fog"
                near={8}
                far={30}
                color={isDayMode ? '#f5f0eb' : '#0a0a0f'}
            />
        </>
    )
}
