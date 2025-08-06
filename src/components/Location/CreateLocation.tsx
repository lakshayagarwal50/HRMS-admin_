import React from 'react';
import { useDispatch } from 'react-redux';
import SidePanelForm from '../../components/common/SidePanelForm'; // Adjust path if needed

// --- Redux Imports ---
import { addLocation, type NewLocation } from '../../store/slice/locationSlice'; // Adjust path
import type { AppDispatch } from '../../store/store'; // Adjust path

// --- PROPS DEFINITION ---
interface CreateLocationProps {
  isOpen: boolean;
  onClose: () => void;
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
const CreateLocation: React.FC<CreateLocationProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [city, setCity] = React.useState('');
  const [code, setCode] = React.useState('');
  const [state, setState] = React.useState('Uttar Pradesh'); // Default value

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim() || !state.trim()) {
      alert('City and State are required.');
      return;
    }
    
    const newLocation: NewLocation = { 
        city, 
        code, 
        state,
        status: 'Active' // Default status for new locations
    };

    dispatch(addLocation(newLocation));
    onClose();
  };

  return (
    <SidePanelForm
      isOpen={isOpen}
      onClose={onClose}
      title="Create Location"
      onSubmit={handleFormSubmit}
      submitText="Submit"
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

export default CreateLocation;
