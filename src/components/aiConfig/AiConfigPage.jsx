import { useState, useEffect } from 'react';
import { KeyRound, Plus, RefreshCw, Trash2, Pencil, CheckCircle, XCircle } from 'lucide-react';
import {
  getAiConfigs,
  createAiConfig,
  updateAiConfig,
  deleteAiConfig,
} from '../../services/AiConfigService';
import { useToast } from '../../hooks/useToast';
import AiConfigFormModal from './AiConfigFormModal';
import ConfirmDialog from '../ui/ConfirmDialog';

const PROVIDER_INFO = {
  Claude: {
    label: 'Claude',
    company: 'Anthropic',
    badge: 'bg-violet-100 text-violet-700 border-violet-200',
  },
  Gemini: {
    label: 'Gemini',
    company: 'Google',
    badge: 'bg-blue-100 text-blue-700 border-blue-200',
  },
};

const ALL_PROVIDERS = Object.keys(PROVIDER_INFO);

function AiConfigPage() {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const toast = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setConfigs(await getAiConfigs());
    } catch {
      toast.error('Erro ao carregar configurações de IA');
    } finally {
      setLoading(false);
    }
  };

  const getErrorMessage = (err) => {
    if (err.response?.data?.message) return err.response.data.message;
    if (typeof err.response?.data === 'string') return err.response.data;
    return err.message || 'Erro ao salvar configuração';
  };

  const handleSave = async (data) => {
    try {
      if (editing) {
        await updateAiConfig(editing.id, data);
        toast.success('Chave atualizada com sucesso');
      } else {
        await createAiConfig(data);
        toast.success('Configuração criada com sucesso');
      }
      setIsFormOpen(false);
      setEditing(null);
      await loadData();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleDelete = async () => {
    try {
      await deleteAiConfig(deleting.id);
      toast.success('Configuração removida com sucesso');
      setDeleting(null);
      setIsDeleteOpen(false);
      await loadData();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const usedProviders = configs.map((c) => c.provider);
  const allConfigured = ALL_PROVIDERS.every((p) => usedProviders.includes(p));

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-emerald-600" />
            <h1 className="text-2xl font-semibold text-gray-800">Configuração de IA</h1>
          </div>
          <p className="text-sm text-gray-500">
            Gerencie suas chaves de API para os assistentes de IA
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={loadData}
            disabled={loading}
            className="p-2 rounded-lg border hover:bg-gray-100 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          {!allConfigured && (
            <button
              onClick={() => {
                setEditing(null);
                setIsFormOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Adicionar
            </button>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 shadow-sm">
          <p className="text-xs text-emerald-700">Provedores Configurados</p>
          <p className="text-xl font-bold text-emerald-700">
            {configs.length} / {ALL_PROVIDERS.length}
          </p>
        </div>
      </div>

      {/* Config cards */}
      {loading ? (
        <div className="flex items-center justify-center py-12 text-gray-400">
          <RefreshCw className="w-4 h-4 animate-spin mr-2" />
          Carregando...
        </div>
      ) : configs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
            <KeyRound className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-700">Nenhuma IA configurada</h3>
          <p className="text-sm text-gray-500 mt-1 max-w-sm">
            Adicione uma chave de API para começar a usar o assistente QuantIA
          </p>
          <button
            onClick={() => {
              setEditing(null);
              setIsFormOpen(true);
            }}
            className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
          >
            <Plus className="w-4 h-4" />
            Adicionar chave de API
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {configs.map((config) => {
            const info = PROVIDER_INFO[config.provider] ?? {
              label: config.provider,
              company: '',
              badge: 'bg-gray-100 text-gray-700 border-gray-200',
            };
            return (
              <div
                key={config.id}
                className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${info.badge}`}
                    >
                      {info.label}
                    </span>
                    <div>
                      <p className="font-medium text-gray-800">{info.company}</p>
                      <p className="text-xs text-gray-500 font-mono mt-0.5">
                        {config.apiKeyPreview}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {config.isActive ? (
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400" />
                    )}
                    <span
                      className={`text-xs font-medium ${
                        config.isActive ? 'text-emerald-600' : 'text-red-500'
                      }`}
                    >
                      {config.isActive ? 'Ativa' : 'Inativa'}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => {
                      setEditing(config);
                      setIsFormOpen(true);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 border rounded-lg hover:bg-gray-50"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Atualizar chave
                  </button>
                  <button
                    onClick={() => {
                      setDeleting(config);
                      setIsDeleteOpen(true);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Remover
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AiConfigFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        editing={editing}
        usedProviders={usedProviders}
        onSave={handleSave}
      />

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Remover Configuração"
        message={`Deseja remover a configuração de ${deleting?.provider}?\nVocê não poderá usar este assistente até adicionar uma nova chave.`}
      />
    </div>
  );
}

export default AiConfigPage;
