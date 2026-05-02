import { useState, useEffect } from "react";
import { Plus, RefreshCw, Settings2 } from "lucide-react";

import {
  getTransactionTypes,
  createTransactionType,
  updateTransactionType,
  deleteTransactionType,
} from "../../services/TransactionTypeService";

import { useToast } from "../../hooks/useToast";

import TransactionTypeTable from "./TransactionTypeTable";
import TransactionTypeFormModal from "./TransactionTypeFormModal";
import TransactionTypeDeleteDialog from "./TransactionTypeDeleteDialog";

function TransactionTypePage() {
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
      const data = await getTransactionTypes();
      setTransactionTypes(data);
    } catch (err) {
      toast.error("Erro ao carregar tipos de transação");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditing(null);
    setIsFormOpen(true);
  };

  const handleEdit = (t) => {
    setEditing(t);
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
    return err.message || "Erro ao salvar tipo de transação";
  };

  const handleSave = async (data) => {
    try {
      if (editing) {
        await updateTransactionType(editing.id, data);
        toast.success("Tipo de transação atualizado com sucesso");
      } else {
        await createTransactionType(data);
        toast.success("Tipo de transação criado com sucesso");
      }

      setIsFormOpen(false);
      setEditing(null);
      await loadData();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleDeleteConfirm = (t) => {
    setDeleting(t);
    setIsDeleteOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteTransactionType(deleting.id);
      toast.success("Tipo de transação excluído com sucesso");

      setDeleting(null);
      setIsDeleteOpen(false);
      await loadData();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  // Metricas simples
  const totalTypes = transactionTypes.length;
  const inTypes = transactionTypes.filter(t => t.direction === "IN").length;
  const outTypes = transactionTypes.filter(t => t.direction === "OUT").length;

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-indigo-600" />
            <h1 className="text-2xl font-semibold text-gray-800">Tipos de Transação</h1>
          </div>
          <p className="text-sm text-gray-500">
            Gerencie os tipos (naturezas) de transação do sistema
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
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Novo Tipo
          </button>
        </div>
      </div>

      {/* RESUMO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-indigo-700 font-medium">Total de Tipos</p>
            <p className="text-2xl font-bold text-indigo-800">{totalTypes}</p>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-green-700 font-medium">Tipos de Entrada</p>
            <p className="text-2xl font-bold text-green-800">{inTypes}</p>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-red-700 font-medium">Tipos de Saída</p>
            <p className="text-2xl font-bold text-red-800">{outTypes}</p>
          </div>
        </div>
      </div>

      {/* TABELA */}
      <TransactionTypeTable
        transactionTypes={transactionTypes}
        search={search}
        onSearchChange={setSearch}
        onEdit={handleEdit}
        onDelete={handleDeleteConfirm}
      />

      {/* MODAIS */}
      <TransactionTypeFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        editing={editing}
        onSave={handleSave}
      />

      <TransactionTypeDeleteDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        transactionType={deleting}
      />
    </div>
  );
}

export default TransactionTypePage;
