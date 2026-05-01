import { useState, useEffect } from "react";
import { Plus, RefreshCw, Tags } from "lucide-react";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/CategoryService";

import { useToast } from "../../hooks/useToast";

import CategoryTable from "./CategoryTable";
import CategoryFormModal from "./CategoryFormModal";
import CategoryDeleteDialog from "./CategoryDeleteDialog";

function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  
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
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      toast.error("Erro ao carregar as categorias");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditing(null);
    setIsFormOpen(true);
  };

  const handleEdit = (category) => {
    setEditing(category);
    setIsFormOpen(true);
  };

  const getErrorMessage = (err) => {
    if (err.response?.data) {
      if (typeof err.response.data === "string") {
        return err.response.data;
      }
      // Mantendo 'mensagem' pois seu backend em C# ainda retorna as exceções com essa propriedade
      if (err.response.data.mensagem) { 
        return err.response.data.mensagem;
      }
      if (err.response.data.message) {
        return err.response.data.message;
      }
      if (err.response.data.errors) {
        return Object.values(err.response.data.errors).flat().join(" | ");
      }
    }
    return err.message || "Erro ao salvar categoria";
  };

  const handleSave = async (data) => {
    try {
      if (editing) {
        await updateCategory(editing.id, data);
        toast.success("Categoria atualizada com sucesso");
      } else {
        await createCategory(data);
        toast.success("Categoria criada com sucesso");
      }

      setIsFormOpen(false);
      setEditing(null);
      await loadData();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleDeleteConfirm = (category) => {
    setDeleting(category);
    setIsDeleteOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteCategory(deleting.id);
      toast.success("Categoria deletada com sucesso");

      setDeleting(null);
      setIsDeleteOpen(false);
      await loadData();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2">
            <Tags className="w-5 h-5 text-blue-600" />
            <h1 className="text-2xl font-semibold text-gray-800">Categorias</h1>
          </div>
          <p className="text-sm text-gray-500">
            Gerencie suas categorias
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
            Nova Categoria
          </button>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 shadow-sm">
          <p className="text-xs text-blue-700">Total de Categorias</p>
          <p className="text-xl font-bold text-blue-700">
            {categories.length}
          </p>
        </div>
      </div>

      {/* TABLE */}
      <CategoryTable
        categories={categories}
        search={search}
        onSearchChange={setSearch}
        onEdit={handleEdit}
        onDelete={handleDeleteConfirm}
      />

      {/* MODALS */}
      <CategoryFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        editing={editing}
        onSave={handleSave}
      />

      <CategoryDeleteDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        category={deleting}
      />
    </div>
  );
}

export default CategoriesPage;