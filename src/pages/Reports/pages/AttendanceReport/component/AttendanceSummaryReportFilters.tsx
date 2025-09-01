

// src/pages/Reports/pages/AttendanceReport/component/AttendanceSummaryReportFilters.tsx
import React, { useState, useEffect } from "react";
import { X, Rocket, Trash2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../../../store/hooks";
// The actual slice files confirm these thunks exist and are correctly named
import { fetchDepartments } from "../../../../../store/slice/departmentSlice";
import { fetchEmployeeDesignations as fetchDesignations } from "../../../../../store/slice/employeeDesignationSlice";
import { fetchLocations } from "../../../../../store/slice/locationSlice";

export interface AttendanceFilters {
  name?: string;
  status?: "Active" | "Inactive" | "";
  designation?: string;
  department?: string;
  location?: string;
  dateOption?: "All" | "Custom";
  dateFrom?: string;
  dateTo?: string;
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
  dateOption: "All",
  dateFrom: "",
  dateTo: "",
};

const AttendanceSummaryReportFilters: React.FC<AttendanceSummaryReportFiltersProps> = ({ isOpen, onClose, onApplyFilters }) => {
  const [filters, setFilters] = useState(initialFiltersState);
  const dispatch = useAppDispatch();

  // ▼▼▼ THE DEFINITIVE FIX IS HERE ▼▼▼
  // We select the `items` property from each state slice and rename it.
  // Example: `{ items: departments }` means "get the `items` property and call it `departments`".
  const { items: departments = [] } = useAppSelector((state) => state.departments) || {};
  const { items: designations = [] } = useAppSelector((state) => state.employeeDesignations) || {};
  const { items: locations = [] } = useAppSelector((state) => state.locations) || {};

  useEffect(() => {
    if (isOpen) {
      if (departments.length === 0) dispatch(fetchDepartments());
      // Note: The thunk from employeeDesignationSlice is fetchEmployeeDesignations
      if (designations.length === 0) dispatch(fetchDesignations("")); // Pass department argument if needed, or empty if not
      if (locations.length === 0) dispatch(fetchLocations());
    }
  }, [isOpen, dispatch, departments.length, designations.length, locations.length]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleRunClick = () => {
    const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value !== "" && value !== null) {
        acc[key as keyof AttendanceFilters] = value;
      }
      return acc;
    }, {} as AttendanceFilters);
    onApplyFilters(cleanFilters);
  };

  const handleReset = () => {
    setFilters(initialFiltersState);
    onApplyFilters({});
  };

  return (
    <>
      <div className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`} onClick={onClose} aria-hidden="true" />
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-semibold text-gray-800">Report Filters</h2>
            <div className="flex items-center space-x-2">
              <button onClick={handleRunClick} className="flex items-center gap-2 bg-[#741CDD] text-white font-semibold py-2 px-4 rounded-md hover:opacity-90 transition-opacity"><Rocket size={16} /><span>Run</span></button>
              <button onClick={handleReset} className="flex items-center gap-2 border border-red-500 text-red-500 font-semibold py-2 px-4 rounded-md hover:bg-red-50 transition-colors"><Trash2 size={16} /><span>Reset</span></button>
              <button onClick={onClose} className="p-1.5 bg-red-100 text-red-500 rounded-md hover:bg-red-200"><X size={20} /></button>
            </div>
          </div>
          <div className="p-6 overflow-y-auto flex-grow">
            <div className="grid grid-cols-1 gap-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employee Name</label>
                <input type="text" name="name" value={filters.name} onChange={handleChange} className="w-full p-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select name="status" value={filters.status} onChange={handleChange} className="w-full p-2 border rounded-md"><option value="Active">Active</option><option value="Inactive">Inactive</option><option value="">All</option></select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select name="department" value={filters.department} onChange={handleChange} className="w-full p-2 border rounded-md"><option value="">All Departments</option>{departments.map((d) => (<option key={d.id} value={d.id}>{d.name}</option>))}</select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                <select name="designation" value={filters.designation} onChange={handleChange} className="w-full p-2 border rounded-md"><option value="">All Designations</option>{designations.map((d) => (<option key={d.id} value={d.id}>{d.name}</option>))}</select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <select name="location" value={filters.location} onChange={handleChange} className="w-full p-2 border rounded-md"><option value="">All Locations</option>{locations.map((l) => (<option key={l.id} value={l.city}>{l.city}</option>))}</select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                <select name="dateOption" value={filters.dateOption} onChange={handleChange} className="w-full p-2 border rounded-md mb-2"><option value="All">All Time</option><option value="Custom">Custom Range</option></select>
                {filters.dateOption === "Custom" && (
                  <div className="grid grid-cols-2 gap-2">
                    <input type="date" name="dateFrom" value={filters.dateFrom} onChange={handleChange} className="p-2 border rounded-md" />
                    <input type="date" name="dateTo" value={filters.dateTo} onChange={handleChange} className="p-2 border rounded-md" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AttendanceSummaryReportFilters;