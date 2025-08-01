import React, { useState, useEffect } from 'react';
import SidePanelForm from "../common/SidePanelForm"; // Assuming this is in the same directory

// --- TYPE DEFINITION ---
// This should match the type used in your DepartmentPage
interface Department {
  id: number;
  name: string;
  code: string;
  status: 'Active' | 'Inactive';
}

// --- PROPS DEFINITION ---
interface UpdateDepartmentProps {
  isOpen: boolean;
  onClose: () => void;
  departmentData: Department | null; // The data of the department to edit
  // onSubmit: (data: Department) => void;
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
  const [departmentName, setDepartmentName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState(''); // Assuming description is part of the model

  // Effect to populate the form when departmentData is available
  useEffect(() => {
    if (departmentData) {
      setDepartmentName(departmentData.name);
      setCode(departmentData.code);
      // You can add description if it's part of your Department type
      // setDescription(departmentData.description || ''); 
    }
  }, [departmentData]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!departmentName.trim()) {
      alert('Department Name is required.');
      return;
    }
    const updatedData = { 
        ...departmentData!, 
        name: departmentName, 
        code, 
        // description 
    };
    console.log('Updating Department Data:', updatedData);
    onClose();
  };

  return (
    <SidePanelForm
      isOpen={isOpen}
      onClose={onClose}
      title="Update Department"
      onSubmit={handleFormSubmit}
      submitText="Update" // Change button text
    >
      <div className="space-y-4">
        <FormInput label="Department Name" value={departmentName} onChange={(e) => setDepartmentName(e.target.value)} required />
        <FormInput label="Code" value={code} onChange={(e) => setCode(e.target.value)} />
        <FormInput label="Description" value={description} onChange={(e) => setDescription(e.target.value)} isTextarea />
      </div>
    </SidePanelForm>
  );
};

export default UpdateDepartment;
