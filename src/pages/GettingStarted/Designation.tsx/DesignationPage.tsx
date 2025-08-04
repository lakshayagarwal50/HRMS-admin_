<<<<<<< HEAD
// import React, { useState, useEffect, useRef } from 'react';
// import { Plus, MoreHorizontal, ChevronRight } from 'lucide-react';

// // --- Import your reusable components ---
// // Note: Adjust these import paths to match your project structure
// import Table, { type Column } from "../../../layout/Table"; 
// import CreateDesignation from '../../../components/Designation/CreateDesignation';
// import UpdateDesignation from '../../../components/Designation/UpdateDesignation';

// // --- TYPE DEFINITIONS ---
// interface Designation {
//   id: number;
//   s_no: number;
//   name: string;
//   code: string;
//   description: string;
//   department: string;
//   status: 'Active' | 'Inactive';
// }

// // --- MOCK DATA ---
// const sampleDesignations: Designation[] = [
//   { id: 1, s_no: 1, name: 'Business Analyst', code: '5161', description: 'Lorem ipsum is simply dummy text of the printing...', department: 'Support team', status: 'Active' },
//   { id: 2, s_no: 2, name: 'Designing', code: '5411', description: 'Lorem ipsum is simply dummy text of the printing...', department: 'Management', status: 'Inactive' },
//   { id: 3, s_no: 3, name: 'Project Manager', code: '1512', description: 'Lorem ipsum is simply dummy text of the printing...', department: 'Marketing', status: 'Active' },
//   { id: 4, s_no: 4, name: 'Android Developer', code: '3326', description: 'Lorem ipsum is simply dummy text of the printing...', department: 'Management', status: 'Active' },
//   { id: 5, s_no: 5, name: 'iOS Developer', code: '0259', description: 'Lorem ipsum is simply dummy text of the printing...', department: 'Marketing', status: 'Active' },
// ];


// // --- MAIN COMPONENT ---
// const DesignationPage: React.FC = () => {
//   const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
//   const dropdownRef = useRef<HTMLDivElement>(null);
//   const [isCreatePanelOpen, setCreatePanelOpen] = useState(false);
  
//   // This state now holds the data of the designation being edited, or null if none.
//   const [editingDesignation, setEditingDesignation] = useState<Designation | null>(null);

//   // This function is called when the "Edit" button is clicked.
//   const handleEditClick = (designation: Designation) => {
//     setEditingDesignation(designation); // Set the data for the update form
//     setActiveDropdown(null); // Close the dropdown menu
//   };

//   // --- Column Definitions for the Table ---
//   const columns: Column<Designation>[] = [
//     { key: 's_no', header: 'S_No' },
//     { key: 'name', header: 'Name' },
//     { key: 'code', header: 'Code' },
//     { key: 'description', header: 'Description' },
//     { key: 'department', header: 'Department' },
//     {
//       key: 'status',
//       header: 'Status',
//       render: (row) => (
//         <span className={`px-3 py-1 text-xs leading-5 font-semibold rounded-full ${row.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
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
//               {/* The onClick handler is now connected */}
//               <a href="#" onClick={() => handleEditClick(row)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Edit</a>
//               <a href="#" className="block px-4 py-2 text-sm text-red-700 hover:bg-gray-100">Inactive</a>
//             </div>
//           )}
//         </div>
//       ),
//     },
//   ];

//   // Effect to close dropdown on outside click
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setActiveDropdown(null);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   return (
//     <div className="w-full bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-md">
//       {/* Page Header */}
//       <header className="mb-6">
//         <div className="flex justify-between items-center flex-wrap gap-4">
//           <h1 className="text-2xl font-bold text-gray-900">Designations</h1>
//           <nav aria-label="Breadcrumb" className="flex items-center text-sm text-gray-500">
//             <a href="/dashboard" className="hover:text-gray-700">Dashboard</a>
//             <ChevronRight className="w-4 h-4 mx-1" />
//             <a href="/getting-started" className="hover:text-gray-700">Getting Started</a>
//             <ChevronRight className="w-4 h-4 mx-1" />
//             <span className="font-medium text-gray-800">Designations</span>
//           </nav>
//         </div>
//       </header>
      
//       {/* Main Content Area */}
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
        
//         {/* Render the generic Table component */}
//         <Table
//           columns={columns}
//           data={sampleDesignations}
//           searchPlaceholder="Search by name or code"
//         />
//       </main>
      
//       {/* Render the Create and Update Panels */}
//       <CreateDesignation isOpen={isCreatePanelOpen} onClose={() => setCreatePanelOpen(false)} /> 
//       <UpdateDesignation 
//         isOpen={!!editingDesignation} // Panel is open if editingDesignation is not null
//         onClose={() => setEditingDesignation(null)} // Close by setting state to null
//         designationData={editingDesignation} // Pass the data to the panel
//       />
//     </div>
//   );
// };

// export default DesignationPage;
import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, MoreHorizontal, ChevronRight, X as AlertIcon } from 'lucide-react';

