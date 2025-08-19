import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import SidePanelForm from '../../components/common/SidePanelForm'; // Adjust path if needed

// --- TYPE DEFINITIONS ---
export interface RatingFilters {
  department: string;
  project: string;
}

interface FilterEmployeesRatingProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: RatingFilters) => void;
  initialFilters: RatingFilters | null;
}

// --- Reusable Dropdown Component ---
const FilterDropdown: React.FC<{
  title: string;
  options: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
}> = ({ title, options, selectedValue, onSelect }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-lg font-semibold text-gray-800 mb-2"
      >
        {title}
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      {isOpen && (
        <select
          value={selectedValue}
          onChange={(e) => onSelect(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md bg-white"
        >
          <option value="">Select...</option>
          {options.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      )}
    </div>
  );
};

// --- MAIN COMPONENT ---
const FilterEmployeesRating: React.FC<FilterEmployeesRatingProps> = ({ isOpen, onClose, onApply, initialFilters }) => {
  const [department, setDepartment] = useState('');
  const [project, setProject] = useState('');

  // Populate form with existing filters when it opens
  useEffect(() => {
    if (isOpen) {
      setDepartment(initialFilters?.department || '');
      setProject(initialFilters?.project || '');
    }
  }, [isOpen, initialFilters]);

  const handleClear = () => {
    setDepartment('');
    setProject('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApply({ department, project });
    onClose();
  };

  return (
    <SidePanelForm
      isOpen={isOpen}
      onClose={onClose}
      title="Filter"
      onSubmit={handleSubmit}
      submitText="APPLY"
      onClear={handleClear} // Assuming SidePanelForm can handle an onClear prop
    >
      <div className="space-y-6">
        <FilterDropdown
          title="Department"
          options={['Designing', 'Project Management', 'Business Analyst', 'Quality Analyst', 'Development']}
          selectedValue={department}
          onSelect={setDepartment}
        />
        <FilterDropdown
          title="Project"
          options={['PyThru', 'Project A', 'Project B']}
          selectedValue={project}
          onSelect={setProject}
        />
      </div>
    </SidePanelForm>
  );
};

export default FilterEmployeesRating;
