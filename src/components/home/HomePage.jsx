/**
 * HomePage — Tela inicial do QuantIA
 * Estética: Bloomberg Terminal meets modern fintech
 * Seções: Saudação · Ticker · Ativos · Notícias · Acesso Rápido
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown,
  Plus, BarChart2, CreditCard, Tag, Target, Bot,
  Activity, Zap, Newspaper, Signal, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { useAuth } from '../../auth/AuthProvider';
import api from '../../lib/api';
import { getTicker, getAssets, getNews } from '../../services/MarketService';

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function getInitials(name = '') {
  const parts = name.trim().split(' ').filter(Boolean);
  if (!parts.length) return '?';
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getGreeting(h) {
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

function isMarketOpen() {
  const d = new Date();
  const day = d.getDay();
  if (day === 0 || day === 6) return false;
  const total = d.getHours() * 60 + d.getMinutes();
  return total >= 9 * 60 && total < 17 * 60 + 30;
}

function timeAgo(iso) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return 'agora';
  if (diff < 3600) return `há ${Math.floor(diff / 60)}min`;
  if (diff < 86400) return `há ${Math.floor(diff / 3600)}h`;
  return `há ${Math.floor(diff / 86400)}d`;
}

function fmtVal(value, type) {
  if (type === 'index' || value >= 10000)
    return new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(value);
  if (value >= 1000)
    return new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(value);
  return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
}

// ─── ASSET LOGOS ─────────────────────────────────────────────────────────────
/*
 * Logos inline — sem dependências externas.
 * Cores de marca: Petrobras #003087 · Vale #009B3A · Itaú #EC7000
 * BTC #F7931A · ETH #627EEA · SOL #9945FF · BNB #F3BA2F · IBOV #1A3C6E
 */
const LOGO_CFG = {
  PETR4: { bg: '#003087', fg: '#fff',     glyph: 'P',  fs: 14 },
  VALE3: { bg: '#009B3A', fg: '#fff',     glyph: 'V',  fs: 14 },
  ITUB4: { bg: '#EC7000', fg: '#fff',     glyph: 'I',  fs: 15 },
  BBDC4: { bg: '#CC0000', fg: '#fff',     glyph: 'B',  fs: 14 },
  IBOV:  { bg: '#1A3C6E', fg: '#fff',     glyph: 'B3', fs: 9  },
  BTC:   { bg: '#F7931A', fg: '#fff',     glyph: '₿',  fs: 14 },
  ETH:   { bg: '#627EEA', fg: '#fff',     glyph: 'Ξ',  fs: 13 },
  SOL:   { bg: '#9945FF', fg: '#fff',     glyph: 'S',  fs: 14 },
  BNB:   { bg: '#F3BA2F', fg: '#1A1A2E', glyph: 'B',  fs: 14 },
};

function AssetLogo({ symbol }) {
  const cfg = LOGO_CFG[symbol] ?? {
    bg: 'var(--q-elevated)', fg: 'var(--q-text-2)', glyph: symbol?.[0] ?? '?', fs: 13,
  };
  return (
    <div style={{
      width: 32, height: 32, borderRadius: 9, flexShrink: 0,
      background: cfg.bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: cfg.fs,
      color: cfg.fg,
      boxShadow: '0 2px 8px rgba(0,0,0,0.28)',
      letterSpacing: '-0.5px',
      /* destaque leve para o logo combinar com a borda top colorida do card */
      outline: '1.5px solid rgba(255,255,255,0.08)',
    }}>
      {cfg.glyph}
    </div>
  );
}

// ─── SECTION LABEL ────────────────────────────────────────────────────────────

function SectionLabel({ icon: Icon, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        color: 'var(--q-text-3)',
      }}>
        {Icon && <Icon size={11} />}
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700,
          letterSpacing: '1.8px', textTransform: 'uppercase',
        }}>
          {label}
        </span>
      </div>
      <div style={{ flex: 1, height: '1px', background: 'var(--q-border)' }} />
    </div>
  );
}

