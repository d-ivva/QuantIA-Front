import { useEffect, useRef } from 'react';

const RINGS = [
  { rx: 110, ry: 34, speed: 0.45,  dash: [9, 6],  color: [0, 212, 255],   w: 1.5 },
  { rx: 85,  ry: 52, speed: -0.28, dash: [5, 9],  color: [140, 70, 255],  w: 1.2 },
  { rx: 140, ry: 22, speed: 0.18,  dash: [14, 5], color: [0,  170, 255],  w: 0.9 },
  { rx: 68,  ry: 65, speed: -0.55, dash: [3, 12], color: [200, 80, 255],  w: 0.7 },
];

const DATA_LABELS = ['AUTH', 'JWT', 'RBAC', 'TLS', 'SSO', 'OIDC'];

export default function FuturisticPanel({ mousePosRef, cardRef }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let raf;
    let time = 0;

    const SIZE = 420;
    canvas.width  = SIZE;
    canvas.height = SIZE;
    const CX = SIZE / 2;
    const CY = SIZE / 2;

    const floatingDots = Array.from({ length: 16 }, (_, i) => {
      const angle = (i / 16) * Math.PI * 2;
      return {
        angle,
        radius: 155 + Math.sin(i * 1.3) * 25,
        speed:  0.003 + Math.random() * 0.004,
        r:      1.5 + Math.random() * 2,
        pulse:  Math.random() * Math.PI * 2,
      };
    });

    const labelPositions = DATA_LABELS.map((_, i) => {
      const angle = (i / DATA_LABELS.length) * Math.PI * 2 - Math.PI / 2;
      return {
        angle,
        dist: 175,
        baseAngle: angle,
      };
    });

    const draw = () => {
      time += 0.008;
      ctx.clearRect(0, 0, SIZE, SIZE);

      // Mouse tilt
      const mx = mousePosRef?.current?.x ?? 0;
      const my = mousePosRef?.current?.y ?? 0;
      const card = cardRef?.current?.getBoundingClientRect();
      let tx = 0, ty = 0;
      if (card) {
        tx = ((mx - (card.left + card.width * 0.75)) / card.width)  * 0.04;
        ty = ((my - (card.top  + card.height / 2))  / card.height) * 0.04;
      }

      ctx.save();
      ctx.translate(CX, CY);
      // Subtle tilt via skew
      ctx.transform(1, ty * 0.5, tx * 0.5, 1, tx * 20, ty * 20);

      // Outer glow
      const outerGlow = ctx.createRadialGradient(0, 0, 80, 0, 0, 200);
      outerGlow.addColorStop(0, 'rgba(0,212,255,0.07)');
      outerGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = outerGlow;
      ctx.beginPath();
      ctx.arc(0, 0, 200, 0, Math.PI * 2);
      ctx.fill();

      // Subtle grid
      ctx.globalAlpha = 0.04;
      ctx.strokeStyle = '#00d4ff';
      ctx.lineWidth = 0.5;
      for (let gx = -180; gx <= 180; gx += 24) {
        ctx.beginPath(); ctx.moveTo(gx, -180); ctx.lineTo(gx,  180); ctx.stroke();
      }
      for (let gy = -180; gy <= 180; gy += 24) {
        ctx.beginPath(); ctx.moveTo(-180, gy); ctx.lineTo(180, gy); ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // Rings
      RINGS.forEach(ring => {
        const angle = time * ring.speed;
        ctx.save();
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.ellipse(0, 0, ring.rx, ring.ry, 0, 0, Math.PI * 2);
        ctx.setLineDash(ring.dash);
        ctx.strokeStyle = `rgba(${ring.color.join(',')},0.5)`;
        ctx.lineWidth = ring.w;
        ctx.stroke();
        ctx.setLineDash([]);

        // Orbiting dot
        const dotT = time * (ring.speed < 0 ? -1.4 : 1.4);
        const dotX = Math.cos(dotT) * ring.rx;
        const dotY = Math.sin(dotT) * ring.ry;
        ctx.beginPath();
        ctx.arc(dotX, dotY, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${ring.color.join(',')},0.9)`;
        ctx.fill();

        // Glow around dot
        const dg = ctx.createRadialGradient(dotX, dotY, 0, dotX, dotY, 10);
        dg.addColorStop(0, `rgba(${ring.color.join(',')},0.4)`);
        dg.addColorStop(1, 'transparent');
        ctx.fillStyle = dg;
        ctx.beginPath();
        ctx.arc(dotX, dotY, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Floating dots orbit
      floatingDots.forEach(dot => {
        dot.angle += dot.speed;
        const x = Math.cos(dot.angle) * dot.radius;
        const y = Math.sin(dot.angle) * dot.radius;
        const pulse = 0.4 + 0.3 * Math.sin(time * 2 + dot.pulse);
        ctx.beginPath();
        ctx.arc(x, y, dot.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(120,200,255,${pulse})`;
        ctx.fill();
      });

      // Core sphere
      const coreGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, 50);
      coreGlow.addColorStop(0, 'rgba(0,212,255,0.25)');
      coreGlow.addColorStop(0.6, 'rgba(0,100,200,0.12)');
      coreGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = coreGlow;
      ctx.beginPath();
      ctx.arc(0, 0, 50, 0, Math.PI * 2);
      ctx.fill();

      // Inner core bright
      const innerCore = ctx.createRadialGradient(-5, -5, 0, 0, 0, 22);
      innerCore.addColorStop(0, 'rgba(200,240,255,0.9)');
      innerCore.addColorStop(0.4, 'rgba(0,212,255,0.6)');
      innerCore.addColorStop(1, 'rgba(0,100,200,0.1)');
      ctx.fillStyle = innerCore;
      ctx.beginPath();
      ctx.arc(0, 0, 22, 0, Math.PI * 2);
      ctx.fill();

      // Pulse ring
      const pulseScale = 1 + 0.15 * Math.sin(time * 1.5);
      ctx.beginPath();
      ctx.arc(0, 0, 35 * pulseScale, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0,212,255,${0.2 - 0.15 * Math.sin(time * 1.5)})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Data labels
      ctx.font = '700 9px "Courier New", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      labelPositions.forEach((lp, i) => {
        lp.angle = lp.baseAngle + Math.sin(time * 0.3 + i) * 0.04;
        const x = Math.cos(lp.angle) * lp.dist;
        const y = Math.sin(lp.angle) * lp.dist;
        const blink = 0.5 + 0.3 * Math.sin(time * 1.2 + i * 1.1);
        ctx.fillStyle = `rgba(0,212,255,${blink})`;
        ctx.fillText(DATA_LABELS[i], x, y);

        // Line from core
        ctx.beginPath();
        ctx.moveTo(Math.cos(lp.angle) * 30, Math.sin(lp.angle) * 30);
        ctx.lineTo(x, y);
        ctx.strokeStyle = `rgba(0,212,255,${blink * 0.3})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      });

      ctx.restore();
      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 select-none">
      <canvas
        ref={canvasRef}
        style={{ width: 300, height: 300 }}
        className="float"
      />
      <div className="text-center space-y-2 px-6">
        <p className="text-xs font-mono tracking-[0.25em] text-cyan-400/60 uppercase">
          Sistema Financeiro Inteligente
        </p>
        <p className="text-xs text-slate-500 leading-relaxed">
          Controle total sobre suas finanças.<br />Seguro. Moderno. Inteligente.
        </p>
      </div>
    </div>
  );
}