// --- Redux Imports ---
import { fetchDesignations, updateDesignation, type Designation } from '../../../store/slice/designationSlice'; // Adjust path if needed
import type { RootState, AppDispatch } from '../../../store/store'; // Adjust path if needed

// --- Component Imports ---
import Table, { type Column } from "../../../layout/Table"; 
import CreateDesignation from '../../../components/Designation/CreateDesignation';
import UpdateDesignation from '../../../components/Designation/UpdateDesignation';
import AlertModal from '../../../components/Modal/AlertModal';

// --- TYPE DEFINITION for display data ---
type DesignationDisplay = Designation & { s_no: number };

// --- MAIN COMPONENT ---
=======
import React, { useState } from "react";
import { Plus, MoreHorizontal } from "lucide-react";

// Assuming your Table component is in ../components/Table.tsx
import Table, { type Column } from "../../../components/common/Table";

// 1. Define the data structure for a single Designation
interface Designation {
  id: number;
  name: string;
  department: string;
  createdAt: string;
}

// 2. Define the columns for the Table component, matching the Designation interface
const columns: Column<Designation>[] = [
  { header: "ID", key: "id" },
  { header: "Designation Name", key: "name" },
  { header: "Department", key: "department" },
  { header: "Created At", key: "createdAt" },
  {
    header: "Action",
    key: "action", // This key does not exist in the data, so a render function is required
    className: "text-center", // Optional: center the content of this column
    render: (row) => (
      <button
        onClick={(e) => {
          // Prevent the onRowClick event from firing when the action button is clicked
          e.stopPropagation();
          console.log(`Action clicked for designation: ${row.name}`);
          // Add logic for edit/delete menu here
        }}
        className="text-gray-500 hover:text-purple-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
      >
        <MoreHorizontal size={20} />
      </button>
    ),
  },
];

// 3. Prepare sample data. In a real application, this would be fetched from an API.
const sampleDesignations: Designation[] = [
  {
    id: 1,
    name: "Software Engineer",
    department: "Technology",
    createdAt: "2025-07-20",
  },
  {
    id: 2,
    name: "Senior Software Engineer",
    department: "Technology",
    createdAt: "2025-07-18",
  },
  {
    id: 3,
    name: "Product Manager",
    department: "Product",
    createdAt: "2025-07-15",
  },
  {
    id: 4,
    name: "UI/UX Designer",
    department: "Design",
    createdAt: "2025-07-12",
  },
  {
    id: 5,
    name: "QA Engineer",
    department: "Technology",
    createdAt: "2025-07-10",
  },
  {
    id: 6,
    name: "DevOps Engineer",
    department: "Infrastructure",
    createdAt: "2025-07-09",
  },
  {
    id: 7,
    name: "Data Scientist",
    department: "Data",
    createdAt: "2025-07-08",
  },
  {
    id: 8,
    name: "HR Manager",
    department: "Human Resources",
    createdAt: "2025-07-05",
  },
];

>>>>>>> dev
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
<<<<<<< HEAD
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
=======
    <div className="w-full">
      {/* Page Header */}
      <header className="bg-white shadow-sm mb-8">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Designations</h1>
            <nav aria-label="Breadcrumb" className="mt-1">
              <ol className="flex items-center space-x-2 text-sm">
                <li>
                  <a
                    href="/getting-started"
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Getting Started
                  </a>
                </li>
                <li>
                  <span className="text-gray-500">/</span>
                </li>
                <li>
                  <span className="text-gray-900 font-medium">Designation</span>
                </li>
              </ol>
            </nav>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <Plus size={20} className="-ml-1 mr-2" />
            Create Designation
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Render the generic Table component with the defined columns and data */}
        <Table
          columns={columns}
          data={sampleDesignations}
          searchPlaceholder="Search designations..."
          onRowClick={(row) => console.log("Row clicked:", row.name)}
        />
      </main>

      {/* The modal would be rendered here based on the isModalOpen state */}
      {/* Example: <CreateDesignationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} /> */}
>>>>>>> dev
    </div>
  );
};

export default DesignationPage;
