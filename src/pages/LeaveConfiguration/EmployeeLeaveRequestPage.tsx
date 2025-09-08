// import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
// import { MoreHorizontal, SlidersHorizontal, X, ServerCrash, RefreshCw } from 'lucide-react';
// import { useSelector, useDispatch } from 'react-redux';
// import Table, { type Column } from '../../components/common/Table'; 
// import LeaveFilter, { type LeaveFilters } from '../../components/LeaveConfiguration/LeaveFilter';
// import LeaveRequestDetail from '../../components/LeaveConfiguration/LeaveRequestDetail';
// import Toast from '../../components/common/Toast'; 
// import type { AppDispatch, RootState } from '../../store/store';
// import { 
//     fetchLeaveRequests, 
//     clearLeaveRequests,
//     type LeaveRequest,
//     type ApprovalStatus 
// } from '../../store/slice/leaveRequestSlice';


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

// const EmptyState: React.FC = () => (
//     <div className="text-center py-10 px-4 bg-gray-50 border border-gray-200 rounded-lg">
//         <h3 className="text-lg font-semibold text-gray-800">No Results Found</h3>
//     </div>
// );


// const StatusBadge: React.FC<{ status: ApprovalStatus }> = ({ status }) => {
//     const statusClasses = {
//         Pending: "bg-yellow-100 text-yellow-800",
//         Approved: "bg-green-100 text-green-800",
//         Declined: "bg-red-100 text-red-800",
//         Rejected: "bg-red-100 text-red-800",
//     };
//     return <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusClasses[status]}`}>{status}</span>;
// };

// // --- MAIN PAGE COMPONENT ---
// const EmployeeLeaveRequestPage: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { data: leaveRequests, status, error } = useSelector((state: RootState) => state.leaveRequests);

//   const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
//   const dropdownRef = useRef<HTMLDivElement>(null);
  
//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   const [appliedFilters, setAppliedFilters] = useState<LeaveFilters | null>(null);
//   const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
//   const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

//   useEffect(() => {
//     dispatch(fetchLeaveRequests(null));
//     return () => {
//         dispatch(clearLeaveRequests());
//     }
//   }, [dispatch]);

//   const handleApplyFilters = (filters: LeaveFilters) => {
//       setAppliedFilters(filters);
//       dispatch(fetchLeaveRequests(filters));
//   };

//   const handleClearFilters = () => {
//       setAppliedFilters(null);
//       dispatch(fetchLeaveRequests(null));
//   };
  
//   const handleRetry = () => dispatch(fetchLeaveRequests(appliedFilters));

//   const handleViewDetails = useCallback((request: LeaveRequest) => {
//       setSelectedRequest(request);
//       setActiveDropdown(null);
//   }, []);

//   const columns: Column<LeaveRequest>[] = useMemo(() => [
//     { key: 'employeeName', header: 'Employee Name' },
//     { key: 'empCode', header: 'Employee code' },
//     { key: 'leaveType', header: 'Leave type' },
//     { key: 'startDate', header: 'Start-End date', render: (row) => `${new Date(row.startDate).toLocaleDateString()} - ${new Date(row.endDate).toLocaleDateString()}` },
//     { key: 'duration', header: 'Duration (Days)', render: (row) => `${row.duration} Day${row.duration > 1 ? 's' : ''}` },
//     { key: 'appliedOn', header: 'Applied On', render: (row) => new Date(row.appliedOn).toLocaleDateString() },
//     { key: 'department', header: 'Department' },
//     { key: 'myApprovalStatus', header: 'My Approval Status', render: (row) => <StatusBadge status={row.myApprovalStatus} /> },
//     { key: 'finalApprovalStatus', header: 'Final Approval Status', render: (row) => <StatusBadge status={row.finalApprovalStatus} /> },
//     {
//       key: 'action',
//       header: 'Action',
//       render: (row) => (
//         <div className="relative">
//           <button onClick={() => setActiveDropdown(activeDropdown === row.id ? null : row.id)} className="p-1 rounded-full">
//             <MoreHorizontal size={20} />
//           </button>
//           {activeDropdown === row.id && (
//             <div ref={dropdownRef} className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-20">
//               <button onClick={() => handleViewDetails(row)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">View Details</button>
//             </div>
//           )}
//         </div>
//       ),
//     },
//   ], [activeDropdown, handleViewDetails]);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setActiveDropdown(null);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const activeFilterCount = appliedFilters 
//     ? (appliedFilters.leaveTypes?.length || 0) + (appliedFilters.approvalStatus?.length || 0) + (appliedFilters.departments?.length || 0) 
//     : 0;

