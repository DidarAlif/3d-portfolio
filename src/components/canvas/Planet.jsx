/**
 * Planet.jsx — Reusable Planet Component
 * 
 * Uses standard Three.js materials for reliable rendering.
 * Each planet has:
 * 1. Core body with MeshStandardMaterial
 * 2. Optional atmosphere glow (additive sphere)
 * 3. Optional cloud layer
 * 4. Orbital mechanics (useFrame animation)
 * 5. Hover label (via drei Html)
 * 6. Click navigation
 */

import { useRef, useState, useCallback, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

export default function Planet({
    name,
    section,
    orbitRadius,
    size,
    orbitSpeed,
    rotationSpeed,
    axialTilt,
    phase = 0,
    colors,
    isDayMode,
    onPlanetClick,
    hasAtmosphere = false,
    atmosphereColor = '#6fa8dc',
    hasClouds = false,
    // unused but accepted props
    noiseScale, bandStretch, bumpStrength, roughness,
    atmospherePower, hasRings, sectionId, activePlanet,
}) {
    const groupRef = useRef()
    const meshRef = useRef()
    const cloudRef = useRef()
    const [isHovered, setIsHovered] = useState(false)
    const posRef = useRef(new THREE.Vector3())

    // Determine geometry segments (LOD based on size)
    const segments = size > 0.8 ? 48 : size > 0.4 ? 32 : 24

    useFrame(({ clock }, delta) => {
        const t = clock.getElapsedTime()

        // Orbital position: x = R*cos(ωt+φ), z = R*sin(ωt+φ)
        const speed = isHovered ? orbitSpeed * 0.3 : orbitSpeed
        const angle = t * speed + phase
        const x = orbitRadius * Math.cos(angle)
        const z = orbitRadius * Math.sin(angle)

        if (groupRef.current) {
            groupRef.current.position.set(x, 0, z)
            posRef.current.set(x, 0, z)
        }

        // Axial rotation
        if (meshRef.current) {
            meshRef.current.rotation.y += rotationSpeed * delta * 60
        }

        // Cloud layer rotates independently
        if (cloudRef.current) {
            cloudRef.current.rotation.y += rotationSpeed * 1.3 * delta * 60
        }
    })

    const handleClick = useCallback((e) => {
        e.stopPropagation()
        if (onPlanetClick) {
            onPlanetClick(name, section, posRef.current.clone())
        }
    }, [onPlanetClick, name, section])

    const handlePointerOver = useCallback((e) => {
        e.stopPropagation()
        setIsHovered(true)
        document.body.style.cursor = 'pointer'
    }, [])

    const handlePointerOut = useCallback(() => {
        setIsHovered(false)
        document.body.style.cursor = 'none'
    }, [])

    return (
        <group ref={groupRef} rotation={[0, 0, axialTilt]}>
            {/* Planet body */}
            <mesh
                ref={meshRef}
                onClick={handleClick}
                onPointerOver={handlePointerOver}
                onPointerOut={handlePointerOut}
            >
                <sphereGeometry args={[size, segments, segments]} />
                <meshStandardMaterial
                    color={colors[0]}
                    roughness={0.8}
                    metalness={0.1}
                    emissive={colors[0]}
                    emissiveIntensity={isHovered ? 0.3 : 0.05}
                />
            </mesh>

            {/* Atmosphere glow */}
            {hasAtmosphere && (
                <mesh scale={1.18}>
                    <sphereGeometry args={[size, 20, 20]} />
                    <meshBasicMaterial
                        color={atmosphereColor}
                        transparent
                        opacity={isHovered ? 0.25 : 0.12}
                        side={THREE.BackSide}
                        depthWrite={false}
                        blending={THREE.AdditiveBlending}
                    />
                </mesh>
            )}

            {/* Cloud layer */}
            {hasClouds && (
                <mesh ref={cloudRef} scale={1.02}>
                    <sphereGeometry args={[size, 20, 20]} />
                    <meshStandardMaterial
                        color="#ffffff"
                        transparent
                        opacity={0.2}
                        depthWrite={false}
                    />
                </mesh>
            )}

            {/* Hover Label */}
            {isHovered && (
                <Html
                    position={[0, size + 0.6, 0]}
                    center
                    distanceFactor={12}
                    style={{ pointerEvents: 'none' }}
                >
                    <div style={{
                        background: 'rgba(10, 10, 15, 0.9)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(0, 212, 255, 0.4)',
                        borderRadius: '10px',
                        padding: '8px 16px',
                        fontFamily: "'JetBrains Mono', monospace",
                        whiteSpace: 'nowrap',
                        textAlign: 'center',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
                    }}>
                        <div style={{
                            color: '#00d4ff',
                            fontWeight: 600,
                            fontSize: '13px',
                            marginBottom: '2px',
                        }}>
                            {name}
                        </div>
                        <div style={{
                            color: '#8b8b9e',
                            fontSize: '10px',
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                        }}>
                            {section}
                        </div>
                    </div>
                </Html>
            )}
        </group>
    )
}