// ─── GREETING SECTION ─────────────────────────────────────────────────────────

function GreetingSection({ profile }) {
  const [now, setNow] = useState(new Date());
  const [open, setOpen] = useState(isMarketOpen());

  useEffect(() => {
    const id = setInterval(() => {
      const d = new Date();
      setNow(d);
      setOpen(isMarketOpen());
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const displayName = profile?.name ?? 'Usuário';
  const firstName   = displayName.split(' ')[0];
  const initials    = getInitials(displayName);
  const greeting    = getGreeting(now.getHours());

  const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateStr = now.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });
  const dateCap = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      flexWrap: 'wrap', gap: 14,
      padding: '18px 24px',
      background: 'var(--q-surface)',
      borderBottom: '1px solid var(--q-border)',
    }}>
      {/* Avatar + greeting */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
        {/* Avatar */}
        <div style={{
          width: 44, height: 44, borderRadius: 12, flexShrink: 0,
          background: 'linear-gradient(135deg, rgba(16,185,129,0.18) 0%, rgba(99,102,241,0.18) 100%)',
          border: '1px solid rgba(16,185,129,0.28)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15,
          color: '#10B981',
          boxShadow: '0 0 18px rgba(16,185,129,0.12)',
        }}>
          {initials}
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--q-text-3)' }}>
              {greeting},
            </span>
            <span style={{
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 19,
              color: 'var(--q-text-1)', letterSpacing: '-0.3px',
            }}>
              {firstName}.
            </span>
          </div>

          {/* Market status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
              background: open ? '#10B981' : '#EF4444',
              boxShadow: `0 0 7px ${open ? 'rgba(16,185,129,0.85)' : 'rgba(239,68,68,0.85)'}`,
              animation: open ? 'mkt-pulse 2s ease-in-out infinite' : 'none',
              display: 'inline-block',
            }} />
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.6px',
              fontWeight: 600,
              color: open ? '#34D399' : '#F87171',
            }}>
              {open ? 'MERCADO B3 ABERTO' : 'MERCADO B3 FECHADO'}
            </span>
          </div>
        </div>
      </div>

      {/* Clock */}
      <div style={{ textAlign: 'right' }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 26,
          color: 'var(--q-text-1)', letterSpacing: '-0.5px', lineHeight: 1,
        }}>
          {timeStr}
        </div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--q-text-3)', marginTop: 3 }}>
          {dateCap} · BRT
        </div>
      </div>
    </div>
  );
}

// ─── TICKER TAPE ──────────────────────────────────────────────────────────────

function TickerItem({ item }) {
  const pos   = item.changePercent >= 0;
  const color = pos ? '#10B981' : '#EF4444';
  const glow  = pos ? 'rgba(16,185,129,0.55)' : 'rgba(239,68,68,0.55)';

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '0 18px',
      /* separador sempre visível no fundo escuro fixo do ticker */
      borderRight: '1px solid rgba(255,255,255,0.10)',
      flexShrink: 0, whiteSpace: 'nowrap',
    }}>
      <span style={{
        fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700,
        letterSpacing: '0.6px',
        /* fundo do ticker é sempre escuro (#090C18), cor fixa independente de tema */
        color: 'rgba(255,255,255,0.45)',
      }}>
        {item.symbol}
      </span>
      <span style={{
        fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600,
        color: '#ffffff',
      }}>
        {item.type !== 'index' && <span style={{ fontSize: 10, opacity: 0.45, marginRight: 1, color: '#ffffff' }}>R$</span>}
        {fmtVal(item.value, item.type)}
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {pos
          ? <ArrowUpRight   size={11} style={{ color, flexShrink: 0 }} />
          : <ArrowDownRight size={11} style={{ color, flexShrink: 0 }} />
        }
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color,
          textShadow: `0 0 7px ${glow}`,
        }}>
          {pos ? '+' : ''}{item.changePercent.toFixed(2)}%
        </span>
      </div>
    </div>
  );
}

