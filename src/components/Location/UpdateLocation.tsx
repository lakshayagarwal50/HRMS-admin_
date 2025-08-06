import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import SidePanelForm from '../../components/common/SidePanelForm'; // Adjust path if needed

// --- Redux Imports ---
import { updateLocation, type Location } from '../../store/slice/locationSlice'; // Adjust path
import type { AppDispatch } from '../../store/store'; // Adjust path

// --- PROPS DEFINITION ---
interface UpdateLocationProps {
  isOpen: boolean;
  onClose: () => void;
  locationData: Location | null; // The data of the location to edit
}

// --- REUSABLE FORM FIELD COMPONENTS ---
const FormInput: React.FC<{
  label: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ label, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input type="text" value={value} onChange={onChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500" />
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
const UpdateLocation: React.FC<UpdateLocationProps> = ({ isOpen, onClose, locationData }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [city, setCity] = useState('');
  const [code, setCode] = useState('');
  const [state, setState] = useState('');

  // Effect to populate the form when locationData is available
  useEffect(() => {
    if (locationData) {
      setCity(locationData.city);
      setCode(locationData.code);
      setState(locationData.state);
    }
  }, [locationData]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationData) return;

    if (!city.trim() || !state.trim()) {
      alert('City and State are required.');
      return;
    }
    
    const updatedLocation: Location = { 
        ...locationData, 
        city, 
        code, 
        state 
    };

    dispatch(updateLocation(updatedLocation));
    onClose();
  };

  return (
    <SidePanelForm
      isOpen={isOpen}
      onClose={onClose}
      title="Update Location"
      onSubmit={handleFormSubmit}
      submitText="Update"
    >
      <div className="space-y-4">
        <FormInput label="City/place" value={city} onChange={(e) => setCity(e.target.value)} />
        <FormInput label="Code" value={code} onChange={(e) => setCode(e.target.value)} />
        <FormSelect label="State" value={state} onChange={(e) => setState(e.target.value)}>
            <option>Uttar Pradesh</option>
            <option>Delhi</option>
            <option>Rajasthan</option>
            <option>Maharashtra</option>
            <option>Karnataka</option>
            <option>Tamil Nadu</option>
            <option>West Bengal</option>
        </FormSelect>
      </div>
    </SidePanelForm>
  );
};

export default UpdateLocation;
