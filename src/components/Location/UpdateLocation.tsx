// import React, { useState, useEffect, useMemo } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { toast } from 'react-hot-toast';
// import { z } from 'zod'; // 1. Import zod

// // --- Component & Redux Imports ---
// import SidePanelForm from '../common/SidePanelForm';
// import { updateLocation, type Location } from '../../store/slice/locationSlice';
// import type { AppDispatch, RootState } from '../../store/store';

// // --- Zod Validation Schema ---
// // 2. Define the validation rules for the form
// const locationSchema = z.object({
//   city: z.string()
//     .min(1, { message: "City name is required." })
//     .regex(/^[a-zA-Z\s]+$/, { message: "Only letters and spaces are allowed." }),
//   code: z.string()
//     .max(6, { message: "Code must be exactly 6 digits." })
//     .regex(/^\d+$/, { message: "Code can only contain numbers." }),
//   state: z.string().min(1, { message: "Please select a state." }),
// });

// // Infer the form data type from the schema for type safety
// type FormData = z.infer<typeof locationSchema>;

// // --- PROPS DEFINITION ---
// interface UpdateLocationProps {
//   isOpen: boolean;
//   onClose: () => void;
//   locationData: Location | null; 
// }

// // --- Reusable Sub-Components ---
// const FormInput: React.FC<{
//     label: string; name: keyof FormData; value: string; placeholder: string;
//     onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//     error?: string;
//     maxLength?: number;
// }> = ({ label, name, value, placeholder, onChange, error, maxLength }) => (
//     <div>
//         <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
//         <input 
//             type="text" 
//             id={name}
//             name={name}
//             value={value} 
//             placeholder={placeholder} 
//             onChange={onChange} 
//             maxLength={maxLength}
//             className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 ${error ? 'border-red-500' : 'border-gray-300'}`}
//         />
//         {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
//     </div>
// );

// const FormSelect: React.FC<{
//   label: string; name: keyof FormData; value: string;
//   onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
//   children: React.ReactNode;
//   error?: string;
// }> = ({ label, name, value, onChange, children, error }) => (
//     <div>
//         <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
//         <select 
//             id={name}
//             name={name}
//             value={value} 
//             onChange={onChange} 
//             className={`w-full px-3 py-2 border rounded-md shadow-sm bg-white ${error ? 'border-red-500' : 'border-gray-300'}`}
//         >
//             {children}
//         </select>
//          {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
//     </div>
// );

// // --- MAIN COMPONENT ---
// const UpdateLocation: React.FC<UpdateLocationProps> = ({ isOpen, onClose, locationData }) => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { status } = useSelector((state: RootState) => state.locations);

//   // 3. Manage form data and errors in state
//   const [formData, setFormData] = useState<FormData>({ city: '', code: '', state: '' });
//   const [errors, setErrors] = useState<z.ZodFormattedError<FormData> | null>(null);

//   // Effect to populate the form when the locationData prop changes
//   useEffect(() => {
//     if (locationData) {
//       setFormData({
//         city: locationData.city,
//         code: locationData.code,
//         state: locationData.state,
//       });
//     }
//   }, [locationData]);

//   // 4. Effect for REAL-TIME validation as the user types
//   useEffect(() => {
//     const result = locationSchema.safeParse(formData);
//     if (!result.success) {
//       setErrors(result.error.format());
//     } else {
//       setErrors(null);
//     }
//   }, [formData]);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//       const { name, value } = e.target;
//       setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleFormSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!locationData) return;

//     // Final validation check on submit
//     const validationResult = locationSchema.safeParse(formData);
//     if (!validationResult.success) {
//       setErrors(validationResult.error.format());
//       toast.error('Please correct the errors before submitting.');
//       return;
//     }

//     const updatedLocation: Location = {
//       ...locationData,
//       ...validationResult.data,
//     };

//     try {
//       await dispatch(updateLocation(updatedLocation)).unwrap();
//       toast.success('Location updated successfully!');
//       onClose();
//     } catch (error: any) {
//       toast.error(error || 'Failed to update location.');
//     }
//   };