//   const renderContent = () => {
//       if (status === 'loading' || status === 'idle') {
//           return <TableSkeleton />;
//       }
//       if (status === 'failed') {
//           return <ErrorState onRetry={handleRetry} error={error} />;
//       }
//       if (leaveRequests.length === 0) {
//           return <EmptyState />;
//       }
//       return (
//         <Table 
//             columns={columns} 
//             data={leaveRequests} 
//             showSearch={true} 
//             searchPlaceholder="Search by name or code..."
//             showPagination={true}
//             defaultItemsPerPage={10}
//         />
//       );
//   };

//   return (
//     <div className="w-full bg-white p-6 rounded-lg shadow-md">
//       {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
//       <header className="mb-6">
//         <div className="flex justify-between items-center flex-wrap gap-4">
//             <div>
//                 <h1 className="text-2xl font-bold text-gray-900">Employee Leaves Request</h1>
//                 <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mt-1">
//                     Dashboard / Leave configuration / Employees leave requests
//                 </nav>
//             </div>
//             <div className="flex items-center gap-4">
//                 <button 
//                   onClick={() => setIsFilterOpen(true)}
//                   className="p-2 border rounded-md text-gray-600 hover:bg-gray-100 relative"
//                 >
//                     <SlidersHorizontal size={20} />
//                     {activeFilterCount > 0 && (
//                         <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-xs font-bold text-white">
//                             {activeFilterCount}
//                         </span>
//                     )}
//                 </button>
//             </div>
//         </div>
//       </header>
      
//       <main>
//           {appliedFilters && (
//             <div className="bg-gray-50 p-3 rounded-md mb-4 flex justify-between items-center">
//                 <p className="text-sm text-gray-700">
//                     Filters are active. {leaveRequests.length} results found.
//                 </p>
//                 <button onClick={handleClearFilters} className="flex items-center text-sm text-purple-600 hover:underline">
//                     <X size={16} className="mr-1" />
//                     Clear Filters
//                 </button>
//             </div>
//           )}
//           {renderContent()}
//       </main>

//       <LeaveFilter isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} onApply={handleApplyFilters} initialFilters={appliedFilters} />
//       <LeaveRequestDetail 
//         isOpen={!!selectedRequest} 
//         onClose={() => setSelectedRequest(null)} 
//         request={selectedRequest}
//         setToast={setToast}
//       />
//     </div>
//   );
// };

// export default EmployeeLeaveRequestPage;


import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { MoreHorizontal, SlidersHorizontal, X, ServerCrash, RefreshCw, ChevronRight } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';

// --- Component & Redux Imports ---
import Table, { type Column } from '../../components/common/Table'; 
import LeaveFilter, { type LeaveFilters } from '../../components/LeaveConfiguration/LeaveFilter';
import LeaveRequestDetail from '../../components/LeaveConfiguration/LeaveRequestDetail';
import Toast from '../../components/common/Toast'; 
import type { AppDispatch, RootState } from '../../store/store';
import { 
    fetchLeaveRequests, 
    clearLeaveRequests,
    type LeaveRequest,
    type ApprovalStatus 
} from '../../store/slice/leaveRequestSlice';


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

const EmptyState: React.FC = () => (
    <div className="text-center py-10 px-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800">No Results Found</h3>
    </div>
);


