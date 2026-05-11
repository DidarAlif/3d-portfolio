/**
 * Hero.jsx — Immersive 3D Hero Section
 * 
 * Full-viewport intro with:
 * - Typing animation cycling through roles
 * - Glowing profile image with orbiting dots
 * - Social links
 * - Scroll-down indicator
 * - CTA buttons
 */

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const ROLES = [
    'VAPT Professional',
    'Cybersecurity Specialist',
    'Penetration Tester',
    'Full-Stack Developer',
    'Network Engineer',
]

const SOCIAL_LINKS = [
    {
        label: 'GitHub',
        url: 'https://github.com/DidarAlif',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
        ),
    },
    {
        label: 'LinkedIn',
        url: 'https://linkedin.com/in/didarul-alam-alif',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
        ),
    },
    {
        label: 'Email',
        url: 'mailto:didarulalamalif@gmail.com',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
        ),
    },
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
                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.85rem',
                            color: 'var(--color-accent-emerald)',
                            marginBottom: '0.5rem',
                            letterSpacing: '0.1em',
                        }}
                    >
                        Hi, I'm
                    </motion.p>

                    <motion.h1
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.7 }}
                        data-hover
                        style={{
                            fontFamily: 'var(--font-heading)',
                            fontWeight: 900,
                            fontSize: 'clamp(2.5rem, 5.5vw, 5rem)',
                            letterSpacing: '-0.04em',
                            lineHeight: 1.1,
                            marginBottom: '0.5rem',
                        }}
                    >
                        Didarul Alam Alif
                    </motion.h1>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.7, delay: 0.9 }}
                        style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: 'clamp(0.9rem, 1.8vw, 1.2rem)',
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
                            fontSize: 'clamp(0.9rem, 1.4vw, 1.1rem)',
                            maxWidth: '520px',
                            marginBottom: '1.5rem',
                            lineHeight: 1.7,
                        }}
                    >
                        Offensive security–driven VAPT professional building secure 
                        digital experiences. Specialized in web application & network 
                        penetration testing, OWASP Top 10, and full-stack development.
                    </motion.p>

                    {/* Social Links */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.7, delay: 1.2 }}
                        style={{
                            display: 'flex',
                            gap: '0.75rem',
                            marginBottom: '2rem',
                        }}
                    >
                        {SOCIAL_LINKS.map((link) => (
                            <a
                                key={link.label}
                                href={link.url}
                                target={link.url.startsWith('mailto') ? undefined : '_blank'}
                                rel="noopener noreferrer"
                                data-hover
                                aria-label={link.label}
                                style={{
                                    width: '42px',
                                    height: '42px',
                                    borderRadius: '12px',
                                    border: '1px solid var(--color-border)',
                                    background: 'var(--color-bg-glass)',
                                    backdropFilter: 'blur(8px)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--color-text-secondary)',
                                    textDecoration: 'none',
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--color-accent-cyan)'
                                    e.currentTarget.style.color = 'var(--color-accent-cyan)'
                                    e.currentTarget.style.transform = 'translateY(-3px)'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--color-border)'
                                    e.currentTarget.style.color = 'var(--color-text-secondary)'
                                    e.currentTarget.style.transform = 'translateY(0)'
                                }}
                            >
                                {link.icon}
                            </a>
                        ))}
                    </motion.div>

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
                <div style={{ flex: '1 1 280px', display: 'flex', justifyContent: 'center' }}>
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
                                src="./assets/3.jpeg"
                                alt="Md Didarul Alam Alif"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    borderRadius: '50%',
                                }}
                            />
                        </div>

                        {/* Orbiting dots */}
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
