import { Search, Pencil, Trash2, InboxIcon } from "lucide-react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

library.add(fas, far);

const parseIcon = (val) => {
  if (!val) return null;
  if (val.includes(":")) {
    const [prefix, name] = val.split(":");
    return [prefix, name];
  }
  return ["fas", val];
};

function TransactionTypeTable({
  transactionTypes,
  search,
  onSearchChange,
  onEdit,
  onDelete,
}) {
  const filtered = transactionTypes.filter((t) => {
    const term = search.toLowerCase();
    return t.name && t.name.toLowerCase().includes(term);
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* BUSCA */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
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
              ? "Nenhum tipo de transação encontrado para esta busca."
              : "Nenhum tipo de transação cadastrado."}
          </p>
        </div>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase w-16">
                Ícone
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Direção
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase">
                Ações
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {filtered.map((t) => {
              const icon = parseIcon(t.icon);
              const isIN = t.direction === "IN";

              return (
                <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                  {/* ÍCONE */}
                  <td className="px-6 py-4">
                    <span className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 text-lg">
                      {icon ? (
                        <FontAwesomeIcon icon={icon} />
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </span>
                  </td>

                  {/* NOME */}
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">{t.name || "—"}</span>
                  </td>

                  {/* DIREÇÃO */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border
                        ${isIN
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-red-50 text-red-700 border-red-200"
                        }`}
                    >
                      {isIN ? "Entrada (IN)" : "Saída (OUT)"}
                    </span>
                  </td>

                  {/* AÇÕES */}
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => onEdit(t)}
                        className="p-2 rounded-lg text-blue-600 hover:bg-blue-100 transition-colors"
                        title="Editar tipo"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(t)}
                        title="Excluir tipo"
                        className="p-2 rounded-lg text-red-600 hover:bg-red-100 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default TransactionTypeTable;