function TickerTape({ items }) {
  const doubled = [...items, ...items];
  const duration = Math.max(items.length * 4.5, 35); // ~4.5s/item, min 35s

  return (
    <div style={{
      height: 38,
      background: 'var(--q-sidebar)',
      borderBottom: '1px solid var(--q-border)',
      display: 'flex', alignItems: 'center',
      overflow: 'hidden',
    }}>
      {/* LIVE badge — borda fixa, fundo do ticker sempre escuro */}
      <div style={{
        flexShrink: 0, height: '100%',
        display: 'flex', alignItems: 'center',
        padding: '0 13px',
        background: 'rgba(16,185,129,0.09)',
        borderRight: '1px solid rgba(255,255,255,0.15)',
        gap: 5,
      }}>
        <Signal size={9} style={{ color: '#10B981' }} />
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700,
          letterSpacing: '1.5px', color: '#10B981',
        }}>
          LIVE
        </span>
      </div>

      {/* Scrolling track */}
      <div
        className="ticker-track"
        style={{
          display: 'flex', alignItems: 'center',
          animation: `ticker-scroll ${duration}s linear infinite`,
          willChange: 'transform',
        }}
      >
        {doubled.map((item, i) => (
          <TickerItem key={`${item.symbol}-${i}`} item={item} />
        ))}
      </div>
    </div>
  );
}

// ─── SPARKLINE ────────────────────────────────────────────────────────────────

function Sparkline({ data, positive }) {
  const chartData = data.map((v, i) => ({ i, v }));
  const color = positive ? '#10B981' : '#EF4444';
  return (
    <ResponsiveContainer width="100%" height={44}>
      <LineChart data={chartData} margin={{ top: 3, right: 2, bottom: 3, left: 2 }}>
        <Line
          type="monotone" dataKey="v"
          stroke={color} strokeWidth={1.5}
          dot={false} activeDot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

// ─── ASSET CARD ───────────────────────────────────────────────────────────────

const TYPE_META = {
  stock:  { label: 'AÇÃO',   color: '#6366F1' },
  crypto: { label: 'CRIPTO', color: '#8B5CF6' },
  index:  { label: 'ÍNDICE', color: '#F59E0B' },
};

function AssetCard({ asset }) {
  const pos   = asset.changePercent >= 0;
  const color = pos ? '#10B981' : '#EF4444';
  const glow  = pos ? 'rgba(16,185,129,0.18)' : 'rgba(239,68,68,0.18)';
  const meta  = TYPE_META[asset.type] ?? TYPE_META.stock;

  const [flash, setFlash]  = useState(false);
  const prevVal = useRef(asset.value);

  useEffect(() => {
    if (asset.value !== prevVal.current) {
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 700);
      prevVal.current = asset.value;
      return () => clearTimeout(t);
    }
  }, [asset.value]);

  return (
    <div
      className="q-stagger"
      style={{
        background: flash ? `color-mix(in srgb, var(--q-elevated) 88%, ${color})` : 'var(--q-elevated)',
        border: '1px solid var(--q-border)',
        borderTop: `2px solid ${color}`,
        borderRadius: 11,
        padding: '13px 15px 14px',
        transition: 'box-shadow 0.25s, background 0.35s',
        boxShadow: flash
          ? `0 0 24px ${glow}, 0 0 0 1px ${color}30`
          : '0 2px 10px rgba(0,0,0,0.22)',
      }}
    >
      {/* Header: logo fixo + coluna flex-1 que contém símbolo, badge e nome */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9, marginBottom: 2 }}>

        {/* Logo — tamanho fixo, nunca encolhe */}
        <AssetLogo symbol={asset.symbol} />

        {/* Coluna de conteúdo — flex:1 + minWidth:0 é o padrão para evitar overflow em flex */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Linha: símbolo+tipo à esquerda · badge de % à direita */}
          <div style={{
            display: 'flex', alignItems: 'flex-start',
            justifyContent: 'space-between', gap: 6,
          }}>
            {/* Símbolo + badge de tipo — envolvem se necessário */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap', minWidth: 0 }}>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700,
                color: 'var(--q-text-1)', letterSpacing: '-0.2px', whiteSpace: 'nowrap',
              }}>
                {asset.symbol}
              </span>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: 8, fontWeight: 700,
                letterSpacing: '0.7px', color: meta.color, flexShrink: 0,
                background: `${meta.color}18`, padding: '1px 5px', borderRadius: 3,
              }}>
                {meta.label}
              </span>
            </div>

            {/* Badge de variação — flexShrink:0 garante espaço fixo */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0,
              background: pos ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
              border: `1px solid ${pos ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`,
              borderRadius: 6, padding: '3px 6px',
            }}>
              {pos
                ? <TrendingUp   size={9} style={{ color }} />
                : <TrendingDown size={9} style={{ color }} />
              }
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, color,
                textShadow: `0 0 8px ${glow}`,
              }}>
                {pos ? '+' : ''}{asset.changePercent.toFixed(2)}%
              </span>
            </div>
          </div>

          {/* Nome do ativo — fica abaixo, trunca se necessário */}
          <div style={{
            fontFamily: 'var(--font-body)', fontSize: 11,
            color: 'var(--q-text-3)', marginTop: 2,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {asset.name}
          </div>
        </div>
      </div>

      {/* Sparkline */}
      <div style={{ margin: '6px -3px 2px' }}>
        <Sparkline data={asset.sparkline} positive={pos} />
      </div>

      {/* Value */}
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 21, fontWeight: 700,
        color: 'var(--q-text-1)', letterSpacing: '-0.4px', lineHeight: 1,
      }}>
        {asset.type !== 'index' && (
          <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--q-text-3)', marginRight: 2 }}>
            R$
          </span>
        )}
        {fmtVal(asset.value, asset.type)}
      </div>
    </div>
  );
}

