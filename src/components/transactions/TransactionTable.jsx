import {
  Search,
  Pencil,
  Trash2,
  InboxIcon,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

function TransactionTable({
  transactions,
  search,
  onSearchChange,
  onEdit,
  onDelete,
}) {
  const filtered = transactions.filter((t) => {
    const term = search.toLowerCase();

    return (
      (t.description && t.description.toLowerCase().includes(term)) ||
      (t.account?.name && t.account.name.toLowerCase().includes(term)) ||
      (t.category?.name && t.category.name.toLowerCase().includes(term))
    );
  });

  const formatCurrency = (value) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  const formatDate = (date) => {
    if (!date) return "";

    return date.split("T")[0].split("-").reverse().join("/");
  };

  const getContrastYIQ = (hexcolor) => {
    if (!hexcolor) return "black";
    const hex = hexcolor.replace("#", "");
    if (hex.length !== 6 && hex.length !== 3) return "black";
    
    let r, g, b;
    if (hex.length === 3) {
      r = parseInt(hex.substring(0, 1) + hex.substring(0, 1), 16);
      g = parseInt(hex.substring(1, 2) + hex.substring(1, 2), 16);
      b = parseInt(hex.substring(2, 3) + hex.substring(2, 3), 16);
    } else {
      r = parseInt(hex.substring(0, 2), 16);
      g = parseInt(hex.substring(2, 4), 16);
      b = parseInt(hex.substring(4, 6), 16);
    }
    
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? "black" : "white";
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* BUSCA */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por descrição, conta ou categoria..."
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
              ? "Nenhuma transação encontrada para esta busca."
              : "Nenhuma transação cadastrada."}
          </p>
        </div>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Descrição
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Conta
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Categoria
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Data
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">
                Valor
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase">
                Ações
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {filtered.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                {/* TIPO */}
                <td className="px-6 py-4">
                  {t.direction === "income" ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      <TrendingUp className="w-3 h-3" /> Receita
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <TrendingDown className="w-3 h-3" /> Despesa
                    </span>
                  )}
                </td>

                {/* DESCRIÇÃO */}
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-gray-900">
                    {t.description || "—"}
                  </span>

                  {t.isInstallment && (
                    <div className="mt-1">
                      <span className="text-[11px] px-2 py-0.5 bg-gray-100 rounded text-gray-600">
                        {t.installmentNumber}/{t.installmentTotal} parcelas
                      </span>
                    </div>
                  )}
                </td>

                {/* CONTA */}
                <td className="px-6 py-4">
                  {t.account ? (
                    <span
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                      style={{ 
                        backgroundColor: t.account.color || '#f3f4f6',
                        color: t.account.color ? getContrastYIQ(t.account.color) : '#374151'
                      }}
                    >
                      {t.account.name}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-400">—</span>
                  )}
                </td>

                {/* CATEGORIA */}
                <td className="px-6 py-4">
                  {t.category ? (
                    <span
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                      style={{ 
                        backgroundColor: t.category.color || '#f3f4f6',
                        color: t.category.color ? getContrastYIQ(t.category.color) : '#374151'
                      }}
                    >
                      {t.category.name}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-400">—</span>
                  )}
                </td>

                {/* DATA */}
                <td className="px-6 py-4 text-sm text-gray-600">
                  {formatDate(t.transactionDate)}
                </td>

                {/* VALOR */}
                <td className="px-6 py-4 text-right">
                  <span
                    className={`text-sm font-semibold ${t.direction === "income"
                        ? "text-emerald-700"
                        : "text-red-700"
                      }`}
                  >
                    {t.direction === "expense" && "− "}
                    {formatCurrency(t.amount)}
                  </span>
                </td>

                {/* AÇÕES */}
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => onEdit(t)}
                      className="p-2 rounded-lg text-blue-600 hover:bg-blue-100 transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onDelete(t)}
                      title="Excluir transação"
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

export default TransactionTable;
