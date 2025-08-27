import React, { useState } from "react";
import { X } from "lucide-react";

// Props for the modal component
interface AddNewLeaveTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (leaveType: string) => void;
}

// Mock data for the leave balance display
const leaveData = {
  planned: {
    name: "Planned leave",
    allowed: 5.0,
    taken: 1,
    unpaid: 0.0,
    balance: 4.0,
  },
  casual: {
    name: "Casual leave",
    allowed: 1.0,
    taken: 0,
    unpaid: 0.0,
    balance: 1.0,
  },
};

// A small helper component to render the leave balance details
const LeaveBalanceCard: React.FC<{ data: typeof leaveData.planned }> = ({
  data,
}) => (
  <div className="border border-gray-200 rounded-lg p-4 shadow-sm">
    <h3 className="font-semibold text-gray-800 mb-4">{data.name}</h3>
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-gray-500">Allowed Leave</span>
        <span className="font-medium text-gray-800">
          {data.allowed.toFixed(2)}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-500">Leave Taken</span>
        <span className="font-medium text-gray-800">{data.taken}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-500">Unpaid Leave</span>
        <span className="font-medium text-gray-800">
          {data.unpaid.toFixed(2)}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-500">Balance</span>
        <span className="font-medium text-gray-800">
          {data.balance.toFixed(2)}
        </span>
      </div>
    </div>
  </div>
);

const AddNewLeaveTypeModal: React.FC<AddNewLeaveTypeModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [selectedLeaveType, setSelectedLeaveType] = useState("");

  const handleSubmit = () => {
    if (selectedLeaveType) {
      onSubmit(selectedLeaveType);
    } else {
      alert("Please select a leave type.");
    }
  };

  if (!isOpen) {
    return null;
  }

  // Reusable input styling (from AddLoanModal)
  const commonInputClasses =
    "block w-full border-0 border-b-2 border-gray-200 bg-transparent py-2 px-1 text-lg text-gray-900 placeholder:text-gray-400 placeholder:text-base focus:border-[#741CDD] focus:outline-none focus:ring-0 transition-colors duration-300";

  return (
    <div className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300">
      <div className="fixed top-0 right-0 h-full w-full max-w-2xl transform bg-white shadow-xl transition-transform duration-300 ease-in-out">
        <div className="flex h-full flex-col">
          {/* Header */}
          <header className="relative flex justify-center items-center p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-800">
              Add New Leave Type
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="absolute right-6 rounded-md p-1 text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </header>

          {/* Form Body */}
          <div className="flex-grow space-y-8 overflow-y-auto p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <LeaveBalanceCard data={leaveData.planned} />
              <LeaveBalanceCard data={leaveData.casual} />
            </div>

            <div>
              <label
                htmlFor="leaveType"
                className="block text-sm font-medium text-gray-700"
              >
                Leave Type
              </label>
              <select
  id="leaveType"
  value={selectedLeaveType}
  onChange={(e) => setSelectedLeaveType(e.target.value)}
  className="block w-full border-0 border-b-2 border-gray-200 bg-transparent py-1.5 px-1 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#741CDD] focus:outline-none focus:ring-0 transition-colors duration-300"
>
  <option value="">Please Select</option>
  <option value="Sick Leave">Sick Leave</option>
  <option value="Vacation">Vacation</option>
  <option value="Personal Leave">Personal Leave</option>
</select>
            </div>
          </div>

          {/* Footer */}
          <footer className="flex flex-shrink-0 items-center justify-center gap-4 border-t border-slate-200 p-6">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-8 font-semibold bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="py-2.5 px-8 font-semibold text-white bg-[#741CDD] rounded-md hover:bg-[#5f3dbb] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#741CDD] transition-colors shadow-sm"
            >
              Submit
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default AddNewLeaveTypeModal;
