// import React, { useState, useEffect } from 'react';
// import SidePanelForm from '../../components/common/SidePanelForm'; 


// export interface LeaveFilters {
//   leaveTypes: string[];
//   approvalStatus: string[];
//   departments: string[];
// }

// interface LeaveFilterProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onApply: (filters: LeaveFilters) => void;
//   initialFilters: LeaveFilters | null;
// }


// const leaveTypeOptions = ['Planned', 'Casual', 'Privileged', 'Sick'];
// const approvalStatusOptions = ['Pending', 'Approved', 'Rejected'];
// const departmentOptions = ['Developer', 'Designer','Development'];


// const FilterGroup: React.FC<{
//   title: string;
//   options: string[];
//   selected: string[];
//   onChange: (selected: string[]) => void;
// }> = ({ title, options, selected, onChange }) => {
//   const handleToggle = (option: string) => {
//     const newSelected = selected.includes(option)
//       ? selected.filter(item => item !== option)
//       : [...selected, option];
//     onChange(newSelected);
//   };

//   return (
//     <div>
//       <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
//       <div className="p-4 border border-gray-200 rounded-lg space-y-3">
//         {options.map(option => (
//           <label key={option} className="flex items-center cursor-pointer">
//             <input
//               type="checkbox"
//               checked={selected.includes(option)}
//               onChange={() => handleToggle(option)}
//               className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
//             />
//             <span className="ml-3 text-sm text-gray-700">{option}</span>
//           </label>
//         ))}
//       </div>
//     </div>
//   );
// };



// const LeaveFilter: React.FC<LeaveFilterProps> = ({ isOpen, onClose, onApply, initialFilters }) => {
//   const [leaveTypes, setLeaveTypes] = useState<string[]>([]);
//   const [approvalStatus, setApprovalStatus] = useState<string[]>([]);
//   const [departments, setDepartments] = useState<string[]>([]);

//   useEffect(() => {
//     if (isOpen) {
//       setLeaveTypes(initialFilters?.leaveTypes || []);
//       setApprovalStatus(initialFilters?.approvalStatus || []);
//       setDepartments(initialFilters?.departments || []);
//     }
//   }, [isOpen, initialFilters]);

//   const handleClear = () => {
//     setLeaveTypes([]);
//     setApprovalStatus([]);
//     setDepartments([]);
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onApply({ leaveTypes, approvalStatus, departments });
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
//         <FilterGroup
//           title="Leave Type"
//           options={leaveTypeOptions}
//           selected={leaveTypes}
//           onChange={setLeaveTypes}
//         />
//         <FilterGroup
//           title="Final Approval status"
//           options={approvalStatusOptions}
//           selected={approvalStatus}
//           onChange={setApprovalStatus}
//         />
//         <FilterGroup
//           title="Department"
//           options={departmentOptions}
//           selected={departments}
//           onChange={setDepartments}
//         />
//       </div>
//     </SidePanelForm>
//   );
// };

// export default LeaveFilter;

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// --- Component & Redux Imports ---
import SidePanelForm from '../../components/common/SidePanelForm';
import type { AppDispatch, RootState } from '../../store/store';
import { fetchDepartments } from '../../store/slice/departmentSlice'; // 1. Import the fetch action

// --- TYPE DEFINITIONS ---
export interface LeaveFilters {
  leaveTypes: string[];
  approvalStatus: string[];
  departments: string[];
}

interface LeaveFilterProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: LeaveFilters) => void;
  initialFilters: LeaveFilters | null;
}

// --- STATIC DATA for filter options (Leave Type & Status are still static) ---
const leaveTypeOptions = ['Planned', 'Casual', 'Privileged', 'Sick'];
const approvalStatusOptions = ['Pending', 'Approved', 'Rejected'];

// --- Reusable Checkbox Group Component ---
const FilterGroup: React.FC<{
  title: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  isLoading?: boolean; // Add a loading state for the group
}> = ({ title, options, selected, onChange, isLoading = false }) => {
  const handleToggle = (option: string) => {
    const newSelected = selected.includes(option)
      ? selected.filter(item => item !== option)
      : [...selected, option];
    onChange(newSelected);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <div className="p-4 border border-gray-200 rounded-lg space-y-3">
        {isLoading ? (
            <p className="text-sm text-gray-500">Loading options...</p>
        ) : (
            options.map(option => (
              <label key={option} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={selected.includes(option)}
                  onChange={() => handleToggle(option)}
                  className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="ml-3 text-sm text-gray-700">{option}</span>
              </label>
            ))
        )}
      </div>
    </div>
  );
};



const LeaveFilter: React.FC<LeaveFilterProps> = ({ isOpen, onClose, onApply, initialFilters }) => {
  const dispatch = useDispatch<AppDispatch>();
  
  // 2. Get departments and their status from the Redux store
  const { items: departments, status: departmentStatus } = useSelector((state: RootState) => state.departments);

  const [leaveTypes, setLeaveTypes] = useState<string[]>([]);
  const [approvalStatus, setApprovalStatus] = useState<string[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);

  // 3. Fetch departments when the panel opens if they haven't been fetched yet
  useEffect(() => {
    if (isOpen && departmentStatus === 'idle') {
      dispatch(fetchDepartments());
    }
  }, [isOpen, departmentStatus, dispatch]);

  // Effect to set the form's state based on the applied filters from the parent page
  useEffect(() => {
    if (isOpen) {
      setLeaveTypes(initialFilters?.leaveTypes || []);
      setApprovalStatus(initialFilters?.approvalStatus || []);
      setSelectedDepartments(initialFilters?.departments || []);
    }
  }, [isOpen, initialFilters]);

  const handleClear = () => {
    setLeaveTypes([]);
    setApprovalStatus([]);
    setSelectedDepartments([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApply({ leaveTypes, approvalStatus, departments: selectedDepartments });
    onClose();
  };

  // 4. Create the dynamic list of department names for the filter options
  const departmentOptions = departments.map(dep => dep.name);

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
        <FilterGroup
          title="Leave Type"
          options={leaveTypeOptions}
          selected={leaveTypes}
          onChange={setLeaveTypes}
        />
        <FilterGroup
          title="Final Approval status"
          options={approvalStatusOptions}
          selected={approvalStatus}
          onChange={setApprovalStatus}
        />
        <FilterGroup
          title="Department"
          options={departmentOptions}
          selected={selectedDepartments}
          onChange={setSelectedDepartments}
          isLoading={departmentStatus === 'loading'}
        />
      </div>
    </SidePanelForm>
  );
};

export default LeaveFilter;

