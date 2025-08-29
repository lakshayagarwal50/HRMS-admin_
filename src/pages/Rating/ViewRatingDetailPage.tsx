import React, { useEffect, useState, useMemo } from 'react';
import { ChevronRight, ChevronDown, ArrowRight, ServerCrash } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch, RootState } from '../../store/store';
// Updated imports to use the new slice
import { fetchEmployeeRatingDetail, clearDetail } from '../../store/slice/employeeRatingDetailSlice'; 
import EditRatingModal from '../../components/Modal/EditRatingModal'; // Adjust path
import { RatingModal } from '../../components/Modal/RatingModal';

// --- UI State Components ---
const LoadingSkeleton: React.FC = () => (
    <div className="space-y-6 animate-pulse">
        <div className="bg-white p-6 rounded-lg shadow-md"><div className="grid grid-cols-1 sm:grid-cols-4 gap-4"><div className="h-16 bg-gray-200 rounded-lg"></div><div className="h-16 bg-gray-200 rounded-lg"></div><div className="h-16 bg-gray-200 rounded-lg"></div><div className="h-16 bg-gray-200 rounded-lg"></div></div></div>
        <div className="bg-white p-6 rounded-lg shadow-md h-48"></div>
        <div className="bg-white p-6 rounded-lg shadow-md h-64"></div>
    </div>
);

const ErrorState: React.FC<{ message: string | null }> = ({ message }) => (
    <div className="text-center py-10 bg-red-50 border rounded-lg"><ServerCrash className="mx-auto h-12 w-12 text-red-400" /><h3 className="mt-2 text-lg font-semibold text-red-800">Could Not Load Details</h3><p className="mt-1 text-sm text-red-600">{message || 'An unexpected error occurred.'}</p></div>
);

const NotFoundState: React.FC = () => (
     <div className="text-center py-10 bg-gray-50 border rounded-lg"><h3 className="text-lg font-semibold text-gray-800">Employee Not Found</h3><p className="mt-1 text-sm text-gray-600">The rating details for this employee could not be found for the selected year.</p></div>
);

// --- Reusable Sub-Components ---
const InfoField: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="bg-gray-50 p-4 rounded-lg border"><label className="block text-xs font-medium text-gray-500">{label}</label><p className="text-md font-semibold text-gray-900">{value}</p></div>
);

const SkillBadge: React.FC<{ name: string; score: number }> = ({ name, score }) => (
  <div className="flex items-center gap-3"><div className="flex-shrink-0 w-12 h-12 bg-purple-600 text-white font-bold text-lg rounded-lg flex items-center justify-center">{score.toFixed(1)}</div><span className="text-sm text-gray-700">{name}</span></div>
);

const MonthCard: React.FC<{ month: { name: string; score: number }; onViewRating: () => void; }> = ({ month, onViewRating }) => (
    <div className="bg-gray-50 p-4 rounded-lg border flex justify-between items-center">
        <div><p className="text-sm font-medium">{month.name}</p>{month.score > 0 ? <div className="mt-1 w-12 h-12 bg-purple-600 text-white font-bold text-lg rounded-lg flex items-center justify-center">{month.score.toFixed(1)}</div> : <div className="mt-1 text-sm text-gray-400 italic">No Rating</div>}</div>
        {month.score > 0 && <button onClick={onViewRating} className="p-2 rounded-full hover:bg-gray-200"><ArrowRight size={20} className="text-gray-600" /></button>}
    </div>
);

