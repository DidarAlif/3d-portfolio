import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

import OceanWater from './OceanWater'
import OceanStars from './OceanStars'
import OceanParticles from './OceanParticles'
import OceanSun from './OceanSun'
import OceanSky from './OceanSky'

export default function OceanScene({ isDayMode, scrollProgress }) {
    return (
        <>
            {/* Ambient lighting logic for natural ocean atmosphere */}
            <ambientLight intensity={isDayMode ? 0.4 : 0.05} />
            <hemisphereLight args={['#0a0a1a', '#050510', 0.3]} />

            {/* Custom Atmospheric Sub components */}
            <OceanSky isDayMode={isDayMode} />
            <OceanSun isDayMode={isDayMode} scrollProgress={scrollProgress} />
            
            {/* The procedural Shader Ocean */}
            <OceanWater />

            {/* Decorative 3D elements */}
            {!isDayMode && <OceanStars count={2000} isDayMode={isDayMode} />}
            <OceanParticles count={400} isDayMode={isDayMode} />

            {/* Distance Fog matching either day or night */}
            <fog attach="fog" args={[isDayMode ? '#FFaa66' : '#060d18', 40, 140]} />
        </>
    )
}
