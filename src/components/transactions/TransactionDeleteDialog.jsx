import ConfirmDialog from "../ui/ConfirmDialog";

function TransactionDeleteDialog({ isOpen, onClose, onConfirm, transaction }) {
  const formatCurrency = (value) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value || 0);

  const getMessage = () => {
    if (!transaction) return "";

    if (transaction.installmentGroupId) {
      return `Esta transação faz parte de um parcelamento.

        Ao remover, TODAS as parcelas vinculadas serão excluídas.

        Valor da parcela: ${formatCurrency(transaction.amount)}

        Deseja continuar?`;
    }

    return `Tem certeza que deseja remover esta transação de ${formatCurrency(
      transaction.amount,
    )}?

    Esta ação não pode ser desfeita.`;
  };

  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Remover Transação"
      message={getMessage()}
    />
  );
}

export default TransactionDeleteDialog;
