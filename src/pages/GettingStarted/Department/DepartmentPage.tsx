import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MoreHorizontal, ChevronRight, Plus, X as AlertIcon, RefreshCw, ServerCrash } from 'lucide-react';
import { Link } from 'react-router-dom';

// --- Redux Imports ---
import { fetchDepartments, updateDepartment, deactivateDepartment, type Department } from '../../../store/slice/departmentSlice';
import type { RootState, AppDispatch } from '../../../store/store';

// --- Component Imports ---
import Table, { type Column } from "../../../components/common/Table"; 
import CreateDepartment from "../../../components/GettingStarted/CreateDepartment";
import UpdateDepartment from '../../../components/GettingStarted/UpdateDepartment';
import AlertModal from '../../../components/Modal/AlertModal';

// --- TYPE DEFINITION for display data ---
type DepartmentDisplay = Department & { s_no: number };

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
        <h3 className="mt-2 text-lg font-semibold text-gray-800">No Departments Found</h3>
        <p className="mt-1 text-sm text-gray-600">
            Get started by adding a new department.
        </p>
        <div className="mt-6">
            <button type="button" onClick={onAddNew} className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700">
                <Plus size={20} className="-ml-1 mr-2" />
                Add New Department
            </button>
        </div>
    </div>
);


// --- MAIN PAGE COMPONENT ---
const DepartmentPage: React.FC = () => {
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
  
  const [alertData, setAlertData] = useState<{
    isOpen: boolean;
    department: Department | null;
    actionType: 'inactive' | 'active' | null;
  }>({
    isOpen: false,
    department: null,
    actionType: null,
  });

  useEffect(() => {
    if (departmentStatus === 'idle') {
      dispatch(fetchDepartments());
    }
  }, [departmentStatus, dispatch]);

  const handleEditClick = (department: Department) => {
    setEditingDepartment(department);
    setActiveDropdown(null);
  };

  const handleStatusChangeClick = (department: Department, newStatus: 'active' | 'inactive') => {
    setAlertData({ isOpen: true, department, actionType: newStatus });
    setActiveDropdown(null);
  };

  const handleConfirmAction = () => {
    if (!alertData.department || !alertData.actionType) return;

    if (alertData.actionType === 'inactive') {
      dispatch(deactivateDepartment(alertData.department));
    } else {
      const departmentToUpdate = { ...alertData.department, status: 'active' as const };
      dispatch(updateDepartment(departmentToUpdate));
    }

    setAlertData({ isOpen: false, department: null, actionType: null });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
          <button onClick={() => setActiveDropdown(activeDropdown === row.id ? null : row.id)} className="text-gray-500 hover:text-[#8A2BE2] p-1 rounded-full">
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

  const renderContent = () => {
    if ((departmentStatus === 'loading' || departmentStatus === 'idle') && departments.length === 0) {
      return <TableSkeleton />;
    }

    if (departmentStatus === 'failed' && departments.length === 0) {
      return <ErrorState onRetry={() => dispatch(fetchDepartments())} error={error} />;
    }

    if (departmentStatus === 'succeeded' && departments.length === 0) {
      return <EmptyState onAddNew={() => setCreatePanelOpen(true)} />;
    }
    
    const tableData = departments.map((dep, index) => ({ ...dep, s_no: index + 1 }));

    return (
      <Table
        columns={columns}
        data={tableData}
        showSearch={true}
        searchPlaceholder="Search Departments..."
      />
    );
  };

  return (
    <div className="bg-gray-50 min-h-full p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Department</h1>
            <nav aria-label="Breadcrumb" className="mt-1 flex items-center text-sm text-gray-500">
              <Link to="/dashboard" className="hover:text-gray-700">
                Dashboard
              </Link>
              <ChevronRight className="w-4 h-4 mx-1" />
             <Link to="/getting-started" className="hover:text-gray-700">
                Getting Started
              </Link>
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
        {renderContent()}
      </main>
      
      <CreateDepartment isOpen={isCreatePanelOpen} onClose={() => setCreatePanelOpen(false)} />
      <UpdateDepartment 
        isOpen={!!editingDepartment} 
        onClose={() => setEditingDepartment(null)} 
        departmentData={editingDepartment} 
      />
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
