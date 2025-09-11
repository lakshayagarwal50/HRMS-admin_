// import React, { useState, useEffect } from 'react';
// import SidePanelForm from '../../components/common/SidePanelForm'; // Adjust path if needed
// import toast from 'react-hot-toast';
// interface SalaryStructure {
//   id: string;
//   groupName: string;
//   code: string;
//   description: string;
//   salaryComponents: string;
// }

// interface UpdateSalaryStructureProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSubmit: (data: Omit<SalaryStructure, 'id' | 'salaryComponents'>) => void;
//   structureData: SalaryStructure | null;
// }
// const UpdateSalaryStructure: React.FC<UpdateSalaryStructureProps> = ({ isOpen, onClose, onSubmit, structureData }) => {
//   const [name, setName] = useState('');
//   const [code, setCode] = useState('');
//   const [description, setDescription] = useState('');
//   useEffect(() => {
//     if (isOpen && structureData) {
//       setName(structureData.groupName);
//       setCode(structureData.code);
//       setDescription(structureData.description);
//     }
//   }, [isOpen, structureData]);

//    const handleSubmit = (e: React.FormEvent) => {
//   e.preventDefault();
//   if (!name.trim()) {
//     toast.error('Name is required.');
//     return;
//   }
//   onSubmit({ groupName: name, code, description });
//   toast.success('Group Update successfully!');
// };

//   return (
//     <SidePanelForm
//       isOpen={isOpen}
//       onClose={onClose}
//       title="Edit Salary Structure Group"
//       onSubmit={handleSubmit}
//       submitText="Update"
//     >
//       <div className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Name <span className="text-red-500">*</span>
//           </label>
//           <input
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
//             type="text"
//             value={code}
//             onChange={(e) => setCode(e.target.value)}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//           <textarea
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

// export default UpdateSalaryStructure;


import React, { useState, useEffect } from 'react';
import SidePanelForm from '../../components/common/SidePanelForm'; // Adjust path if needed
import toast from 'react-hot-toast';
import { z } from 'zod';

// Define the Zod schema for validation (can be shared across components)
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

interface SalaryStructure {
  id: string;
  groupName: string;
  code: string;
  description: string;
  salaryComponents: string;
}

interface UpdateSalaryStructureData {
  groupName: string;
  code: string;
  description: string;
}

interface UpdateSalaryStructureProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateSalaryStructureData) => Promise<void>;
  structureData: SalaryStructure | null;
}

const UpdateSalaryStructure: React.FC<UpdateSalaryStructureProps> = ({ isOpen, onClose, onSubmit, structureData }) => {
  const [formData, setFormData] = useState<UpdateSalaryStructureData>({
    groupName: '',
    code: '',
    description: '',
  });

  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form when the panel opens and data is available
  useEffect(() => {
    if (isOpen && structureData) {
      setFormData({
        groupName: structureData.groupName,
        code: structureData.code,
        description: structureData.description,
      });
    }
    // Clear errors when panel opens or closes
    setErrors({});
  }, [isOpen, structureData]);

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
      toast.error(result.error.issues[0].message);
      return;
    }

    setIsSubmitting(true);

    await toast.promise(
      onSubmit(result.data),
      {
        loading: 'Updating group...',
        success: 'Group updated successfully!',
        error: 'Failed to update group.',
      }
    ).finally(() => {
      setIsSubmitting(false);
    });
  };

  return (
    <SidePanelForm
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Salary Structure Group"
      onSubmit={handleSubmit}
      submitText={isSubmitting ? 'Updating...' : 'Update'}
      isSubmitting={isSubmitting}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
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

export default UpdateSalaryStructure;
