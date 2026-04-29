import { Search, Pencil, Trash2, InboxIcon } from "lucide-react";

function CategoryTable({
  categories,
  search,
  onSearchChange,
  onEdit,
  onDelete,
}) {
  const filtered = categories.filter((c) => {
    const term = search.toLowerCase();
    return c.name && c.name.toLowerCase().includes(term);
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* SEARCH */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search category by name..."
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

      {/* TABLE */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <InboxIcon className="w-12 h-12 mb-3" />
          <p className="text-sm font-medium">
            {search
              ? "No categories found for this search."
              : "No categories registered yet."}
          </p>
        </div>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Name / Preview
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase w-32">
                Color (Hex)
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase w-32">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                {/* NAME / BADGE */}
                <td className="px-6 py-4">
                  <span
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white shadow-sm"
                    style={{ backgroundColor: c.color }}
                  >
                    {c.name}
                  </span>
                </td>

                {/* HEX COLOR */}
                <td className="px-6 py-4 text-sm text-gray-600 uppercase font-mono">
                  {c.color}
                </td>

                {/* ACTIONS */}
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => onEdit(c)}
                      className="p-2 rounded-lg text-blue-600 hover:bg-blue-100 transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onDelete(c)}
                      title="Delete category"
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

export default CategoryTable;