import React, { useState } from "react";
import { Link } from "react-router-dom";
import Table, { type Column } from "../../../../../components/common/Table"; // Adjust path if needed
import PayslipComponentReportTemplate from "./component/PayslipComponentReportTemplate";
import PayslipComponentReportFilter from "./component/PayslipComponentReportFilter";

// (Interface, mockData, and helpers are unchanged)
interface PayslipComponent {
  id: number;
  name: string;
  employeeId: number;
  status: "Approved" | "Pending";
  emailPrimary: string;
  phoneNumber: string;
  gender: "Male" | "Female";
  designation: string;
  department: string;
  location: string;
  componentName: string;
  code: string;
  type: "Earnings" | "Deductions" | "Statutory";
  amount: number;
}

const mockData: PayslipComponent[] = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  name: [
    "Chandan",
    "Asad",
    "Pankaj",
    "Nanda",
    "Karthik",
    "Seema",
    "Mukul",
    "Latif",
    "Ahmad",
    "Ravinder",
  ][i % 10],
  employeeId: 4152 + i * 111,
  status: "Approved",
  emailPrimary: `employee${i + 1}@example.com`,
  phoneNumber: `987654321${i}`,
  gender: i % 3 === 0 ? "Female" : "Male",
  designation: [
    "President",
    "Chief Executive Officer",
    "Content Writer",
    "Director",
    "Project Lead",
  ][i % 5],
  department: [
    "President",
    "Chief Executive Officer",
    "Content Writer",
    "Director",
    "Project Lead",
  ][i % 5],
  location: [
    "Nagaland",
    "Maharashtra",
    "Sikkim",
    "Daman and Diu",
    "Puducherry",
  ][i % 5],
  componentName: "Basic",
  code: "BASIC",
  type: i % 3 === 0 ? "Deductions" : i % 3 === 1 ? "Statutory" : "Earnings",
  amount: [487.5, 108.5, 612.5][i % 3],
}));

const formatCurrency = (value: number) =>
  `₹ ${value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const renderStatus = (status: "Approved" | "Pending") => {
  const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full";
  const activeClasses = "bg-green-100 text-green-800";
  const inactiveClasses = "bg-yellow-100 text-yellow-800";
  switch (status) {
    case "Approved":
      return (
        <span className={`${baseClasses} ${activeClasses}`}>{status}</span>
      );
    case "Pending":
      return (
        <span className={`${baseClasses} ${inactiveClasses}`}>{status}</span>
      );
    default:
      return status;
  }
};

const PayslipComponentReport: React.FC = () => {
  const [view, setView] = useState<"report" | "template">("report");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const columns: Column<PayslipComponent>[] = [
    { key: "name", header: "Name" },
    { key: "employeeId", header: "Employee ID" },
    {
      key: "status",
      header: "Status",
      render: (row) => renderStatus(row.status),
    },
    { key: "emailPrimary", header: "Email Primary" },
    { key: "phoneNumber", header: "Phone Number" },
    { key: "gender", header: "Gender" },
    { key: "designation", header: "Designation" },
    { key: "department", header: "Department" },
    { key: "location", header: "Location" },
    { key: "componentName", header: "Component Name" },
    { key: "code", header: "Code" },
    { key: "type", header: "Type" },
    {
      key: "amount",
      header: "Amount",
      render: (row) => formatCurrency(row.amount),
    },
  ];

  const handleApplyFilters = (filters: any) => {
    console.log("Applying Component Report filters:", filters);
  };

  if (view === "template") {
    return <PayslipComponentReportTemplate onBack={() => setView("report")} />;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Payslip Component Report
        </h1>
        <div className="flex flex-col items-end space-y-3">
          <p className="text-sm text-gray-500">
            <Link to="/reports/all">Reports</Link> /{" "}
            <Link to="/reports/finance">Finance Reports</Link> / Payslip
            Component Report
          </p>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setView("template")}
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

      <div className="bg-white p-6 rounded-lg shadow-sm">
        {/* This div makes only the table below scrollable */}
        <div className="overflow-x-auto">
          <Table
            data={mockData}
            columns={columns}
            showSearch={true}
            searchPlaceholder="Search..."
            showPagination={true}
            // --- CHANGE HERE: Updated the width ---
            className="w-[1350px]"
          />
        </div>
      </div>

      <PayslipComponentReportFilter
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
};

export default PayslipComponentReport;
