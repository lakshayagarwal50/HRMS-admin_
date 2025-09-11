// import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
// import { Link } from 'react-router-dom';
// import { ChevronRight, Plus, MoreHorizontal, Edit, ToggleLeft, ToggleRight, ServerCrash, RefreshCw } from 'lucide-react';
// import { useSelector, useDispatch } from 'react-redux';


// import Table, { type Column } from '../../../components/common/Table';
// import type { AppDispatch, RootState } from '../../../store/store';
// import { fetchRoles, toggleRoleStatus, type Role } from '../../../store/slice/roleSlice';


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
//         <h3 className="mt-2 text-lg font-semibold text-red-800">Failed to Load Roles</h3>
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
//         <h3 className="mt-2 text-lg font-semibold text-gray-800">No Roles Found</h3>
//         <p className="mt-1 text-sm text-gray-600">Get started by creating a new role.</p>
//         <div className="mt-6">
//             <Link to="/roles/add" className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700">
//                 <Plus size={20} className="-ml-1 mr-2" />
//                 ADD NEW
//             </Link>
//         </div>
//     </div>
// );



// const RolesPage: React.FC = () => {
//     const dispatch = useDispatch<AppDispatch>();
//     const { items: roles, status, error } = useSelector((state: RootState) => state.roles);
//     const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
//     const dropdownRef = useRef<HTMLDivElement>(null);

//     useEffect(() => {
//         if (status === 'idle') {
//             dispatch(fetchRoles());
//         }
//     }, [status, dispatch]);

//     const handleStatusToggle = useCallback((role: Role) => {
//         dispatch(toggleRoleStatus(role));
//         setActiveDropdown(null);
//     }, [dispatch]);

//     const rolesWithSerial = useMemo(() => {
//         return roles.map((role, index) => ({ ...role, s_no: index + 1 }));
//     }, [roles]);

//     const columns: Column<Role & { s_no: number }>[] = useMemo(() => [
//       { header: "S_No", key: "s_no" },
//       { header: "Role Name", key: "name" },
//       { header: "Code", key: "code" },
//       { header: "Description", key: "description", className: "max-w-xs truncate" },
//       {
//         header: "Status",
//         key: "status",
//         render: (row) => (
//           <span
//             className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
//               row.status === "Active"
//                 ? "bg-green-100 text-green-800"
//                 : "bg-red-100 text-red-800"
//             }`}
//           >
//             {row.status}
//           </span>
//         ),
//       },
//       {
//         header: "Action",
//         key: "action",
//         className: "text-center",
//         render: (row) => (
//           <div className="relative">
//             <button 
//                 onClick={() => setActiveDropdown(activeDropdown === row.id ? null : row.id)}
//                 className="text-gray-500 hover:text-purple-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
//             >
//               <MoreHorizontal size={20} />
//             </button>
//             {activeDropdown === row.id && (
//                 <div ref={dropdownRef} className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg z-10">
//                   <div className="py-1">
//                     <Link
//                       to={`/roles/edit/${row.id}`}
//                       className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                     >
//                       <Edit size={16} className="mr-3" />
//                       Edit
//                     </Link>
//                     <button
//                       onClick={() => handleStatusToggle(row)}
//                       className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                     >
//                       {row.status === "Active" ? (
//                         <ToggleLeft size={16} className="mr-3" />
//                       ) : (
//                         <ToggleRight size={16} className="mr-3" />
//                       )}
//                       {row.status === "Active" ? "Set Inactive" : "Set Active"}
//                     </button>
//                   </div>
//                 </div>
//             )}
//           </div>
//         ),
//       },
//     ], [activeDropdown, handleStatusToggle]);

//     useEffect(() => {
//         const handleClickOutside = (event: MouseEvent) => {
//           if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//             setActiveDropdown(null);
//           }
//         };
//         document.addEventListener('mousedown', handleClickOutside);
//         return () => document.removeEventListener('mousedown', handleClickOutside);
//     }, []);

//     const renderContent = () => {
//         if (status === 'loading' || status === 'idle') {
//             return <TableSkeleton />;
//         }
//         if (status === 'failed') {
//             return <ErrorState onRetry={() => dispatch(fetchRoles())} error={error} />;
//         }
//         if (status === 'succeeded' && rolesWithSerial.length === 0) {
//             return <EmptyState />;
//         }
//         return (
//             <Table
//                 data={rolesWithSerial}
//                 columns={columns}
//                 defaultItemsPerPage={10}
//                 searchPlaceholder="Search by name or code..."
//             />
//         );
//     };

//     return (
//         <div className="w-full bg-gray-50 p-4 sm:p-6">
//             <header className="mb-6">
//                 <div className="flex justify-between items-center flex-wrap gap-4">
//                     <div>
//                         <h1 className="text-2xl font-bold text-gray-900">Roles</h1>
//                         <nav aria-label="Breadcrumb" className="mt-1 flex items-center text-sm text-gray-500">
//                             <Link to="/getting-started" className="hover:text-gray-700">Getting Started</Link>
//                             <ChevronRight size={16} className="mx-1" />
//                             <span className="font-medium text-gray-800">Roles</span>
//                         </nav>
//                     </div>
//                     <Link to="/roles/add" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700">
//                         <Plus size={20} className="-ml-1 mr-2" />
//                         ADD NEW
//                     </Link>
//                 </div>
//             </header>

