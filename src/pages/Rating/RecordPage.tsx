import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// --- Component Imports ---
import Table, { type Column } from '../../components/common/Table'; // Assuming this is the correct path

// --- TYPE DEFINITIONS ---
interface Record {
  month: string;
  requestedDate: string;
  employeeWindow: string;
  managerWindow: string;
}

// --- MOCK DATA ---
// Static data to match the provided screenshot
const recordData: Record[] = [
  { month: 'December', requestedDate: '25 Apr, 2022', employeeWindow: '15 Jul, 2022 - 22 Jun, 2022', managerWindow: '30 Jun, 2022 - 30 Aug, 2022' },
  { month: 'November', requestedDate: '25 Apr, 2022', employeeWindow: '15 Jul, 2022 - 22 Jun, 2022', managerWindow: '30 Jun, 2022 - 30 Aug, 2022' },
  { month: 'October', requestedDate: '25 Apr, 2022', employeeWindow: '15 Jul, 2022 - 22 Jun, 2022', managerWindow: '30 Jun, 2022 - 30 Aug, 2022' },
  { month: 'September', requestedDate: '14 Jun, 2022', employeeWindow: '1 Jul, 2022 - 30 Jul, 2022', managerWindow: '15 Jul, 2022 - 30 Jun, 2022' },
  { month: 'August', requestedDate: '14 Jun, 2022', employeeWindow: '1 Jul, 2022 - 30 Jul, 2022', managerWindow: '15 Jul, 2022 - 30 Jun, 2022' },
  { month: 'June', requestedDate: 'NA', employeeWindow: 'NA', managerWindow: 'NA' },
  { month: 'May', requestedDate: 'NA', employeeWindow: 'NA', managerWindow: 'NA' },
  { month: 'April', requestedDate: 'NA', employeeWindow: 'NA', managerWindow: 'NA' },
  { month: 'March', requestedDate: '29 May, 2022', employeeWindow: '10 Apr, 2022 - 20 Apr, 2022', managerWindow: '05 May, 2022 - 25 Jun, 2022' },
  { month: 'February', requestedDate: '29 May, 2022', employeeWindow: '10 Apr, 2022 - 20 Apr, 2022', managerWindow: '05 May, 2022 - 25 Jun, 2022' },
  { month: 'January', requestedDate: '29 May, 2022', employeeWindow: '10 Apr, 2022 - 20 Apr, 2022', managerWindow: '05 May, 2022 - 25 Jun, 2022' },
];

// --- MAIN PAGE COMPONENT ---
const RecordPage: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState('2021');

  // Define columns for the generic Table component
  const columns: Column<Record>[] = [
    { key: 'month', header: 'Month' },
    { key: 'requestedDate', header: 'Requested Date' },
    { key: 'employeeWindow', header: 'Employee Open Window (From - to)' },
    { key: 'managerWindow', header: 'Manager Open window (From - to)' },
  ];

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-md">
      {/* Page Header */}
      <header className="mb-6">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Records</h1>
            <nav aria-label="Breadcrumb" className="mt-1 flex items-center text-sm text-gray-500">
              <Link to="/dashboard" className="hover:text-gray-700">Dashboard</Link>
              <ChevronRight size={16} className="mx-1" />
              <span className="font-medium text-gray-800">Rating</span>
              <ChevronRight size={16} className="mx-1" />
              <span className="font-medium text-gray-800">Records</span>
            </nav>
          </div>
          <div className="relative">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="appearance-none w-full pl-3 pr-8 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option>2021</option>
              <option>2022</option>
              <option>2023</option>
              <option>2024</option>
              <option>2025</option>
            </select>
            <ChevronDown size={16} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>
        </div>
      </header>

      {/* Main Content Area: Now using the generic Table component */}
      <main>
        <Table
          columns={columns}
          data={recordData}
          showSearch={true}
          showPagination={true}
          searchPlaceholder="Search records..."
        />
      </main>
    </div>
  );
};

export default RecordPage;
