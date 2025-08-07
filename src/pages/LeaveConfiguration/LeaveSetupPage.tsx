import React, { useState, useEffect, useRef } from 'react';
import { Plus, MoreHorizontal } from 'lucide-react';

// --- Component Imports ---
// Make sure the path to your generic Table component is correct
import Table, { type Column } from '../../components/common/Table'; 

// --- TYPE DEFINITIONS ---
interface LeaveSetup {
  id: string;
  leaveId: string;
  name: string;
  type: 'Every Month' | 'Every Year';
  noOfLeaves: number;
  isCarryForward: 'YES' | 'NO';
  status: 'active' | 'inactive';
}

// --- MOCK DATA ---
// This data is based on the image you provided.
const initialLeaveData: LeaveSetup[] = [
    { id: '1', leaveId: '1.', name: 'Sick Leaves', type: 'Every Month', noOfLeaves: 1.0, isCarryForward: 'YES', status: 'active' },
    { id: '2', leaveId: '2.', name: 'Casual Leaves', type: 'Every Year', noOfLeaves: 2.0, isCarryForward: 'YES', status: 'active' },
    { id: '3', leaveId: '3.', name: 'Sick Leaves', type: 'Every Month', noOfLeaves: 7.0, isCarryForward: 'NO', status: 'active' },
    { id: '4', leaveId: '4.', name: 'Casual Leaves', type: 'Every Month', noOfLeaves: 10.0, isCarryForward: 'NO', status: 'active' },
];

// --- MAIN PAGE COMPONENT ---
const LeaveSetupPage: React.FC = () => {
  const [leaveData, ] = useState(initialLeaveData);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleEditClick = (leave: LeaveSetup) => {
    console.log('Editing:', leave);
    setActiveDropdown(null);
    // Add logic to open an edit modal/panel here
  };

  const handleInactiveClick = (leave: LeaveSetup) => {
    console.log('Deactivating:', leave);
    setActiveDropdown(null);
    // Add logic to open a confirmation modal here
  };

  // Define columns for the generic table
  const columns: Column<LeaveSetup>[] = [
    { key: 'leaveId', header: 'Leave ID', className: 'w-24' },
    { key: 'name', header: 'Name' },
    { key: 'type', header: 'Type' },
    { key: 'noOfLeaves', header: 'No of Leaves' },
    { key: 'isCarryForward', header: 'Is Carry Forward' },
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
              <a href="#" onClick={(e) => { e.preventDefault(); handleInactiveClick(row); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Inactive</a>
              <a href="#" onClick={(e) => { e.preventDefault(); handleEditClick(row); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Edit</a>
            </div>
          )}
        </div>
      ),
    },
  ];

  // Effect for closing the action dropdown when clicking outside
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
    <div className="w-full bg-white p-6 rounded-lg shadow-md">
      <header className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leave Configuration</h1>
          <nav aria-label="Breadcrumb" className="text-sm text-gray-500">
            Leave Configuration / Leave set up
          </nav>
        </div>
        <button
            // Add your onClick handler to open a create modal/panel
            // onClick={() => setCreatePanelOpen(true)} 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700"
        >
            <Plus size={20} className="-ml-1 mr-2" />
            ADD NEW
        </button>
      </header>
      
      <main>
          <Table
            columns={columns}
            data={leaveData}
            showSearch={false} // Search bar is not in the design
            showPagination={false} // Pagination is not in the design
          />
      </main>
    </div>
  );
};

export default LeaveSetupPage;
