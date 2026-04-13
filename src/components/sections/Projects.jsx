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
        title: 'VAPT Platform',
        description: 'Full-featured Vulnerability Assessment & Penetration Testing platform with automated scanning, report generation, and real-time dashboards.',
        tech: ['React', 'Node.js', 'Python', 'Nuclei', 'Railway'],
        image: null,
        initials: 'VP',
        color: '#00d4ff',
        link: '#',
    },
    {
        title: 'Secure Network Architecture',
        description: 'Enterprise network infrastructure design with VLAN segmentation, firewall policies, and intrusion detection systems.',
        tech: ['Cisco IOS', 'Wireshark', 'pfSense', 'Suricata'],
        image: null,
        initials: 'SNA',
        color: '#10b981',
        link: '#',
    },
    {
        title: '3D Portfolio Website',
        description: 'Award-worthy immersive portfolio built with Three.js, React Three Fiber, and cinematic lighting with day/night modes.',
        tech: ['React', 'Three.js', 'GSAP', 'Framer Motion'],
        image: null,
        initials: '3D',
        color: '#f59e0b',
        link: '#',
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
                    const fetchedProjects = data
                        .filter(repo => {
                            const name = repo.name.toLowerCase()
                            return !name.includes('mess') && 
                                   !name.includes('deep-axis') && 
                                   name !== 'vapt-platform' && 
                                   repo.name !== '3d-portfolio' &&
                                   !repo.fork
                        })
                        .map(repo => {
                            // Generate initials (up to 3 chars)
                            const initials = repo.name
                                .replace(/[^a-zA-Z0-9-]/g, '')
                                .split('-')
                                .map(w => w[0])
                                .join('')
                                .substring(0, 3)
                                .toUpperCase() || 'GH'

                            // Consistent color by repo ID
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
                <h2 className="section-title">Projects</h2>
                <p className="section-subtitle" style={{ marginBottom: '2.5rem' }}>
                    A curated selection of work spanning security, development, and design.
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
