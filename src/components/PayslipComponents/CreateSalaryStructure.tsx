import React, { useState, useEffect } from 'react';
import SidePanelForm from '../../components/common/SidePanelForm'; 
import toast from 'react-hot-toast';

interface NewSalaryStructureData {
  groupName: string;
  code: string;
  description: string;
}

interface CreateSalaryStructureProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NewSalaryStructureData) => void;
}

const CreateSalaryStructure: React.FC<CreateSalaryStructureProps> = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');

 const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (!name.trim()) {
    toast.error('Name is required.');
    return;
  }
  onSubmit({ groupName: name, code, description });
  toast.success('Group created successfully!');
};

  useEffect(() => {
    if (!isOpen) {
      setName('');
      setCode('');
      setDescription('');
    }
  }, [isOpen]);

  return (
    <SidePanelForm
      isOpen={isOpen}
      onClose={onClose}
      title="Create Salary Structure Group"
      onSubmit={handleSubmit}
      submitText="Submit"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            placeholder='eg: Employee'
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
            placeholder='eg: 1001'
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
           placeholder='this is description'
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

export default CreateSalaryStructure;
