/**
 * Loader.jsx — Cinematic Preloader
 * 
 * Displays while the site assets load.
 * Features a glowing ring animation and code-style loading text.
 */

import { motion } from 'framer-motion'

export default function Loader() {
    return (
        <motion.div
            className="preloader"
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
            {/* Pulsing ring */}
            <div className="preloader-ring" />

            {/* Loading text */}
            <motion.p
                className="preloader-text"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                Initializing experience...
            </motion.p>

            {/* Progress bar */}
            <motion.div
                style={{
                    marginTop: '1.5rem',
                    width: '120px',
                    height: '2px',
                    background: 'var(--color-border)',
                    borderRadius: '2px',
                    overflow: 'hidden',
                }}
            >
                <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2, ease: 'easeInOut' }}
                    style={{
                        height: '100%',
                        background: 'var(--color-accent-cyan)',
                    }}
                />
            </motion.div>
        </motion.div>
    )
}
