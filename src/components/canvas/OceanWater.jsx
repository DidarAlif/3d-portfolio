import { useRef, useMemo, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { oceanVertexShader, oceanFragmentShader } from './shaders/OceanShader'

export default function OceanWater() {
    const meshRef = useRef()
    const materialRef = useRef()
    const { camera, size } = useThree()
    
    // Manage splash state
    const [splashes, setSplashes] = useState([])
    const splashIndex = useRef(0)

    // Raycaster for intersection
    const raycaster = useMemo(() => new THREE.Raycaster(), [])
    const mouseNDC = useMemo(() => new THREE.Vector2(), [])
    const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0.5), [])
    
    // Create the geometry and pre-rotate it to explicitly match the shader's XZ math coordinate layout
    const geom = useMemo(() => {
        const geometry = new THREE.PlaneGeometry(1000, 1000, 256, 256)
        geometry.rotateX(-Math.PI / 2) // CRITICAL: Aligns plane natively with the world floor
        return geometry
    }, [])

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uCursorPos: { value: new THREE.Vector2(0, 0) },
        uCursorStrength: { value: 0.0 },
        uSplashData: { value: Array(8).fill(new THREE.Vector3(0, 0, 0)) },
        uSunProgress: { value: 0.5 },
        uSunPosition: { value: new THREE.Vector3(0, 100, -200) },
        uSunColor: { value: new THREE.Color("#ffaa66") },
        uDeepColor: { value: new THREE.Color("#020b16") },
        uShallowColor: { value: new THREE.Color("#086278") },
        uFoamColor: { value: new THREE.Color("#ffffff") },
        uFoamThreshold: { value: 0.35 },
        uFogColor: { value: new THREE.Color("#060d18") },
        uFogNear: { value: 30.0 },
        uFogFar: { value: 120.0 },
        uSkyColor: { value: new THREE.Color("#020813") },
        uSSSColor: { value: new THREE.Color("#00ffcc") },
    }), [])

    useFrame(({ clock }, delta) => {
        if (!materialRef.current) return
        const t = clock.getElapsedTime()
        materialRef.current.uniforms.uTime.value = t

        // Handle cursor tracking for wave ripples using smooth decay
        const mx = window.__mouseX || 0
        const my = window.__mouseY || 0
        
        const isHovering = Math.abs(mx) > 0.05 || Math.abs(my) > 0.05
        const targetStrength = isHovering ? 1.0 : 0.0
        
        materialRef.current.uniforms.uCursorStrength.value = THREE.MathUtils.lerp(
            materialRef.current.uniforms.uCursorStrength.value,
            targetStrength,
            delta * 5.0
        )

        // Project window mouse variables onto the water plane natively
        if (isHovering) {
            mouseNDC.set(mx, -my)
            raycaster.setFromCamera(mouseNDC, camera)
            const intersection = new THREE.Vector3()
            raycaster.ray.intersectPlane(plane, intersection)
            if (intersection) {
                materialRef.current.uniforms.uCursorPos.value.set(intersection.x, intersection.z)
            }
        }
        
        // Update splash uniforms
        for(let i=0; i<8; i++) {
            if (splashes[i]) {
                materialRef.current.uniforms.uSplashData.value[i].copy(splashes[i])
            }
        }
    })

    const handlePointerDown = (e) => {
        // Find 3D intersection point triggered by React Three Fiber click
        if(e.point) {
            const time = performance.now() / 1000.0 // Ensure synchronicity with Shader uTime
            const newSplash = new THREE.Vector3(e.point.x, e.point.z, time)
            
            setSplashes(prev => {
                const next = [...prev]
                // Circularly replace oldest splashes up to shader limit size (8)
                const index = splashIndex.current % 8
                next[index] = newSplash
                splashIndex.current += 1
                return next
            })
        }
    }

    return (
        <mesh 
            ref={meshRef} 
            geometry={geom} 
            position={[0, -0.5, 0]} 
            onPointerDown={handlePointerDown}
        >
            <shaderMaterial
                ref={materialRef}
                vertexShader={oceanVertexShader}
                fragmentShader={oceanFragmentShader}
                uniforms={uniforms}
                transparent={true}
            />
        </mesh>
    )
}
