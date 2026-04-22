import { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import SearchableSelect from "../ui/SearchableSelect";

const INITIAL_STATE = {
  accountId: "",
  categoryId: "",
  transactionTypeId: "",
  direction: "expense",
  amount: "0,00",
  description: "",
  transactionDate: new Date().toLocaleDateString("en-CA"),
  isInstallment: false,
  installmentTotal: "",
};

function formatCurrencyInput(value) {
  const numbers = value.replace(/\D/g, "");
  const number = Number(numbers) / 100;

  return number.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
  });
}

function parseCurrency(value) {
  return Number(value.replace(/\./g, "").replace(",", "."));
}

function TransactionFormModal({
  isOpen,
  onClose,
  editing,
  onSave,
  accounts,
  categories,
  transactionTypes,
}) {
  const [form, setForm] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});

  const isEditingInstallment = editing?.isInstallment;

  useEffect(() => {
    if (isOpen) {
      if (editing) {
        // ✅ MAPEAMENTO MANUAL (SEM ...editing)
        setForm({
          accountId: editing.accountId,
          categoryId: editing.categoryId,
          transactionTypeId: editing.transactionTypeId,
          direction: editing.direction,
          amount: editing.amount.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
          }),
          description: editing.description || "",
          transactionDate: editing.transactionDate
            ? editing.transactionDate.split("T")[0]
            : "",
          isInstallment: editing.isInstallment,
          installmentTotal: editing.installmentTotal || "",
        });
      } else {
        setForm(INITIAL_STATE);
      }

      setErrors({});
    }
  }, [isOpen, editing]);

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));

    setErrors((prev) => ({
      ...prev,
      [field]: null,
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.transactionTypeId)
      newErrors.transactionTypeId = "Selecione o tipo de transação";

    if (!form.accountId)
      newErrors.accountId = "Selecione uma conta";

    if (!form.categoryId)
      newErrors.categoryId = "Selecione uma categoria";

    const amount = parseCurrency(form.amount);
    if (!amount || amount <= 0)
      newErrors.amount = "Informe um valor válido";

    if (!form.transactionDate)
      newErrors.transactionDate = "Informe a data";

    if (form.isInstallment && !isEditingInstallment) {
      if (!form.installmentTotal || form.installmentTotal < 2)
        newErrors.installmentTotal = "Mínimo de 2 parcelas";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    const amount = parseCurrency(form.amount);

    // ✅ PAYLOAD LIMPO (SEM ...form)
    const payload = {
      accountId: Number(form.accountId),
      categoryId: Number(form.categoryId),
      transactionTypeId: Number(form.transactionTypeId),
      amount,
      description: form.description,
      direction: form.direction,
      transactionDate: form.transactionDate,
      isInstallment: form.isInstallment,
      installmentTotal: form.installmentTotal
        ? Number(form.installmentTotal)
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
      title={editing ? "Editar Transação" : "Nova Transação"}
      variant={form.direction === "income" ? "income" : "expense"}
    >
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* DIREÇÃO */}
        <div>
          <label className="text-sm font-medium mb-1 block">Tipo</label>
          <select
            value={form.direction}
            disabled={!!editing}
            onChange={(e) => setField("direction", e.target.value)}
            className={getInputClass("direction")}
          >
            <option value="income">Receita</option>
            <option value="expense">Despesa</option>
          </select>
        </div>

        {/* TIPO TRANSAÇÃO */}
        <div>
          <label className="text-sm font-medium mb-1 block">
            Tipo de Transação
          </label>

          <SearchableSelect
            value={form.transactionTypeId}
            onChange={(v) => setField("transactionTypeId", v)}
            options={transactionTypes
              .filter((t) => t.direction === form.direction)
              .map((t) => ({
                value: t.id,
                label: t.name,
              }))}
          />

          {errors.transactionTypeId && (
            <p className="text-xs text-red-500 mt-1">
              {errors.transactionTypeId}
            </p>
          )}
        </div>

        {/* CONTA */}
        <div>
          <label className="text-sm font-medium mb-1 block">Conta</label>

          <SearchableSelect
            value={form.accountId}
            onChange={(v) => setField("accountId", v)}
            options={accounts.map((a) => ({
              value: a.id,
              label: a.name,
            }))}
          />

          {errors.accountId && (
            <p className="text-xs text-red-500 mt-1">
              {errors.accountId}
            </p>
          )}
        </div>

        {/* CATEGORIA */}
        <div>
          <label className="text-sm font-medium mb-1 block">
            Categoria
          </label>

          <SearchableSelect
            value={form.categoryId}
            onChange={(v) => setField("categoryId", v)}
            options={categories.map((c) => ({
              value: c.id,
              label: c.name,
            }))}
          />

          {errors.categoryId && (
            <p className="text-xs text-red-500 mt-1">
              {errors.categoryId}
            </p>
          )}
        </div>

        {/* VALOR */}
        <div>
          <label className="text-sm font-medium mb-1 block">Valor</label>
          <input
            value={form.amount}
            onChange={(e) =>
              setField("amount", formatCurrencyInput(e.target.value))
            }
            className={getInputClass("amount")}
          />

          {errors.amount && (
            <p className="text-xs text-red-500 mt-1">
              {errors.amount}
            </p>
          )}
        </div>

        {/* DESCRIÇÃO */}
        <div>
          <label className="text-sm font-medium mb-1 block">Descrição</label>
          <input
            value={form.description}
            onChange={(e) => setField("description", e.target.value)}
            className={getInputClass("description")}
          />
        </div>

        {/* DATA */}
        <div>
          <label className="text-sm font-medium mb-1 block">Data</label>
          <input
            type="date"
            value={form.transactionDate}
            disabled={isEditingInstallment}
            onChange={(e) => setField("transactionDate", e.target.value)}
            className={getInputClass("transactionDate")}
          />

          {errors.transactionDate && (
            <p className="text-xs text-red-500 mt-1">
              {errors.transactionDate}
            </p>
          )}
        </div>

        {/* PARCELADO */}
        {!isEditingInstallment && form.direction === "expense" && (
          <div className="border rounded-xl p-4 bg-gray-50">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="font-medium">Compra parcelada</span>

              <div
                onClick={() =>
                  setField("isInstallment", !form.isInstallment)
                }
                className={`w-11 h-6 flex items-center rounded-full p-1 transition 
                ${form.isInstallment ? "bg-red-500" : "bg-gray-300"}`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition 
                  ${form.isInstallment ? "translate-x-5" : ""}`}
                />
              </div>
            </label>

            {form.isInstallment && (
              <input
                type="number"
                placeholder="Número de parcelas"
                value={form.installmentTotal}
                onChange={(e) =>
                  setField("installmentTotal", e.target.value)
                }
                className={`${getInputClass("installmentTotal")} mt-3`}
              />
            )}

            {errors.installmentTotal && (
              <p className="text-xs text-red-500 mt-1">
                {errors.installmentTotal}
              </p>
            )}
          </div>
        )}

        {/* BOTÕES */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-100 hover:bg-gray-200 py-2.5 rounded-lg"
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold"
          >
            Salvar
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default TransactionFormModal;