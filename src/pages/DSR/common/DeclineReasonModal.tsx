// src/components/common/DeclineReasonModal.tsx (or a path of your choice)

import React, { useState } from "react";

interface DeclineReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}

const DeclineReasonModal: React.FC<DeclineReasonModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    if (reason.trim()) {
      onSubmit(reason);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Reason for Decline
        </h3>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full h-24 border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Please enter Reason *"
        />
        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-800 font-semibold rounded-md hover:bg-gray-100 transition-colors"
          >
            CANCEL
          </button>
          <button
            onClick={handleSubmit}
            disabled={!reason.trim()}
            className="px-6 py-2 bg-[#741CDD] text-white font-semibold rounded-md hover:bg-purple-700 shadow-md transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            SUBMIT
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeclineReasonModal;
