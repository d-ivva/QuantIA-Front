import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const typeMap = {
  success: { cls: 'q-toast-success', Icon: CheckCircle },
  error:   { cls: 'q-toast-error',   Icon: XCircle     },
  info:    { cls: 'q-toast-info',    Icon: Info        },
};

function Toast({ type, message, onClose }) {
  const { cls, Icon } = typeMap[type] ?? typeMap.info;

  return (
    <div className={`q-toast ${cls}`} role="alert" aria-live="polite">
      <Icon className="q-toast-icon" aria-hidden="true" />
      <span className="q-toast-msg">{message}</span>
      <button onClick={onClose} className="q-toast-x" aria-label="Fechar notificação">
        <X size={13} />
      </button>
    </div>
  );
}

export default Toast;
