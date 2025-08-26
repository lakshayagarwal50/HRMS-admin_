import React, { useState } from "react";
import { X, Play, Download } from "lucide-react";

// Define the shape of the filters state
interface PayslipFilters {
  status: "Active" | "Inactive";
  joiningDateOption: string;
  joiningDateFrom: string;
  joiningDateTo: string;
  grossPayFrom: string;
  grossPayTo: string;
  lossOfPayFrom: string;
  lossOfPayTo: string;
  taxPaidFrom: string;
  taxPaidTo: string;
  designation: string;
  department: string;
  location: string;
}

// Props for the component
interface PayslipSummaryReportFilterProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: PayslipFilters) => void;
}

const initialFiltersState: PayslipFilters = {
  status: "Active",
  joiningDateOption: "Custom",
  joiningDateFrom: "",
  joiningDateTo: "",
  grossPayFrom: "0.00",
  grossPayTo: "0.00",
  lossOfPayFrom: "0.00",
  lossOfPayTo: "0.00",
  taxPaidFrom: "0.00",
  taxPaidTo: "0.00",
  designation: "",
  department: "",
  location: "",
};

const PayslipSummaryReportFilter: React.FC<PayslipSummaryReportFilterProps> = ({
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
    // You might want to close the modal upon applying filters
    // onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      ></div>

      {/* Sidebar - Changed from a centered modal to a sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-lg bg-white shadow-xl z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-800">
              Payslip Summary Report Filters
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
              <h3 className="font-semibold text-gray-600">Field</h3>
              <h3 className="font-semibold text-gray-600">Filter Value</h3>

              {/* Status - Changed to radio buttons */}
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

              {/* Joining Date */}
              <label className="text-sm text-gray-700">Joining Date</label>
              <div className="grid grid-cols-3 gap-2">
                <select
                  name="joiningDateOption"
                  value={filters.joiningDateOption}
                  onChange={handleChange}
                  className="col-span-3 p-2 border rounded-md text-sm focus:ring-1 focus:ring-[#741CDD] focus:border-[#741CDD]"
                >
                  <option>Custom</option>
                  <option>Last Month</option>
                  <option>This Year</option>
                </select>
                <input
                  type="date"
                  name="joiningDateFrom"
                  value={filters.joiningDateFrom}
                  onChange={handleChange}
                  placeholder="From Date"
                  className="p-2 border rounded-md text-sm focus:ring-1 focus:ring-[#741CDD] focus:border-[#741CDD]"
                />
                <input
                  type="date"
                  name="joiningDateTo"
                  value={filters.joiningDateTo}
                  onChange={handleChange}
                  placeholder="To Date"
                  className="p-2 border rounded-md text-sm focus:ring-1 focus:ring-[#741CDD] focus:border-[#741CDD]"
                />
              </div>

              {/* Amount Ranges */}
              {[
                { label: "Gross Pay", from: "grossPayFrom", to: "grossPayTo" },
                {
                  label: "Loss Of Pay",
                  from: "lossOfPayFrom",
                  to: "lossOfPayTo",
                },
                { label: "Tax Paid", from: "taxPaidFrom", to: "taxPaidTo" },
              ].map((field) => (
                <React.Fragment key={field.label}>
                  <label className="text-sm text-gray-700">{field.label}</label>
                  <div className="grid grid-cols-3 gap-2">
                    <select className="col-span-3 p-2 border rounded-md text-sm focus:ring-1 focus:ring-[#741CDD] focus:border-[#741CDD]">
                      <option>Amount Range</option>
                    </select>
                    <input
                      type="number"
                      name={field.from}
                      value={filters[field.from as keyof PayslipFilters]}
                      onChange={handleChange}
                      placeholder="From Range"
                      className="p-2 border rounded-md text-sm focus:ring-1 focus:ring-[#741CDD] focus:border-[#741CDD]"
                    />
                    <input
                      type="number"
                      name={field.to}
                      value={filters[field.to as keyof PayslipFilters]}
                      onChange={handleChange}
                      placeholder="To Range"
                      className="p-2 border rounded-md text-sm focus:ring-1 focus:ring-[#741CDD] focus:border-[#741CDD]"
                    />
                  </div>
                </React.Fragment>
              ))}

              {/* Dropdowns */}
              {["Designation", "Department", "Location"].map((field) => (
                <React.Fragment key={field}>
                  <label className="text-sm text-gray-700">{field}</label>
                  <select
                    name={field.toLowerCase()}
                    value={filters[field.toLowerCase() as keyof PayslipFilters]}
                    onChange={handleChange}
                    className="p-2 border rounded-md text-sm focus:ring-1 focus:ring-[#741CDD] focus:border-[#741CDD]"
                  >
                    <option value="">Choose</option>
                    {/* Add more options here as needed */}
                  </select>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PayslipSummaryReportFilter;
