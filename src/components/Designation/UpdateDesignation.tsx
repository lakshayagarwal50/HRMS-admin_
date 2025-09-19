// import React, { useState, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import toast from 'react-hot-toast'; // 1. Import toast

// // --- Component & Redux Imports ---
// import SidePanelForm from '../common/SidePanelForm';
// import { updateDesignation, type Designation } from '../../store/slice/designationSlice';
// import { fetchDepartments } from '../../store/slice/departmentSlice';
// import type { RootState, AppDispatch } from '../../store/store';


// interface UpdateDesignationProps {
//   isOpen: boolean;
//   onClose: () => void;
//   designationData: Designation | null;
// }


// const FormInput: React.FC<{
//   label: string; value: string;
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   required?: boolean;
// }> = ({ label, value, onChange, required }) => (
//   <div>
//     <label className="block text-sm font-medium text-gray-700 mb-1">
//       {label} {required && <span className="text-red-500">*</span>}
//     </label>
//     <input type="text" value={value} onChange={onChange} required={required} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500" />
//   </div>
// );

// const FormTextarea: React.FC<{
//   label: string; value: string;
//   onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
// }> = ({ label, value, onChange }) => (
//     <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
//         <textarea value={value} onChange={onChange} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500" />
//     </div>
// );

// const FormSelect: React.FC<{
//   label: string; value: string;
//   onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
//   children: React.ReactNode;
//   required?: boolean;
// }> = ({ label, value, onChange, children, required }) => (
//     <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           {label} {required && <span className="text-red-500">*</span>}
//         </label>
//         <select value={value} onChange={onChange} required={required} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 bg-white">
//             {children}
//         </select>
//     </div>
// );


// const UpdateDesignation: React.FC<UpdateDesignationProps> = ({ isOpen, onClose, designationData }) => {
//   const dispatch = useDispatch<AppDispatch>();

//   const { items: departments, status: departmentStatus } = useSelector((state: RootState) => state.departments);

//   const [name, setName] = useState('');
//   const [code, setCode] = useState('');
//   const [description, setDescription] = useState('');
//   const [department, setDepartment] = useState('');

//   useEffect(() => {
//     if (isOpen && departmentStatus === 'idle') {
//       dispatch(fetchDepartments());
//     }
//   }, [isOpen, departmentStatus, dispatch]);

//   useEffect(() => {
//     if (designationData) {
//       setName(designationData.name || '');
//       setCode(designationData.code || '');
//       setDescription(designationData.description || '');
//       setDepartment(designationData.department || '');
//     }
//   }, [designationData]);

//   const handleFormSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!name.trim() || !department || !designationData) {
//       toast.error('Designation Name and Department are required.');
//       return;
//     }
    
//     const updatedData: Designation = { 
//         ...designationData, 
//         name, 
//         code, 
//         description,
//         department
//     };
    
  
//     try {
//         await dispatch(updateDesignation(updatedData)).unwrap();
//         toast.success('Designation updated successfully!');
//         onClose();
//     } catch (error: any) {
//         toast.error(error || 'Failed to update designation.');
//     }
//   };

//   return (
//     <SidePanelForm
//       isOpen={isOpen}
//       onClose={onClose}
//       title="Update Designation"
//       onSubmit={handleFormSubmit}
//       submitText="Update"
//     >
//       <div className="space-y-4">
//         <FormInput label="Designation Name" value={name} onChange={(e) => setName(e.target.value)} required />
//         <FormInput label="Code" value={code} onChange={(e) => setCode(e.target.value)} />
//         <FormTextarea label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        
//         <FormSelect label="Select Department" value={department} onChange={(e) => setDepartment(e.target.value)} required>
//             <option value="" disabled>-- Select a department --</option>
//             {departmentStatus === 'loading' && <option>Loading...</option>}
//             {departments.map((dep) => (
//               <option key={dep.id} value={dep.name}>
//                 {dep.name}
//               </option>
//             ))}
//         </FormSelect>
//       </div>
//     </SidePanelForm>
//   );
// };

// export default UpdateDesignation;


import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { z } from 'zod';

// --- Component & Redux Imports ---
import SidePanelForm from '../common/SidePanelForm';
import { updateDesignation, type Designation, type UpdateDesignationPayload } from '../../store/slice/designationSlice';
import { fetchDepartments } from '../../store/slice/departmentSlice';
import type { RootState, AppDispatch } from '../../store/store';

// --- Zod Validation Schema ---
// Defines validation rules, making description optional.
const designationSchema = z.object({
  name: z.string()
    .min(1, { message: "Designation Name is required." })
    // .regex(/^[a-zA-Z\s]+$/, { message: "Name can only contain letters and spaces." }),
    .regex(/^[a-zA-Z\s-]+$/, { message: "Name can only contain letters, spaces, and hyphens." }),

  code: z.string()
    .min(1, { message: "Code is required." })
    .regex(/^\d{3,6}$/, { message: "Code must be a number with 3 to 6 digits." }),

  description: z.string()
    .max(200, "Description must be 200 characters or less.")
    .optional(),

  department: z.string()
    .min(1, { message: "Please select a department." }),
});

