import React, { useState, useEffect } from "react";
import { X, Play, Download, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import Modal from "../../../../../../components/common/NotificationModal"; 

import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../../../../store/store"; 
import { fetchDepartments } from "../../../../../../store/slice/departmentSlice"; 
import {
  fetchEmployeeDesignations,
  resetEmployeeDesignations,
} from "../../../../../../store/slice/employeeDesignationSlice"; 

interface EmployeeSnapshotFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: any) => void;
}

const initialFiltersState = {
  status: "Active",
  joiningDateFrom: "",
  joiningDateTo: "",
  grossPayFrom: "",
  grossPayTo: "",
  lossOfPayFrom: "",
  lossOfPayTo: "",
  taxPaidFrom: "",
  taxPaidTo: "",
  department: "",
  designation: "",
  location: "",
};

const EmployeeSnapshotFilters: React.FC<EmployeeSnapshotFiltersProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
}) => {
  const [filters, setFilters] = useState(initialFiltersState);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { items: departments } = useSelector(
    (state: RootState) => state.departments
  );
  const { items: designations } = useSelector(
    (state: RootState) => state.employeeDesignations
  );
  useEffect(() => {
    if (isOpen) {
      dispatch(fetchDepartments());
    }
  }, [isOpen, dispatch]);

  useEffect(() => {
    if (filters.department) {
      dispatch(fetchEmployeeDesignations(filters.department));
    } else {
      dispatch(resetEmployeeDesignations());
    }
  }, [filters.department, dispatch]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => {
      const newFilters = { ...prev, [name]: value };
      if (name === "department") {
        newFilters.designation = "";
      }
      return newFilters;
    });
  };

  const handleClear = () => {
    setFilters(initialFiltersState);
    onApplyFilters({});
    toast.success("Filters cleared");
  };

  const getActiveFilters = () => {
    const activeFilters: { [key: string]: any } = {};
    for (const [key, value] of Object.entries(filters)) {
      if (value) {
        activeFilters[key] = value;
      }
    }
    return activeFilters;
  };

  const handleRunClick = () => {
    setIsConfirmModalOpen(true);
  };

  const handleConfirmRun = () => {
    onApplyFilters(getActiveFilters());
    setIsConfirmModalOpen(false);
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-lg bg-white shadow-xl z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-800">
              Employee Snapshot Filters
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
              onClick={handleClear}
              className="flex items-center space-x-2 bg-blue-100 text-blue-700 font-semibold py-2 px-4 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <RefreshCw size={16} />
              <span>Clear</span>
            </button>
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

              
              <label className="text-sm text-gray-700">Joining Date</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  name="joiningDateFrom"
                  value={filters.joiningDateFrom}
                  onChange={handleChange}
                  className="p-2 border rounded-md text-sm"
                />
                <input
                  type="date"
                  name="joiningDateTo"
                  value={filters.joiningDateTo}
                  onChange={handleChange}
                  className="p-2 border rounded-md text-sm"
                />
              </div>

              
              <label className="text-sm text-gray-700">Gross Pay</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  name="grossPayFrom"
                  placeholder="From Range"
                  value={filters.grossPayFrom}
                  onChange={handleChange}
                  className="p-2 border rounded-md text-sm"
                />
                <input
                  type="number"
                  name="grossPayTo"
                  placeholder="To Range"
                  value={filters.grossPayTo}
                  onChange={handleChange}
                  className="p-2 border rounded-md text-sm"
                />
              </div>

              
              <label className="text-sm text-gray-700">Loss Of Pay</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  name="lossOfPayFrom"
                  placeholder="From Range"
                  value={filters.lossOfPayFrom}
                  onChange={handleChange}
                  className="p-2 border rounded-md text-sm"
                />
                <input
                  type="number"
                  name="lossOfPayTo"
                  placeholder="To Range"
                  value={filters.lossOfPayTo}
                  onChange={handleChange}
                  className="p-2 border rounded-md text-sm"
                />
              </div>

             
              <label className="text-sm text-gray-700">Tax Paid</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  name="taxPaidFrom"
                  placeholder="From Range"
                  value={filters.taxPaidFrom}
                  onChange={handleChange}
                  className="p-2 border rounded-md text-sm"
                />
                <input
                  type="number"
                  name="taxPaidTo"
                  placeholder="To Range"
                  value={filters.taxPaidTo}
                  onChange={handleChange}
                  className="p-2 border rounded-md text-sm"
                />
              </div>

              
              <label className="text-sm text-gray-700">Department</label>
              <select
                name="department"
                value={filters.department}
                onChange={handleChange}
                className="p-2 border rounded-md text-sm"
              >
                <option value="">Choose Department</option>
                {departments.map((dep) => (
                  <option key={dep.id} value={dep.name}>
                    {dep.name}
                  </option>
                ))}
              </select>

              
              <label className="text-sm text-gray-700">Designation</label>
              <select
                name="designation"
                value={filters.designation}
                onChange={handleChange}
                className="p-2 border rounded-md text-sm"
                disabled={!filters.department || designations.length === 0}
              >
                <option value="">
                  {!filters.department
                    ? "Select a department first"
                    : "Choose Designation"}
                </option>
                {designations.map((des) => (
                  <option key={des.id} value={des.name || des.designationName}>
                    {des.name || des.designationName}
                  </option>
                ))}
              </select>

              
              <label className="text-sm text-gray-700">Location</label>
              <input
                type="text"
                name="location"
                value={filters.location}
                onChange={handleChange}
                placeholder="Enter location name"
                className="p-2 border rounded-md text-sm"
              />
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmRun}
        title="Run Report with these filters?"
        message="This will apply the selected filters to the report."
        type="warning"
        confirmButtonText="CONFIRM"
        cancelButtonText="CANCEL"
      />
    </>
  );
};

export default EmployeeSnapshotFilters;
