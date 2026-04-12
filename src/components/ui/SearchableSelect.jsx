import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Selecione...",
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef();

  const selected = options.find((o) => o.value == value);

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!ref.current?.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* INPUT */}
      <div
        onClick={() => setOpen(!open)}
        className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg bg-white 
        flex items-center justify-between cursor-pointer hover:border-gray-400 transition"
      >
        <span className={value ? "text-gray-900" : "text-gray-400"}>
          {selected ? selected.label : placeholder}
        </span>

        <ChevronDown className="w-4 h-4 text-gray-400" />
      </div>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 
        rounded-lg shadow-lg animate-fade-in">

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 border-b outline-none text-sm"
          />

          {/* OPTIONS */}
          <div className="max-h-48 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="p-3 text-sm text-gray-400">
                Nenhum resultado
              </div>
            ) : (
              filtered.map((o) => (
                <div
                  key={o.value}
                  onClick={() => {
                    onChange(o.value);
                    setOpen(false);
                    setSearch("");
                  }}
                  className="px-3 py-2 text-sm hover:bg-emerald-50 cursor-pointer"
                >
                  {o.label}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchableSelect;