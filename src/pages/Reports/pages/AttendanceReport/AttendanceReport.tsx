import React, { useState } from "react";
import { Link } from "react-router-dom";
import Table, { type Column } from "../../../../components/common/Table";
import AttendanceSummaryReportFilters from "./component/AttendanceSummaryReportFilters";
// --- CHANGE HERE: Import the actual template component ---
import AttendanceSummaryReportTemplate from "./component/AttendanceSummaryReportTemplate";

// --- CHANGE HERE: The placeholder component has been removed ---

// (Interface, mockData, and helpers are unchanged)
interface AttendanceRecord {
  id: number;
  name: string;
  employeeId: number;
  status: "Active" | "Inactive";
  attendanceType: "Leave" | "Weekoff" | "Present";
  date: string;
  inTime: string;
  outTime: string;
  timeSpent: string;
  lateBy: string;
  earlyBy: string;
  overtime: string;
}
const mockData: AttendanceRecord[] = Array.from({ length: 15 }, (_, i) => ({
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
  attendanceType: ["Leave", "Weekoff", "Present"][i % 3],
  date: "15 May 2020",
  inTime: "-",
  outTime: "-",
  timeSpent: "-",
  lateBy: "-",
  earlyBy: "-",
  overtime: "-",
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

const AttendanceReport: React.FC = () => {
  const [view, setView] = useState<"report" | "template">("report");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const columns: Column<AttendanceRecord>[] = [
    { key: "name", header: "Name" },
    { key: "employeeId", header: "Employee ID" },
    {
      key: "status",
      header: "Status",
      render: (row) => renderStatus(row.status),
    },
    { key: "attendanceType", header: "Attendance Type" },
    { key: "date", header: "Date" },
    { key: "inTime", header: "In Time" },
    { key: "outTime", header: "Out Time" },
    { key: "timeSpent", header: "Time Spent" },
    { key: "lateBy", header: "Late by" },
    { key: "earlyBy", header: "Early by" },
    { key: "overtime", header: "Overtime" },
  ];

  const handleApplyFilters = (filters: any) => {
    console.log("Applying Attendance Report filters:", filters);
    setIsFilterOpen(false); // Close modal on apply
  };

  // Conditionally render the template editor
  if (view === "template") {
    // --- CHANGE HERE: This now calls the imported component ---
    return <AttendanceSummaryReportTemplate onBack={() => setView("report")} />;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Attendance Summary Report
        </h1>
        <div className="flex flex-col items-end space-y-3">
          <p className="text-sm text-gray-500">
            <Link to="/reports/all">Reports</Link> /{" "}
            <Link to="/reports/scheduled">Scheduled Reports</Link> / Attendance
            Report
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

      <AttendanceSummaryReportFilters
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
};

export default AttendanceReport;
