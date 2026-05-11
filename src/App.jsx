import { useState, useEffect, useCallback, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Lenis from 'lenis'
import Scene from './components/canvas/Scene'
import Navbar from './components/ui/Navbar'
import CustomCursor from './components/ui/CustomCursor'
import Loader from './components/ui/Loader'
import Hero from './components/sections/Hero'
import About from './components/sections/About'
import Certifications from './components/sections/Certifications'
import Experience from './components/sections/Experience'
import Projects from './components/sections/Projects'
import Skills from './components/sections/Skills'
import Achievements from './components/sections/Achievements'
import Contact from './components/sections/Contact'

function App() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const lenisRef = useRef(null)

  // Smooth scroll via Lenis
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.6,
      easing: (t) => 1 - Math.pow(1 - t, 3), // cubic ease-out — gentler deceleration
      smooth: true,
      smoothWheel: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 1.5,
    })
    lenisRef.current = lenis

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    // Track scroll progress
    lenis.on('scroll', ({ progress }) => {
      setScrollProgress(progress)
    })

    return () => {
      lenis.destroy()
    }
  }, [])

  // Simulated load
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 2200)
    return () => clearTimeout(timer)
  }, [])

  // Scroll to section
  const scrollToSection = useCallback((id) => {
    const el = document.getElementById(id)
    if (el && lenisRef.current) {
      lenisRef.current.scrollTo(el, { offset: -80 })
    }
  }, [])

  return (
    <>
      {/* Preloader */}
      <AnimatePresence>
        {!isLoaded && <Loader key="loader" />}
      </AnimatePresence>

      {/* Custom Cursor (desktop only) */}
      <CustomCursor />

      {/* 3D Background Scene */}
      <div className="canvas-container">
        <Scene isDayMode={false} scrollProgress={scrollProgress} onNavigate={scrollToSection} />
      </div>

      {/* Content Overlay */}
      <motion.div
        className="content-wrapper"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        <Navbar
          isDayMode={false}
          scrollToSection={scrollToSection}
        />

        <main>
          <Hero scrollToSection={scrollToSection} />
          <About />
          <Experience />
          <Certifications />
          <Projects />
          <Skills />
          <Achievements />
          <Contact />
        </main>

        {/* Footer */}
        <footer className="text-center py-8 border-t border-white/5">
          <p className="text-sm" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
            © 2025 Md Didarul Alam Alif. Crafted with passion & code.
          </p>
        </footer>
      </motion.div>
    </>
  )
}

export default App
