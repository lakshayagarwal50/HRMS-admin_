import React, { useState, useEffect, useRef } from 'react';
import { Plus, MoreHorizontal, ChevronRight } from 'lucide-react';

// --- Import your reusable components ---
// Note: Adjust these import paths to match your project structure
import Table, { type Column } from "../../../layout/Table"; 
import CreateDesignation from '../../../components/Designation/CreateDesignation';
import UpdateDesignation from '../../../components/Designation/UpdateDesignation';

// --- TYPE DEFINITIONS ---
interface Designation {
  id: number;
  s_no: number;
  name: string;
  code: string;
  description: string;
  department: string;
  status: 'Active' | 'Inactive';
}

// --- MOCK DATA ---
const sampleDesignations: Designation[] = [
  { id: 1, s_no: 1, name: 'Business Analyst', code: '5161', description: 'Lorem ipsum is simply dummy text of the printing...', department: 'Support team', status: 'Active' },
  { id: 2, s_no: 2, name: 'Designing', code: '5411', description: 'Lorem ipsum is simply dummy text of the printing...', department: 'Management', status: 'Inactive' },
  { id: 3, s_no: 3, name: 'Project Manager', code: '1512', description: 'Lorem ipsum is simply dummy text of the printing...', department: 'Marketing', status: 'Active' },
  { id: 4, s_no: 4, name: 'Android Developer', code: '3326', description: 'Lorem ipsum is simply dummy text of the printing...', department: 'Management', status: 'Active' },
  { id: 5, s_no: 5, name: 'iOS Developer', code: '0259', description: 'Lorem ipsum is simply dummy text of the printing...', department: 'Marketing', status: 'Active' },
];


// --- MAIN COMPONENT ---
const DesignationPage: React.FC = () => {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isCreatePanelOpen, setCreatePanelOpen] = useState(false);
  
  // This state now holds the data of the designation being edited, or null if none.
  const [editingDesignation, setEditingDesignation] = useState<Designation | null>(null);

  // This function is called when the "Edit" button is clicked.
  const handleEditClick = (designation: Designation) => {
    setEditingDesignation(designation); // Set the data for the update form
    setActiveDropdown(null); // Close the dropdown menu
  };

  // --- Column Definitions for the Table ---
  const columns: Column<Designation>[] = [
    { key: 's_no', header: 'S_No' },
    { key: 'name', header: 'Name' },
    { key: 'code', header: 'Code' },
    { key: 'description', header: 'Description' },
    { key: 'department', header: 'Department' },
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
      render: (row) => (
        <div className="relative">
          <button onClick={() => setActiveDropdown(activeDropdown === row.id ? null : row.id)} className="text-gray-500 hover:text-purple-600 p-1 rounded-full focus:outline-none">
            <MoreHorizontal size={20} />
          </button>
          {activeDropdown === row.id && (
            <div ref={dropdownRef} className="absolute right-0 mt-2 w-32 bg-white border rounded-md shadow-lg z-20">
              {/* The onClick handler is now connected */}
              <a href="#" onClick={() => handleEditClick(row)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Edit</a>
              <a href="#" className="block px-4 py-2 text-sm text-red-700 hover:bg-gray-100">Inactive</a>
            </div>
          )}
        </div>
      ),
    },
  ];

  // Effect to close dropdown on outside click
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
      {/* Page Header */}
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
      
      {/* Main Content Area */}
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
        
        {/* Render the generic Table component */}
        <Table
          columns={columns}
          data={sampleDesignations}
          searchPlaceholder="Search by name or code"
        />
      </main>
      
      {/* Render the Create and Update Panels */}
      <CreateDesignation isOpen={isCreatePanelOpen} onClose={() => setCreatePanelOpen(false)} /> 
      <UpdateDesignation 
        isOpen={!!editingDesignation} // Panel is open if editingDesignation is not null
        onClose={() => setEditingDesignation(null)} // Close by setting state to null
        designationData={editingDesignation} // Pass the data to the panel
      />
    </div>
  );
};

export default DesignationPage;
