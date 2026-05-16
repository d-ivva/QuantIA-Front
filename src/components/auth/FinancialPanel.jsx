import { useEffect, useRef } from 'react';

// Gera série de preços pseudo-aleatória mas realista
function generatePriceSeries(n = 80, seed = 42) {
  let price = 128;
  const series = [];
  let s = seed;
  const rng = () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; };
  for (let i = 0; i < n; i++) {
    const change = (rng() - 0.48) * 4.2;
    price = Math.max(60, Math.min(220, price + change));
    const open  = price;
    const close = price + (rng() - 0.5) * 3;
    const high  = Math.max(open, close) + rng() * 2;
    const low   = Math.min(open, close) - rng() * 2;
    const vol   = 0.3 + rng() * 0.7;
    series.push({ open, close, high, low, vol });
    price = close;
  }
  return series;
}

const SERIES = generatePriceSeries(72);
const METRICS = [
  { label: 'Patrimônio', value: '+12,4%', up: true  },
  { label: 'Este mês',   value: '+R$ 840', up: true  },
  { label: 'Poupança',   value: '34,2%',  up: false },
];

export default function FinancialPanel({ mousePosRef }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    let raf;
    let time = 0;
    let mouseX = -1;

    const W = 400, H = 380;
    canvas.width  = W;
    canvas.height = H;

    const PAD  = { top: 20, right: 20, bottom: 60, left: 50 };
    const chartW = W - PAD.left - PAD.right;
    const chartH = H - PAD.top  - PAD.bottom;

    const prices   = SERIES.map(d => d.close);
    const allHigh  = SERIES.map(d => d.high);
    const allLow   = SERIES.map(d => d.low);
    const minP     = Math.min(...allLow)  * 0.985;
    const maxP     = Math.max(...allHigh) * 1.015;

    const toY = p => PAD.top  + chartH - ((p - minP) / (maxP - minP)) * chartH;
    const toX = i => PAD.left + (i / (SERIES.length - 1)) * chartW;

    // Track mouse on canvas
    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = W / rect.width;
      mouseX = (e.clientX - rect.left) * scaleX;
    };
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', () => { mouseX = -1; });

    const draw = () => {
      time += 0.012;
      ctx.clearRect(0, 0, W, H);

      // ── Grid ────────────────────────────────────────────────────
      ctx.strokeStyle = 'rgba(255,255,255,0.04)';
      ctx.lineWidth   = 1;
      for (let row = 0; row <= 4; row++) {
        const y = PAD.top + (row / 4) * chartH;
        ctx.beginPath();
        ctx.moveTo(PAD.left, y);
        ctx.lineTo(PAD.left + chartW, y);
        ctx.stroke();

        // Price label
        const price = maxP - (row / 4) * (maxP - minP);
        ctx.fillStyle   = 'rgba(100,130,180,0.55)';
        ctx.font        = '500 9px "Inter", system-ui, sans-serif';
        ctx.textAlign   = 'right';
        ctx.fillText(price.toFixed(0), PAD.left - 6, y + 3);
      }

      // ── Area fill ────────────────────────────────────────────────
      const grad = ctx.createLinearGradient(0, PAD.top, 0, PAD.top + chartH);
      grad.addColorStop(0,   'rgba(0,212,255,0.22)');
      grad.addColorStop(0.6, 'rgba(0,212,255,0.06)');
      grad.addColorStop(1,   'rgba(0,212,255,0)');

      ctx.beginPath();
      ctx.moveTo(toX(0), toY(prices[0]));
      prices.forEach((p, i) => { if (i > 0) ctx.lineTo(toX(i), toY(p)); });
      ctx.lineTo(toX(prices.length - 1), PAD.top + chartH);
      ctx.lineTo(toX(0), PAD.top + chartH);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      // ── Price line ────────────────────────────────────────────────
      ctx.beginPath();
      prices.forEach((p, i) => { i === 0 ? ctx.moveTo(toX(i), toY(p)) : ctx.lineTo(toX(i), toY(p)); });
      ctx.strokeStyle = '#00d4ff';
      ctx.lineWidth   = 1.8;
      ctx.shadowColor = '#00d4ff';
      ctx.shadowBlur  = 10;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // ── Volume bars ───────────────────────────────────────────────
      const volH   = 28;
      const volY0  = PAD.top + chartH + 12;
      const barW   = Math.max(2, chartW / SERIES.length - 1.5);
      SERIES.forEach((d, i) => {
        const x    = toX(i) - barW / 2;
        const h    = d.vol * volH;
        const up   = d.close >= d.open;
        ctx.fillStyle = up ? 'rgba(0,212,255,0.35)' : 'rgba(239,68,68,0.3)';
        ctx.fillRect(x, volY0 + volH - h, barW, h);
      });
      ctx.fillStyle = 'rgba(100,130,180,0.35)';
      ctx.font      = '500 8px "Inter", system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('VOL', PAD.left, volY0 + volH + 10);

      // ── Live dot + pulse ──────────────────────────────────────────
      const lx = toX(prices.length - 1);
      const ly = toY(prices[prices.length - 1]);
      const pulse = 0.5 + 0.5 * Math.sin(time * 3);

      ctx.beginPath();
      ctx.arc(lx, ly, 6 + pulse * 4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,212,255,${0.12 - pulse * 0.08})`;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(lx, ly, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#00d4ff';
      ctx.shadowColor = '#00d4ff';
      ctx.shadowBlur  = 12;
      ctx.fill();
      ctx.shadowBlur = 0;

      // ── Mouse crosshair ───────────────────────────────────────────
      if (mouseX >= PAD.left && mouseX <= PAD.left + chartW) {
        ctx.setLineDash([3, 4]);
        ctx.strokeStyle = 'rgba(0,212,255,0.25)';
        ctx.lineWidth   = 1;
        ctx.beginPath();
        ctx.moveTo(mouseX, PAD.top);
        ctx.lineTo(mouseX, PAD.top + chartH);
        ctx.stroke();
        ctx.setLineDash([]);

        // Find nearest price
        const idx   = Math.round(((mouseX - PAD.left) / chartW) * (SERIES.length - 1));
        const safeI = Math.min(Math.max(idx, 0), SERIES.length - 1);
        const py    = toY(prices[safeI]);
        const label = prices[safeI].toFixed(2);
        const lbW   = 52, lbH = 18;
        const lbX   = Math.min(mouseX - lbW / 2, W - lbW - 4);
        const lbY   = py - lbH - 6;

        ctx.fillStyle   = '#00d4ff';
        ctx.beginPath();
        ctx.arc(mouseX, py, 3.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle   = 'rgba(0,20,40,0.88)';
        ctx.strokeStyle = 'rgba(0,212,255,0.4)';
        ctx.lineWidth   = 0.8;
        ctx.beginPath();
        ctx.roundRect(lbX, Math.max(lbY, PAD.top + 2), lbW, lbH, 4);
        ctx.fill(); ctx.stroke();

        ctx.fillStyle   = '#00d4ff';
        ctx.font        = '600 10px "Inter", system-ui, sans-serif';
        ctx.textAlign   = 'center';
        ctx.fillText(label, lbX + lbW / 2, Math.max(lbY, PAD.top + 2) + 12);
      }

      // ── Floating metrics (top-right) ──────────────────────────────
      METRICS.forEach((m, i) => {
        const mx   = W - PAD.right - 8;
        const my   = PAD.top + 8 + i * 36;
        const blink = 0.85 + 0.15 * Math.sin(time * 1.2 + i * 1.4);

        ctx.textAlign = 'right';
        ctx.font      = '500 8px "Inter", system-ui, sans-serif';
        ctx.fillStyle = `rgba(100,130,180,${blink * 0.6})`;
        ctx.fillText(m.label.toUpperCase(), mx, my + 1);

        ctx.font      = '700 12px "Inter", system-ui, sans-serif';
        ctx.fillStyle = m.up
          ? `rgba(0,212,255,${blink * 0.95})`
          : `rgba(239,68,68,${blink * 0.85})`;
        ctx.fillText(m.value, mx, my + 15);
      });

      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener('mousemove', onMove);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full gap-4 select-none px-4">
      {/* Badge */}
      <div
        className="flex items-center gap-2 px-3 py-1.5 rounded-full self-end mr-4"
        style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)' }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-[10px] font-medium text-cyan-400/70 tracking-widest uppercase">Ao vivo</span>
      </div>

      {/* Chart canvas */}
      <canvas
        ref={canvasRef}
        style={{ width: 340, height: 320 }}
        className="cursor-crosshair"
      />

      {/* Footer label */}
      <p className="text-[10px] font-mono tracking-[0.2em] text-slate-600 uppercase">
        QuantIA · Finanças Inteligentes
      </p>
    </div>
  );
}
