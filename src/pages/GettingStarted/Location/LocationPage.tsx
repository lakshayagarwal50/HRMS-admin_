import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, MoreHorizontal, ChevronRight, X as AlertIcon, RefreshCw, ServerCrash } from 'lucide-react';
import { Link } from 'react-router-dom';

import { fetchLocations, toggleLocationStatus, type Location } from '../../../store/slice/locationSlice'; 
import type { AppDispatch, RootState } from '../../../store/store'; 


import Table, { type Column } from "../../../components/common/Table";
import AlertModal from '../../../components/Modal/AlertModal'; 
import CreateLocation from '../../../components/Location/CreateLocation'; 
import UpdateLocation from '../../../components/Location/UpdateLocation'; 

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
        <h3 className="mt-2 text-lg font-semibold text-gray-800">No Locations Found</h3>
        <p className="mt-1 text-sm text-gray-600">
            Get started by adding a new location.
        </p>
        <div className="mt-6">
            <button type="button" onClick={onAddNew} className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700">
                <Plus size={20} className="-ml-1 mr-2" />
                Add New Location
            </button>
        </div>
    </div>
);


const LocationPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: locations, status, error } = useSelector((state: RootState) => state.locations);

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isCreatePanelOpen, setCreatePanelOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  
  const [alertData, setAlertData] = useState<{ isOpen: boolean; location: Location | null }>({
    isOpen: false,
    location: null,
  });

  useEffect(() => {
    
    if (status === 'idle') {
      dispatch(fetchLocations());
    }
  }, [status, dispatch]);

  const handleEditClick = useCallback((location: Location) => {
    setEditingLocation(location);
    setActiveDropdown(null);
  }, []);

  const handleStatusToggleClick = useCallback((location: Location) => {
    setAlertData({ isOpen: true, location });
    setActiveDropdown(null);
  }, []);

  const handleConfirmStatusToggle = useCallback(() => {
    if (alertData.location) {
      dispatch(toggleLocationStatus(alertData.location));
    }
    setAlertData({ isOpen: false, location: null });
  }, [alertData.location, dispatch]);

  const columns = useMemo<Column<Location>[]>(() => [
    { key: 'city', header: 'City/Place' },
    
    { key: 'code', header: 'Code' },
    { key: 'state', header: 'State' },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <span className={`px-3 py-1 text-xs leading-5 font-semibold rounded-full ${row.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {row.status}
        </span>
      ),
    },
    {
      key: 'action',
      header: 'Action',
      render: (row) => {
        const isRowActive = row.status === 'Active';
        return (
          <div className="relative">
            <button onClick={() => setActiveDropdown(activeDropdown === row.id ? null : row.id)} className="text-gray-500 hover:text-purple-600 p-1 rounded-full focus:outline-none">
              <MoreHorizontal size={20} />
            </button>
            {activeDropdown === row.id && (
              <div ref={dropdownRef} className="absolute right-0 mt-2 w-32 bg-white border rounded-md shadow-lg z-20">
                <a href="#" onClick={(e) => { e.preventDefault(); handleEditClick(row); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Edit</a>
                <a href="#" onClick={(e) => { e.preventDefault(); handleStatusToggleClick(row); }} className={`block px-4 py-2 text-sm hover:bg-gray-100 ${isRowActive ? 'text-red-700' : 'text-green-700'}`}>
                  {isRowActive ? 'Inactive' : 'Active'}
                </a>
              </div>
            )}
          </div>
        );
      },
    },
  ], [activeDropdown, handleEditClick, handleStatusToggleClick]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const renderContent = () => {
    if ((status === 'loading' || status === 'idle') && locations.length === 0) {
      return <TableSkeleton />;
    }

    if (status === 'failed' && locations.length === 0) {
      return <ErrorState onRetry={() => dispatch(fetchLocations())} error={error} />;
    }

    if (status === 'succeeded' && locations.length === 0) {
      return <EmptyState onAddNew={() => setCreatePanelOpen(true)} />;
    }

    return (
      <Table
        columns={columns}
        data={locations}
        showSearch={true}
        searchPlaceholder="Search Locations..."
      />
    );
  };

  return (
    <div className="w-full bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-md">
      <header className="mb-6">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Location</h1>
          <nav aria-label="Breadcrumb" className="flex items-center text-sm text-gray-500">
            <Link to="/getting-started" className="hover:text-gray-700">Getting Started</Link>
            <ChevronRight className="w-4 h-4 mx-1" />
            <span className="font-medium text-gray-800">Location</span>
          </nav>
        </div>
      </header>
      
      <main>
        <div className="flex justify-start items-center mb-4">
            <button
                onClick={() => setCreatePanelOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700"
            >
                <Plus size={20} className="-ml-1 mr-2" />
                ADD NEW
            </button>
        </div>
        
        {renderContent()}
      </main>
      
      <AlertModal
        isOpen={alertData.isOpen}
        onClose={() => setAlertData({ isOpen: false, location: null })}
        onConfirm={handleConfirmStatusToggle}
        title={alertData.location?.status === 'Active' ? 'Deactivate Location' : 'Activate Location'}
        icon={<AlertIcon className={alertData.location?.status === 'Active' ? 'text-red-500' : 'text-green-500'} size={40} strokeWidth={3} />}
      >
        <p>Are you sure you want to change the status of this Location?</p>
      </AlertModal>

      <CreateLocation isOpen={isCreatePanelOpen} onClose={() => setCreatePanelOpen(false)} />
      
      <UpdateLocation 
        isOpen={!!editingLocation}
        onClose={() => setEditingLocation(null)}
        locationData={editingLocation}
      />
    </div>
  );
};

export default LocationPage;
