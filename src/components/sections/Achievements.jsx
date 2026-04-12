/**
 * Achievements.jsx — Timeline with Motion & Hierarchy
 * 
 * Displays achievements as an animated timeline with
 * glowing accents and scroll-reveal.
 */

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const ACHIEVEMENTS = [
    {
        year: '2024',
        title: "Dean's List — 3 Consecutive Semesters",
        description: 'Recognized for maintaining exceptional academic performance in the Computer Science & Engineering program.',
        icon: '🎓',
        color: '#f59e0b',
    },
    {
        year: '2024',
        title: 'Cisco Network Academy — Triple Certified',
        description: 'Earned three Cisco certifications: Networking Basics, IT Essentials, and Network Support & Security.',
        icon: '🏅',
        color: '#00d4ff',
    },
    {
        year: '2024',
        title: 'Cybersecurity Training Completion',
        description: 'Completed intensive cybersecurity training at Senselearner Technologies with focus on real-world penetration testing.',
        icon: '🛡️',
        color: '#7c3aed',
    },
    {
        year: '2024',
        title: 'VAPT Platform — Production Deployment',
        description: 'Built and deployed a fully functional Vulnerability Assessment & Penetration Testing platform used in live environments.',
        icon: '🚀',
        color: '#10b981',
    },
    {
        year: '2023',
        title: 'First Open Source Contribution',
        description: 'Contributed to open-source security tools and started building public-facing projects on GitHub.',
        icon: '⭐',
        color: '#f59e0b',
    },
]

function TimelineItem({ item, index, isLeft }) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: '-30px' })

    return (
        <motion.div
            ref={ref}
            initial={{ x: isLeft ? -60 : 60, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: index * 0.1 }}
            style={{
                display: 'flex',
                justifyContent: isLeft ? 'flex-end' : 'flex-start',
                width: '100%',
                paddingRight: isLeft ? 'calc(50% + 24px)' : 0,
                paddingLeft: isLeft ? 0 : 'calc(50% + 24px)',
                marginBottom: '2rem',
                position: 'relative',
            }}
        >
            {/* Timeline Dot */}
            <motion.div
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.3, type: 'spring' }}
                style={{
                    position: 'absolute',
                    left: '50%',
                    top: '1.5rem',
                    transform: 'translateX(-50%)',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: item.color,
                    boxShadow: `0 0 20px ${item.color}60`,
                    zIndex: 3,
                }}
            />

            {/* Card */}
            <div
                className="section-card"
                data-hover
                style={{
                    padding: '1.5rem',
                    maxWidth: '420px',
                    width: '100%',
                    position: 'relative',
                }}
            >
                {/* Year Tag */}
                <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: item.color,
                    letterSpacing: '0.08em',
                }}>
                    {item.icon} {item.year}
                </span>

                <h3 style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 700,
                    fontSize: '1.05rem',
                    marginTop: '0.5rem',
                    marginBottom: '0.5rem',
                    lineHeight: 1.3,
                }}>
                    {item.title}
                </h3>

                <p style={{
                    color: 'var(--color-text-secondary)',
                    fontSize: '0.88rem',
                    lineHeight: 1.7,
                }}>
                    {item.description}
                </p>
            </div>
        </motion.div>
    )
}

function MobileTimelineItem({ item, index }) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: '-30px' })

    return (
        <motion.div
            ref={ref}
            initial={{ y: 40, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            style={{
                display: 'flex',
                gap: '1rem',
                marginBottom: '1.5rem',
            }}
        >
            {/* Vertical line + dot */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: item.color,
                    boxShadow: `0 0 15px ${item.color}60`,
                    flexShrink: 0,
                    marginTop: '6px',
                }} />
                <div style={{
                    width: '2px',
                    flex: 1,
                    background: 'var(--color-border)',
                    marginTop: '4px',
                }} />
            </div>

            {/* Card */}
            <div
                className="section-card"
                style={{ padding: '1.25rem', flex: 1 }}
            >
                <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    color: item.color,
                }}>
                    {item.icon} {item.year}
                </span>
                <h3 style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    margin: '0.4rem 0',
                    lineHeight: 1.3,
                }}>
                    {item.title}
                </h3>
                <p style={{
                    color: 'var(--color-text-secondary)',
                    fontSize: '0.85rem',
                    lineHeight: 1.6,
                }}>
                    {item.description}
                </p>
            </div>
        </motion.div>
    )
}

export default function Achievements() {
    const headerRef = useRef(null)
    const isHeaderInView = useInView(headerRef, { once: true, margin: '-50px' })

    return (
        <section id="achievements" className="section-wrapper">
            <motion.div
                ref={headerRef}
                initial={{ y: 40, opacity: 0 }}
                animate={isHeaderInView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.7 }}
            >
                <div className="accent-line" />
                <h2 className="section-title">Achievements</h2>
                <p className="section-subtitle" style={{ marginBottom: '2.5rem' }}>
                    Milestones that mark my journey in tech and security.
                </p>
            </motion.div>

            {/* Desktop Timeline (alternating sides) */}
            <div className="hidden md:block" style={{ position: 'relative' }}>
                {/* Vertical line */}
                <div style={{
                    position: 'absolute',
                    left: '50%',
                    top: 0,
                    bottom: 0,
                    width: '2px',
                    background: 'var(--color-border)',
                    transform: 'translateX(-50%)',
                    zIndex: 1,
                }} />

                {ACHIEVEMENTS.map((item, i) => (
                    <TimelineItem key={item.title} item={item} index={i} isLeft={i % 2 === 0} />
                ))}
            </div>

            {/* Mobile Timeline */}
            <div className="block md:hidden">
                {ACHIEVEMENTS.map((item, i) => (
                    <MobileTimelineItem key={item.title} item={item} index={i} />
                ))}
            </div>
        </section>
    )
}
