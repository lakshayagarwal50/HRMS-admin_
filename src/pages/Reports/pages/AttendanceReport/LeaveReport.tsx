import React, { useState } from "react";
import { Link } from "react-router-dom";
import Table, { type Column } from "../../../../components/common/Table";
import LeaveReportFilters from "./component/LeaveReportFilters";

import LeaveReportTemplate from "./component/LeaveReportTemplate";


interface LeaveRecord {
  id: number;
  name: string;
  employeeId: number;
  status: "Active" | "Inactive";
  sick_paid_day: number;
  sick_paid_halfDay: number;
  sick_unpaid_day: number;
  sick_unpaid_halfDay: number;
  sick_total: number;
  sick_balance: number;
  casual_paid_day: number;
  casual_paid_halfDay: number;
  casual_unpaid_day: number;
  casual_unpaid_halfDay: number;
  casual_total: number;
  casual_balance: number;
  overall_total: number;
  overall_balance: number;
}
const mockData: LeaveRecord[] = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  name: [
    "Chandan",
    "Asad",
    "Pankaj",
    "Nanda",
    "Karthik",
    "Swarna",
    "Mukul",
    "Latif",
    "Ahmad",
    "Ravinder",
  ][i % 10],
  employeeId: 4152 + i * 111,
  status: "Active",
  sick_paid_day: i % 4,
  sick_paid_halfDay: i % 2,
  sick_unpaid_day: i % 3,
  sick_unpaid_halfDay: i % 2,
  sick_total: (i % 4) + (i % 3),
  sick_balance: 150 + i * 10,
  casual_paid_day: i % 5,
  casual_paid_halfDay: i % 3,
  casual_unpaid_day: i % 2,
  casual_unpaid_halfDay: i % 4,
  casual_total: (i % 5) + (i % 2),
  casual_balance: 100 + i * 5,
  overall_total: (i % 4) + (i % 3) + (i % 5) + (i % 2),
  overall_balance: 4 + i,
}));
const renderStatus = (status: "Active" | "Inactive") => {
  const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full";
  const activeClasses = "bg-green-100 text-green-800";
  const inactiveClasses = "bg-red-100 text-red-800";

  switch (status) {
    case "Active":
      return (
        <span className={`${baseClasses} ${activeClasses}`}>{status}</span>
      );
    case "Inactive":
      return (
        <span className={`${baseClasses} ${inactiveClasses}`}>{status}</span>
      );
    default:
      return status;
  }
};

const LeaveReport: React.FC = () => {
  const [view, setView] = useState<"report" | "template">("report");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const columns: Column<LeaveRecord>[] = [
    { key: "name", header: "Name" },
    { key: "employeeId", header: "Employee ID" },
    {
      key: "status",
      header: "Status",
      render: (row) => renderStatus(row.status),
    },
    { key: "sick_paid_day", header: "Sick - Paid Day" },
    { key: "sick_paid_halfDay", header: "Sick - Paid Half Day" },
    { key: "sick_unpaid_day", header: "Sick - Unpaid Day" },
    { key: "sick_unpaid_halfDay", header: "Sick - Unpaid Half Day" },
    { key: "sick_total", header: "Sick - Total" },
    { key: "sick_balance", header: "Sick - Balance" },
    { key: "casual_paid_day", header: "Casual - Paid Day" },
    { key: "casual_paid_halfDay", header: "Casual - Paid Half Day" },
    { key: "casual_unpaid_day", header: "Casual - Unpaid Day" },
    { key: "casual_unpaid_halfDay", header: "Casual - Unpaid Half Day" },
    { key: "casual_total", header: "Casual - Total" },
    { key: "casual_balance", header: "Casual - Balance" },
    { key: "overall_total", header: "Overall Total" },
    { key: "overall_balance", header: "Overall Balance" },
  ];

  const handleApplyFilters = (filters: any) => {
    console.log("Applying Leave Report filters:", filters);
    setIsFilterOpen(false); 
  };

  if (view === "template") {
    return <LeaveReportTemplate onBack={() => setView("report")} />;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Leave Report</h1>
        <div className="flex flex-col items-end space-y-3">
          <p className="text-sm text-gray-500">
            <Link to="/reports/all">Reports</Link> / Leave Report
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
        <div className="overflow-x-auto">
          <Table
            data={mockData}
            columns={columns}
            showSearch={true}
            searchPlaceholder="Search..."
            showPagination={true}
            className="w-[1350px]"
          />
        </div>
      </div>

      <LeaveReportFilters
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
};

export default LeaveReport;
