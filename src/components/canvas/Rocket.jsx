/**
 * Rocket.jsx — Ultra-Realistic 3D Rocket in the Solar System
 * 
 * A detailed rocket model built from Three.js primitives:
 * - Metallic nose cone
 * - Cylindrical fuselage with panel details
 * - Aerodynamic tail fins
 * - Glowing exhaust flame with particle trail
 * - Point light for engine glow
 * 
 * Flight Behavior:
 * - DEFAULT: Autonomously traverses a Lissajous curve through the solar system
 *   x = A*sin(a*t + δ), y = B*sin(b*t), z = C*cos(c*t)
 *   This creates a beautiful, non-repeating 3D figure-eight path
 * 
 * - ON MOUSE: When cursor moves, the rocket smoothly steers toward
 *   the cursor's projected 3D position (raycasted onto a plane)
 * 
 * The rocket always rotates to face its velocity direction using
 * quaternion-based lookAt rotation for smooth, gimbal-lock-free turning.
 */

import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// Exhaust particle trail
function ExhaustTrail({ rocketRef }) {
    const trailCount = 40
    const meshRef = useRef()

    const { positions, ages } = useMemo(() => {
        const positions = new Float32Array(trailCount * 3)
        const ages = new Float32Array(trailCount)
        for (let i = 0; i < trailCount; i++) {
            ages[i] = i / trailCount // Stagger ages so they fade out sequentially
        }
        return { positions, ages }
    }, [trailCount])

    useFrame(() => {
        if (!meshRef.current || !rocketRef.current) return

        const geo = meshRef.current.geometry
        const posAttr = geo.attributes.position
        const rocketPos = rocketRef.current.position

        // Shift all particles down one slot (oldest dies, newest spawns at rocket)
        for (let i = trailCount - 1; i > 0; i--) {
            posAttr.array[i * 3] = posAttr.array[(i - 1) * 3] + (Math.random() - 0.5) * 0.03
            posAttr.array[i * 3 + 1] = posAttr.array[(i - 1) * 3 + 1] + (Math.random() - 0.5) * 0.03
            posAttr.array[i * 3 + 2] = posAttr.array[(i - 1) * 3 + 2] + (Math.random() - 0.5) * 0.03
        }

        // Newest particle at rocket position (offset to exhaust nozzle)
        const backward = new THREE.Vector3(0, 0, 0.4)
        backward.applyQuaternion(rocketRef.current.quaternion)
        posAttr.array[0] = rocketPos.x + backward.x
        posAttr.array[1] = rocketPos.y + backward.y
        posAttr.array[2] = rocketPos.z + backward.z

        posAttr.needsUpdate = true
    })

    return (
        <points ref={meshRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    array={positions}
                    count={trailCount}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                color="#0ea5e9"
                size={0.15}
                transparent
                opacity={0.8}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                sizeAttenuation
            />
        </points>
    )
}

export default function Rocket() {
    const groupRef = useRef()
    const { camera, size } = useThree()

    // Flight state
    const state = useRef({
        position: new THREE.Vector3(5, 2, 8),
        velocity: new THREE.Vector3(0.02, 0.01, -0.01),
        targetDir: new THREE.Vector3(1, 0, 0),
        mouseActive: false,
        mouseTimeout: null,
        mouse3D: new THREE.Vector3(),
    })

    // Raycaster for projecting mouse into 3D space
    const raycaster = useMemo(() => new THREE.Raycaster(), [])
    const mouseNDC = useMemo(() => new THREE.Vector2(), [])
    const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), [])

    useFrame(({ clock }, delta) => {
        if (!groupRef.current) return
        const t = clock.getElapsedTime()
        const s = state.current
        const dt = Math.min(delta, 0.05) // Cap delta to prevent jumps

        // Read mouse position from window (set by CustomCursor)
        const mx = window.__mouseX || 0
        const my = window.__mouseY || 0
        const mouseMoving = Math.abs(mx) > 0.01 || Math.abs(my) > 0.01

        if (mouseMoving) {
            s.mouseActive = true
            clearTimeout(s.mouseTimeout)
            s.mouseTimeout = setTimeout(() => { s.mouseActive = false }, 2000)

            // Project mouse into 3D world
            mouseNDC.set(mx, -my)
            raycaster.setFromCamera(mouseNDC, camera)
            const intersection = new THREE.Vector3()
            raycaster.ray.intersectPlane(plane, intersection)
            if (intersection) {
                s.mouse3D.copy(intersection)
            }
        }

        // Compute target direction
        if (s.mouseActive) {
            // Steer toward mouse 3D position
            s.targetDir.copy(s.mouse3D).sub(s.position).normalize()
        } else {
            // Autonomous flight: Lissajous curve path
            // x = 15*sin(0.3t), y = 3*sin(0.5t) + 2, z = 12*cos(0.2t)
            const pathPos = new THREE.Vector3(
                15 * Math.sin(0.3 * t),
                3 * Math.sin(0.5 * t) + 2,
                12 * Math.cos(0.2 * t)
            )
            s.targetDir.copy(pathPos).sub(s.position).normalize()
        }

        // Smooth velocity steering (lerp toward target direction)
        const speed = 6.0 // Units per second
        const steerStrength = s.mouseActive ? 3.0 : 2.0
        s.velocity.lerp(s.targetDir.clone().multiplyScalar(speed), steerStrength * dt)
        s.velocity.clampLength(0, speed)

        // Update position
        s.position.add(s.velocity.clone().multiplyScalar(dt))
        groupRef.current.position.copy(s.position)

        // Rotate rocket to face velocity direction (quaternion lookAt)
        if (s.velocity.length() > 0.01) {
            const lookTarget = s.position.clone().add(s.velocity)
            const dummy = new THREE.Object3D()
            dummy.position.copy(s.position)
            dummy.lookAt(lookTarget)
            // Offset: rocket model points along -Z, so rotate 180°
            dummy.rotateY(Math.PI)
            groupRef.current.quaternion.slerp(dummy.quaternion, 4.0 * dt)
        }
    })

    return (
        <>
            <group ref={groupRef} scale={0.45}>
                {/* === NOSE CONE (Titanium) === */}
                <mesh position={[0, 0, -1.3]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                    <coneGeometry args={[0.18, 0.6, 32]} />
                    <meshStandardMaterial 
                        color="#d4d4d8" 
                        roughness={0.2} 
                        metalness={0.9} 
                        envMapIntensity={2.0} 
                    />
                </mesh>

                {/* === MAIN STAGE FUSELAGE (Carbon Fiber/White PBR) === */}
                <mesh position={[0, 0, -0.4]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                    <cylinderGeometry args={[0.18, 0.2, 1.2, 32]} />
                    <meshStandardMaterial 
                        color="#e4e4e7" 
                        roughness={0.15} 
                        metalness={0.8} 
                        clearcoat={1.0}
                        clearcoatRoughness={0.1}
                    />
                </mesh>

                {/* === METALLIC RINGS (Decals) === */}
                {[-0.8, -0.1, 0.3].map((z, i) => (
                    <mesh key={`ring-${i}`} position={[0, 0, z]} rotation={[Math.PI / 2, 0, 0]}>
                        <cylinderGeometry args={[0.19, 0.19, 0.05, 32]} />
                        <meshStandardMaterial 
                            color={i === 1 ? "#ef4444" : "#3f3f46"} 
                            roughness={0.4} 
                            metalness={0.7} 
                        />
                    </mesh>
                ))}

                {/* === LIQUID FUEL BOOSTER SECTION === */}
                <mesh position={[0, 0, 0.45]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                    <cylinderGeometry args={[0.2, 0.25, 0.5, 32]} />
                    <meshStandardMaterial 
                        color="#18181b" 
                        roughness={0.5} 
                        metalness={0.6} 
                    />
                </mesh>

                {/* === MULTI-TRIPLET ENGINE NOZZLES === */}
                {[[-0.08, 0.08], [0.08, 0.08], [0, -0.08]].map((pos, i) => (
                    <mesh key={`nozzle-${i}`} position={[pos[0], pos[1], 0.75]} rotation={[Math.PI / 2, 0, 0]}>
                        <cylinderGeometry args={[0.08, 0.12, 0.2, 16]} />
                        <meshStandardMaterial 
                            color="#27272a" 
                            roughness={0.7} 
                            metalness={0.8} 
                        />
                    </mesh>
                ))}

                {/* === AERODYNAMIC WING FINS === */}
                {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((angle, i) => (
                    <mesh
                        key={`fin-${i}`}
                        position={[
                            Math.sin(angle) * 0.28,
                            Math.cos(angle) * 0.28,
                            0.4
                        ]}
                        rotation={[0, 0, -angle]}
                    >
                        {/* Custom swept wing using a rotated box and scale */}
                        <boxGeometry args={[0.04, 0.25, 0.5]} />
                        <meshStandardMaterial
                            color="#18181b"
                            roughness={0.3}
                            metalness={0.7}
                        />
                    </mesh>
                ))}

                {/* === GLASS PORTHOLES (Cockpit) === */}
                {[-0.6, -0.3].map((z, i) => (
                    <group key={`window-${i}`} position={[0.178, 0, z]} rotation={[0, Math.PI / 2, 0]}>
                        {/* Window Frame */}
                        <mesh>
                            <torusGeometry args={[0.06, 0.015, 16, 32]} />
                            <meshStandardMaterial color="#3f3f46" metalness={0.9} roughness={0.2} />
                        </mesh>
                        {/* Glass Pane */}
                        <mesh position={[0, 0, -0.01]}>
                            <circleGeometry args={[0.06, 32]} />
                            <meshPhysicalMaterial 
                                color="#0ea5e9"
                                transmission={0.9}
                                opacity={1}
                                metalness={0}
                                roughness={0}
                                ior={1.5}
                                thickness={0.5}
                                emissive="#0284c7"
                                emissiveIntensity={0.5}
                            />
                        </mesh>
                    </group>
                ))}

                {/* === PRIMARY SUPER-HEATED PLASMA EXHAUST === */}
                <mesh position={[0, 0, 0.9]}>
                    <coneGeometry args={[0.18, 0.8, 16]} />
                    <meshBasicMaterial 
                        color="#38bdf8" 
                        transparent 
                        opacity={0.8} 
                        blending={THREE.AdditiveBlending}
                        depthWrite={false}
                    />
                </mesh>
                
                {/* Secondary core plasma */}
                <mesh position={[0, 0, 0.85]}>
                    <coneGeometry args={[0.1, 0.5, 16]} />
                    <meshBasicMaterial 
                        color="#ffffff" 
                        transparent 
                        opacity={0.9} 
                        blending={THREE.AdditiveBlending}
                        depthWrite={false}
                    />
                </mesh>

                {/* Engine light / Plasma glow */}
                <pointLight
                    position={[0, 0, 1.0]}
                    color="#0ea5e9"
                    intensity={3.0}
                    distance={12}
                    decay={1.5}
                />
            </group>

            {/* Exhaust particle trail */}
            <ExhaustTrail rocketRef={groupRef} />
        </>
    )
}
