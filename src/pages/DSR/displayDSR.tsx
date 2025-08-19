import React, { useState, useEffect, useRef } from "react";
import Table, { type Column } from "../../components/common/Table"; // Adjust path if needed
import { MoreHorizontal, Filter, Search } from "lucide-react";
import DsrDetailModal from "./common/DsrDetailModal"; // Import the new modal component

// Type definition for a DSR entry
type DsrEntry = {
  id: number;
  employeeName: string;
  employeeId: string;
  email: string;
  department: string;
  designation: string;
  date: string;
  totalLoggedHours: string;
  submissionStatus: "Submitted" | "Due";
  approvalStatus: "Approved" | "Declined" | "Pending" | "Due - On Leave" | "-";
  isHighlighted?: boolean;
};

// Mock data to populate the table
const mockData: DsrEntry[] = [
  {
    id: 1,
    employeeName: "Anooklyn Simmons",
    employeeId: "PYT8461",
    email: "debra.holt@example.com",
    department: "Designer",
    designation: "Designer",
    date: "01 Sep 2022",
    totalLoggedHours: "4hrs",
    submissionStatus: "Submitted",
    approvalStatus: "Approved",
  },
  {
    id: 2,
    employeeName: "Courtney Henry",
    employeeId: "PYT8461",
    email: "debra.holt@example.com",
    department: "iOS Developer",
    designation: "iOS Developer",
    date: "02 Sep 2022",
    totalLoggedHours: "4hrs",
    submissionStatus: "Submitted",
    approvalStatus: "Approved",
  },
  {
    id: 3,
    employeeName: "Kathryn Murphy",
    employeeId: "PYT8461",
    email: "debra.holt@example.com",
    department: "Designer",
    designation: "Designer",
    date: "03 Sep 2022",
    totalLoggedHours: "4hrs",
    submissionStatus: "Submitted",
    approvalStatus: "Approved",
  },
  {
    id: 4,
    employeeName: "Dianne Russell",
    employeeId: "PHY8465",
    email: "russel.dianne@pythru.com",
    department: "iOS Developer",
    designation: "iOS Developer",
    date: "25 Sep 2022",
    totalLoggedHours: "4.00",
    submissionStatus: "Submitted",
    approvalStatus: "Declined",
    isHighlighted: true,
  },
  {
    id: 5,
    employeeName: "Leslia Alexander",
    employeeId: "PYT8461",
    email: "debra.holt@example.com",
    department: "Team Lead",
    designation: "Team Lead",
    date: "19 Sep 2022",
    totalLoggedHours: "4hrs",
    submissionStatus: "Due",
    approvalStatus: "Pending",
  },
];

// Helper function to render styled status badges in the table
const renderStatusBadge = (status: string) => {
  let baseClasses = "px-3 py-1 text-xs font-medium rounded-md";
  let statusClasses = "";

  switch (status.toLowerCase()) {
    case "submitted":
    case "approved":
      statusClasses = "bg-green-100 text-green-700";
      break;
    case "due":
    case "declined":
      statusClasses = "bg-red-100 text-red-700";
      break;
    case "pending":
      statusClasses = "bg-yellow-100 text-yellow-700";
      break;
    case "due - on leave":
      return (
        <span className={`${baseClasses} bg-red-100 text-red-700`}>
          Due - <span className="font-bold">On Leave</span>
        </span>
      );
    default:
      return <span>{status}</span>;
  }
  return <span className={`${baseClasses} ${statusClasses}`}>{status}</span>;
};

const DisplayDSR = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // State to manage the modal and its data
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDsr, setSelectedDsr] = useState<DsrEntry | null>(null);

  // Filter data based on the search term
  const filteredData = mockData.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Effect to handle clicks outside the action menu to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Function to handle opening the modal
  const handleViewDetails = (dsr: DsrEntry) => {
    setSelectedDsr(dsr);
    setIsModalOpen(true);
    setOpenMenuId(null); // Close the action menu
  };

  // Define the columns for the table
  // Define the columns for the table
  const columns: Column<DsrEntry>[] = [
    {
      header: "Employee Name",
      key: "employeeName",
      render: (row) => (
        <span className={row.isHighlighted ? "text-[#741CDD]" : ""}>
          {row.employeeName}
        </span>
      ),
    },
    { header: "Employee ID", key: "employeeId" },
    { header: "Email", key: "email" },
    { header: "Department", key: "department" },
    { header: "Designation", key: "designation" },
    { header: "Date", key: "date" },
    { header: "Total logged Hours", key: "totalLoggedHours" },
    {
      header: "Submission Status",
      key: "submissionStatus",
      render: (row) => renderStatusBadge(row.submissionStatus),
    },
    {
      header: "My approval Status",
      key: "approvalStatus",
      render: (row) => renderStatusBadge(row.approvalStatus),
    },
    {
      header: "Action",
      key: "action",
      render: (row) => (
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpenMenuId(openMenuId === row.id ? null : row.id);
            }}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <MoreHorizontal size={20} />
          </button>
          {openMenuId === row.id && (
            <div
              ref={menuRef}
              className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg z-10"
            >
              <button
                onClick={() => handleViewDetails(row)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                View Details
              </button>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <div className="mb-6">
        <p className="text-sm text-gray-500">Dashboard / Employees DSR list</p>
        <h1 className="text-2xl font-bold text-gray-800 mt-1">
          Employees DSR list
        </h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div></div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                <Search size={16} className="text-gray-400" />
              </span>
              <input
                type="text"
                placeholder="Search through employee name or code"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border rounded-md pl-8 pr-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <button className="flex-shrink-0 p-2 rounded-md bg-[#741CDD] text-white hover:bg-purple-700">
              <Filter size={18} />
            </button>
          </div>
        </div>

        <Table<DsrEntry>
          columns={columns}
          data={filteredData}
          showSearch={false}
          defaultItemsPerPage={10}
          itemsPerPageOptions={[10, 20, 50]}
        />
      </div>

      {/* Render the modal component, controlled by state */}
      <DsrDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        details={selectedDsr}
      />
    </div>
  );
};

export default DisplayDSR;
