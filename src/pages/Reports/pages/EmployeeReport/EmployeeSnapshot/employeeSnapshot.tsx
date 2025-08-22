import React, { useState } from "react";
import Table, { type Column } from "../../../../../components/common/Table"; // Adjust path as needed
import { Link } from "react-router-dom";
import EmployeeSnapshotFilters from "./component/EmployeeSnapshotFilters"; // Adjust path as needed
import EmployeeReportTemplate from "./component/EmployeeReportTemplate"; // Adjust path as needed


// Define a comprehensive type for the employee data
interface EmployeeData {
  id: number;
  name: string;
  employeeId: number;
  status: "Active" | "Inactive";
  joiningDate: string;
  designation: string;
  department: string;
  location: string;
  gender: string;
  emailPrimary: string;
  panNumber: string;
  grossPaid: number;
  lossOfPay: number;
  taxPaid: number;
  netPaid: number;
  leavesAllowed: number;
  leavesTaken: number;
  leavesAdjusted: number;
  leaveBalance: number;
  workingPattern: string;
  phone: string;
}

// Generate some mock data for the table
const mockData: EmployeeData[] = Array.from({ length: 15 }, (_, i) => ({
  id: 10708 + i * 100,
  name: [
    "Chandan",
    "Asad",
    "Pankaj",
    "Nanda",
    "Karthik",
    "Seema",
    "Mukul",
    "Latif",
  ][i % 8],
  employeeId: 4152 + i * 11,
  status: i === 7 ? "Inactive" : "Active",
  joiningDate: `${10 + (i % 18)} Oct 2022`,
  designation: i % 3 === 0 ? "Medical Assistant" : "Web Designer",
  department: i % 3 === 0 ? "Medical Assistant" : "Web Designer",
  location: "Tripura",
  gender: i % 2 === 0 ? "Female" : "Male",
  emailPrimary: `user${i}@example.com`,
  panNumber: `ABCDE1234${String.fromCharCode(65 + i)}`,
  grossPaid: 15000 + i * 500,
  lossOfPay: i % 4 === 0 ? 450 : 0,
  taxPaid: 1500 + i * 50,
  netPaid: 13050 + i * 450,
  leavesAllowed: 15,
  leavesTaken: 4 + i,
  leavesAdjusted: 1,
  leaveBalance: 10 - i,
  workingPattern: "5 Days Week",
  phone: `91555${12345 + i}`,
}));

const employeeSnapshot: React.FC = () => {
  const [view, setView] = useState<"table" | "editTemplate">("table");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Define columns for the generic Table component
  const columns: Column<EmployeeData>[] = [
    { key: "name", header: "Name" },
    { key: "employeeId", header: "Employee ID" },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
            row.status === "Active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    { key: "joiningDate", header: "Joining Date" },
    { key: "designation", header: "Designation" },
    { key: "department", header: "Department" },
    { key: "location", header: "Location" },
    { key: "gender", header: "Gender" },
    { key: "emailPrimary", header: "Email Primary" },
    { key: "panNumber", header: "Pan Number" },
    {
      key: "grossPaid",
      header: "Gross Paid",
      render: (row) => `₹ ${row.grossPaid.toLocaleString()}`,
    },
    {
      key: "lossOfPay",
      header: "Loss of pay",
      render: (row) => `₹ ${row.lossOfPay.toLocaleString()}`,
    },
    {
      key: "taxPaid",
      header: "Tax Paid",
      render: (row) => `₹ ${row.taxPaid.toLocaleString()}`,
    },
    {
      key: "netPaid",
      header: "Net Paid",
      render: (row) => `₹ ${row.netPaid.toLocaleString()}`,
    },
    { key: "leavesAllowed", header: "Leaves Allowed" },
    { key: "leavesTaken", header: "Leaves Taken" },
    { key: "leavesAdjusted", header: "Leaves Adjusted" },
    { key: "leaveBalance", header: "Leave Balance" },
    { key: "workingPattern", header: "Working pattern" },
    { key: "id", header: "ID" },
    { key: "phone", header: "Phone Number" },
  ];

  const handleApplyFilters = (filters: any) => {
    console.log("Applying filters:", filters);
    // Add your data filtering logic here
    setIsFilterOpen(false);
  };

  // Conditionally render based on the view state
  if (view === "editTemplate") {
    return <EmployeeReportTemplate onBack={() => setView("table")} />;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* --- Header and Buttons Section --- */}
      <div className="flex justify-between items-start mb-6">
        {/* Left Side: Title */}
        <h1 className="text-3xl font-bold text-gray-800">
          Employees Snapshot Report
        </h1>

        {/* Right Side: Breadcrumbs and Action Buttons */}
        <div className="flex flex-col items-end space-y-3">
          <p className="text-sm text-gray-500">
            <Link to="/reports/all">Reports</Link>
            {" / "}
            <Link to="/reports/all">All Reports</Link>
            {" / "}
            Employee Snapshot
          </p>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setView("editTemplate")}
              className="bg-purple-100 text-[#741CDD] font-semibold py-2 px-4 rounded-full hover:bg-purple-200 transition-colors cursor-pointer"
            >
              EDIT TEMPLATE
            </button>
            <button
              onClick={() => setIsFilterOpen(true)}
              className="bg-purple-100 text-[#741CDD] font-semibold py-2 px-4 rounded-full hover:bg-purple-200 transition-colors cursor-pointer"
            >
              FILTER
            </button>
            <button className="bg-purple-100 text-[#741CDD] font-semibold py-2 px-4 rounded-full hover:bg-purple-200 transition-colors cursor-pointer">
              SCHEDULE REPORT
            </button>
            <button className="bg-red-500 text-white font-semibold py-2 px-4 rounded-full hover:bg-red-600 transition-colors cursor-pointer">
              DELETE
            </button>
          </div>
        </div>
      </div>

      {/* --- Table Section --- */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <Table
            data={mockData}
            columns={columns}
            showSearch={false}
            showPagination={true}
            defaultItemsPerPage={10}
            className="w-[1350px]"
          />
        </div>
      </div>

      {/* --- Filters Sidebar --- */}
      <EmployeeSnapshotFilters
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
};

export default employeeSnapshot;
