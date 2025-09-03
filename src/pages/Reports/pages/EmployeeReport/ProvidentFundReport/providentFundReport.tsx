import React, { useState } from "react";
import Table, { type Column } from "../../../../../components/common/Table"; // Adjust the import path as needed
import { Link } from "react-router-dom";
import ProvidentFilters from "./component/providentFilters"; // Adjust the import path as needed
import ProvidentReportTemplate from "./component/providentReportTemplate"; // Adjust the import path as needed

// Define a type for the Provident Fund report data
interface ProvidentFundData {
  id: number;
  employeeId: string;
  employeeName: string;
  uan: number;
  pfAccountNumber: string;
  grossWages: number;
  epfWages: number;
  employeeContribution: number;
  employerContribution: number;
  status: "Submitted" | "Pending";
}

// Generate some mock data for the table
const mockData: ProvidentFundData[] = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  employeeId: `EMP${101 + i}`,
  employeeName: [
    "Chandan",
    "Asad",
    "Pankaj",
    "Nanda",
    "Karthik",
    "Seema",
    "Mukul",
    "Latif",
  ][i % 8],
  uan: 101487550000 + i * 111,
  pfAccountNumber: `DL/GUR/0055555/000/${123456 + i}`,
  grossWages: 25000 + i * 1500,
  epfWages: 15000,
  employeeContribution: 1800,
  employerContribution: 1800,
  status: i % 4 === 0 ? "Pending" : "Submitted",
}));

const ProvidentFundReport: React.FC = () => {
  // State to manage the current page view (table or edit template)
  const [view, setView] = useState<"table" | "editTemplate">("table");
  // State to manage the filter sidebar's visibility
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Define columns for the generic Table component
  const columns: Column<ProvidentFundData>[] = [
    { key: "employeeId", header: "Employee ID" },
    { key: "employeeName", header: "Employee Name" },
    { key: "uan", header: "UAN" },
    { key: "pfAccountNumber", header: "PF Account No." },
    {
      key: "grossWages",
      header: "Gross Wages",
      render: (row) => `₹ ${row.grossWages.toLocaleString()}`,
    },
    {
      key: "epfWages",
      header: "EPF Wages",
      render: (row) => `₹ ${row.epfWages.toLocaleString()}`,
    },
    {
      key: "employeeContribution",
      header: "Employee Contribution",
      render: (row) => `₹ ${row.employeeContribution.toLocaleString()}`,
    },
    {
      key: "employerContribution",
      header: "Employer Contribution",
      render: (row) => `₹ ${row.employerContribution.toLocaleString()}`,
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
            row.status === "Submitted"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  // Handler function to receive the filter data from the sidebar
  const handleApplyFilters = (filters: any) => {
    console.log("Applying Provident Fund filters:", filters);
    // Add your data filtering logic here
    setIsFilterOpen(false); // Close the sidebar after applying filters
  };

  // Conditionally render the correct page view
  if (view === "editTemplate") {
    return <ProvidentReportTemplate onBack={() => setView("table")} />;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* --- Page Header and Action Buttons --- */}
      <div className="flex justify-between items-start mb-6">
        {/* Left Side: Title */}
        <h1 className="text-3xl font-bold text-gray-800">
          Provident Fund Report
        </h1>

        {/* Right Side: Breadcrumbs and Action Buttons */}
        <div className="flex flex-col items-end space-y-3">
          <p className="text-sm text-gray-500">
            <Link to="/reports/all">Reports</Link>
            {" / "}
            <Link to="/reports/all">All Reports</Link>
            {" / "}
            Provident Fund Report
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
          />
        </div>
      </div>

      {/* --- Filters Sidebar --- */}
      <ProvidentFilters
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
};

export default ProvidentFundReport;
