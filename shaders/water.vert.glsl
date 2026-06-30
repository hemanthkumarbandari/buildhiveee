uniform float uTime;
uniform float uWaveHeight;
uniform float uScrollY;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;

void main() {
  vUv = uv;
  vec3 pos = position;

  float wave1 = sin(pos.x * 1.8 + uTime * 1.2) * cos(pos.z * 1.4 + uTime * 0.9);
  float wave2 = sin(pos.x * 0.9 + pos.z * 1.1 + uTime * 0.7) * 0.5;
  float wave3 = cos(pos.x * 2.5 + uTime * 1.8) * 0.3;

  pos.y += (wave1 + wave2 + wave3) * uWaveHeight;
  pos.y += uScrollY * 0.001;

  vNormal = normalMatrix * normal;
  vPosition = pos;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
