import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import type { RatingCriteria } from '../../store/slice/ratingCriteriaSlice'; 
import RatingScaleComponent from '../../components/Rating/RatingScaleComponent';
import CriteriaListComponent from '../../components/Rating/CriteriaListComponent';
import CriteriaFormComponent from '../../components/Rating/CriteriaFormComponent';

const RatingCriteriaPage: React.FC = () => {
  const [editingCriteria, setEditingCriteria] = useState<RatingCriteria | null>(null);

  const handleEdit = (criteria: RatingCriteria) => {
    setEditingCriteria(criteria);
  };

  const handleDone = () => {
    setEditingCriteria(null);
  };

  return (
    <div className="w-full bg-gray-50 p-4 sm:p-6 space-y-8">
      <header>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Rating criteria & scale</h1>
          <nav aria-label="Breadcrumb" className="flex items-center text-sm text-gray-500">
            <Link to="/dashboard" className="hover:text-gray-700">Dashboard</Link>
            <ChevronRight size={16} className="mx-1" />
            <span className="font-medium text-gray-600">Rating</span>
            <ChevronRight size={16} className="mx-1" />
            <span className="font-medium text-gray-800">Rating criteria & scale</span>
          </nav>
        </div>
      </header>

      <main className="space-y-8">
    
        <RatingScaleComponent />

     
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      
          <CriteriaListComponent onEdit={handleEdit} />
        
          <div>
            <CriteriaFormComponent editingCriteria={editingCriteria} onDone={handleDone} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default RatingCriteriaPage;
