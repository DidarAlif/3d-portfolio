/**
 * Certifications.jsx — Interactive 3D-Style Card Gallery
 * 
 * Displays certifications and awards as floating cards
 * with hover depth effects and image previews.
 */

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

const CERTIFICATIONS = [
    {
        title: 'Networking Basics',
        issuer: 'Cisco Networking Academy',
        image: './assets/Networking Basics.png',
        date: '2024',
        category: 'certification',
    },
    {
        title: 'Network Support and Security',
        issuer: 'Cisco Networking Academy',
        image: './assets/Network Support and Security.png',
        date: '2024',
        category: 'certification',
    },
    {
        title: 'IT Essentials',
        issuer: 'Cisco Networking Academy',
        image: './assets/IT Essentials.png',
        date: '2024',
        category: 'certification',
    },
    {
        title: 'Cybersecurity Training',
        issuer: 'Senselearner Technologies',
        image: './assets/Senselearner.png',
        date: '2024',
        category: 'certification',
    },
]

const AWARDS = [
    {
        title: "Dean's Award for Academic Excellence",
        issuer: 'University',
        image: './assets/Dean award-1.jpg',
        date: '2023',
        category: 'award',
    },
    {
        title: "Dean's Award — Outstanding Performance",
        issuer: 'University',
        image: './assets/Dean Award-2.jpg',
        date: '2024',
        category: 'award',
    },
    {
        title: "Dean's Award — Research Contribution",
        issuer: 'University',
        image: './assets/Dean Award-3.jpg',
        date: '2024',
        category: 'award',
    },
]

function CertCard({ item, index, onSelectImage }) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: '-30px' })
    const [isHovered, setIsHovered] = useState(false)
    const cardRef = useRef(null)

    // 3D tilt on hover
    const handleMouseMove = (e) => {
        if (!cardRef.current) return
        const rect = cardRef.current.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width - 0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5
        cardRef.current.style.transform = `perspective(800px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) scale(1.02)`
    }

    const handleMouseLeave = () => {
        setIsHovered(false)
        if (cardRef.current) {
            cardRef.current.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)'
        }
    }

    const isCert = item.category === 'certification'

    return (
        <motion.div
            ref={ref}
            initial={{ y: 50, opacity: 0, rotateY: -10 }}
            animate={isInView ? { y: 0, opacity: 1, rotateY: 0 } : {}}
            transition={{ duration: 0.7, delay: index * 0.1 }}
            onClick={() => onSelectImage(item.image)}
        >
            <div
                ref={cardRef}
                className="section-card"
                onMouseEnter={() => setIsHovered(true)}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                data-hover
                style={{
                    overflow: 'hidden',
                    transition: 'transform 0.15s ease, border-color 0.4s ease, box-shadow 0.4s ease',
                    cursor: 'pointer', // changed for clickability
                }}
            >
                {/* Image */}
                <div style={{
                    position: 'relative',
                    height: '180px',
                    overflow: 'hidden',
                }}>
                    <img
                        src={item.image}
                        alt={item.title}
                        loading="lazy"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.5s ease',
                            transform: isHovered ? 'scale(1.08)' : 'scale(1)',
                        }}
                    />
                    {/* Category badge */}
                    <div style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        padding: '0.3rem 0.75rem',
                        borderRadius: '20px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        background: isCert ? 'rgba(0, 212, 255, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        color: isCert ? 'var(--color-accent-cyan)' : 'var(--color-accent-gold)',
                        border: `1px solid ${isCert ? 'rgba(0, 212, 255, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                        backdropFilter: 'blur(8px)',
                    }}>
                        {isCert ? '📜 Cert' : '🏆 Award'}
                    </div>
                </div>

                {/* Info */}
                <div style={{ padding: '1.25rem' }}>
                    <h3 style={{
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 700,
                        fontSize: '1rem',
                        marginBottom: '0.4rem',
                        lineHeight: 1.3,
                    }}>
                        {item.title}
                    </h3>
                    <p style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.8rem',
                        color: 'var(--color-text-muted)',
                    }}>
                        {item.issuer} · {item.date}
                    </p>
                </div>
            </div>
        </motion.div>
    )
}

export default function Certifications() {
    const headerRef = useRef(null)
    const isHeaderInView = useInView(headerRef, { once: true, margin: '-50px' })
    const [filter, setFilter] = useState('all')
    const [selectedImage, setSelectedImage] = useState(null)

    const allItems = [...CERTIFICATIONS, ...AWARDS]
    const filtered = filter === 'all'
        ? allItems
        : allItems.filter(item => item.category === filter)

    return (
        <section id="certifications" className="section-wrapper">
            <motion.div
                ref={headerRef}
                initial={{ y: 40, opacity: 0 }}
                animate={isHeaderInView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.7 }}
            >
                <div className="accent-line" />
                <h2 className="section-title">Certifications & Awards</h2>
                <p className="section-subtitle">
                    Recognized expertise validated by industry leaders.
                </p>
            </motion.div>

            {/* Filter Tabs */}
            <div style={{
                display: 'flex',
                gap: '0.5rem',
                margin: '2rem 0',
                flexWrap: 'wrap',
            }}>
                {[
                    { id: 'all', label: 'All' },
                    { id: 'certification', label: 'Certifications' },
                    { id: 'award', label: 'Awards' },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setFilter(tab.id)}
                        data-hover
                        style={{
                            padding: '0.5rem 1.25rem',
                            borderRadius: '20px',
                            border: '1px solid',
                            borderColor: filter === tab.id ? 'var(--color-accent-cyan)' : 'var(--color-border)',
                            background: filter === tab.id ? 'rgba(0, 212, 255, 0.1)' : 'transparent',
                            color: filter === tab.id ? 'var(--color-accent-cyan)' : 'var(--color-text-secondary)',
                            fontFamily: 'var(--font-body)',
                            fontSize: '0.85rem',
                            fontWeight: 500,
                            cursor: 'none',
                            transition: 'all 0.3s ease',
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Cards Grid */}
            <motion.div
                layout
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '1.5rem',
                }}
            >
                <AnimatePresence mode="popLayout">
                    {filtered.map((item, i) => (
                        <CertCard key={item.title} item={item} index={i} onSelectImage={setSelectedImage} />
                    ))}
                </AnimatePresence>
            </motion.div>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImage(null)}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            backgroundColor: 'rgba(5, 5, 10, 0.9)',
                            backdropFilter: 'blur(10px)',
                            zIndex: 1000,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '2rem',
                            cursor: 'zoom-out',
                        }}
                    >
                        <motion.img
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            src={selectedImage}
                            alt="Certificate Full View"
                            style={{
                                maxWidth: '100%',
                                maxHeight: '90vh',
                                objectFit: 'contain',
                                borderRadius: '12px',
                                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                            }}
                            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image itself
                        />
                        <button
                            onClick={() => setSelectedImage(null)}
                            style={{
                                position: 'absolute',
                                top: '2rem',
                                right: '2rem',
                                background: 'rgba(255,255,255,0.1)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                color: 'white',
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.5rem',
                                cursor: 'pointer',
                                transition: 'background 0.2s',
                            }}
                        >
                            ×
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    )
}
