import React, { useEffect, useState } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch, RootState } from '../../store/store';
import { fetchRatingCriteria, deleteRatingCriteria, type RatingCriteria } from '../../store/slice/ratingCriteriaSlice';


const SkeletonRow = () => (
    <tr className="border-b last:border-b-0 animate-pulse">
        <td className="w-1/12 px-4 py-3">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </td>
        <td className="w-8/12 px-4 py-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </td>
        <td className="w-3/12 px-4 py-3 text-right relative">
            <div className="h-8 w-8 bg-gray-200 rounded-full inline-block"></div>
        </td>
    </tr>
);


interface CriteriaListComponentProps {
  onEdit: (criteria: RatingCriteria) => void;
}

const CriteriaListComponent: React.FC<CriteriaListComponentProps> = ({ onEdit }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { data: criteria, status, error } = useSelector((state: RootState) => state.ratingCriteria);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchRatingCriteria());
        }
    }, [status, dispatch]);

    const handleDelete = (id: string) => {
        dispatch(deleteRatingCriteria(id));
        setActiveDropdown(null);
    };

    const toggleDropdown = (id: string) => {
        setActiveDropdown(prev => (prev === id ? null : id));
    };

    const renderContent = () => {
        if (status === 'loading' || status === 'idle') {
            return (
                <div className="max-h-64 overflow-y-auto border-t">
                    <table className="min-w-full">
                        <tbody>
                            {[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}
                        </tbody>
                    </table>
                </div>
            );
        }

        if (status === 'failed') {
            return <p className="text-red-500 p-4">Error: {error}</p>;
        }

        if (status === 'succeeded') {
            return (
                <div className="max-h-64 overflow-y-auto border-t">
                    <table className="min-w-full">
                        <tbody>
                            {criteria.map((item, index) => (
                                <tr key={item.id} className="border-b last:border-b-0">
                                    <td className="w-1/12 px-4 py-3 text-sm text-gray-600">{index + 1}</td>
                                    <td className="w-8/12 px-4 py-3 text-sm text-gray-800 font-medium">{item.criteriaName}</td>
                                    <td className="w-3/12 px-4 py-3 text-right relative">
                                        <button onClick={() => toggleDropdown(`criteria-${item.id}`)} className="p-2 rounded-full hover:bg-gray-200">
                                            <MoreHorizontal size={20} className="text-gray-500" />
                                        </button>
                                        {activeDropdown === `criteria-${item.id}` && (
                                            <div className="absolute top-full right-0 mt-2 w-28 bg-white border rounded-md shadow-lg z-10">
                                                <button onClick={() => onEdit(item)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Edit</button>
                                                <button onClick={() => handleDelete(item.id)} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Delete</button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Criteria</h2>
            <div>
                <table className="min-w-full">
                    <thead>
                        <tr>
                            <th className="w-1/12 px-4 py-2 text-left text-sm font-medium text-gray-500">S.no</th>
                            <th className="w-8/12 px-4 py-2 text-left text-sm font-medium text-gray-500">Criteria</th>
                            <th className="w-3/12 px-4 py-2 text-right text-sm font-medium text-gray-500">Action</th>
                        </tr>
                    </thead>
                </table>
                {renderContent()}
            </div>
        </div>
    );
};

export default CriteriaListComponent;
