import { useEffect, useRef, useState } from 'react';
import api from '../../lib/api';
import DeleteAccountDialog from './DeleteAccountDialog';

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function avatarColor(name = '') {
  const colors = [
    ['rgba(0,212,255,0.25)', '#00d4ff'],
    ['rgba(124,58,237,0.25)', '#a78bfa'],
    ['rgba(16,185,129,0.25)', '#34d399'],
    ['rgba(245,158,11,0.25)', '#fbbf24'],
    ['rgba(239,68,68,0.25)', '#f87171'],
    ['rgba(59,130,246,0.25)', '#60a5fa'],
  ];
  let hash = 0;
  for (const c of name) hash = (hash * 31 + c.charCodeAt(0)) & 0xffff;
  return colors[hash % colors.length];
}

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
}

export default function ProfilePanel({ onClose, initialProfile, onProfileUpdate }) {
  const [profile,     setProfile]     = useState(initialProfile ?? null);
  const [editName,    setEditName]    = useState('');
  const [saving,      setSaving]      = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError,   setSaveError]   = useState('');
  const [showDelete,  setShowDelete]  = useState(false);
  const [exiting,     setExiting]     = useState(false);
  const inputRef = useRef(null);

  // Fetch fresh profile from API
  useEffect(() => {
    api.get('/profile').then(res => {
      setProfile(res.data);
      setEditName(res.data.name);
    }).catch(() => {
      if (initialProfile) {
        setProfile(initialProfile);
        setEditName(initialProfile.name ?? '');
      }
    });
  }, []);

  const handleClose = () => {
    setExiting(true);
    setTimeout(onClose, 240);
  };

  const handleSave = async () => {
    if (!editName.trim()) { setSaveError('O nome não pode estar vazio.'); return; }
    setSaving(true);
    setSaveError('');
    setSaveSuccess(false);
    try {
      const res = await api.put('/profile', { name: editName.trim() });
      setProfile(res.data);
      setSaveSuccess(true);
      onProfileUpdate?.(res.data);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setSaveError(err.response?.data?.message ?? 'Erro ao salvar.');
    } finally {
      setSaving(false);
    }
  };

  const [bg, fg] = avatarColor(profile?.name ?? '');
  const isDirty  = editName.trim() !== (profile?.name ?? '').trim();

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 overlay-enter"
        style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
        onClick={handleClose}
      />

      {/* Panel */}
      <div
        className={`fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm flex flex-col ${exiting ? 'panel-exit' : 'panel-enter'}`}
        style={{
          background:     'rgba(10,12,22,0.95)',
          borderLeft:     '1px solid rgba(255,255,255,0.07)',
          backdropFilter: 'blur(24px)',
          boxShadow:      '-24px 0 80px rgba(0,0,0,0.5)',
        }}
      >
        {/* Top accent */}
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.35), rgba(124,58,237,0.35), transparent)' }} />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div>
            <h2 className="text-base font-semibold text-white">Perfil</h2>
            <p className="text-xs text-slate-500 mt-0.5">Gerencie suas informações</p>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content (scrollable) */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">

          {/* Avatar + Info */}
          <div className="flex flex-col items-center text-center gap-4">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold relative"
              style={{ background: bg, border: `1px solid ${fg}40`, color: fg, boxShadow: `0 0 24px ${fg}20` }}
            >
              {getInitials(profile?.name)}
              <span
                className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2"
                style={{ background: '#22c55e', borderColor: 'rgba(10,12,22,0.95)' }}
              />
            </div>
            <div>
              <p className="text-lg font-semibold text-white leading-tight">{profile?.name ?? '—'}</p>
              <p className="text-sm text-slate-500 mt-0.5">{profile?.email ?? '—'}</p>
              <div className="flex items-center justify-center gap-1.5 mt-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-xs text-emerald-400/70 font-medium">Conta ativa</span>
              </div>
            </div>
          </div>

          {/* Info card */}
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
            {[
              { label: 'E-mail', value: profile?.email ?? '—', locked: true },
              { label: 'Membro desde', value: formatDate(profile?.createdAt) },
            ].map((row, i, arr) => (
              <div
                key={row.label}
                className="flex items-center justify-between px-4 py-3"
                style={{
                  background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                  borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                }}
              >
                <span className="text-xs text-slate-500">{row.label}</span>
                <span className={`text-xs flex items-center gap-1.5 ${row.mono ? 'font-mono text-slate-400' : 'text-slate-300'}`}>
                  {row.locked && (
                    <svg className="w-3 h-3 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  )}
                  {row.value}
                </span>
              </div>
            ))}
          </div>

          {/* Edit name */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Editar informações</h3>
            <div className="space-y-1.5">
              <label className="block text-xs text-slate-500">Nome de exibição</label>
              <input
                ref={inputRef}
                type="text"
                value={editName}
                onChange={e => { setEditName(e.target.value); setSaveError(''); setSaveSuccess(false); }}
                className="w-full rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none transition-all duration-200"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border:     '1px solid rgba(255,255,255,0.08)',
                  boxShadow:  'none',
                }}
                onFocus={e => { e.target.style.borderColor = 'rgba(0,212,255,0.4)'; e.target.style.boxShadow = '0 0 0 3px rgba(0,212,255,0.08)'; }}
                onBlur={e  => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs text-slate-500">E-mail</label>
              <div className="flex items-center gap-2 rounded-xl px-4 py-3"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <svg className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-sm text-slate-600">{profile?.email ?? '—'}</span>
                <span className="ml-auto text-[10px] text-slate-700 bg-white/5 px-2 py-0.5 rounded">Imutável</span>
              </div>
            </div>

            {saveError && (
              <p className="text-xs text-red-400/80 px-3 py-2 rounded-lg"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}>
                {saveError}
              </p>
            )}

            <button
              onClick={handleSave}
              disabled={saving || !isDirty}
              className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: saveSuccess ? 'rgba(34,197,94,0.18)' : 'rgba(0,212,255,0.12)',
                border:     saveSuccess ? '1px solid rgba(34,197,94,0.4)' : '1px solid rgba(0,212,255,0.25)',
                color:      saveSuccess ? '#86efac' : '#a5f3fc',
              }}
            >
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-cyan-400/40 border-t-cyan-400 rounded-full animate-spin" />
                  Salvando...
                </span>
              ) : saveSuccess ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  Salvo!
                </span>
              ) : 'Salvar alterações'}
            </button>
          </div>

          {/* Danger Zone */}
          <div className="space-y-4 pb-2">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px" style={{ background: 'rgba(239,68,68,0.2)' }} />
              <span className="text-xs font-semibold text-red-500/70 uppercase tracking-widest">Zona de perigo</span>
              <div className="flex-1 h-px" style={{ background: 'rgba(239,68,68,0.2)' }} />
            </div>

            <div className="rounded-xl p-4 space-y-3"
              style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)' }}>
              <div>
                <p className="text-sm font-medium text-red-300">Excluir conta</p>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Remove permanentemente o seu perfil, dados financeiros, histórico e acesso ao sistema.
                </p>
              </div>
              <button
                onClick={() => setShowDelete(true)}
                className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                style={{
                  background: 'rgba(239,68,68,0.1)',
                  border:     '1px solid rgba(239,68,68,0.3)',
                  color:      '#fca5a5',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.18)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.5)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'; }}
              >
                Excluir minha conta
              </button>
            </div>
          </div>
        </div>
      </div>

      {showDelete && (
        <DeleteAccountDialog
          email={profile?.email ?? ''}
          onClose={() => setShowDelete(false)}
        />
      )}
    </>
  );
}
