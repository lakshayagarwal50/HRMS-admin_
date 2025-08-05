import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SidePanelForm from '../common/SidePanelForm';

// --- Redux Imports ---
import { addDesignation, type NewDesignation } from '../../store/slice/designationSlice';
import { fetchDepartments } from '../../store/slice/departmentSlice'; // Import action to fetch departments
import type { RootState, AppDispatch } from "../../store/store";

// --- PROPS DEFINITION ---
interface CreateDesignationProps {
  isOpen: boolean;
  onClose: () => void;
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
}> = ({ label, value, onChange, children }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <select value={value} onChange={onChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 bg-white">
            {children}
        </select>
    </div>
);


// --- MAIN COMPONENT ---
const CreateDesignation: React.FC<CreateDesignationProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();

  // 1. Get departments and their loading status from the Redux store
  const { items: departments, status: departmentStatus } = useSelector((state: RootState) => state.departments);

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [department, setDepartment] = useState('');

  // 2. Fetch departments if they haven't been loaded yet
  useEffect(() => {
    if (departmentStatus === 'idle') {
      dispatch(fetchDepartments());
    }
  }, [departmentStatus, dispatch]);

  // 3. Set the default selected department once the list is loaded
  useEffect(() => {
    if (departments.length > 0 && !department) {
      setDepartment(departments[0].name);
    }
  }, [departments, department]);


  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Designation Name is required.');
      return;
    }
    if (!department) {
        alert('Please select a department.');
        return;
    }

    const newDesignation: NewDesignation = {
      name: name,
      code: code,
      description: description,
      department: department,
      status: 'active',
    };

    dispatch(addDesignation(newDesignation));
    onClose();
  };

  return (
    <SidePanelForm
      isOpen={isOpen}
      onClose={onClose}
      title="Create Designation"
      onSubmit={handleFormSubmit}
      submitText="Submit"
    >
      <div className="space-y-4">
        <FormInput label="Designation Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <FormInput label="Code" value={code} onChange={(e) => setCode(e.target.value)} />
        <FormTextarea label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        
        {/* 4. The select dropdown is now populated dynamically */}
        <FormSelect label="Select Department" value={department} onChange={(e) => setDepartment(e.target.value)}>
            {departmentStatus === 'loading' && <option disabled>Loading departments...</option>}
            {departments.map(dep => (
              <option key={dep.id} value={dep.name}>{dep.name}</option>
            ))}
        </FormSelect>
      </div>
    </SidePanelForm>
  );
};

export default CreateDesignation;
