
// import React, { useState, useEffect } from 'react';
// import { useDispatch } from 'react-redux';
// import toast from 'react-hot-toast';
// import SidePanelForm from '../common/SidePanelForm';
// import { addDepartment, type NewDepartment } from '../../store/slice/departmentSlice';
// import type {  AppDispatch } from '../../store/store';


// interface CreateDepartmentProps {
//   isOpen: boolean;
//   onClose: () => void;
// }


// const FormInput: React.FC<{
//   label: string; value: string;
//   onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
//   placeholder?: string; required?: boolean; isTextarea?: boolean;
// }> = ({ label, value, onChange, placeholder, required = false, isTextarea = false }) => (
//   <div>
//     <label className="block text-sm font-medium text-gray-700 mb-1">
//       {label} {required && <span className="text-red-500">*</span>}
//     </label>
//     {isTextarea ? (
//       <textarea value={value} onChange={onChange} placeholder={placeholder} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500" />
//     ) : (
//       <input type="text" value={value} onChange={onChange} placeholder={placeholder} required={required} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500" />
//     )}
//   </div>
// );


// const CreateDepartment: React.FC<CreateDepartmentProps> = ({ isOpen, onClose }) => {
//   const dispatch = useDispatch<AppDispatch>();
  
//   const [name, setName] = useState('');
//   const [code, setCode] = useState('');
//   const [description, setDescription] = useState('');
  
 
//   useEffect(() => {
//       if(!isOpen) {
//           setName('');
//           setCode('');
//           setDescription('');
//       }
//   }, [isOpen]);

//   const handleFormSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!name.trim()) {
//       toast.error('Department Name is required.');
//       return;
//     }

//     const newDepartment: NewDepartment = {
//       name,
//       code,
//       description,
//     };

//     try {
//         await dispatch(addDepartment(newDepartment)).unwrap();
//         toast.success('Department created successfully!');
//         onClose();
//     } catch (error: any) {
//         toast.error(error || 'Failed to create department.');
//     }
//   };

//   return (
//     <SidePanelForm
//       isOpen={isOpen}
//       onClose={onClose}
//       title="Create Department"
//       onSubmit={handleFormSubmit}
      
//     >
//       <div className="space-y-4">
//         <FormInput 
//           label="Department Name" 
//           value={name} 
//           onChange={(e) => setName(e.target.value)} 
//           placeholder="e.g., Human Resources"
//           required 
//         />
//         <FormInput 
//           label="Code" 
//           value={code} 
//           onChange={(e) => setCode(e.target.value)}
//           placeholder="e.g., 800"
//         />
//         <FormInput 
//           label="Description" 
//           value={description} 
//           onChange={(e) => setDescription(e.target.value)} 
//           placeholder="Enter a brief description..."
//           isTextarea 
//         />
//       </div>
//     </SidePanelForm>
//   );
// };

// export default CreateDepartment;

import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { z } from 'zod';

// --- Redux Imports ---
import { addDepartment, type NewDepartment } from '../../store/slice/departmentSlice';
import type { RootState, AppDispatch } from '../../store/store';
import SidePanelForm from '../common/SidePanelForm';

// --- Zod Validation Schema ---
// **IMPROVEMENT**: Updated schema with more specific rules as requested.
const departmentSchema = z.object({
  name: z.string()
    .min(1, { message: "Department Name is required." })
    .max(50, { message: "Name must be 50 characters or less." })
    // Rule: Ensures the name only contains letters (upper/lower) and spaces.
    .regex(/^[a-zA-Z\s]+$/, { message: "Name can only contain letters and spaces." }),

  // Rule: Ensures the code is a string containing only 3 to 6 digits.
  // The `or(z.literal(''))` part makes it an optional field that can be empty.
  code: z.string()
    .regex(/^\d{3,6}$/, { message: "Code must be a number with 3 to 6 digits." })
    .optional()
    .or(z.literal('')),

  description: z.string()
    .max(50, { message: "Description must be 50 characters or less." })
    .optional(),
});

// --- Type Inference from Schema ---
type DepartmentFormData = z.infer<typeof departmentSchema>;
type FormErrors = z.ZodFormattedError<DepartmentFormData> | null;

// --- Reusable Form Input Component with Error Handling ---
// **IMPROVEMENT**: Added `type` prop to allow for different input types like "number".
interface FormInputProps {
  label: string;
  name: keyof DepartmentFormData;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  isTextarea?: boolean;
  error?: string;
  type?: 'text' | 'number';
}

const FormInput: React.FC<FormInputProps> = ({ label, name, value, onChange, placeholder, required = false, isTextarea = false, error, type = 'text' }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {isTextarea ? (
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={4}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 ${error ? 'border-red-500' : 'border-gray-300'}`}
      />
    ) : (
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 ${error ? 'border-red-500' : 'border-gray-300'}`}
      />
    )}
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
);

// --- Main Component ---
interface CreateDepartmentProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateDepartment: React.FC<CreateDepartmentProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { status } = useSelector((state: RootState) => state.departments);

  const initialFormState = useMemo((): DepartmentFormData => ({
    name: '',
    code: '',
    description: '',
  }), []);

  const [formData, setFormData] = useState<DepartmentFormData>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormState);
      setErrors(null);
    }
  }, [isOpen, initialFormState]);

  // Real-time validation
  useEffect(() => {
    // A simple check to avoid validating a completely empty form on load
    const isPristine = Object.values(formData).every(val => val === '');
    if (isPristine) {
      setErrors(null);
      return;
    }
    const result = departmentSchema.safeParse(formData);
    setErrors(result.success ? null : result.error.format());
  }, [formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationResult = departmentSchema.safeParse(formData);
    if (!validationResult.success) {
      setErrors(validationResult.error.format());
      toast.error('Please correct the errors before submitting.');
      return;
    }

    // The data is valid and type-safe
    const newDepartment: NewDepartment = validationResult.data;

    try {
        await dispatch(addDepartment(newDepartment)).unwrap();
        toast.success('Department created successfully!');
        onClose();
    } catch (error: any) {
        toast.error(error || 'Failed to create department.');
    }
  };

  return (
    <SidePanelForm
      isOpen={isOpen}
      onClose={onClose}
      title="Create Department"
      onSubmit={handleFormSubmit}
      submitText="Create"
      isSubmitting={status === 'loading'}
    >
      <div className="space-y-4">
        <FormInput 
          label="Department Name"
          name="name"
          value={formData.name} 
          onChange={handleInputChange} 
          placeholder="e.g., Human Resources"
          required 
          error={errors?.name?._errors[0]}
        />
        <FormInput 
          label="Code"
          name="code"
          type="number" // Use number type for better UX on mobile
          value={formData.code || ''} 
          onChange={handleInputChange}
          placeholder="e.g., 101"
          error={errors?.code?._errors[0]}
        />
        <FormInput 
          label="Description"
          name="description"
          value={formData.description || ''} 
          onChange={handleInputChange} 
          placeholder="Enter a brief description..."
          isTextarea
          error={errors?.description?._errors[0]}
        />
      </div>
    </SidePanelForm>
  );
};

export default CreateDepartment;