// --- Type Inference from Schema ---
type DesignationFormData = z.infer<typeof designationSchema>;
type FormErrors = z.ZodFormattedError<DesignationFormData> | null;

// --- Reusable Form Components with Error Handling ---
interface FormInputProps {
  label: string; name: keyof DesignationFormData; value: string; placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean; error?: string; type?: 'text' | 'number';
}

const FormInput: React.FC<FormInputProps> = ({ label, name, value, onChange, required, placeholder, error, type = 'text' }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      id={name} name={name} type={type} value={value} placeholder={placeholder} onChange={onChange} required={required}
      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 ${error ? 'border-red-500' : 'border-gray-300'}`}
    />
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
);

interface FormTextareaProps {
  label: string; name: keyof DesignationFormData; value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string; required?: boolean;
}

const FormTextarea: React.FC<FormTextareaProps> = ({ label, name, value, onChange, error, required = false }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <textarea
      id={name} name={name} value={value} onChange={onChange} rows={4}
      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 ${error ? 'border-red-500' : 'border-gray-300'}`}
    />
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
);

interface FormSelectProps {
  label: string; name: keyof DesignationFormData; value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode; required?: boolean; error?: string;
}

const FormSelect: React.FC<FormSelectProps> = ({ label, name, value, onChange, children, required, error }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      id={name} name={name} value={value} onChange={onChange} required={required}
      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 bg-white ${error ? 'border-red-500' : 'border-gray-300'}`}
    >
      {children}
    </select>
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
);

// --- Main Component ---
interface UpdateDesignationProps {
  isOpen: boolean;
  onClose: () => void;
  designationData: Designation | null;
}

const UpdateDesignation: React.FC<UpdateDesignationProps> = ({ isOpen, onClose, designationData }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: departments, status: departmentStatus } = useSelector((state: RootState) => state.departments);
  const { status: designationStatus } = useSelector((state: RootState) => state.designations);

  const initialFormState = useMemo(() => ({ name: '', code: '', description: '', department: '' }), []);
  
  const [formData, setFormData] = useState<DesignationFormData>(initialFormState);
  const [initialData, setInitialData] = useState<DesignationFormData | null>(null);
  const [errors, setErrors] = useState<FormErrors>(null);

  useEffect(() => {
    if (isOpen && departmentStatus !== 'loading' && departments.length === 0) {
      dispatch(fetchDepartments());
    }
  }, [isOpen, departments.length, departmentStatus, dispatch]);

  useEffect(() => {
    if (designationData) {
      const normalizedData = {
        name: designationData.name,
        code: designationData.code || '',
        description: designationData.description || '',
        department: designationData.department,
      };
      setFormData(normalizedData);
      setInitialData(normalizedData);
    } else {
        setFormData(initialFormState);
        setInitialData(null);
    }
    setErrors(null);
  }, [designationData, initialFormState]);

  useEffect(() => {
    if (!initialData) return;
    const result = designationSchema.safeParse(formData);
    setErrors(result.success ? null : result.error.format());
  }, [formData, initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!designationData || !initialData) return;

    const validationResult = designationSchema.safeParse(formData);
    if (!validationResult.success) {
      setErrors(validationResult.error.format());
      toast.error('Please correct the errors before submitting.');
      return;
    }

    const changedFields: Partial<DesignationFormData> = {};
    if (formData.name !== initialData.name) changedFields.name = formData.name;
    if (formData.code !== initialData.code) changedFields.code = formData.code;
    if (formData.description !== initialData.description) changedFields.description = formData.description;
    if (formData.department !== initialData.department) changedFields.department = formData.department;

    if (Object.keys(changedFields).length === 0) {
      toast.info("No changes were made.");
      onClose();
      return;
    }

    const payload: UpdateDesignationPayload = {
      id: designationData.id,
      ...changedFields,
    };

    try {
      await dispatch(updateDesignation(payload)).unwrap();
      toast.success('Designation updated successfully!');
      onClose();
    } catch (error: any) {
      toast.error(error || 'Failed to update designation.');
    }
  };

  return (
    <SidePanelForm
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit '${designationData?.name || ''}'`}
      onSubmit={handleFormSubmit}
      submitText="Update"
      isSubmitting={designationStatus === 'loading'}
    >
      <div className="space-y-4">
        <FormInput
          label="Designation Name" name="name" value={formData.name} placeholder="e.g., Software Engineer"
          onChange={handleInputChange} required error={errors?.name?._errors[0]}
        />
        <FormInput
          label="Code" name="code" value={formData.code} placeholder="e.g., 101"
          onChange={handleInputChange} required error={errors?.code?._errors[0]} type="number"
        />
        <FormTextarea
          label="Description" name="description" value={formData.description || ''}
          onChange={handleInputChange} error={errors?.description?._errors[0]}
        />
        <FormSelect
          label="Select Department" name="department" value={formData.department}
          onChange={handleInputChange} required error={errors?.department?._errors[0]}
        >
          <option value="" disabled>Select a department</option>
          {departmentStatus === 'loading' && <option disabled>Loading...</option>}
          {departments.map((dep) => (
            <option key={dep.id} value={dep.name}>{dep.name}</option>
          ))}
        </FormSelect>
      </div>
    </SidePanelForm>
  );
};

export default UpdateDesignation;
