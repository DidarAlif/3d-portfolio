/**
 * Experience.jsx — Animated Work Experience Timeline
 * 
 * Displays professional experience with scroll-reveal animations,
 * responsive timeline layout, and company/role details.
 */

import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'

const EXPERIENCES = [
    {
        role: 'AI/IT Intern',
        company: 'Estoma Inc.',
        program: 'Japan METI Govt. Internship Program',
        location: 'Tokyo, Japan',
        period: 'Oct 2025 – Dec 2025',
        color: '#f59e0b',
        icon: '🇯🇵',
        bullets: [
            'Worked with Ruby on Rails, Ruby, Vue.js, Vite, and Docker in production environments.',
            'Designed backend architectures including data models, API routing, and scalable logic components.',
            'Conducted Vulnerability Assessment and Penetration Testing (VAPT) on web applications and APIs.',
        ],
        tags: ['Ruby on Rails', 'Vue.js', 'Docker', 'VAPT'],
    },
    {
        role: 'Cybersecurity Specialist Intern',
        company: 'DeshLink Ltd.',
        program: null,
        location: 'Dhaka, Bangladesh',
        period: 'Jul 2023 – Nov 2023',
        color: '#00d4ff',
        icon: '🛡️',
        bullets: [
            'Performed penetration testing, network security audits, and comprehensive security assessments.',
            'Identified and documented security vulnerabilities with risk-based prioritization.',
            'Delivered structured security hardening reports with actionable remediation recommendations.',
        ],
        tags: ['Penetration Testing', 'Network Security', 'Security Auditing'],
    },
    {
        role: 'Cybersecurity Intern',
        company: 'Senselearner Technologies Pvt. Ltd.',
        program: null,
        location: 'Remote',
        period: 'Sep 2023 – Nov 2023',
        color: '#7c3aed',
        icon: '🔍',
        bullets: [
            'Executed VAPT activities for enterprise web applications and infrastructure.',
            'Wrote cyber awareness guides and comprehensive security documentation.',
            'Supported threat intelligence operations and continuous vulnerability monitoring initiatives.',
        ],
        tags: ['VAPT', 'Threat Intelligence', 'Documentation'],
    },
]

function ExperienceCard({ exp, index }) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: '-40px' })

    return (
        <motion.div
            ref={ref}
            initial={{ y: 50, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: index * 0.15 }}
            style={{
                display: 'flex',
                gap: '1.5rem',
                marginBottom: '2rem',
                position: 'relative',
            }}
        >
            {/* Timeline line + dot */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flexShrink: 0,
                width: '24px',
            }}>
                <motion.div
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ duration: 0.5, delay: index * 0.15 + 0.2, type: 'spring' }}
                    style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        background: exp.color,
                        boxShadow: `0 0 20px ${exp.color}60`,
                        flexShrink: 0,
                        marginTop: '6px',
                        zIndex: 2,
                    }}
                />
                <div style={{
                    width: '2px',
                    flex: 1,
                    background: `linear-gradient(to bottom, ${exp.color}40, var(--color-border))`,
                    marginTop: '4px',
                }} />
            </div>

            {/* Card */}
            <div
                className="section-card"
                data-hover
                style={{
                    padding: '1.75rem',
                    flex: 1,
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Top accent */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: exp.color,
                }} />

                {/* Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                    marginBottom: '0.75rem',
                }}>
                    <div>
                        <h3 style={{
                            fontFamily: 'var(--font-heading)',
                            fontWeight: 700,
                            fontSize: '1.15rem',
                            marginBottom: '0.25rem',
                        }}>
                            {exp.icon} {exp.role}
                        </h3>
                        <p style={{
                            fontSize: '0.95rem',
                            color: exp.color,
                            fontWeight: 600,
                        }}>
                            {exp.company}
                        </p>
                        {exp.program && (
                            <p style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.75rem',
                                color: 'var(--color-text-muted)',
                                marginTop: '0.15rem',
                            }}>
                                {exp.program}
                            </p>
                        )}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <p style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.78rem',
                            color: 'var(--color-text-secondary)',
                            fontWeight: 500,
                        }}>
                            {exp.period}
                        </p>
                        <p style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.72rem',
                            color: 'var(--color-text-muted)',
                        }}>
                            📍 {exp.location}
                        </p>
                    </div>
                </div>

                {/* Bullets */}
                <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: '0.75rem 0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.6rem',
                }}>
                    {exp.bullets.map((bullet, i) => (
                        <li
                            key={i}
                            style={{
                                color: 'var(--color-text-secondary)',
                                fontSize: '0.88rem',
                                lineHeight: 1.65,
                                paddingLeft: '1.2rem',
                                position: 'relative',
                            }}
                        >
                            <span style={{
                                position: 'absolute',
                                left: 0,
                                top: '0.35em',
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                background: `${exp.color}60`,
                                border: `1px solid ${exp.color}`,
                            }} />
                            {bullet}
                        </li>
                    ))}
                </ul>

                {/* Tags */}
                <div style={{
                    display: 'flex',
                    gap: '0.4rem',
                    flexWrap: 'wrap',
                    marginTop: '0.75rem',
                }}>
                    {exp.tags.map((tag) => (
                        <span
                            key={tag}
                            style={{
                                padding: '0.2rem 0.6rem',
                                borderRadius: '6px',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.7rem',
                                fontWeight: 500,
                                background: `${exp.color}12`,
                                color: exp.color,
                                border: `1px solid ${exp.color}25`,
                            }}
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    )
}

export default function Experience() {
    const headerRef = useRef(null)
    const isHeaderInView = useInView(headerRef, { once: true, margin: '-50px' })

    return (
        <section id="experience" className="section-wrapper">
            <motion.div
                ref={headerRef}
                initial={{ y: 40, opacity: 0 }}
                animate={isHeaderInView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.7 }}
            >
                <div className="accent-line" />
                <h2 className="section-title">Work <span style={{ color: 'var(--color-accent-cyan)' }}>Experience</span></h2>
                <p className="section-subtitle" style={{ marginBottom: '2.5rem' }}>
                    Professional experience in cybersecurity and software development across global organizations.
                </p>
            </motion.div>

            <div style={{ maxWidth: '800px' }}>
                {EXPERIENCES.map((exp, i) => (
                    <ExperienceCard key={exp.company} exp={exp} index={i} />
                ))}
            </div>
        </section>
    )
}
