uniform float uTime;
uniform float uScrollY;

varying vec2 vUv;

void main() {
  float fogDensity = vUv.y;
  float sway = sin(vUv.x * 3.14159 + uTime * 0.3) * 0.12 + 0.88;
  float alpha = fogDensity * sway * 0.09;

  vec3 color = vec3(0.84, 0.94, 0.98); // ice color
  gl_FragColor = vec4(color, alpha);
}
