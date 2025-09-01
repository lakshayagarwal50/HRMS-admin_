import React, { useState } from "react";
import { X, Play, Download } from "lucide-react";


interface LeaveFilters {
  name: string;
  status: "Active" | "Inactive";
  leaveType: string;
  dateOption: string;
  dateFrom: string;
  dateTo: string;
}


interface LeaveReportFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: LeaveFilters) => void;
}

const initialFiltersState: LeaveFilters = {
  name: "",
  status: "Active",
  leaveType: "",
  dateOption: "Custom",
  dateFrom: "",
  dateTo: "",
};

const LeaveReportFilters: React.FC<LeaveReportFiltersProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
}) => {
  const [filters, setFilters] = useState(initialFiltersState);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleRunClick = () => {
    onApplyFilters(filters);
  };

  return (
    <>
     
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      ></div>

     
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-lg bg-white shadow-xl z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-800">
              Leave Report Filters
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <X size={24} className="text-red-500" />
            </button>
          </div>

         
          <div className="flex justify-end items-center space-x-2 p-4 border-b">
            <button
              onClick={handleRunClick}
              className="flex items-center space-x-2 bg-[#741CDD] text-white font-semibold py-2 px-4 rounded-lg hover:opacity-90 transition-colors"
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

             
              <label className="text-sm text-gray-700 self-center">Name</label>
              <select
                name="name"
                value={filters.name}
                onChange={handleChange}
                className="p-2 border rounded-md text-sm focus:ring-1 focus:ring-[#741CDD] focus:border-[#741CDD]"
              >
                <option value="">Choose</option>
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
                    className="form-radio text-[#741CDD] focus:ring-[#741CDD]"
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
                    className="form-radio text-[#741CDD] focus:ring-[#741CDD]"
                  />
                  <span>Inactive</span>
                </label>
              </div>

              
              <label className="text-sm text-gray-700 self-center">
                Leave Type
              </label>
              <select
                name="leaveType"
                value={filters.leaveType}
                onChange={handleChange}
                className="p-2 border rounded-md text-sm focus:ring-1 focus:ring-[#741CDD] focus:border-[#741CDD]"
              >
                <option value="">Choose</option>
                <option value="Sick">Sick Leave</option>
                <option value="Casual">Casual Leave</option>
              </select>

              
              <label className="text-sm text-gray-700 self-center">Date</label>
              <div className="grid grid-cols-3 gap-2">
                <select
                  name="dateOption"
                  value={filters.dateOption}
                  onChange={handleChange}
                  className="col-span-3 p-2 border rounded-md text-sm focus:ring-1 focus:ring-[#741CDD] focus:border-[#741CDD]"
                >
                  <option value="Custom">Custom</option>
                  <option value="LastMonth">Last Month</option>
                </select>
                <input
                  type="date"
                  name="dateFrom"
                  value={filters.dateFrom}
                  onChange={handleChange}
                  className="p-2 border rounded-md text-sm"
                />
                <input
                  type="date"
                  name="dateTo"
                  value={filters.dateTo}
                  onChange={handleChange}
                  className="p-2 border rounded-md text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeaveReportFilters;
