/**
 * About.jsx — Motion-Driven About Section
 * 
 * Presents personal info through layered storytelling with
 * scroll-reveal animations, education card, and expertise cards.
 */

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const EXPERTISE = [
    {
        icon: '🛡️',
        title: 'Cybersecurity & VAPT',
        description: 'Black-box & gray-box assessments, OWASP Top 10 exploitation, CVSS-based risk analysis, and remediation-focused technical reporting.',
    },
    {
        icon: '💻',
        title: 'Full-Stack Development',
        description: 'Ruby on Rails, Next.js, FastAPI, Vue.js, React, Node.js — building scalable web applications with modern architectures.',
    },
    {
        icon: '🌐',
        title: 'Network Security',
        description: 'Cisco routing & switching, VLANs, OSPF, firewall configuration, network segmentation, and TCP/IP protocol analysis.',
    },
    {
        icon: '🔬',
        title: 'Security Research',
        description: 'Threat intelligence, attack surface mapping, deep reconnaissance, post-exploitation analysis, and vulnerability monitoring.',
    },
]

function ExpertiseCard({ item, index }) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: '-50px' })

    return (
        <motion.div
            ref={ref}
            initial={{ y: 40, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="section-card tilt-card"
            data-hover
            style={{
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
            }}
        >
            <span style={{ fontSize: '2rem' }}>{item.icon}</span>
            <h3 style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                fontSize: '1.15rem',
            }}>
                {item.title}
            </h3>
            <p style={{
                color: 'var(--color-text-secondary)',
                fontSize: '0.9rem',
                lineHeight: 1.7,
            }}>
                {item.description}
            </p>
        </motion.div>
    )
}

export default function About() {
    const headerRef = useRef(null)
    const isHeaderInView = useInView(headerRef, { once: true, margin: '-50px' })

    return (
        <section id="about" className="section-wrapper">
            <motion.div
                ref={headerRef}
                initial={{ y: 40, opacity: 0 }}
                animate={isHeaderInView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.7 }}
            >
                <div className="accent-line" />
                <h2 className="section-title">About <span style={{ color: 'var(--color-accent-cyan)' }}>Me</span></h2>
                <p className="section-subtitle" style={{ marginBottom: '1.5rem' }}>
                    Offensive security professional at the intersection of cybersecurity and creative technology.
                </p>
            </motion.div>

            {/* Bio */}
            <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={isHeaderInView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="glass-panel"
                style={{
                    padding: '2rem',
                    marginBottom: '2rem',
                    maxWidth: '800px',
                }}
            >
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>
                    Offensive security–driven VAPT professional with a strong foundation in web application and network 
                    penetration testing, focused on delivering measurable security improvements for global organizations. 
                    Computer Science & Engineering graduate with hands-on experience conducting black-box and gray-box 
                    assessments, deep reconnaissance, attack surface mapping, vulnerability validation, and post-exploitation 
                    analysis using Nmap, Burp Suite (Pro), OWASP ZAP, Metasploit, Nessus, Acunetix, SqlMap, Wireshark, and Kali Linux.
                </p>
            </motion.div>

            {/* Education Card */}
            <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={isHeaderInView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.7, delay: 0.35 }}
                className="section-card"
                style={{
                    padding: '2rem',
                    marginBottom: '3rem',
                    maxWidth: '800px',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Accent line at top */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: 'linear-gradient(90deg, var(--color-accent-gold), var(--color-accent-purple))',
                }} />

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '14px',
                        background: 'rgba(245, 158, 11, 0.1)',
                        border: '1px solid rgba(245, 158, 11, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        flexShrink: 0,
                    }}>
                        🎓
                    </div>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <h3 style={{
                            fontFamily: 'var(--font-heading)',
                            fontWeight: 700,
                            fontSize: '1.15rem',
                            marginBottom: '0.3rem',
                        }}>
                            B.Sc. in Computer Science & Engineering
                        </h3>
                        <p style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.82rem',
                            color: 'var(--color-accent-cyan)',
                            marginBottom: '0.3rem',
                        }}>
                            CGPA: 3.81 / 4.00
                        </p>
                        <p style={{
                            fontSize: '0.9rem',
                            color: 'var(--color-text-secondary)',
                            marginBottom: '0.75rem',
                        }}>
                            American International University-Bangladesh (AIUB) · Graduated Apr 2025
                        </p>

                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                            {[
                                { label: 'Magna Cum Laude', color: '#f59e0b' },
                                { label: "Dean's List 3×", color: '#00d4ff' },
                                { label: 'Academic Scholarship', color: '#10b981' },
                            ].map((badge) => (
                                <span
                                    key={badge.label}
                                    style={{
                                        padding: '0.25rem 0.7rem',
                                        borderRadius: '8px',
                                        fontFamily: 'var(--font-mono)',
                                        fontSize: '0.72rem',
                                        fontWeight: 600,
                                        background: `${badge.color}15`,
                                        color: badge.color,
                                        border: `1px solid ${badge.color}30`,
                                    }}
                                >
                                    {badge.label}
                                </span>
                            ))}
                        </div>

                        <p style={{
                            fontSize: '0.85rem',
                            color: 'var(--color-text-muted)',
                            marginTop: '0.75rem',
                            fontStyle: 'italic',
                        }}>
                            Thesis: Hybrid Approach Towards Modernizing Efficient Vehicular Networks
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Expertise Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1.25rem',
            }}>
                {EXPERTISE.map((item, i) => (
                    <ExpertiseCard key={item.title} item={item} index={i} />
                ))}
            </div>
        </section>
    )
}
