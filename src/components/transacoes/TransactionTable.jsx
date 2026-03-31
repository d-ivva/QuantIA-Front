import { Search, Pencil, Trash2, InboxIcon, TrendingUp, TrendingDown } from 'lucide-react';

function TransacaoTable({ transacoes, searchTerm, onSearchChange, onEditar, onDeletar }) {
  const filtradas = transacoes.filter((t) => {
    const termo = searchTerm.toLowerCase();
    return (
      (t.description && t.description.toLowerCase().includes(termo)) ||
      (t.account?.name && t.account.name.toLowerCase().includes(termo)) ||
      (t.category?.name && t.category.name.toLowerCase().includes(termo))
    );
  });

  const formatarMoeda = (valor) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);

  const formatarData = (data) =>
    new Date(data).toLocaleDateString('pt-BR');

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Busca */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por descrição, conta ou categoria..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow"
          />
        </div>
      </div>

      {/* Tabela */}
      {filtradas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <InboxIcon className="w-12 h-12 mb-3" />
          <p className="text-sm font-medium">
            {searchTerm
              ? 'Nenhuma transação encontrada para esta busca.'
              : 'Nenhuma transação cadastrada.'}
          </p>
        </div>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Tipo</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Descrição</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Conta</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Categoria</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Data</th>
              <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Valor</th>
              <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtradas.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                {/* Direção: income ou expense */}
                <td className="px-6 py-4">
                  {t.direction === 'income' ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      <TrendingUp className="w-3 h-3" /> Receita
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <TrendingDown className="w-3 h-3" /> Despesa
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-gray-900">
                    {t.description || '—'}
                  </span>
                  {t.isInstallment && (
                    <span className="ml-2 text-xs text-gray-400">
                      ({t.installmentNumber}/{t.installmentTotal}x)
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600">{t.account?.name || '—'}</span>
                </td>
                <td className="px-6 py-4">
                  {t.category ? (
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: t.category.color }}
                    >
                      {t.category.name}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-400">—</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600">{formatarData(t.transactionDate)}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className={`text-sm font-semibold ${t.direction === 'income' ? 'text-emerald-700' : 'text-red-700'}`}>
                    {t.direction === 'expense' && '− '}
                    {formatarMoeda(t.amount)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onEditar(t)}
                      title="Editar transação"
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeletar(t)}
                      title="Deletar transação"
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default TransacaoTable;