import React from "react";


interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string; 
  question?: string; 
  onConfirm: () => void;
  confirmButtonText?: string;
  cancelButtonText?: string;
  showCancelButton?: boolean; 
  type?: "warning" | "info" | "success" | "error";
  children?: React.ReactNode; 
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  message, 
  question, 
  onConfirm,
  confirmButtonText = "CONFIRM", 
  cancelButtonText = "CANCEL", 
  showCancelButton = true,

  type = "warning",
  children, 
}) => {
 

  if (!isOpen) {
    return null;
  }

  const confirmButtonClasses = `
    px-6 py-2 rounded-md font-semibold text-white
    transition duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-75
    bg-[#741CDD] hover:bg-[#5e12af] focus:ring-[#741CDD]
  `;

  const cancelButtonClasses = `
    px-6 py-2 rounded-md font-semibold text-gray-700
    bg-gray-200 hover:bg-gray-300
    transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75
  `;

  const headerClasses = `flex items-center justify-between pb-4 mb-4 ${
    type === "warning"
      ? "text-orange-500"
      : type === "info"
      ? "text-blue-500"
      : type === "success"
      ? "text-green-500"
      : type === "error"
      ? "text-red-500"
      : ""
  }`;

  const iconClasses = `text-4xl mr-3 ${
    type === "warning"
      ? "text-orange-400"
      : type === "info"
      ? "text-blue-400"
      : type === "success"
      ? "text-green-400"
      : type === "error"
      ? "text-red-400"
      : ""
  }`;
  return (
    <div
      
      className="fixed inset-0 flex items-center justify-center w-screen h-screen z-[99] bg-black/50    "
      onClick={onClose}
      
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-xs sm:max-w-sm md:max-w-md transform transition-all duration-300 scale-100 opacity-100 p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={headerClasses}>
          
          {type === "warning" && (
            <span className={iconClasses}>&#9888;</span>
          )}{" "}
          
          {type === "info" && (
            <span className={iconClasses}>&#x2139;</span>
          )}{" "}
          
          {type === "success" && (
            <span className={iconClasses}>&#10003;</span>
          )}{" "}
          
          {type === "error" && (
            <span className={iconClasses}>&#x2716;</span>
          )}{" "}
          
          <h2 className="text-xl font-bold flex-grow text-gray-800">{title}</h2>
          <button
            className="text-gray-400 hover:text-gray-600 text-3xl leading-none"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        
        <div className="modal-body text-gray-700 mb-6 text-center">
          <p className="mb-1">{message}</p>{" "}
         
          {question && <p>{question}</p>}{" "}
          
        </div>
        
        <div className="flex justify-center pt-4 border-t border-gray-200 gap-4">
          <button className={cancelButtonClasses} onClick={onClose}>
            {cancelButtonText}
          </button>
          <button className={confirmButtonClasses} onClick={onConfirm}>
            {confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
