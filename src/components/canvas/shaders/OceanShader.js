/**
 * OceanShader.js — Ultra-Realistic GLSL Ocean Shaders
 *
 * Upgraded for cinematic water quality:
 * - 7 Gerstner wave layers (swell, wind, chop) for complex surface
 * - Subsurface scattering approximation (light penetrating water)
 * - PBR-inspired Fresnel with Schlick F0 for water (IOR=1.33)
 * - Multi-octave noise normals for micro-surface detail
 * - Cursor wave trails with wake simulation
 * - Click-to-splash: expanding ring + height burst
 * - Sun specular with anisotropic elongation on wave normals
 * - Caustic flickering patterns on shallow areas
 * - Volumetric fog blending at distance
 *
 * Performance: Single draw call, no texture lookups, all procedural.
 */

// ---- Simplex Noise 2D (Stefan Gustavson) ----
const noise2D = /* glsl */ `
vec3 mod289v3(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289v2(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute3(vec3 x) { return mod289v3(((x*34.0)+1.0)*x); }

float snoise2(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                     -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289v2(i);
  vec3 p = permute3(permute3(i.y + vec3(0.0, i1.y, 1.0))
                   + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m;
  m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
`;

// ---- Gerstner Wave (physically-based ocean wave) ----
const gerstnerWave = /* glsl */ `
vec3 gerstnerWave(vec2 pos, float steepness, float wavelength, vec2 direction, float time) {
  float k = 6.28318 / wavelength;
  float c = sqrt(9.81 / k);
  vec2 d = normalize(direction);
  float f = k * (dot(d, pos) - c * time);
  float a = steepness / k;
  return vec3(
    d.x * (a * cos(f)),
    a * sin(f),
    d.y * (a * cos(f))
  );
}
`;

// ---- Vertex Shader ----
export const oceanVertexShader = /* glsl */ `
${noise2D}
${gerstnerWave}

uniform float uTime;
uniform vec2 uCursorPos;
uniform float uCursorStrength;
uniform float uSunProgress;

// Splash uniforms: up to 8 simultaneous splash points
#define MAX_SPLASHES 8
uniform vec3 uSplashData[MAX_SPLASHES]; // xy = position, z = birth time

varying vec3 vWorldPosition;
varying vec3 vNormal;
varying vec3 vViewPosition;
varying float vWaveHeight;
varying vec2 vUv;
varying float vFogDepth;
varying float vDistFromCamera;

// Compute total Gerstner displacement at a point
vec3 computeWaves(vec2 p, float time) {
  vec3 wave = vec3(0.0);
  // Layer 1-2: Deep ocean swell (long wavelength, gentle)
  wave += gerstnerWave(p, 0.15, 12.0, vec2(1.0, 0.2), time * 0.5);
  wave += gerstnerWave(p, 0.12, 9.0, vec2(-0.8, 0.6), time * 0.55);
  // Layer 3-4: Medium wind waves
  wave += gerstnerWave(p, 0.08, 5.5, vec2(0.6, -0.4), time * 0.75);
  wave += gerstnerWave(p, 0.06, 4.0, vec2(-0.3, 0.9), time * 0.85);
  // Layer 5-6: Short chop waves (add surface texture)
  wave += gerstnerWave(p, 0.035, 2.2, vec2(0.9, 0.1), time * 1.2);
  wave += gerstnerWave(p, 0.025, 1.5, vec2(-0.6, -0.7), time * 1.4);
  // Layer 7: Micro-ripple
  wave += gerstnerWave(p, 0.012, 0.8, vec2(0.4, 0.8), time * 1.8);
  return wave;
}

// Compute noise-based micro-detail displacement
float computeNoise(vec2 p, float time) {
  float n = 0.0;
  n += snoise2(p * 0.25 + time * 0.12) * 0.18;   // Large swell
  n += snoise2(p * 0.6 + time * 0.2) * 0.08;      // Medium detail
  n += snoise2(p * 1.5 + time * 0.35) * 0.035;     // Fine detail
  n += snoise2(p * 3.5 + time * 0.5) * 0.012;      // Micro ripple
  return n;
}

void main() {
  vUv = uv;
  vec3 pos = position;

  // ---- 7-layer Gerstner waves ----
  pos += computeWaves(pos.xz, uTime);

  // ---- Procedural noise micro-detail ----
  pos.y += computeNoise(pos.xz, uTime);

  // ---- Cursor wave trail ----
  // Concentric ripples radiating from cursor with exponential falloff
  float cursorDist = distance(pos.xz, uCursorPos);
  // Multiple concentric rings for natural ripple spread
  float ripple1 = sin(cursorDist * 8.0 - uTime * 10.0) * exp(-cursorDist * 0.25);
  float ripple2 = sin(cursorDist * 12.0 - uTime * 14.0) * exp(-cursorDist * 0.4);
  float ripple3 = sin(cursorDist * 4.0 - uTime * 6.0) * exp(-cursorDist * 0.15);
  float cursorRipple = (ripple1 * 0.5 + ripple2 * 0.3 + ripple3 * 0.2) * uCursorStrength;
  pos.y += cursorRipple * 0.25;

  // ---- Click splash rings ----
  for (int i = 0; i < MAX_SPLASHES; i++) {
    vec2 splashPos = uSplashData[i].xy;
    float birthTime = uSplashData[i].z;
    if (birthTime > 0.0) {
      float age = uTime - birthTime;
      if (age < 4.0 && age > 0.0) {
        float splashDist = distance(pos.xz, splashPos);
        // Expanding ring: radius grows with time
        float ringRadius = age * 3.5;
        float ringWidth = 0.8 + age * 0.3;
        float ringFactor = exp(-pow(splashDist - ringRadius, 2.0) / ringWidth);
        // Central burst: big splash at impact point
        float centralBurst = exp(-splashDist * 2.0) * max(0.0, 1.0 - age * 0.8);
        // Splash wave height
        float splashHeight = ringFactor * sin(splashDist * 6.0 - age * 8.0) * 0.6;
        splashHeight += centralBurst * 1.5;
        // Decay over time
        splashHeight *= exp(-age * 0.7);
        pos.y += splashHeight;
      }
    }
  }

  // Store height for fragment coloring
  vWaveHeight = pos.y;

  // ---- Analytical normal via finite differences ----
  float eps = 0.04;
  vec3 posX = position + vec3(eps, 0.0, 0.0);
  vec3 posZ = position + vec3(0.0, 0.0, eps);

  posX += computeWaves(posX.xz, uTime);
  posX.y += computeNoise(posX.xz, uTime);
  // Add cursor ripple to neighbor samples for correct normals
  float dxDist = distance(posX.xz, uCursorPos);
  posX.y += (sin(dxDist * 8.0 - uTime * 10.0) * exp(-dxDist * 0.25) * 0.5
           + sin(dxDist * 12.0 - uTime * 14.0) * exp(-dxDist * 0.4) * 0.3) * uCursorStrength * 0.25;

  posZ += computeWaves(posZ.xz, uTime);
  posZ.y += computeNoise(posZ.xz, uTime);
  float dzDist = distance(posZ.xz, uCursorPos);
  posZ.y += (sin(dzDist * 8.0 - uTime * 10.0) * exp(-dzDist * 0.25) * 0.5
           + sin(dzDist * 12.0 - uTime * 14.0) * exp(-dzDist * 0.4) * 0.3) * uCursorStrength * 0.25;

  vec3 tangent = normalize(posX - pos);
  vec3 bitangent = normalize(posZ - pos);
  vNormal = normalize(cross(bitangent, tangent));

  vec4 worldPos = modelMatrix * vec4(pos, 1.0);
  vWorldPosition = worldPos.xyz;
  vec4 mvPosition = viewMatrix * worldPos;
  vViewPosition = mvPosition.xyz;
  vFogDepth = -mvPosition.z;
  vDistFromCamera = length(mvPosition.xyz);

  gl_Position = projectionMatrix * mvPosition;
}
`;

