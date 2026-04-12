/**
 * Hero.jsx — Immersive 3D Hero Section
 * 
 * Full-viewport intro with:
 * - Typing animation cycling through roles
 * - Glowing profile image with orbiting dots
 * - Scroll-down indicator
 * - CTA buttons
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'

const ROLES = [
    'Cybersecurity Specialist',
    'Full-Stack Developer',
    'Security Researcher',
    'Network Engineer',
    'Creative Technologist',
]

export default function Hero({ scrollToSection }) {
    const [roleIndex, setRoleIndex] = useState(0)
    const [text, setText] = useState('')
    const [isDeleting, setIsDeleting] = useState(false)

    // Typing effect
    useEffect(() => {
        const current = ROLES[roleIndex]
        let timeout

        if (!isDeleting) {
            if (text.length < current.length) {
                timeout = setTimeout(() => setText(current.slice(0, text.length + 1)), 80)
            } else {
                timeout = setTimeout(() => setIsDeleting(true), 2000)
            }
        } else {
            if (text.length > 0) {
                timeout = setTimeout(() => setText(text.slice(0, -1)), 40)
            } else {
                setIsDeleting(false)
                setRoleIndex((prev) => (prev + 1) % ROLES.length)
            }
        }

        return () => clearTimeout(timeout)
    }, [text, isDeleting, roleIndex])

    return (
        <section
            id="hero"
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                padding: '2rem',
            }}
        >
            <div style={{ 
                display: 'flex', 
                flexDirection: 'row', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                maxWidth: '1100px', 
                width: '100%',
                gap: '4rem',
                flexWrap: 'wrap-reverse' // Ensure image stacks on top on mobile
            }}>
                {/* Left side: Text Content */}
                <div style={{ flex: '1 1 500px', textAlign: 'left' }}>
                    <motion.h1
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.7 }}
                        data-hover
                        style={{
                            fontFamily: 'var(--font-heading)',
                            fontWeight: 900,
                            fontSize: 'clamp(3rem, 6vw, 5.5rem)',
                            letterSpacing: '-0.04em',
                            lineHeight: 1.1,
                            marginBottom: '1rem',
                        }}
                    >
                        Didar
                    </motion.h1>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.7, delay: 0.9 }}
                        style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                            color: 'var(--color-accent-cyan)',
                            marginBottom: '1.5rem',
                            height: '1.5em',
                        }}
                    >
                        {text}
                        <span
                            style={{
                                display: 'inline-block',
                                width: '2px',
                                height: '1.2em',
                                background: 'var(--color-accent-cyan)',
                                marginLeft: '4px',
                                verticalAlign: 'text-bottom',
                                animation: 'blink 1s step-end infinite',
                            }}
                        />
                        <style>{`@keyframes blink { 50% { opacity: 0; } }`}</style>
                    </motion.div>

                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.7, delay: 1.1 }}
                        style={{
                            color: 'var(--color-text-secondary)',
                            fontSize: 'clamp(1rem, 1.5vw, 1.15rem)',
                            maxWidth: '500px',
                            marginBottom: '2.5rem',
                            lineHeight: 1.7,
                        }}
                    >
                        Building secure digital experiences at the intersection
                        of cybersecurity and creative development.
                    </motion.p>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.7, delay: 1.3 }}
                        style={{
                            display: 'flex',
                            gap: '1rem',
                            flexWrap: 'wrap',
                        }}
                    >
                        <button
                            className="btn-primary"
                            onClick={() => scrollToSection('projects')}
                        >
                            View Projects ↗
                        </button>
                        <button
                            className="btn-outline"
                            onClick={() => scrollToSection('contact')}
                        >
                            Hire Me
                        </button>
                    </motion.div>
                </div>

                {/* Right side: Orbital Profile Image */}
                <div style={{ flex: '1 1 300px', display: 'flex', justifyContent: 'center' }}>
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.5, type: 'spring' }}
                        style={{
                            position: 'relative',
                            width: '240px',
                            height: '240px',
                        }}
                    >
                        <div
                            style={{
                                width: '240px',
                                height: '240px',
                                borderRadius: '50%',
                                overflow: 'hidden',
                                border: '3px solid rgba(0, 212, 255, 0.3)',
                                padding: '6px',
                            }}
                            className="animate-glow"
                        >
                            <img
                                src="/assets/alif.jpg"
                                alt="Didar"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    borderRadius: '50%',
                                }}
                            />
                        </div>

                        {/* Orbiting dots updated for new size scale */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                            style={{ position: 'absolute', inset: '-15px' }}
                        >
                            <div style={{
                                width: '10px', height: '10px', borderRadius: '50%',
                                background: 'var(--color-accent-cyan)', position: 'absolute',
                                top: '0', left: '50%', transform: 'translateX(-50%)',
                                boxShadow: '0 0 15px var(--color-accent-cyan)',
                            }} />
                        </motion.div>

                        <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                            style={{ position: 'absolute', inset: '-25px' }}
                        >
                            <div style={{
                                width: '8px', height: '8px', borderRadius: '50%',
                                background: 'var(--color-accent-purple)', position: 'absolute',
                                bottom: '0', left: '50%', transform: 'translateX(-50%)',
                                boxShadow: '0 0 12px var(--color-accent-purple)',
                            }} />
                        </motion.div>

                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                            style={{ position: 'absolute', inset: '-35px' }}
                        >
                            <div style={{
                                width: '6px', height: '6px', borderRadius: '50%',
                                background: 'var(--color-accent-emerald)', position: 'absolute',
                                top: '50%', right: '0', transform: 'translateY(-50%)',
                                boxShadow: '0 0 10px var(--color-accent-emerald)',
                            }} />
                        </motion.div>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2 }}
                    onClick={() => scrollToSection('about')}
                    style={{
                        position: 'absolute',
                        bottom: '2rem',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        cursor: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.5rem',
                        width: '100%',
                    }}
                    data-hover
                >
                    <span style={{
                        fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
                        color: 'var(--color-text-muted)', letterSpacing: '0.15em', textTransform: 'uppercase',
                    }}>
                        Scroll
                    </span>
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        style={{
                            width: '20px', height: '32px', borderRadius: '10px',
                            border: '2px solid var(--color-text-muted)', display: 'flex',
                            justifyContent: 'center', paddingTop: '6px',
                        }}
                    >
                        <motion.div
                            animate={{ opacity: [1, 0], y: [0, 10] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            style={{
                                width: '3px', height: '8px', background: 'var(--color-text-muted)',
                                borderRadius: '2px',
                            }}
                        />
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}