function AssetSkeleton() {
  return (
    <div style={{
      background: 'var(--q-elevated)',
      border: '1px solid var(--q-border)',
      borderTop: '2px solid var(--q-border-md)',
      borderRadius: 11, padding: '13px 15px 14px',
    }}>
      {[38, 18, 44, 22].map((h, i) => (
        <div key={i} className="shimmer" style={{
          height: h, borderRadius: 5,
          marginBottom: i < 3 ? 10 : 0,
        }} />
      ))}
    </div>
  );
}

// ─── NEWS CARD ────────────────────────────────────────────────────────────────

const SENTIMENT_CFG = {
  positive: { label: 'POSITIVO', color: '#10B981', bg: 'rgba(16,185,129,0.09)', border: 'rgba(16,185,129,0.28)' },
  negative: { label: 'NEGATIVO', color: '#EF4444', bg: 'rgba(239,68,68,0.09)',  border: 'rgba(239,68,68,0.28)'  },
  neutral:  { label: 'NEUTRO',   color: '#8A91C8', bg: 'rgba(138,145,200,0.09)', border: 'rgba(138,145,200,0.28)' },
};

function NewsCard({ item }) {
  const s = SENTIMENT_CFG[item.sentiment] ?? SENTIMENT_CFG.neutral;
  const [hov, setHov] = useState(false);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', flexDirection: 'column',
        width: 272, flexShrink: 0,
        background: 'var(--q-elevated)',
        border: '1px solid var(--q-border)',
        borderLeft: `3px solid ${s.color}`,
        borderRadius: '0 10px 10px 0',
        padding: '13px 15px',
        transition: 'box-shadow 0.15s, transform 0.15s',
        boxShadow: hov ? '0 6px 20px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.18)',
        transform: hov ? 'translateY(-2px)' : 'translateY(0)',
      }}
    >
      {/* Fonte + tempo */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        {/* Fonte como referência — sem link */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{
            width: 5, height: 5, borderRadius: '50%',
            background: s.color, flexShrink: 0,
            opacity: 0.8,
          }} />
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700,
            letterSpacing: '0.5px', color: 'var(--q-text-3)', textTransform: 'uppercase',
          }}>
            {item.source}
          </span>
        </div>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--q-text-3)' }}>
          {timeAgo(item.publishedAt)}
        </span>
      </div>

      {/* Título */}
      <p style={{
        fontFamily: 'var(--font-body)', fontSize: 12.5, fontWeight: 500,
        color: hov ? 'var(--q-text-1)' : 'var(--q-text-2)',
        lineHeight: 1.45, margin: '0 0 10px', flex: 1,
        display: '-webkit-box',
        WebkitLineClamp: 3, WebkitBoxOrient: 'vertical',
        overflow: 'hidden', transition: 'color 0.15s',
      }}>
        {item.title}
      </p>

      {/* Sentimento */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        background: s.bg, border: `1px solid ${s.border}`,
        borderRadius: 4, padding: '2px 7px', alignSelf: 'flex-start',
      }}>
        <div style={{ width: 4, height: 4, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 8.5, fontWeight: 700,
          letterSpacing: '0.5px', color: s.color,
        }}>
          {s.label}
        </span>
      </div>
    </div>
  );
}

