'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';

const CSS = `
@keyframes snowmanFloat {
  0%, 100% { transform: translateY(0px) rotate(-0.8deg); }
  50%       { transform: translateY(-18px) rotate(0.8deg); }
}
.snowman-img {
  animation: snowmanFloat 4.5s ease-in-out infinite;
  transform-origin: bottom center;
  width: 100%;
  max-width: 460px;
  height: auto;
  display: block;
  user-select: none;
  pointer-events: none;
}
.snowman-img.leaning {
  animation: none;
}
@keyframes scarfRipple {
  0%, 100% { transform: translateY(0px) skewX(0deg); }
  25%       { transform: translateY(-2px) skewX(1.5deg); }
  75%       { transform: translateY(1px) skewX(-1deg); }
}
`;

export default function SnowmanHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef       = useRef<HTMLImageElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const shadowRef    = useRef<HTMLDivElement>(null);
  const scarfRef     = useRef<HTMLDivElement>(null);
  const rafRef       = useRef<number | undefined>(undefined);
  const mouse        = useRef({ x: -9999, y: -9999 });
  const currentLean  = useRef(0);
  const targetLean   = useRef(0);

  const particles = useRef(
    Array.from({ length: 10 }, (_, i) => ({
      angle:   (i / 10) * Math.PI * 2,
      radius:  150 + Math.random() * 70,
      speed:   0.003 + Math.random() * 0.004,
      size:    2 + Math.random() * 3,
      opacity: 0.2 + Math.random() * 0.5,
      yRatio:  0.38,
    }))
  );

  useEffect(() => {
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const loop = () => {
      const container = containerRef.current;
      const canvas    = canvasRef.current;
      const img       = imgRef.current;
      const shadow    = shadowRef.current;
      const scarf     = scarfRef.current;

      if (!container || !canvas || !img || !shadow) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      const rect    = container.getBoundingClientRect();
      const centerX = rect.left + rect.width  * 0.5;
      const centerY = rect.top  + rect.height * 0.52;
      const mx      = mouse.current.x;
      const my      = mouse.current.y;
      const dx      = mx - centerX;
      const dy      = my - centerY;
      const dist    = Math.sqrt(dx * dx + dy * dy);
      const normDX  = dx / window.innerWidth;

      // — LEAN —
      targetLean.current  = normDX * -8;
      currentLean.current = lerp(currentLean.current, targetLean.current, 0.06);
      img.style.transform = `rotate(${currentLean.current}deg) translateX(${currentLean.current * 1.5}px)`;
      img.classList.toggle('leaning', Math.abs(currentLean.current) > 0.3);

      // — SHADOW —
      const shadowScaleX  = 1 + Math.abs(normDX) * 0.5;
      const shadowOffsetX = normDX * 20;
      shadow.style.transform = `translateX(calc(-50% + ${shadowOffsetX}px)) scaleX(${shadowScaleX})`;

      // — SCARF PROXIMITY —
      const near = dist < 200;
      if (scarf) scarf.style.animation = near ? 'scarfRipple 0.6s ease-in-out infinite' : 'none';

      // — CANVAS: light ray + halo particles —
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const cw      = canvas.width;
        const ch      = canvas.height;
        const localCX = rect.width  * 0.5;
        const localCY = rect.height * 0.52;
        ctx.clearRect(0, 0, cw, ch);

        // Light ray
        const angle     = Math.atan2(localCY - (my - rect.top), localCX - (mx - rect.left));
        const intensity = Math.max(0, 1 - dist / 600);
        const grd = ctx.createRadialGradient(localCX, localCY, 0, localCX, localCY, cw * 0.45);
        grd.addColorStop(0,   `rgba(180,220,255,${intensity * 0.13})`);
        grd.addColorStop(0.5, `rgba(100,160,255,${intensity * 0.06})`);
        grd.addColorStop(1,   'rgba(0,0,0,0)');
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(localCX, localCY);
        ctx.arc(localCX, localCY, cw * 0.5, angle - 0.65, angle + 0.65);
        ctx.closePath();
        ctx.fillStyle = grd;
        ctx.fill();
        ctx.restore();

        // Halo particles
        particles.current.forEach(p => {
          p.angle += p.speed;
          const px = localCX + Math.cos(p.angle) * p.radius;
          const py = localCY + Math.sin(p.angle) * p.radius * p.yRatio;
          ctx.beginPath();
          ctx.arc(px, py, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(200,225,255,${p.opacity})`;
          ctx.fill();
        });
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    // — MOUSE MOVE —
    const onMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    // — CLICK BURST —
    const onHeroClick = (e: MouseEvent) => {
      for (let i = 0; i < 12; i++) {
        const el    = document.createElement('div');
        const angle = (i / 12) * Math.PI * 2;
        const speed = 60 + Math.random() * 80;
        const size  = 4 + Math.random() * 6;
        Object.assign(el.style, {
          position:     'fixed',
          left:         e.clientX + 'px',
          top:          e.clientY + 'px',
          width:        size + 'px',
          height:       size + 'px',
          borderRadius: '50%',
          background:   'rgba(200,230,255,0.9)',
          pointerEvents:'none',
          zIndex:       '9999',
          transform:    'translate(-50%, -50%)',
        });
        document.body.appendChild(el);
        requestAnimationFrame(() => {
          el.style.transition = 'all 0.8s cubic-bezier(0.25,0.46,0.45,0.94)';
          el.style.transform  = `translate(calc(-50% + ${Math.cos(angle) * speed}px), calc(-50% + ${Math.sin(angle) * speed - 40}px)) scale(0)`;
          el.style.opacity    = '0';
        });
        setTimeout(() => el.remove(), 900);
      }
    };

    // — CANVAS RESIZE —
    const resizeCanvas = () => {
      const c  = containerRef.current;
      const cv = canvasRef.current;
      if (c && cv) {
        cv.width  = c.offsetWidth;
        cv.height = c.offsetHeight;
      }
    };

    const section = containerRef.current?.closest('section');

    window.addEventListener('mousemove', onMouseMove);
    section?.addEventListener('click', onHeroClick as EventListener);
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      section?.removeEventListener('click', onHeroClick as EventListener);
      window.removeEventListener('resize', resizeCanvas);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <style>{CSS}</style>

      <div
        ref={containerRef}
        style={{
          position:       'relative',
          width:          '100%',
          height:         '100%',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
        }}
      >
        {/* Ambient glow behind snowman */}
        <div style={{
          position:      'absolute',
          inset:         0,
          background:    'radial-gradient(ellipse 55% 70% at 50% 55%, rgba(80,140,255,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Light ray + halo canvas */}
        <canvas
          ref={canvasRef}
          style={{
            position:      'absolute',
            inset:         0,
            pointerEvents: 'none',
            zIndex:        1,
          }}
        />

        {/* Snowman image — priority because it is the hero LCP element */}
        <div ref={imgRef} className="snowman-img" style={{ position: 'relative', zIndex: 2, maxWidth: 460, width: '100%' }}>
          <Image
            src="/snowman.webp"
            alt="BuildHive Studio Snowman"
            width={920}
            height={1080}
            priority
            draggable={false}
            style={{ width: '100%', height: 'auto', userSelect: 'none', pointerEvents: 'none', display: 'block' }}
          />
        </div>

        {/* Scarf ripple overlay */}
        <div
          ref={scarfRef}
          style={{
            position:      'absolute',
            top:           '52%',
            left:          '25%',
            width:         '50%',
            height:        '14%',
            pointerEvents: 'none',
            zIndex:        3,
          }}
        />

        {/* Ground shadow */}
        <div
          ref={shadowRef}
          style={{
            position:        'absolute',
            bottom:          '3%',
            left:            '50%',
            width:           '50%',
            height:          '20px',
            background:      'radial-gradient(ellipse, rgba(0,0,0,0.4) 0%, transparent 70%)',
            filter:          'blur(8px)',
            transformOrigin: 'center',
            pointerEvents:   'none',
            zIndex:          1,
          }}
        />
      </div>
    </>
  );
}
