import React from 'react';
import { useDispatch } from 'react-redux';
import SidePanelForm from '../../components/common/SidePanelForm'; 
import { addLocation, type NewLocation } from '../../store/slice/locationSlice'; 
import type { AppDispatch } from '../../store/store'; 
import { toast } from 'react-hot-toast';

interface CreateLocationProps {
  isOpen: boolean;
  onClose: () => void;
}


const FormInput: React.FC<{
  label: string; value: string; placeholder:string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ label, value, onChange ,placeholder}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input type="text" value={value} placeholder={placeholder} onChange={onChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
     />
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


const CreateLocation: React.FC<CreateLocationProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [city, setCity] = React.useState('');
  const [code, setCode] = React.useState('');
  const [state, setState] = React.useState('Uttar Pradesh'); 

  const handleFormSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  
  if (!city.trim() || !state.trim()) {
    toast.error('City and State are required.');
    return;
  }

  const newLocation: NewLocation = { 
    city, 
    code, 
    state,
    status: 'Active'
  };

  
  try {
    await dispatch(addLocation(newLocation)).unwrap();
    toast.success('Location added successfully!');
    onClose();
  } catch (error) {
    toast.error(`Failed to add location.`);
  }
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
        <FormInput label="City/place" placeholder='eg: Varanasi' value={city} onChange={(e) => setCity(e.target.value)} />
        <FormInput label="Code" value={code} placeholder="2002"onChange={(e) => setCode(e.target.value)} />
        <FormSelect label="State" value={state} onChange={(e) => setState(e.target.value)}>
            <option>Andhra Pradesh</option>
<option>Arunachal Pradesh</option>
<option>Assam</option>
<option>Bihar</option>
<option>Chhattisgarh</option>
<option>Goa</option>
<option>Gujarat</option>
<option>Haryana</option>
<option>Himachal Pradesh</option>
<option>Jharkhand</option>
<option>Karnataka</option>
<option>Kerala</option>
<option>Madhya Pradesh</option>
<option>Maharashtra</option>
<option>Manipur</option>
<option>Meghalaya</option>
<option>Mizoram</option>
<option>Nagaland</option>
<option>Odisha</option>
<option>Punjab</option>
<option>Rajasthan</option>
<option>Sikkim</option>
<option>Tamil Nadu</option>
<option>Telangana</option>
<option>Tripura</option>
<option>Uttar Pradesh</option>
<option>Uttarakhand</option>
<option>West Bengal</option>

        </FormSelect>
      </div>
    </SidePanelForm>
  );
};

export default CreateLocation;
