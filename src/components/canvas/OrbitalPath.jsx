/**
 * OrbitalPath.jsx — Faint Visible Orbit Rings
 * 
 * Draws a circular line for each planet's orbit path.
 * Uses LineBasicMaterial with low opacity for elegance.
 * Orbits are in the XZ plane (y=0).
 */

import { useMemo } from 'react'
import * as THREE from 'three'

export default function OrbitalPath({ radius, color = '#ffffff', opacity = 0.08 }) {
    // Generate a circle of points in the XZ plane
    const points = useMemo(() => {
        const segments = 128
        const pts = []
        for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * Math.PI * 2
            pts.push(new THREE.Vector3(
                radius * Math.cos(angle),
                0,
                radius * Math.sin(angle)
            ))
        }
        return pts
    }, [radius])

    const geometry = useMemo(() => {
        return new THREE.BufferGeometry().setFromPoints(points)
    }, [points])

    return (
        <line geometry={geometry}>
            <lineBasicMaterial
                color={color}
                transparent
                opacity={opacity}
                depthWrite={false}
            />
        </line>
    )
}
