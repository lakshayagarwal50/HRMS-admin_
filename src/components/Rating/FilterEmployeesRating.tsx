// import React, { useState, useEffect } from 'react';
// import { ChevronUp, ChevronDown } from 'lucide-react';
// import SidePanelForm from '../../components/common/SidePanelForm'; 

// export interface RatingFilters {
//   department: string;
//   project: string; 
// }

// interface FilterEmployeesRatingProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onApply: (filters: RatingFilters) => void;
//   initialFilters: RatingFilters | null;
// }

// const FilterDropdown: React.FC<{
//   title: string;
//   options: string[];
//   selectedValue: string;
//   onSelect: (value: string) => void;
// }> = ({ title, options, selectedValue, onSelect }) => {
//   const [isOpen, setIsOpen] = useState(true);

//   return (
//     <div>
//       <button
//         type="button"
//         onClick={() => setIsOpen(!isOpen)}
//         className="w-full flex justify-between items-center text-lg font-semibold text-gray-800 mb-2"
//       >
//         {title}
//         {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
//       </button>
//       {isOpen && (
//         <select
//           value={selectedValue}
//           onChange={(e) => onSelect(e.target.value)}
//           className="w-full p-2 border border-gray-300 rounded-md bg-white"
//         >
//           <option value="">Select...</option>
//           {options.map(option => (
//             <option key={option} value={option}>{option}</option>
//           ))}
//         </select>
//       )}
//     </div>
//   );
// };

// const FilterEmployeesRating: React.FC<FilterEmployeesRatingProps> = ({ isOpen, onClose, onApply, initialFilters }) => {
//   const [department, setDepartment] = useState('');
//   const [project, setProject] = useState('');

//   useEffect(() => {
//     if (isOpen) {
//       setDepartment(initialFilters?.department || '');
//       setProject(initialFilters?.project || '');
//     }
//   }, [isOpen, initialFilters]);

//   const handleClear = () => {
//     setDepartment('');
//     setProject('');
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onApply({ department, project });
//     onClose();
//   };

//   return (
//     <SidePanelForm
//       isOpen={isOpen}
//       onClose={onClose}
//       title="Filter"
//       onSubmit={handleSubmit}
//       submitText="APPLY"
//       onClear={handleClear}
//     >
//       <div className="space-y-6">
//         <FilterDropdown
//           title="Department"
//           options={['Engineering', 'HR', 'Development', 'Designing', 'Project Management', 'Business Analyst', 'Quality Analyst']}
//           selectedValue={department}
//           onSelect={setDepartment}
//         />
//         <FilterDropdown
//           title="Project"
//           options={['PyThru', 'Project A', 'Project B']}
//           selectedValue={project}
//           onSelect={setProject}
//         />
//       </div>
//     </SidePanelForm>
//   );
// };

// export default FilterEmployeesRating;

import React, { useState, useEffect, useMemo } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';

// --- Component & Redux Imports ---
import SidePanelForm from '../../components/common/SidePanelForm';
import type { AppDispatch, RootState } from '../../store/store';
// 1. Import the fetch actions for both departments and designations
import { fetchDepartments } from '../../store/slice/departmentSlice';
import { fetchDesignations } from '../../store/slice/designationSlice';

// --- TYPE DEFINITIONS ---
// 2. Updated the filters to include designation and remove project
export interface RatingFilters {
  department: string;
  designation: string; 
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
  isLoading?: boolean;
}> = ({ title, options, selectedValue, onSelect, isLoading = false }) => {
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
          {isLoading ? (
            <option disabled>Loading...</option>
          ) : (
            options.map(option => (
              <option key={option} value={option}>{option}</option>
            ))
          )}
        </select>
      )}
    </div>
  );
};

// --- MAIN COMPONENT ---
const FilterEmployeesRating: React.FC<FilterEmployeesRatingProps> = ({ isOpen, onClose, onApply, initialFilters }) => {
  const dispatch = useDispatch<AppDispatch>();
  
  // 3. Get both departments and designations from the Redux store
  const { items: departments, status: departmentStatus } = useSelector((state: RootState) => state.departments);
  const { items: designations, status: designationStatus } = useSelector((state: RootState) => state.designations);

  const [department, setDepartment] = useState('');
  const [designation, setDesignation] = useState('');

  // 4. Fetch data when the panel opens if it hasn't been fetched yet
  useEffect(() => {
    if (isOpen) {
      if (departmentStatus === 'idle') {
        dispatch(fetchDepartments());
      }
      if (designationStatus === 'idle') {
        dispatch(fetchDesignations());
      }
    }
  }, [isOpen, departmentStatus, designationStatus, dispatch]);

  // Populate form with existing filters when it opens
  useEffect(() => {
    if (isOpen) {
      setDepartment(initialFilters?.department || '');
      setDesignation(initialFilters?.designation || '');
    }
  }, [isOpen, initialFilters]);

  const handleClear = () => {
    setDepartment('');
    setDesignation('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApply({ department, designation });
    onClose();
  };

  // 5. Create dynamic option lists from the Redux state
  const departmentOptions = useMemo(() => departments.map(d => d.name), [departments]);
  const designationOptions = useMemo(() => designations.map(d => d.name), [designations]);

  return (
    <SidePanelForm
      isOpen={isOpen}
      onClose={onClose}
      title="Filter"
      onSubmit={handleSubmit}
      submitText="APPLY"
      onClear={handleClear}
    >
      <div className="space-y-6">
        <FilterDropdown
          title="Department"
          options={departmentOptions}
          selectedValue={department}
          onSelect={setDepartment}
          isLoading={departmentStatus === 'loading'}
        />
        <FilterDropdown
          title="Designation"
          options={designationOptions}
          selectedValue={designation}
          onSelect={setDesignation}
          isLoading={designationStatus === 'loading'}
        />
      </div>
    </SidePanelForm>
  );
};

export default FilterEmployeesRating;

