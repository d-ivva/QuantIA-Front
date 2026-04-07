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

function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [transactionTypes, setTransactionTypes] = useState([]);

  const [search, setSearch] = useState("");
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
      toast.error("Erro ao carregar dados");
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

  const { income, expense, balance } = useMemo(() => {
    const income = transactions
      .filter((t) => t.direction === "income")
      .reduce((s, t) => s + t.amount, 0);

    const expense = transactions
      .filter((t) => t.direction === "expense")
      .reduce((s, t) => s + t.amount, 0);

    return {
      income,
      expense,
      balance: income - expense,
    };
  }, [transactions]);

  const handleCreate = () => {
    setEditing(null);
    setIsFormOpen(true);
  };

  const handleEdit = (t) => {
    setEditing(t);
    setIsFormOpen(true);
  };

  const handleSave = async (data) => {
    try {
      if (editing) {
        await updateTransaction(editing.id, data);
        toast.success("Transação atualizada");
      } else {
        await createTransaction(data);
        toast.success("Transação criada");
      }

      setIsFormOpen(false);
      setEditing(null);
      await loadData();
    } catch (err) {
      toast.error("Erro ao salvar transação");
      console.error(err);
    }
  };

  const handleDeleteConfirm = (t) => {
    setDeleting(t);
    setIsDeleteOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteTransaction(deleting.id);
      toast.success("Transação excluída");

      setDeleting(null);
      setIsDeleteOpen(false);
      await loadData();
    } catch (err) {
      toast.error("Erro ao excluir transação");
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <ArrowLeftRight className="w-5 h-5 text-emerald-600" />
          <h1 className="text-xl font-bold">Transações</h1>
        </div>

        <div className="flex gap-2">
          <button
            onClick={loadData}
            title="Atualizar dados"
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <RefreshCw className={loading ? "animate-spin" : ""} />
          </button>

          <button onClick={handleCreate} className="btn-primary flex items-center gap-1">
            <Plus className="w-4 h-4" /> Nova
          </button>
        </div>
      </div>

      {/* RESUMO */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <p className="text-xs text-emerald-700">Receitas</p>
          <p className="text-lg font-bold text-emerald-700">
            {formatCurrency(income)}
          </p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-xs text-red-700">Despesas</p>
          <p className="text-lg font-bold text-red-700">
            {formatCurrency(expense)}
          </p>
        </div>

        <div className="bg-gray-100 border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-700">Saldo</p>
          <p
            className={`text-lg font-bold ${
              balance >= 0 ? "text-emerald-700" : "text-red-700"
            }`}
          >
            {formatCurrency(balance)}
          </p>
        </div>
      </div>

      {/* TABELA */}
      <TransactionTable
        transactions={transactions}
        search={search}
        onSearchChange={setSearch}
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