uniform float uTime;

varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

void main() {
  float n = noise(vUv * 3.0 + uTime * 0.2);
  float n2 = noise(vUv * 6.0 - uTime * 0.15);

  vec3 c1 = vec3(0.49, 0.79, 0.91);  // glacier
  vec3 c2 = vec3(1.0, 1.0, 1.0);     // white
  vec3 c3 = vec3(0.84, 0.94, 0.98);  // ice

  vec3 color = mix(mix(c1, c2, n), c3, sin(vUv.x * 3.14159) * 0.5);
  color = mix(color, c2, n2 * 0.25);

  float alpha = sin(vUv.x * 3.14159) * 0.18 * (n * 0.7 + 0.3);
  alpha *= (0.6 + 0.4 * sin(uTime * 0.4 + vUv.x * 2.0));

  gl_FragColor = vec4(color, alpha);
}
