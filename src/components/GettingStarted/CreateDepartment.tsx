
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import SidePanelForm from '../common/SidePanelForm';
import { addDepartment, type NewDepartment } from '../../store/slice/departmentSlice';
import type {  AppDispatch } from '../../store/store';


interface CreateDepartmentProps {
  isOpen: boolean;
  onClose: () => void;
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


const CreateDepartment: React.FC<CreateDepartmentProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  
  // Clear form when the panel is closed
  useEffect(() => {
      if(!isOpen) {
          setName('');
          setCode('');
          setDescription('');
      }
  }, [isOpen]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Department Name is required.');
      return;
    }

    const newDepartment: NewDepartment = {
      name,
      code,
      description,
    };

    try {
        await dispatch(addDepartment(newDepartment)).unwrap();
        toast.success('Department created successfully!');
        onClose();
    } catch (error: any) {
        toast.error(error || 'Failed to create department.');
    }
  };

  return (
    <SidePanelForm
      isOpen={isOpen}
      onClose={onClose}
      title="Create Department"
      onSubmit={handleFormSubmit}
      // The isSubmitting prop has been removed to match your SidePanelForm
    >
      <div className="space-y-4">
        <FormInput 
          label="Department Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="e.g., Human Resources"
          required 
        />
        <FormInput 
          label="Code" 
          value={code} 
          onChange={(e) => setCode(e.target.value)}
          placeholder="e.g., 800"
        />
        <FormInput 
          label="Description" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          placeholder="Enter a brief description..."
          isTextarea 
        />
      </div>
    </SidePanelForm>
  );
};

export default CreateDepartment;

