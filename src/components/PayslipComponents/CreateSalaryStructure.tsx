// import { useEffect, useState } from 'react';
// import SidePanelForm from '../../components/common/SidePanelForm';
// import toast from 'react-hot-toast';
// import { z } from 'zod';

// // Define the Zod schema for validation
// const salaryStructureSchema = z.object({
//   groupName: z.string()
//     .min(1, 'Name is required.')
//     .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces.'),
//   code: z.string()
//     .min(3, 'Code must be at least 3 digits.')
//     .max(6, 'Code must be at most 6 digits.')
//     .regex(/^\d+$/, 'Code must only contain digits.'),
//   description: z.string()
//     .min(1, 'Description is required.'),
// });

// interface NewSalaryStructureData {
//   groupName: string;
//   code: string;
//   description: string;
// }

// interface CreateSalaryStructureProps {
//   isOpen: boolean;
//   onClose: () => void;
//   // The onSubmit function is now expected to be asynchronous
//   onSubmit: (data: NewSalaryStructureData) => Promise<void>;
// }

// const CreateSalaryStructure: React.FC<CreateSalaryStructureProps> = ({ isOpen, onClose, onSubmit }) => {
//   const [formData, setFormData] = useState<NewSalaryStructureData>({
//     groupName: '',
//     code: '',
//     description: '',
//   });

//   const [errors, setErrors] = useState<Record<string, string | undefined>>({});
//   // New state to track submission status
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: undefined }));
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (isSubmitting) return; // Prevent multiple submissions

//     // Validate the form data
//     const result = salaryStructureSchema.safeParse(formData);

//     if (!result.success) {
//       const newErrors: Record<string, string> = {};
//       result.error.issues.forEach(issue => {
//         newErrors[issue.path[0]] = issue.message;
//       });
//       setErrors(newErrors);
//       toast.error(result.error.issues[0].message);
//       return;
//     }

//     // Set loading state to true
//     setIsSubmitting(true);

//     // Use toast.promise to handle the async submission
//     await toast.promise(
//       onSubmit(result.data),
//       {
//         loading: 'Creating group...',
//         success: 'Group created successfully!',
//         error: 'Failed to create group.',
//       }
//     ).finally(() => {
//       // Reset loading state regardless of outcome
//       setIsSubmitting(false);
//     });
//   };

//   // Clear form state and errors when the panel is closed
//   useEffect(() => {
//     if (!isOpen) {
//       setFormData({
//         groupName: '',
//         code: '',
//         description: '',
//       });
//       setErrors({});
//       setIsSubmitting(false); // Also reset submitting state
//     }
//   }, [isOpen]);

//   return (
//     <SidePanelForm
//       isOpen={isOpen}
//       onClose={onClose}
//       title="Create Salary Structure Group"
//       onSubmit={handleSubmit}
//       submitText={isSubmitting ? 'Submitting...' : 'Submit'}
//       // Pass the submitting state to disable buttons in the SidePanelForm
//       isSubmitting={isSubmitting}
//     >
//       <div className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Name <span className="text-red-500">*</span>
//           </label>
//           <input
//             placeholder='eg: Employee'
//             type="text"
//             name="groupName"
//             value={formData.groupName}
//             onChange={handleInputChange}
//             disabled={isSubmitting} // Disable input during submission
//             className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 ${errors.groupName ? 'border-red-500' : 'border-gray-300'}`}
//           />
//           {errors.groupName && <p className="text-red-500 text-xs mt-1">{errors.groupName}</p>}
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Code <span className="text-red-500">*</span>
//           </label>
//           <input
//             placeholder='eg: 1001'
//             type="text"
//             name="code"
//             value={formData.code}
//             onChange={handleInputChange}
//             disabled={isSubmitting} // Disable input during submission
//             className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 ${errors.code ? 'border-red-500' : 'border-gray-300'}`}
//           />
//           {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Description <span className="text-red-500">*</span>
//           </label>
//           <textarea
//             placeholder='this is description'
//             name="description"
//             value={formData.description}
//             onChange={handleInputChange}
//             rows={4}
//             disabled={isSubmitting} // Disable input during submission
//             className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
//           />
//           {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
//         </div>
//       </div>
//     </SidePanelForm>
//   );
// };

