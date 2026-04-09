import { useEffect, useRef } from "react";
import { X } from "lucide-react";

const sizes = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  closeOnOverlay = true, // 🔥 controle importante
}) {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";

      // 🔥 foco no modal (UX + acessibilidade)
      setTimeout(() => {
        modalRef.current?.focus();
      }, 0);
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity"
      onClick={closeOnOverlay ? onClose : undefined}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className={`bg-white rounded-2xl shadow-2xl w-full ${sizes[size]} mx-4 
        transform transition-all duration-200 scale-100 opacity-100
        max-h-[90vh] flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-1 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY COM SCROLL */}
        <div className="px-6 py-4 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;