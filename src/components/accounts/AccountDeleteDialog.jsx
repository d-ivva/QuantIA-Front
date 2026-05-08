import { AlertTriangle } from "lucide-react";
import ConfirmDialog from "../ui/ConfirmDialog";

function AccountDeleteDialog({ isOpen, onClose, onConfirm, account }) {
  if (!account) return null;

  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Excluir Conta"
      confirmText="Sim, excluir"
      cancelText="Cancelar"
      variant="danger"
    >
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
          <AlertTriangle className="w-6 h-6 text-red-600" />
        </div>

        <div>
          <p className="text-gray-600">
            Tem certeza que deseja excluir a conta{" "}
            <strong className="text-gray-900">{account.name}</strong>?
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Esta ação não pode ser desfeita. Contas que possuem transações não
            podem ser excluídas e retornarão erro.
          </p>
        </div>
      </div>
    </ConfirmDialog>
  );
}

export default AccountDeleteDialog;
