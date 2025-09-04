import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface Skill {
  name: string;
  score: number;
}

interface ProjectRating {
  name: string;
  overallScore: number;
  skills: Skill[];
}

interface EditRatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  ratingData: ProjectRating | null;
}

const RatingScale: React.FC = () => (
    <div className="bg-gray-50 p-4 rounded-lg border">
        <h3 className="text-md font-semibold text-gray-800 mb-3">Rating Scale</h3>
        <div className="space-y-2 text-sm">
            <div className="flex items-center"><span className="font-bold w-6">1</span> <span className="text-gray-600">Non effective performer</span></div>
            <div className="flex items-center"><span className="font-bold w-6">2</span> <span className="text-gray-600">Minimal effective performer</span></div>
            <div className="flex items-center"><span className="font-bold w-6">3</span> <span className="text-gray-600">Effective performer</span></div>
            <div className="flex items-center"><span className="font-bold w-6">4</span> <span className="text-gray-600">Highly effective performer</span></div>
            <div className="flex items-center"><span className="font-bold w-6">5</span> <span className="text-gray-600">Exceptional performer</span></div>
        </div>
    </div>
);

const CriteriaRow: React.FC<{
    criteria: string;
    empScore: number;
    yourScore: number;
    onScoreChange: (score: number) => void;
}> = ({ criteria, empScore, yourScore, onScoreChange }) => (
    <div className="grid grid-cols-4 items-center py-3 border-b">
        <span className="text-sm font-medium text-gray-800">{criteria}</span>
        <span className="text-sm text-center">{empScore.toFixed(1)}</span>
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
                step="0.1" 
                min="0"
                max="5"
                className="w-20 text-center border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
            />
        </div>
        <span className="text-sm text-center font-semibold">{yourScore.toFixed(1)}</span>
    </div>
);

const EditRatingModal: React.FC<EditRatingModalProps> = ({ isOpen, onClose, ratingData }) => {
  const [scores, setScores] = useState<{ [key: string]: number }>({});
  const [developmentArea, setDevelopmentArea] = useState('');

 
  useEffect(() => {
    if (isOpen && ratingData) {
      const initialScores = ratingData.skills.reduce((acc, skill) => {
        acc[skill.name] = skill.score;
        return acc;
      }, {} as { [key: string]: number });
      setScores(initialScores);
      setDevelopmentArea('');
    }
  }, [isOpen, ratingData]);

  const handleScoreChange = (criteria: string, score: number) => {
    setScores(prev => ({ ...prev, [criteria]: score }));
  };

  const calculateOverallScore = () => {
      const scoreValues = Object.values(scores);
      if (scoreValues.length === 0) return 0;
      const total = scoreValues.reduce((sum, score) => sum + score, 0);
      return (total / scoreValues.length);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      updatedScores: scores,
      overallScore: calculateOverallScore(),
      developmentArea,
    });
    onClose();
  };

  if (!isOpen || !ratingData) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-60 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <header className="flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-bold text-gray-900">Monthly Resource Rating ({ratingData.name})</h2>
                <button type="button" onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
                    <X size={24} />
                </button>
            </header>

            <main className="flex-1 p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <div className="grid grid-cols-4 py-2 border-b font-semibold text-xs text-gray-500 uppercase">
                        <span>Criterias</span>
                        <span className="text-center">Emp Score</span>
                        <span className="text-center">Your Rating</span>
                        <span className="text-center">Your Score</span>
                    </div>
                    
                    <div className="divide-y">
                        {ratingData.skills.map(skill => (
                            <CriteriaRow
                                key={skill.name}
                                criteria={skill.name}
                                empScore={skill.score}
                                yourScore={scores[skill.name] || 0}
                                onScoreChange={(score) => handleScoreChange(skill.name, score)}
                            />
                        ))}
                    </div>

                    
                    <div className="mt-6 p-4 bg-purple-50 rounded-lg flex items-center justify-between">
                        <span className="text-md font-bold text-gray-800">Overall Score</span>
                        <span className="text-2xl font-extrabold text-purple-700">{calculateOverallScore().toFixed(1)}</span>
                    </div>
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Area of Development</label>
                        <textarea
                            value={developmentArea}
                            onChange={(e) => setDevelopmentArea(e.target.value)}
                            rows={3}
                            placeholder="Write here"
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                </div>

                <div className="md:col-span-1">
                    <RatingScale />
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

export default EditRatingModal;
