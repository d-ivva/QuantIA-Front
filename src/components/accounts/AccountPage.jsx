import { useState, useEffect } from "react";
import { Plus, RefreshCw, CreditCard } from "lucide-react";

import {
  getAccounts,
  createAccount,
  updateAccount,
  deleteAccount,
} from "../../services/AccountService";

import { useToast } from "../../hooks/useToast";

import AccountTable from "./AccountTable";
import AccountFormModal from "./AccountFormModal";
import AccountDeleteDialog from "./AccountDeleteDialog";

function AccountPage() {
  const [accounts, setAccounts] = useState([]);
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
      const data = await getAccounts();
      setAccounts(data);
    } catch (err) {
      toast.error("Erro ao carregar contas");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditing(null);
    setIsFormOpen(true);
  };

  const handleEdit = (a) => {
    setEditing(a);
    setIsFormOpen(true);
  };

  const getErrorMessage = (err) => {
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
    return err.message || "Erro ao salvar conta";
  };

  const handleSave = async (data) => {
    try {
      if (editing) {
        await updateAccount(editing.id, data);
        toast.success("Conta atualizada com sucesso");
      } else {
        await createAccount(data);
        toast.success("Conta criada com sucesso");
      }

      setIsFormOpen(false);
      setEditing(null);
      await loadData();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleDeleteConfirm = (a) => {
    setDeleting(a);
    setIsDeleteOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteAccount(deleting.id);
      toast.success("Conta excluída com sucesso");

      setDeleting(null);
      setIsDeleteOpen(false);
      await loadData();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  // Metricas simples para contas
  const totalAccounts = accounts.length;
  const accountsWithCreditCard = accounts.filter(a => a.hasCreditCard).length;

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-600" />
            <h1 className="text-2xl font-semibold text-gray-800">Contas</h1>
          </div>
          <p className="text-sm text-gray-500">
            Gerencie suas contas bancárias e carteiras
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
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Nova Conta
          </button>
        </div>
      </div>

      {/* RESUMO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-blue-700 font-medium">Total de Contas</p>
            <p className="text-2xl font-bold text-blue-800">{totalAccounts}</p>
          </div>
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-blue-600" />
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-purple-700 font-medium">Contas com Cartão</p>
            <p className="text-2xl font-bold text-purple-800">{accountsWithCreditCard}</p>
          </div>
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-purple-600" />
          </div>
        </div>
      </div>

      {/* TABELA */}
      <AccountTable
        accounts={accounts}
        search={search}
        onSearchChange={setSearch}
        onEdit={handleEdit}
        onDelete={handleDeleteConfirm}
      />

      {/* MODAIS */}
      <AccountFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        editing={editing}
        onSave={handleSave}
      />

      <AccountDeleteDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        account={deleting}
      />
    </div>
  );
}

export default AccountPage;
