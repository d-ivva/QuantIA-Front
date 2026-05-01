import Modal from "../ui/Modal";

function CategoryDeleteDialog({ isOpen, onClose, onConfirm, category }) {
  if (!category) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Category"
    >
      <div className="space-y-5">
        <p className="text-gray-600 text-sm">
          Are you sure you want to delete the category{" "}
          <strong className="text-gray-900">{category.name}</strong>?
        </p>
        
        <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-100">
          Warning: Deletion will be blocked if there are transactions linked to this category.
        </p>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 hover:bg-gray-200 py-2.5 rounded-lg transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg font-semibold transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default CategoryDeleteDialog;