import { useState } from 'react';
import { tokenStore } from '../../auth/tokenStore';

// Traduz mensagens do Keycloak para português
function translateError(raw = '') {
  const m = raw.toLowerCase();
  if (m.includes('invalid user credentials') || m.includes('invalid_grant') || m.includes('invalid credentials'))
    return 'Usuário ou senha inválidos.';
  if (m.includes('account disabled') || m.includes('disabled'))
    return 'Conta desativada. Entre em contato com o suporte.';
  if (m.includes('account locked') || m.includes('locked'))
    return 'Conta bloqueada temporariamente. Tente novamente em alguns minutos.';
  if (m.includes('account is not fully set up'))
    return 'Configuração da conta incompleta.';
  if (m.includes('session expired') || m.includes('token expired'))
    return 'Sessão expirada. Faça login novamente.';
  if (m.includes('preencha'))
    return raw;
  return 'Erro ao autenticar. Verifique suas credenciais e tente novamente.';
}

function AuthInput({ label, id, type = 'text', value, onChange, placeholder, autoComplete, hasError }) {
  const [focused, setFocused] = useState(false);

  const borderColor = hasError
    ? 'rgba(239,68,68,0.55)'
    : focused ? 'rgba(0,212,255,0.5)' : 'rgba(255,255,255,0.12)';

  const shadow = hasError
    ? '0 0 0 3px rgba(239,68,68,0.1)'
    : focused ? '0 0 0 3px rgba(0,212,255,0.1)' : 'none';

  const bg = hasError
    ? 'rgba(239,68,68,0.05)'
    : focused ? 'rgba(0,212,255,0.06)' : 'rgba(255,255,255,0.06)';

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-xs font-semibold text-slate-300 tracking-wide uppercase">
        {label}
      </label>
      <input
        id={id} type={type} value={value} onChange={onChange}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        placeholder={placeholder} autoComplete={autoComplete}
        className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all duration-200"
        style={{ background: bg, border: `1px solid ${borderColor}`, boxShadow: shadow }}
      />
    </div>
  );
}

export default function LoginForm({ onSwitch }) {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [shaking,  setShaking]  = useState(false);

  const triggerShake = () => {
    setShaking(true);
    setTimeout(() => setShaking(false), 500);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Preencha todos os campos.');
      triggerShake();
      return;
    }
    setError('');
    setLoading(true);
    try {
      await tokenStore.login(email, password);
    } catch (err) {
      setError(translateError(err.message ?? ''));
      setLoading(false);
      triggerShake();
    }
  };

  const hasError = !!error;

  return (
    <div className="auth-form-enter space-y-7">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-white tracking-tight">Bem-vindo</h1>
        <p className="text-sm text-slate-400">Entre na sua conta para continuar</p>
      </div>

      <form onSubmit={handleLogin} className={`space-y-4 ${shaking ? 'shake' : ''}`}>
        <AuthInput label="E-mail" id="email" type="email" value={email}
          onChange={e => { setEmail(e.target.value); setError(''); }}
          placeholder="seu@email.com" autoComplete="email" hasError={hasError} />

        <AuthInput label="Senha" id="password" type="password" value={password}
          onChange={e => { setPassword(e.target.value); setError(''); }}
          placeholder="••••••••" autoComplete="current-password" hasError={hasError} />

        <div className="flex justify-end">
          <button type="button" onClick={() => onSwitch('forgot')}
            className="text-xs text-cyan-400/70 hover:text-cyan-300 transition-colors duration-200">
            Esqueci minha senha
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div
            className="flex items-start gap-2.5 rounded-xl px-3.5 py-2.5"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}
          >
            <svg className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <p className="text-xs text-red-300 leading-relaxed">{error}</p>
          </div>
        )}

        <button
          type="submit" disabled={loading}
          className="relative w-full py-3 rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
          style={{
            background: 'linear-gradient(135deg, rgba(0,212,255,0.22) 0%, rgba(124,58,237,0.26) 100%)',
            border: '1px solid rgba(0,212,255,0.35)',
            color: '#a5f3fc',
            boxShadow: '0 0 20px rgba(0,212,255,0.12)',
          }}
          onMouseEnter={e => { if (!loading) { e.currentTarget.style.boxShadow = '0 0 32px rgba(0,212,255,0.28)'; e.currentTarget.style.borderColor = 'rgba(0,212,255,0.6)'; } }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 20px rgba(0,212,255,0.12)'; e.currentTarget.style.borderColor = 'rgba(0,212,255,0.35)'; }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-cyan-300/40 border-t-cyan-300 rounded-full animate-spin" />
              Entrando...
            </span>
          ) : 'Entrar'}
        </button>
      </form>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
        <span className="text-xs text-slate-500">ou</span>
        <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
      </div>

      <p className="text-center text-sm text-slate-400">
        Não tem uma conta?{' '}
        <button onClick={() => onSwitch('register')}
          className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors duration-200">
          Criar conta
        </button>
      </p>
    </div>
  );
}
