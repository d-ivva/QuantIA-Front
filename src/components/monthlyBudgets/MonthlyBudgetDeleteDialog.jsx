import ConfirmDialog from "../ui/ConfirmDialog";

const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

function MonthlyBudgetDeleteDialog({ isOpen, onClose, onConfirm, budget }) {
  if (!budget) return null;

  const monthName = MONTHS[budget.month - 1];

  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Excluir Limite de Gastos"
      message={`Tem certeza que deseja excluir o limite de gastos de ${monthName}/${budget.year}?\n\nEsta ação não pode ser desfeita.`}
    />
  );
}

export default MonthlyBudgetDeleteDialog;