//   return (
//     <SidePanelForm
//       isOpen={isOpen}
//       onClose={onClose}
//       title="Update Location"
//       onSubmit={handleFormSubmit}
//       submitText="Update"
//       isSubmitting={status === 'loading'}
//     >
//       <div className="space-y-4">
//         <FormInput 
//             label="City/place" 
//             name="city"
//             placeholder='eg: Varanasi' 
//             value={formData.city} 
//             onChange={handleInputChange}
//             error={errors?.city?._errors[0]}
//         />
//         <FormInput 
//             label="Code" 
//             name="code"
//             value={formData.code} 
//             placeholder="e.g., 201301" 
//             onChange={handleInputChange} 
//             error={errors?.code?._errors[0]}
//             maxLength={6}
//         />
//         <FormSelect 
//             label="State" 
//             name="state"
//             value={formData.state} 
//             onChange={handleInputChange}
//             error={errors?.state?._errors[0]}
//         >
//              <option>Andhra Pradesh</option>
//             <option>Arunachal Pradesh</option>
//             <option>Assam</option>
//             <option>Bihar</option>
//             <option>Chhattisgarh</option>
//             <option>Goa</option>
//             <option>Gujarat</option>
//             <option>Haryana</option>
//             <option>Himachal Pradesh</option>
//             <option>Jharkhand</option>
//             <option>Karnataka</option>
//             <option>Kerala</option>
//             <option>Madhya Pradesh</option>
//             <option>Maharashtra</option>
//             <option>Manipur</option>
//             <option>Meghalaya</option>
//             <option>Mizoram</option>
//             <option>Nagaland</option>
//             <option>Odisha</option>
//             <option>Punjab</option>
//             <option>Rajasthan</option>
//             <option>Sikkim</option>
//             <option>Tamil Nadu</option>
//             <option>Telangana</option>
//             <option>Tripura</option>
//             <option>Uttar Pradesh</option>
//             <option>Uttarakhand</option>
//             <option>West Bengal</option>
//         </FormSelect>
//       </div>
//     </SidePanelForm>
//   );
// };

// export default UpdateLocation;


import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast, Toaster } from 'react-hot-toast';
import { z } from 'zod';

// --- Component & Redux Imports ---
import SidePanelForm from '../common/SidePanelForm';
import { updateLocation, type Location } from '../../store/slice/locationSlice';
import type { AppDispatch, RootState } from '../../store/store';

// --- Zod Validation Schema ---
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

type FormData = z.infer<typeof locationSchema>;

// --- PROPS DEFINITION ---
interface UpdateLocationProps {
  isOpen: boolean;
  onClose: () => void;
  locationData: Location | null; 
}

// (FormInput and FormSelect components remain the same)
const FormInput: React.FC<{
  label: string; name: keyof FormData; value: string; placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  maxLength?: number;
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
      maxLength={maxLength}
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
const UpdateLocation: React.FC<UpdateLocationProps> = ({ isOpen, onClose, locationData }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { status } = useSelector((state: RootState) => state.locations);

  const [formData, setFormData] = useState<FormData>({ city: '', code: '', state: '' });
  const [errors, setErrors] = useState<z.ZodFormattedError<FormData> | null>(null);

  // Prefill form
  useEffect(() => {
    if (locationData) {
      setFormData({
        city: locationData.city,
        code: locationData.code,
        state: locationData.state,
      });
      setErrors(null); // Clear previous errors when new data comes in
    }
  }, [locationData]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationData) return;

    // Final validation
    const validationResult = locationSchema.safeParse(formData);
    if (!validationResult.success) {
      setErrors(validationResult.error.format());
      toast.error('Please correct the errors before submitting.');
      return;
    }

    // Find only the fields that have actually changed
    const changedFields = Object.keys(validationResult.data).reduce((acc, key) => {
      const typedKey = key as keyof FormData;
      if (validationResult.data[typedKey] !== locationData[typedKey]) {
        (acc as any)[typedKey] = validationResult.data[typedKey];
      }
      return acc;
    }, {} as Partial<FormData>);

    if (Object.keys(changedFields).length === 0) {
      toast.success('No changes were made.');
      onClose(); // Close the panel as there's nothing to update
      return;
    }

    try {
      // ✅ --- MODIFIED DISPATCH PAYLOAD ---
      // We now send the ID plus the object containing only the changed fields.
      const updatePayload = {
          id: locationData.id,
          ...changedFields
      };

      await dispatch(updateLocation(updatePayload)).unwrap();
      
      toast.success('Location updated successfully!');
      onClose();
    } catch (error: any) {
      toast.error(error || 'Failed to update location.');
    }
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      <SidePanelForm
        isOpen={isOpen}
        onClose={onClose}
        title="Update Location"
        onSubmit={handleFormSubmit}
        submitText="Update"
        isSubmitting={status === 'loading'}
      >
        <div className="space-y-4">
          <FormInput 
            label="City/place" 
            name="city"
            placeholder="e.g., Varanasi" 
            value={formData.city} 
            onChange={handleInputChange}
            error={errors?.city?._errors[0]}
          />
          <FormInput 
            label="Code" 
            name="code"
            value={formData.code} 
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
            <option value="">-- Select State --</option>
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
    </>
  );
};

export default UpdateLocation;