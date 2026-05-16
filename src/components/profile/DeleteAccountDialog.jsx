import { useState } from 'react';
import api from '../../lib/api';
import { tokenStore } from '../../auth/tokenStore';

export default function DeleteAccountDialog({ email, onClose }) {
  const [confirmation, setConfirmation] = useState('');
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState('');

  const confirmed = confirmation.trim().toLowerCase() === 'excluir';

  const handleDelete = async () => {
    if (!confirmed) return;
    setLoading(true);
    setError('');
    try {
      await api.delete('/profile');
      tokenStore.clearSession();
    } catch (err) {
      setError(err.response?.data?.message ?? 'Erro ao excluir conta. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 overlay-enter"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className="dialog-enter w-full max-w-md rounded-2xl p-6 space-y-6"
        style={{
          background:    'rgba(15,15,25,0.92)',
          border:        '1px solid rgba(239,68,68,0.25)',
          boxShadow:     '0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(239,68,68,0.08)',
          backdropFilter: 'blur(20px)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Icon */}
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)' }}
          >
            <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-white text-lg">Excluir conta</h3>
            <p className="text-sm text-slate-500 mt-0.5">Esta ação é permanente e irreversível.</p>
          </div>
        </div>

        {/* Warning */}
        <div
          className="rounded-xl p-4 text-sm text-red-300/80 leading-relaxed space-y-1"
          style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.15)' }}
        >
          <p className="font-medium text-red-300">Todos os seus dados serão apagados permanentemente:</p>
          <ul className="mt-2 space-y-0.5 text-red-300/70 text-xs">
            {['Transações e histórico financeiro', 'Contas e categorias', 'Metas e orçamentos', 'Configurações de IA e histórico de chat', 'Perfil e credenciais de acesso'].map(item => (
              <li key={item} className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-red-400/60 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Confirmation input */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-slate-400 uppercase tracking-wide">
            Digite <span className="text-red-400 font-bold">excluir</span> para confirmar
          </label>
          <input
            type="text"
            value={confirmation}
            onChange={e => setConfirmation(e.target.value)}
            placeholder="excluir"
            autoComplete="off"
            className="w-full rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none transition-all duration-200"
            style={{
              background:  'rgba(255,255,255,0.04)',
              border:      `1px solid ${confirmed ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.08)'}`,
              boxShadow:   confirmed ? '0 0 0 3px rgba(239,68,68,0.1)' : 'none',
            }}
          />
        </div>

        {error && (
          <p className="text-xs text-red-400/80 px-3 py-2 rounded-lg"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}>
            {error}
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors duration-200"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            disabled={!confirmed || loading}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: confirmed ? 'rgba(239,68,68,0.2)' : 'rgba(239,68,68,0.08)',
              border:     `1px solid ${confirmed ? 'rgba(239,68,68,0.5)' : 'rgba(239,68,68,0.2)'}`,
              color:      '#fca5a5',
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-red-400/40 border-t-red-400 rounded-full animate-spin" />
                Excluindo...
              </span>
            ) : 'Excluir permanentemente'}
          </button>
        </div>
      </div>
    </div>
  );
}
