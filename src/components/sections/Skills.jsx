/**
 * Skills.jsx — Creative Skill Visualization
 * 
 * Instead of boring progress bars, skills are shown as
 * orbiting rings/spheres with animated SVG circles
 * that fill on scroll-in.
 */

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const SKILL_CATEGORIES = [
    {
        category: 'Security',
        color: '#00d4ff',
        skills: [
            { name: 'Penetration Testing', level: 90 },
            { name: 'Vulnerability Assessment', level: 88 },
            { name: 'Network Security', level: 85 },
            { name: 'Incident Response', level: 78 },
        ],
    },
    {
        category: 'Development',
        color: '#7c3aed',
        skills: [
            { name: 'React / Next.js', level: 92 },
            { name: 'Node.js / Express', level: 87 },
            { name: 'Python', level: 85 },
            { name: 'Three.js / WebGL', level: 75 },
        ],
    },
    {
        category: 'Networking',
        color: '#10b981',
        skills: [
            { name: 'Cisco IOS / Routing', level: 88 },
            { name: 'Firewall Configuration', level: 82 },
            { name: 'VLANs / Switching', level: 85 },
            { name: 'Wireless Security', level: 80 },
        ],
    },
    {
        category: 'Tools',
        color: '#f59e0b',
        skills: [
            { name: 'Wireshark / Nmap', level: 90 },
            { name: 'Burp Suite', level: 85 },
            { name: 'Git / Docker', level: 88 },
            { name: 'Linux / CLI', level: 92 },
        ],
    },
]

/**
 * Circular progress ring SVG component
 */
function SkillRing({ level, color, isInView }) {
    const circumference = 2 * Math.PI * 36 // radius = 36
    const offset = circumference - (level / 100) * circumference

    return (
        <svg width="80" height="80" viewBox="0 0 80 80" style={{ transform: 'rotate(-90deg)' }}>
            {/* Background ring */}
            <circle
                cx="40"
                cy="40"
                r="36"
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="4"
            />
            {/* Animated progress ring */}
            <motion.circle
                cx="40"
                cy="40"
                r="36"
                fill="none"
                stroke={color}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={isInView ? { strokeDashoffset: offset } : {}}
                transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            />
            {/* Level text */}
            <text
                x="40"
                y="40"
                textAnchor="middle"
                dominantBaseline="central"
                fill={color}
                fontFamily="var(--font-mono)"
                fontSize="14"
                fontWeight="600"
                style={{ transform: 'rotate(90deg)', transformOrigin: '40px 40px' }}
            >
                {level}%
            </text>
        </svg>
    )
}

function SkillCategory({ category, index }) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: '-30px' })

    return (
        <motion.div
            ref={ref}
            initial={{ y: 50, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: index * 0.15 }}
            className="section-card"
            style={{ padding: '2rem' }}
        >
            {/* Category Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1.5rem',
            }}>
                <div style={{
                    width: '4px',
                    height: '24px',
                    background: category.color,
                    borderRadius: '4px',
                }} />
                <h3 style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 700,
                    fontSize: '1.15rem',
                }}>
                    {category.category}
                </h3>
            </div>

            {/* Skills Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '1.25rem',
            }}>
                {category.skills.map((skill) => (
                    <div
                        key={skill.name}
                        className="skill-orb"
                        data-hover
                    >
                        <SkillRing level={skill.level} color={category.color} isInView={isInView} />
                        <span style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: '0.8rem',
                            fontWeight: 500,
                            textAlign: 'center',
                            color: 'var(--color-text-secondary)',
                        }}>
                            {skill.name}
                        </span>
                    </div>
                ))}
            </div>
        </motion.div>
    )
}

export default function Skills() {
    const headerRef = useRef(null)
    const isHeaderInView = useInView(headerRef, { once: true, margin: '-50px' })

    return (
        <section id="skills" className="section-wrapper">
            <motion.div
                ref={headerRef}
                initial={{ y: 40, opacity: 0 }}
                animate={isHeaderInView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.7 }}
            >
                <div className="accent-line" />
                <h2 className="section-title">Skills & Expertise</h2>
                <p className="section-subtitle" style={{ marginBottom: '2.5rem' }}>
                    Technical proficiencies across security, development, and infrastructure.
                </p>
            </motion.div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.5rem',
            }}>
                {SKILL_CATEGORIES.map((cat, i) => (
                    <SkillCategory key={cat.category} category={cat} index={i} />
                ))}
            </div>
        </section>
    )
}
