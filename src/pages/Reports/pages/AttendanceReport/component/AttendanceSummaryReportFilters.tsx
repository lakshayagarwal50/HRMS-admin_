import React, { useState } from "react";
import { X, Rocket, Trash2 } from "lucide-react";


interface AttendanceFilters {
  name: string;
  status: "Active" | "Inactive";
  designation: string;
  department: string;
  location: string;
  attendanceType: string;
  attendanceStatus: string;
  dateOption: string;
  dateFrom: string;
  dateTo: string;
}


interface AttendanceSummaryReportFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: AttendanceFilters) => void;
}

const initialFiltersState: AttendanceFilters = {
  name: "",
  status: "Active",
  designation: "",
  department: "",
  location: "",
  attendanceType: "",
  attendanceStatus: "",
  dateOption: "All",
  dateFrom: "",
  dateTo: "",
};

const AttendanceSummaryReportFilters: React.FC<
  AttendanceSummaryReportFiltersProps
> = ({ isOpen, onClose, onApplyFilters }) => {
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
              Attendance Summary Report Filters
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleRunClick}
                className="flex items-center gap-2 bg-[#741CDD] text-white font-semibold py-2 px-4 rounded-md hover:opacity-90 transition-opacity"
              >
                <Rocket size={16} />
                <span>Run</span>
              </button>
              <button className="flex items-center gap-2 border border-red-500 text-red-500 font-semibold py-2 px-4 rounded-md hover:bg-red-50 transition-colors">
                <Trash2 size={16} />
                <span>Delete</span>
              </button>
              <button
                onClick={onClose}
                className="p-1.5 bg-red-100 text-red-500 rounded-md hover:bg-red-200"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Form Body */}
          <div className="p-6 overflow-y-auto flex-grow">
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              <h3 className="font-semibold text-gray-600">Field</h3>
              <h3 className="font-semibold text-gray-600">Filter Value</h3>

              
              {[
                "Name",
                "Designation",
                "Department",
                "Location",
                "Attendance type",
                "Attendance Status",
              ].map((field) => (
                <React.Fragment key={field}>
                  <label className="text-sm text-gray-700 self-center">
                    {field}
                  </label>
                  <select
                    name={field.toLowerCase().replace(" ", "")}
                    onChange={handleChange}
                    className="p-2 border rounded-md text-sm focus:ring-1 focus:ring-[#741CDD] focus:border-[#741CDD]"
                  >
                    <option value="">Choose</option>
                  </select>
                </React.Fragment>
              ))}

              <label className="text-sm text-gray-700 self-center">
                Status
              </label>
              <div>
                <button className="bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-1.5 rounded-full flex items-center gap-2">
                  <X size={14} /> Active
                </button>
              </div>

              <label className="text-sm text-gray-700 self-center">Date</label>
              <div className="grid grid-cols-3 gap-2">
                <select
                  name="dateOption"
                  value={filters.dateOption}
                  onChange={handleChange}
                  className="col-span-3 p-2 border rounded-md text-sm focus:ring-1 focus:ring-[#741CDD] focus:border-[#741CDD]"
                >
                  <option value="All">All</option>
                  <option value="Custom">Custom</option>
                </select>
                <input
                  type="date"
                  name="dateFrom"
                  value={filters.dateFrom}
                  onChange={handleChange}
                  className="p-2 border rounded-md text-sm"
                  disabled={filters.dateOption !== "Custom"}
                />
                <input
                  type="date"
                  name="dateTo"
                  value={filters.dateTo}
                  onChange={handleChange}
                  className="p-2 border rounded-md text-sm"
                  disabled={filters.dateOption !== "Custom"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AttendanceSummaryReportFilters;
