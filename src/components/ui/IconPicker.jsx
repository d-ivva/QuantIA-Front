import { useState, useMemo, useEffect, useRef } from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Search, X } from "lucide-react";

library.add(fas, far);

const camelToKebab = (key) =>
  key.slice(2).replace(/([A-Z])/g, (m) => `-${m.toLowerCase()}`).toLowerCase().replace(/^-/, "");

const SOLID_ICONS = Object.keys(fas)
  .filter((k) => k !== "fas" && k !== "prefix" && k.startsWith("fa"))
  .map((k) => ({ name: camelToKebab(k), prefix: "fas" }));

const REGULAR_ICONS = Object.keys(far)
  .filter((k) => k !== "far" && k !== "prefix" && k.startsWith("fa"))
  .map((k) => ({ name: camelToKebab(k), prefix: "far" }));

const ALL_ICONS = [...SOLID_ICONS, ...REGULAR_ICONS];

const PAGE_SIZE = 80;

function IconPicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const overlayRef = useRef(null);

  const filtered = useMemo(() => {
    if (!search) return ALL_ICONS;
    const term = search.toLowerCase();
    return ALL_ICONS.filter((i) => i.name.includes(term));
  }, [search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const visible = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  useEffect(() => {
    setPage(0);
  }, [search]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (overlayRef.current && !overlayRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleSelect = (icon) => {
    onChange(`${icon.prefix}:${icon.name}`);
    setOpen(false);
    setSearch("");
  };

  const parseIcon = (val) => {
    if (!val) return null;
    if (val.includes(":")) {
      const [prefix, name] = val.split(":");
      return [prefix, name];
    }
    return ["fas", val];
  };

  const currentIcon = parseIcon(value);

  return (
    <div className="relative">
      {/* Botão de abertura */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm border border-gray-300 rounded-lg bg-white hover:border-blue-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
      >
        {currentIcon ? (
          <>
            <span className="w-6 h-6 flex items-center justify-center text-indigo-600 text-lg">
              <FontAwesomeIcon icon={currentIcon} />
            </span>
            <span className="text-gray-700 font-mono text-xs">{value}</span>
          </>
        ) : (
          <span className="text-gray-400">Clique para escolher um ícone...</span>
        )}
      </button>
      {currentIcon && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onChange(""); }}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div
            ref={overlayRef}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 flex flex-col"
            style={{ maxHeight: "80vh" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-800">Escolher Ícone Font Awesome</h3>
              <button
                type="button"
                onClick={() => { setOpen(false); setSearch(""); }}
                className="hover:bg-gray-100 rounded-lg p-1 transition"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Busca */}
            <div className="px-5 py-3 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Buscar ícone (ex: money, arrow, user...)"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1.5">
                {filtered.length} ícone{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""} (sólidos + regulares)
              </p>
            </div>

            {/* Grid de ícones */}
            <div className="overflow-y-auto flex-1 p-4">
              {visible.length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-8">Nenhum ícone encontrado</p>
              ) : (
                <div className="grid grid-cols-8 gap-1 sm:grid-cols-10">
                  {visible.map((icon) => {
                    const selected = value === `${icon.prefix}:${icon.name}`;
                    return (
                      <button
                        key={`${icon.prefix}:${icon.name}`}
                        type="button"
                        title={icon.name}
                        onClick={() => handleSelect(icon)}
                        className={`flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition text-xs
                          ${selected
                            ? "bg-indigo-600 text-white"
                            : "hover:bg-indigo-50 hover:text-indigo-600 text-gray-600"
                          }`}
                      >
                        <FontAwesomeIcon icon={[icon.prefix, icon.name]} className="text-base" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-gray-200">
                <span className="text-xs text-gray-400">
                  Página {page + 1} de {totalPages}
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={page === 0}
                    onClick={() => setPage((p) => p - 1)}
                    className="px-3 py-1 text-xs rounded-lg border hover:bg-gray-100 disabled:opacity-40 transition"
                  >
                    Anterior
                  </button>
                  <button
                    type="button"
                    disabled={page >= totalPages - 1}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-3 py-1 text-xs rounded-lg border hover:bg-gray-100 disabled:opacity-40 transition"
                  >
                    Próxima
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default IconPicker;
