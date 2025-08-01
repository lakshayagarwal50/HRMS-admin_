import React, { useState } from 'react';
import SidePanelForm from '../common/SidePanelForm';

// Assuming a generic SidePanelForm component exists
 

// --- PROPS DEFINITION ---
interface CreateDesignationProps {
  isOpen: boolean;
  onClose: () => void;
  // onSubmit: (data: { name: string; code: string; description: string; department: string }) => void;
}

// --- REUSABLE FORM FIELD COMPONENTS ---
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
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [department, setDepartment] = useState('Project management');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Designation Name is required.');
      return;
    }
    const formData = { name, code, description, department };
    console.log('Submitting Designation:', formData);
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
        <FormSelect label="Select Department" value={department} onChange={(e) => setDepartment(e.target.value)}>
            <option>Project management</option>
            <option>Marketing</option>
            <option>Support team</option>
            <option>Management</option>
        </FormSelect>
      </div>
    </SidePanelForm>
  );
};

export default CreateDesignation;
