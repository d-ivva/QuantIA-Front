import { useState, useEffect } from "react";
import Modal from "../ui/Modal";

const INITIAL_STATE = {
  name: "",
  color: "#3B82F6", // Default blue
};

function CategoryFormModal({ isOpen, onClose, editing, onSave }) {
  const [form, setForm] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (editing) {
        setForm({
          name: editing.name,
          color: editing.color,
        });
      } else {
        setForm(INITIAL_STATE);
      }
      setErrors({});
    }
  }, [isOpen, editing]);

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Category name is required";
    if (!form.color) newErrors.color = "Color is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      name: form.name,
      color: form.color,
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
      title={editing ? "Edit Category" : "New Category"}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* NAME */}
        <div>
          <label className="text-sm font-medium mb-1 block">Name</label>
          <input
            type="text"
            placeholder="Ex: Food"
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
            className={getInputClass("name")}
          />
          {errors.name && (
            <p className="text-xs text-red-500 mt-1">{errors.name}</p>
          )}
        </div>

        {/* COLOR */}
        <div>
          <label className="text-sm font-medium mb-1 block">Color</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={form.color}
              onChange={(e) => setField("color", e.target.value)}
              className="h-10 w-14 cursor-pointer rounded border border-gray-300 bg-white p-0.5"
            />
            <span className="text-sm text-gray-600 font-mono uppercase">
              {form.color}
            </span>
          </div>
          {errors.color && (
            <p className="text-xs text-red-500 mt-1">{errors.color}</p>
          )}
        </div>

        {/* BUTTONS */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-100 hover:bg-gray-200 py-2.5 rounded-lg transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold transition-colors"
          >
            Save
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default CategoryFormModal;