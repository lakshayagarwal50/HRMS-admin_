import React from "react";

// Define an interface for the Modal's props
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string; // This will now typically be the 'Sign Up?' part
  question?: string; // New prop for the actual question
  onConfirm: () => void;
  confirmButtonText?: string;
  cancelButtonText?: string;
  showCancelButton?: boolean; // We'll keep this for flexibility, though default is now true
  type?: "warning" | "info" | "success" | "error"; // For different styling themes
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  message, // This will be the first line of the message
  question, // This will be the second line of the message
  onConfirm,
  confirmButtonText = "CONFIRM", // Default text to uppercase
  cancelButtonText = "CANCEL", // Default text to uppercase
  showCancelButton = true, // Default to true as per your request for two buttons
  type = "warning", // default type
}) => {
  if (!isOpen) {
    return null;
  }

  // Determine button colors based on type for consistency
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

  // Determine icon and header styling based on type
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
      // Changed opacity to bg-opacity-80 for a darker overlay
      className="fixed inset-0 flex items-center justify-center w-screen h-screen z-[99] bg-black/50    "
      onClick={onClose}
      //   style={{
      //     display: "flex",
      //     alignItems: "center",
      //     justifyContent: "center",
      //     position: "fixed",
      //     top: "0",
      //     width: "100vw",
      
      //     left: "0",
      //     zIndex: "99",
      //     backgroundColor: "rgba(0,0,0,0.5)",
      //   }}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-xs sm:max-w-sm md:max-w-md transform transition-all duration-300 scale-100 opacity-100 p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={headerClasses}>
          {/* Icon based on type */}
          {type === "warning" && (
            <span className={iconClasses}>&#9888;</span>
          )}{" "}
          {/* Warning icon */}
          {type === "info" && (
            <span className={iconClasses}>&#x2139;</span>
          )}{" "}
          {/* Info icon */}
          {type === "success" && (
            <span className={iconClasses}>&#10003;</span>
          )}{" "}
          {/* Checkmark icon */}
          {type === "error" && (
            <span className={iconClasses}>&#x2716;</span>
          )}{" "}
          {/* X mark icon */}
          <h2 className="text-xl font-bold flex-grow text-gray-800">{title}</h2>
          <button
            className="text-gray-400 hover:text-gray-600 text-3xl leading-none"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        {/* Message structure with two lines */}
        <div className="modal-body text-gray-700 mb-6 text-center">
          <p className="mb-1">{message}</p>{" "}
          {/* First line, with bottom margin */}
          {question && <p>{question}</p>}{" "}
          {/* Second line, only if question is provided */}
        </div>
        {/* Centered buttons, always two visible */}
        <div className="flex justify-center pt-4 border-t border-gray-200 gap-4">
          {/* Cancel button is always shown now, as per "just keep two buttons" */}
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
