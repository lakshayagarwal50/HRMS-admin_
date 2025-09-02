import React, { useState, useEffect } from 'react';
import { X, Edit2, RefreshCw } from 'lucide-react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../store/store';
import { updateEmployeeRating, type Scores, type ProjectRating as ApiProjectRating } from '../../store/slice/employeeRatingDetailSlice';

// --- TYPE DEFINITIONS ---
interface EditRatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  ratingData: ApiProjectRating | null;
  employeeId: string;
  year: string;
  month: string;
}

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  month: string;
  projects: ApiProjectRating[];
  onEdit: (rating: ApiProjectRating, month: string) => void;
}


// --- Reusable Project Rating Card for RatingModal ---
const ProjectRatingCard: React.FC<{ rating: ApiProjectRating; onEdit: () => void; }> = ({ rating, onEdit }) => (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div className="flex justify-between items-start mb-4">
            <div>
                <h3 className="font-semibold text-gray-800">{rating.projectName}</h3>
                <p className="text-xs text-gray-500 mt-1">
                    REVIEWED BY: <span className="text-purple-600 font-medium">{rating.reviewerName}</span>
                </p>
            </div>
            <button onClick={onEdit} className="p-2 text-purple-600 hover:bg-purple-100 rounded-md">
                <Edit2 size={16} />
            </button>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0 w-24 h-24 bg-purple-100 text-purple-700 font-extrabold text-4xl rounded-lg flex items-center justify-center">
                {rating.overallProjectRating.toFixed(1)}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3 w-full">
                {Object.entries(rating.scores).map(([name, score]) => (
                    <div key={name} className="flex items-center gap-2">
                        <span className="w-10 h-10 bg-purple-600 text-white font-bold text-sm rounded-md flex items-center justify-center">
                            {score.toFixed(1)}
                        </span>
                        <span className="text-xs text-gray-600 capitalize">{name.replace(/([A-Z])/g, ' $1')}</span>
                    </div>
                ))}
            </div>
        </div>
        {rating.areaOfDevelopment && (
            <div className="mt-4 p-3 bg-purple-100 border border-purple-200 rounded-md text-sm text-purple-800">
                <span className="font-semibold">Area of Development:</span> {rating.areaOfDevelopment}
            </div>
        )}
    </div>
);


// --- RatingModal (View Only) ---
export const RatingModal: React.FC<RatingModalProps> = ({ isOpen, onClose, month, projects, onEdit }) => {
  if (!isOpen) return null;

  return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
          <header className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-bold text-gray-900">Ratings ({month})</h2>
            <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-200">
              <X size={18} />
            </button>
          </header>
          <main className="p-6 overflow-y-auto space-y-4">
              {projects.length > 0 ? (
                projects.map(project => (
                  <ProjectRatingCard 
                    key={project.projectName} 
                    rating={project} 
                    onEdit={() => onEdit(project, month)}
                  />
                ))
              ) : (
                <p className="text-center text-gray-500">No project ratings available for this month.</p>
              )}
          </main>
        </div>
      </div>
  );
};


// --- EditRatingModal ---
const RatingScale: React.FC = () => (
    <div className="bg-gray-50 p-4 rounded-lg border">
        <h3 className="text-md font-semibold text-gray-800 mb-3">Rating Scale</h3>
        <div className="space-y-2 text-sm">
            <div className="flex items-center"><span className="font-bold w-6">1</span> <span className="text-gray-600">Non effective</span></div>
            <div className="flex items-center"><span className="font-bold w-6">2</span> <span className="text-gray-600">Minimal effective</span></div>
            <div className="flex items-center"><span className="font-bold w-6">3</span> <span className="text-gray-600">Effective</span></div>
            <div className="flex items-center"><span className="font-bold w-6">4</span> <span className="text-gray-600">Highly effective</span></div>
            <div className="flex items-center"><span className="font-bold w-6">5</span> <span className="text-gray-600">Exceptional</span></div>
        </div>
    </div>
);

