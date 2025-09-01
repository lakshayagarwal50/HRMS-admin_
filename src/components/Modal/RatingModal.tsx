import React, { useState, useEffect } from 'react';
import { X, Edit2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../store/store';
import { updateEmployeeRating, type Scores, type ProjectRating as ApiProjectRating } from '../../store/slice/employeesRatingSlice';

// --- TYPE DEFINITIONS to match the API response ---
// This now matches the 'scores' object from your API
export type SkillScores = Scores;

// This now matches a single project object from your API's 'ratings' data
export interface ProjectRating extends ApiProjectRating {
    // The slice already defines projectName, scores, etc. We can add any UI-specific fields here if needed.
}

// --- RATING MODAL (VIEW) ---
interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  monthData: { name: string; data: { projects: ProjectRating[] } } | null;
  onEdit: (project: ProjectRating) => void;
}

const ProjectRatingCard: React.FC<{ rating: ProjectRating; onEdit: () => void; }> = ({ rating, onEdit }) => (
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
                            {(score as number).toFixed(1)}
                        </span>
                        <span className="text-xs text-gray-600 capitalize">{name.replace(/([A-Z])/g, ' $1')}</span>
                    </div>
                ))}
            </div>
        </div>
        {rating.areaOfDevelopment && (
            <div className="mt-4 p-3 bg-purple-100 border border-purple-200 rounded-md text-sm text-purple-800">
                <span className="font-semibold">Area of Development :</span> {rating.areaOfDevelopment}
            </div>
        )}
    </div>
);

export const RatingModal: React.FC<RatingModalProps> = ({ isOpen, onClose, monthData, onEdit }) => {
  if (!isOpen || !monthData) return null;

  return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
          <header className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-bold text-gray-900">Ratings ({monthData.name})</h2>
            <button onClick={onClose} className="p-1.5 rounded-full bg-red-500 text-white hover:bg-red-600">
              <X size={18} />
            </button>
          </header>
          <main className="p-6 overflow-y-auto space-y-4">
              {monthData.data.projects.map(project => (
                  <ProjectRatingCard 
                    key={project.projectName} 
                    rating={project} 
                    onEdit={() => onEdit(project)}
                  />
              ))}
          </main>
        </div>
      </div>
  );
};


// --- EDIT RATING MODAL ---
interface EditRatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  ratingData: ProjectRating | null;
  employeeId: string; // Changed to non-optional as it's required
  year: string;       // Changed to non-optional
  month: string;      // Changed to non-optional
}

const CriteriaRow: React.FC<{ criteria: string; yourScore: number; onScoreChange: (score: number) => void; }> = ({ criteria, yourScore, onScoreChange }) => (
    <div className="grid grid-cols-3 items-center py-3 border-b">
        <span className="text-sm font-medium text-gray-800">{criteria}</span>
        <div className="flex justify-center">
            <input
                type="number"
                value={yourScore}
                onChange={(e) => {
                    const newScore = parseFloat(e.target.value);
                    if (!isNaN(newScore) && newScore >= 0 && newScore <= 5) {
                        onScoreChange(newScore);
                    } else if (e.target.value === '') {
                        onScoreChange(0);
                    }
                }}
                step="0.1" min="0" max="5"
                className="w-24 text-center border border-gray-300 rounded-md shadow-sm"
            />
        </div>
        <span className="text-sm text-center font-semibold">{yourScore.toFixed(1)}</span>
    </div>
);

export const EditRatingModal: React.FC<EditRatingModalProps> = ({ isOpen, onClose, ratingData, employeeId, year, month }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [scores, setScores] = useState<SkillScores | null>(null);
  const [developmentArea, setDevelopmentArea] = useState('');

  useEffect(() => {
    if (isOpen && ratingData) {
      setScores(ratingData.scores);
      setDevelopmentArea(ratingData.areaOfDevelopment || '');
    }
  }, [isOpen, ratingData]);

  const handleScoreChange = (criteria: keyof SkillScores, score: number) => {
    setScores(prev => (prev ? { ...prev, [criteria]: score } : null));
  };

  const calculateOverallScore = () => {
      if (!scores) return 0;
      const scoreValues = Object.values(scores);
      const total = scoreValues.reduce((sum, score) => sum + score, 0);
      return (total / scoreValues.length);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (employeeId && year && month && ratingData && scores) {
        dispatch(updateEmployeeRating({
            employeeId,
            year,
            month,
            projectName: ratingData.projectName,
            scores,
            areaOfDevelopment,
        }));
    }
    onClose();
  };

  if (!isOpen || !ratingData) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-60 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <header className="flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-bold text-gray-900">Edit Monthly Rating ({ratingData.projectName})</h2>
                <button type="button" onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
                    <X size={24} />
                </button>
            </header>

            <main className="flex-1 p-6 overflow-y-auto">
                <div className="grid grid-cols-3 py-2 border-b font-semibold text-xs text-gray-500 uppercase">
                    <span>Criterias</span>
                    <span className="text-center">Your Rating</span>
                    <span className="text-center">Your Score</span>
                </div>
                <div className="divide-y">
                    {scores && Object.entries(scores).map(([key, value]) => (
                        <CriteriaRow
                            key={key}
                            criteria={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            yourScore={value}
                            onScoreChange={(score) => handleScoreChange(key as keyof SkillScores, score)}
                        />
                    ))}
                </div>

                <div className="mt-6 p-4 bg-purple-50 rounded-lg flex items-center justify-between">
                    <span className="text-md font-bold text-gray-800">Overall Score</span>
                    <span className="text-2xl font-extrabold text-purple-700">{calculateOverallScore().toFixed(1)}</span>
                </div>
                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Area of Development</label>
                    <textarea value={developmentArea} onChange={(e) => setDevelopmentArea(e.target.value)} rows={3} className="w-full p-2 border rounded-md" />
                </div>
            </main>

            <footer className="flex justify-end p-4 border-t bg-gray-50 space-x-3">
                <button type="button" onClick={onClose} className="px-6 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100">
                    CANCEL
                </button>
                <button type="submit" className="px-6 py-2 text-sm font-semibold text-white bg-purple-600 rounded-md hover:bg-purple-700">
                    UPDATE
                </button>
            </footer>
        </form>
      </div>
    </div>
  );
};
