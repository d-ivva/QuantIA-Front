import { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Modal from '../ui/Modal';

const PROVIDERS = [
  { value: 'Claude', label: 'Claude (Anthropic)' },
  { value: 'Gemini', label: 'Gemini (Google)' },
];

function AiConfigFormModal({ isOpen, onClose, editing, usedProviders, onSave }) {
  const [provider, setProvider] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    if (editing) {
      setProvider(editing.provider);
    } else {
      const available = PROVIDERS.filter((p) => !usedProviders.includes(p.value));
      setProvider(available[0]?.value || 'Claude');
    }
    setApiKey('');
    setShowKey(false);
  }, [isOpen, editing, usedProviders]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!apiKey.trim()) return;
    onSave({ provider, apiKey: apiKey.trim() });
  };

  const availableProviders = editing
    ? PROVIDERS.filter((p) => p.value === editing.provider)
    : PROVIDERS.filter((p) => !usedProviders.includes(p.value));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editing ? 'Atualizar Chave de API' : 'Adicionar Configuração de IA'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Provedor de IA
          </label>
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            disabled={!!editing}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-100 disabled:text-gray-500"
          >
            {availableProviders.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Chave de API
          </label>
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={
                editing
                  ? 'Digite a nova chave para substituir'
                  : 'Cole sua chave de API aqui'
              }
              required
              className="w-full border rounded-lg px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {editing && (
            <p className="text-xs text-gray-500 mt-1">
              Chave atual:{' '}
              <span className="font-mono">{editing.apiKeyPreview}</span>
            </p>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition"
          >
            {editing ? 'Atualizar' : 'Salvar'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default AiConfigFormModal;
