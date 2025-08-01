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

const DesignationPage: React.FC = () => {
  // State to manage the visibility of a "Create Designation" modal
  const [, setIsModalOpen] = useState(false);

  return (
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
    </div>
  );
};

export default DesignationPage;
