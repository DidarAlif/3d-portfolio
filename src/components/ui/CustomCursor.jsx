/**
 * CustomCursor.jsx — Modern 3D Glassmorphic Cursor
 * 
 * A premium glass-effect cursor with:
 * - Outer glass ring with backdrop blur + refraction look
 * - Inner glowing dot
 * - Smooth eased following
 * - Scale-up on interactive element hover
 * - Broadcasts mouse position for 3D parallax
 */

import { useEffect, useRef } from 'react'

export default function CustomCursor() {
    const ringRef = useRef(null)
    const dotRef = useRef(null)
    const pos = useRef({ x: -100, y: -100 })
    const target = useRef({ x: -100, y: -100 })

    useEffect(() => {
        if ('ontouchstart' in window) return

        const handleMouseMove = (e) => {
            target.current.x = e.clientX
            target.current.y = e.clientY

            // Broadcast for 3D parallax
            window.__mouseX = (e.clientX / window.innerWidth) * 2 - 1
            window.__mouseY = (e.clientY / window.innerHeight) * 2 - 1
        }

        const handleHoverStart = () => {
            ringRef.current?.classList.add('hovering')
        }
        const handleHoverEnd = () => {
            ringRef.current?.classList.remove('hovering')
        }

        let rafId
        function animate() {
            // Outer ring follows with smooth lag
            pos.current.x += (target.current.x - pos.current.x) * 0.13
            pos.current.y += (target.current.y - pos.current.y) * 0.13

            if (ringRef.current) {
                ringRef.current.style.transform =
                    `translate(${pos.current.x}px, ${pos.current.y}px) translate(-50%, -50%)`
            }
            // Inner dot follows instantly
            if (dotRef.current) {
                dotRef.current.style.transform =
                    `translate(${target.current.x}px, ${target.current.y}px) translate(-50%, -50%)`
            }
            rafId = requestAnimationFrame(animate)
        }
        rafId = requestAnimationFrame(animate)

        window.addEventListener('mousemove', handleMouseMove)

        // Add hover listeners
        const addListeners = () => {
            document.querySelectorAll(
                'a, button, .tilt-card, .project-card, .skill-orb, .theme-toggle, [data-hover]'
            ).forEach(el => {
                el.addEventListener('mouseenter', handleHoverStart)
                el.addEventListener('mouseleave', handleHoverEnd)
            })
        }
        addListeners()
        const observer = new MutationObserver(addListeners)
        observer.observe(document.body, { childList: true, subtree: true })

        return () => {
            cancelAnimationFrame(rafId)
            window.removeEventListener('mousemove', handleMouseMove)
            observer.disconnect()
        }
    }, [])

    return (
        <>
            {/* Outer glass ring */}
            <div ref={ringRef} className="glass-cursor" />
            {/* Inner glowing dot */}
            <div ref={dotRef} className="glass-cursor-dot" />
        </>
    )
}
