// features/projects/list/components/FilterSidebar.tsx
import React, { useState, useEffect } from "react";
import GenericForm, { type FormField } from "../../../../components/common/GenericForm";
import type { ProjectFilters } from "../../../../types/project";

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  initialFilters: ProjectFilters;
  onApply: (filters: ProjectFilters) => void;
  onClear: () => void;
}

const filterFields: FormField[] = [
  { name: "searchTerm", label: "Search by Name", type: "text", placeholder: "Enter project name" },
  { name: "status", label: "Status", type: "select", options: [{ value: "All", label: "All" }, { value: "Active", label: "Active" }, { value: "Inactive", label: "Inactive" }] },
  { name: "billingType", label: "Billing Type", type: "select", options: [{ value: "All", label: "All" }, { value: "FixedCost", label: "Fixed Cost" }, { value: "TimeAndMaterial", label: "Time and Material" }] },
  { name: "startDate", label: "Start Date", type: "date" },
  { name: "endDate", label: "End Date", type: "date" },
];

const FilterSidebar: React.FC<FilterSidebarProps> = ({ isOpen, onClose, initialFilters, onApply, onClear }) => {
  const [formData, setFormData] = useState<ProjectFilters>(initialFilters);

  useEffect(() => {
    setFormData(initialFilters);
  }, [initialFilters]);

  const handleFormChange = (data: Record<string, any>) => {
    setFormData(data as ProjectFilters);
  };

  const handleApply = () => {
    onApply(formData);
  };

  const handleClear = () => {
    onClear();
  };

  return (
    <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 p-6 ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Filters</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <GenericForm fields={filterFields} initialState={formData} onSubmit={handleApply} onFormChange={handleFormChange} submitButtonText="Apply Filters" showCancelButton={false} />
      <div className="mt-4">
        <button onClick={handleClear} className="w-full bg-red-100 text-red-600 border border-red-600 px-4 py-2 rounded transition duration-200 hover:bg-red-200">Clear Filters</button>
      </div>
    </div>
  );
};

export default FilterSidebar;