import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast'; // 1. Import toast

// --- Component & Redux Imports ---
import SidePanelForm from '../common/SidePanelForm';
import { updateDesignation, type Designation } from '../../store/slice/designationSlice';
import { fetchDepartments } from '../../store/slice/departmentSlice';
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

  const { items: departments, status: departmentStatus } = useSelector((state: RootState) => state.departments);

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [department, setDepartment] = useState('');

  useEffect(() => {
    if (isOpen && departmentStatus === 'idle') {
      dispatch(fetchDepartments());
    }
  }, [isOpen, departmentStatus, dispatch]);

  useEffect(() => {
    if (designationData) {
      setName(designationData.name || '');
      setCode(designationData.code || '');
      setDescription(designationData.description || '');
      setDepartment(designationData.department || '');
    }
  }, [designationData]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !department || !designationData) {
      toast.error('Designation Name and Department are required.');
      return;
    }
    
    const updatedData: Designation = { 
        ...designationData, 
        name, 
        code, 
        description,
        department
    };
    
    // 2. Use async/await and try/catch for toast notifications
    try {
        await dispatch(updateDesignation(updatedData)).unwrap();
        toast.success('Designation updated successfully!');
        onClose();
    } catch (error: any) {
        toast.error(error || 'Failed to update designation.');
    }
  };

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
        
        <FormSelect label="Select Department" value={department} onChange={(e) => setDepartment(e.target.value)} required>
            <option value="" disabled>-- Select a department --</option>
            {departmentStatus === 'loading' && <option>Loading...</option>}
            {departments.map((dep) => (
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
