
// import React, { useState, useEffect } from 'react';
// import { useDispatch } from 'react-redux';
// import SidePanelForm from "../common/SidePanelForm";
// import type { AppDispatch } from '../../store/store';
// import { updateDepartment, type Department } from '../../store/slice/departmentSlice';
// import toast from 'react-hot-toast';



// interface UpdateDepartmentProps {
//   isOpen: boolean;
//   onClose: () => void;
//   departmentData: Department | null;
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


// const UpdateDepartment: React.FC<UpdateDepartmentProps> = ({ isOpen, onClose, departmentData }) => {
//   const dispatch = useDispatch<AppDispatch>();
//   const [name, setName] = useState('');
//   const [code, setCode] = useState('');
//   const [description, setDescription] = useState('');
//   const [status, setStatus] = useState<'active' | 'inactive'>('active');


//   useEffect(() => {
//     if (departmentData) {
//       setName(departmentData.name);
//       setCode(departmentData.code);
//       setDescription(departmentData.description);
//       setStatus(departmentData.status);
//     }
//   }, [departmentData]);

//   const handleFormSubmit = async (e: React.FormEvent) => {
//   e.preventDefault();

//   if (!name.trim() || !departmentData) {
//     toast.error('Department Name is required.');
//     return;
//   }

//   const updatedData: Department = {
//     ...departmentData,
//     name,
//     code,
//     description,
//     status,
//   };

//   try {
//     await dispatch(updateDepartment(updatedData)).unwrap();
//     toast.success('Department updated successfully!');
//     onClose();
//   } catch (error) {
//     toast.error('Failed to update department.');
//   }
// };

//   return (
//     <SidePanelForm
//       isOpen={isOpen}
//       onClose={onClose}
//       title="Update Department"
//       onSubmit={handleFormSubmit}
//       submitText="Update"
//     >
//       <div className="space-y-4">
//         <FormInput label="Department Name" value={name} onChange={(e) => setName(e.target.value)} required />
//         <FormInput label="Code" value={code} onChange={(e) => setCode(e.target.value)} />
//         <FormInput label="Description" value={description} onChange={(e) => setDescription(e.target.value)} isTextarea />
        
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//           <select
//             value={status}
//             onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
//           >
//             <option value="active">Active</option>
//             <option value="inactive">Inactive</option>
//           </select>
//         </div>
//       </div>
//     </SidePanelForm>
//   );
// };

// export default UpdateDepartment;

import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { z } from 'zod';
import toast from 'react-hot-toast';

// --- Redux Imports ---
import { updateDepartment, type Department, type UpdateDepartmentPayload } from '../../store/slice/departmentSlice';
import type { RootState, AppDispatch } from '../../store/store';
import SidePanelForm from "../common/SidePanelForm";

// --- Zod Validation Schema ---
const departmentSchema = z.object({
  name: z.string()
    .min(1, { message: "Department Name is required." })
    .max(50, { message: "Name must be 50 characters or less." })
    .regex(/^[a-zA-Z\s]+$/, { message: "Name can only contain letters and spaces." }),

  code: z.string()
    .regex(/^\d{3,6}$/, { message: "Code must be a number with 3 to 6 digits." })
    .optional()
    .or(z.literal('')),

  description: z.string()
    .max(200, { message: "Description must be 200 characters or less." })
    .optional(),

  status: z.enum(['active', 'inactive']),
});


// --- Type Inference from Schema ---
type DepartmentFormData = z.infer<typeof departmentSchema>;
type FormErrors = z.ZodFormattedError<DepartmentFormData> | null;

// --- Reusable Form Input Component with Error Handling ---
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
        id={name} name={name} value={value} onChange={onChange} placeholder={placeholder} rows={4}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 ${error ? 'border-red-500' : 'border-gray-300'}`}
      />
    ) : (
      <input
        id={name} name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} required={required}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 ${error ? 'border-red-500' : 'border-gray-300'}`}
      />
    )}
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
);

// --- Main Component ---
interface UpdateDepartmentProps {
  isOpen: boolean;
  onClose: () => void;
  departmentData: Department | null;
}

const UpdateDepartment: React.FC<UpdateDepartmentProps> = ({ isOpen, onClose, departmentData }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { status: loadingStatus } = useSelector((state: RootState) => state.departments);

  const [formData, setFormData] = useState<DepartmentFormData>({ name: '', code: '', description: '', status: 'active' });
  const [errors, setErrors] = useState<FormErrors>(null);
  
  // **FIX**: Store the initial state of the form to reliably check for changes.
  const [initialData, setInitialData] = useState<DepartmentFormData | null>(null);

  useEffect(() => {
    if (departmentData) {
      // Normalize the data (e.g., handle null values) and set it for both the form and the initial state check.
      const normalizedData = {
        name: departmentData.name,
        code: departmentData.code || '',
        description: departmentData.description || '',
        status: departmentData.status,
      };
      setFormData(normalizedData);
      setInitialData(normalizedData);
    } else {
      setInitialData(null);
    }
    setErrors(null);
  }, [departmentData]);

  // Real-time validation effect as the user types.
  useEffect(() => {
    if (!initialData) return; // Don't validate an empty form
    const result = departmentSchema.safeParse(formData);
    setErrors(result.success ? null : result.error.format());
  }, [formData, initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!departmentData || !initialData) return;

    // Final validation check on submit.
    const validationResult = departmentSchema.safeParse(formData);
    if (!validationResult.success) {
      setErrors(validationResult.error.format());
      toast.error('Please correct the errors before submitting.');
      return;
    }

    // --- LOGIC TO SEND ONLY CHANGED FIELDS ---
    const changedFields: Partial<DepartmentFormData> = {};

    // **FIX**: Compare against the stored `initialData` for a reliable check.
    if (formData.name !== initialData.name) changedFields.name = formData.name;
    if (formData.code !== initialData.code) changedFields.code = formData.code;
    if (formData.description !== initialData.description) changedFields.description = formData.description;
    // **FIX**: Corrected typo from `sattus` to `status`.
    if (formData.status !== initialData.status) changedFields.status = formData.status;

    if (Object.keys(changedFields).length === 0) {
      toast.info("No changes were made.");
      onClose();
      return;
    }

    const payload: UpdateDepartmentPayload = {
      id: departmentData.id,
      ...changedFields,
    };

    try {
      await dispatch(updateDepartment(payload)).unwrap();
      toast.success('Department updated successfully!');
      onClose();
    } catch (error: any) {
      toast.error(error || 'Failed to update department.');
    }
  };

  return (
    <SidePanelForm
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit '${departmentData?.name || ''}'`}
      onSubmit={handleFormSubmit}
      submitText="Update"
      isSubmitting={loadingStatus === 'loading'}
    >
      <div className="space-y-4">
        <FormInput
          label="Department Name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          error={errors?.name?._errors[0]}
        />
        <FormInput
          label="Code"
          name="code"
          type="number"
          value={formData.code || ''}
          onChange={handleInputChange}
          error={errors?.code?._errors[0]}
        />
        <FormInput
          label="Description"
          name="description"
          value={formData.description || ''}
          onChange={handleInputChange}
          isTextarea
          error={errors?.description?._errors[0]}
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
    </SidePanelForm>
  );
};

export default UpdateDepartment;

