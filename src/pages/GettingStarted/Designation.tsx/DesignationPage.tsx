// import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { Plus, MoreHorizontal, ChevronRight, X as AlertIcon, RefreshCw, ServerCrash } from 'lucide-react';
// import { Link } from 'react-router-dom';
// import { fetchDesignations, updateDesignation, type Designation } from '../../../store/slice/designationSlice';
// import type { RootState, AppDispatch } from '../../../store/store';
// import Table, { type Column } from "../../../components/common/Table"; 
// import CreateDesignation from '../../../components/Designation/CreateDesignation';
// import UpdateDesignation from '../../../components/Designation/UpdateDesignation';
// import AlertModal from '../../../components/Modal/AlertModal';

// type DesignationDisplay = Designation & { s_no: number };

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
//         <h3 className="mt-2 text-lg font-semibold text-gray-800">No Designations Found</h3>
//         <p className="mt-1 text-sm text-gray-600">
//             Get started by adding a new designation.
//         </p>
//         <div className="mt-6">
//             <button type="button" onClick={onAddNew} className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700">
//                 <Plus size={20} className="-ml-1 mr-2" />
//                 Add New Designation
//             </button>
//         </div>
//     </div>
// );

// const DesignationPage: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { items: designations, status, error } = useSelector((state: RootState) => state.designations);

//   const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
//   const dropdownRef = useRef<HTMLDivElement>(null);
//   const [isCreatePanelOpen, setCreatePanelOpen] = useState(false);
//   const [editingDesignation, setEditingDesignation] = useState<Designation | null>(null);

//   const [alertData, setAlertData] = useState<{
//     isOpen: boolean;
//     designation: Designation | null;
//     actionType: 'active' | 'inactive' | null;
//   }>({
//     isOpen: false,
//     designation: null,
//     actionType: null,
//   });

//   useEffect(() => {
//     if (status === 'idle') {
//       dispatch(fetchDesignations());
//     }
//   }, [status, dispatch]);

//   const handleEditClick = useCallback((designation: Designation) => {
//     setEditingDesignation(designation);
//     setActiveDropdown(null);
//   }, []);

//   const handleStatusChangeClick = useCallback((designation: Designation, newStatus: 'active' | 'inactive') => {
//     setAlertData({ isOpen: true, designation, actionType: newStatus });
//     setActiveDropdown(null);
//   }, []);

//   const handleConfirmAction = useCallback(() => {
//     if (!alertData.designation || !alertData.actionType) return;

//     const designationToUpdate = {
//       ...alertData.designation,
//       status: alertData.actionType,
//     };

//     dispatch(updateDesignation(designationToUpdate));
//     setAlertData({ isOpen: false, designation: null, actionType: null });
//   }, [alertData, dispatch]);

