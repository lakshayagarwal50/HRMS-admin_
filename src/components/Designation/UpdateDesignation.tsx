import React, { useState, useEffect } from 'react';
import SidePanelForm from '../common/SidePanelForm';
 // Adjust path if needed

// --- TYPE DEFINITION ---
// This should match the type used in your DesignationPage
interface Designation {
  id: number;
  name: string;
  code: string;
  description: string;
  department: string;
  status: 'Active' | 'Inactive';
}

// --- PROPS DEFINITION ---
interface UpdateDesignationProps {
  isOpen: boolean;
  onClose: () => void;
  designationData: Designation | null; // The data of the designation to edit
  // onSubmit: (data: Designation) => void;
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
const UpdateDesignation: React.FC<UpdateDesignationProps> = ({ isOpen, onClose, designationData }) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [department, setDepartment] = useState('');

  // Effect to populate the form when designationData is available
  useEffect(() => {
    if (designationData) {
      setName(designationData.name);
      setCode(designationData.code);
      setDescription(designationData.description);
      setDepartment(designationData.department);
    }
  }, [designationData]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Designation Name is required.');
      return;
    }
    const updatedData = { 
        ...designationData!, 
        name, 
        code, 
        description,
        department
    };
    console.log('Updating Designation Data:', updatedData);
    onClose();
  };

  return (
    <SidePanelForm
      isOpen={isOpen}
      onClose={onClose}
      title="Update Designation"
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

export default UpdateDesignation;
