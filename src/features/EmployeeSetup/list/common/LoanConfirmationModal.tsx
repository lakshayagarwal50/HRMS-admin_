// src/components/common/LoanConfirmationModal.tsx

import React, { useRef } from "react";
import type { LoanDetails } from "../../../../store/slice/loanSlice";
import GenericForm, {
  type FormField,
} from "../../../../components/common/GenericForm";

interface LoanConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  loan: LoanDetails;
  formFields: FormField[];
  initialState: Record<string, any>;
  onConfirm: (data: Record<string, any>) => void;
  onCancel: () => void;
  confirmButtonText: string;
  cancelButtonText: string;
}

const LoanConfirmationModal: React.FC<LoanConfirmationModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  loan,
  formFields,
  initialState,
  onConfirm,
  onCancel,
  confirmButtonText,
  cancelButtonText,
}) => {
  const formRef = useRef<{ handleSubmit: () => void }>(null);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-40 bg-black/50"
      onClick={onClose} 
    >
      <div
        className="fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out translate-x-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white h-full flex flex-col">
          {/* Modal Header */}
          <div className="relative flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-slate-800">{title}</h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>

          
          <div className="flex-grow overflow-y-auto p-6">
            <div className="bg-[#E7E9F4] p-4 rounded-md text-gray-800">
              {message}
            </div>

            <div className="mt-4 border-b border-gray-200 py-4 flex justify-between items-center text-sm font-semibold">
              <span>Amount Requested:</span>
              <span>₹ {loan.amountReq}</span>
            </div>

            {/* This GenericForm will handle the specific fields for Approve or Decline */}
            <GenericForm
              ref={formRef} 
              title=""
              fields={formFields}
              initialState={initialState}
              onSubmit={onConfirm}
            />
          </div>

          {/* Modal Footer with Actions */}
          <div className="flex items-center justify-end gap-4 p-6 border-t border-gray-200">
            <button
              onClick={onCancel}
              className="py-2.5 px-6 font-semibold bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              {cancelButtonText}
            </button>
            <button
              onClick={() => formRef.current?.handleSubmit()} // This button now triggers the form submission
              className="py-2.5 px-6 font-semibold text-white bg-[#741CDD] rounded-md hover:bg-[#5f3dbb] transition-colors"
            >
              {confirmButtonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanConfirmationModal;
