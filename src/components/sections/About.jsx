/**
 * About.jsx — Motion-Driven About Section
 * 
 * Presents personal info through layered storytelling with
 * scroll-reveal animations and expertise cards.
 */

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const EXPERTISE = [
    {
        icon: '🛡️',
        title: 'Cybersecurity',
        description: 'Penetration testing, vulnerability assessment, and network security hardening.',
    },
    {
        icon: '💻',
        title: 'Development',
        description: 'Full-stack web development with modern frameworks and scalable architectures.',
    },
    {
        icon: '🌐',
        title: 'Networking',
        description: 'Cisco-certified network design, implementation, and troubleshooting.',
    },
    {
        icon: '🔬',
        title: 'Research',
        description: 'Security research, threat analysis, and emerging technology exploration.',
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
                <h2 className="section-title">About Me</h2>
                <p className="section-subtitle" style={{ marginBottom: '1.5rem' }}>
                    Passionate about the intersection of cybersecurity and creative technology.
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
                    marginBottom: '3rem',
                    maxWidth: '700px',
                }}
            >
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>
                    I'm a Computer Science & Engineering student with a deep fascination for cybersecurity and software development.
                    With hands-on experience in penetration testing, network security, and full-stack development, I bridge the gap
                    between building applications and securing them. My work spans vulnerability assessment platforms,
                    secure web applications, and network infrastructure design.
                </p>
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
