// import React, { useEffect, useState } from 'react';
// import { MoreHorizontal } from 'lucide-react';
// import { useSelector, useDispatch } from 'react-redux';
// import type { AppDispatch, RootState } from '../../store/store';
// import { fetchRatingCriteria, deleteRatingCriteria, type RatingCriteria } from '../../store/slice/ratingCriteriaSlice';


// const SkeletonRow = () => (
//     <tr className="border-b last:border-b-0 animate-pulse">
//         <td className="w-1/12 px-4 py-3">
//             <div className="h-4 bg-gray-200 rounded w-1/2"></div>
//         </td>
//         <td className="w-8/12 px-4 py-3">
//             <div className="h-4 bg-gray-200 rounded w-3/4"></div>
//         </td>
//         <td className="w-3/12 px-4 py-3 text-right relative">
//             <div className="h-8 w-8 bg-gray-200 rounded-full inline-block"></div>
//         </td>
//     </tr>
// );


// interface CriteriaListComponentProps {
//   onEdit: (criteria: RatingCriteria) => void;
// }

// const CriteriaListComponent: React.FC<CriteriaListComponentProps> = ({ onEdit }) => {
//     const dispatch = useDispatch<AppDispatch>();
//     const { data: criteria, status, error } = useSelector((state: RootState) => state.ratingCriteria);
//     const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

//     useEffect(() => {
//         if (status === 'idle') {
//             dispatch(fetchRatingCriteria());
//         }
//     }, [status, dispatch]);

//     const handleDelete = (id: string) => {
//         dispatch(deleteRatingCriteria(id));
//         setActiveDropdown(null);
//     };

//     const toggleDropdown = (id: string) => {
//         setActiveDropdown(prev => (prev === id ? null : id));
//     };

//     const renderContent = () => {
//         if (status === 'loading' || status === 'idle') {
//             return (
//                 <div className="max-h-64 overflow-y-auto border-t">
//                     <table className="min-w-full">
//                         <tbody>
//                             {[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}
//                         </tbody>
//                     </table>
//                 </div>
//             );
//         }

//         if (status === 'failed') {
//             return <p className="text-red-500 p-4">Error: {error}</p>;
//         }

//         if (status === 'succeeded') {
//             return (
//                 <div className="max-h-64 overflow-y-auto border-t">
//                     <table className="min-w-full">
//                         <tbody>
//                             {criteria.map((item, index) => (
//                                 <tr key={item.id} className="border-b last:border-b-0">
//                                     <td className="w-1/12 px-4 py-3 text-sm text-gray-600">{index + 1}</td>
//                                     <td className="w-8/12 px-4 py-3 text-sm text-gray-800 font-medium">{item.criteriaName}</td>
//                                     <td className="w-3/12 px-4 py-3 text-right relative">
//                                         <button onClick={() => toggleDropdown(`criteria-${item.id}`)} className="p-2 rounded-full hover:bg-gray-200">
//                                             <MoreHorizontal size={20} className="text-gray-500" />
//                                         </button>
//                                         {activeDropdown === `criteria-${item.id}` && (
//                                             <div className="absolute top-full right-0 mt-2 w-28 bg-white border rounded-md shadow-lg z-10">
//                                                 <button onClick={() => onEdit(item)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Edit</button>
//                                                 <button onClick={() => handleDelete(item.id)} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Delete</button>
//                                             </div>
//                                         )}
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             );
//         }
//         return null;
//     };

//     return (
//         <div className="bg-white p-6 rounded-lg shadow-md border">
//             <h2 className="text-lg font-semibold text-gray-800 mb-4">Criteria</h2>
//             <div>
//                 <table className="min-w-full">
//                     <thead>
//                         <tr>
//                             <th className="w-1/12 px-4 py-2 text-left text-sm font-medium text-gray-500">S.no</th>
//                             <th className="w-8/12 px-4 py-2 text-left text-sm font-medium text-gray-500">Criteria</th>
//                             <th className="w-3/12 px-4 py-2 text-right text-sm font-medium text-gray-500">Action</th>
//                         </tr>
//                     </thead>
//                 </table>
//                 {renderContent()}
//             </div>
//         </div>
//     );
// };

