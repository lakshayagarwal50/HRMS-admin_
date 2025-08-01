import React, { useState, useEffect, useRef } from 'react';
import { MoreHorizontal, ChevronRight, Plus , X as AlertIcon} from 'lucide-react';

// --- Import your components ---
import Table, { type Column } from "../../../layout/Table"; // Adjust this path if needed
import CreateDepartment from "../../../components/GettingStarted/CreateDepartment"; // The "Create" side panel
import UpdateDepartment from '../../../components/GettingStarted/UpdateDepartment'; // The "Update" side panel
import AlertModal from '../../../components/Modal/AlertModal';

// --- TYPE DEFINITIONS ---
type Department = {
  id: number;
  s_no?: number;
  name: string;
  code: string;
  status: 'Active' | 'Inactive';
};

// --- MOCK DATA ---
const departmentData: Department[] = [
  { id: 1, name: 'Human Resources', code: 'HR-001', status: 'Active' },
  { id: 2, name: 'Engineering', code: 'ENG-002', status: 'Active' },
  { id: 3, name: 'Finance & Accounting', code: 'FIN-003', status: 'Active' },
  { id: 4, name: 'Marketing', code: 'MKT-004', status: 'Inactive' },
];

const dataWithSNo = departmentData.map((item, index) => ({
  ...item,
  s_no: index + 1,
}));


// --- MAIN COMPONENT ---
const DepartmentPage: React.FC = () => {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isCreatePanelOpen, setCreatePanelOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);

  // --- State to manage the Alert Modal ---
  const [alertData, setAlertData] = useState<{ isOpen: boolean; department: Department | null }>({
    isOpen: false,
    department: null,
  });

  const toggleDropdown = (id: number) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const handleEditClick = (department: Department) => {
    setEditingDepartment(department);
    setActiveDropdown(null);
  };

  // --- Handler to open the alert modal ---
  const handleInactiveClick = (department: Department) => {
    setAlertData({ isOpen: true, department });
    setActiveDropdown(null);
  };

  // --- Handler to confirm the action ---
  const handleConfirmInactive = () => {
    if (alertData.department) {
      console.log(`Inactivating department: ${alertData.department.name}`);
      // Add your logic here to update the department's status
    }
    setAlertData({ isOpen: false, department: null }); // Close the modal
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (!(event.target as HTMLElement).closest('button[data-dropdown-toggle]')) {
          setActiveDropdown(null);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const columns: Column<Department>[] = [
    { key: 's_no', header: 'S.No' },
    { key: 'name', header: 'Name' },
    { key: 'code', header: 'Code' },
    { key: 'status', header: 'Status',
      render: (row) => (
        <span className={`px-3 py-1 text-xs leading-5 font-semibold rounded-full ${row.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {row.status}
        </span>
      ),
    },
    { key: 'action', header: 'Action',
      render: (row) => (
        <div className="relative">
          <button data-dropdown-toggle onClick={() => toggleDropdown(row.id)} className="text-gray-500 hover:text-[#8A2BE2] p-1 rounded-full">
            <MoreHorizontal size={20} />
          </button>
          {activeDropdown === row.id && (
            <div ref={dropdownRef} className="absolute right-0 mt-2 w-32 bg-white border rounded-md shadow-lg z-20">
              <a href="#" onClick={() => handleEditClick(row)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Edit</a>
              {/* Update the onClick handler for the Inactive button */}
              <a href="#" onClick={() => handleInactiveClick(row)} className="block px-4 py-2 text-sm text-red-700 hover:bg-gray-100">Inactive</a>
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
            <nav aria-label="Breadcrumb" className="mt-1 flex items-center text-sm text-gray-500">
              <a href="/dashboard" className="hover:text-gray-700">Dashboard</a>
              <ChevronRight className="w-4 h-4 mx-1" />
              <a href="/getting-started" className="hover:text-gray-700">Getting Started</a>
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
        <Table
          columns={columns}
          data={dataWithSNo}
          showSearch={true}
          searchPlaceholder="Search Departments..."
        />
      </main>

      {/* Render Panels and Modals */}
      <CreateDepartment isOpen={isCreatePanelOpen} onClose={() => setCreatePanelOpen(false)} />
      <UpdateDepartment isOpen={!!editingDepartment} onClose={() => setEditingDepartment(null)} departmentData={editingDepartment} />
      
      {/* --- Render the AlertModal --- */}
      <AlertModal
        isOpen={alertData.isOpen}
        onClose={() => setAlertData({ isOpen: false, department: null })}
        onConfirm={handleConfirmInactive}
        title="Inactive Department"
        icon={<AlertIcon className="text-red-500" size={40} strokeWidth={3} />}
      >
        <p>Are you sure you want to inactive this department?</p>
      </AlertModal>
    </div>
  );
};

export default DepartmentPage;
