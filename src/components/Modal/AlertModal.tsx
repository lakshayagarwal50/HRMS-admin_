import React, { useEffect, type ReactNode } from 'react';

// Define the props for the generic alert modal
interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: ReactNode; // For the message content
  confirmText?: string;
  cancelText?: string;
  icon?: ReactNode;
}

const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
  confirmText = 'SURE',
  cancelText = 'CANCEL',
  icon,
}) => {
  // Effect to handle the 'Escape' key press to close the modal
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    // Main modal container with a fixed position and a semi-transparent overlay
    <div
      className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      {/* Modal content container */}
      <div
        className="bg-white rounded-lg shadow-2xl w-full max-w-sm p-8 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Render the icon if provided */}
        {icon && (
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full border-4 border-red-500 mb-4">
            {icon}
          </div>
        )}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <div className="text-sm text-gray-600 mb-8">
          {children}
        </div>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onClose}
            className="px-8 py-2 border border-gray-300 text-gray-800 font-semibold rounded-md hover:bg-gray-100 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-8 py-2 bg-[#8A2BE2] text-white font-semibold rounded-md hover:bg-[#7a1fb8] shadow-md transition-all"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