// ─── NEWS CAROUSEL ────────────────────────────────────────────────────────────

function NewsCarousel({ items, loading }) {
  const scrollRef = useRef(null);
  const [atStart,  setAtStart]  = useState(true);
  const [atEnd,    setAtEnd]    = useState(false);
  const [progress, setProgress] = useState(0);
  const [paused,   setPaused]   = useState(false);

  const STEP = 283; // 272px card + 11px gap

  /* Atualiza indicadores de posição a partir do scrollLeft */
  const syncState = () => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft >= max - 4);
    setProgress(max > 0 ? el.scrollLeft / max : 0);
  };

  /* Navega programaticamente — avança ou retorna ao início ao chegar no fim */
  const scrollNext = () => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    if (el.scrollLeft >= max - 4) {
      el.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      el.scrollBy({ left: STEP, behavior: 'smooth' });
    }
  };
  const scrollPrev = () => scrollRef.current?.scrollBy({ left: -STEP, behavior: 'smooth' });

  /* Auto-avanço a cada 4,5 s — pausa no hover */
  useEffect(() => {
    if (paused) return;
    const id = setInterval(scrollNext, 4500);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused]);

  /* Inicializa estado ao montar */
  useEffect(() => { syncState(); }, [items]);

  /* Estilo dos botões de navegação */
  const navBtn = (side) => ({
    position: 'absolute', top: '50%',
    [side]: -15,
    transform: 'translateY(-50%)',
    width: 30, height: 30, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'var(--q-elevated)',
    border: '1px solid var(--q-border-md)',
    color: 'var(--q-text-2)',
    cursor: 'pointer', zIndex: 3,
    boxShadow: '0 3px 10px rgba(0,0,0,0.35)',
    transition: 'background 0.15s, color 0.15s',
    padding: 0,
  });

  if (loading) {
    return (
      <div style={{ display: 'flex', gap: 11 }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="shimmer" style={{ width: 272, height: 130, borderRadius: 10, flexShrink: 0 }} />
        ))}
      </div>
    );
  }

  return (
    <div
      style={{ position: 'relative' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Botão anterior */}
      {!atStart && (
        <button onClick={scrollPrev} style={navBtn('left')} aria-label="Notícia anterior">
          <ChevronLeft size={15} />
        </button>
      )}

      {/* Botão próximo */}
      {!atEnd && (
        <button onClick={scrollNext} style={navBtn('right')} aria-label="Próxima notícia">
          <ChevronRight size={15} />
        </button>
      )}

      {/* Fades nas bordas para indicar conteúdo oculto */}
      {!atStart && (
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 14,
          width: 32, pointerEvents: 'none', zIndex: 2,
          background: 'linear-gradient(to right, var(--q-bg), transparent)',
        }} />
      )}
      {!atEnd && (
        <div style={{
          position: 'absolute', right: 0, top: 0, bottom: 14,
          width: 32, pointerEvents: 'none', zIndex: 2,
          background: 'linear-gradient(to left, var(--q-bg), transparent)',
        }} />
      )}

      {/* Track de cards — scroll nativo oculto, controlado via scrollBy */}
      <div
        ref={scrollRef}
        onScroll={syncState}
        style={{
          display: 'flex', gap: 11,
          overflowX: 'auto',
          paddingBottom: 4,
          /* scrollbar personalizado pelo index.css (4px thin) */
        }}
      >
        {items.map(item => <NewsCard key={item.id} item={item} />)}
      </div>

      {/* Barra de progresso */}
      <div style={{
        height: 2, background: 'var(--q-border)', borderRadius: 99,
        marginTop: 10, overflow: 'hidden',
      }}>
        <div style={{
          height: '100%', borderRadius: 99,
          background: 'linear-gradient(90deg, var(--q-accent) 0%, rgba(16,185,129,0.4) 100%)',
          width: `${(progress * 100).toFixed(1)}%`,
          transition: 'width 0.35s ease',
          minWidth: progress > 0 ? 16 : 0,
        }} />
      </div>
    </div>
  );
}

