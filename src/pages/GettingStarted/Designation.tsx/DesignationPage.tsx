import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, MoreHorizontal, ChevronRight, X as AlertIcon } from 'lucide-react';

// --- Redux Imports ---
import { fetchDesignations, updateDesignation, type Designation } from '../../../store/slice/designationSlice'; // Adjust path if needed
import type { RootState, AppDispatch } from '../../../store/store'; // Adjust path if needed

// --- Component Imports ---
import Table, { type Column } from "../../../components/common/Table"; 
import CreateDesignation from '../../../components/Designation/CreateDesignation';
import UpdateDesignation from '../../../components/Designation/UpdateDesignation';
import AlertModal from '../../../components/Modal/AlertModal';

// --- TYPE DEFINITION for display data ---
type DesignationDisplay = Designation & { s_no: number };

// --- MAIN COMPONENT ---
const DesignationPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: designations, status, error } = useSelector((state: RootState) => state.designations);

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isCreatePanelOpen, setCreatePanelOpen] = useState(false);
  const [editingDesignation, setEditingDesignation] = useState<Designation | null>(null);

  const [alertData, setAlertData] = useState<{
    isOpen: boolean;
    designation: Designation | null;
    actionType: 'inactive' | 'active' | null;
  }>({
    isOpen: false,
    designation: null,
    actionType: null,
  });

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchDesignations());
    }
  }, [status, dispatch]);

  const handleEditClick = (designation: Designation) => {
    setEditingDesignation(designation);
    setActiveDropdown(null);
  };

  const handleStatusChangeClick = (designation: Designation, newStatus: 'active' | 'inactive') => {
    setAlertData({ isOpen: true, designation, actionType: newStatus });
    setActiveDropdown(null);
  };

  const handleConfirmAction = () => {
    if (!alertData.designation || !alertData.actionType) return;

    const designationToUpdate = {
      ...alertData.designation,
      status: alertData.actionType,
    };

    dispatch(updateDesignation(designationToUpdate));

    setAlertData({ isOpen: false, designation: null, actionType: null });
  };

  const tableData: DesignationDisplay[] = designations.map((item, index) => ({
    ...item,
    s_no: index + 1,
  }));

  const columns: Column<DesignationDisplay>[] = [
    { key: 's_no', header: 'S.No' },
    { 
      key: 'name', 
      header: 'Name',
      // FIX: Add a custom render function to handle missing names
      render: (row) => row.name ? row.name : <span className="text-gray-400 italic">(No Name)</span>
    },
    { key: 'code', header: 'Code' },
    { key: 'description', header: 'Description' },
    { key: 'department', header: 'Department' },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <span className={`px-3 py-1 text-xs leading-5 font-semibold rounded-full capitalize ${row.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {row.status}
        </span>
      ),
    },
    {
      key: 'action',
      header: 'Action',
      render: (row) => (
        <div className="relative">
          <button onClick={() => setActiveDropdown(activeDropdown === row.id ? null : row.id)} className="text-gray-500 hover:text-purple-600 p-1 rounded-full focus:outline-none">
            <MoreHorizontal size={20} />
          </button>
          {activeDropdown === row.id && (
            <div ref={dropdownRef} className="absolute right-0 mt-2 w-32 bg-white border rounded-md shadow-lg z-20">
              <a href="#" onClick={(e) => { e.preventDefault(); handleEditClick(row); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Edit</a>
              {row.status === 'active' ? (
                <a href="#" onClick={(e) => { e.preventDefault(); handleStatusChangeClick(row, 'inactive'); }} className="block px-4 py-2 text-sm text-red-700 hover:bg-gray-100">Inactive</a>
              ) : (
                <a href="#" onClick={(e) => { e.preventDefault(); handleStatusChangeClick(row, 'active'); }} className="block px-4 py-2 text-sm text-green-700 hover:bg-gray-100">Active</a>
              )}
            </div>
          )}
        </div>
      ),
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
          <h1 className="text-2xl font-bold text-gray-900">Designations</h1>
          <nav aria-label="Breadcrumb" className="flex items-center text-sm text-gray-500">
            <a href="/dashboard" className="hover:text-gray-700">Dashboard</a>
            <ChevronRight className="w-4 h-4 mx-1" />
            <a href="/getting-started" className="hover:text-gray-700">Getting Started</a>
            <ChevronRight className="w-4 h-4 mx-1" />
            <span className="font-medium text-gray-800">Designations</span>
          </nav>
        </div>
      </header>
      
      <main>
        <div className="flex justify-between items-center mb-4">
            <button
                onClick={() => setCreatePanelOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700"
            >
                <Plus size={20} className="-ml-1 mr-2" />
                ADD NEW
            </button>
        </div>
        
        {status === 'loading' && <div className="text-center p-4">Loading...</div>}
        {status === 'failed' && <div className="text-center p-4 text-red-500">Error: {error}</div>}
        {status === 'succeeded' && (
          <Table
            columns={columns}
            data={tableData}
            searchPlaceholder="Search by name or code"
          />
        )}
      </main>
      
      <CreateDesignation isOpen={isCreatePanelOpen} onClose={() => setCreatePanelOpen(false)} /> 
      <UpdateDesignation 
        isOpen={!!editingDesignation}
        onClose={() => setEditingDesignation(null)}
        designationData={editingDesignation}
      />

      <AlertModal
        isOpen={alertData.isOpen}
        onClose={() => setAlertData({ isOpen: false, designation: null, actionType: null })}
        onConfirm={handleConfirmAction}
        title={`${alertData.actionType === 'active' ? 'Activate' : 'Deactivate'} Designation`}
        icon={<AlertIcon className={alertData.actionType === 'active' ? 'text-green-500' : 'text-red-500'} size={40} strokeWidth={3} />}
      >
        <p>Are you sure you want to make this designation {alertData.actionType}?</p>
      </AlertModal>
    </div>
  );
};

export default DesignationPage;
