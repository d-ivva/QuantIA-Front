import { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import IconPicker from "../ui/IconPicker";

const INITIAL_STATE = {
  name: "",
  direction: "IN",
  icon: "",
};

function TransactionTypeFormModal({ isOpen, onClose, editing, onSave }) {
  const [form, setForm] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (editing) {
        setForm({
          name: editing.name || "",
          direction: editing.direction === "IN" ? "IN" : "OUT",
          icon: editing.icon || "",
        });
      } else {
        setForm(INITIAL_STATE);
      }
      setErrors({});
    }
  }, [isOpen, editing]);

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Nome do tipo é obrigatório";
    if (!form.direction) newErrors.direction = "Direção é obrigatória";
    if (!form.icon.trim()) newErrors.icon = "Ícone é obrigatório";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      name: form.name.trim(),
      direction: form.direction,
      icon: form.icon.trim(),
    };
    if (editing) payload.id = editing.id;

    onSave(payload);
  };

  const getInputClass = (field) =>
    `w-full px-3 py-2.5 text-sm border rounded-lg bg-white transition outline-none
     ${errors[field]
       ? "border-red-500 focus:ring-2 focus:ring-red-500"
       : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
     }`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editing ? "Editar Tipo de Transação" : "Novo Tipo de Transação"}
      variant="primary"
    >
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* NOME */}
        <div>
          <label className="text-sm font-medium mb-1 block">Nome do Tipo</label>
          <input
            type="text"
            placeholder="Ex: Salário, Aluguel, Transferência..."
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
            className={getInputClass("name")}
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
        </div>

        {/* DIREÇÃO */}
        <div>
          <label className="text-sm font-medium mb-1 block">Direção da Transação</label>
          <div className="flex gap-3">
            {[
              { value: "IN", label: "Entrada", color: "green" },
              { value: "OUT", label: "Saída", color: "red" },
            ].map(({ value, label, color }) => (
              <button
                key={value}
                type="button"
                onClick={() => setField("direction", value)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium border-2 transition-all
                  ${form.direction === value
                    ? color === "green"
                      ? "bg-green-50 border-green-500 text-green-700"
                      : "bg-red-50 border-red-500 text-red-700"
                    : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
              >
                {label} ({value})
              </button>
            ))}
          </div>
          {errors.direction && <p className="text-xs text-red-500 mt-1">{errors.direction}</p>}
        </div>

        {/* ÍCONE */}
        <div>
          <label className="text-sm font-medium mb-1 block">Ícone Font Awesome</label>
          <IconPicker
            value={form.icon}
            onChange={(val) => setField("icon", val)}
          />
          {errors.icon && <p className="text-xs text-red-500 mt-1">{errors.icon}</p>}
        </div>

        {/* BOTÕES */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-100 hover:bg-gray-200 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            Salvar
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default TransactionTypeFormModal;
