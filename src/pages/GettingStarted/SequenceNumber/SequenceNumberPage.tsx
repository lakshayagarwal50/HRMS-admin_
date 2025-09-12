import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, ChevronRight, RefreshCw, ServerCrash } from 'lucide-react';
import { Link } from 'react-router-dom';

// --- Redux Imports ---
import { fetchSequenceNumbers, type SequenceNumber } from '../../../store/slice/sequenceNumberSlice'; 
import type { RootState, AppDispatch } from '../../../store/store'; 

// --- Component Imports ---
import Table, { type Column } from '../../../components/common/Table'; 
import CreateSequenceNumber from '../../../components/SequenceNumber/CreateSequenceNumber'; 

// --- UI State Components ---
const TableSkeleton: React.FC = () => (
    <div className="w-full bg-white p-4 rounded-lg border border-gray-200 animate-pulse">
        <div className="space-y-3">
            {[...Array(2)].map((_, i) => <div key={i} className="h-12 bg-gray-200 rounded-md w-full"></div>)}
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
        <h3 className="mt-2 text-lg font-semibold text-gray-800">No Sequence Numbers Found</h3>
        <p className="mt-1 text-sm text-gray-600">
            Get started by adding a new sequence number.
        </p>
        <div className="mt-6">
            <button type="button" onClick={onAddNew} className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700">
                <Plus size={20} className="-ml-1 mr-2" />
                Add New Sequence
            </button>
        </div>
    </div>
);


// --- MAIN PAGE COMPONENT ---
const SequenceNumberPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: sequences, status, error } = useSelector((state: RootState) => state.sequenceNumbers);
  const [isCreatePanelOpen, setIsCreatePanelOpen] = useState(false);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchSequenceNumbers());
    }
  }, [status, dispatch]);

  const columns: Column<SequenceNumber>[] = [
    { key: 'type', header: 'Type' },
    { key: 'prefix', header: 'Prefix' },
    { key: 'nextAvailableNumber', header: 'Next available number' },
  ];

  const renderContent = () => {
      if ((status === 'loading' || status === 'idle') && sequences.length === 0) {
          return <TableSkeleton />;
      }
      if (status === 'failed' && sequences.length === 0) {
          return <ErrorState onRetry={() => dispatch(fetchSequenceNumbers())} error={error} />;
      }
      if (status === 'succeeded' && sequences.length === 0) {
          return <EmptyState onAddNew={() => setIsCreatePanelOpen(true)} />;
      }
      return (
          <Table
              columns={columns}
              data={sequences}
              showSearch={false}
              showPagination={false}
          />
      );
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-md">
      <header className="mb-6">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sequence Number</h1>
            <nav aria-label="Breadcrumb" className="mt-1 flex items-center text-sm text-gray-500">
              <Link to="/getting-started" className="hover:text-gray-700">Getting Started</Link>
              <ChevronRight size={16} className="mx-1" />
              <span className="font-medium text-gray-800">Sequence Number</span>
            </nav>
          </div>
          <button 
            onClick={() => setIsCreatePanelOpen(true)}
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

      <CreateSequenceNumber
        isOpen={isCreatePanelOpen}
        onClose={() => setIsCreatePanelOpen(false)}
      />
    </div>
  );
};

export default SequenceNumberPage;
