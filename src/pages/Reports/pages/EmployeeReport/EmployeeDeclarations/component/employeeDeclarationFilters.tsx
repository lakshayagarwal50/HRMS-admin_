import React, { useState } from "react";
import { X, Play, Download } from "lucide-react";
import Modal from "../../../../../../components/common/NotificationModal"; 

interface EmployeeDeclarationFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: any) => void;
}

const initialFiltersState = {
  employee: "",
  status: "Active",
};

const EmployeeDeclarationFilters: React.FC<EmployeeDeclarationFiltersProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
}) => {
  const [filters, setFilters] = useState(initialFiltersState);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleRunClick = () => {
    setIsConfirmModalOpen(true);
  };

  const handleConfirmRun = () => {
    onApplyFilters(filters);
    setIsConfirmModalOpen(false);
  };

  return (
    <>
      
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      ></div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-lg bg-white shadow-xl z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-800">
              Employee Declarations Report Filter
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <X size={24} className="text-red-500" />
            </button>
          </div>

          {/* Buttons row */}
          <div className="flex justify-end items-center space-x-2 p-4 border-b">
            <button
              onClick={handleRunClick}
              className="flex items-center space-x-2 bg-[#741CDD] text-white font-semibold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors"
            >
              <Play size={16} />
              <span>Run</span>
            </button>
            <button className="flex items-center space-x-2 bg-purple-100 text-[#741CDD] font-semibold py-2 px-4 rounded-lg hover:bg-purple-200 transition-colors">
              <Download size={16} />
              <span>Download</span>
            </button>
          </div>

          
          <div className="p-6 overflow-y-auto flex-grow">
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              <h3 className="font-semibold text-gray-600">Field</h3>
              <h3 className="font-semibold text-gray-600">Filter Value</h3>

              
              <label className="text-sm text-gray-700 self-center">
                Employee
              </label>
              <select
                name="employee"
                value={filters.employee}
                onChange={handleChange}
                className="p-2 border rounded-md text-sm"
              >
                <option value="">Choose</option>
                {/* Add employee options here */}
              </select>

              
              <label className="text-sm text-gray-700 self-center">
                Status
              </label>
              <div className="flex items-center space-x-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="Active"
                    checked={filters.status === "Active"}
                    onChange={handleChange}
                  />
                  <span>Active</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="Inactive"
                    checked={filters.status === "Inactive"}
                    onChange={handleChange}
                  />
                  <span>Inactive</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmRun}
        title="Run Report with saved filters?"
        message="This will run the report with submitted filters and save the filters."
        type="warning"
        confirmButtonText="CONFIRM"
        cancelButtonText="CANCEL"
      />
    </>
  );
};

export default EmployeeDeclarationFilters;
