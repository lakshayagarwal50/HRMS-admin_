import React, { useState } from 'react';
import SidePanelForm from '../../components/common/SidePanelForm'; 
import toast from 'react-hot-toast';

interface HolidayConfiguration {
  id: string;
  groupName: string;
  code: string;
  description: string;
}

interface CreateHolidayConfigurationProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newConfig: Omit<HolidayConfiguration, 'id'>) => void;
}

const CreateHolidayConfiguration: React.FC<CreateHolidayConfigurationProps> = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');

 const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  if (!name.trim()) {
    toast.error('Name is required.');
    return;
  }

  onAdd({ groupName: name, code, description });
  toast.success('Group added successfully!');
  onClose();
};


  return (
    <SidePanelForm
      isOpen={isOpen}
      onClose={onClose}
      title="Create Holiday Group"
      onSubmit={handleSubmit}
    >
      <div className="space-y-4">
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input 
            type="text" 
            placeholder='eg: Diwali'
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

export default CreateHolidayConfiguration;
