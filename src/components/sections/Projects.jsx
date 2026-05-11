/**
 * Projects.jsx — Dynamic Project Showcase
 * 
 * Features perspective grid with hover effects,
 * depth shifting, and tech tags.
 */

import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'

const STATIC_PROJECTS = [
    {
        title: 'ReconScience',
        description: 'Full-stack automated VAPT platform with Next.js frontend and FastAPI backend. Integrates Nuclei scanner with 4 scan modes, real-time SSE streaming, JWT auth, and OWASP Top 10 risk scoring.',
        tech: ['Next.js', 'FastAPI', 'PostgreSQL', 'Nuclei', 'Railway'],
        image: null,
        initials: 'RS',
        color: '#00d4ff',
        link: 'https://github.com/DidarAlif/ReconScience',
        badge: '🟢 Live Demo',
    },
    {
        title: 'OWASP Multi-Tenant SaaS VAPT',
        description: 'Full-scope authenticated and unauthenticated VAPT on multi-tenant SaaS app (Vue.js, Ruby on Rails, Auth0). Identified 22 security findings: 2 Critical, 7 High, 7 Medium.',
        tech: ['OWASP WSTG 4.2', 'MITRE CWE', 'CVSS v3.1', 'Nuclei', 'Katana'],
        image: null,
        initials: 'OV',
        color: '#ef4444',
        link: 'https://github.com/DidarAlif/OWASP-VAPT-Report',
        badge: '📋 Report',
    },
    {
        title: 'VAPT Security Audit & Testing',
        description: 'Comprehensive vulnerability assessment following OWASP and NIST methodologies. Identified critical security issues including insecure auth, broken access control, and server misconfigurations.',
        tech: ['OWASP', 'NIST', 'Burp Suite', 'Nmap'],
        image: null,
        initials: 'VA',
        color: '#7c3aed',
        link: 'https://github.com/DidarAlif/VAPT-Project',
        badge: '📋 Report',
    },
    {
        title: 'Elite Depot — E-Commerce',
        description: 'Secure PHP-MySQL e-commerce system with input validation, prepared statements for SQL injection prevention, admin dashboard, inventory management, and order processing.',
        tech: ['PHP', 'MySQL', 'HTML/CSS', 'JavaScript'],
        image: null,
        initials: 'ED',
        color: '#10b981',
        link: 'https://github.com/DidarAlif/Elite-Depot',
    },
    {
        title: 'Study Assist',
        description: 'C# desktop application with Windows Forms for educational center automation — staff management, attendance tracking, payroll processing, and real-time analytics dashboards.',
        tech: ['C#', 'Windows Forms', '.NET', 'SQL Server'],
        image: null,
        initials: 'SA',
        color: '#f59e0b',
        link: 'https://github.com/DidarAlif/Study-Assist',
    },
    {
        title: 'Smart Course Automation',
        description: 'Modular Java OOP system demonstrating design patterns, core OOP principles (abstraction, inheritance, interfaces), and persistent file I/O logging for audit trails.',
        tech: ['Java', 'OOP', 'File I/O', 'Design Patterns'],
        image: null,
        initials: 'SC',
        color: '#ec4899',
        link: 'https://github.com/DidarAlif/Course-Management',
    },
]

function ProjectLogo({ initials, color }) {
    return (
        <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: `linear-gradient(135deg, ${color}20 0%, ${color}60 100%)`,
            border: `1px solid ${color}40`,
        }}>
            <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '4.5rem',
                fontWeight: '900',
                color: '#ffffff',
                textShadow: `0 4px 15px ${color}`,
                letterSpacing: '-0.05em',
            }}>
                {initials}
            </div>
        </div>
    )
}

