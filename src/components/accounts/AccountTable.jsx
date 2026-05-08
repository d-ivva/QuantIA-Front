import { Search, Pencil, Trash2, InboxIcon, CreditCard } from "lucide-react";

function AccountTable({
  accounts,
  search,
  onSearchChange,
  onEdit,
  onDelete,
}) {
  const filtered = accounts.filter((a) => {
    const term = search.toLowerCase();
    return (
      (a.name && a.name.toLowerCase().includes(term)) ||
      (a.accountNumber && a.accountNumber.toLowerCase().includes(term)) ||
      (a.branchNumber && a.branchNumber.toLowerCase().includes(term))
    );
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* BUSCA */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome, agência ou conta..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
          />
          {search && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* TABELA */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <InboxIcon className="w-12 h-12 mb-3" />
          <p className="text-sm font-medium">
            {search
              ? "Nenhuma conta encontrada para esta busca."
              : "Nenhuma conta cadastrada."}
          </p>
        </div>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Cor
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Agência / Conta
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase">
                Cartão de Crédito
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase">
                Ações
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {filtered.map((a) => (
              <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                {/* COR */}
                <td className="px-6 py-4">
                  <div
                    className="w-6 h-6 rounded-full border border-gray-200 shadow-sm"
                    style={{ backgroundColor: a.color || "#cccccc" }}
                    title={a.color}
                  />
                </td>

                {/* NOME */}
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-gray-900">
                    {a.name || "—"}
                  </span>
                </td>

                {/* AGÊNCIA / CONTA */}
                <td className="px-6 py-4 text-sm text-gray-600">
                  {a.branchNumber || a.accountNumber ? (
                    <span>
                      {a.branchNumber ? `Ag: ${a.branchNumber}` : ""}
                      {a.branchNumber && a.accountNumber ? " | " : ""}
                      {a.accountNumber ? `Cc: ${a.accountNumber}` : ""}
                    </span>
                  ) : (
                    "—"
                  )}
                </td>

                {/* CARTÃO */}
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    {a.hasCreditCard ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                        <CreditCard className="w-3 h-3" />
                        Sim (Dia {a.creditCardClosingDay})
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">Não</span>
                    )}
                  </div>
                </td>

                {/* AÇÕES */}
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => onEdit(a)}
                      className="p-2 rounded-lg text-blue-600 hover:bg-blue-100 transition-colors"
                      title="Editar conta"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onDelete(a)}
                      title="Excluir conta"
                      className="p-2 rounded-lg text-red-600 hover:bg-red-100 transition-colors"
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

export default AccountTable;
