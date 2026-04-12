/**
 * OceanSky.jsx — Dynamic Gradient Sky Dome
 *
 * A large inverted sphere that serves as the sky backdrop,
 * using a custom shader for smooth gradient transitions:
 *
 * Day mode: Warm sunrise palette (deep orange horizon → soft blue zenith)
 * Night mode: Deep navy → star-studded dark sky
 *
 * The gradient follows the sun position for realistic sky coloring.
 * All colors are smoothly lerped via uniforms for seamless transitions.
 */

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// ---- Sky Vertex Shader ----
const skyVertexShader = /* glsl */ `
varying vec3 vWorldPosition;
varying vec2 vUv;

void main() {
  vUv = uv;
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPos.xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

// ---- Sky Fragment Shader ----
const skyFragmentShader = /* glsl */ `
uniform vec3 uTopColor;
uniform vec3 uMidColor;
uniform vec3 uHorizonColor;
uniform vec3 uBottomColor;
uniform float uSunProgress;
uniform float uSunY;
uniform vec3 uSunGlowColor;

varying vec3 vWorldPosition;
varying vec2 vUv;

void main() {
  // Normalized height: 0 at bottom, 1 at top of sky dome
  float h = normalize(vWorldPosition).y;

  // Three-band gradient sky
  vec3 color;
  if (h > 0.3) {
    // Upper sky (zenith)
    color = mix(uMidColor, uTopColor, smoothstep(0.3, 0.8, h));
  } else if (h > 0.0) {
    // Lower sky (above horizon)
    color = mix(uHorizonColor, uMidColor, smoothstep(0.0, 0.3, h));
  } else {
    // Below horizon (reflected gradient)
    color = mix(uBottomColor, uHorizonColor, smoothstep(-0.3, 0.0, h));
  }

  // Sun glow near the horizon
  // Radial falloff from sun position
  vec3 sunDir = normalize(vec3(0.0, max(uSunY * 0.01, -0.02), -1.0));
  float sunAngle = max(dot(normalize(vWorldPosition), sunDir), 0.0);
  float sunGlow = pow(sunAngle, 8.0) * uSunProgress;
  float sunHalo = pow(sunAngle, 32.0) * uSunProgress * 0.8;

  color += uSunGlowColor * sunGlow * 0.6;
  color += uSunGlowColor * sunHalo;

  // Gentle vignette at poles for depth
  float vignette = smoothstep(-0.5, 0.2, h);
  color *= mix(0.5, 1.0, vignette);

  gl_FragColor = vec4(color, 1.0);
}
`

export default function OceanSky({ isDayMode, sunProgress, sunY }) {
    const materialRef = useRef()

    // Uniforms
    const uniforms = useMemo(() => ({
        uTopColor: { value: new THREE.Color('#0a0a1a') },
        uMidColor: { value: new THREE.Color('#0d1b2a') },
        uHorizonColor: { value: new THREE.Color('#1a1a2e') },
        uBottomColor: { value: new THREE.Color('#050510') },
        uSunProgress: { value: 0 },
        uSunY: { value: -4 },
        uSunGlowColor: { value: new THREE.Color('#FF6633') },
    }), [])

    // Day color palette (sunrise → bright day)
    const dayColors = useMemo(() => ({
        top: new THREE.Color('#4a8bcc'),
        mid: new THREE.Color('#7ab8e0'),
        horizon: new THREE.Color('#FFaa66'),
        bottom: new THREE.Color('#FF7744'),
        sunGlow: new THREE.Color('#FFaa55'),
    }), [])

    // Night color palette
    const nightColors = useMemo(() => ({
        top: new THREE.Color('#020510'),
        mid: new THREE.Color('#060d1a'),
        horizon: new THREE.Color('#0a1525'),
        bottom: new THREE.Color('#050510'),
        sunGlow: new THREE.Color('#223355'),
    }), [])

    useFrame(() => {
        if (!materialRef.current) return
        const u = materialRef.current.uniforms
        const lerpSpeed = 0.015
        const target = isDayMode ? dayColors : nightColors

        u.uTopColor.value.lerp(target.top, lerpSpeed)
        u.uMidColor.value.lerp(target.mid, lerpSpeed)
        u.uHorizonColor.value.lerp(target.horizon, lerpSpeed)
        u.uBottomColor.value.lerp(target.bottom, lerpSpeed)
        u.uSunGlowColor.value.lerp(target.sunGlow, lerpSpeed)
        u.uSunProgress.value += (sunProgress - u.uSunProgress.value) * 0.02
        u.uSunY.value += ((sunY || -4) - u.uSunY.value) * 0.02
    })

    return (
        <mesh>
            {/* Large inverted sphere as sky dome */}
            <sphereGeometry args={[150, 64, 64]} />
            <shaderMaterial
                ref={materialRef}
                vertexShader={skyVertexShader}
                fragmentShader={skyFragmentShader}
                uniforms={uniforms}
                side={THREE.BackSide}
                depthWrite={false}
            />
        </mesh>
    )
}