// export default CriteriaListComponent;


import React, { useState, useEffect, useRef } from 'react';
import { MoreHorizontal, ServerCrash, RefreshCw } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch, RootState } from '../../store/store';
import { fetchRatingCriteria, type RatingCriteria } from '../../store/slice/ratingCriteriaSlice';

// --- UI State Components ---
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

const ErrorState: React.FC<{ onRetry: () => void; error: string | null }> = ({ onRetry, error }) => (
    <div className="text-center py-6 px-4 bg-red-50 border rounded-lg">
        <ServerCrash className="mx-auto h-8 w-8 text-red-400" />
        <h3 className="mt-2 text-md font-semibold text-red-800">Failed to Load Criteria</h3>
        <p className="mt-1 text-xs text-red-600">{error || 'An unknown error occurred.'}</p>
        <button type="button" onClick={onRetry} className="mt-4 inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700">
            <RefreshCw className="-ml-1 mr-2 h-4 w-4" />
            Try Again
        </button>
    </div>
);


// --- PROPS DEFINITION ---
interface CriteriaListComponentProps {
  onEdit: (criteria: RatingCriteria) => void;
  // This prop will now trigger the confirmation modal in the parent component.
  onDeleteRequest: (criteria: RatingCriteria) => void;
}

// --- MAIN COMPONENT ---
const CriteriaListComponent: React.FC<CriteriaListComponentProps> = ({ onEdit, onDeleteRequest }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { data: criteria, status, error } = useSelector((state: RootState) => state.ratingCriteria);
    
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchRatingCriteria());
        }
    }, [status, dispatch]);

    const toggleDropdown = (id: string) => {
        setActiveDropdown(prev => (prev === id ? null : id));
    };
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setActiveDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const renderContent = () => {
        if ((status === 'loading' || status === 'idle') && criteria.length === 0) {
            return <tbody>{[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}</tbody>;
        }

        if (status === 'failed') {
            return <tbody><tr><td colSpan={3}><ErrorState onRetry={() => dispatch(fetchRatingCriteria())} error={error} /></td></tr></tbody>;
        }

        if (status === 'succeeded' && criteria.length === 0) {
            return <tbody><tr><td colSpan={3} className="text-center py-8 text-gray-500">No criteria found.</td></tr></tbody>;
        }

        return (
            <tbody>
                {criteria.map((item, index) => (
                    <tr key={item.id} className="border-b last:border-b-0 hover:bg-gray-50">
                        <td className="w-1/12 px-4 py-3 text-sm text-gray-600">{index + 1}</td>
                        <td className="w-8/12 px-4 py-3 text-sm text-gray-800 font-medium">{item.criteriaName}</td>
                        <td className="w-3/12 px-4 py-3 text-right relative">
                            <button onClick={() => toggleDropdown(`criteria-${item.id}`)} className="p-2 rounded-full hover:bg-gray-200">
                                <MoreHorizontal size={20} className="text-gray-500" />
                            </button>
                            {activeDropdown === `criteria-${item.id}` && (
                                <div ref={dropdownRef} className="absolute top-full right-0 mt-2 w-28 bg-white border rounded-md shadow-lg z-10">
                                    <button onClick={() => { onEdit(item); setActiveDropdown(null); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Edit</button>
                                    {/* The delete button now calls the new handler to request deletion */}
                                    <button onClick={() => { onDeleteRequest(item); setActiveDropdown(null); }} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Delete</button>
                                </div>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        );
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Criteria</h2>
            <div className="max-h-72 overflow-y-auto">
                 <table className="min-w-full">
                    <thead className="sticky top-0 bg-white z-10">
                        <tr>
                            <th className="w-1/12 px-4 py-2 text-left text-sm font-medium text-gray-500">S.no</th>
                            <th className="w-8/12 px-4 py-2 text-left text-sm font-medium text-gray-500">Criteria</th>
                            <th className="w-3/12 px-4 py-2 text-right text-sm font-medium text-gray-500">Action</th>
                        </tr>
                    </thead>
                    {renderContent()}
                </table>
            </div>
        </div>
    );
};

export default CriteriaListComponent;

