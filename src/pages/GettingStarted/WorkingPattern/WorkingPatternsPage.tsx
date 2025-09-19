import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, ChevronRight, RefreshCw, ServerCrash } from 'lucide-react';
import { Link } from 'react-router-dom';

// --- Redux Imports ---
import { fetchWorkingPatterns, type WorkingPattern } from '../../../store/slice/workingPatternsSlice'; // Adjust path
import type { AppDispatch, RootState } from '../../../store/store'; // Adjust path

// --- Component Imports ---
import Table, { type Column } from "../../../components/common/Table"; // Corrected path
import CreateWorkingPattern from '../../../components/WorkingPattern/CreateWorkingPattern'; // Corrected path
import UpdateWorkingPattern from '../../../components/WorkingPattern/UpdateWorkingPattern'; // Corrected path

// --- UI State Components ---
const TableSkeleton: React.FC = () => (
    <div className="w-full bg-white p-4 rounded-lg border border-gray-200 animate-pulse">
        <div className="space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-gray-200 rounded-md w-full"></div>)}
        </div>
    </div>
);

const ErrorState: React.FC<{ onRetry: () => void; error: string | null }> = ({ onRetry, error }) => (
    <div className="text-center py-10 px-4 bg-red-50 border border-red-200 rounded-lg">
        <ServerCrash className="mx-auto h-12 w-12 text-red-400" />
        <h3 className="mt-2 text-lg font-semibold text-red-800">Failed to Load Data</h3>
        <p className="mt-1 text-sm text-red-600">{error || 'An unknown error occurred.'}</p>
        <div className="mt-6">
            <button type="button" onClick={onRetry} className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700">
                <RefreshCw className="-ml-1 mr-2 h-5 w-5" />
                Try Again
            </button>
        </div>
    </div>
);

const EmptyState: React.FC<{ onAddNew: () => void }> = ({ onAddNew }) => (
    <div className="text-center py-10 px-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h3 className="mt-2 text-lg font-semibold text-gray-800">No Working Patterns Found</h3>
        <p className="mt-1 text-sm text-gray-600">
            Get started by adding a new working pattern.
        </p>
        <div className="mt-6">
            <button type="button" onClick={onAddNew} className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700">
                <Plus size={20} className="-ml-1 mr-2" />
                Add New Pattern
            </button>
        </div>
    </div>
);

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

  const [isCreatePanelOpen, setCreatePanelOpen] = useState(false);
  const [editingPattern, setEditingPattern] = useState<WorkingPattern | null>(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchWorkingPatterns());
    }
  }, [status, dispatch]);

  const handleEditClick = useCallback((pattern: WorkingPattern) => {
    setEditingPattern(pattern);
  }, []);

  const columns = useMemo<Column<WorkingPattern>[]>(() => [
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
  ], [handleEditClick]);

  const renderContent = () => {
    if ((status === 'loading' || status === 'idle') && patterns.length === 0) {
      return <TableSkeleton />;
    }

    if (status === 'failed' && patterns.length === 0) {
      return <ErrorState onRetry={() => dispatch(fetchWorkingPatterns())} error={error} />;
    }

    if (status === 'succeeded' && patterns.length === 0) {
      return <EmptyState onAddNew={() => setCreatePanelOpen(true)} />;
    }

    return (
      <Table
        columns={columns}
        data={patterns}
        showSearch={true}
        searchPlaceholder="Search by name or code..."
      />
    );
  };

  return (
    <div className="w-full bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-md">
      <header className="mb-6">
        <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Working Patterns</h1>
                <nav aria-label="Breadcrumb" className="mt-1 flex items-center text-sm text-gray-500">
                    <Link to="/getting-started" className="hover:text-gray-700">Getting Started</Link>
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
        {renderContent()}
      </main>
      
      <CreateWorkingPattern isOpen={isCreatePanelOpen} onClose={() => setCreatePanelOpen(false)} />
      <UpdateWorkingPattern isOpen={!!editingPattern} onClose={() => setEditingPattern(null)} patternData={editingPattern} />
    </div>
  );
};

export default WorkingPatternsPage;
