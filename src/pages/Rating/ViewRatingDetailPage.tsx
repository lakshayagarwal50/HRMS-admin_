import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

// --- Component Imports ---
import AverageRating from '../../components/Rating/AverageRating'; // Adjust path if needed
import MonthlyPerformanceCalendar from '../../components/Rating//MonthlyPerformanceCalendar'; // Adjust path if needed

// --- Reusable Info Field Component ---
const InfoField: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <label className="block text-xs font-medium text-gray-500">{label}</label>
        <p className="text-md font-semibold text-gray-900">{value}</p>
    </div>
);

// --- MAIN PAGE COMPONENT ---
const ViewRatingDetailPage: React.FC = () => {
  // In a real app, you would use the ID to fetch employee data
  const { employeeId } = useParams<{ employeeId: string }>();

  // Mock data for the employee
  const employeeData = {
      name: 'Nakul Seshadri',
      designation: 'Designer',
      department: 'Designing',
      experience: '5.5 Yrs'
  };

  return (
    <div className="w-full space-y-6">
      {/* Page Header */}
      <header>
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Rating</h1>
            <nav aria-label="Breadcrumb" className="mt-1 flex items-center text-sm text-gray-500">
              <Link to="/dashboard" className="hover:text-gray-700">Dashboard</Link>
              <ChevronRight size={16} className="mx-1" />
              <Link to="/rating" className="hover:text-gray-700">Rating</Link>
              <ChevronRight size={16} className="mx-1" />
              <Link to="/rating/employees rating" className="hover:text-gray-700">Employees rating</Link>
              <ChevronRight size={16} className="mx-1" />
              <span className="font-medium text-gray-800">View details</span>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="space-y-6">
        {/* Employee Info Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <InfoField label="Name:" value={employeeData.name} />
                <InfoField label="Designation" value={employeeData.designation} />
                <InfoField label="Department" value={employeeData.department} />
                <InfoField label="Experience" value={employeeData.experience} />
            </div>
        </div>

        {/* Average Rating Component */}
        <AverageRating />

        {/* Monthly Performance Calendar Component */}
        <MonthlyPerformanceCalendar />
      </main>
    </div>
  );
};

export default ViewRatingDetailPage;
