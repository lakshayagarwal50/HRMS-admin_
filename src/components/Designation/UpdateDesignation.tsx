import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SidePanelForm from '../common/SidePanelForm';

// --- Redux Imports ---
import { updateDesignation, type Designation } from '../../store/slice/designationSlice';
import { fetchDepartments, type Department } from '../../store/slice/departmentSlice'; // Import department slice
import type { RootState, AppDispatch } from '../../store/store';

// --- PROPS DEFINITION ---
interface UpdateDesignationProps {
  isOpen: boolean;
  onClose: () => void;
  designationData: Designation | null;
}

// --- REUSABLE FORM FIELD COMPONENTS (Unchanged) ---
const FormInput: React.FC<{
  label: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}> = ({ label, value, onChange, required }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input type="text" value={value} onChange={onChange} required={required} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500" />
  </div>
);

const FormTextarea: React.FC<{
  label: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}> = ({ label, value, onChange }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <textarea value={value} onChange={onChange} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500" />
    </div>
);

const FormSelect: React.FC<{
  label: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
  required?: boolean;
}> = ({ label, value, onChange, children, required }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <select value={value} onChange={onChange} required={required} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 bg-white">
            {children}
        </select>
    </div>
);

// --- MAIN COMPONENT ---
const UpdateDesignation: React.FC<UpdateDesignationProps> = ({ isOpen, onClose, designationData }) => {
  const dispatch = useDispatch<AppDispatch>();

  // Get departments from the Redux store
  const { items: departments, status: departmentStatus } = useSelector((state: RootState) => state.departments);

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [department, setDepartment] = useState('');

  // Effect to fetch departments if they are not already loaded
  useEffect(() => {
    if (isOpen && departmentStatus === 'idle') {
      dispatch(fetchDepartments());
    }
  }, [isOpen, departmentStatus, dispatch]);

  // Effect to populate the form when designationData is available
  useEffect(() => {
    if (designationData) {
      setName(designationData.name || '');
      setCode(designationData.code || '');
      setDescription(designationData.description || '');
      setDepartment(designationData.department || '');
    }
  }, [designationData]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !department || !designationData) {
      alert('Designation Name and Department are required.');
      return;
    }
    
    const updatedData: Designation = { 
        ...designationData, 
        name, 
        code, 
        description,
        department
    };
    
    dispatch(updateDesignation(updatedData));
    onClose();
  };

  // Filter for only active departments to show in the dropdown
  const activeDepartments = departments.filter(dep => dep.status === 'active');

  return (
    <SidePanelForm
      isOpen={isOpen}
      onClose={onClose}
      title="Update Designation"
      onSubmit={handleFormSubmit}
      submitText="Update"
    >
      <div className="space-y-4">
        <FormInput label="Designation Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <FormInput label="Code" value={code} onChange={(e) => setCode(e.target.value)} />
        <FormTextarea label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        
        {/* Dynamically populated department dropdown */}
        <FormSelect label="Select Department" value={department} onChange={(e) => setDepartment(e.target.value)} required>
            <option value="" disabled>-- Select a department --</option>
            {departmentStatus === 'loading' && <option>Loading...</option>}
            {activeDepartments.map((dep: Department) => (
              <option key={dep.id} value={dep.name}>
                {dep.name}
              </option>
            ))}
        </FormSelect>
      </div>
    </SidePanelForm>
  );
};

export default UpdateDesignation;
