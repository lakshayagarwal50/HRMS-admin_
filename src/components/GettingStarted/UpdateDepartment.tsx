// src/components/GettingStarted/UpdateDepartment.tsx

import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import SidePanelForm from "../common/SidePanelForm";
import type { AppDispatch } from '../../store/store';
import { updateDepartment, type Department } from '../../store/slice/departmentSlice';


// --- PROPS DEFINITION ---
interface UpdateDepartmentProps {
  isOpen: boolean;
  onClose: () => void;
  departmentData: Department | null;
}

// --- REUSABLE INPUT COMPONENT ---
const FormInput: React.FC<{
  label: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string; required?: boolean; isTextarea?: boolean;
}> = ({ label, value, onChange, placeholder, required = false, isTextarea = false }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {isTextarea ? (
      <textarea value={value} onChange={onChange} placeholder={placeholder} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500" />
    ) : (
      <input type="text" value={value} onChange={onChange} placeholder={placeholder} required={required} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500" />
    )}
  </div>
);

// --- MAIN COMPONENT ---
const UpdateDepartment: React.FC<UpdateDepartmentProps> = ({ isOpen, onClose, departmentData }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');

  // Effect to populate the form when departmentData is available
  useEffect(() => {
    if (departmentData) {
      setName(departmentData.name);
      setCode(departmentData.code);
      setDescription(departmentData.description);
      setStatus(departmentData.status);
    }
  }, [departmentData]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !departmentData) {
      alert('Department Name is required.');
      return;
    }
    
    // Construct the updated department object, preserving non-editable fields
    const updatedData: Department = { 
        ...departmentData, // Preserves id, createdBy, createdAt
        name: name, 
        code: code, 
        description: description,
        status: status,
    };
    
    dispatch(updateDepartment(updatedData));
    onClose();
  };

  return (
    <SidePanelForm
      isOpen={isOpen}
      onClose={onClose}
      title="Update Department"
      onSubmit={handleFormSubmit}
      submitText="Update"
    >
      <div className="space-y-4">
        <FormInput label="Department Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <FormInput label="Code" value={code} onChange={(e) => setCode(e.target.value)} />
        <FormInput label="Description" value={description} onChange={(e) => setDescription(e.target.value)} isTextarea />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
    </SidePanelForm>
  );
};

export default UpdateDepartment;