// import React, { useState, useEffect } from 'react';
// import { useDispatch } from 'react-redux';
// import toast from 'react-hot-toast';
// import SidePanelForm from '../../components/common/SidePanelForm'; 
// import { addSequenceNumber, type NewSequenceNumber } from '../../store/slice/sequenceNumberSlice'; 
// import type { AppDispatch } from '../../store/store'; 

// type SequenceType = string;

// interface CreateSequenceNumberProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// const CreateSequenceNumber: React.FC<CreateSequenceNumberProps> = ({ isOpen, onClose }) => {
//   const dispatch = useDispatch<AppDispatch>();
//   const [type, setType] = useState<SequenceType>('');
//   const [prefix, setPrefix] = useState('');
//   const [nextAvailableNumber, setNextAvailableNumber] = useState(0);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!type.trim()) {
//       toast.error('Type is a required field.');
//       return;
//     }
//     const newSequence: NewSequenceNumber = { type: type.trim() as 'Employee' | 'Payslip', prefix, nextAvailableNumber };
    
//     try {
       
//         await dispatch(addSequenceNumber(newSequence)).unwrap();
//         toast.success('Sequence number created successfully!');
//         onClose();
//     } catch (error: unknown) { 
       
//         let errorMessage = 'Failed to create sequence number.';
//         if (error instanceof Error) {
//             errorMessage = error.message;
//         } else if (typeof error === 'string') {
//             errorMessage = error;
//         }
//         toast.error(errorMessage);
//     }
//   };

  
//   useEffect(() => {
//     if (!isOpen) {
//       setType('');
//       setPrefix('');
//       setNextAvailableNumber(0);
//     }
//   }, [isOpen]);

//   return (
//       <SidePanelForm
//         isOpen={isOpen}
//         onClose={onClose}
//         title="Create Sequence Number"
//         onSubmit={handleSubmit}
//         submitText="Submit"
//       >
//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Type <span className="text-red-500">*</span>
//             </label>
//             <input
//               id="type"
//               name="type"
//               placeholder='eg: employee'
//               list="type-options"
//               value={type}
//               onChange={(e) => setType(e.target.value as SequenceType)}
//               required
//               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white"
//             />
//             <datalist id="type-options">
//               <option value="Employee" />
//               <option value="Payslip" />
//             </datalist>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Prefix</label>
//             <input
//               type="text"
//               placeholder='eg: EMP'
//               value={prefix}
//               onChange={(e) => setPrefix(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Next Available Number</label>
//             <input
//               type="number"
//               placeholder='eg: 1001'
//               value={nextAvailableNumber}
//               onChange={(e) => setNextAvailableNumber(Number(e.target.value))}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
//             />
//           </div>
//         </div>
//       </SidePanelForm>
//   );
// };

// export default CreateSequenceNumber;
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { z } from 'zod';
import SidePanelForm from '../../components/common/SidePanelForm'; 
import { addSequenceNumber, type NewSequenceNumber } from '../../store/slice/sequenceNumberSlice'; 
import type { AppDispatch } from '../../store/store'; 

// Zod schema for validation
const sequenceSchema = z.object({
  type: z.string()
    .min(1, 'Type is required.')
    .regex(/^[A-Za-z\s]+$/, 'Type can only contain letters and spaces.'),
  prefix: z.string()
    .regex(/^[A-Z]*$/, 'Prefix can only contain capital letters.')
    .optional(),
  nextAvailableNumber: z.number()
    .positive('Number must be positive.')
    .min(1, 'Number must be at least 1.')
    .max(999999, 'Number cannot exceed 6 digits.'),
});

interface CreateSequenceNumberProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateSequenceNumber: React.FC<CreateSequenceNumberProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [type, setType] = useState('');
  const [prefix, setPrefix] = useState('');
  const [nextAvailableNumber, setNextAvailableNumber] = useState(0);
  const [errors, setErrors] = useState<Record<string, string[] | undefined>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validationResult = sequenceSchema.safeParse({
      type: type.trim(),
      prefix: prefix.trim(),
      nextAvailableNumber,
    });

    if (!validationResult.success) {
      setErrors(validationResult.error.flatten().fieldErrors);
      toast.error('Please fix the errors in the form.');
      return;
    }

    setIsSubmitting(true);
    
    const newSequence: NewSequenceNumber = {
      ...validationResult.data,
      type: validationResult.data.type as 'Employee' | 'Payslip',
    };
    
    const promise = dispatch(addSequenceNumber(newSequence)).unwrap();

    try {
        await toast.promise(promise, {
            loading: 'Creating sequence number...',
            success: (result) => result.message || 'Sequence number created successfully!',
            error: (err) => err.message || 'Failed to create sequence number.',
        });
        onClose();
    } catch (error) {
        // Error is handled by toast.promise
    } finally {
        setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setType('');
      setPrefix('');
      setNextAvailableNumber(0);
      setErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen]);

  return (
      <SidePanelForm
        isOpen={isOpen}
        onClose={onClose}
        title="Create Sequence Number"
        onSubmit={handleSubmit}
        submitText={isSubmitting ? 'Submitting...' : 'Submit'}
        isSubmitting={isSubmitting} // Pass submitting state to disable buttons
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Type <span className="text-red-500">*</span>
            </label>
            <input
              id="type"
              name="type"
              placeholder='eg: Employee'
              list="type-options"
              value={type}
              onChange={(e) => setType(e.target.value)}
              disabled={isSubmitting}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white disabled:bg-gray-100"
            />
            <datalist id="type-options">
              <option value="Employee" />
              <option value="Payslip" />
            </datalist>
            {errors.type && <p className="text-xs text-red-500 mt-1">{errors.type[0]}</p>}
          </div>
          <div>
            <label htmlFor="prefix" className="block text-sm font-medium text-gray-700 mb-1">Prefix</label>
            <input
              id="prefix"
              type="text"
              placeholder='eg: EMP'
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm disabled:bg-gray-100"
            />
            {errors.prefix && <p className="text-xs text-red-500 mt-1">{errors.prefix[0]}</p>}
          </div>
          <div>
            <label htmlFor="nextAvailableNumber" className="block text-sm font-medium text-gray-700 mb-1">Next Available Number <span className="text-red-500">*</span></label>
            <input
              id="nextAvailableNumber"
              type="number"
              placeholder='eg: 1001'
              value={nextAvailableNumber === 0 ? '' : nextAvailableNumber}
              onChange={(e) => setNextAvailableNumber(Number(e.target.value))}
              disabled={isSubmitting}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm disabled:bg-gray-100"
            />
            {errors.nextAvailableNumber && <p className="text-xs text-red-500 mt-1">{errors.nextAvailableNumber[0]}</p>}
          </div>
        </div>
      </SidePanelForm>
  );
};

export default CreateSequenceNumber;