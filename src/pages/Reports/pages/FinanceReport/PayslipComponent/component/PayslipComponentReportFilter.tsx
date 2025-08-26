import React, { useState } from "react";
// --- CHANGE HERE: Updated icons to match the reference ---
import { X, Play, Download } from "lucide-react";

// Define the shape of the filters state
interface ComponentFilters {
  name: string;
  periodOption: string;
  periodFrom: string;
  periodTo: string;
}

// Props for the component
interface PayslipComponentReportFilterProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: ComponentFilters) => void;
}

const initialFiltersState: ComponentFilters = {
  name: "",
  periodOption: "Custom",
  periodFrom: "",
  periodTo: "",
};

const PayslipComponentReportFilter: React.FC<
  PayslipComponentReportFilterProps
> = ({ isOpen, onClose, onApplyFilters }) => {
  const [filters, setFilters] = useState(initialFiltersState);

  // --- CHANGE HERE: Added handleChange to make the form interactive ---
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleRunClick = () => {
    onApplyFilters(filters);
    onClose(); // Close the modal after applying filters
  };

  return (
    <>
      {/* --- CHANGE HERE: Overlay styled like the reference --- */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      ></div>

      {/* --- CHANGE HERE: Changed from a centered modal to a sidebar --- */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-lg bg-white shadow-xl z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-800">
              Payslip component Report Filters
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <X size={24} className="text-red-500" />
            </button>
          </div>

          {/* Action Buttons Section */}
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

          {/* Form Body */}
          <div className="p-6 overflow-y-auto flex-grow">
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              {/* Headers */}
              <h3 className="font-semibold text-gray-600">Field</h3>
              <h3 className="font-semibold text-gray-600">Filter Value</h3>

              {/* Name */}
              <label className="text-sm text-gray-700 self-center">Name</label>
              <select
                name="name"
                value={filters.name}
                onChange={handleChange}
                className="p-2 border rounded-md text-sm focus:ring-1 focus:ring-[#741CDD] focus:border-[#741CDD]"
              >
                <option value="">Choose</option>
                {/* Populate with employee names */}
              </select>

              {/* Period */}
              <label className="text-sm text-gray-700 self-center">
                Period
              </label>
              <div className="grid grid-cols-3 gap-2">
                <select
                  name="periodOption"
                  value={filters.periodOption}
                  onChange={handleChange}
                  className="col-span-3 p-2 border rounded-md text-sm focus:ring-1 focus:ring-[#741CDD] focus:border-[#741CDD]"
                >
                  <option>Custom</option>
                  <option>Last Month</option>
                  <option>This Year</option>
                </select>
                <input
                  type="date"
                  name="periodFrom"
                  value={filters.periodFrom}
                  onChange={handleChange}
                  placeholder="From Date"
                  className="p-2 border rounded-md text-sm focus:ring-1 focus:ring-[#741CDD] focus:border-[#741CDD]"
                />
                <input
                  type="date"
                  name="periodTo"
                  value={filters.periodTo}
                  onChange={handleChange}
                  placeholder="To Date"
                  className="p-2 border rounded-md text-sm focus:ring-1 focus:ring-[#741CDD] focus:border-[#741CDD]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PayslipComponentReportFilter;