//             <main>
//                 {renderContent()}
//             </main>
//         </div>
//     );
// };

// export default RolesPage;

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Plus, MoreHorizontal, Edit, ToggleLeft, ToggleRight, ServerCrash, RefreshCw } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';

import Table, { type Column } from '../../../components/common/Table';
import type { AppDispatch, RootState } from '../../../store/store';
import { fetchRoles, toggleRoleStatus, type Role } from '../../../store/slice/roleSlice';

// --- Helper Components for Different States ---

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
        <h3 className="mt-2 text-lg font-semibold text-red-800">Failed to Load Roles</h3>
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
        <h3 className="mt-2 text-lg font-semibold text-gray-800">No Roles Found</h3>
        <p className="mt-1 text-sm text-gray-600">Get started by creating a new role.</p>
        <div className="mt-6">
            <Link to="/roles/add" className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700">
                <Plus size={20} className="-ml-1 mr-2" />
                ADD NEW
            </Link>
        </div>
    </div>
);

// --- Main Page Component ---

const RolesPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { items: roles, status, error } = useSelector((state: RootState) => state.roles);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchRoles());
        }
    }, [status, dispatch]);

    const handleStatusToggle = useCallback((role: Role) => {
        const newStatus = role.status === "Active" ? "Inactive" : "Active";
        const promise = dispatch(toggleRoleStatus(role));

        toast.promise(
            promise.unwrap(),
            {
                loading: 'Updating status...',
                success: `Role has been set to ${newStatus}.`,
                error: (err) => err.message || 'Failed to update status.',
            }
        );

        promise.finally(() => {
            setActiveDropdown(null);
        });
    }, [dispatch]);

    const rolesWithSerial = useMemo(() => {
        return roles.map((role, index) => ({ ...role, s_no: index + 1 }));
    }, [roles]);

    const columns: Column<Role & { s_no: number }>[] = useMemo(() => [
      { header: "S_No", key: "s_no" },
      { header: "Role Name", key: "name" },
      { header: "Code", key: "code" },
      { header: "Description", key: "description", className: "max-w-xs truncate" },
      {
        header: "Status",
        key: "status",
        render: (row) => (
          <span
            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
              row.status === "Active"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {row.status}
          </span>
        ),
      },
      {
        header: "Action",
        key: "action",
        className: "text-center",
        render: (row) => (
          <div className="relative">
            <button 
                onClick={() => setActiveDropdown(activeDropdown === row.id ? null : row.id)}
                className="text-gray-500 hover:text-purple-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <MoreHorizontal size={20} />
            </button>
            {activeDropdown === row.id && (
                <div ref={dropdownRef} className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg z-10 border border-gray-100">
                  <div className="py-1">
                    <Link
                      to={`/roles/edit/${row.id}`}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Edit size={16} className="mr-3" />
                      Edit
                    </Link>
                    <button
                      onClick={() => handleStatusToggle(row)}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {row.status === "Active" ? (
                        <ToggleLeft size={16} className="mr-3 text-red-500" />
                      ) : (
                        <ToggleRight size={16} className="mr-3 text-green-500" />
                      )}
                      {row.status === "Active" ? "Set Inactive" : "Set Active"}
                    </button>
                  </div>
                </div>
            )}
          </div>
        ),
      },
    ], [activeDropdown, handleStatusToggle]);

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
        if (status === 'loading' || status === 'idle') {
            return <TableSkeleton />;
        }
        if (status === 'failed') {
            return <ErrorState onRetry={() => dispatch(fetchRoles())} error={error} />;
        }
        if (status === 'succeeded' && rolesWithSerial.length === 0) {
            return <EmptyState />;
        }
        return (
            <Table
                data={rolesWithSerial}
                columns={columns}
                defaultItemsPerPage={10}
                searchPlaceholder="Search by name or code..."
            />
        );
    };

    return (
        <div className="w-full bg-gray-50 p-4 sm:p-6 min-h-screen">
            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 4000,
                    success: {
                        style: {
                            background: '#F0FDF4', // green-50
                            color: '#166534',     // green-800
                            border: '1px solid #A7F3D0', // green-200
                        },
                    },
                    error: {
                        style: {
                            background: '#FEF2F2', // red-50
                            color: '#991B1B',     // red-800
                            border: '1px solid #FECACA', // red-200
                        },
                    },
                }}
            />

            <header className="mb-6">
                <div className="flex justify-between items-center flex-wrap gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Roles</h1>
                        <nav aria-label="Breadcrumb" className="mt-1 flex items-center text-sm text-gray-500">
                            <Link to="/getting-started" className="hover:text-gray-700">Getting Started</Link>
                            <ChevronRight size={16} className="mx-1" />
                            <span className="font-medium text-gray-800">Roles</span>
                        </nav>
                    </div>
                    <Link to="/roles/add" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700">
                        <Plus size={20} className="-ml-1 mr-2" />
                        ADD NEW
                    </Link>
                </div>
            </header>

            <main>
                {renderContent()}
            </main>
        </div>
    );
};

export default RolesPage;