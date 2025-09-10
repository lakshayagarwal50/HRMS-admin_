// import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { Plus, MoreHorizontal, ChevronRight, X as AlertIcon, RefreshCw, ServerCrash } from 'lucide-react';
// import { Link } from 'react-router-dom';
// import { fetchDepartments, updateDepartment, type Department } from '../../../store/slice/departmentSlice';
// import type { RootState, AppDispatch } from '../../../store/store';
// import Table, { type Column } from "../../../components/common/Table"; 
// import CreateDepartment from "../../../components/GettingStarted/CreateDepartment";
// import UpdateDepartment from '../../../components/GettingStarted/UpdateDepartment';
// import AlertModal from '../../../components/Modal/AlertModal';

// type DepartmentDisplay = Department & { s_no: number };

// const TableSkeleton: React.FC = () => (
//     <div className="w-full bg-white p-4 rounded-lg border border-gray-200 animate-pulse">
//         <div className="space-y-3">
//             {[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-gray-200 rounded-md w-full"></div>)}
//         </div>
//     </div>
// );

// const ErrorState: React.FC<{ onRetry: () => void; error: string | null }> = ({ onRetry, error }) => (
//     <div className="text-center py-10 px-4 bg-red-50 border border-red-200 rounded-lg">
//         <ServerCrash className="mx-auto h-12 w-12 text-red-400" />
//         <h3 className="mt-2 text-lg font-semibold text-red-800">Failed to Load Data</h3>
//         <p className="mt-1 text-sm text-red-600">{error || 'An unknown error occurred.'}</p>
//         <div className="mt-6">
//             <button type="button" onClick={onRetry} className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700">
//                 <RefreshCw className="-ml-1 mr-2 h-5 w-5" />
//                 Try Again
//             </button>
//         </div>
//     </div>
// );

// const EmptyState: React.FC<{ onAddNew: () => void }> = ({ onAddNew }) => (
//     <div className="text-center py-10 px-4 bg-gray-50 border border-gray-200 rounded-lg">
//         <h3 className="mt-2 text-lg font-semibold text-gray-800">No Departments Found</h3>
//         <p className="mt-1 text-sm text-gray-600">
//             Get started by adding a new department.
//         </p>
//         <div className="mt-6">
//             <button type="button" onClick={onAddNew} className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700">
//                 <Plus size={20} className="-ml-1 mr-2" />
//                 Add New Department
//             </button>
//         </div>
//     </div>
// );


// const DepartmentPage: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const {
//     items: departments,
//     status: departmentStatus,
//     error,
//   } = useSelector((state: RootState) => state.departments);

//   const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
//   const dropdownRef = useRef<HTMLDivElement>(null);
//   const [isCreatePanelOpen, setCreatePanelOpen] = useState(false);
//   const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  
//   const [alertData, setAlertData] = useState<{
//     isOpen: boolean;
//     department: Department | null;
//     actionType: 'active' | 'inactive' | null;
//   }>({
//     isOpen: false,
//     department: null,
//     actionType: null,
//   });

//   useEffect(() => {
//     if (departmentStatus === 'idle') {
//       dispatch(fetchDepartments());
//     }
//   }, [departmentStatus, dispatch]);

//   const handleEditClick = useCallback((department: Department) => {
//     setEditingDepartment(department);
//     setActiveDropdown(null);
//   }, []);

//   const handleStatusChangeClick = useCallback((department: Department, newStatus: 'active' | 'inactive') => {
//     setAlertData({ isOpen: true, department, actionType: newStatus });
//     setActiveDropdown(null);
//   }, []);
//   const handleConfirmAction = useCallback(() => {
//     if (!alertData.department || !alertData.actionType) return;

//     const departmentToUpdate = {
//       ...alertData.department,
//       status: alertData.actionType,
//     };

//     dispatch(updateDepartment(departmentToUpdate));
//     setAlertData({ isOpen: false, department: null, actionType: null });
//   }, [alertData, dispatch]);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setActiveDropdown(null);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const columns = useMemo<Column<DepartmentDisplay>[]>(() => [
//     { key: 's_no', header: 'S.No' },
//     { key: 'name', header: 'Name' },
//     { key: 'code', header: 'Code' },
//     { key: 'status', header: 'Status',
//       render: (row) => (
//         <span className={`px-3 py-1 text-xs leading-5 font-semibold rounded-full capitalize ${row.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
//           {row.status}
//         </span>
//       ),
//     },
//     { key: 'action', header: 'Action',
//       render: (row) => (
//         <div className="relative">
//           <button onClick={() => setActiveDropdown(activeDropdown === row.id ? null : row.id)} className="text-gray-500 hover:text-purple-600 p-1 rounded-full">
//             <MoreHorizontal size={20} />
//           </button>
//           {activeDropdown === row.id && (
//             <div ref={dropdownRef} className="absolute right-0 mt-2 w-32 bg-white border rounded-md shadow-lg z-20">
//               <button onClick={() => handleEditClick(row)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Edit</button>
//               {row.status === 'active' ? (
//                 <button onClick={() => handleStatusChangeClick(row, 'inactive')} className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-100">Inactive</button>
//               ) : (
//                 <button onClick={() => handleStatusChangeClick(row, 'active')} className="block w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-gray-100">Active</button>
//               )}
//             </div>
//           )}
//         </div>
//       ),
//     },
//   ], [activeDropdown, handleEditClick, handleStatusChangeClick]);