const CriteriaRow: React.FC<{ criteria: string; empScore: number; yourScore: number; onScoreChange: (score: number) => void;}> = ({ criteria, empScore, yourScore, onScoreChange }) => (
    <div className="grid grid-cols-4 items-center py-3 border-b">
        <span className="text-sm font-medium text-gray-800 capitalize">{criteria.replace(/([A-Z])/g, ' $1')}</span>
        <span className="text-sm text-center">{empScore.toFixed(1)}</span>
        <div className="flex justify-center">
            <input type="number" value={yourScore} onChange={(e) => { const val = parseFloat(e.target.value); if (!isNaN(val) && val >= 0 && val <= 5) onScoreChange(val); else if (e.target.value === '') onScoreChange(0); }} step="0.1" min="0" max="5" className="w-20 text-center border rounded-md" />
        </div>
        <span className="text-sm text-center font-semibold">{yourScore.toFixed(1)}</span>
    </div>
);

export const EditRatingModal: React.FC<EditRatingModalProps> = ({ isOpen, onClose, ratingData, employeeId, year, month }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [scores, setScores] = useState<Partial<Scores>>({});
  const [developmentArea, setDevelopmentArea] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && ratingData) {
      // Provide a default empty object if scores is missing to prevent crashes
      setScores(ratingData.scores || {});
      setDevelopmentArea(ratingData.areaOfDevelopment || '');
    }
  }, [isOpen, ratingData]);

  const handleScoreChange = (criteria: keyof Scores, score: number) => {
    setScores(prev => ({ ...prev, [criteria]: score }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (ratingData) {
        setIsSubmitting(true);
        try {
            await dispatch(updateEmployeeRating({
                employeeId,
                year,
                month,
                projectName: ratingData.projectName,
                scores,
                areaOfDevelopment: developmentArea, // Corrected: Use state variable
            })).unwrap();
        } catch (error) {
            console.error("Failed to update rating:", error);
        } finally {
            setIsSubmitting(false);
            onClose();
        }
    }
  };

  if (!isOpen || !ratingData) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <form onSubmit={handleSubmit} className="flex flex-col h-full">
                <header className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-bold text-gray-900">Monthly Resource Rating ({ratingData.projectName})</h2>
                    <button type="button" onClick={onClose} className="p-1 rounded-full hover:bg-gray-200"><X size={24} /></button>
                </header>
                <main className="flex-1 p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                        <div className="grid grid-cols-4 py-2 border-b font-semibold text-xs uppercase"><span >Criterias</span><span className="text-center">Emp Score</span><span className="text-center">Your Rating</span><span className="text-center">Your Score</span></div>
                        <div className="divide-y">
                            {/* *** THIS IS THE CORRECTED PART ***
                                This check prevents the crash if scores doesn't exist on ratingData
                            */}
                            {ratingData.scores && Object.entries(ratingData.scores).map(([key, value]) => (
                                <CriteriaRow key={key} criteria={key} empScore={value} yourScore={scores[key as keyof Scores] || 0} onScoreChange={(score) => handleScoreChange(key as keyof Scores, score)} />
                            ))}
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium mb-1">Area of Development</label>
                            <textarea value={developmentArea} onChange={(e) => setDevelopmentArea(e.target.value)} rows={3} className="w-full p-2 border rounded-md" />
                        </div>
                    </div>
                    <div className="md:col-span-1"><RatingScale /></div>
                </main>
                <footer className="flex justify-end p-4 border-t bg-gray-50 space-x-3">
                    <button type="button" onClick={onClose} className="px-6 py-2 text-sm font-semibold border rounded-md">CANCEL</button>
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="px-6 py-2 text-sm font-semibold text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed flex items-center"
                    >
                        {isSubmitting && <RefreshCw className="animate-spin mr-2" size={16} />}
                        UPDATE
                    </button>
                </footer>
            </form>
        </div>
    </div>
  );
};

