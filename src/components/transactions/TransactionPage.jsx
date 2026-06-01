import { useState, useEffect, useMemo } from "react";
import { Plus, RefreshCw, ArrowLeftRight } from "lucide-react";

import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getAccounts,
  getCategories,
  getTransactionTypes,
} from "../../services/TransactionService";

import { useToast } from "../../hooks/useToast";

import TransactionTable from "./TransactionTable";
import TransactionFormModal from "./TransactionFormModal";
import TransactionDeleteDialog from "./TransactionDeleteDialog";

const fmtDate = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;

const getCurrentMonthRange = () => {
  const now = new Date();
  const first = new Date(now.getFullYear(), now.getMonth(), 1);
  const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return { start: fmtDate(first), end: fmtDate(last) };
};

function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [transactionTypes, setTransactionTypes] = useState([]);

  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState(getCurrentMonthRange);
  const [loading, setLoading] = useState(true);

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

      const [t, a, c, tt] = await Promise.all([
        getTransactions(),
        getAccounts(),
        getCategories(),
        getTransactionTypes(),
      ]);

      setTransactions(t);
      setAccounts(a);
      setCategories(c);
      setTransactionTypes(tt);
    } catch (err) {
      toast.error(getErrorMessage(err, "Erro ao carregar dados"));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  const dateFiltered = useMemo(() => {
    return transactions.filter((t) => {
      const d = (t.transactionDate || "").slice(0, 10);
      if (dateRange.start && d < dateRange.start) return false;
      if (dateRange.end && d > dateRange.end) return false;
      return true;
    });
  }, [transactions, dateRange]);

  const { income, expense, balance } = useMemo(() => {
    const income = dateFiltered
      .filter((t) => t.direction === "income")
      .reduce((s, t) => s + t.amount, 0);

    const expense = dateFiltered
      .filter((t) => t.direction === "expense")
      .reduce((s, t) => s + t.amount, 0);

    return {
      income,
      expense,
      balance: income - expense,
    };
  }, [dateFiltered]);

  const handleCreate = () => {
    setEditing(null);
    setIsFormOpen(true);
  };

  const handleEdit = (t) => {
    setEditing(t);
    setIsFormOpen(true);
  };

  const getErrorMessage = (err, fallback = "Erro inesperado") => {
    if (err.response?.data) {
      if (typeof err.response.data === "string") {
        return err.response.data;
      }

      if (err.response.data.message) {
        return err.response.data.message;
      }

      if (err.response.data.title) {
        return err.response.data.title;
      }

      if (err.response.data.errors) {
        return Object.values(err.response.data.errors).flat().join(" | ");
      }
    }

    return err.message || fallback;
  };

  const handleSave = async (data) => {
    try {
      let result;
      if (editing) {
        result = await updateTransaction(editing.id, data);
      } else {
        result = await createTransaction(data);
      }

      toast.success(result?.message || "Operação realizada com sucesso");
      setIsFormOpen(false);
      setEditing(null);
      await loadData();
    } catch (err) {
      toast.error(getErrorMessage(err, "Erro ao salvar transação"));
    }
  };

  const handleDeleteConfirm = (t) => {
    setDeleting(t);
    setIsDeleteOpen(true);
  };

  const handleDelete = async () => {
    try {
      const result = await deleteTransaction(deleting.id);
      toast.success(result?.message || "Transação excluída com sucesso");

      setDeleting(null);
      setIsDeleteOpen(false);
      await loadData();
    } catch (err) {
      toast.error(getErrorMessage(err, "Erro ao excluir transação"));
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5 text-emerald-600" />
            <h1 className="text-2xl font-semibold text-gray-800">Transações</h1>
          </div>
          <p className="text-sm text-gray-500">
            Gerencie suas receitas e despesas
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={loadData}
            disabled={loading}
            className="p-2 rounded-lg border hover:bg-gray-100 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Nova Transação
          </button>
        </div>
      </div>

      {/* RESUMO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 shadow-sm">
          <p className="text-xs text-emerald-700">Receitas</p>
          <p className="text-xl font-bold text-emerald-700">
            {formatCurrency(income)}
          </p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-sm">
          <p className="text-xs text-red-700">Despesas</p>
          <p className="text-xl font-bold text-red-700">
            {formatCurrency(expense)}
          </p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm">
          <p className="text-xs text-gray-700">Saldo</p>
          <p
            className={`text-xl font-bold ${balance >= 0 ? "text-emerald-700" : "text-red-700"
              }`}
          >
            {formatCurrency(balance)}
          </p>
        </div>
      </div>

      {/* TABELA */}
      <TransactionTable
        transactions={dateFiltered}
        search={search}
        onSearchChange={setSearch}
        dateRange={dateRange}
        onDateRangeChange={(field, value) =>
          setDateRange((r) => ({ ...r, [field]: value }))
        }
        onResetDates={() => setDateRange(getCurrentMonthRange())}
        onEdit={handleEdit}
        onDelete={handleDeleteConfirm}
      />

      {/* MODAIS */}
      <TransactionFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        editing={editing}
        onSave={handleSave}
        accounts={accounts}
        categories={categories}
        transactionTypes={transactionTypes}
      />

      <TransactionDeleteDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        transaction={deleting}
      />
    </div>
  );
}

export default TransactionsPage;
