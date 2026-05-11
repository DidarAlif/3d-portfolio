/**
 * Contact.jsx — Professional Contact Form
 * 
 * Elegant glassmorphic form with validation, loading states,
 * and success/error feedback. Sends to backend API endpoint.
 */

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

export default function Contact() {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' })
    const [status, setStatus] = useState('idle') // idle, sending, success, error
    const [errorMsg, setErrorMsg] = useState('')
    const headerRef = useRef(null)
    const isHeaderInView = useInView(headerRef, { once: true, margin: '-50px' })

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Client-side validation
        if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
            setStatus('error')
            setErrorMsg('Please fill in all fields.')
            setTimeout(() => setStatus('idle'), 3000)
            return
        }

        if (!validateEmail(formData.email)) {
            setStatus('error')
            setErrorMsg('Please enter a valid email address.')
            setTimeout(() => setStatus('idle'), 3000)
            return
        }

        setStatus('sending')
        setErrorMsg('')

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            const data = await res.json()

            if (res.ok) {
                setStatus('success')
                setFormData({ name: '', email: '', message: '' })
                setTimeout(() => setStatus('idle'), 5000)
            } else {
                setStatus('error')
                setErrorMsg(data.error || 'Something went wrong. Please try again.')
                setTimeout(() => setStatus('idle'), 4000)
            }
        } catch (err) {
            setStatus('error')
            setErrorMsg('Network error. Please check your connection.')
            setTimeout(() => setStatus('idle'), 4000)
        }
    }

    return (
        <section id="contact" className="section-wrapper">
            <motion.div
                ref={headerRef}
                initial={{ y: 40, opacity: 0 }}
                animate={isHeaderInView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.7 }}
            >
                <div className="accent-line" />
                <h2 className="section-title">Get In <span style={{ color: 'var(--color-accent-cyan)' }}>Touch</span></h2>
                <p className="section-subtitle" style={{ marginBottom: '2.5rem' }}>
                    Have a project in mind or want to collaborate? Let's talk.
                </p>
            </motion.div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem',
                alignItems: 'start',
            }}>
                {/* Contact Info */}
                <motion.div
                    initial={{ x: -40, opacity: 0 }}
                    animate={isHeaderInView ? { x: 0, opacity: 1 } : {}}
                    transition={{ duration: 0.7, delay: 0.2 }}
                >
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <h3 style={{
                            fontFamily: 'var(--font-heading)',
                            fontWeight: 700,
                            fontSize: '1.3rem',
                            marginBottom: '1.5rem',
                        }}>
                            Let's Build Something Amazing
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{
                                    width: '44px',
                                    height: '44px',
                                    borderRadius: '12px',
                                    background: 'rgba(0, 212, 255, 0.1)',
                                    border: '1px solid rgba(0, 212, 255, 0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.2rem',
                                    flexShrink: 0,
                                }}>
                                    📧
                                </div>
                                <div>
                                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.2rem' }}>
                                        EMAIL
                                    </p>
                                    <a href="mailto:didarulalamalif@gmail.com" style={{ fontSize: '0.9rem', color: 'var(--color-accent-cyan)', textDecoration: 'none' }}>
                                        didarulalamalif@gmail.com
                                    </a>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{
                                    width: '44px',
                                    height: '44px',
                                    borderRadius: '12px',
                                    background: 'rgba(124, 58, 237, 0.1)',
                                    border: '1px solid rgba(124, 58, 237, 0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.2rem',
                                    flexShrink: 0,
                                }}>
                                    📱
                                </div>
                                <div>
                                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.2rem' }}>
                                        PHONE
                                    </p>
                                    <a href="tel:+8801976272523" style={{ fontSize: '0.9rem', color: 'var(--color-text-primary)', textDecoration: 'none' }}>
                                        +880 1976-272523
                                    </a>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{
                                    width: '44px',
                                    height: '44px',
                                    borderRadius: '12px',
                                    background: 'rgba(245, 158, 11, 0.1)',
                                    border: '1px solid rgba(245, 158, 11, 0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.2rem',
                                    flexShrink: 0,
                                }}>
                                    📍
                                </div>
                                <div>
                                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.2rem' }}>
                                        LOCATION
                                    </p>
                                    <p style={{ fontSize: '0.9rem' }}>Dhaka, Bangladesh</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{
                                    width: '44px',
                                    height: '44px',
                                    borderRadius: '12px',
                                    background: 'rgba(16, 185, 129, 0.1)',
                                    border: '1px solid rgba(16, 185, 129, 0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.2rem',
                                    flexShrink: 0,
                                }}>
                                    🟢
                                </div>
                                <div>
                                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.2rem' }}>
                                        STATUS
                                    </p>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--color-accent-emerald)' }}>
                                        Available for hire
                                    </p>
                                </div>
                            </div>

                            {/* Social Links */}
                            <div style={{
                                display: 'flex',
                                gap: '0.75rem',
                                marginTop: '0.5rem',
                                paddingTop: '1rem',
                                borderTop: '1px solid var(--color-border)',
                            }}>
                                <a
                                    href="https://github.com/DidarAlif"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    data-hover
                                    style={{
                                        padding: '0.5rem 1rem',
                                        borderRadius: '10px',
                                        border: '1px solid var(--color-border)',
                                        background: 'var(--color-bg-glass)',
                                        color: 'var(--color-text-secondary)',
                                        fontSize: '0.82rem',
                                        fontFamily: 'var(--font-mono)',
                                        textDecoration: 'none',
                                        transition: 'all 0.3s ease',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.4rem',
                                    }}
                                >
                                    GitHub ↗
                                </a>
                                <a
                                    href="https://linkedin.com/in/didarul-alam-alif"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    data-hover
                                    style={{
                                        padding: '0.5rem 1rem',
                                        borderRadius: '10px',
                                        border: '1px solid var(--color-border)',
                                        background: 'var(--color-bg-glass)',
                                        color: 'var(--color-text-secondary)',
                                        fontSize: '0.82rem',
                                        fontFamily: 'var(--font-mono)',
                                        textDecoration: 'none',
                                        transition: 'all 0.3s ease',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.4rem',
                                    }}
                                >
                                    LinkedIn ↗
                                </a>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Contact Form */}
                <motion.div
                    initial={{ x: 40, opacity: 0 }}
                    animate={isHeaderInView ? { x: 0, opacity: 1 } : {}}
                    transition={{ duration: 0.7, delay: 0.3 }}
                >
                    <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '2rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {/* Name */}
                            <div>
                                <label style={{
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '0.75rem',
                                    color: 'var(--color-text-muted)',
                                    letterSpacing: '0.08em',
                                    textTransform: 'uppercase',
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                }}>
                                    Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Your name"
                                    className="contact-input"
                                    required
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label style={{
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '0.75rem',
                                    color: 'var(--color-text-muted)',
                                    letterSpacing: '0.08em',
                                    textTransform: 'uppercase',
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                }}>
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="your@email.com"
                                    className="contact-input"
                                    required
                                />
                            </div>

                            {/* Message */}
                            <div>
                                <label style={{
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '0.75rem',
                                    color: 'var(--color-text-muted)',
                                    letterSpacing: '0.08em',
                                    textTransform: 'uppercase',
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                }}>
                                    Message
                                </label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Tell me about your project..."
                                    className="contact-input"
                                    rows={5}
                                    style={{ resize: 'vertical', minHeight: '120px' }}
                                    required
                                />
                            </div>

                            {/* Submit Button */}
                            <motion.button
                                type="submit"
                                className="btn-primary"
                                disabled={status === 'sending'}
                                whileHover={{ scale: status === 'sending' ? 1 : 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                style={{
                                    width: '100%',
                                    justifyContent: 'center',
                                    opacity: status === 'sending' ? 0.7 : 1,
                                    position: 'relative',
                                }}
                            >
                                {status === 'sending' && (
                                    <div style={{
                                        width: '18px',
                                        height: '18px',
                                        border: '2px solid rgba(10, 10, 15, 0.3)',
                                        borderTopColor: '#0a0a0f',
                                        borderRadius: '50%',
                                        animation: 'spin 0.8s linear infinite',
                                    }} />
                                )}
                                {status === 'sending' ? 'Sending...' : 'Send Message ✉️'}
                            </motion.button>
                        </div>
                    </form>

                    {/* Status Toast */}
                    {(status === 'success' || status === 'error') && (
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 20, opacity: 0 }}
                            style={{
                                marginTop: '1rem',
                                padding: '1rem 1.25rem',
                                borderRadius: '12px',
                                fontSize: '0.9rem',
                                background: status === 'success'
                                    ? 'rgba(16, 185, 129, 0.1)'
                                    : 'rgba(239, 68, 68, 0.1)',
                                border: `1px solid ${status === 'success'
                                    ? 'rgba(16, 185, 129, 0.3)'
                                    : 'rgba(239, 68, 68, 0.3)'}`,
                                color: status === 'success'
                                    ? 'var(--color-accent-emerald)'
                                    : '#ef4444',
                            }}
                        >
                            {status === 'success'
                                ? '✅ Message sent successfully! I\'ll get back to you soon.'
                                : `❌ ${errorMsg}`}
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </section>
    )
}
