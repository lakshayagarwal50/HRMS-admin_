import React, { useState, useEffect } from 'react';
import SidePanelForm from '../../components/common/SidePanelForm'; // Adjust path if needed

// --- TYPE DEFINITIONS ---
// This should match the type in your main page component
interface SalaryStructure {
  id: string;
  groupName: string;
  code: string;
  description: string;
  salaryComponents: string;
}

interface UpdateSalaryStructureProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<SalaryStructure, 'id' | 'salaryComponents'>) => void;
  structureData: SalaryStructure | null;
}

// --- MAIN COMPONENT ---
const UpdateSalaryStructure: React.FC<UpdateSalaryStructureProps> = ({ isOpen, onClose, onSubmit, structureData }) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');

  // Populate form with existing data when the panel opens
  useEffect(() => {
    if (isOpen && structureData) {
      setName(structureData.groupName);
      setCode(structureData.code);
      setDescription(structureData.description);
    }
  }, [isOpen, structureData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Name is required.');
      return;
    }
    onSubmit({ groupName: name, code, description });
  };

  return (
    <SidePanelForm
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Salary Structure Group"
      onSubmit={handleSubmit}
      submitText="Update"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
      </div>
    </SidePanelForm>
  );
};

export default UpdateSalaryStructure;
