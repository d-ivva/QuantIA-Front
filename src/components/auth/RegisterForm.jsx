import { useState } from 'react';
import { tokenStore } from '../../auth/tokenStore';

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
          background: focused ? 'rgba(124,58,237,0.05)' : 'rgba(255,255,255,0.03)',
          border: `1px solid ${focused ? 'rgba(124,58,237,0.5)' : 'rgba(255,255,255,0.08)'}`,
          boxShadow: focused ? '0 0 0 3px rgba(124,58,237,0.1)' : 'none',
        }}
      />
    </div>
  );
}

export default function RegisterForm({ onSwitch }) {
  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name)     { setError('Nome é obrigatório.');           return; }
    if (!email)    { setError('E-mail é obrigatório.');         return; }
    if (!password) { setError('Senha é obrigatória.');          return; }
    if (password.length < 8) { setError('A senha deve ter no mínimo 8 caracteres.'); return; }
    if (password !== confirm) { setError('As senhas não coincidem.'); return; }

    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, confirmPassword: confirm }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message ?? 'Erro ao criar conta.');
      }

      // Auto-login after successful registration
      await tokenStore.login(email, password);
    } catch (err) {
      setError(err.message ?? 'Erro inesperado. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-enter space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-white tracking-tight">Criar conta</h1>
        <p className="text-sm text-slate-500">Comece a controlar suas finanças hoje</p>
      </div>

      <form onSubmit={handleRegister} className="space-y-3">
        <AuthInput
          label="Nome completo" id="reg-name"
          value={name} onChange={e => setName(e.target.value)}
          placeholder="Arthur Bauer" autoComplete="name"
        />
        <AuthInput
          label="E-mail" id="reg-email" type="email"
          value={email} onChange={e => setEmail(e.target.value)}
          placeholder="seu@email.com" autoComplete="email"
        />
        <AuthInput
          label="Senha" id="reg-password" type="password"
          value={password} onChange={e => setPassword(e.target.value)}
          placeholder="Mínimo 8 caracteres" autoComplete="new-password"
        />
        <AuthInput
          label="Confirmar senha" id="reg-confirm" type="password"
          value={confirm} onChange={e => setConfirm(e.target.value)}
          placeholder="Repita a senha" autoComplete="new-password"
        />

        {error && (
          <p className="text-xs text-red-400/80 rounded-lg px-3 py-2"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}>
            {error}
          </p>
        )}

        <div className="pt-1">
          <button
            type="submit" disabled={loading}
            className="relative w-full py-3 rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              background: 'linear-gradient(135deg, rgba(124,58,237,0.22) 0%, rgba(0,212,255,0.18) 100%)',
              border: '1px solid rgba(124,58,237,0.35)',
              color: '#c4b5fd',
              boxShadow: '0 0 20px rgba(124,58,237,0.12)',
            }}
            onMouseEnter={e => { if (!loading) { e.currentTarget.style.boxShadow = '0 0 30px rgba(124,58,237,0.28)'; e.currentTarget.style.borderColor = 'rgba(124,58,237,0.6)'; } }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 20px rgba(124,58,237,0.12)'; e.currentTarget.style.borderColor = 'rgba(124,58,237,0.35)'; }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-violet-300/40 border-t-violet-300 rounded-full animate-spin" />
                Criando conta...
              </span>
            ) : 'Criar conta'}
          </button>
        </div>
      </form>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-white/5" />
        <span className="text-xs text-slate-600">ou</span>
        <div className="flex-1 h-px bg-white/5" />
      </div>

      <p className="text-center text-sm text-slate-500">
        Já tem uma conta?{' '}
        <button
          onClick={() => onSwitch('login')}
          className="text-violet-400 hover:text-violet-300 font-medium transition-colors duration-200"
        >
          Entrar
        </button>
      </p>
    </div>
  );
}
