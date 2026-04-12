/**
 * AtmosphereShader.js — Rayleigh & Mie Scattering Approximation
 * 
 * Creates a volumetric atmospheric glow around planets.
 * Uses simplified Rayleigh scattering:
 * 
 * Math:
 * - Rayleigh scattering intensity ∝ 1/λ^4 (shorter wavelengths scatter more)
 *   Blue light scatters ~5.5x more than red, creating Earth's blue atmosphere edge
 * - The Fresnel term (1 - dot(view, normal))^power approximates the
 *   path length through atmosphere — longer at edges (limb), shorter face-on
 * - Mie scattering is forward-dominant, creating a halo around the planet
 *   when light source is behind the camera
 */

export const atmosphereVertexShader = /* glsl */`
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vWorldPosition;

void main() {
  vNormal = normalize(normalMatrix * normal);
  vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
  vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const atmosphereFragmentShader = /* glsl */`
uniform vec3 uAtmosphereColor;
uniform vec3 uLightPosition;
uniform float uAtmosphereIntensity;
uniform float uAtmospherePower;
uniform float uMieStrength;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vWorldPosition;

void main() {
  vec3 viewDir = normalize(-vPosition);
  vec3 lightDir = normalize(uLightPosition - vWorldPosition);
  
  // Rayleigh scattering approximation
  // Fresnel factor simulates increased optical path length at limb
  float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), uAtmospherePower);
  
  // Day/night terminator: atmosphere brighter on sun-facing side
  float sunFacing = max(dot(vNormal, lightDir), 0.0);
  float atmosphere = fresnel * (0.5 + 0.5 * sunFacing);
  
  // Mie scattering: forward scattering halo
  // cos(θ) between view direction and light direction
  float cosTheta = dot(viewDir, lightDir);
  // Henyey-Greenstein phase function approximation (g = 0.7 for forward scattering)
  float g = 0.7;
  float mie = (1.0 - g * g) / pow(1.0 + g * g - 2.0 * g * cosTheta, 1.5);
  mie = max(mie, 0.0) * uMieStrength;
  
  // Combined scattering
  float intensity = (atmosphere + mie * 0.1) * uAtmosphereIntensity;
  
  // Color with slight wavelength-dependent scattering
  // Shorter wavelengths (blue) scatter more at edges
  vec3 color = uAtmosphereColor;
  color += vec3(0.1, 0.15, 0.3) * fresnel * 0.3;  // Blue edge boost
  
  gl_FragColor = vec4(color * intensity, intensity * 0.85);
}
`;
