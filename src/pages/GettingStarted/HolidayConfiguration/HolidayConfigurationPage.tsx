// import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { Plus, MoreHorizontal, RefreshCw, ServerCrash, ChevronRight } from 'lucide-react';
// import {
//   fetchHolidayConfigurations,
//   addHolidayConfiguration,
//   updateHolidayConfiguration,
//   deleteHolidayConfiguration,
//   type HolidayConfiguration,
// } from '../../../store/slice/holidayconfigurationSlice'; 
// import type { RootState, AppDispatch } from '../../../store/store'; 
// import Table, { type Column } from "../../../components/common/Table"; 
// import AlertModal from '../../../components/Modal/AlertModal'; 
// import SidePanelForm from '../../../components/common/SidePanelForm';
// import toast from 'react-hot-toast';
// import { Link } from 'react-router-dom';

// type HolidayConfigDisplay = HolidayConfiguration & { s_no: number };


// const TableSkeleton: React.FC = () => (
//     <div className="w-full bg-white p-4 rounded-lg border border-gray-200 animate-pulse">
//         <div className="space-y-3">
//             {[...Array(4)].map((_, i) => <div key={i} className="h-12 bg-gray-200 rounded-md w-full"></div>)}
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
//         <h3 className="mt-2 text-lg font-semibold text-gray-800">No Configurations Found</h3>
//         <p className="mt-1 text-sm text-gray-600">Get started by adding a new holiday configuration.</p>
//         <div className="mt-6">
//             <button type="button" onClick={onAddNew} className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700">
//                 <Plus size={20} className="-ml-1 mr-2" />
//                 Add New Configuration
//             </button>
//         </div>
//     </div>
// );

// const CreateHolidayConfiguration: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({ isOpen, onClose }) => {
//   const dispatch = useDispatch<AppDispatch>();
//   const [name, setName] = useState('');
//   const [code, setCode] = useState('');
//   const [description, setDescription] = useState('');

//   const handleSubmit = (e: React.FormEvent) => {
//   e.preventDefault();

//   if (!name.trim()) {
//     toast.error('Name is required.');
//     return;
//   }

//   dispatch(addHolidayConfiguration({ name: name, code, description }));
//   toast.success('Holiday configuration added successfully!');
//   onClose();
// };


//   useEffect(() => {
//     if (isOpen) {
//       setName('');
//       setCode('');
//       setDescription('');
//     }
//   }, [isOpen]);

//   return (
//     <SidePanelForm isOpen={isOpen} onClose={onClose} title="Create Holiday Group" onSubmit={handleSubmit}>
//       <div className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
//           <input type="text" value={name}  placeholder='eg: diwali' onChange={(e) => setName(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
//           <input type="text" value={code} placeholder='1001' onChange={(e) => setCode(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//           <textarea value={description} placeholder='type here' onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
//         </div>
//       </div>
//     </SidePanelForm>
//   );
// };

// const UpdateHolidayConfiguration: React.FC<{ isOpen: boolean; onClose: () => void; configData: HolidayConfiguration | null; }> = ({ isOpen, onClose, configData }) => {
//   const dispatch = useDispatch<AppDispatch>();
//   const [name, setName] = useState('');
//   const [code, setCode] = useState('');
//   const [description, setDescription] = useState('');

//   useEffect(() => {
//     if (configData) {
//       setName(configData.name);
//       setCode(configData.code);
//       setDescription(configData.description);
//     }
//   }, [configData]);

//  const handleSubmit = (e: React.FormEvent) => {
//   e.preventDefault();

//   if (!name.trim() || !configData) {
//     toast.error('Name is required.');
//     return;
//   }

//   dispatch(updateHolidayConfiguration({ ...configData, name: name, code, description }));
//   toast.success('Holiday configuration updated successfully!');
//   onClose();
// };


//   return (
//     <SidePanelForm isOpen={isOpen} onClose={onClose} title="Edit Holiday Group" onSubmit={handleSubmit} submitText="Update">
//        <div className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
//           <input type="text" value={name} placeholder='eg: Diwali' onChange={(e) => setName(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
//           <input type="text" value={code} onChange={(e) => setCode(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//           <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
//         </div>
//       </div>
//     </SidePanelForm>
//   );
// };

