/**
 * Skills.jsx — Animated Icon-Based Skill Showcase
 *
 * Skills displayed as animated icon chips with hover effects,
 * staggered scroll-in, and category headers.
 * Uses react-icons for technology icons.
 */

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
    SiPython, SiRuby, SiPhp, SiJavascript, SiCplusplus,
    SiReact, SiNextdotjs, SiVuedotjs, SiFastapi, SiRubyonrails, SiNodedotjs,
    SiMysql, SiPostgresql, SiDocker, SiVmware, SiVirtualbox, SiLinux,
    SiWireshark, SiMetasploit, SiKalilinux,
    SiCisco, SiHtml5, SiGnubash,
} from 'react-icons/si'
import {
    FaShieldAlt, FaNetworkWired, FaBug, FaServer, FaDatabase,
    FaCloud, FaLock, FaCode, FaTools, FaSearch, FaCrosshairs,
    FaSitemap, FaWindows, FaJava, FaFileCode,
} from 'react-icons/fa'
import {
    MdSecurity, MdApi, MdRouter, MdWifi,
} from 'react-icons/md'

const SKILL_CATEGORIES = [
    {
        category: 'Cybersecurity & VAPT',
        color: '#00d4ff',
        gradient: 'linear-gradient(135deg, #00d4ff20, #7c3aed15)',
        skills: [
            { name: 'Penetration Testing', icon: FaCrosshairs },
            { name: 'Vulnerability Assessment', icon: FaBug },
            { name: 'OWASP WSTG 4.2', icon: FaShieldAlt },
            { name: 'OWASP API Top 10', icon: MdApi },
            { name: 'MITRE CWE', icon: FaShieldAlt },
            { name: 'CVSS v3.1', icon: MdSecurity },
            { name: 'Threat Intelligence', icon: FaSearch },
            { name: 'Risk Assessment', icon: FaLock },
        ],
    },
    {
        category: 'Security Tools',
        color: '#ef4444',
        gradient: 'linear-gradient(135deg, #ef444420, #f59e0b15)',
        skills: [
            { name: 'Burp Suite Pro', icon: FaBug },
            { name: 'Nmap', icon: FaNetworkWired },
            { name: 'Metasploit', icon: SiMetasploit },
            { name: 'Nessus', icon: FaShieldAlt },
            { name: 'Wireshark', icon: SiWireshark },
            { name: 'SQLMap', icon: FaDatabase },
            { name: 'Nuclei', icon: FaCrosshairs },
            { name: 'OWASP ZAP', icon: FaShieldAlt },
            { name: 'Kali Linux', icon: SiKalilinux },
            { name: 'Katana', icon: FaSearch },
            { name: 'Dirsearch', icon: FaFileCode },
            { name: 'Gobuster', icon: FaTools },
        ],
    },
    {
        category: 'Programming & Scripting',
        color: '#7c3aed',
        gradient: 'linear-gradient(135deg, #7c3aed20, #ec489915)',
        skills: [
            { name: 'Python', icon: SiPython },
            { name: 'Ruby', icon: SiRuby },
            { name: 'PHP', icon: SiPhp },
            { name: 'JavaScript', icon: SiJavascript },
            { name: 'C++', icon: SiCplusplus },
            { name: 'Java', icon: FaJava },
            { name: 'C#', icon: FaCode },
            { name: 'Bash', icon: SiGnubash },
        ],
    },
    {
        category: 'Web & Frameworks',
        color: '#10b981',
        gradient: 'linear-gradient(135deg, #10b98120, #00d4ff15)',
        skills: [
            { name: 'React', icon: SiReact },
            { name: 'Next.js', icon: SiNextdotjs },
            { name: 'Vue.js', icon: SiVuedotjs },
            { name: 'FastAPI', icon: SiFastapi },
            { name: 'Ruby on Rails', icon: SiRubyonrails },
            { name: 'Node.js', icon: SiNodedotjs },
            { name: 'HTML5', icon: SiHtml5 },
            { name: 'CSS3', icon: FaCode },
            { name: 'REST APIs', icon: MdApi },
        ],
    },
    {
        category: 'Databases & Infrastructure',
        color: '#f59e0b',
        gradient: 'linear-gradient(135deg, #f59e0b20, #ef444415)',
        skills: [
            { name: 'MySQL', icon: SiMysql },
            { name: 'PostgreSQL', icon: SiPostgresql },
            { name: 'Oracle', icon: FaDatabase },
            { name: 'Docker', icon: SiDocker },
            { name: 'VMware', icon: SiVmware },
            { name: 'VirtualBox', icon: SiVirtualbox },
            { name: 'Linux', icon: SiLinux },
            { name: 'Windows Server', icon: FaWindows },
        ],
    },
    {
        category: 'Networking',
        color: '#3b82f6',
        gradient: 'linear-gradient(135deg, #3b82f620, #10b98115)',
        skills: [
            { name: 'Cisco Routers', icon: SiCisco },
            { name: 'VLANs / OSPF', icon: FaSitemap },
            { name: 'NAT / TCP/IP', icon: MdRouter },
            { name: 'Network Security', icon: FaNetworkWired },
            { name: 'Firewall Config', icon: FaShieldAlt },
            { name: 'Wireless Security', icon: MdWifi },
        ],
    },
]

function SkillChip({ skill, color, index, isInView }) {
    const Icon = skill.icon
    return (
        <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{
                duration: 0.4,
                delay: index * 0.04,
                type: 'spring',
                stiffness: 260,
                damping: 20,
            }}
            whileHover={{
                scale: 1.08,
                y: -4,
                boxShadow: `0 8px 25px ${color}30`,
            }}
            data-hover
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 0.9rem',
                borderRadius: '12px',
                background: `${color}08`,
                border: `1px solid ${color}20`,
                cursor: 'default',
                transition: 'border-color 0.3s ease',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${color}60`
                e.currentTarget.style.background = `${color}15`
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = `${color}20`
                e.currentTarget.style.background = `${color}08`
            }}
        >
            <Icon
                style={{
                    fontSize: '1.1rem',
                    color: color,
                    flexShrink: 0,
                }}
            />
            <span style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.82rem',
                fontWeight: 500,
                color: 'var(--color-text-primary)',
                whiteSpace: 'nowrap',
            }}>
                {skill.name}
            </span>
        </motion.div>
    )
}

function SkillCategory({ category, index }) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: '-30px' })

    return (
        <motion.div
            ref={ref}
            initial={{ y: 40, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="section-card"
            style={{
                padding: '1.75rem',
                background: category.gradient,
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Color accent bar */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: category.color,
            }} />

            {/* Category Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1.25rem',
            }}>
                <div style={{
                    width: '4px',
                    height: '20px',
                    background: category.color,
                    borderRadius: '4px',
                }} />
                <h3 style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    color: category.color,
                }}>
                    {category.category}
                </h3>
            </div>

            {/* Skill Chips */}
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem',
            }}>
                {category.skills.map((skill, i) => (
                    <SkillChip
                        key={skill.name}
                        skill={skill}
                        color={category.color}
                        index={i}
                        isInView={isInView}
                    />
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
                <h2 className="section-title">
                    Skills & <span style={{ color: 'var(--color-accent-cyan)' }}>Expertise</span>
                </h2>
                <p className="section-subtitle" style={{ marginBottom: '2.5rem' }}>
                    Technical proficiencies across security, development, and infrastructure.
                </p>
            </motion.div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '1.5rem',
            }}>
                {SKILL_CATEGORIES.map((cat, i) => (
                    <SkillCategory key={cat.category} category={cat} index={i} />
                ))}
            </div>
        </section>
    )
}
