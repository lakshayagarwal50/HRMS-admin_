import React, { useState } from 'react';
import { Plus, MoreHorizontal, Edit, ToggleLeft, ToggleRight } from 'lucide-react';

// Assuming your Table component is in ../components/Table.tsx
import Table, { type Column } from "../../../layout/Table"; 

// 1. Define the data structure for a single Role
interface Role {
  id: number;
  s_no: number;
  roleName: string;
  code: string;
  description: string;
  status: 'Active' | 'Inactive';
}

// 2. Define the columns for the Table component, matching the Role interface
const columns: Column<Role>[] = [
  { header: 'S_No', key: 's_no' },
  { header: 'Role Name', key: 'roleName' },
  { header: 'Code', key: 'code' },
  { header: 'Description', key: 'description' },
  {
    header: 'Status',
    key: 'status',
    render: (row) => (
      <span
        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
          row.status === 'Active'
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}
      >
        {row.status}
      </span>
    ),
  },
  {
    header: 'Action',
    key: 'action',
    className: "text-center",
    render: (row) => (
      <div className="relative group">
        <button className="text-gray-500 hover:text-purple-600 p-1 rounded-full hover:bg-gray-100 transition-colors">
          <MoreHorizontal size={20} />
        </button>
        {/* Dropdown menu appears on hover of the group */}
        <div className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg z-10 hidden group-hover:block">
          <div className="py-1">
            <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              <Edit size={16} className="mr-3" />
              Edit
            </a>
            <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              {row.status === 'Active' ? <ToggleLeft size={16} className="mr-3" /> : <ToggleRight size={16} className="mr-3" />}
              {row.status === 'Active' ? 'Set Inactive' : 'Set Active'}
            </a>
          </div>
        </div>
      </div>
    ),
  },
];

// 3. Prepare sample data
const sampleRoles: Role[] = [
  { id: 1, s_no: 1, roleName: 'Team member', code: '5161', description: 'Lorem ipsum is simply dummy text of the printing...', status: 'Active' },
  { id: 2, s_no: 2, roleName: 'Reporting Manager', code: '5411', description: 'Lorem ipsum is simply dummy text of the printing...', status: 'Inactive' },
  { id: 3, s_no: 3, roleName: 'Project Manager', code: '1512', description: 'Lorem ipsum is simply dummy text of the printing...', status: 'Active' },
  { id: 4, s_no: 4, roleName: 'HR', code: '3326', description: 'Lorem ipsum is simply dummy text of the printing...', status: 'Active' },
  { id: 5, s_no: 5, roleName: 'Account manager', code: '0259', description: 'Lorem ipsum is simply dummy text of the printing...', status: 'Active' },
];


const RolePage: React.FC = () => {
  const [, setIsModalOpen] = useState(false);

  return (
    <div className="w-full">
      {/* Page Header */}
      <header className="bg-white shadow-sm mb-8">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Roles</h1>
            <nav aria-label="Breadcrumb" className="mt-1">
              <ol className="flex items-center space-x-2 text-sm">
                <li><a href="/dashboard" className="text-gray-500 hover:text-gray-700">Dashboard</a></li>
                <li><span className="text-gray-500">/</span></li>
                <li><a href="/getting-started" className="text-gray-500 hover:text-gray-700">Getting Started</a></li>
                <li><span className="text-gray-500">/</span></li>
                <li><span className="text-gray-900 font-medium">Roles</span></li>
              </ol>
            </nav>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <Plus size={20} className="-ml-1 mr-2" />
            ADD NEW
          </button>
        </div>
      </header>
      
      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Table
          columns={columns}
          data={sampleRoles}
          searchPlaceholder="Search by name or code..."
          onRowClick={(row) => console.log('Row clicked:', row.roleName)}
        />
      </main>
      
      {/* You would render your "Create Role" modal here */}
      {/* <CreateRoleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} /> */}
    </div>
  );
};

export default RolePage;
