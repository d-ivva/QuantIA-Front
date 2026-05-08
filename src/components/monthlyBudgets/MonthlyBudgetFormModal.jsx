import { useState, useEffect } from "react";
import Modal from "../ui/Modal";

const MONTHS = [
  { value: 1,  label: 'Janeiro' },
  { value: 2,  label: 'Fevereiro' },
  { value: 3,  label: 'Março' },
  { value: 4,  label: 'Abril' },
  { value: 5,  label: 'Maio' },
  { value: 6,  label: 'Junho' },
  { value: 7,  label: 'Julho' },
  { value: 8,  label: 'Agosto' },
  { value: 9,  label: 'Setembro' },
  { value: 10, label: 'Outubro' },
  { value: 11, label: 'Novembro' },
  { value: 12, label: 'Dezembro' },
];

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;

const INITIAL_STATE = {
  month: currentMonth,
  year: currentYear,
  amount: '',
  userId: 1,
};

function MonthlyBudgetFormModal({ isOpen, onClose, editing, onSave }) {
  const [form, setForm] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (editing) {
        setForm({
          month: editing.month,
          year: editing.year,
          amount: editing.amount,
          userId: editing.userId ?? 1,
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

    if (!form.month || form.month < 1 || form.month > 12) {
      newErrors.month = "Selecione um mês válido.";
    }

    const year = Number(form.year);
    if (!year || year < 2000) {
      newErrors.year = "Informe um ano válido (a partir de 2000).";
    }

    const amount = Number(form.amount);
    if (!amount || amount <= 0) {
      newErrors.amount = "O limite de gastos deve ser maior que zero.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      month: Number(form.month),
      year: Number(form.year),
      amount: Number(form.amount),
      userId: Number(form.userId),
    };

    if (editing) payload.id = editing.id;

    onSave(payload);
  };

  const getInputClass = (field) =>
    `w-full px-3 py-2.5 text-sm border rounded-lg bg-white transition outline-none
     ${
       errors[field]
         ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
         : 'border-gray-300 focus:ring-emerald-500 focus:border-emerald-500'
     }`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editing ? "Editar Limite de Gastos" : "Novo Limite de Gastos"}
      variant="primary"
    >
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* MÊS */}
        <div>
          <label className="text-sm font-medium mb-1 block">Mês</label>
          <select
            value={form.month}
            onChange={(e) => setField('month', Number(e.target.value))}
            className={getInputClass('month')}
          >
            {MONTHS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
          {errors.month && (
            <p className="text-xs text-red-500 mt-1">{errors.month}</p>
          )}
        </div>

        {/* ANO */}
        <div>
          <label className="text-sm font-medium mb-1 block">Ano</label>
          <input
            type="number"
            min="2000"
            max="2100"
            placeholder={String(currentYear)}
            value={form.year}
            onChange={(e) => setField('year', e.target.value)}
            className={getInputClass('year')}
          />
          {errors.year && (
            <p className="text-xs text-red-500 mt-1">{errors.year}</p>
          )}
        </div>

        {/* VALOR */}
        <div>
          <label className="text-sm font-medium mb-1 block">Limite Máximo de Gastos (R$)</label>
          <input
            type="number"
            min="0.01"
            step="0.01"
            placeholder="Ex: 2500.00"
            value={form.amount}
            onChange={(e) => setField('amount', e.target.value)}
            className={getInputClass('amount')}
          />
          {errors.amount && (
            <p className="text-xs text-red-500 mt-1">{errors.amount}</p>
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
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            Salvar
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default MonthlyBudgetFormModal;