// const HolidayConfigurationPage: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { items: holidayConfigs, status, error } = useSelector((state: RootState) => state.holidayConfigurations);

//   const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
//   const dropdownRef = useRef<HTMLDivElement>(null);
//   const [isCreatePanelOpen, setCreatePanelOpen] = useState(false);
//   const [editingConfig, setEditingConfig] = useState<HolidayConfiguration | null>(null);
//   const [deleteAlert, setDeleteAlert] = useState<{ isOpen: boolean; configId: string | null }>({
//     isOpen: false,
//     configId: null,
//   });

//   useEffect(() => {
//     if (status === 'idle') {
//       dispatch(fetchHolidayConfigurations());
//     }
//   }, [status, dispatch]);

//   const handleEditClick = useCallback((config: HolidayConfiguration) => {
//     setEditingConfig(config);
//     setActiveDropdown(null);
//   }, []);

//   const handleDeleteClick = useCallback((configId: string) => {
//     setDeleteAlert({ isOpen: true, configId });
//     setActiveDropdown(null);
//   }, []);

//   const handleConfirmDelete = useCallback(() => {
//     if (deleteAlert.configId) {
//       dispatch(deleteHolidayConfiguration(deleteAlert.configId));
//     }
//     setDeleteAlert({ isOpen: false, configId: null });
//   }, [deleteAlert.configId, dispatch]);

//   const columns = useMemo<Column<HolidayConfigDisplay>[]>(() => [
//     { key: 's_no', header: 'S.No', className: 'w-16 text-center' },
//     { key: 'name', header: 'Group Name' },
//     { key: 'code', header: 'Code' },
//     { key: 'description', header: 'Description' },
//     {
//       key: 'action',
//       header: 'Action',
//       render: (row) => (
//         <div className="relative">
//           <button onClick={() => setActiveDropdown(activeDropdown === row.id ? null : row.id)} className="text-gray-500 hover:text-purple-600 p-1 rounded-full">
//             <MoreHorizontal size={20} />
//           </button>
//           {activeDropdown === row.id && (
//             <div ref={dropdownRef} className="absolute right-0 mt-2 w-32 bg-white border rounded-md shadow-lg z-20">
//               <a href="#" onClick={(e) => { e.preventDefault(); handleEditClick(row); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Edit</a>
//               <a href="#" onClick={(e) => { e.preventDefault(); handleDeleteClick(row.id); }} className="block px-4 py-2 text-sm text-red-700 hover:bg-gray-100">Delete</a>
//             </div>
//           )}
//         </div>
//       ),
//     },
//   ], [activeDropdown, handleEditClick, handleDeleteClick]);

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
//     if ((status === 'loading' || status === 'idle') && holidayConfigs.length === 0) {
//       return <TableSkeleton />;
//     }

//     if (status === 'failed' && holidayConfigs.length === 0) {
//       return <ErrorState onRetry={() => dispatch(fetchHolidayConfigurations())} error={error} />;
//     }

//     if (status === 'succeeded' && holidayConfigs.length === 0) {
//       return <EmptyState onAddNew={() => setCreatePanelOpen(true)} />;
//     }

//     const tableData = holidayConfigs.map((item, index) => ({ ...item, s_no: index + 1 }));

//     return (
//       <Table
//         columns={columns}
//         data={tableData}
//         defaultItemsPerPage={5}
//         showSearch={true}
//         searchPlaceholder="Search Configurations..."
//       />
//     );
//   };

//   return (
//     <div className="w-full bg-white p-6 rounded-lg shadow-md border border-blue-200">
//       <header className="mb-6 flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Holiday Configuration</h1>
//           <nav aria-label="Breadcrumb"className="mt-1 flex items-center text-sm text-gray-500">
//              <Link to="/dashboard" className="hover:text-gray-700">
//                 Dashboard
//               </Link>
//               <ChevronRight className="w-4 h-4 mx-1" />
//               <Link to="/getting-started" className="hover:text-gray-700">
//                 Getting Started
//               </Link>
//               <ChevronRight className="w-4 h-4 mx-1" />
//               <span className="font-medium text-gray-800">Holiday Configurationr</span>
//           </nav>
//         </div>
//         <button
//             onClick={() => setCreatePanelOpen(true)}
//             className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700"
//         >
//             <Plus size={20} className="-ml-1 mr-2" />
//             ADD NEW
//         </button>
//       </header>
      
