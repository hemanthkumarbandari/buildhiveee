import Lenis from 'lenis'

export type LenisInstance = InstanceType<typeof Lenis>

export function createLenis(): LenisInstance {
  return new Lenis({
    lerp: 0.1,
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1.0,
    touchMultiplier: 1.8,
    infinite: false,
    autoResize: true,
  } as ConstructorParameters<typeof Lenis>[0])
}
