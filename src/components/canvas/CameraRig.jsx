/**
 * CameraRig.jsx — Scroll-Driven Camera Controller
 * 
 * Moves the camera position based on scroll progress,
 * creating a journey-like navigation through the 3D space.
 * Also tracks mouse for subtle parallax depth.
 */

import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'

export default function CameraRig({ scrollProgress }) {
    const { camera } = useThree()
    const mousePos = useRef({ x: 0, y: 0 })

    useFrame(({ pointer }) => {
        // Smooth mouse tracking
        mousePos.current.x += (pointer.x * 0.3 - mousePos.current.x) * 0.05
        mousePos.current.y += (pointer.y * 0.15 - mousePos.current.y) * 0.05

        // Camera path: gentle arc through the scene based on scroll
        const scrollY = scrollProgress * -3  // Move camera down as user scrolls
        const scrollZ = 8 + scrollProgress * -2 // Slight zoom as user scrolls

        // Apply with mouse parallax offset
        camera.position.x += (mousePos.current.x - camera.position.x) * 0.05
        camera.position.y += (mousePos.current.y + scrollY - camera.position.y) * 0.05
        camera.position.z += (scrollZ - camera.position.z) * 0.05

        // Look slightly ahead
        camera.lookAt(0, scrollY * 0.3, 0)
    })

    return null
}
