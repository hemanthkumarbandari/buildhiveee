uniform float uTime;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;

void main() {
  vec3 baseColor = vec3(0.84, 0.94, 0.98);
  vec3 deepColor = vec3(0.49, 0.79, 0.91);

  vec3 normal = normalize(vNormal);
  vec3 viewDir = normalize(cameraPosition - vPosition);
  float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);

  float caustic = sin(vPosition.x * 4.0 + uTime) *
                  cos(vPosition.z * 3.0 + uTime * 0.8) * 0.5 + 0.5;

  float shimmer = sin(vUv.x * 20.0 + uTime * 2.0) *
                  sin(vUv.y * 18.0 + uTime * 1.7) * 0.04 + 0.96;

  vec3 color = mix(baseColor, deepColor, fresnel + caustic * 0.2);
  color *= shimmer;

  gl_FragColor = vec4(color, 0.35 + fresnel * 0.2);
}
