import { useState, useEffect } from "react";
import Modal from "../ui/Modal";

const INITIAL_STATE = {
  name: "",
  color: "",
  accountNumber: "",
  branchNumber: "",
  hasCreditCard: false,
  creditCardClosingDay: "",
};

function AccountFormModal({ isOpen, onClose, editing, onSave }) {
  const [form, setForm] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (editing) {
        setForm({
          name: editing.name || "",
          color: editing.color || "",
          accountNumber: editing.accountNumber || "",
          branchNumber: editing.branchNumber || "",
          hasCreditCard: editing.hasCreditCard || false,
          creditCardClosingDay: editing.creditCardClosingDay || "",
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

    if (!form.name.trim()) {
      newErrors.name = "Nome da conta é obrigatório";
    }

    if (!form.color) {
      newErrors.color = "Cor é obrigatória";
    }

    if (form.hasCreditCard) {
      const closingDay = Number(form.creditCardClosingDay);
      if (!closingDay || closingDay < 1 || closingDay > 31) {
        newErrors.creditCardClosingDay = "Informe um dia válido (1 a 31)";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    const payload = {
      name: form.name.trim(),
      color: form.color,
      accountNumber: form.accountNumber.trim() || null,
      branchNumber: form.branchNumber.trim() || null,
      hasCreditCard: form.hasCreditCard,
      creditCardClosingDay: form.hasCreditCard
        ? Number(form.creditCardClosingDay)
        : null,
    };

    if (editing) payload.id = editing.id;

    onSave(payload);
  };

  const getInputClass = (field) =>
    `w-full px-3 py-2.5 text-sm border rounded-lg bg-white transition outline-none
     ${
       errors[field]
         ? "border-red-500 focus:ring-red-500 focus:border-red-500"
         : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
     }`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editing ? "Editar Conta" : "Nova Conta"}
      variant="primary" 
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* NOME */}
        <div>
          <label className="text-sm font-medium mb-1 block">
            Nome da Conta
          </label>
          <input
            type="text"
            placeholder="Ex: Nubank, Banco do Brasil..."
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
            className={getInputClass("name")}
          />
          {errors.name && (
            <p className="text-xs text-red-500 mt-1">{errors.name}</p>
          )}
        </div>

        {/* COR */}
        <div>
          <label className="text-sm font-medium mb-1 block">
            Representação por Cor
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={form.color || "#000000"}
              onChange={(e) => setField("color", e.target.value)}
              className="w-12 h-10 p-1 rounded-lg border border-gray-300 cursor-pointer"
            />
            {form.color ? (
              <span className="text-sm text-gray-500 uppercase">
                {form.color}
              </span>
            ) : (
              <span className="text-sm text-gray-400 italic">
                Selecione uma cor...
              </span>
            )}
          </div>
          {errors.color && (
            <p className="text-xs text-red-500 mt-1">{errors.color}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* AGÊNCIA */}
          <div>
            <label className="text-sm font-medium mb-1 block">
              Agência (Opcional)
            </label>
            <input
              type="text"
              placeholder="Ex: 0001"
              value={form.branchNumber}
              onChange={(e) => setField("branchNumber", e.target.value)}
              className={getInputClass("branchNumber")}
            />
          </div>

          {/* CONTA */}
          <div>
            <label className="text-sm font-medium mb-1 block">
              Número da Conta (Opcional)
            </label>
            <input
              type="text"
              placeholder="Ex: 12345-6"
              value={form.accountNumber}
              onChange={(e) => setField("accountNumber", e.target.value)}
              className={getInputClass("accountNumber")}
            />
          </div>
        </div>

        {/* CARTÃO DE CRÉDITO */}
        <div className="border rounded-xl p-4 bg-gray-50">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="font-medium text-sm">
              Possui Cartão de Crédito?
            </span>
            <div
              onClick={() => setField("hasCreditCard", !form.hasCreditCard)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition 
                ${form.hasCreditCard ? "bg-blue-600" : "bg-gray-300"}`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition 
                  ${form.hasCreditCard ? "translate-x-5" : ""}`}
              />
            </div>
          </label>

          {form.hasCreditCard && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <label className="text-sm font-medium mb-1 block">
                Dia de Fechamento da Fatura
              </label>
              <input
                type="number"
                min="1"
                max="31"
                placeholder="Ex: 15"
                value={form.creditCardClosingDay}
                onChange={(e) =>
                  setField("creditCardClosingDay", e.target.value)
                }
                className={getInputClass("creditCardClosingDay")}
              />
              {errors.creditCardClosingDay && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.creditCardClosingDay}
                </p>
              )}
            </div>
          )}
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

export default AccountFormModal;