//   const columns = useMemo<Column<DesignationDisplay>[]>(() => [
//     { key: 's_no', header: 'S.No' },
//     { 
//       key: 'name', 
//       header: 'Name',
//       render: (row) => row.name ? row.name : <span className="text-gray-400 italic">(No Name)</span>
//     },
//     { key: 'code', header: 'Code' },
//     { key: 'description', header: 'Description' },
//     { key: 'department', header: 'Department' },
//     {
//       key: 'status',
//       header: 'Status',
//       render: (row) => (
//         <span className={`px-3 py-1 text-xs leading-5 font-semibold rounded-full capitalize ${row.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
//           {row.status}
//         </span>
//       ),
//     },
//     {
//       key: 'action',
//       header: 'Action',
//       render: (row) => (
//         <div className="relative">
//           <button onClick={() => setActiveDropdown(activeDropdown === row.id ? null : row.id)} className="text-gray-500 hover:text-purple-600 p-1 rounded-full focus:outline-none">
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

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setActiveDropdown(null);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const renderContent = () => {
//     if ((status === 'loading' || status === 'idle') && designations.length === 0) {
//         return <TableSkeleton />;
//     }

//     if (status === 'failed' && designations.length === 0) {
//         return <ErrorState onRetry={() => dispatch(fetchDesignations())} error={error} />;
//     }

//     if (status === 'succeeded' && designations.length === 0) {
//         return <EmptyState onAddNew={() => setCreatePanelOpen(true)} />;
//     }
    
//     const tableData = designations.map((item, index) => ({ ...item, s_no: index + 1 }));

//     return (
//         <Table
//             columns={columns}
//             data={tableData}
//             showSearch={true}
//             searchPlaceholder="Search by name or code"
//         />
//     );
//   };

//   return (
//     <div className="w-full bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-md">
//       <header className="mb-6">
//         <div className="flex justify-between items-center flex-wrap gap-4">
//           <h1 className="text-2xl font-bold text-gray-900">Designations</h1>
//           <nav aria-label="Breadcrumb" className="flex items-center text-sm text-gray-500">
//             <Link to="/dashboard" className="hover:text-gray-700">Dashboard</Link>
//             <ChevronRight className="w-4 h-4 mx-1" />
//             <Link to="/getting-started" className="hover:text-gray-700">Getting Started</Link>
//             <ChevronRight className="w-4 h-4 mx-1" />
//             <span className="font-medium text-gray-800">Designations</span>
//           </nav>
//         </div>
//       </header>
      
//       <main>
//         <div className="flex justify-between items-center mb-4">
//             <button
//                 onClick={() => setCreatePanelOpen(true)}
//                 className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700"
//             >
//                 <Plus size={20} className="-ml-1 mr-2" />
//                 ADD NEW
//             </button>
//         </div>
        
//         {renderContent()}
//       </main>
      
//       <CreateDesignation isOpen={isCreatePanelOpen} onClose={() => setCreatePanelOpen(false)} /> 
//       <UpdateDesignation 
//         isOpen={!!editingDesignation}
//         onClose={() => setEditingDesignation(null)}
//         designationData={editingDesignation}
//       />

//       <AlertModal
//         isOpen={alertData.isOpen}
//         onClose={() => setAlertData({ isOpen: false, designation: null, actionType: null })}
//         onConfirm={handleConfirmAction}
//         title={`${alertData.actionType === 'active' ? 'Activate' : 'Deactivate'} Designation`}
//         icon={<AlertIcon className={alertData.actionType === 'active' ? 'text-green-500' : 'text-red-500'} size={40} strokeWidth={3} />}
//       >
//         <p>Are you sure you want to make this designation {alertData.actionType}?</p>
//       </AlertModal>
//     </div>
//   );
// };

// export default DesignationPage;
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, MoreHorizontal, ChevronRight, X as AlertIcon, RefreshCw, ServerCrash } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

// --- Redux Imports ---
// **IMPROVEMENT**: We now import the semantically correct `updateDesignationStatus` action.
import {
  fetchDesignations,
  updateDesignationStatus,
  type Designation,
  type UpdateStatusPayload,
} from '../../../store/slice/designationSlice';
import type { RootState, AppDispatch } from '../../../store/store';

// --- Component Imports ---
import Table, { type Column } from "../../../components/common/Table";
import CreateDesignation from '../../../components/Designation/CreateDesignation';
import UpdateDesignation from '../../../components/Designation/UpdateDesignation';
import AlertModal from '../../../components/Modal/AlertModal';

