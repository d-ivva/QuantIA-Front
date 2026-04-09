import Modal from "./Modal";
import { AlertTriangle } from "lucide-react";

function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex flex-col items-center text-center gap-4">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
          <AlertTriangle className="w-6 h-6 text-red-600" />
        </div>

        {/* Mensagem */}
        <p className="text-gray-600 text-sm whitespace-pre-line">
          {message}
        </p>

        {/* Botões */}
        <div className="flex gap-3 w-full pt-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
          >
            Cancelar
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition"
          >
            Confirmar
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmDialog;