/**
 * Navbar.jsx — Premium Glassmorphic Navigation
 * 
 * Features:
 * - Auto-hide on scroll down, show on scroll up
 * - Glassmorphic background with blur
 * - Active section highlighting
 * - Day/Night theme toggle
 * - Mobile hamburger menu
 * - Smooth section scroll navigation
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_ITEMS = [
    { id: 'hero', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'certifications', label: 'Certifications' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'achievements', label: 'Achievements' },
    { id: 'contact', label: 'Contact' },
]

export default function Navbar({ isDayMode, toggleTheme, scrollToSection }) {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isHidden, setIsHidden] = useState(false)
    const [activeSection, setActiveSection] = useState('hero')
    const [isMobileOpen, setIsMobileOpen] = useState(false)
    const lastScrollY = useRef(0)

    // Scroll behavior: hide on down, show on up
    useEffect(() => {
        const handleScroll = () => {
            const y = window.scrollY
            setIsScrolled(y > 50)
            setIsHidden(y > lastScrollY.current && y > 200)
            lastScrollY.current = y

            // Detect active section
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
            <nav
                className={`navbar ${isScrolled ? 'scrolled' : ''} ${isHidden ? 'hidden' : ''}`}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                {/* Logo */}
                <motion.div
                    className="cursor-pointer"
                    onClick={() => handleNavClick('hero')}
                    whileHover={{ scale: 1.05 }}
                    style={{
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 700,
                        fontSize: '1.3rem',
                        letterSpacing: '-0.02em',
                        color: isDayMode ? 'var(--day-text)' : 'var(--color-text-primary)',
                    }}
                >
                    <span style={{ color: 'var(--color-accent-cyan)' }}>&lt;</span>
                    Didar
                    <span style={{ color: 'var(--color-accent-cyan)' }}> /&gt;</span>
                </motion.div>

                {/* Desktop Nav Links */}
                <div className="hidden md:flex items-center gap-1" style={{ fontFamily: 'var(--font-body)' }}>
                    {NAV_ITEMS.slice(1).map((item) => (
                        <motion.button
                            key={item.id}
                            onClick={() => handleNavClick(item.id)}
                            whileHover={{ y: -2 }}
                            style={{
                                padding: '0.5rem 1rem',
                                background: 'none',
                                border: 'none',
                                cursor: 'none',
                                fontFamily: 'var(--font-body)',
                                fontSize: '0.85rem',
                                fontWeight: activeSection === item.id ? 600 : 400,
                                color: activeSection === item.id
                                    ? 'var(--color-accent-cyan)'
                                    : isDayMode ? 'var(--day-text-secondary)' : 'var(--color-text-secondary)',
                                borderRadius: '8px',
                                position: 'relative',
                                letterSpacing: '0.01em',
                                transition: 'color 0.3s ease',
                            }}
                        >
                            {item.label}
                            {activeSection === item.id && (
                                <motion.div
                                    layoutId="nav-indicator"
                                    style={{
                                        position: 'absolute',
                                        bottom: '2px',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        width: '20px',
                                        height: '2px',
                                        background: 'var(--color-accent-cyan)',
                                        borderRadius: '2px',
                                    }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                />
                            )}
                        </motion.button>
                    ))}

                    {/* Theme Toggle (Hidden per user request, defaulting to Night mode)
                    <button
                        className="theme-toggle ml-2"
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                    >
                        {isDayMode ? '🌙' : '☀️'}
                    </button>
                    */}
                </div>

                {/* Mobile Menu Button */}
                <div className="flex md:hidden items-center gap-2">
                    {/* 
                    <button
                        className="theme-toggle"
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                        style={{ width: '36px', height: '36px', fontSize: '1rem' }}
                    >
                        {isDayMode ? '🌙' : '☀️'}
                    </button>
                    */}
                    <button
                        onClick={() => setIsMobileOpen(!isMobileOpen)}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '0.5rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '5px',
                        }}
                        aria-label="Toggle menu"
                    >
                        <motion.span
                            animate={isMobileOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                            style={{ width: '24px', height: '2px', background: isDayMode ? 'var(--day-text)' : 'var(--color-text-primary)', display: 'block', borderRadius: '2px' }}
                        />
                        <motion.span
                            animate={isMobileOpen ? { opacity: 0 } : { opacity: 1 }}
                            style={{ width: '24px', height: '2px', background: isDayMode ? 'var(--day-text)' : 'var(--color-text-primary)', display: 'block', borderRadius: '2px' }}
                        />
                        <motion.span
                            animate={isMobileOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                            style={{ width: '24px', height: '2px', background: isDayMode ? 'var(--day-text)' : 'var(--color-text-primary)', display: 'block', borderRadius: '2px' }}
                        />
                    </button>
                </div>
            </nav>

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
                            background: 'rgba(10, 10, 15, 0.95)',
                            backdropFilter: 'blur(20px)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '1.5rem',
                        }}
                    >
                        {NAV_ITEMS.map((item, i) => (
                            <motion.button
                                key={item.id}
                                initial={{ x: -50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: 50, opacity: 0 }}
                                transition={{ delay: i * 0.05 }}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleNavClick(item.id)
                                }}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontFamily: 'var(--font-heading)',
                                    fontSize: '1.8rem',
                                    fontWeight: activeSection === item.id ? 700 : 400,
                                    color: activeSection === item.id ? 'var(--color-accent-cyan)' : '#e8e8ed',
                                    letterSpacing: '-0.01em',
                                }}
                            >
                                {item.label}
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
