import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

const sizes = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

const variants = {
  default: "bg-gray-800",
  income: "bg-emerald-600",
  expense: "bg-red-500",
};

function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  variant = "default",
}) {
  const modalRef = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
      document.body.style.overflow = "hidden";

      setTimeout(() => {
        modalRef.current?.focus();
      }, 100);
    } else {
      document.body.style.overflow = "";
      setTimeout(() => setShow(false), 200);
    }
  }, [isOpen]);

  if (!isOpen && !show) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center 
      bg-black/40 backdrop-blur-sm transition-opacity duration-200
      ${isOpen ? "opacity-100" : "opacity-0"}`}
      onClick={onClose}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className={`bg-white w-full ${sizes[size]} mx-4 rounded-2xl shadow-2xl 
        transform transition-all duration-200
        ${isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"}
        max-h-[90vh] flex flex-col`}
      >
        {/* HEADER DINÂMICO */}
        <div
          className={`flex items-center justify-between px-6 py-4 
          text-white rounded-t-2xl ${variants[variant]}`}
        >
          <h2 className="text-lg font-semibold">{title}</h2>

          <button
            onClick={onClose}
            className="hover:bg-white/20 rounded-lg p-1 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

export default Modal;