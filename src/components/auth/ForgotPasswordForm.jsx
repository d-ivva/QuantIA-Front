import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5221/api';

function AuthInput({ label, id, type = 'text', value, onChange, placeholder, autoComplete }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-xs font-medium text-slate-400 tracking-wide uppercase">
        {label}
      </label>
      <input
        id={id} type={type} value={value} onChange={onChange}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        placeholder={placeholder} autoComplete={autoComplete}
        className="w-full rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none transition-all duration-300"
        style={{
          background: focused ? 'rgba(0,212,255,0.04)' : 'rgba(255,255,255,0.03)',
          border: `1px solid ${focused ? 'rgba(0,212,255,0.45)' : 'rgba(255,255,255,0.08)'}`,
          boxShadow: focused ? '0 0 0 3px rgba(0,212,255,0.08)' : 'none',
        }}
      />
    </div>
  );
}

export default function ForgotPasswordForm({ onSwitch }) {
  const [email,   setEmail]   = useState('');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [sent,    setSent]    = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { setError('Informe seu e-mail.'); return; }
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message ?? 'Erro ao processar solicitação.');
      }

      setSent(true);
    } catch (err) {
      setError(err.message ?? 'Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="auth-form-enter space-y-6 text-center">
        <div className="flex justify-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)' }}
          >
            <svg className="w-7 h-7 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white">Verifique seu e-mail</h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            Se o endereço <span className="text-cyan-400">{email}</span> estiver cadastrado,
            você receberá as instruções de recuperação em instantes.
          </p>
        </div>
        <p className="text-xs text-slate-600">Não encontrou? Verifique a caixa de spam.</p>
        <button
          onClick={() => onSwitch('login')}
          className="text-sm text-slate-500 hover:text-slate-300 transition-colors duration-200"
        >
          ← Voltar para login
        </button>
      </div>
    );
  }

  return (
    <div className="auth-form-enter space-y-7">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-white tracking-tight">Recuperar senha</h1>
        <p className="text-sm text-slate-500">Enviaremos as instruções para o seu e-mail</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInput
          label="E-mail" id="forgot-email" type="email"
          value={email} onChange={e => setEmail(e.target.value)}
          placeholder="seu@email.com" autoComplete="email"
        />

        {error && (
          <p className="text-xs text-red-400/80 rounded-lg px-3 py-2"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}>
            {error}
          </p>
        )}

        <button
          type="submit" disabled={loading}
          className="w-full py-3 rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 disabled:opacity-60"
          style={{
            background: 'linear-gradient(135deg, rgba(0,212,255,0.15) 0%, rgba(124,58,237,0.18) 100%)',
            border: '1px solid rgba(0,212,255,0.28)',
            color: '#a5f3fc',
          }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-cyan-300/40 border-t-cyan-300 rounded-full animate-spin" />
              Enviando...
            </span>
          ) : 'Enviar recuperação'}
        </button>
      </form>

      <p className="text-center">
        <button
          onClick={() => onSwitch('login')}
          className="text-sm text-slate-500 hover:text-slate-300 transition-colors duration-200"
        >
          ← Voltar para login
        </button>
      </p>
    </div>
  );
}
