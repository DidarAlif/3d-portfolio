/**
 * Navbar.jsx — Dynamic Island Navigation
 *
 * Apple-inspired floating pill navbar:
 * - Centered, compact, always visible
 * - Glassmorphic capsule with glow effect
 * - Active section dot indicator
 * - Expands slightly on hover
 * - Mobile: hamburger opens full overlay
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_ITEMS = [
    { id: 'hero', label: 'Home', icon: '⌂' },
    { id: 'about', label: 'About', icon: '◉' },
    { id: 'experience', label: 'Experience', icon: '◆' },
    { id: 'certifications', label: 'Certs', icon: '◈' },
    { id: 'projects', label: 'Projects', icon: '◧' },
    { id: 'skills', label: 'Skills', icon: '⬡' },
    { id: 'achievements', label: 'Awards', icon: '★' },
    { id: 'contact', label: 'Contact', icon: '✉' },
]

export default function Navbar({ isDayMode, toggleTheme, scrollToSection }) {
    const [activeSection, setActiveSection] = useState('hero')
    const [isMobileOpen, setIsMobileOpen] = useState(false)
    const [isHovered, setIsHovered] = useState(false)

    // Detect active section
    useEffect(() => {
        const handleScroll = () => {
            for (const item of [...NAV_ITEMS].reverse()) {
                const el = document.getElementById(item.id)
                if (el && el.getBoundingClientRect().top < window.innerHeight * 0.4) {
                    setActiveSection(item.id)
                    break
                }
            }
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleNavClick = useCallback((id) => {
        scrollToSection(id)
        setIsMobileOpen(false)
    }, [scrollToSection])

    return (
        <>
            {/* ---- Dynamic Island Navbar ---- */}
            <motion.nav
                className="dynamic-island"
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 2.5, duration: 0.8, type: 'spring', damping: 20 }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                    position: 'fixed',
                    top: '14px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    padding: '0.4rem 0.6rem',
                    borderRadius: '50px',
                    background: isDayMode
                        ? 'rgba(245, 240, 235, 0.75)'
                        : 'rgba(10, 10, 15, 0.65)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    border: `1px solid ${isDayMode
                        ? 'rgba(0, 0, 0, 0.08)'
                        : 'rgba(255, 255, 255, 0.08)'}`,
                    boxShadow: isDayMode
                        ? '0 4px 30px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)'
                        : '0 4px 30px rgba(0,0,0,0.3), 0 0 60px rgba(0, 212, 255, 0.03)',
                    transition: 'background 0.4s, border-color 0.4s, box-shadow 0.4s',
                    pointerEvents: 'auto',
                }}
            >
                {/* Desktop Nav Links */}
                <div className="hidden md:flex items-center gap-0.5">
                    {NAV_ITEMS.map((item) => {
                        const isActive = activeSection === item.id
                        return (
                            <motion.button
                                key={item.id}
                                onClick={() => handleNavClick(item.id)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                data-hover
                                style={{
                                    padding: '0.4rem 0.7rem',
                                    background: isActive
                                        ? 'rgba(0, 212, 255, 0.12)'
                                        : 'transparent',
                                    border: 'none',
                                    borderRadius: '20px',
                                    cursor: 'none',
                                    fontFamily: 'var(--font-body)',
                                    fontSize: '0.78rem',
                                    fontWeight: isActive ? 600 : 400,
                                    color: isActive
                                        ? 'var(--color-accent-cyan)'
                                        : isDayMode ? 'var(--day-text-secondary)' : 'var(--color-text-secondary)',
                                    position: 'relative',
                                    letterSpacing: '0.01em',
                                    transition: 'all 0.3s ease',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {item.label}
                                {isActive && (
                                    <motion.div
                                        layoutId="island-dot"
                                        style={{
                                            position: 'absolute',
                                            bottom: '2px',
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            width: '4px',
                                            height: '4px',
                                            borderRadius: '50%',
                                            background: 'var(--color-accent-cyan)',
                                            boxShadow: '0 0 8px var(--color-accent-cyan)',
                                        }}
                                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                    />
                                )}
                            </motion.button>
                        )
                    })}

                    {/* Divider */}
                    <div style={{
                        width: '1px',
                        height: '20px',
                        background: isDayMode ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)',
                        margin: '0 0.25rem',
                    }} />

                    {/* Theme toggle */}
                    <motion.button
                        className="theme-toggle"
                        onClick={toggleTheme}
                        whileHover={{ scale: 1.15, rotate: 15 }}
                        whileTap={{ scale: 0.9 }}
                        aria-label="Toggle theme"
                        style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            border: 'none',
                            background: isDayMode
                                ? 'rgba(217, 119, 6, 0.1)'
                                : 'rgba(0, 212, 255, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.9rem',
                            cursor: 'none',
                            transition: 'background 0.3s',
                        }}
                    >
                        {isDayMode ? '🌙' : '☀️'}
                    </motion.button>
                </div>

                {/* Mobile: compact bar */}
                <div className="flex md:hidden items-center gap-2">
                    {/* Active section label */}
                    <span style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: 'var(--color-accent-cyan)',
                        padding: '0 0.5rem',
                        minWidth: '60px',
                        textAlign: 'center',
                    }}>
                        {NAV_ITEMS.find(i => i.id === activeSection)?.label || 'Home'}
                    </span>

                    {/* Theme toggle */}
                    <button
                        className="theme-toggle"
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                        style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            border: 'none',
                            background: 'transparent',
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {isDayMode ? '🌙' : '☀️'}
                    </button>

                    {/* Hamburger */}
                    <button
                        onClick={() => setIsMobileOpen(!isMobileOpen)}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '0.35rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                        }}
                        aria-label="Toggle menu"
                    >
                        <motion.span
                            animate={isMobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                            style={{ width: '18px', height: '2px', background: isDayMode ? 'var(--day-text)' : 'var(--color-text-primary)', display: 'block', borderRadius: '2px' }}
                        />
                        <motion.span
                            animate={isMobileOpen ? { opacity: 0 } : { opacity: 1 }}
                            style={{ width: '18px', height: '2px', background: isDayMode ? 'var(--day-text)' : 'var(--color-text-primary)', display: 'block', borderRadius: '2px' }}
                        />
                        <motion.span
                            animate={isMobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                            style={{ width: '18px', height: '2px', background: isDayMode ? 'var(--day-text)' : 'var(--color-text-primary)', display: 'block', borderRadius: '2px' }}
                        />
                    </button>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileOpen(false)}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            zIndex: 999,
                            background: isDayMode
                                ? 'rgba(245, 240, 235, 0.97)'
                                : 'rgba(10, 10, 15, 0.97)',
                            backdropFilter: 'blur(30px)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '1.25rem',
                        }}
                    >
                        {NAV_ITEMS.map((item, i) => (
                            <motion.button
                                key={item.id}
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -20, opacity: 0 }}
                                transition={{ delay: i * 0.04 }}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleNavClick(item.id)
                                }}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontFamily: 'var(--font-heading)',
                                    fontSize: '1.6rem',
                                    fontWeight: activeSection === item.id ? 700 : 400,
                                    color: activeSection === item.id
                                        ? 'var(--color-accent-cyan)'
                                        : isDayMode ? 'var(--day-text)' : '#e8e8ed',
                                    letterSpacing: '-0.01em',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                }}
                            >
                                <span style={{ fontSize: '1rem', opacity: 0.6 }}>{item.icon}</span>
                                {item.label}
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
