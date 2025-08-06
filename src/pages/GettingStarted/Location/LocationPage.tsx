import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, MoreHorizontal, ChevronRight, X as AlertIcon, Loader2 } from 'lucide-react';

// --- Import your reusable components and Redux logic ---
import Table, { type Column } from "../../../components/common/Table"; // Adjust path if needed
import AlertModal from '../../../components/Modal/AlertModal'; // Adjust path if needed
import CreateLocation from '../../../components/Location/CreateLocation'; // Adjust path if needed
import UpdateLocation from '../../../components/Location/UpdateLocation'; // Adjust path if needed
import { fetchLocations, toggleLocationStatus } from '../../../store/slice/locationSlice'; // Import Redux logic
import type { AppDispatch, RootState } from '../../../store/store'; // Adjust path if needed
import type { Location } from '../../../store/slice/locationSlice'; // Import the Location type

// --- MAIN COMPONENT ---
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

  // Fetch data when the component mounts
  useEffect(() => {
    dispatch(fetchLocations());
  }, [dispatch]);

  const handleEditClick = (location: Location) => {
    setEditingLocation(location);
    setActiveDropdown(null);
  };

  const handleStatusToggleClick = (location: Location) => {
    setAlertData({ isOpen: true, location });
    setActiveDropdown(null);
  };

  const handleConfirmStatusToggle = () => {
    if (alertData.location) {
      dispatch(toggleLocationStatus(alertData.location));
    }
    setAlertData({ isOpen: false, location: null });
  };

  const columns: Column<Location>[] = [
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
                <a href="#" onClick={() => handleEditClick(row)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Edit</a>
                <a href="#" onClick={() => handleStatusToggleClick(row)} className={`block px-4 py-2 text-sm hover:bg-gray-100 ${isRowActive ? 'text-red-700' : 'text-green-700'}`}>
                  {isRowActive ? 'Inactive' : 'Active'}
                </a>
              </div>
            )}
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-full bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-md">
      <header className="mb-6">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Location</h1>
          <nav aria-label="Breadcrumb" className="flex items-center text-sm text-gray-500">
            <a href="/dashboard" className="hover:text-gray-700">Dashboard</a>
            <ChevronRight className="w-4 h-4 mx-1" />
            <a href="/getting-started" className="hover:text-gray-700">Getting Started</a>
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
        
        {status === 'loading' && (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="animate-spin text-purple-600" size={32} />
          </div>
        )}
        {status === 'failed' && <div className="text-center text-red-500 py-10">{error}</div>}
        {status === 'succeeded' && (
          <Table
            columns={columns}
            data={locations}
            showSearch={false}
            showPagination={true}
          />
        )}
      </main>
      
      <AlertModal
        isOpen={alertData.isOpen}
        onClose={() => setAlertData({ isOpen: false, location: null })}
        onConfirm={handleConfirmStatusToggle}
        title={alertData.location?.status === 'Active' ? 'Inactive Location' : 'Active Location'}
        icon={<AlertIcon className="text-red-500" size={40} strokeWidth={3} />}
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
