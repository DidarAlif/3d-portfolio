/**
 * FloatingObjects.jsx — Animated Wireframe Geometry
 * 
 * Creates wireframe geometric shapes (icosahedron, torus, octahedron)
 * that float, rotate, and respond to scroll position.
 * Objects shift material color between day/night modes.
 */

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

function WireframeShape({ position, geometry, speed, color, scale = 1, scrollProgress }) {
    const meshRef = useRef()

    useFrame(({ clock }) => {
        if (!meshRef.current) return
        const t = clock.getElapsedTime()
        meshRef.current.rotation.x = t * speed * 0.3
        meshRef.current.rotation.y = t * speed * 0.5

        // Slight scroll-based movement
        meshRef.current.position.y = position[1] + Math.sin(scrollProgress * Math.PI * 2) * 0.5
    })

    return (
        <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
            <mesh ref={meshRef} position={position} scale={scale}>
                {geometry}
                <meshStandardMaterial
                    color={color}
                    wireframe
                    transparent
                    opacity={0.25}
                    emissive={color}
                    emissiveIntensity={0.15}
                />
            </mesh>
        </Float>
    )
}

function GlowSphere({ position, color, scale = 0.3 }) {
    const ref = useRef()

    useFrame(({ clock }) => {
        if (!ref.current) return
        const t = clock.getElapsedTime()
        ref.current.scale.setScalar(scale + Math.sin(t * 2) * 0.05)
    })

    return (
        <mesh ref={ref} position={position}>
            <sphereGeometry args={[1, 16, 16]} />
            <MeshDistortMaterial
                color={color}
                transparent
                opacity={0.15}
                distort={0.4}
                speed={2}
                emissive={color}
                emissiveIntensity={0.3}
            />
        </mesh>
    )
}

export default function FloatingObjects({ isDayMode, scrollProgress }) {
    const nightColor1 = '#00d4ff'
    const nightColor2 = '#7c3aed'
    const nightColor3 = '#10b981'

    const dayColor1 = '#d97706'
    const dayColor2 = '#b45309'
    const dayColor3 = '#92400e'

    const c1 = isDayMode ? dayColor1 : nightColor1
    const c2 = isDayMode ? dayColor2 : nightColor2
    const c3 = isDayMode ? dayColor3 : nightColor3

    return (
        <group>
            {/* Large wireframe shapes scattered through the scene */}
            <WireframeShape
                position={[-6, 3, -5]}
                geometry={<icosahedronGeometry args={[1.5, 1]} />}
                speed={0.4}
                color={c1}
                scale={1}
                scrollProgress={scrollProgress}
            />
            <WireframeShape
                position={[7, -2, -8]}
                geometry={<torusKnotGeometry args={[1, 0.3, 64, 16]} />}
                speed={0.3}
                color={c2}
                scale={0.8}
                scrollProgress={scrollProgress}
            />
            <WireframeShape
                position={[-5, -4, -6]}
                geometry={<octahedronGeometry args={[1.2, 0]} />}
                speed={0.5}
                color={c3}
                scale={1}
                scrollProgress={scrollProgress}
            />
            <WireframeShape
                position={[5, 5, -10]}
                geometry={<dodecahedronGeometry args={[1, 0]} />}
                speed={0.2}
                color={c1}
                scale={0.7}
                scrollProgress={scrollProgress}
            />
            <WireframeShape
                position={[0, -6, -7]}
                geometry={<torusGeometry args={[1.5, 0.2, 16, 32]} />}
                speed={0.35}
                color={c2}
                scale={0.6}
                scrollProgress={scrollProgress}
            />

            {/* Glowing spheres for depth */}
            <GlowSphere position={[-3, 1, -3]} color={c1} scale={0.2} />
            <GlowSphere position={[4, 3, -5]} color={c2} scale={0.15} />
            <GlowSphere position={[1, -3, -4]} color={c3} scale={0.25} />
        </group>
    )
}
