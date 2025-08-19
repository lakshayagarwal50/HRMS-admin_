import React from 'react';

// --- TYPE DEFINITIONS ---
interface SkillRating {
  name: string;
  score: number;
}

interface AverageRatingProps {
  overall: number;
  skills: SkillRating[];
}

// --- MOCK DATA ---
const ratingData: AverageRatingProps = {
  overall: 4.2,
  skills: [
    { name: 'Clear goals', score: 4.0 },
    { name: 'Conflicts well managed', score: 4.6 },
    { name: 'Accountability', score: 3.8 },
    { name: 'Teamwork', score: 5.0 },
    { name: 'Technical skills', score: 5.0 },
    { name: 'Communication levels', score: 4.6 },
  ],
};

// --- Reusable Skill Badge Component ---
const SkillBadge: React.FC<{ skill: SkillRating }> = ({ skill }) => (
  <div className="flex items-center gap-3">
    <div className="flex-shrink-0 w-12 h-12 bg-purple-600 text-white font-bold text-lg rounded-lg flex items-center justify-center">
      {skill.score.toFixed(1)}
    </div>
    <span className="text-sm text-gray-700">{skill.name}</span>
  </div>
);


// --- MAIN COMPONENT ---
const AverageRating: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">Average rating</h2>
        <span className="text-sm text-gray-500">January 2022 - Till Now</span>
      </div>
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Overall Rating Circle */}
        <div className="flex-shrink-0 w-32 h-32 bg-purple-100 text-purple-700 font-extrabold text-5xl rounded-full flex items-center justify-center">
          {ratingData.overall.toFixed(1)}
        </div>
        {/* Skills List */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-4 w-full">
          {ratingData.skills.map(skill => (
            <SkillBadge key={skill.name} skill={skill} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AverageRating;
