import React, { useState } from 'react';
import SidePanelForm from '../common/SidePanelForm'; // Use the new side panel component

// --- PROPS DEFINITION ---
interface CreateDepartmentProps {
  isOpen: boolean;
  onClose: () => void;
  // onSubmit: (data: { departmentName: string; code: string; description: string }) => void;
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
const CreateDepartment: React.FC<CreateDepartmentProps> = ({ isOpen, onClose }) => {
  const [departmentName, setDepartmentName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!departmentName.trim()) {
      alert('Department Name is required.');
      return;
    }
    const formData = { departmentName, code, description };
    console.log('Submitting Department Data:', formData);
    onClose();
  };

  return (
    <SidePanelForm
      isOpen={isOpen}
      onClose={onClose}
      title="Create Department"
      onSubmit={handleFormSubmit}
    >
      <div className="space-y-4">
        <FormInput label="Department Name" value={departmentName} onChange={(e) => setDepartmentName(e.target.value)} required />
        <FormInput label="Code" value={code} onChange={(e) => setCode(e.target.value)} />
        <FormInput label="Description" value={description} onChange={(e) => setDescription(e.target.value)} isTextarea />
      </div>
    </SidePanelForm>
  );
};

export default CreateDepartment;
