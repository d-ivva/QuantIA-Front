import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

const sizes = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

const headerMap = {
  default: { head: "",           bar: "q-bar-default" },
  income:  { head: "q-mh-income",  bar: "q-bar-income"  },
  expense: { head: "q-mh-expense", bar: "q-bar-expense" },
  primary: { head: "q-mh-primary", bar: "q-bar-primary" },
};

function Modal({ isOpen, onClose, title, children, size = "md", variant = "default" }) {
  const modalRef = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
      document.body.style.overflow = "hidden";
      setTimeout(() => { modalRef.current?.focus(); }, 100);
    } else {
      document.body.style.overflow = "";
      setTimeout(() => setShow(false), 220);
    }
  }, [isOpen]);

  if (!isOpen && !show) return null;

  const { head, bar } = headerMap[variant] ?? headerMap.default;

  return (
    <div
      className="q-overlay"
      style={{ opacity: isOpen ? 1 : 0 }}
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-label={title}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        onClick={e => e.stopPropagation()}
        className={`q-modal w-full ${sizes[size]} mx-4`}
        style={{
          transform: isOpen ? "scale(1) translateY(0)" : "scale(0.95) translateY(8px)",
          opacity:   isOpen ? 1 : 0,
        }}
      >
        {/* Header */}
        <div className={`q-modal-head ${head}`}>
          <div className={`q-modal-bar ${bar}`} aria-hidden="true" />
          <h2 className="q-modal-title">{title}</h2>
          <button
            onClick={onClose}
            className="q-modal-close"
            aria-label="Fechar"
          >
            <X size={13} />
          </button>
        </div>

        {/* Body */}
        <div className="q-modal-body">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
