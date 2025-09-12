import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, MoreHorizontal, ChevronRight, RefreshCw, ServerCrash, X as AlertIcon  } from 'lucide-react';
import {
  fetchHolidayCalendar, 
  deleteHolidayCalendarEntry,
  type HolidayCalendarEntry
} from '../../../store/slice/holidayCalendarSlice'; 
import type { RootState, AppDispatch } from '../../../store/store';

import Table, { type Column } from "../../../components/common/Table";
import AlertModal from '../../../components/Modal/AlertModal';
import CreateHolidayForm from '../../../components/HolidayCalender/CreateHoliday'; 
import UpdateHolidayForm from '../../../components/HolidayCalender/ UpdateHoliday'; 
import { Link } from 'react-router-dom';


type HolidayDisplay = HolidayCalendarEntry & { s_no: number };


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
        <h3 className="mt-2 text-lg font-semibold text-gray-800">No Holidays Found</h3>
        <p className="mt-1 text-sm text-gray-600">
            Get started by adding a new holiday to the calendar.
        </p>
        <div className="mt-6">
            <button type="button" onClick={onAddNew} className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700">
                <Plus size={20} className="-ml-1 mr-2" />
                Add New Holiday
            </button>
        </div>
    </div>
);



const HolidayCalendarPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: holidays, status, error } = useSelector((state: RootState) => state.holidayCalendar);

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isCreatePanelOpen, setCreatePanelOpen] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<HolidayCalendarEntry | null>(null);
  const [deleteAlert, setDeleteAlert] = useState<{ isOpen: boolean; holiday: HolidayCalendarEntry | null }>({
    isOpen: false,
    holiday: null,
  });

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchHolidayCalendar());
    }
  }, [status, dispatch]);

  const handleEditClick = (holiday: HolidayCalendarEntry) => {
    setEditingHoliday(holiday);
    setActiveDropdown(null);
  };

  const handleDeleteClick = (holiday: HolidayCalendarEntry) => {
    setDeleteAlert({ isOpen: true, holiday });
    setActiveDropdown(null);
  };

  const handleConfirmDelete = () => {
    if (deleteAlert.holiday) {
      dispatch(deleteHolidayCalendarEntry(deleteAlert.holiday.id));
    }
    setDeleteAlert({ isOpen: false, holiday: null });
  };

  const columns: Column<HolidayDisplay>[] = [
    { key: 's_no', header: 'S.No', className: 'w-16 text-center' },
    { key: 'name', header: 'Name' },
    { key: 'type', header: 'Type' },
    { key: 'date', header: 'Date', render: (row) => new Date(row.date).toLocaleDateString() },
    { key: 'holidayGroups', header: 'Holiday Group', render: (row) => row.holidayGroups.join(', ') },
    {
      key: 'action',
      header: 'Action',
      render: (row) => (
        <div className="relative">
          <button onClick={() => setActiveDropdown(activeDropdown === row.id ? null : row.id)} className="text-gray-500 hover:text-purple-600 p-1 rounded-full">
            <MoreHorizontal size={20} />
          </button>
          {activeDropdown === row.id && (
            <div ref={dropdownRef} className="absolute right-0 mt-2 w-32 bg-white border rounded-md shadow-lg z-20">
              <a href="#" onClick={(e) => { e.preventDefault(); handleEditClick(row); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Edit</a>
              <a href="#" onClick={(e) => { e.preventDefault(); handleDeleteClick(row); }} className="block px-4 py-2 text-sm text-red-700 hover:bg-gray-100">Delete</a>
            </div>
          )}
        </div>
      ),
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setActiveDropdown(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const renderContent = () => {
    if ((status === 'loading' || status === 'idle') && holidays.length === 0) {
      return <TableSkeleton />;
    }

    if (status === 'failed' && holidays.length === 0) {
      return <ErrorState onRetry={() => dispatch(fetchHolidayCalendar())} error={error} />;
    }
    
    const tableData = holidays.map((item, index) => ({ ...item, s_no: index + 1 }));

    if (status === 'succeeded' && holidays.length === 0) {
      return <EmptyState onAddNew={() => setCreatePanelOpen(true)} />;
    }

    return (
      <Table
        columns={columns}
        data={tableData}
        showSearch={true}
        searchPlaceholder="Search Holidays..."
      />
    );
  };

  return (
    <div className="bg-gray-50 min-h-full p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Holiday Calendar</h1>
            <nav aria-label="Breadcrumb" className="mt-1 flex items-center text-sm text-gray-500">
             
    
              <Link to="/getting-started" className="hover:text-gray-700">
                Getting Started
              </Link>
              <ChevronRight className="w-4 h-4 mx-1" />
              <span className="font-medium text-gray-800">Holiday Calendar</span>
            </nav>
          </div>
          <button onClick={() => setCreatePanelOpen(true)} className="bg-[#8A2BE2] text-white px-4 py-2 rounded-md hover:bg-[#7a1fb8] flex items-center space-x-2">
            <Plus size={20} />
            <span>ADD NEW</span>
          </button>
        </div>
      </header>
      
      <main>
          {renderContent()}
      </main>
      
      <CreateHolidayForm isOpen={isCreatePanelOpen} onClose={() => setCreatePanelOpen(false)} />
      <UpdateHolidayForm isOpen={!!editingHoliday} onClose={() => setEditingHoliday(null)} holidayData={editingHoliday} />
      <AlertModal 
        isOpen={deleteAlert.isOpen} 
        onClose={() => setDeleteAlert({ isOpen: false, holiday: null })} 
        onConfirm={handleConfirmDelete} 
        title="Delete Holiday"
        icon={<AlertIcon className="text-red-500" size={40} strokeWidth={3} />}
      >
        <p>Are you sure you want to delete this holiday?</p>
      </AlertModal>
    </div>
  );
};

export default HolidayCalendarPage;