// export default CreateSalaryStructure;


import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { useDispatch } from 'react-redux';
import { addSalaryStructure } from '../../store/slice/salaryStructureSlice'; // Adjust import path
import type { AppDispatch } from '../../store/store'; // Adjust import path

// --- Mock SidePanelForm with TypeScript types ---
interface SidePanelFormProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  submitText: string;
  children: React.ReactNode;
  isSubmitting: boolean;
}

const SidePanelForm: React.FC<SidePanelFormProps> = ({ isOpen, onClose, title, onSubmit, submitText, children, isSubmitting }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-black/50 z-40 flex justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-xl">
        <form onSubmit={onSubmit} className="flex flex-col h-full">
          <div className="bg-purple-600 text-white p-4">
            <h2 className="text-lg font-semibold">{title}</h2>
          </div>
          <div className="p-6 space-y-4 flex-grow overflow-y-auto">
            {children}
          </div>
          <div className="p-4 bg-gray-50 flex justify-end gap-3">
            <button type="button" onClick={onClose} disabled={isSubmitting} className="px-4 py-2 text-sm font-medium rounded-md border bg-white hover:bg-gray-100 disabled:opacity-50">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300">
              {submitText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Define the Zod schema for validation
const salaryStructureSchema = z.object({
  groupName: z.string()
    .min(1, 'Name is required.')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces.'),
  code: z.string()
    .min(3, 'Code must be at least 3 digits.')
    .max(6, 'Code must be at most 6 digits.')
    .regex(/^\d+$/, 'Code must only contain digits.'),
  description: z.string()
    .min(1, 'Description is required.'),
});

interface NewSalaryStructureData {
  groupName: string;
  code: string;
  description: string;
}

interface CreateSalaryStructureProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateSalaryStructure: React.FC<CreateSalaryStructureProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState<NewSalaryStructureData>({
    groupName: '',
    code: '',
    description: '',
  });

  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const result = salaryStructureSchema.safeParse(formData);

    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach(issue => {
        newErrors[issue.path[0]] = issue.message;
      });
      setErrors(newErrors);
      // This local toast for validation errors is fine.
      toast.error(result.error.issues[0].message);
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Dispatch the action and unwrap the result
      await dispatch(addSalaryStructure(result.data)).unwrap();
      // If unwrap succeeds, close the form
      onClose();
    } catch (error) {
      // If unwrap rejects, the slice has already shown a toast.
      // We do nothing here, so the form stays open for correction.
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        groupName: '',
        code: '',
        description: '',
      });
      setErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen]);

  return (
    // The <Toaster /> component has been removed from here. 
    // Ensure you have one Toaster at the root of your application (e.g., App.jsx)
    // configured with position="top-center" to see one toast in the middle-top.
    <SidePanelForm
      isOpen={isOpen}
      onClose={onClose}
      title="Create Salary Structure Group"
      onSubmit={handleSubmit}
      submitText={isSubmitting ? 'Submitting...' : 'Submit'}
      isSubmitting={isSubmitting}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm bg-blafont-medium text-gray-700 mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            placeholder='eg: Employee'
            type="text"
            name="groupName"
            value={formData.groupName}
            onChange={handleInputChange}
            disabled={isSubmitting}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 ${errors.groupName ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.groupName && <p className="text-red-500 text-xs mt-1">{errors.groupName}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Code <span className="text-red-500">*</span>
          </label>
          <input
            placeholder='eg: 1001'
            type="text"
            name="code"
            value={formData.code}
            onChange={handleInputChange}
            disabled={isSubmitting}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 ${errors.code ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            placeholder='this is description'
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            disabled={isSubmitting}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
        </div>
      </div>
    </SidePanelForm>
  );
};

export default CreateSalaryStructure;