// --- TYPE DEFINITION for display data ---
type DesignationDisplay = Designation & { s_no: number };

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
        <h3 className="mt-2 text-lg font-semibold text-gray-800">No Designations Found</h3>
        <p className="mt-1 text-sm text-gray-600">
            Get started by adding a new designation.
        </p>
        <div className="mt-6">
            <button type="button" onClick={onAddNew} className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700">
                <Plus size={20} className="-ml-1 mr-2" />
                Add New Designation
            </button>
        </div>
    </div>
);

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
    designationId: string | null;
    actionType: 'active' | 'inactive' | null;
  }>({
    isOpen: false,
    designationId: null,
    actionType: null,
  });

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchDesignations());
    }
  }, [status, dispatch]);

  const handleEditClick = useCallback((designation: Designation) => {
    setEditingDesignation(designation);
    setActiveDropdown(null);
  }, []);

  const handleStatusChangeClick = useCallback((designationId: string, newStatus: 'active' | 'inactive') => {
    setAlertData({ isOpen: true, designationId, actionType: newStatus });
    setActiveDropdown(null);
  }, []);

  // **IMPROVEMENT**: This logic is now much cleaner and more efficient.
  const handleConfirmAction = useCallback(async () => {
    if (!alertData.designationId || !alertData.actionType) return;

    // The payload for our dedicated status update action.
    const payload: UpdateStatusPayload = {
      id: alertData.designationId,
      status: alertData.actionType,
    };

    try {
        // We dispatch the single, correct action for any status change.
        await dispatch(updateDesignationStatus(payload)).unwrap();
        toast.success(`Designation status set to ${payload.status}.`);
    } catch(err: any) {
        toast.error(err || 'Failed to update status.');
    } finally {
        setAlertData({ isOpen: false, designationId: null, actionType: null });
    }
  }, [alertData, dispatch]);
  
    const columns = useMemo<Column<DesignationDisplay>[]>(() => [
    { key: 's_no', header: 'S.No', className: 'w-16 text-center' },
    { 
      key: 'name', 
      header: 'Name',
    },
    { key: 'code', header: 'Code' },
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
                <button onClick={() => handleStatusChangeClick(row.id, 'inactive')} className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-100">Set Inactive</button>
              ) : (
                <button onClick={() => handleStatusChangeClick(row.id, 'active')} className="block w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-gray-100">Set Active</button>
              )}
            </div>
          )}
        </div>
      ),
    },
  ], [activeDropdown, handleEditClick, handleStatusChangeClick]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderContent = () => {
    if ((status === 'loading' || status === 'idle') && designations.length === 0) {
        return <TableSkeleton />;
    }
    if (status === 'failed' && designations.length === 0) {
        return <ErrorState onRetry={() => dispatch(fetchDesignations())} error={error} />;
    }
    if (status === 'succeeded' && designations.length === 0) {
        return <EmptyState onAddNew={() => setCreatePanelOpen(true)} />;
    }
    
    const tableData = designations.map((item, index) => ({ ...item, s_no: index + 1 }));
    return (
        <Table
            columns={columns}
            data={tableData}
            showSearch={true}
            searchPlaceholder="Search by name or code"
        />
    );
  };

  return (
    <div className="w-full bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-md">
      <header className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Designations</h1>
            <nav aria-label="Breadcrumb" className="mt-1 flex items-center text-sm text-gray-500">
                <Link to="/getting-started" className="hover:text-gray-700">Getting Started</Link>
                <ChevronRight size={16} className="mx-1" />
                <span className="font-medium text-gray-800">Designations</span>
            </nav>
        </div>
        <button
            onClick={() => setCreatePanelOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 self-start sm:self-auto"
        >
            <Plus size={20} className="-ml-1 mr-2" />
            ADD NEW
        </button>
      </header>
      
      <main>
        {renderContent()}
      </main>
      
      <CreateDesignation isOpen={isCreatePanelOpen} onClose={() => setCreatePanelOpen(false)} /> 
      <UpdateDesignation 
        isOpen={!!editingDesignation}
        onClose={() => setEditingDesignation(null)}
        designationData={editingDesignation}
      />

      <AlertModal
        isOpen={alertData.isOpen}
        onClose={() => setAlertData({ isOpen: false, designationId: null, actionType: null })}
        onConfirm={handleConfirmAction}
        title={`${alertData.actionType === 'active' ? 'Activate' : 'Deactivate'} Designation`}
        icon={<AlertIcon className={alertData.actionType === 'active' ? 'text-green-500' : 'text-red-500'} size={40} strokeWidth={3} />}
      >
        <p>Are you sure you want to set this designation as {alertData.actionType}?</p>
      </AlertModal>
    </div>
  );
};

export default DesignationPage;
