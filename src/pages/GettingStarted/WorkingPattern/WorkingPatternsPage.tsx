import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, ChevronRight, Loader2 } from 'lucide-react';

// --- Import your reusable components and Redux logic ---
import Table, { type Column } from "../../../components/common/Table"; // Corrected path
import { fetchWorkingPatterns } from '../../../store/slice/workingPatternsSlice'; // Adjust path
import type { AppDispatch, RootState } from '../../../store/store'; // Adjust path
import CreateWorkingPattern from '../../../components/WorkingPattern/CreateWorkingPattern'; // Corrected path
import UpdateWorkingPattern from '../../../components/WorkingPattern/UpdateWorkingPattern'; // Added import

// --- TYPE DEFINITION ---
// This now matches the transformed data shape from your slice
interface WorkingPattern {
  id: string;
  code: string;
  name: string;
  week1: boolean[];
  week2: boolean[];
  week3: boolean[];
  week4: boolean[];
}

// --- HELPER COMPONENT ---
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

// --- MAIN COMPONENT ---
const WorkingPatternsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: patterns, status, error } = useSelector((state: RootState) => state.workingPatterns);

  const [isCreatePanelOpen, setCreatePanelOpen] = React.useState(false);
  const [editingPattern, setEditingPattern] = React.useState<WorkingPattern | null>(null);

  // Fetch data when the component mounts
  React.useEffect(() => {
    dispatch(fetchWorkingPatterns());
  }, [dispatch]);

  const handleEditClick = (pattern: WorkingPattern) => {
    setEditingPattern(pattern);
  };

  const columns: Column<WorkingPattern>[] = [
    { header: 'Code', key: 'code' },
    { header: 'Name', key: 'name' },
    { header: 'Week 1', key: 'week1', render: (row) => <WeekDisplay pattern={row.week1} /> },
    { header: 'Week 2', key: 'week2', render: (row) => <WeekDisplay pattern={row.week2} /> },
    { header: 'Week 3', key: 'week3', render: (row) => <WeekDisplay pattern={row.week3} /> },
    { header: 'Week 4', key: 'week4', render: (row) => <WeekDisplay pattern={row.week4} /> },
    {
      header: 'Action',
      key: 'action',
      className: 'text-center',
      render: (row) => (
        <button onClick={() => handleEditClick(row)} className="font-medium text-purple-600 hover:text-purple-800">
          Edit
        </button>
      ),
    },
  ];

  return (
    <div className="w-full bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-md">
      <header className="mb-6">
        <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Working Patterns</h1>
                <nav aria-label="Breadcrumb" className="mt-1 flex items-center text-sm text-gray-500">
                    <a href="/dashboard" className="hover:text-gray-700">Dashboard</a>
                    <ChevronRight className="w-4 h-4 mx-1" />
                    <a href="/getting-started" className="hover:text-gray-700">Getting Started</a>
                    <ChevronRight className="w-4 h-4 mx-1" />
                    <span className="font-medium text-gray-800">Working Patterns</span>
                </nav>
            </div>
            <button
                onClick={() => setCreatePanelOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700"
            >
                <Plus size={20} className="-ml-1 mr-2" />
                ADD NEW
            </button>
        </div>
      </header>

      <main>
        {status === 'loading' && (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="animate-spin text-purple-600" size={32} />
          </div>
        )}
        {status === 'failed' && <div className="text-center text-red-500 py-10">{error}</div>}
        {status === 'succeeded' && (
          <Table
            columns={columns}
            data={patterns}
            showSearch={false}
            showPagination={true}
          />
        )}
      </main>
      
      <CreateWorkingPattern isOpen={isCreatePanelOpen} onClose={() => setCreatePanelOpen(false)} />
      <UpdateWorkingPattern isOpen={!!editingPattern} onClose={() => setEditingPattern(null)} patternData={editingPattern} />
    </div>
  );
};

export default WorkingPatternsPage;
