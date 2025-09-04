/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { RatingModal } from '../Modal/RatingModal';
import type { ProjectRating } from '../../store/slice/employeeRatingDetailSlice';


interface MonthPerformance {
  name: string;
  score: number;
}

const performanceData: MonthPerformance[] = [
  { name: 'January 2022', score: 4.2 },
  { name: 'February 2022', score: 0 },
  { name: 'March 2022', score: 4.5 },
  { name: 'April 2022', score: 4.9 },
  { name: 'May 2022', score: 4.2 },
  { name: 'June 2022', score: 3.8 },
  { name: 'July 2022', score: 0 },
  { name: 'August 2022', score: 4.9 },
  { name: 'September 2022', score: 4.2 },
  { name: 'October 2022', score: 3.8 },
  { name: 'November 2022', score: 4.5 },
  { name: 'December 2022', score: 4.9 },
];

const MonthCard: React.FC<{ month: MonthPerformance; onViewRating: (month: MonthPerformance) => void; }> = ({ month, onViewRating }) => (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex justify-between items-center">
        <div>
            <p className="text-sm font-medium text-gray-800">{month.name}</p>
            {month.score > 0 ? (
                <div className="mt-1 w-12 h-12 bg-purple-600 text-white font-bold text-lg rounded-lg flex items-center justify-center">
                    {month.score.toFixed(1)}
                </div>
            ) : (
                <div className="mt-1 text-sm text-gray-400 italic">No Rating</div>
            )}
        </div>
        {month.score > 0 && (
            // 2. The button now calls the handler to open the modal
            <button onClick={() => onViewRating(month)} className="p-2 rounded-full hover:bg-gray-200">
                <ArrowRight size={20} className="text-gray-600" />
            </button>
        )}
    </div>
);

// --- MAIN COMPONENT ---
const MonthlyPerformanceCalendar: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState('2022');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMonthData, setSelectedMonthData] = useState<MonthPerformance | null>(null);

  const handleViewRatingClick = (month: MonthPerformance) => {
    setSelectedMonthData(month);
    setIsModalOpen(true);
  };
  const filteredData = performanceData.filter(month => month.name.includes(selectedYear));

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Monthly Performance Calendar</h2>
          <div className="relative">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="appearance-none w-full pl-3 pr-8 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option>2021</option>
              <option>2022</option>
              <option>2023</option>
            </select>
            <ChevronDown size={16} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>
        </div>
        {filteredData.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {filteredData.map(month => (
                    <MonthCard key={month.name} month={month} onViewRating={handleViewRatingClick} />
                ))}
            </div>
        ) : (
            <div className="text-center py-8 text-gray-500">
                No performance data available for the selected year.
            </div>
        )}
      </div>

      {/* 4. Render the RatingModal */}
      <RatingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        month={selectedMonthData?.name || ''} projects={[]} onEdit={function (_rating: ProjectRating): void {
          throw new Error('Function not implemented.');
        } }      />
    </>
  );
};

export default MonthlyPerformanceCalendar;
