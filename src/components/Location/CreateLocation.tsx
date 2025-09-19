// import React from 'react';
// import { useDispatch } from 'react-redux';
// import SidePanelForm from '../../components/common/SidePanelForm'; 
// import { addLocation, type NewLocation } from '../../store/slice/locationSlice'; 
// import type { AppDispatch } from '../../store/store'; 
// import { toast } from 'react-hot-toast';

// interface CreateLocationProps {
//   isOpen: boolean;
//   onClose: () => void;
// }


// const FormInput: React.FC<{
//   label: string; value: string; placeholder:string;
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
// }> = ({ label, value, onChange ,placeholder}) => (
//   <div>
//     <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
//     <input type="text" value={value} placeholder={placeholder} onChange={onChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
//      />
//   </div>
// );

// const FormSelect: React.FC<{
//   label: string; value: string;
//   onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
//   children: React.ReactNode;
// }> = ({ label, value, onChange, children }) => (
//     <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
//         <select value={value} onChange={onChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 bg-white">
//             {children}
//         </select>
//     </div>
// );


// const CreateLocation: React.FC<CreateLocationProps> = ({ isOpen, onClose }) => {
//   const dispatch = useDispatch<AppDispatch>();
//   const [city, setCity] = React.useState('');
//   const [code, setCode] = React.useState('');
//   const [state, setState] = React.useState('Uttar Pradesh'); 

//   const handleFormSubmit = async (e: React.FormEvent) => {
//   e.preventDefault();

  
//   if (!city.trim() || !state.trim()) {
//     toast.error('City and State are required.');
//     return;
//   }

//   const newLocation: NewLocation = { 
//     city, 
//     code, 
//     state,
//     status: 'Active'
//   };

  
//   try {
//     await dispatch(addLocation(newLocation)).unwrap();
//     toast.success('Location added successfully!');
//     onClose();
//   } catch (error) {
//     toast.error(`Failed to add location.`);
//   }
// };


//   return (
//     <SidePanelForm
//       isOpen={isOpen}
//       onClose={onClose}
//       title="Create Location"
//       onSubmit={handleFormSubmit}
//       submitText="Submit"
//     >
//       <div className="space-y-4">
//         <FormInput label="City/place" placeholder='eg: Varanasi' value={city} onChange={(e) => setCity(e.target.value)} />
//         <FormInput label="Code" value={code} placeholder="2002"onChange={(e) => setCode(e.target.value)} />
//         <FormSelect label="State" value={state} onChange={(e) => setState(e.target.value)}>
//             <option>Andhra Pradesh</option>
// <option>Arunachal Pradesh</option>
// <option>Assam</option>
// <option>Bihar</option>
// <option>Chhattisgarh</option>
// <option>Goa</option>
// <option>Gujarat</option>
// <option>Haryana</option>
// <option>Himachal Pradesh</option>
// <option>Jharkhand</option>
// <option>Karnataka</option>
// <option>Kerala</option>
// <option>Madhya Pradesh</option>
// <option>Maharashtra</option>
// <option>Manipur</option>
// <option>Meghalaya</option>
// <option>Mizoram</option>
// <option>Nagaland</option>
// <option>Odisha</option>
// <option>Punjab</option>
// <option>Rajasthan</option>
// <option>Sikkim</option>
// <option>Tamil Nadu</option>
// <option>Telangana</option>
// <option>Tripura</option>
// <option>Uttar Pradesh</option>
// <option>Uttarakhand</option>
// <option>West Bengal</option>

//         </FormSelect>
//       </div>
//     </SidePanelForm>
//   );
// };

// export default CreateLocation;
import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { z } from 'zod';

// --- Component & Redux Imports ---
import SidePanelForm from '../common/SidePanelForm';
import { addLocation, type NewLocation } from '../../store/slice/locationSlice';
import type { AppDispatch, RootState } from '../../store/store';

