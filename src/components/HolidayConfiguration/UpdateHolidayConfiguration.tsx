import React, { useState, useEffect } from 'react';

// Assuming a generic SidePanelForm component exists at this path
import SidePanelForm from '../../components/common/SidePanelForm'; 

// --- TYPE DEFINITIONS ---
// This interface should match the one used in your main page component
interface HolidayConfiguration {
  id: string;
  groupName: string;
  code: string;
  description: string;
}

// --- PROPS DEFINITION ---
interface UpdateHolidayConfigurationProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedConfig: HolidayConfiguration) => void;
  configData: HolidayConfiguration | null; // The data of the item being edited
}

// --- MAIN COMPONENT ---
const UpdateHolidayConfiguration: React.FC<UpdateHolidayConfigurationProps> = ({ isOpen, onClose, onUpdate, configData }) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');

  // Effect to populate the form when the component receives new data
  useEffect(() => {
    if (configData) {
      setName(configData.groupName);
      setCode(configData.code);
      setDescription(configData.description);
    }
  }, [configData]);

  // Handles the form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !configData) {
      alert('Name is required.');
      return;
    }
    // Pass the updated data up to the parent component
    onUpdate({ 
      ...configData, 
      groupName: name, 
      code, 
      description 
    });
    onClose(); // Close the panel after submission
  };

  return (
    <SidePanelForm
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Holiday Group"
      onSubmit={handleSubmit}
      submitText="Update" // Change button text for clarity
    >
      <div className="space-y-4">
        {/* Name Input */}
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
        
        {/* Code Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
          <input 
            type="text" 
            value={code} 
            onChange={(e) => setCode(e.target.value)} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500" 
          />
        </div>
        
        {/* Description Textarea */}
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

export default UpdateHolidayConfiguration;
