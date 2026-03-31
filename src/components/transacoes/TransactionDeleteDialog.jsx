import ConfirmDialog from '../ui/ConfirmDialog';

function TransacaoDeleteDialog({ isOpen, onClose, onConfirm, transacao }) {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Remover Transação"
      message={
        transacao
          ? `Tem certeza que deseja remover esta transação de R$ ${transacao.amount?.toFixed(2).replace('.', ',')}? Esta ação não pode ser desfeita.`
          : ''
      }
    />
  );
}

export default TransacaoDeleteDialog;