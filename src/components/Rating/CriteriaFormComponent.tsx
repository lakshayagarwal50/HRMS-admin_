import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../store/store';
import { addRatingCriteria, updateRatingCriteria, type RatingCriteria } from '../../store/slice/ratingCriteriaSlice';

interface CriteriaFormComponentProps {
  editingCriteria: RatingCriteria | null;
  onDone: () => void; 
}

const CriteriaFormComponent: React.FC<CriteriaFormComponentProps> = ({ editingCriteria, onDone }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [criteriaName, setCriteriaName] = useState('');

    useEffect(() => {
        if (editingCriteria) {
            setCriteriaName(editingCriteria.criteriaName);
        } else {
            setCriteriaName('');
        }
    }, [editingCriteria]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (criteriaName.trim()) {
            if (editingCriteria) {
                dispatch(updateRatingCriteria({ id: editingCriteria.id, criteriaName: criteriaName.trim() }));
            } else {
                dispatch(addRatingCriteria(criteriaName.trim()));
            }
            onDone(); 
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">{editingCriteria ? 'Update Criteria' : 'Add Criteria'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="criteriaName" className="block text-sm font-medium text-gray-700 mb-1">Criteria Name</label>
                    <input
                        type="text"
                        id="criteriaName"
                        value={criteriaName}
                        onChange={(e) => setCriteriaName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                </div>
                <div className="flex justify-end gap-4 pt-2">
                    <button type="button" onClick={onDone} className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200">Cancel</button>
                    <button type="submit" className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700">{editingCriteria ? 'UPDATE' : 'SUBMIT'}</button>
                </div>
            </form>
        </div>
    );
};

export default CriteriaFormComponent;