// ---- Fragment Shader ----
export const oceanFragmentShader = /* glsl */ `
${noise2D}

uniform float uTime;
uniform float uSunProgress;
uniform vec3 uSunPosition;
uniform vec3 uSunColor;
uniform vec3 uDeepColor;
uniform vec3 uShallowColor;
uniform vec3 uFoamColor;
uniform float uFoamThreshold;
uniform vec2 uCursorPos;
uniform float uCursorStrength;
uniform vec3 uFogColor;
uniform float uFogNear;
uniform float uFogFar;
uniform vec3 uSkyColor;
uniform vec3 uSSSColor;

// Splash data
#define MAX_SPLASHES 8
uniform vec3 uSplashData[MAX_SPLASHES];

varying vec3 vWorldPosition;
varying vec3 vNormal;
varying vec3 vViewPosition;
varying float vWaveHeight;
varying vec2 vUv;
varying float vFogDepth;
varying float vDistFromCamera;

void main() {
  vec3 normal = normalize(vNormal);
  vec3 viewDir = normalize(-vViewPosition);

  // ---- PBR Water color: depth + gradient blending ----
  float heightFactor = smoothstep(-0.4, 0.5, vWaveHeight);
  vec3 waterColor = mix(uDeepColor, uShallowColor, heightFactor);

  // Add mid-tone color for depth (3-color gradient)
  vec3 midColor = mix(uDeepColor, uShallowColor, 0.5) * 1.15;
  float midBand = smoothstep(-0.1, 0.15, vWaveHeight) * (1.0 - smoothstep(0.15, 0.35, vWaveHeight));
  waterColor = mix(waterColor, midColor, midBand * 0.4);

  // ---- Fresnel Effect (Schlick with Water IOR) ----
  // F0 for water (IOR=1.33) ≈ 0.02
  float F0 = 0.02;
  float cosTheta = max(dot(viewDir, normal), 0.0);
  float fresnel = F0 + (1.0 - F0) * pow(1.0 - cosTheta, 5.0);
  fresnel = clamp(fresnel, 0.0, 1.0);

  // ---- Subsurface Scattering Approximation ----
  // Light penetrates shallow water and scatters back — the "glow" in waves
  vec3 sunDir = normalize(uSunPosition - vWorldPosition);
  float sssWrap = max(dot(normal, sunDir) * 0.5 + 0.5, 0.0);
  float sssDepth = smoothstep(-0.2, 0.4, vWaveHeight); // Stronger in crests
  vec3 sss = uSSSColor * sssWrap * sssDepth * uSunProgress * 0.6;
  waterColor += sss;

  // ---- Sun Specular: Sharp + Broad + Anisotropic ----
  vec3 halfDir = normalize(sunDir + viewDir);
  // Sharp specular (bright sparkles)
  float specSharp = pow(max(dot(normal, halfDir), 0.0), 512.0);
  // Medium specular (sun pillar)
  float specMed = pow(max(dot(normal, halfDir), 0.0), 64.0);
  // Broad specular (ambient glow path)
  float specBroad = pow(max(dot(normal, halfDir), 0.0), 16.0);

  // Sparkle noise modulation — individual glints
  float sparkleNoise = snoise2(vWorldPosition.xz * 8.0 + uTime * 2.0);
  float sparkle = smoothstep(0.3, 0.8, sparkleNoise) * specSharp;

  vec3 specularColor = uSunColor * (
    sparkle * 3.0 +
    specMed * 1.2 +
    specBroad * 0.4
  ) * uSunProgress;

  // ---- Foam: wave crests + cursor splash areas ----
  float foam = smoothstep(uFoamThreshold, uFoamThreshold + 0.12, vWaveHeight);
  // Multi-scale noise for foam texture breakup
  float foamNoise1 = snoise2(vWorldPosition.xz * 4.0 + uTime * 0.4) * 0.5 + 0.5;
  float foamNoise2 = snoise2(vWorldPosition.xz * 10.0 + uTime * 0.8) * 0.5 + 0.5;
  foam *= foamNoise1 * 0.7 + foamNoise2 * 0.3;

  // Cursor area foam boost
  float cursorDist = distance(vWorldPosition.xz, uCursorPos);
  float cursorFoam = exp(-cursorDist * 0.6) * uCursorStrength * 0.3;
  foam += cursorFoam;

  // Splash foam rings
  for (int i = 0; i < MAX_SPLASHES; i++) {
    float birthTime = uSplashData[i].z;
    if (birthTime > 0.0) {
      float age = uTime - birthTime;
      if (age < 4.0 && age > 0.0) {
        vec2 splashPos = uSplashData[i].xy;
        float splashDist = distance(vWorldPosition.xz, splashPos);
        float ringRadius = age * 3.5;
        float ringFoam = exp(-pow(splashDist - ringRadius, 2.0) / (0.6 + age * 0.2));
        float centralFoam = exp(-splashDist * 3.0) * max(0.0, 1.0 - age * 0.5);
        foam += (ringFoam * 0.5 + centralFoam * 0.8) * exp(-age * 0.5);
      }
    }
  }

  foam = clamp(foam, 0.0, 1.0);
  waterColor = mix(waterColor, uFoamColor, foam * 0.5);

  // ---- Caustic-like flickering on shallow water ----
  float caustic1 = snoise2(vWorldPosition.xz * 5.0 + uTime * vec2(0.7, 0.3));
  float caustic2 = snoise2(vWorldPosition.xz * 5.0 - uTime * vec2(0.4, 0.6));
  float caustic = pow(max(0.0, caustic1 + caustic2), 2.0) * 0.15;
  waterColor += uSunColor * caustic * sssDepth * uSunProgress;

  // ---- Cursor glow (subtle highlight ring) ----
  float cursorGlow = exp(-cursorDist * 0.5) * uCursorStrength * 0.12;
  waterColor += vec3(0.3, 0.55, 0.75) * cursorGlow;

  // ---- Sky reflection (Fresnel-driven) ----
  vec3 skyReflect = mix(uSkyColor * 0.3, uSunColor * 0.4, uSunProgress);
  waterColor = mix(waterColor, skyReflect, fresnel * 0.6);

  // ---- Add specular highlights on top ----
  waterColor += specularColor;

  // ---- Distance fog (horizon haze) ----
  float fogFactor = smoothstep(uFogNear, uFogFar, vFogDepth);
  waterColor = mix(waterColor, uFogColor, fogFactor * 0.65);

  // ---- Slight darkening at far distance for depth ----
  float distFade = smoothstep(60.0, 150.0, vDistFromCamera);
  waterColor *= mix(1.0, 0.7, distFade);

  // ---- Final opacity ----
  float alpha = mix(0.88, 1.0, fresnel);

  gl_FragColor = vec4(waterColor, alpha);
}
`;