function ProjectCard({ project, index }) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: '-50px' })
    const [isHovered, setIsHovered] = useState(false)
    const cardRef = useRef(null)

    // 3D tilt effect
    const handleMouseMove = (e) => {
        if (!cardRef.current) return
        const rect = cardRef.current.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width - 0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5
        cardRef.current.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-8px)`
    }

    const handleMouseLeave = () => {
        setIsHovered(false)
        if (cardRef.current) {
            cardRef.current.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0px)'
        }
    }

    return (
        <motion.div
            ref={ref}
            initial={{ y: 60, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: index * 0.15 }}
        >
            <div
                ref={cardRef}
                className="project-card"
                onMouseEnter={() => setIsHovered(true)}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                data-hover
                style={{
                    transition: 'transform 0.15s ease, border-color 0.4s ease, box-shadow 0.4s ease',
                }}
            >
                <div style={{
                    position: 'relative',
                    height: '220px',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#111',
                }}>
                    <motion.div style={{
                        width: '100%',
                        height: '100%',
                        transition: 'transform 0.6s ease',
                        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                    }}>
                        {project.image ? (
                            <img
                                src={project.image}
                                alt={project.title}
                                loading="lazy"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                }}
                            />
                        ) : (
                            <ProjectLogo initials={project.initials} color={project.color} />
                        )}
                    </motion.div>

                    {/* Hover Overlay */}
                    <div className="overlay">
                        <motion.a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.1 }}
                            className="btn-primary"
                            style={{
                                fontSize: '0.85rem',
                                padding: '0.7rem 1.5rem',
                                textDecoration: 'none',
                            }}
                        >
                            View Project ↗
                        </motion.a>
                    </div>

                    {/* Color accent line at top */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '3px',
                        background: project.color,
                    }} />

                    {/* Badge */}
                    {project.badge && (
                        <div style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            padding: '0.25rem 0.7rem',
                            borderRadius: '20px',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            background: 'rgba(16, 185, 129, 0.15)',
                            color: '#10b981',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                            backdropFilter: 'blur(8px)',
                        }}>
                            {project.badge}
                        </div>
                    )}
                </div>

                {/* Project Info */}
                <div style={{ padding: '1.5rem' }}>
                    <h3 style={{
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 700,
                        fontSize: '1.15rem',
                        marginBottom: '0.5rem',
                    }}>
                        {project.title}
                    </h3>
                    <p style={{
                        color: 'var(--color-text-secondary)',
                        fontSize: '0.88rem',
                        lineHeight: 1.6,
                        marginBottom: '1rem',
                    }}>
                        {project.description}
                    </p>

                    {/* Tech Tags */}
                    <div style={{
                        display: 'flex',
                        gap: '0.4rem',
                        flexWrap: 'wrap',
                    }}>
                        {project.tech.map(tag => (
                            <span
                                key={tag}
                                style={{
                                    padding: '0.25rem 0.65rem',
                                    borderRadius: '6px',
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '0.72rem',
                                    fontWeight: 500,
                                    background: `${project.color}15`,
                                    color: project.color,
                                    border: `1px solid ${project.color}30`,
                                }}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default function Projects() {
    const headerRef = useRef(null)
    const isHeaderInView = useInView(headerRef, { once: true, margin: '-50px' })
    const [projects, setProjects] = useState(STATIC_PROJECTS)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('https://api.github.com/users/DidarAlif/repos?sort=updated')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    // Titles already in static projects (case-insensitive match)
                    const staticTitles = new Set(STATIC_PROJECTS.map(p => p.title.toLowerCase()))
                    const staticRepoNames = new Set([
                        'reconscience', 'owasp-vapt-report', 'vapt-project',
                        'elite-depot', 'study-assist', 'course-management',
                        '3d-portfolio',
                    ])

                    const fetchedProjects = data
                        .filter(repo => {
                            const name = repo.name.toLowerCase()
                            return !staticRepoNames.has(name) &&
                                   !name.includes('mess') && 
                                   !name.includes('deep-axis') &&
                                   !repo.fork
                        })
                        .map(repo => {
                            const initials = repo.name
                                .replace(/[^a-zA-Z0-9-]/g, '')
                                .split('-')
                                .map(w => w[0])
                                .join('')
                                .substring(0, 3)
                                .toUpperCase() || 'GH'

                            const colors = ['#00d4ff', '#7c3aed', '#10b981', '#f59e0b', '#ec4899', '#3b82f6', '#14b8a6', '#ef4444']
                            const color = colors[Math.abs(repo.id) % colors.length]

                            return {
                                title: repo.name.replace(/-/g, ' '),
                                description: repo.description || 'GitHub Repository',
                                tech: repo.language ? [repo.language, ...(repo.topics || [])].slice(0, 4) : ['Source Code'],
                                image: null,
                                initials,
                                color,
                                link: repo.html_url,
                            }
                        })
                    setProjects([...STATIC_PROJECTS, ...fetchedProjects])
                }
                setLoading(false)
            })
            .catch(err => {
                console.error("Failed to fetch Github Repos", err)
                setLoading(false)
            })
    }, [])

    return (
        <section id="projects" className="section-wrapper">
            <motion.div
                ref={headerRef}
                initial={{ y: 40, opacity: 0 }}
                animate={isHeaderInView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.7 }}
            >
                <div className="accent-line" />
                <h2 className="section-title">My <span style={{ color: 'var(--color-accent-cyan)' }}>Projects</span></h2>
                <p className="section-subtitle" style={{ marginBottom: '2.5rem' }}>
                    A curated selection of work spanning security research, VAPT, and development.
                </p>
            </motion.div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '1.75rem',
            }}>
                {projects.map((project, i) => (
                    <ProjectCard key={`${project.title}-${i}`} project={project} index={i} />
                ))}
            </div>
        </section>
    )
}
