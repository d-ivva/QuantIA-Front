import { useState, useEffect } from "react";
import Modal from "../ui/Modal";

const INITIAL_STATE = {
  accountId: "",
  categoryId: "",
  transactionTypeId: "",
  direction: "expense",
  amount: "",
  description: "",
  transactionDate: new Date().toISOString().split("T")[0],
  isInstallment: false,
  installmentTotal: "",
};

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

  useEffect(() => {
    if (isOpen) {
      if (editing) {
        setForm({
          accountId: editing.accountId?.toString() || "",
          categoryId: editing.categoryId?.toString() || "",
          transactionTypeId: editing.transactionTypeId?.toString() || "",
          direction: editing.direction || "expense",
          amount: editing.amount?.toString() || "",
          description: editing.description || "",
          transactionDate:
            editing.transactionDate?.split("T")[0] ||
            new Date().toISOString().split("T")[0],
          isInstallment: editing.isInstallment || false,
          installmentTotal: editing.installmentTotal?.toString() || "",
        });
      } else {
        setForm(INITIAL_STATE);
      }
    }
  }, [isOpen, editing]);

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleTypeChange = (typeId) => {
    const type = transactionTypes.find((t) => t.id === Number(typeId));

    setField("transactionTypeId", typeId);

    if (type) {
      setField("direction", type.direction);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.accountId || !form.transactionTypeId) {
      return alert("Preencha os campos obrigatórios.");
    }

    if (!form.amount || parseFloat(form.amount) <= 0) {
      return alert("Valor inválido.");
    }

    if (
      form.isInstallment &&
      (!form.installmentTotal || form.installmentTotal < 2)
    ) {
      return alert("Número de parcelas inválido (mínimo 2).");
    }

    const payload = {
      accountId: Number(form.accountId),
      categoryId: form.categoryId ? Number(form.categoryId) : null,
      transactionTypeId: Number(form.transactionTypeId),
      direction: form.direction,
      amount: parseFloat(form.amount),
      description: form.description || null,
      transactionDate: new Date(form.transactionDate).toISOString(),
      isInstallment: form.isInstallment,
      installmentTotal: form.isInstallment
        ? Number(form.installmentTotal)
        : null,
      installmentNumber: form.isInstallment ? 1 : null,
    };

    if (editing) {
      payload.id = editing.id;
    }

    onSave(payload);
  };

  const inputCls =
    "w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editing ? "Editar Transação" : "Nova Transação"}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* DADOS PRINCIPAIS */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
            Dados principais
          </p>

          {/* Tipo */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Transação
            </label>
            <select
              value={form.transactionTypeId}
              onChange={(e) => handleTypeChange(e.target.value)}
              required
              className={inputCls}
            >
              <option value="">Selecione...</option>
              {transactionTypes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Conta */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Conta
            </label>
            <select
              value={form.accountId}
              onChange={(e) => setField("accountId", e.target.value)}
              required
              className={inputCls}
            >
              <option value="">Selecione uma conta...</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          {/* Categoria */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoria <span className="text-gray-400">(opcional)</span>
            </label>
            <select
              value={form.categoryId}
              onChange={(e) => setField("categoryId", e.target.value)}
              className={inputCls}
            >
              <option value="">Sem categoria</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* VALOR E DATA */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
            Valores
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valor (R$)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={form.amount}
                onChange={(e) => setField("amount", e.target.value)}
                required
                className={inputCls}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data
              </label>
              <input
                type="date"
                value={form.transactionDate}
                onChange={(e) =>
                  setField("transactionDate", e.target.value)
                }
                required
                className={inputCls}
              />
            </div>
          </div>
        </div>

        {/* DESCRIÇÃO */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descrição <span className="text-gray-400">(opcional)</span>
          </label>
          <input
            type="text"
            value={form.description}
            onChange={(e) => setField("description", e.target.value)}
            placeholder="Ex: Conta de luz"
            className={inputCls}
          />
        </div>

        {/* PARCELAMENTO */}
        {form.direction === "expense" && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isInstallment}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setField("isInstallment", checked);

                  if (!checked) {
                    setField("installmentTotal", "");
                  }
                }}
                className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-sm font-medium">
                Compra parcelada
              </span>
            </label>

            {form.isInstallment && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número de parcelas
                  </label>
                  <input
                    type="number"
                    min="2"
                    max="60"
                    value={form.installmentTotal}
                    onChange={(e) =>
                      setField("installmentTotal", e.target.value)
                    }
                    required
                    className={inputCls}
                  />
                </div>

                {/* 💡 UX: valor por parcela */}
                {form.amount && form.installmentTotal && (
                  <p className="text-xs text-gray-500">
                    Cada parcela:{" "}
                    <strong>
                      {(form.amount / form.installmentTotal).toLocaleString(
                        "pt-BR",
                        {
                          style: "currency",
                          currency: "BRL",
                        }
                      )}
                    </strong>
                  </p>
                )}
              </>
            )}
          </div>
        )}

        {/* BOTÕES */}
        <div className="flex gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-medium transition"
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700 py-2.5 rounded-lg text-sm font-semibold transition"
          >
            {editing ? "Atualizar" : "Salvar"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default TransactionFormModal;