// ─── QUICK ACCESS ─────────────────────────────────────────────────────────────

const QUICK_LINKS = [
  { to: '/transactions',    icon: Plus,     label: 'Transações',    desc: 'Nova transação',   color: '#10B981', featured: true  },
  { to: '/reports',         icon: BarChart2, label: 'Relatórios',   desc: 'Ver análises',     color: '#6366F1', featured: false },
  { to: '/accounts',        icon: CreditCard, label: 'Contas',      desc: 'Minhas contas',    color: '#F59E0B', featured: false },
  { to: '/categories',      icon: Tag,       label: 'Categorias',   desc: 'Organizar gastos', color: '#EC4899', featured: false },
  { to: '/monthly-budgets', icon: Target,    label: 'Limites',      desc: 'Metas de gasto',   color: '#14B8A6', featured: false },
  { to: '/ai-chat',         icon: Bot,       label: 'Chat IA',      desc: 'Assistente IA',    color: '#8B5CF6', featured: false },
];

function QuickLink({ link }) {
  const [hov, setHov] = useState(false);

  return (
    <Link
      to={link.to}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 10,
        padding: '18px 12px',
        background: link.featured
          ? `linear-gradient(135deg, rgba(16,185,129,0.14) 0%, rgba(16,185,129,0.05) 100%)`
          : hov
            ? `${link.color}0A`
            : 'var(--q-elevated)',
        border: `1px solid ${
          link.featured ? 'rgba(16,185,129,0.32)' :
          hov ? `${link.color}40` : 'var(--q-border)'
        }`,
        borderRadius: 11,
        textDecoration: 'none',
        transition: 'all 0.18s ease',
        boxShadow: hov
          ? `0 6px 22px rgba(0,0,0,0.3), 0 0 14px ${link.color}15`
          : link.featured ? '0 0 18px rgba(16,185,129,0.1)' : 'none',
        transform: hov ? 'translateY(-2px)' : 'translateY(0)',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Featured label */}
      {link.featured && (
        <div style={{
          position: 'absolute', top: 6, right: 6,
          fontFamily: 'var(--font-mono)', fontSize: 7.5, fontWeight: 700,
          letterSpacing: '0.4px', color: '#10B981',
          background: 'rgba(16,185,129,0.14)', padding: '1px 5px', borderRadius: 3,
        }}>
          ★ FAVORITO
        </div>
      )}

      {/* Icon */}
      <div style={{
        width: 42, height: 42, borderRadius: 11,
        background: hov ? `${link.color}22` : `${link.color}14`,
        border: `1px solid ${link.color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.18s',
        boxShadow: hov ? `0 0 12px ${link.color}30` : 'none',
      }}>
        <link.icon size={19} style={{ color: hov ? link.color : `${link.color}CC` }} />
      </div>

      {/* Label */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 700,
          color: hov ? 'var(--q-text-1)' : 'var(--q-text-2)',
          transition: 'color 0.15s',
        }}>
          {link.label}
        </div>
        <div style={{
          fontFamily: 'var(--font-body)', fontSize: 10,
          color: 'var(--q-text-3)', marginTop: 2,
        }}>
          {link.desc}
        </div>
      </div>
    </Link>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────

function HomePage() {
  const { userInfo } = useAuth();

  const [profile,       setProfile]       = useState(null);
  const [ticker,        setTicker]        = useState([]);
  const [assets,        setAssets]        = useState([]);
  const [news,          setNews]          = useState([]);
  const [assetsLoading, setAssetsLoading] = useState(true);
  const [newsLoading,   setNewsLoading]   = useState(true);

  // Profile
  useEffect(() => {
    api.get('/profile').then(r => setProfile(r.data)).catch(() => {
      if (userInfo) setProfile({ name: userInfo.name ?? userInfo.preferred_username ?? 'Usuário' });
    });
  }, [userInfo]);

  // Ticker — poll every 60 s
  const loadTicker = useCallback(async () => {
    const data = await getTicker();
    setTicker(data);
  }, []);

  useEffect(() => {
    loadTicker();
    const id = setInterval(loadTicker, 60_000);
    return () => clearInterval(id);
  }, [loadTicker]);

  // Assets
  useEffect(() => {
    getAssets().then(d => { setAssets(d); setAssetsLoading(false); });
  }, []);

  // News
  useEffect(() => {
    getNews().then(d => { setNews(d); setNewsLoading(false); });
  }, []);

  return (
    <div style={{ minHeight: '100%', background: 'var(--q-bg)', display: 'flex', flexDirection: 'column' }}>

      {/* ── Greeting ────────────────────────────────────────── */}
      <GreetingSection profile={profile} />

      {/* ── Ticker tape ─────────────────────────────────────── */}
      {ticker.length > 0 && <TickerTape items={ticker} />}

      {/* ── Main content ────────────────────────────────────── */}
      <div
        className="hp-main"
        style={{
          flex: 1, padding: '22px 24px 32px',
          maxWidth: 1280, width: '100%', margin: '0 auto',
          display: 'flex', flexDirection: 'column', gap: 28,
        }}
      >

        {/* ── Assets ──────────────────────────────────────── */}
        <section>
          <SectionLabel icon={Activity} label="Ativos em destaque" />
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(182px, 1fr))',
            gap: 11,
          }} className="q-stagger">
            {assetsLoading
              ? Array.from({ length: 6 }).map((_, i) => <AssetSkeleton key={i} />)
              : assets.map(a => <AssetCard key={a.id} asset={a} />)
            }
          </div>
        </section>

        {/* ── News ────────────────────────────────────────── */}
        <section>
          <SectionLabel icon={Newspaper} label="Notícias do mercado" />
          <NewsCarousel items={news} loading={newsLoading} />
        </section>

        {/* ── Quick Access ────────────────────────────────── */}
        <section>
          <SectionLabel icon={Zap} label="Acesso rápido" />
          {/* justify-content: center centraliza os cards em qualquer largura de tela */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 160px))',
            justifyContent: 'center',
            gap: 10,
          }}>
            {QUICK_LINKS.map(link => <QuickLink key={link.to} link={link} />)}
          </div>
        </section>

      </div>
    </div>
  );
}

export default HomePage;
