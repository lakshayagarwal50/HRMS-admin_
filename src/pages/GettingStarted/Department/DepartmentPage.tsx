import React, { useState, useEffect, useRef } from "react";
import { MoreHorizontal, ChevronRight, Plus } from "lucide-react";

// --- Import your Generic Table and its Column type ---
import Table, { type Column } from "../../../components/common/Table"; // Adjust this path if needed

// --- TYPE DEFINITIONS ---
// This now includes an optional s_no for the serial number
type Department = {
  id: number;
  s_no?: number; // Added for serial number
  name: string;
  code: string;
  status: "Active" | "Inactive";
};

// --- MOCK DATA ---
const departmentData: Department[] = [
  { id: 1, name: "Human Resources", code: "HR-001", status: "Active" },
  { id: 2, name: "Engineering", code: "ENG-002", status: "Active" },
  { id: 3, name: "Finance & Accounting", code: "FIN-003", status: "Active" },
  { id: 4, name: "Marketing", code: "MKT-004", status: "Inactive" },
  { id: 5, name: "Sales", code: "SAL-005", status: "Active" },
  { id: 6, name: "IT Support", code: "IT-006", status: "Active" },
  { id: 7, name: "Operations", code: "OPS-007", status: "Inactive" },
  { id: 8, name: "Customer Service", code: "CS-008", status: "Active" },
  { id: 9, name: "Research & Development", code: "RD-009", status: "Active" },
  { id: 10, name: "Legal", code: "LEG-010", status: "Inactive" },
];

// Add serial numbers to the data
const dataWithSNo = departmentData.map((item, index) => ({
  ...item,
  s_no: index + 1,
}));

// --- MAIN COMPONENT ---
const DepartmentPage: React.FC = () => {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = (id: number) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  // Effect to close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        const target = event.target as HTMLElement;
        if (!target.closest("button[data-dropdown-toggle]")) {
          setActiveDropdown(null);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- Define columns for the generic table ---
  const columns: Column<Department>[] = [
    {
      key: "s_no",
      header: "S.No",
    },
    {
      key: "name",
      header: "Name",
    },
    {
      key: "code",
      header: "Code",
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <span
          className={`px-3 py-1 text-xs leading-5 font-semibold rounded-full ${
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
      key: "action",
      header: "Action",
      render: (row) => (
        <div className="relative">
          <button
            data-dropdown-toggle
            onClick={() => toggleDropdown(row.id)}
            className="text-gray-500 hover:text-[#8A2BE2] p-1 rounded-full focus:outline-none"
          >
            <MoreHorizontal size={20} />
          </button>
          {activeDropdown === row.id && (
            <div
              ref={dropdownRef}
              className="absolute right-0 mt-2 w-32 bg-white border rounded-md shadow-lg z-20"
            >
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Edit
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
              >
                Inactive
              </a>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="bg-gray-50 min-h-full p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Department</h1>
            <nav
              aria-label="Breadcrumb"
              className="mt-1 flex items-center text-sm text-gray-500"
            >
              <a href="/dashboard" className="hover:text-gray-700">
                Dashboard
              </a>
              <ChevronRight className="w-4 h-4 mx-1" />
              <a href="/getting-started" className="hover:text-gray-700">
                Getting Started
              </a>
              <ChevronRight className="w-4 h-4 mx-1" />
              <span className="font-medium text-gray-800">Department</span>
            </nav>
          </div>
          <button className="bg-[#8A2BE2] text-white px-4 py-2 rounded-md hover:bg-[#7a1fb8] transition-colors duration-200 flex items-center space-x-2">
            <Plus size={20} />
            <span>ADD NEW</span>
          </button>
        </div>
      </header>

      <main>
        {/* --- Use the generic Table component --- */}
        <Table
          columns={columns}
          data={dataWithSNo}
          showSearch={true}
          searchPlaceholder="Search Departments..."
        />
      </main>
    </div>
  );
};

export default DepartmentPage;
