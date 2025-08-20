import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Plus, MoreHorizontal, Edit, ToggleLeft, ToggleRight } from 'lucide-react';

// Assuming your Table component is in a path like this
import Table, { type Column } from '../../../components/common/Table';

// --- ROLES PAGE SPECIFIC CODE ---

// 1. Define the data structure for a single Role
interface Role {
  id: number;
  s_no: number;
  name: string;
  code: string;
  description: string;
  status: 'Active' | 'Inactive';
}

// 2. Prepare sample data
const rolesData: Omit<Role, 's_no'>[] = [
  { id: 1, name: 'Team member', code: '5161', description: 'Lorem Ipsum is simply dummy text of the printing...', status: 'Active' },
  { id: 2, name: 'Reporting Manager', code: '5411', description: 'Lorem Ipsum is simply dummy text...', status: 'Inactive' },
  { id: 3, name: 'Project Manager', code: '1512', description: 'Lorem Ipsum is simply dummy text of the printing...', status: 'Active' },
  { id: 4, name: 'HR', code: '3326', description: 'Lorem Ipsum is simply dummy text of the printing...', status: 'Active' },
  { id: 5, name: 'Account manager', code: '0259', description: 'Lorem Ipsum is simply dummy text of the printing...', status: 'Active' },
  { id: 6, name: 'Developer', code: '8432', description: 'Lorem Ipsum is simply dummy text of the printing...', status: 'Active' },
  { id: 7, name: 'QA Tester', code: '6754', description: 'Lorem Ipsum is simply dummy text of the printing...', status: 'Inactive' },
  { id: 8, name: 'Designer', code: '9876', description: 'Lorem Ipsum is simply dummy text of the printing...', status: 'Active' },
];

// --- MAIN ROLES PAGE COMPONENT ---
const RolesPage: React.FC = () => {
    const [roles, setRoles] = useState<Role[]>(rolesData.map((role, index) => ({ ...role, s_no: index + 1 })));

    const handleStatusToggle = (id: number) => {
        setRoles(currentRoles => 
            currentRoles.map(role => 
                role.id === id 
                ? { ...role, status: role.status === 'Active' ? 'Inactive' : 'Active' }
                : role
            )
        );
    };

    const columns: Column<Role>[] = [
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
          <div className="relative group">
            <button className="text-gray-500 hover:text-purple-600 p-1 rounded-full hover:bg-gray-100 transition-colors">
              <MoreHorizontal size={20} />
            </button>
            <div className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg z-10 hidden group-hover:block">
              <div className="py-1">
                <Link
                  to={`/roles/edit/${row.id}`}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Edit size={16} className="mr-3" />
                  Edit
                </Link>
                <button
                  onClick={() => handleStatusToggle(row.id)}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  {row.status === "Active" ? (
                    <ToggleLeft size={16} className="mr-3" />
                  ) : (
                    <ToggleRight size={16} className="mr-3" />
                  )}
                  {row.status === "Active" ? "Set Inactive" : "Set Active"}
                </button>
              </div>
            </div>
          </div>
        ),
      },
    ];

    return (
        <div className="w-full bg-gray-50 p-4 sm:p-6">
            <header className="mb-6">
                <div className="flex justify-between items-center flex-wrap gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Roles</h1>
                        <nav aria-label="Breadcrumb" className="mt-1 flex items-center text-sm text-gray-500">
                            <Link to="/dashboard" className="hover:text-gray-700">Dashboard</Link>
                            <ChevronRight size={16} className="mx-1" />
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
                <Table
                  data={roles}
                  columns={columns}
                  defaultItemsPerPage={5}
                  searchPlaceholder="Search by name or code..."
                />
            </main>
        </div>
    );
};

export default RolesPage;