// --- Zod Validation Schema ---
// --- THIS IS THE UPDATED PART ---
// The schema for 'code' is now updated to check for a maximum length of 6.
const locationSchema = z.object({
  city: z.string()
    .min(1, { message: "City name is required." })
    .regex(/^[a-zA-Z\s]+$/, { message: "Only letters and spaces are allowed." }),
  code: z.string()
    .max(6, { message: "Code cannot be more than 6 digits." })
    .regex(/^[0-9]*$/, { message: "Code can only contain numbers." }) // Allows empty string or numbers
    .optional(),
  state: z.string().min(1, { message: "Please select a state." }),
});

// Infer the form data type from the schema for type safety
type FormData = z.infer<typeof locationSchema>;

// --- PROPS DEFINITION ---
interface CreateLocationProps {
  isOpen: boolean;
  onClose: () => void;
}

// --- Reusable Sub-Components ---
const FormInput: React.FC<{
    label: string; name: keyof FormData; value: string; placeholder: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    maxLength?: number; // Added maxLength for the input
}> = ({ label, name, value, placeholder, onChange, error, maxLength }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input 
            type="text" 
            id={name}
            name={name}
            value={value} 
            placeholder={placeholder} 
            onChange={onChange} 
            maxLength={maxLength} // Enforce max length on the input itself
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 ${error ? 'border-red-500' : 'border-gray-300'}`}
        />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
);

const FormSelect: React.FC<{
  label: string; name: keyof FormData; value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
  error?: string;
}> = ({ label, name, value, onChange, children, error }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <select 
            id={name}
            name={name}
            value={value} 
            onChange={onChange} 
            className={`w-full px-3 py-2 border rounded-md shadow-sm bg-white ${error ? 'border-red-500' : 'border-gray-300'}`}
        >
            {children}
        </select>
         {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
);

// --- MAIN COMPONENT ---
const CreateLocation: React.FC<CreateLocationProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { status } = useSelector((state: RootState) => state.locations);

  const initialFormState = useMemo((): FormData => ({
    city: '',
    code: '',
    state: 'Uttar Pradesh',
  }), []);

  const [formData, setFormData] = useState<FormData>(initialFormState);
  const [errors, setErrors] = useState<z.ZodFormattedError<FormData> | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setFormData(initialFormState);
      setErrors(null);
    }
  }, [isOpen, initialFormState]);

  // Real-time validation
  useEffect(() => {
    if (formData.city === '' && formData.code === '') {
        setErrors(null);
        return;
    }
    const result = locationSchema.safeParse(formData);
    if (!result.success) {
      setErrors(result.error.format());
    } else {
      setErrors(null);
    }
  }, [formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      
      // --- THIS IS THE UPDATED PART ---
      // This logic now prevents the user from typing more than 6 digits for the code.
      if (name === 'code') {
          const numericValue = value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
          if (numericValue.length <= 6) {
              setFormData(prev => ({ ...prev, [name]: numericValue }));
          }
      } else {
          setFormData(prev => ({ ...prev, [name]: value }));
      }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationResult = locationSchema.safeParse(formData);

    if (!validationResult.success) {
      setErrors(validationResult.error.format());
      toast.error('Please correct the errors before submitting.');
      return;
    }

    const newLocation: NewLocation = { 
      ...validationResult.data,
      status: 'Active'
    };

    try {
      await dispatch(addLocation(newLocation)).unwrap();
      toast.success('Location added successfully!');
      onClose();
    } catch (error: any) {
      toast.error(error || 'Failed to add location.');
    }
  };


  return (
    <SidePanelForm
      isOpen={isOpen}
      onClose={onClose}
      title="Create Location"
      onSubmit={handleFormSubmit}
      submitText="Submit"
      isSubmitting={status === 'loading'}
    >
      <div className="space-y-4">
        <FormInput 
            label="City/place" 
            name="city"
            placeholder='eg: Varanasi' 
            value={formData.city} 
            onChange={handleInputChange}
            error={errors?.city?._errors[0]}
        />
        <FormInput 
            label="Code" 
            name="code"
            value={formData.code || ''} 
            placeholder="e.g., 201301" 
            onChange={handleInputChange} 
            error={errors?.code?._errors[0]}
            maxLength={6}
        />
        <FormSelect 
            label="State" 
            name="state"
            value={formData.state} 
            onChange={handleInputChange}
            error={errors?.state?._errors[0]}
        >
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

