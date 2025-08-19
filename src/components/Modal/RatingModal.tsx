import React, { useState } from 'react';
import { X, Edit2 } from 'lucide-react';
import EditRatingModal from './EditRatingModal'; // 1. Import the new EditRatingModal

// --- TYPE DEFINITIONS ---
interface Skill {
  name: string;
  score: number;
}

// Updated to include optional fields for manager ratings
export interface ProjectRating {
  name: string;
  overallScore: number;
  skills: Skill[];
  reviewedBy?: {
      name: string;
      role: string;
  };
  developmentArea?: string;
}

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  month: string;
}

// --- MOCK DATA ---
const selfRatingData: ProjectRating[] = [
  { name: 'Project 1 (November)', overallScore: 4.2, skills: [
    { name: 'Clear goals', score: 4.0 }, { name: 'Accountability', score: 4.6 }, { name: 'Teamwork', score: 4.6 },
    { name: 'Technical skills', score: 5.0 }, { name: 'Communication levels', score: 3.8 }, { name: 'Conflicts well managed', score: 3.8 }
  ]},
  { name: 'Project 2 (November)', overallScore: 4.8, skills: [
    { name: 'Clear goals', score: 4.0 }, { name: 'Accountability', score: 4.6 }, { name: 'Teamwork', score: 4.6 },
    { name: 'Technical skills', score: 5.0 }, { name: 'Communication levels', score: 3.8 }, { name: 'Conflicts well managed', score: 3.8 }
  ]},
];

const managerRatingData: ProjectRating[] = [
    { 
      name: 'Project 1 (November)', 
      overallScore: 4.2, 
      skills: [
        { name: 'Clear goals', score: 4.0 }, { name: 'Accountability', score: 4.6 }, { name: 'Teamwork', score: 4.6 },
        { name: 'Technical skills', score: 5.0 }, { name: 'Communication levels', score: 3.8 }, { name: 'Conflicts well managed', score: 3.8 }
      ],
      reviewedBy: { name: 'Tanuja Kurtan', role: 'Project Manager' },
      developmentArea: 'Research more on the type of project you are assinged.'
    },
    { 
      name: 'Project 2 (November)', 
      overallScore: 4.8, 
      skills: [
        { name: 'Clear goals', score: 4.0 }, { name: 'Accountability', score: 4.6 }, { name: 'Teamwork', score: 4.6 },
        { name: 'Technical skills', score: 5.0 }, { name: 'Communication levels', score: 3.8 }, { name: 'Conflicts well managed', score: 3.8 }
      ],
      reviewedBy: { name: 'Tanuja Kurtan', role: 'Project Manager' },
      developmentArea: 'Research more on the type of project you are assinged.'
    },
];


// --- Reusable Project Rating Card ---
// 2. Update the card to accept an onEdit handler
const ProjectRatingCard: React.FC<{ rating: ProjectRating; onEdit: (rating: ProjectRating) => void; }> = ({ rating, onEdit }) => (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div className="flex justify-between items-start mb-4">
            <div>
                <h3 className="font-semibold text-gray-800">{rating.name}</h3>
                {rating.reviewedBy && (
                    <p className="text-xs text-gray-500 mt-1">
                        REVIEWED BY: <span className="text-purple-600 font-medium">{rating.reviewedBy.name}</span> ({rating.reviewedBy.role})
                    </p>
                )}
            </div>
            {/* 3. The Edit button now calls the onEdit handler */}
            {rating.reviewedBy && (
                <button onClick={() => onEdit(rating)} className="p-2 text-purple-600 hover:bg-purple-100 rounded-md">
                    <Edit2 size={16} />
                </button>
            )}
        </div>
        <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0 w-24 h-24 bg-purple-100 text-purple-700 font-extrabold text-4xl rounded-lg flex items-center justify-center">
                {rating.overallScore.toFixed(1)}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3 w-full">
                {rating.skills.map(skill => (
                    <div key={skill.name} className="flex items-center gap-2">
                        <span className="w-10 h-10 bg-purple-600 text-white font-bold text-sm rounded-md flex items-center justify-center">
                            {skill.score.toFixed(1)}
                        </span>
                        <span className="text-xs text-gray-600">{skill.name}</span>
                    </div>
                ))}
            </div>
        </div>
        {rating.developmentArea && (
            <div className="mt-4 p-3 bg-purple-100 border border-purple-200 rounded-md text-sm text-purple-800">
                <span className="font-semibold">Area of Development :</span> {rating.developmentArea}
            </div>
        )}
    </div>
);


// --- MAIN COMPONENT ---
const RatingModal: React.FC<RatingModalProps> = ({ isOpen, onClose, month }) => {
  const [activeTab, setActiveTab] = useState<'self' | 'manager'>('self');
  // 4. Add state to manage the edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState<ProjectRating | null>(null);

  const handleEditClick = (rating: ProjectRating) => {
      setSelectedRating(rating);
      setIsEditModalOpen(true);
  };

  if (!isOpen) {
    return null;
  }

  const currentData = activeTab === 'self' ? selfRatingData : managerRatingData;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
          <header className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-bold text-gray-900">Ratings ({month})</h2>
            <button onClick={onClose} className="p-1.5 rounded-full bg-red-500 text-white hover:bg-red-600">
              <X size={18} />
            </button>
          </header>

          <nav className="flex justify-center p-2 border-b">
              <button 
                  onClick={() => setActiveTab('self')}
                  className={`px-6 py-2 text-sm font-medium rounded-md ${activeTab === 'self' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                  Self Rating
              </button>
              <button 
                  onClick={() => setActiveTab('manager')}
                  className={`px-6 py-2 text-sm font-medium rounded-md ${activeTab === 'manager' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                  Manager Rating
              </button>
          </nav>

          <main className="p-6 overflow-y-auto space-y-4">
              {currentData.map(projectRating => (
                  <ProjectRatingCard 
                    key={projectRating.name} 
                    rating={projectRating} 
                    onEdit={handleEditClick} // Pass the handler to the card
                  />
              ))}
          </main>
        </div>
      </div>

      {/* 5. Render the EditRatingModal */}
      <EditRatingModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        ratingData={selectedRating}
      />
    </>
  );
};

export default RatingModal;
