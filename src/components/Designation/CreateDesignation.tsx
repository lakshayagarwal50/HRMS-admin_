import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast'; // 1. Import the toast library

// --- Component & Redux Imports ---
import SidePanelForm from '../common/SidePanelForm';
import { addDesignation, type NewDesignation } from '../../store/slice/designationSlice';
import { fetchDepartments } from '../../store/slice/departmentSlice';
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
const CreateDesignation: React.FC<CreateDesignationProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: departments, status: departmentStatus } = useSelector((state: RootState) => state.departments);

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [department, setDepartment] = useState('');

  useEffect(() => {
    if (departmentStatus === 'idle') {
      dispatch(fetchDepartments());
    }
  }, [departmentStatus, dispatch]);

  useEffect(() => {
    if (departments.length > 0 && !department) {
      setDepartment(departments[0].name);
    }
  }, [departments, department]);
  
  useEffect(() => {
      if (!isOpen) {
          setName('');
          setCode('');
          setDescription('');
          setDepartment(departments[0]?.name || '');
      }
  }, [isOpen, departments]);


  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Designation Name is required.');
      return;
    }
    if (!department) {
        toast.error('Please select a department.');
        return;
    }

    const newDesignation: NewDesignation = {
      name,
      code,
      description,
      department,
      status: 'active',
    };

    // 2. Use async/await and try/catch to handle the API result and show toasts
    try {
        await dispatch(addDesignation(newDesignation)).unwrap();
        toast.success('Designation created successfully!');
        onClose();
    } catch (error: any) {
        // Display the error message from the slice
        toast.error(error || 'Failed to create designation.');
    }
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
        
        <FormSelect label="Select Department" value={department} onChange={(e) => setDepartment(e.target.value)} required>
            {departmentStatus === 'loading' && <option disabled>Loading departments...</option>}
            <option value="" disabled>Select a department</option>
            {departments.map(dep => (
              <option key={dep.id} value={dep.name}>{dep.name}</option>
            ))}
        </FormSelect>
      </div>
    </SidePanelForm>
  );
};

export default CreateDesignation;

