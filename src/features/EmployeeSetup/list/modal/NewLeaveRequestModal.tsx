import React, { useState } from "react";
import { X, Calendar } from "lucide-react";

// Define the shape of the form data
interface LeaveRequestState {
  leaveType: string;
  startDate: string;
  endDate: string;
  isHalfDay: boolean;
  reason: string;
}

// Props for the modal component
interface NewLeaveRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: LeaveRequestState) => void;
}

// Mock data for the leave balance display
const leaveData = {
  casual: {
    name: "Casual Leaves",
    allowed: 5.0,
    taken: 1,
    unpaid: 0.0,
    balance: 4.0,
  },
  sick: {
    name: "Sick Leaves",
    allowed: 1.0,
    taken: 0,
    unpaid: 0.0,
    balance: 1.0,
  },
};

// A small helper component to render the leave balance details
const LeaveBalanceCard: React.FC<{ data: typeof leaveData.casual }> = ({
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

const NewLeaveRequestModal: React.FC<NewLeaveRequestModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<LeaveRequestState>({
    leaveType: "",
    startDate: "",
    endDate: "",
    isHalfDay: false,
    reason: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = () => {
    setFormData((prev) => ({ ...prev, isHalfDay: !prev.isHalfDay }));
  };

  const handleSubmit = () => {
    if (
      !formData.leaveType ||
      !formData.startDate ||
      !formData.endDate ||
      !formData.reason
    ) {
      alert("Please fill out all required fields.");
      return;
    }
    onSubmit(formData);
  };

  if (!isOpen) return null;

  // Shared input styles
  const commonInputClasses =
    "block w-full border-0 border-b-2 border-gray-200 bg-transparent py-1.5 px-1 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#741CDD] focus:outline-none focus:ring-0 transition-colors duration-300";

  return (
    <div className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300">
      <div className="fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
        <div className="flex h-full flex-col">
          {/* Header */}
          <header className="relative flex justify-center items-center p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-800">
              New Leave Request
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="absolute right-6 rounded-md p-1 text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </header>

          {/* Body */}
          <div className="flex-grow space-y-8 overflow-y-auto p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <LeaveBalanceCard data={leaveData.casual} />
              <LeaveBalanceCard data={leaveData.sick} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Left */}
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="leaveType"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Leave Type
                  </label>
                  <select
                    id="leaveType"
                    name="leaveType"
                    value={formData.leaveType}
                    onChange={handleChange}
                    className={commonInputClasses}
                  >
                    <option value="">Please Select</option>
                    <option value="Casual Leave">Casual Leave</option>
                    <option value="Sick Leave">Sick Leave</option>
                  </select>
                </div>

                <div className="relative">
                  <label
                    htmlFor="startDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className={commonInputClasses}
                  />
                  <Calendar
                    size={18}
                    className="absolute right-2 top-9 text-gray-400"
                  />
                </div>

                <div className="relative">
                  <label
                    htmlFor="endDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    End Date
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className={commonInputClasses}
                  />
                  <Calendar
                    size={18}
                    className="absolute right-2 top-9 text-gray-400"
                  />
                </div>
              </div>

              {/* Right */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="isHalfDay"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Is Half Day
                  </label>
                  <button
                    onClick={handleToggle}
                    className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
                      formData.isHalfDay ? "bg-[#741CDD]" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                        formData.isHalfDay ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div>
                  <label
                    htmlFor="reason"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Reason
                  </label>
                  <textarea
                    id="reason"
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    rows={5}
                    className={commonInputClasses}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="flex items-center justify-center gap-4 border-t border-slate-200 p-6">
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

export default NewLeaveRequestModal;