const StatusBadge: React.FC<{ status: ApprovalStatus }> = ({ status }) => {
    const statusClasses = {
        Pending: "bg-yellow-100 text-yellow-800",
        Approved: "bg-green-100 text-green-800",
        Rejected: "bg-red-100 text-red-800",
    };
    return <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusClasses[status]}`}>{status}</span>;
};

// --- MAIN PAGE COMPONENT ---
const EmployeeLeaveRequestPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: leaveRequests, status, error } = useSelector((state: RootState) => state.leaveRequests);

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<LeaveFilters | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [toastInfo, setToastInfo] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    // Fetch initial data without any filters
    dispatch(fetchLeaveRequests(null));
    // Clear the data when the component unmounts to ensure fresh data on next visit
    return () => {
        dispatch(clearLeaveRequests());
    }
  }, [dispatch]);

  const handleApplyFilters = useCallback((filters: LeaveFilters) => {
      setAppliedFilters(filters);
      // Let the Redux slice handle the API call with the filters
      dispatch(fetchLeaveRequests(filters));
  }, [dispatch]);

  const handleClearFilters = useCallback(() => {
      setAppliedFilters(null);
      // Fetch the unfiltered data again
      dispatch(fetchLeaveRequests(null));
  }, [dispatch]);
  
  const handleRetry = useCallback(() => {
    // Retry the fetch with the currently applied filters
    dispatch(fetchLeaveRequests(appliedFilters));
  }, [dispatch, appliedFilters]);

  const handleViewDetails = useCallback((request: LeaveRequest) => {
      setSelectedRequest(request);
      setActiveDropdown(null);
  }, []);

  const columns: Column<LeaveRequest>[] = useMemo(() => [
    { key: 'employeeName', header: 'Employee Name' },
    { key: 'empCode', header: 'Employee code' },
    { key: 'leaveType', header: 'Leave type' },
    { key: 'startDate', header: 'Start-End date', render: (row) => `${new Date(row.startDate).toLocaleDateString()} - ${new Date(row.endDate).toLocaleDateString()}` },
    { key: 'duration', header: 'Duration (Days)', render: (row) => `${row.duration} Day${row.duration > 1 ? 's' : ''}` },
    { key: 'appliedOn', header: 'Applied On', render: (row) => new Date(row.appliedOn).toLocaleDateString() },
    { key: 'department', header: 'Department' },
    { key: 'myApprovalStatus', header: 'My Approval Status', render: (row) => <StatusBadge status={row.myApprovalStatus} /> },
    { key: 'finalApprovalStatus', header: 'Final Approval Status', render: (row) => <StatusBadge status={row.finalApprovalStatus} /> },
    {
      key: 'action',
      header: 'Action',
      render: (row) => (
        <div className="relative">
          <button onClick={() => setActiveDropdown(activeDropdown === row.id ? null : row.id)} className="p-1 rounded-full">
            <MoreHorizontal size={20} />
          </button>
          {activeDropdown === row.id && (
            <div ref={dropdownRef} className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-20">
              <button onClick={() => handleViewDetails(row)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">View Details</button>
            </div>
          )}
        </div>
      ),
    },
  ], [activeDropdown, handleViewDetails]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeFilterCount = appliedFilters 
    ? (appliedFilters.leaveTypes?.length || 0) + (appliedFilters.approvalStatus?.length || 0) + (appliedFilters.departments?.length || 0) 
    : 0;

  const renderContent = () => {
      if (status === 'loading' || status === 'idle') {
          return <TableSkeleton />;
      }
      if (status === 'failed') {
          return <ErrorState onRetry={handleRetry} error={error} />;
      }
      // The component now correctly displays the data directly from the Redux store
      if (leaveRequests.length === 0) {
          return <EmptyState />;
      }
      return (
        <Table 
            columns={columns} 
            data={leaveRequests} 
            showSearch={true} 
            searchPlaceholder="Search by name or code..."
            showPagination={true}
            defaultItemsPerPage={10}
        />
      );
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-md">
      {toastInfo && <Toast message={toastInfo.message} type={toastInfo.type} onClose={() => setToastInfo(null)} />}
      <header className="mb-6">
        <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Employee Leaves Request</h1>
                <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mt-1 flex items-center">
                <span className="hover:text-gray-700">Leave Configuration</span>
                 <ChevronRight size={16} className="mx-1" />
                <span className="font-medium text-gray-800">Employee Leaves Request</span>
          </nav>
            </div>
            <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsFilterOpen(true)}
                  className="p-2 border rounded-md text-gray-600 hover:bg-gray-100 relative"
                >
                    <SlidersHorizontal size={20} />
                    {activeFilterCount > 0 && (
                        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-xs font-bold text-white">
                            {activeFilterCount}
                        </span>
                    )}
                </button>
            </div>
        </div>
      </header>
      
      <main>
          {appliedFilters && (
            <div className="bg-gray-50 p-3 rounded-md mb-4 flex justify-between items-center">
                <p className="text-sm text-gray-700">
                    Filters are active. {leaveRequests.length} results found.
                </p>
                <button onClick={handleClearFilters} className="flex items-center text-sm text-purple-600 hover:underline">
                    <X size={16} className="mr-1" />
                    Clear Filters
                </button>
            </div>
          )}
          {renderContent()}
      </main>

      <LeaveFilter isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} onApply={handleApplyFilters} initialFilters={appliedFilters} />
      <LeaveRequestDetail 
        isOpen={!!selectedRequest} 
        onClose={() => setSelectedRequest(null)} 
        request={selectedRequest}
        setToast={setToastInfo}
      />
    </div>
  );
};

export default EmployeeLeaveRequestPage;