//   const renderContent = () => {
//     if ((departmentStatus === 'loading' || departmentStatus === 'idle') && departments.length === 0) {
//       return <TableSkeleton />;
//     }

//     if (departmentStatus === 'failed' && departments.length === 0) {
//       return <ErrorState onRetry={() => dispatch(fetchDepartments())} error={error} />;
//     }

//     if (departmentStatus === 'succeeded' && departments.length === 0) {
//       return <EmptyState onAddNew={() => setCreatePanelOpen(true)} />;
//     }
    
//     const tableData = departments.map((dep, index) => ({ ...dep, s_no: index + 1 }));

//     return (
//       <Table
//         columns={columns}
//         data={tableData}
//         showSearch={true}
//         searchPlaceholder="Search Departments..."
//       />
//     );
//   };

//   return (
//     <div className="bg-gray-50 min-h-full p-4 sm:p-6 lg:p-8">
//       <header className="mb-8">
//         <div className="flex justify-between items-center">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">Department</h1>
//             <nav aria-label="Breadcrumb" className="mt-1 flex items-center text-sm text-gray-500">
//               <Link to="/dashboard" className="hover:text-gray-700">
//                 Dashboard
//               </Link>
//               <ChevronRight className="w-4 h-4 mx-1" />
//              <Link to="/getting-started" className="hover:text-gray-700">
//                 Getting Started
//               </Link>
//               <ChevronRight className="w-4 h-4 mx-1" />
//               <span className="font-medium text-gray-800">Department</span>
//             </nav>
//           </div>
//           <button onClick={() => setCreatePanelOpen(true)} className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 flex items-center space-x-2">
//             <Plus size={20} />
//             <span>ADD NEW</span>
//           </button>
//         </div>
//       </header>
//       <main>
//         {renderContent()}
//       </main>
      
//       <CreateDepartment isOpen={isCreatePanelOpen} onClose={() => setCreatePanelOpen(false)} />
//       <UpdateDepartment 
//         isOpen={!!editingDepartment} 
//         onClose={() => setEditingDepartment(null)} 
//         departmentData={editingDepartment} 
//       />
//       <AlertModal
//         isOpen={alertData.isOpen}
//         onClose={() => setAlertData({ isOpen: false, department: null, actionType: null })}
//         onConfirm={handleConfirmAction}
//         title={`${alertData.actionType === 'active' ? 'Activate' : 'Deactivate'} Department`}
//         icon={<AlertIcon className={alertData.actionType === 'active' ? 'text-green-500' : 'text-red-500'} size={40} strokeWidth={3} />}
//       >
//         <p>Are you sure you want to make this department {alertData.actionType}?</p>
//       </AlertModal>
//     </div>
//   );
// };

// export default DepartmentPage;


import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, MoreHorizontal, ChevronRight, X as AlertIcon, RefreshCw, ServerCrash, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

// --- Redux Imports ---
// We now import deleteDepartment as well
import {
  fetchDepartments,
  updateDepartment,
  deleteDepartment,
  type Department,
} from '../../../store/slice/departmentSlice';
import type { RootState, AppDispatch } from '../../../store/store';

// --- Component Imports ---
import Table, { type Column } from "../../../components/common/Table";
import CreateDepartment from "../../../components/GettingStarted/CreateDepartment";
import UpdateDepartment from '../../../components/GettingStarted/UpdateDepartment';
import AlertModal from '../../../components/Modal/AlertModal';

// --- Type for table display ---
type DepartmentDisplay = Department & { s_no: number };

// --- UI State Components (No changes needed) ---
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

