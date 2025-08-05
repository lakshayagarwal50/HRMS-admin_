import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MoreHorizontal, ChevronRight, Plus, X as AlertIcon, Columns } from 'lucide-react';

// --- Component Imports ---

import CreateDepartment from "../../../components/GettingStarted/CreateDepartment";
import UpdateDepartment from '../../../components/GettingStarted/UpdateDepartment';
import AlertModal from '../../../components/Modal/AlertModal';

// --- Redux Imports ---
import { fetchDepartments, updateDepartment, deactivateDepartment, type Department } from '../../../store/slice/departmentSlice';
import type { RootState, AppDispatch } from '../../../store/store';
import Table, { type Column } from "../../../components/common/Table"; 

// This type extends the core Department type with client-side properties for display
type DepartmentDisplay = Department & { s_no: number };

const DepartmentPage: React.FC = () => {
  // --- Use hooks to get state and the dispatch function ---
  const dispatch = useDispatch<AppDispatch>();
  const {
    items: departments,
    status: departmentStatus,
    error,
  } = useSelector((state: RootState) => state.departments);

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isCreatePanelOpen, setCreatePanelOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  
  // Updated alert state to handle both active and inactive actions
  const [alertData, setAlertData] = useState<{
    isOpen: boolean;
    department: Department | null;
    actionType: 'inactive' | 'active' | null;
  }>({
    isOpen: false,
    department: null,
    actionType: null,
  });

  // Fetch data on initial component mount
  useEffect(() => {
    if (departmentStatus === 'idle') {
      dispatch(fetchDepartments());
    }
  }, [departmentStatus, dispatch]);

  const toggleDropdown = (id: string) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const handleEditClick = (department: Department) => {
    setEditingDepartment(department);
    setActiveDropdown(null);
  };

  // Handler to open the modal for making a department inactive
  const handleInactiveClick = (department: Department) => {
    setAlertData({ isOpen: true, department, actionType: 'inactive' });
    setActiveDropdown(null);
  };

  // Handler to open the modal for making a department active
  const handleActiveClick = (department: Department) => {
    setAlertData({ isOpen: true, department, actionType: 'active' });
    setActiveDropdown(null);
  };

  // Single confirmation handler that dispatches the correct action
  const handleConfirmAction = () => {
    if (!alertData.department) return;

    if (alertData.actionType === 'inactive') {
      dispatch(deactivateDepartment(alertData.department));
    } else if (alertData.actionType === 'active') {
      // Use the existing updateDepartment thunk to change status back to active
      const departmentToUpdate = { ...alertData.department, status: 'active' as const };
      dispatch(updateDepartment(departmentToUpdate));
    }

    setAlertData({ isOpen: false, department: null, actionType: null });
  };

  // Effect to close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const tableData: DepartmentDisplay[] = departments.map((dep, index) => ({
    ...dep,
    s_no: index + 1,
  }));

  const columns: Column<DepartmentDisplay>[] = [
    { key: 's_no', header: 'S.No' },
    { key: 'name', header: 'Name' },
    { key: 'code', header: 'Code' },
    { key: 'status', header: 'Status',
      render: (row) => (
        <span className={`px-3 py-1 text-xs leading-5 font-semibold rounded-full capitalize ${row.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {row.status}
        </span>
      ),
    },
    { key: 'action', header: 'Action',
      render: (row) => (
        <div className="relative">
          <button onClick={() => toggleDropdown(row.id)} className="text-gray-500 hover:text-[#8A2BE2] p-1 rounded-full">
            <MoreHorizontal size={20} />
          </button>
          {activeDropdown === row.id && (
            <div ref={dropdownRef} className="absolute right-0 mt-2 w-32 bg-white border rounded-md shadow-lg z-20">
              <a href="#" onClick={(e) => { e.preventDefault(); handleEditClick(row); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Edit</a>
              {/* Conditionally render Active/Inactive link */}
              {row.status === 'active' ? (
                <a href="#" onClick={(e) => { e.preventDefault(); handleInactiveClick(row); }} className="block px-4 py-2 text-sm text-red-700 hover:bg-gray-100">Inactive</a>
              ) : (
                <a href="#" onClick={(e) => { e.preventDefault(); handleActiveClick(row); }} className="block px-4 py-2 text-sm text-green-700 hover:bg-gray-100">Active</a>
              )}
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="bg-gray-50 min-h-full p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Department</h1>
            <nav
              aria-label="Breadcrumb"
              className="mt-1 flex items-center text-sm text-gray-500"
            >
              <a href="/dashboard" className="hover:text-gray-700">
                Dashboard
              </a>
              <ChevronRight className="w-4 h-4 mx-1" />
              <span>Getting Started</span>
              <ChevronRight className="w-4 h-4 mx-1" />
              <span className="font-medium text-gray-800">Department</span>
            </nav>
          </div>
          <button onClick={() => setCreatePanelOpen(true)} className="bg-[#8A2BE2] text-white px-4 py-2 rounded-md hover:bg-[#7a1fb8] flex items-center space-x-2">
            <Plus size={20} />
            <span>ADD NEW</span>
          </button>
        </div>
      </header>
      <main>
        {departmentStatus === 'loading' && <div className="text-center p-4">Loading departments...</div>}
        {departmentStatus === 'failed' && <div className="text-center p-4 text-red-500">Error: {error}</div>}
        {departmentStatus === 'succeeded' && (
          <Table
            columns={columns}
            data={tableData}
            showSearch={true}
            searchPlaceholder="Search Departments..."
          />
        )}
      </main>
      
      {/* Side Panels and Modals */}
      <CreateDepartment isOpen={isCreatePanelOpen} onClose={() => setCreatePanelOpen(false)} />
      
      <UpdateDepartment 
        isOpen={!!editingDepartment} 
        onClose={() => setEditingDepartment(null)} 
        departmentData={editingDepartment} 
      />
      
      {/* AlertModal is now dynamic based on the action type */}
      <AlertModal
        isOpen={alertData.isOpen}
        onClose={() => setAlertData({ isOpen: false, department: null, actionType: null })}
        onConfirm={handleConfirmAction}
        title={`${alertData.actionType === 'active' ? 'Activate' : 'Deactivate'} Department`}
        icon={<AlertIcon className={alertData.actionType === 'active' ? 'text-green-500' : 'text-red-500'} size={40} strokeWidth={3} />}
      >
        <p>Are you sure you want to make this department {alertData.actionType}?</p>
      </AlertModal>
    </div>
  );
};

export default DepartmentPage;
