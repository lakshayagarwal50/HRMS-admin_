import React, { useState, useEffect, useMemo } from 'react';
import { ChevronDown, ChevronRight, ServerCrash, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';


import Table, { type Column } from '../../components/common/Table';
import type { AppDispatch, RootState } from '../../store/store';
import { fetchRecords, type Record } from '../../store/slice/recordSlice';

const TableSkeleton: React.FC = () => (
    <div className="w-full bg-white p-4 rounded-lg border border-gray-200 animate-pulse">
        <div className="space-y-3">
            {[...Array(10)].map((_, i) => <div key={i} className="h-10 bg-gray-200 rounded-md w-full"></div>)}
        </div>
    </div>
);

const ErrorState: React.FC<{ onRetry: () => void; error: string | null }> = ({ onRetry, error }) => (
    <div className="text-center py-10 px-4 bg-red-50 border border-red-200 rounded-lg">
        <ServerCrash className="mx-auto h-12 w-12 text-red-400" />
        <h3 className="mt-2 text-lg font-semibold text-red-800">Failed to Load Records</h3>
        <p className="mt-1 text-sm text-red-600">{error || 'An unknown error occurred.'}</p>
        <div className="mt-6">
            <button type="button" onClick={onRetry} className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700">
                <RefreshCw className="-ml-1 mr-2 h-5 w-5" />
                Try Again
            </button>
        </div>
    </div>
);



const RecordPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: records, status, error } = useSelector((state: RootState) => state.records);
  const [selectedYear, setSelectedYear] = useState('All');


  useEffect(() => {
    const yearToFetch = selectedYear === 'All' ? null : selectedYear;
    dispatch(fetchRecords(yearToFetch));
  }, [dispatch, selectedYear]);

  const columns: Column<Record>[] = useMemo(() => [
    { key: 'month', header: 'Month' },
    { key: 'requestedDate', header: 'Requested Date' },
    { key: 'employeeWindow', header: 'Employee Open Window (From - to)' },
    { key: 'managerWindow', header: 'Manager Open window (From - to)' },
  ], []);

  const renderContent = () => {
      if (status === 'loading' || status === 'idle') {
          return <TableSkeleton />;
      }
      if (status === 'failed') {
          const yearToFetch = selectedYear === 'All' ? null : selectedYear;
          return <ErrorState onRetry={() => dispatch(fetchRecords(yearToFetch))} error={error} />;
      }
      if (status === 'succeeded' && records.length > 0) {
          return (
            <Table
              columns={columns}
              data={records}
              showSearch={true}
              showPagination={true}
              searchPlaceholder="Search records..."
              defaultItemsPerPage={10}
            />
          );
      }
      return <div className="text-center p-10 bg-gray-50 rounded-lg border">No records found for the selected year.</div>;
  }

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-md">
      <header className="mb-6">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Records</h1>
            <nav aria-label="Breadcrumb" className="mt-1 flex items-center text-sm text-gray-500">
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
              <option>All</option>
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

      <main>
        {renderContent()}
      </main>
    </div>
  );
};

export default RecordPage;
