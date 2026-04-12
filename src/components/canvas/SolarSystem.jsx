/**
 * SolarSystem.jsx — The Grand Orchestrator
 * 
 * Manages all 8 planets, the Sun, starfield, orbital paths,
 * and coordinates planet interactions with camera animation.
 * 
 * Planet Data (Art-Directed, not 1:1 real scale):
 * - Distances scaled to fit ~30 unit radius viewport
 * - Sizes exaggerated for visibility
 * - Orbital speeds loosely proportional to real ratios
 * - Each planet maps to a portfolio section
 */

import { useState, useCallback, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import Sun from './Sun'
import Planet from './Planet'
import SaturnRings from './SaturnRings'
import Starfield from './Starfield'
import OrbitalPath from './OrbitalPath'
import CameraController from './CameraController'
import Rocket from './Rocket'

// ---- Planet Configuration ----
const PLANETS = [
    {
        name: 'Mercury',
        section: 'Skills',
        sectionId: 'skills',
        orbitRadius: 4.5,
        size: 0.18,
        orbitSpeed: 2.4,
        rotationSpeed: 0.004,
        axialTilt: 0.03,
        phase: 0.8,
        colors: ['#8c7e6d', '#6b5e50', '#a09080'],
        noiseScale: 5.0,
        bandStretch: 1.0,
        bumpStrength: 0.015,
        roughness: 0.95,
    },
    {
        name: 'Venus',
        section: 'About',
        sectionId: 'about',
        orbitRadius: 6.5,
        size: 0.32,
        orbitSpeed: 1.2,
        rotationSpeed: -0.001,
        axialTilt: 3.1,
        phase: 2.1,
        colors: ['#c4994a', '#d4a855', '#e8c06a'],
        noiseScale: 2.5,
        bandStretch: 1.3,
        bumpStrength: 0.005,
        roughness: 0.5,
        hasAtmosphere: true,
        atmosphereColor: '#e8b84a',
        atmospherePower: 4.0,
    },
    {
        name: 'Earth',
        section: 'Home',
        sectionId: 'hero',
        orbitRadius: 8.5,
        size: 0.35,
        orbitSpeed: 0.8,
        rotationSpeed: 0.008,
        axialTilt: 0.41,
        phase: 4.2,
        colors: ['#2d5f8a', '#3a7a44', '#e8dccc'],
        noiseScale: 3.5,
        bandStretch: 1.0,
        bumpStrength: 0.025,
        roughness: 0.6,
        hasAtmosphere: true,
        atmosphereColor: '#6fa8dc',
        atmospherePower: 3.0,
        hasClouds: true,
    },
    {
        name: 'Mars',
        section: 'Projects',
        sectionId: 'projects',
        orbitRadius: 11.0,
        size: 0.22,
        orbitSpeed: 0.5,
        rotationSpeed: 0.007,
        axialTilt: 0.44,
        phase: 1.5,
        colors: ['#c1440e', '#8b3a0e', '#d4a07a'],
        noiseScale: 4.0,
        bandStretch: 1.0,
        bumpStrength: 0.03,
        roughness: 0.9,
        hasAtmosphere: true,
        atmosphereColor: '#c47a50',
        atmospherePower: 5.0,
    },
    {
        name: 'Jupiter',
        section: 'Achievements',
        sectionId: 'achievements',
        orbitRadius: 15.0,
        size: 1.1,
        orbitSpeed: 0.15,
        rotationSpeed: 0.02,
        axialTilt: 0.05,
        phase: 3.7,
        colors: ['#c4a882', '#8b6e4e', '#d4c0a0'],
        noiseScale: 2.0,
        bandStretch: 4.0,
        bumpStrength: 0.008,
        roughness: 0.4,
        hasAtmosphere: true,
        atmosphereColor: '#c4a882',
        atmospherePower: 6.0,
    },
    {
        name: 'Saturn',
        section: 'Certifications',
        sectionId: 'certifications',
        orbitRadius: 19.5,
        size: 0.9,
        orbitSpeed: 0.08,
        rotationSpeed: 0.018,
        axialTilt: 0.47,
        phase: 5.1,
        colors: ['#e8d5a3', '#c4a86a', '#f0e0b8'],
        noiseScale: 2.0,
        bandStretch: 3.5,
        bumpStrength: 0.005,
        roughness: 0.35,
        hasRings: true,
    },
    {
        name: 'Uranus',
        section: 'Skills',
        sectionId: 'skills',
        orbitRadius: 24.0,
        size: 0.5,
        orbitSpeed: 0.04,
        rotationSpeed: -0.012,
        axialTilt: 1.71,
        phase: 0.3,
        colors: ['#73c2d4', '#5aa8b8', '#a0dce8'],
        noiseScale: 1.5,
        bandStretch: 1.5,
        bumpStrength: 0.003,
        roughness: 0.3,
        hasAtmosphere: true,
        atmosphereColor: '#73c2d4',
        atmospherePower: 4.5,
    },
    {
        name: 'Neptune',
        section: 'Contact',
        sectionId: 'contact',
        orbitRadius: 28.0,
        size: 0.48,
        orbitSpeed: 0.02,
        rotationSpeed: 0.011,
        axialTilt: 0.49,
        phase: 2.8,
        colors: ['#3d5fc4', '#2a4a9e', '#5580e0'],
        noiseScale: 2.0,
        bandStretch: 2.0,
        bumpStrength: 0.004,
        roughness: 0.35,
        hasAtmosphere: true,
        atmosphereColor: '#5580e0',
        atmospherePower: 4.0,
    },
]

/**
 * SaturnRingsSync — Keeps rings orbital-synced with Saturn
 * Uses the same orbital math as the Planet component
 */
function SaturnRingsSync() {
    const groupRef = useRef()
    const saturnData = PLANETS.find(p => p.name === 'Saturn')

    useFrame(({ clock }) => {
        if (!groupRef.current || !saturnData) return
        const t = clock.getElapsedTime()
        const angle = t * saturnData.orbitSpeed + saturnData.phase
        const x = saturnData.orbitRadius * Math.cos(angle)
        const z = saturnData.orbitRadius * Math.sin(angle)
        groupRef.current.position.set(x, 0, z)
    })

    return (
        <group ref={groupRef}>
            <SaturnRings
                innerRadius={saturnData.size * 1.5}
                outerRadius={saturnData.size * 2.8}
                tilt={saturnData.axialTilt}
            />
        </group>
    )
}

export default function SolarSystem({ isDayMode, scrollProgress, onNavigate }) {
    const [targetPlanet, setTargetPlanet] = useState(null)
    const [activePlanet, setActivePlanet] = useState(null)

    const handlePlanetClick = useCallback((name, section, position) => {
        setActivePlanet(name)
        setTargetPlanet({ name, position })

        setTimeout(() => {
            if (onNavigate) {
                const planet = PLANETS.find(p => p.name === name)
                if (planet) onNavigate(planet.sectionId)
            }
        }, 800)
    }, [onNavigate])

    const handleCameraArrived = useCallback(() => {
        setTimeout(() => setActivePlanet(null), 5000)
    }, [])

    return (
        <>
            <CameraController
                targetPlanet={targetPlanet}
                onCameraArrived={handleCameraArrived}
                scrollProgress={scrollProgress}
                isDayMode={isDayMode}
            />

            <ambientLight intensity={isDayMode ? 0.15 : 0.03} />

            <Sun isDayMode={isDayMode} />

            {PLANETS.map(planet => (
                <OrbitalPath
                    key={`orbit-${planet.name}`}
                    radius={planet.orbitRadius}
                    opacity={isDayMode ? 0.04 : 0.08}
                    color={isDayMode ? '#886622' : '#ffffff'}
                />
            ))}

            {PLANETS.map(planet => (
                <Planet
                    key={planet.name}
                    {...planet}
                    isDayMode={isDayMode}
                    onPlanetClick={handlePlanetClick}
                    activePlanet={activePlanet}
                />
            ))}

            <SaturnRingsSync />

            {/* 3D Rocket traversing the solar system */}
            <Rocket />

            <Starfield count={4000} isDayMode={isDayMode} />
        </>
    )
}