// --- Main Page Component ---
const DepartmentPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    items: departments,
    status: departmentStatus,
    error,
  } = useSelector((state: RootState) => state.departments);

  // --- Component State ---
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isCreatePanelOpen, setCreatePanelOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);

  // State for handling status change confirmation
  const [statusAlert, setStatusAlert] = useState<{
    isOpen: boolean;
    department: Department | null;
    actionType: 'active' | 'inactive' | null;
  }>({ isOpen: false, department: null, actionType: null });

  // State for handling delete confirmation
  const [deleteAlert, setDeleteAlert] = useState<{
    isOpen: boolean;
    departmentId: string | null;
  }>({ isOpen: false, departmentId: null });

  // --- Data Fetching ---
  useEffect(() => {
    if (departmentStatus === 'idle') {
      dispatch(fetchDepartments());
    }
  }, [departmentStatus, dispatch]);

  // --- Event Handlers ---
  const handleEditClick = useCallback((department: Department) => {
    setEditingDepartment(department);
    setActiveDropdown(null);
  }, []);

  const handleStatusChangeClick = useCallback((department: Department, newStatus: 'active' | 'inactive') => {
    setStatusAlert({ isOpen: true, department, actionType: newStatus });
    setActiveDropdown(null);
  }, []);

  const handleDeleteClick = useCallback((departmentId: string) => {
    setDeleteAlert({ isOpen: true, departmentId });
    setActiveDropdown(null);
  }, []);

  // --- Action Confirmations ---
  const handleConfirmStatusChange = useCallback(async () => {
    if (!statusAlert.department || !statusAlert.actionType) return;

    // **IMPROVEMENT**: Send only the ID and the changed status field.
    // This is more efficient than sending the entire department object.
    const payload = {
      id: statusAlert.department.id,
      status: statusAlert.actionType,
    };

    try {
      await dispatch(updateDepartment(payload)).unwrap();
      toast.success(`Department status changed to ${payload.status}.`);
    } catch (err: any) {
      toast.error(err || 'Failed to update status.');
    } finally {
      setStatusAlert({ isOpen: false, department: null, actionType: null });
    }
  }, [statusAlert, dispatch]);

  const handleConfirmDelete = useCallback(async () => {
    if (deleteAlert.departmentId) {
      try {
        await dispatch(deleteDepartment(deleteAlert.departmentId)).unwrap();
        toast.success('Department deleted successfully!');
      } catch (err: any) {
        toast.error(err || 'Failed to delete department.');
      } finally {
        setDeleteAlert({ isOpen: false, departmentId: null });
      }
    }
  }, [deleteAlert.departmentId, dispatch]);

  // --- Click Outside Handler for Dropdown ---
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- Table Column Definition ---
  const columns = useMemo<Column<DepartmentDisplay>[]>(() => [
    { key: 's_no', header: 'S.No', className: 'w-16 text-center' },
    { key: 'name', header: 'Name' },
    { key: 'code', header: 'Code' },
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
      className: 'text-center',
      render: (row) => (
        <div className="relative">
          <button onClick={() => setActiveDropdown(activeDropdown === row.id ? null : row.id)} className="text-gray-500 hover:text-purple-600 p-1 rounded-full focus:outline-none">
            <MoreHorizontal size={20} />
          </button>
          {activeDropdown === row.id && (
            <div ref={dropdownRef} className="absolute right-0 mt-2 w-36 bg-white border rounded-md shadow-lg z-20">
              <button onClick={() => handleEditClick(row)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Edit</button>
              {row.status === 'active' ? (
                <button onClick={() => handleStatusChangeClick(row, 'inactive')} className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-100">Set Inactive</button>
              ) : (
                <button onClick={() => handleStatusChangeClick(row, 'active')} className="block w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-gray-100">Set Active</button>
              )}
              <div className="border-t border-gray-100"></div>
             
            </div>
          )}
        </div>
      ),
    },
  ], [activeDropdown, handleEditClick, handleStatusChangeClick, handleDeleteClick]);

  // --- Content Rendering Logic ---
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
      <Table columns={columns} data={tableData} showSearch={true} searchPlaceholder="Search Departments..." />
    );
  };

  return (
    <div className="bg-white min-h-full p-4 sm:p-6 lg:p-8 rounded-lg shadow-md">
      <header className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
          <nav aria-label="Breadcrumb" className="mt-1 flex items-center text-sm text-gray-500">
            <Link to="/getting-started" className="hover:text-gray-700">Getting Started</Link>
            <ChevronRight size={16} className="mx-1" />
            <span className="font-medium text-gray-800">Departments</span>
          </nav>
        </div>
        <button onClick={() => setCreatePanelOpen(true)} className="inline-flex items-center bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
          <Plus size={20} className="-ml-1 mr-2" />
          <span>ADD NEW</span>
        </button>
      </header>
      
      <main>
        {renderContent()}
      </main>
      
      {/* --- Modals and Side Panels --- */}
      <CreateDepartment isOpen={isCreatePanelOpen} onClose={() => setCreatePanelOpen(false)} />
      <UpdateDepartment isOpen={!!editingDepartment} onClose={() => setEditingDepartment(null)} departmentData={editingDepartment} />
      
      <AlertModal
        isOpen={statusAlert.isOpen}
        onClose={() => setStatusAlert({ isOpen: false, department: null, actionType: null })}
        onConfirm={handleConfirmStatusChange}
        title={`${statusAlert.actionType === 'active' ? 'Activate' : 'Deactivate'} Department`}
        icon={<AlertIcon className={statusAlert.actionType === 'active' ? 'text-green-500' : 'text-red-500'} size={40} strokeWidth={3} />}
      >
        <p>Are you sure you want to set this department as {statusAlert.actionType}?</p>
      </AlertModal>

      <AlertModal
        isOpen={deleteAlert.isOpen}
        onClose={() => setDeleteAlert({ isOpen: false, departmentId: null })}
        onConfirm={handleConfirmDelete}
        title="Delete Department"
        icon={<Trash2 className='text-red-500' size={40} strokeWidth={3} />}
      >
        <p>Are you sure you want to delete this department? This action cannot be undone.</p>
      </AlertModal>
    </div>
  );
};

export default DepartmentPage;
