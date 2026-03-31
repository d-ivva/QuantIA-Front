import { useState, useEffect } from "react";
import Modal from "../ui/Modal";

const ESTADO_INICIAL = {
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

function TransacaoFormModal({
  isOpen,
  onClose,
  transacaoEditando,
  onSalvar,
  contas,
  categorias,
  tiposTransacao,
}) {
  const [form, setForm] = useState(ESTADO_INICIAL);

  useEffect(() => {
    if (isOpen) {
      if (transacaoEditando) {
        setForm({
          accountId: transacaoEditando.accountId?.toString() || "",
          categoryId: transacaoEditando.categoryId?.toString() || "",
          transactionTypeId:
            transacaoEditando.transactionTypeId?.toString() || "",
          direction: transacaoEditando.direction || "expense",
          amount: transacaoEditando.amount?.toString() || "",
          description: transacaoEditando.description || "",
          transactionDate:
            transacaoEditando.transactionDate?.split("T")[0] ||
            new Date().toISOString().split("T")[0],
          isInstallment: transacaoEditando.isInstallment || false,
          installmentTotal:
            transacaoEditando.installmentTotal?.toString() || "",
        });
      } else {
        setForm(ESTADO_INICIAL);
      }
    }
  }, [isOpen, transacaoEditando]);

  const set = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleTipoChange = (tipoId) => {
    const tipo = tiposTransacao.find((t) => t.id === Number(tipoId));
    set("transactionTypeId", tipoId);
    if (tipo) set("direction", tipo.direction);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
    if (transacaoEditando) payload.id = transacaoEditando.id;
    onSalvar(payload);
  };

  const inputCls =
    "w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={transacaoEditando ? "Editar Transação" : "Nova Transação"}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Tipo de transação */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Transação
          </label>
          <select
            value={form.transactionTypeId}
            onChange={(e) => handleTipoChange(e.target.value)}
            required
            className={inputCls}
          >
            <option value="">Selecione...</option>
            {tiposTransacao.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Conta */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Conta
          </label>
          <select
            value={form.accountId}
            onChange={(e) => set("accountId", e.target.value)}
            required
            className={inputCls}
          >
            <option value="">Selecione uma conta...</option>
            {contas.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Categoria */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categoria{" "}
            <span className="text-gray-400 font-normal">(opcional)</span>
          </label>
          <select
            value={form.categoryId}
            onChange={(e) => set("categoryId", e.target.value)}
            className={inputCls}
          >
            <option value="">Sem categoria</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Valor e Data */}
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
              onChange={(e) => set("amount", e.target.value)}
              placeholder="0,00"
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
              onChange={(e) => set("transactionDate", e.target.value)}
              required
              className={inputCls}
            />
          </div>
        </div>

        {/* Descrição */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descrição{" "}
            <span className="text-gray-400 font-normal">(opcional)</span>
          </label>
          <input
            type="text"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Ex: Conta de luz de março"
            className={inputCls}
          />
        </div>

        {/* Parcelamento (apenas para despesas) */}
        {form.direction === "expense" && (
          <div className="space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isInstallment}
                onChange={(e) => set("isInstallment", e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Compra parcelada
              </span>
            </label>

            {form.isInstallment && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número de parcelas
                </label>
                <input
                  type="number"
                  min="2"
                  max="60"
                  value={form.installmentTotal}
                  onChange={(e) => set("installmentTotal", e.target.value)}
                  placeholder="Ex: 12"
                  required
                  className={inputCls}
                />
                <p className="text-xs text-gray-400 mt-1">
                  O valor será dividido igualmente entre as parcelas.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Botões */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
          >
            {transacaoEditando ? "Atualizar" : "Lançar"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default TransacaoFormModal;
