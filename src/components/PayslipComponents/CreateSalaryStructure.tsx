// import React, { useState, useEffect } from 'react';
// import SidePanelForm from '../../components/common/SidePanelForm'; 
// import toast from 'react-hot-toast';

// interface NewSalaryStructureData {
//   groupName: string;
//   code: string;
//   description: string;
// }

// interface CreateSalaryStructureProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSubmit: (data: NewSalaryStructureData) => void;
// }

// const CreateSalaryStructure: React.FC<CreateSalaryStructureProps> = ({ isOpen, onClose, onSubmit }) => {
//   const [name, setName] = useState('');
//   const [code, setCode] = useState('');
//   const [description, setDescription] = useState('');

//  const handleSubmit = (e: React.FormEvent) => {
//   e.preventDefault();
//   if (!name.trim()) {
//     toast.error('Name is required.');
//     return;
//   }
//   onSubmit({ groupName: name, code, description });
//   toast.success('Group created successfully!');
// };

//   useEffect(() => {
//     if (!isOpen) {
//       setName('');
//       setCode('');
//       setDescription('');
//     }
//   }, [isOpen]);

//   return (
//     <SidePanelForm
//       isOpen={isOpen}
//       onClose={onClose}
//       title="Create Salary Structure Group"
//       onSubmit={handleSubmit}
//       submitText="Submit"
//     >
//       <div className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Name <span className="text-red-500">*</span>
//           </label>
//           <input
//             placeholder='eg: Employee'
//             type="text"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             required
//             className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
//           <input
//             placeholder='eg: 1001'
//             type="text"
//             value={code}
//             onChange={(e) => setCode(e.target.value)}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//           <textarea
//            placeholder='this is description'
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             rows={4}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
//           />
//         </div>
//       </div>
//     </SidePanelForm>
//   );
// };

// export default CreateSalaryStructure;
import { useEffect, useState } from 'react';
import SidePanelForm from '../../components/common/SidePanelForm';
import toast from 'react-hot-toast';
import { z } from 'zod';

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
  // The onSubmit function is now expected to be asynchronous
  onSubmit: (data: NewSalaryStructureData) => Promise<void>;
}

const CreateSalaryStructure: React.FC<CreateSalaryStructureProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<NewSalaryStructureData>({
    groupName: '',
    code: '',
    description: '',
  });

  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  // New state to track submission status
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
    if (isSubmitting) return; // Prevent multiple submissions

    // Validate the form data
    const result = salaryStructureSchema.safeParse(formData);

    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach(issue => {
        newErrors[issue.path[0]] = issue.message;
      });
      setErrors(newErrors);
      toast.error(result.error.issues[0].message);
      return;
    }

    // Set loading state to true
    setIsSubmitting(true);

    // Use toast.promise to handle the async submission
    await toast.promise(
      onSubmit(result.data),
      {
        loading: 'Creating group...',
        success: 'Group created successfully!',
        error: 'Failed to create group.',
      }
    ).finally(() => {
      // Reset loading state regardless of outcome
      setIsSubmitting(false);
    });
  };

  // Clear form state and errors when the panel is closed
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        groupName: '',
        code: '',
        description: '',
      });
      setErrors({});
      setIsSubmitting(false); // Also reset submitting state
    }
  }, [isOpen]);

  return (
    <SidePanelForm
      isOpen={isOpen}
      onClose={onClose}
      title="Create Salary Structure Group"
      onSubmit={handleSubmit}
      submitText={isSubmitting ? 'Submitting...' : 'Submit'}
      // Pass the submitting state to disable buttons in the SidePanelForm
      isSubmitting={isSubmitting}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            placeholder='eg: Employee'
            type="text"
            name="groupName"
            value={formData.groupName}
            onChange={handleInputChange}
            disabled={isSubmitting} // Disable input during submission
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
            disabled={isSubmitting} // Disable input during submission
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
            disabled={isSubmitting} // Disable input during submission
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
        </div>
      </div>
    </SidePanelForm>
  );
};

export default CreateSalaryStructure;