// --- MAIN PAGE COMPONENT ---
const ViewRatingDetailPage: React.FC = () => {
  const { employeeId, year } = useParams<{ employeeId: string, year: string }>();
  const dispatch = useDispatch<AppDispatch>();
  // Corrected: Select state from the new 'employeeRatingDetail' slice
  const { data: ratingDetail, status, error } = useSelector((state: RootState) => state.employeeRatingDetail);
  
  const [selectedYear, setSelectedYear] = useState(year || '2025');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMonthData, setSelectedMonthData] = useState<any>(null);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  useEffect(() => {
    if (employeeId) {
      // Corrected: Dispatch the correct thunk with both parameters
      dispatch(fetchEmployeeRatingDetail({ employeeId, year: selectedYear }));
    }
    // Clear the selected rating when the component unmounts
    return () => {
        dispatch(clearDetail());
    }
  }, [dispatch, employeeId, selectedYear]);

  const handleViewRatingClick = (monthName: string) => {
    const monthData = ratingDetail?.ratings[monthName];
    if (monthData) {
        setSelectedMonthData({ name: `${monthName} ${selectedYear}`, data: monthData });
        setIsModalOpen(true);
    }
  };
  
  const handleEditClick = (project: any) => {
      setSelectedProject(project);
      setIsModalOpen(false); // Close the view modal
      setIsEditModalOpen(true);
  };

  const { averageSkills, monthlyPerformance } = useMemo(() => {
    const ratings = ratingDetail?.ratings || {};
    const skillTotals: { [key: string]: { total: number; count: number } } = {};
    const monthlyPerformanceData: { name: string; score: number }[] = [];

    for (const monthName in ratings) {
        const monthData = ratings[monthName];
        monthlyPerformanceData.push({ name: monthName, score: monthData.monthlyAverage || 0 });
        monthData.projects?.forEach((project: any) => {
            for (const skillName in project.scores) {
                if (!skillTotals[skillName]) {
                    skillTotals[skillName] = { total: 0, count: 0 };
                }
                skillTotals[skillName].total += project.scores[skillName];
                skillTotals[skillName].count += 1;
            }
        });
    }
    
    const averageSkillsData = Object.entries(skillTotals).map(([name, data]) => ({
        name: name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
        score: data.total / data.count,
    }));

    return { averageSkills: averageSkillsData, monthlyPerformance: monthlyPerformanceData };
  }, [ratingDetail]);


  const renderContent = () => {
    if (status === 'loading' || status === 'idle') return <LoadingSkeleton />;
    if (status === 'failed') return <ErrorState message={error} />;
    if (!ratingDetail) return <NotFoundState />;

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <InfoField label="Name:" value={ratingDetail.empName} />
                    <InfoField label="Designation" value={ratingDetail.designation} />
                    <InfoField label="Department" value={ratingDetail.department} />
                    <InfoField label="Experience" value={`${ratingDetail.yearOfExperience} Yrs`} />
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Average rating</h2>
                    <span className="text-sm text-gray-500">January {selectedYear} - Till Now</span>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-shrink-0 w-32 h-32 bg-purple-100 text-purple-700 font-extrabold text-5xl rounded-full flex items-center justify-center">{ratingDetail.overallAverage.toFixed(1)}</div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-4 w-full">
                        {averageSkills.map(skill => <SkillBadge key={skill.name} name={skill.name} score={skill.score} />)}
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Monthly Performance Calendar</h2>
                    <div className="relative"><select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="appearance-none w-full pl-3 pr-8 py-2 border rounded-md text-sm"><option>2024</option><option>2025</option></select><ChevronDown size={16} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" /></div>
                </div>
                {monthlyPerformance.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {monthlyPerformance.map(month => <MonthCard key={month.name} month={month} onViewRating={() => handleViewRatingClick(month.name)} />)}
                    </div>
                ) : <div className="text-center py-8 text-gray-500">No data for {selectedYear}.</div>}
            </div>
        </div>
    );
  };

  return (
    <div className="w-full space-y-6 p-6 bg-gray-50 min-h-screen">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Rating</h1>
        <nav aria-label="Breadcrumb" className="mt-1 flex items-center text-sm text-gray-500">
          <Link to="/dashboard" className="hover:text-gray-700">Dashboard</Link>
          <ChevronRight size={16} className="mx-1" />
          <Link to="/rating/employees-rating" className="hover:text-gray-700">Employees rating</Link>
          <ChevronRight size={16} className="mx-1" />
          <span className="font-medium text-gray-800">View details</span>
        </nav>
      </header>
      <main>
        {renderContent()}
      </main>
      <RatingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        monthData={selectedMonthData}
        onEdit={handleEditClick}
      />
      <EditRatingModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        ratingData={selectedProject}
        employeeId={employeeId}
        year={selectedYear}
        month={selectedMonthData?.name.split(' ')[0]}
      />
    </div>
  );
};

export default ViewRatingDetailPage;
