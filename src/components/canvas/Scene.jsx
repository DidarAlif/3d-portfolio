/**
 * Scene.jsx — Main R3F Canvas Wrapper
 *
 * The top-level 3D scene controller that:
 * 1. Renders the React Three Fiber Canvas
 * 2. Switches between two background environments:
 *    - Night mode: Solar System with planets, orbits, starfield
 *    - Day mode: Ocean sunrise with interactive water, sky, sun
 * 3. Applies bloom post-processing for emissive glow effects
 * 4. Manages camera and performance settings
 *
 * Both scenes coexist in the canvas with opacity-like transitions
 * handled internally by each scene's components.
 */

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import SolarSystem from './SolarSystem'
import OceanScene from './OceanScene'
import OceanCameraController from './OceanCameraController'

export default function Scene({ isDayMode, scrollProgress, onNavigate }) {
    return (
        <Canvas
            camera={{ position: [0, 3, 15], fov: 55, near: 0.1, far: 300 }}
            dpr={[1, 1.5]}
            gl={{
                antialias: true,
                alpha: false,
                powerPreference: 'high-performance',
                toneMapping: 2, // ACESFilmic
                toneMappingExposure: 1.0,
            }}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: -1,
            }}
        >
            <Suspense fallback={null}>
                {/* ---- Night Mode: Solar System ---- */}
                {!isDayMode && (
                    <SolarSystem
                        isDayMode={isDayMode}
                        scrollProgress={scrollProgress}
                        onNavigate={onNavigate}
                    />
                )}

                {/* ---- Day Mode: Ocean Sunrise ---- */}
                {isDayMode && (
                    <>
                        <OceanScene isDayMode={isDayMode} scrollProgress={scrollProgress} />
                        <OceanCameraController
                            scrollProgress={scrollProgress}
                            isDayMode={isDayMode}
                        />
                    </>
                )}

                {/* ---- Post-Processing: Bloom for glows ---- */}
                <EffectComposer>
                    <Bloom
                        intensity={isDayMode ? 0.6 : 0.8}
                        luminanceThreshold={isDayMode ? 0.6 : 0.3}
                        luminanceSmoothing={0.9}
                        mipmapBlur
                    />
                </EffectComposer>
            </Suspense>
        </Canvas>
    )
}