//       <main>
//           {renderContent()}
//       </main>
      
//       <CreateHolidayConfiguration 
//         isOpen={isCreatePanelOpen} 
//         onClose={() => setCreatePanelOpen(false)}
//       />

//       <UpdateHolidayConfiguration
//         isOpen={!!editingConfig}
//         onClose={() => setEditingConfig(null)}
//         configData={editingConfig}
//       />

//       <AlertModal
//         isOpen={deleteAlert.isOpen}
//         onClose={() => setDeleteAlert({ isOpen: false, configId: null })}
//         onConfirm={handleConfirmDelete}
//         title="Delete Configuration"
//       >
//         <p>Are you sure you want to delete this holiday configuration?</p>
//       </AlertModal>
//     </div>
//   );
// };

// export default HolidayConfigurationPage;
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, MoreHorizontal, RefreshCw, ServerCrash, ChevronRight, X } from 'lucide-react';
import {
  fetchHolidayConfigurations,
  addHolidayConfiguration,
  updateHolidayConfiguration,
  deleteHolidayConfiguration,
  type HolidayConfiguration,
} from '../../../store/slice/holidayconfigurationSlice'; // Adjust path as needed
import type { RootState, AppDispatch } from '../../../store/store'; // Adjust path as needed
import Table, { type Column } from "../../../components/common/Table"; // Adjust path as needed
import AlertModal from '../../../components/Modal/AlertModal'; // Adjust path as needed
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { z } from 'zod';

//================================================================================
// HELPER & SHARED COMPONENTS
//================================================================================

// ✨ New Spinner Component
const Spinner: React.FC = () => (
  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);


// ✨ Updated SidePanelForm Component
interface SidePanelFormProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onSubmit: (e: React.FormEvent) => void;
  children: React.ReactNode;
  submitText?: string;
  isSubmitting?: boolean;
}

