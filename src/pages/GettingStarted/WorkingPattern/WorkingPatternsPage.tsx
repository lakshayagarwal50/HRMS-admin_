import React, { useState } from 'react';
import { Plus } from 'lucide-react';

// Import your generic table component and its types
import Table, { type Column } from '../../../layout/Table'

// Define the structure for a working pattern
interface WorkingPattern {
  id: number; // Added an ID for unique keys in the table
  code: string;
  name: string;
  week1: boolean[];
  week2: boolean[];
  week3: boolean[];
  week4: boolean[];
}

// A small helper component to display the weekly pattern
const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const WeekDisplay: React.FC<{ pattern: boolean[] }> = ({ pattern }) => (
  <div className="flex space-x-1">
    {pattern.map((isWorking, index) => (
      <span
        key={index}
        className={`flex items-center justify-center w-6 h-6 text-xs font-bold text-white rounded ${
          isWorking ? 'bg-green-500' : 'bg-red-500'
        }`}
      >
        {daysOfWeek[index]}
      </span>
    ))}
  </div>
);

// Define the columns for the generic Table component
const columns: Column<WorkingPattern>[] = [
  { header: 'Code', key: 'code' },
  { header: 'Name', key: 'name' },
  {
    header: 'Week 1',
    key: 'week1',
    render: (row) => <WeekDisplay pattern={row.week1} />,
  },
  {
    header: 'Week 2',
    key: 'week2',
    render: (row) => <WeekDisplay pattern={row.week2} />,
  },
  {
    header: 'Week 3',
    key: 'week3',
    render: (row) => <WeekDisplay pattern={row.week3} />,
  },
  {
    header: 'Week 4',
    key: 'week4',
    render: (row) => <WeekDisplay pattern={row.week4} />,
  },
  {
    header: 'Action',
    key: 'action',
    className: 'text-center',
    render: (row) => (
      <button
        onClick={(e) => {
          e.stopPropagation();
          console.log('Edit pattern:', row.name);
        }}
        className="font-medium text-purple-600 hover:text-purple-800"
      >
        Edit
      </button>
    ),
  },
];

// Sample data with unique IDs
const samplePatterns: WorkingPattern[] = [
  {
    id: 1,
    code: '123',
    name: '5 day Week',
    week1: [false, true, true, true, true, true, false],
    week2: [false, true, true, true, true, true, false],
    week3: [false, true, true, true, true, true, false],
    week4: [false, true, true, true, true, true, false],
  },
  {
    id: 2,
    code: '123',
    name: 'Alternate',
    week1: [false, true, true, true, true, true, false],
    week2: [true, false, false, false, false, false, true],
    week3: [false, true, true, true, true, true, false],
    week4: [true, false, false, false, false, false, true],
  },
];


const WorkingPatternsPage: React.FC = () => {
  const [, setIsModalOpen] = useState(false);

  return (
    <div className="w-full">
      {/* Page Header */}
      <header className="bg-white shadow-sm mb-8">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Working Patterns</h1>
            <nav aria-label="Breadcrumb" className="mt-1">
              <ol className="flex items-center space-x-2 text-sm">
                <li><a href="/dashboard" className="text-gray-500 hover:text-gray-700">Dashboard</a></li>
                <li><span className="text-gray-500">/</span></li>
                <li><a href="/getting-started" className="text-gray-500 hover:text-gray-700">Getting Started</a></li>
                <li><span className="text-gray-500">/</span></li>
                <li><span className="text-gray-900 font-medium">Working Patterns</span></li>
              </ol>
            </nav>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <Plus size={20} className="-ml-1 mr-2" />
            ADD NEW
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Using your generic Table component */}
        <Table
          columns={columns}
          data={samplePatterns}
          showSearch={false} // Search is disabled as per the design
          showPagination={false} // Pagination is disabled as per the design
        />
      </main>
      
      {/* You would render your "Add New" modal here */}
      {/* <CreateWorkingPatternModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} /> */}
    </div>
  );
};

export default WorkingPatternsPage;
