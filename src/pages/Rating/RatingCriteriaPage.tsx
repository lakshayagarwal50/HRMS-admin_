// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { ChevronRight } from 'lucide-react';
// import type { RatingCriteria } from '../../store/slice/ratingCriteriaSlice'; 
// import RatingScaleComponent from '../../components/Rating/RatingScaleComponent';
// import CriteriaListComponent from '../../components/Rating/CriteriaListComponent';
// import CriteriaFormComponent from '../../components/Rating/CriteriaFormComponent';

// const RatingCriteriaPage: React.FC = () => {
//   const [editingCriteria, setEditingCriteria] = useState<RatingCriteria | null>(null);

//   const handleEdit = (criteria: RatingCriteria) => {
//     setEditingCriteria(criteria);
//   };

//   const handleDone = () => {
//     setEditingCriteria(null);
//   };

//   return (
//     <div className="w-full bg-gray-50 p-4 sm:p-6 space-y-8">
//       <header>
//         <div className="flex justify-between items-center">
//           <h1 className="text-2xl font-bold text-gray-900">Rating criteria & scale</h1>
//           <nav aria-label="Breadcrumb" className="flex items-center text-sm text-gray-500">
//             <Link to="/dashboard" className="hover:text-gray-700">Dashboard</Link>
//             <ChevronRight size={16} className="mx-1" />
//             <span className="font-medium text-gray-600">Rating</span>
//             <ChevronRight size={16} className="mx-1" />
//             <span className="font-medium text-gray-800">Rating criteria & scale</span>
//           </nav>
//         </div>
//       </header>

//       <main className="space-y-8">
    
//         <RatingScaleComponent />

     
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      
//           <CriteriaListComponent onEdit={handleEdit} />
        
//           <div>
//             <CriteriaFormComponent editingCriteria={editingCriteria} onDone={handleDone} />
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default RatingCriteriaPage;

import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, X } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';

// --- Component & Redux Imports ---
import type { RatingCriteria } from '../../store/slice/ratingCriteriaSlice'; 
import { deleteRatingCriteria } from '../../store/slice/ratingCriteriaSlice';
import type { AppDispatch } from '../../store/store';
import RatingScaleComponent from '../../components/Rating/RatingScaleComponent';
import CriteriaListComponent from '../../components/Rating/CriteriaListComponent';
import CriteriaFormComponent from '../../components/Rating/CriteriaFormComponent';
import AlertModal from '../../components/Modal/AlertModal'; // 1. Import the AlertModal

// --- MAIN PAGE COMPONENT ---
const RatingCriteriaPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [editingCriteria, setEditingCriteria] = useState<RatingCriteria | null>(null);
  
  // 2. Add state to manage the delete confirmation modal
  const [deleteAlert, setDeleteAlert] = useState<{ isOpen: boolean; criteria: RatingCriteria | null }>({
      isOpen: false,
      criteria: null,
  });

  const handleEdit = (criteria: RatingCriteria) => {
    setEditingCriteria(criteria);
  };

  // This function is called by the form on a successful submission or cancellation
  const handleDone = () => {
    setEditingCriteria(null);
  };
  
  // 3. This function is called by the list component to open the modal
  const handleDeleteRequest = useCallback((criteria: RatingCriteria) => {
      setDeleteAlert({ isOpen: true, criteria });
  }, []);

  // 4. This function is called when the user confirms the deletion in the modal
  const handleConfirmDelete = useCallback(async () => {
      if (deleteAlert.criteria) {
          try {
              // Dispatch the delete action and wait for it to complete
              await dispatch(deleteRatingCriteria(deleteAlert.criteria.id)).unwrap();
              toast.success('Criteria deleted successfully!');
          } catch (error: any) {
              // Show an error toast if the API call fails
              toast.error(error || 'Failed to delete criteria.');
          }
          // Close the modal
          setDeleteAlert({ isOpen: false, criteria: null });
      }
  }, [dispatch, deleteAlert.criteria]);

  return (
    <div className="w-full bg-gray-50 p-4 sm:p-6 space-y-8">
      <header>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Rating criteria & scale</h1>
          <nav aria-label="Breadcrumb" className="flex items-center text-sm text-gray-500">
            <span className="font-medium text-gray-600">Rating</span>
            <ChevronRight size={16} className="mx-1" />
            <span className="font-medium text-gray-800">criteria & scale</span>
          </nav>
        </div>
      </header>

      <main className="space-y-8">
        <RatingScaleComponent />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <CriteriaListComponent onEdit={handleEdit} onDeleteRequest={handleDeleteRequest} />
          <CriteriaFormComponent editingCriteria={editingCriteria} onDone={handleDone} />
        </div>
      </main>

      {/* 5. Render the AlertModal */}
      <AlertModal
        isOpen={deleteAlert.isOpen}
        onClose={() => setDeleteAlert({ isOpen: false, criteria: null })}
        onConfirm={handleConfirmDelete}
        title={`Delete "${deleteAlert.criteria?.criteriaName || ''}"?`}
        icon={<X className="h-8 w-8 text-red-500" strokeWidth={3} />}
      >
        <p>Are you sure you want to delete this criteria? This action cannot be undone.</p>
      </AlertModal>
    </div>
  );
};

export default RatingCriteriaPage;