const SidePanelForm: React.FC<SidePanelFormProps> = ({
  isOpen,
  onClose,
  title,
  onSubmit,
  children,
  submitText = 'Submit',
  isSubmitting = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 bg-black opacity-50" onClick={!isSubmitting ? onClose : undefined}></div>
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform ease-in-out duration-300">
        <form onSubmit={onSubmit} className="flex flex-col h-full">
          <header className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="p-1 rounded-full text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X size={24} />
            </button>
          </header>
          <main className="flex-1 p-6 overflow-y-auto">
            {children}
          </main>
          <footer className="p-4 bg-gray-50 border-t flex justify-end items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md shadow-sm hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-wait"
            >
              {isSubmitting && <Spinner />}
              {isSubmitting ? 'Saving...' : submitText}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};


//================================================================================
// UI STATE COMPONENTS (SKELETON, ERROR, EMPTY)
//================================================================================

// Define a type for the data displayed in the table
type HolidayConfigDisplay = HolidayConfiguration & { s_no: number };

// Define the validation schema using Zod
const holidayConfigSchema = z.object({
  name: z.string()
    .min(1, { message: "Name is required." })
    .regex(/^[a-zA-Z\s-]+$/, { message: "Name can only contain letters, spaces, and hyphens." }),
  code: z.string()
    .min(3, { message: "Code must be at least 3 digits." })
    .max(6, { message: "Code cannot be more than 6 digits." })
    .regex(/^\d+$/, { message: "Code must only contain digits." }),
  description: z.string().optional(),
});

const TableSkeleton: React.FC = () => (
    <div className="w-full bg-white p-4 rounded-lg border border-gray-200 animate-pulse">
        <div className="space-y-3">
            {[...Array(4)].map((_, i) => <div key={i} className="h-12 bg-gray-200 rounded-md w-full"></div>)}
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
        <h3 className="mt-2 text-lg font-semibold text-gray-800">No Configurations Found</h3>
        <p className="mt-1 text-sm text-gray-600">Get started by adding a new holiday configuration.</p>
        <div className="mt-6">
            <button type="button" onClick={onAddNew} className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700">
                <Plus size={20} className="-ml-1 mr-2" />
                Add New Configuration
            </button>
        </div>
    </div>
);

//================================================================================
// FORM COMPONENTS
//================================================================================

const CreateHolidayConfiguration: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [isSubmitting, setIsSubmitting] = useState(false); // State for loading

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const formData = { name, code, description };
    const validationResult = holidayConfigSchema.safeParse(formData);

    if (!validationResult.success) {
      const fieldErrors: Record<string, string> = {};
      validationResult.error.issues.forEach(issue => {
        fieldErrors[issue.path[0]] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true); // Start submission
    dispatch(addHolidayConfiguration(validationResult.data))
      .unwrap()
      .then(() => {
        toast.success('Configuration added successfully!');
        onClose();
      })
      .catch((error) => {
        toast.error(error || 'Failed to add configuration.');
      })
      .finally(() => {
        setIsSubmitting(false); // End submission
      });
  };

  useEffect(() => {
    if (isOpen) {
      setName('');
      setCode('');
      setDescription('');
      setErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen]);

  return (
    <SidePanelForm isOpen={isOpen} onClose={onClose} title="Create Holiday Group" onSubmit={handleSubmit} isSubmitting={isSubmitting}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
          <input type="text" value={name} placeholder='eg: Diwali Holidays' onChange={(e) => setName(e.target.value)} required className={`w-full px-3 py-2 border rounded-md shadow-sm ${errors.name ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Code <span className="text-red-500">*</span></label>
          <input type="text" value={code} placeholder='e.g., 1001' onChange={(e) => setCode(e.target.value)} required className={`w-full px-3 py-2 border rounded-md shadow-sm ${errors.code ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.code && <p className="text-sm text-red-600 mt-1">{errors.code}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea value={description} placeholder='Optional description' onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
        </div>
      </div>
    </SidePanelForm>
  );
};

const UpdateHolidayConfiguration: React.FC<{ isOpen: boolean; onClose: () => void; configData: HolidayConfiguration | null; }> = ({ isOpen, onClose, configData }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [isSubmitting, setIsSubmitting] = useState(false); // State for loading

  useEffect(() => {
    if (configData) {
      setName(configData.name);
      setCode(configData.code);
      setDescription(configData.description);
      setErrors({});
      setIsSubmitting(false);
    }
  }, [configData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!configData) return;
    setErrors({});
    const formData = { name, code, description };
    const validationResult = holidayConfigSchema.safeParse(formData);

    if (!validationResult.success) {
      const fieldErrors: Record<string, string> = {};
      validationResult.error.issues.forEach(issue => {
        fieldErrors[issue.path[0]] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true); // Start submission
    const updatePayload = { id: configData.id, ...validationResult.data };
    dispatch(updateHolidayConfiguration(updatePayload))
      .unwrap()
      .then(() => {
        toast.success('Configuration updated successfully!');
        onClose();
      })
      .catch((error) => {
        toast.error(error || 'Failed to update configuration.');
      })
      .finally(() => {
        setIsSubmitting(false); // End submission
      });
  };

  return (
    <SidePanelForm isOpen={isOpen} onClose={onClose} title="Edit Holiday Group" onSubmit={handleSubmit} submitText="Update" isSubmitting={isSubmitting}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
          <input type="text" value={name} placeholder='eg: Diwali Holidays' onChange={(e) => setName(e.target.value)} required className={`w-full px-3 py-2 border rounded-md shadow-sm ${errors.name ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Code <span className="text-red-500">*</span></label>
          <input type="text" value={code} onChange={(e) => setCode(e.target.value)} required className={`w-full px-3 py-2 border rounded-md shadow-sm ${errors.code ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.code && <p className="text-sm text-red-600 mt-1">{errors.code}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
        </div>
      </div>
    </SidePanelForm>
  );
};


//================================================================================
// MAIN PAGE COMPONENT
//================================================================================

const HolidayConfigurationPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: holidayConfigs, status, error } = useSelector((state: RootState) => state.holidayConfigurations);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isCreatePanelOpen, setCreatePanelOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<HolidayConfiguration | null>(null);
  const [deleteAlert, setDeleteAlert] = useState<{ isOpen: boolean; configId: string | null }>({
    isOpen: false,
    configId: null,
  });

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchHolidayConfigurations());
    }
  }, [status, dispatch]);

  const handleEditClick = useCallback((config: HolidayConfiguration) => {
    setEditingConfig(config);
    setActiveDropdown(null);
  }, []);

  const handleDeleteClick = useCallback((configId: string) => {
    setDeleteAlert({ isOpen: true, configId });
    setActiveDropdown(null);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (deleteAlert.configId) {
      dispatch(deleteHolidayConfiguration(deleteAlert.configId))
        .unwrap()
        .then(() => {
          toast.success('Configuration deleted successfully!');
        })
        .catch((error) => {
          toast.error(error || 'Failed to delete configuration.');
        });
    }
    setDeleteAlert({ isOpen: false, configId: null });
  }, [deleteAlert.configId, dispatch]);

  const columns = useMemo<Column<HolidayConfigDisplay>[]>(() => [
    { key: 's_no', header: 'S.No', className: 'w-16 text-center' },
    { key: 'name', header: 'Group Name' },
    { key: 'code', header: 'Code' },
    { key: 'description', header: 'Description' },
    {
      key: 'action',
      header: 'Action',
      className: 'text-center',
      render: (row) => (
        <div className="relative inline-block">
          <button onClick={() => setActiveDropdown(activeDropdown === row.id ? null : row.id)} className="text-gray-500 hover:text-purple-600 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500">
            <MoreHorizontal size={20} />
          </button>
          {activeDropdown === row.id && (
            <div ref={dropdownRef} className="absolute right-0 mt-2 w-32 bg-white border rounded-md shadow-lg z-20">
              <a href="#" onClick={(e) => { e.preventDefault(); handleEditClick(row); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Edit</a>
              <a href="#" onClick={(e) => { e.preventDefault(); handleDeleteClick(row.id); }} className="block px-4 py-2 text-sm text-red-700 hover:bg-gray-100">Delete</a>
            </div>
          )}
        </div>
      ),
    },
  ], [activeDropdown, handleEditClick, handleDeleteClick]);

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
    if ((status === 'loading' || status === 'idle') && holidayConfigs.length === 0) {
      return <TableSkeleton />;
    }
    if (status === 'failed' && holidayConfigs.length === 0) {
      return <ErrorState onRetry={() => dispatch(fetchHolidayConfigurations())} error={error} />;
    }
    if (status === 'succeeded' && holidayConfigs.length === 0) {
      return <EmptyState onAddNew={() => setCreatePanelOpen(true)} />;
    }
    const tableData = holidayConfigs.map((item, index) => ({ ...item, s_no: index + 1 }));
    return <Table columns={columns} data={tableData} defaultItemsPerPage={10} showSearch={true} searchPlaceholder="Search Configurations..." />;
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <header className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Holiday Configuration</h1>
          <nav aria-label="Breadcrumb" className="mt-1 flex items-center text-sm text-gray-500">
             <Link to="/getting-started" className="hover:text-gray-700">Getting Started</Link>
             <ChevronRight className="w-4 h-4 mx-1" />
             <span className="font-medium text-gray-800">Holiday Configuration</span>
          </nav>
        </div>
        <button onClick={() => setCreatePanelOpen(true)} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700">
            <Plus size={20} className="-ml-1 mr-2" />
            ADD NEW
        </button>
      </header>
      
      <main>
          {renderContent()}
      </main>
      
      <CreateHolidayConfiguration isOpen={isCreatePanelOpen} onClose={() => setCreatePanelOpen(false)} />
      <UpdateHolidayConfiguration isOpen={!!editingConfig} onClose={() => setEditingConfig(null)} configData={editingConfig} />
      <AlertModal isOpen={deleteAlert.isOpen} onClose={() => setDeleteAlert({ isOpen: false, configId: null })} onConfirm={handleConfirmDelete} title="Delete Configuration" confirmText="Delete" confirmButtonVariant="danger">
        <p className="text-sm text-gray-600">Are you sure you want to delete this holiday configuration? This action cannot be undone.</p>
      </AlertModal>
    </div>
  );
};

export default HolidayConfigurationPage;