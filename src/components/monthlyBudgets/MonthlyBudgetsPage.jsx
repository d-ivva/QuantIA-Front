import { useState, useEffect } from "react";
import { Plus, RefreshCw, Target, TrendingUp } from "lucide-react";

import {
  getMonthlyBudgets,
  createMonthlyBudget,
  updateMonthlyBudget,
  deleteMonthlyBudget,
} from "../../services/MonthlyBudgetService";

import { useToast } from "../../hooks/useToast";

import MonthlyBudgetTable from "./MonthlyBudgetTable";
import MonthlyBudgetFormModal from "./MonthlyBudgetFormModal";
import MonthlyBudgetDeleteDialog from "./MonthlyBudgetDeleteDialog";
import MonthlyBudgetReport from "./MonthlyBudgetReport";

const formatCurrency = (value) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

function MonthlyBudgetsPage() {
  const [budgets, setBudgets] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [reportKey, setReportKey] = useState(0);

  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const toast = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getMonthlyBudgets();
      setBudgets(data);
    } catch (err) {
      toast.error("Erro ao carregar limites de gastos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditing(null);
    setIsFormOpen(true);
  };

  const handleEdit = (b) => {
    setEditing(b);
    setIsFormOpen(true);
  };

  const getErrorMessage = (err) => {
    if (err.response?.data) {
      if (typeof err.response.data === 'string') return err.response.data;
      if (err.response.data.message) return err.response.data.message;
      if (err.response.data.title) return err.response.data.title;
      if (err.response.data.errors)
        return Object.values(err.response.data.errors).flat().join(' | ');
    }
    return err.message || 'Erro ao salvar limite de gastos';
  };

  const handleSave = async (data) => {
    try {
      if (editing) {
        await updateMonthlyBudget(editing.id, data);
        toast.success("Limite de gastos atualizado com sucesso");
      } else {
        await createMonthlyBudget(data);
        toast.success("Limite de gastos criado com sucesso");
      }
      setIsFormOpen(false);
      setEditing(null);
      await loadData();
      setReportKey((k) => k + 1);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleDeleteConfirm = (b) => {
    setDeleting(b);
    setIsDeleteOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteMonthlyBudget(deleting.id);
      toast.success("Limite de gastos excluído com sucesso");
      setDeleting(null);
      setIsDeleteOpen(false);
      await loadData();
      setReportKey((k) => k + 1);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const currentBudget = budgets.find(
    (b) => b.month === currentMonth && b.year === currentYear
  );
  const totalBudgets = budgets.length;

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-600" />
            <h1 className="text-2xl font-semibold text-gray-800">
              Limite de Gastos Mensais
            </h1>
          </div>
          <p className="text-sm text-gray-500">
            Defina o teto máximo de gastos para cada mês
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={loadData}
            disabled={loading}
            className="p-2 rounded-lg border hover:bg-gray-100 disabled:opacity-50 transition-colors"
            title="Atualizar"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Novo Limite
          </button>
        </div>
      </div>

      {/* RESUMO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-emerald-700 font-medium">
              Limites Cadastrados
            </p>
            <p className="text-2xl font-bold text-emerald-800">
              {totalBudgets}
            </p>
          </div>
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
            <Target className="w-5 h-5 text-emerald-600" />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-blue-700 font-medium">
              Limite de Gastos Deste Mês
            </p>
            <p className="text-2xl font-bold text-blue-800">
              {currentBudget
                ? formatCurrency(currentBudget.amount)
                : "Não definida"}
            </p>
          </div>
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
        </div>
      </div>

      {/* RELATÓRIO */}
      <MonthlyBudgetReport refreshKey={reportKey} />

      {/* TABELA */}
      <MonthlyBudgetTable
        budgets={budgets}
        search={search}
        onSearchChange={setSearch}
        onEdit={handleEdit}
        onDelete={handleDeleteConfirm}
      />

      {/* MODAIS */}
      <MonthlyBudgetFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        editing={editing}
        onSave={handleSave}
      />

      <MonthlyBudgetDeleteDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        budget={deleting}
      />
    </div>
  );
}

export default MonthlyBudgetsPage;
