// import React, { useState, useEffect } from 'react';
// import { useDispatch } from 'react-redux';
// import type { AppDispatch } from '../../store/store';
// import { addRatingCriteria, updateRatingCriteria, type RatingCriteria } from '../../store/slice/ratingCriteriaSlice';

// interface CriteriaFormComponentProps {
//   editingCriteria: RatingCriteria | null;
//   onDone: () => void; 
// }

// const CriteriaFormComponent: React.FC<CriteriaFormComponentProps> = ({ editingCriteria, onDone }) => {
//     const dispatch = useDispatch<AppDispatch>();
//     const [criteriaName, setCriteriaName] = useState('');

//     useEffect(() => {
//         if (editingCriteria) {
//             setCriteriaName(editingCriteria.criteriaName);
//         } else {
//             setCriteriaName('');
//         }
//     }, [editingCriteria]);

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         if (criteriaName.trim()) {
//             if (editingCriteria) {
//                 dispatch(updateRatingCriteria({ id: editingCriteria.id, criteriaName: criteriaName.trim() }));
//             } else {
//                 dispatch(addRatingCriteria(criteriaName.trim()));
//             }
//             onDone(); 
//         }
//     };

//     return (
//         <div className="bg-white p-6 rounded-lg shadow-md border">
//             <h2 className="text-lg font-semibold text-gray-800 mb-6">{editingCriteria ? 'Update Criteria' : 'Add Criteria'}</h2>
//             <form onSubmit={handleSubmit} className="space-y-6">
//                 <div>
//                     <label htmlFor="criteriaName" className="block text-sm font-medium text-gray-700 mb-1">Criteria Name</label>
//                     <input
//                         type="text"
//                         id="criteriaName"
//                         value={criteriaName}
//                         onChange={(e) => setCriteriaName(e.target.value)}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
//                     />
//                 </div>
//                 <div className="flex justify-end gap-4 pt-2">
//                     <button type="button" onClick={onDone} className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200">Cancel</button>
//                     <button type="submit" className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700">{editingCriteria ? 'UPDATE' : 'SUBMIT'}</button>
//                 </div>
//             </form>
//         </div>
//     );
// };

// export default CriteriaFormComponent;

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { z } from 'zod'; // 1. Import zod

// --- Redux Imports ---
import type { AppDispatch, RootState } from '../../store/store';
import { 
    addRatingCriteria, 
    updateRatingCriteria, 
    type RatingCriteria 
} from '../../store/slice/ratingCriteriaSlice';

// --- Zod Validation Schema ---
// 2. Define the validation rules for the form
const criteriaSchema = z.object({
  criteriaName: z.string()
    .min(1, { message: "Criteria name is required." })
    .regex(/^[a-zA-Z\s]+$/, { message: "Only letters and spaces are allowed." }),
});

// Infer the form data type from the schema for type safety
type CriteriaFormData = z.infer<typeof criteriaSchema>;

// --- PROPS DEFINITION ---
interface CriteriaFormComponentProps {
  editingCriteria: RatingCriteria | null;
  onDone: () => void;
}

// --- MAIN COMPONENT ---
const CriteriaFormComponent: React.FC<CriteriaFormComponentProps> = ({ editingCriteria, onDone }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { status } = useSelector((state: RootState) => state.ratingCriteria);
    
    // 3. Manage form data and errors in state
    const [formData, setFormData] = useState<CriteriaFormData>({ criteriaName: '' });
    const [errors, setErrors] = useState<z.ZodFormattedError<CriteriaFormData> | null>(null);

    const isEditMode = !!editingCriteria;

    // Effect to populate the form when in edit mode or clear it for create mode
    useEffect(() => {
        if (editingCriteria) {
            setFormData({ criteriaName: editingCriteria.criteriaName });
        } else {
            setFormData({ criteriaName: '' });
        }
        // Clear any previous validation errors when the mode changes
        setErrors(null);
    }, [editingCriteria]);

    // 4. Effect for REAL-TIME validation as the user types
    useEffect(() => {
        // Don't show errors on a completely empty form
        if (formData.criteriaName === '') {
            setErrors(null);
            return;
        }
        const result = criteriaSchema.safeParse(formData);
        if (!result.success) {
            setErrors(result.error.format());
        } else {
            setErrors(null);
        }
    }, [formData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ criteriaName: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Final validation check on submit
        const validationResult = criteriaSchema.safeParse(formData);

        if (!validationResult.success) {
            setErrors(validationResult.error.format());
            toast.error("Please correct the errors before submitting.");
            return;
        }

        const { criteriaName } = validationResult.data;

        try {
            if (isEditMode) {
                await dispatch(updateRatingCriteria({ id: editingCriteria.id, criteriaName })).unwrap();
                toast.success('Criteria updated successfully!');
            } else {
                await dispatch(addRatingCriteria(criteriaName)).unwrap();
                toast.success('Criteria added successfully!');
            }
            onDone(); // Signal the parent to reset the form
        } catch (error: any) {
            toast.error(error || `Failed to ${isEditMode ? 'update' : 'add'} criteria.`);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">
                {isEditMode ? 'Update Criteria' : 'Add Criteria'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="criteriaName" className="block text-sm font-medium text-gray-700 mb-1">
                        Criteria Name
                    </label>
                    <input
                        type="text"
                        id="criteriaName"
                        value={formData.criteriaName}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm ${errors?.criteriaName ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {/* 5. Display the validation error message */}
                    {errors?.criteriaName?._errors[0] && (
                        <p className="mt-1 text-xs text-red-600">{errors.criteriaName._errors[0]}</p>
                    )}
                </div>
                <div className="flex justify-end gap-4 pt-2">
                    <button 
                        type="button" 
                        onClick={onDone} 
                        className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        disabled={status === 'loading'}
                        className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400"
                    >
                        {isEditMode ? 'UPDATE' : 'SUBMIT'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CriteriaFormComponent;

