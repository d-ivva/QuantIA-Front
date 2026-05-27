import { useEffect, useRef } from 'react';

const BLOBS = [
  { x: 0.15, y: 0.25, r: 0.5,  rgb: [30,  0,  90], vx:  0.00012, vy:  0.00008 },
  { x: 0.75, y: 0.65, r: 0.45, rgb: [0,   60, 100], vx: -0.00009, vy:  0.00013 },
  { x: 0.55, y: 0.08, r: 0.35, rgb: [90,  0,  70],  vx:  0.00011, vy: -0.00009 },
  { x: 0.85, y: 0.85, r: 0.4,  rgb: [0,   30,  90], vx: -0.00007, vy: -0.00011 },
  { x: 0.35, y: 0.75, r: 0.3,  rgb: [60,  0, 100],  vx:  0.00008, vy:  0.00006 },
];

export default function AnimatedBackground({ mousePosRef }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let raf;

    const blobs = BLOBS.map(b => ({ ...b }));
    let particles = [];

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = Array.from({ length: 90 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.4 + 0.4,
        base: Math.random() * 0.25 + 0.08,
      }));
    };

    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const { width, height } = canvas;
      const mx = mousePosRef?.current?.x ?? width / 2;
      const my = mousePosRef?.current?.y ?? height / 2;

      ctx.fillStyle = '#020817';
      ctx.fillRect(0, 0, width, height);

      // Aurora blobs
      blobs.forEach(b => {
        b.x += b.vx;
        b.y += b.vy;
        if (b.x < -0.3 || b.x > 1.3) b.vx *= -1;
        if (b.y < -0.3 || b.y > 1.3) b.vy *= -1;

        const grd = ctx.createRadialGradient(
          b.x * width, b.y * height, 0,
          b.x * width, b.y * height, b.r * Math.max(width, height),
        );
        const [r, g, bv] = b.rgb;
        grd.addColorStop(0, `rgba(${r},${g},${bv},0.18)`);
        grd.addColorStop(0.5, `rgba(${r},${g},${bv},0.07)`);
        grd.addColorStop(1, 'transparent');
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, width, height);
      });

      // Particles
      particles.forEach((p, i) => {
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist2 = dx * dx + dy * dy;

        if (dist2 < 14400) { // 120^2
          const dist = Math.sqrt(dist2);
          const force = (120 - dist) / 120;
          p.vx += (dx / dist) * force * 0.018;
          p.vy += (dy / dist) * force * 0.018;
        }

        p.vx *= 0.982;
        p.vy *= 0.982;
        p.x  += p.vx;
        p.y  += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const md = Math.sqrt(dist2);
        const glow = md < 160 ? (1 - md / 160) * 0.55 : 0;
        const op  = Math.min(1, p.base + glow);

        // Draw connection to nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const q   = particles[j];
          const ddx = p.x - q.x;
          const ddy = p.y - q.y;
          const d2  = ddx * ddx + ddy * ddy;
          if (d2 < 8100) { // 90^2
            const lineOp = (1 - Math.sqrt(d2) / 90) * 0.12;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(100,200,255,${lineOp})`;
            ctx.lineWidth = 0.4;
            ctx.stroke();
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r + glow * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${Math.round(120 + glow * 135)},${Math.round(180 + glow * 75)},255,${op})`;
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ background: '#020817' }}
    />
  );
}
