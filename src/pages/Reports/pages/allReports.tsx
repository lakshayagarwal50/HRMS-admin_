// src/pages/AllReports.tsx

import React, { useState } from "react";
import Table, { type Column } from "../../../components/common/Table"; // Adjust path if needed
import { Play, CalendarClock, Trash2, X } from "lucide-react"; // 1. Import the X icon
import { Link } from "react-router-dom";
import ScheduleReport from "./ScheduleReport";
import AlertModal from "../../../components/Modal/AlertModal"; // 2. Import the AlertModal component

// Define the type for our report data
interface Report {
  s_no: number;
  name: string;
  description: string;
}

// Generate some mock data for the table
const mockReports: Report[] = Array.from({ length: 30 }, (_, i) => ({
  s_no: 5416 + i * 101,
  name: i % 3 === 0 ? "Employee Snapshot" : "Payslip Summary Report",
  description:
    i % 2 === 0
      ? "Get all useful detail for all employees with multiple filter you can download this as Excel and PDF also"
      : "Use this report to check employees In and Out time with number of hours worked",
}));

const AllReports: React.FC = () => {
  // State for the page view (table vs. schedule form)
  const [view, setView] = useState<"table" | "schedule">("table");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  // 3. Add state for the delete confirmation modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<Report | null>(null);

  const handleRun = (id: number) => alert(`Running report ${id}`);
  const handleEdit = (id: number) => alert(`Editing template for report ${id}`);

  // This function now opens the delete modal
  const handleDeleteClick = (report: Report) => {
    setReportToDelete(report);
    setIsDeleteModalOpen(true);
  };

  // This function is called when the user confirms the deletion
  const confirmDelete = () => {
    if (reportToDelete) {
      alert(`Report "${reportToDelete.name}" has been removed.`);
      // In a real application, you would make an API call here to delete the data
    }
    setIsDeleteModalOpen(false); // Close the modal
    setReportToDelete(null); // Clear the selected report
  };

  const handleSchedule = (report: Report) => {
    setSelectedReport(report);
    setView("schedule");
  };

  const handleFormSubmit = (formData: any) => {
    alert("Form submitted! Check the console for the data.");
    console.log(formData);
    setView("table");
  };

  const columns: Column<Report>[] = [
    { key: "s_no", header: "S no.", className: "w-1/12" },
    { key: "name", header: "Name", className: "w-2/12" },
    {
      key: "description",
      header: "Description",
      className: "w-5/12 whitespace-normal",
    },
    {
      key: "action",
      header: "Action",
      className: "w-4/12",
      render: (row) => (
        <div className="flex items-center space-x-1">
          <button
            onClick={() => handleRun(row.s_no)}
            className="flex items-center justify-center space-x-1 px-2 py-1 text-xs text-white bg-[#741CDD] rounded hover:bg-[#5f17b8] transition-colors cursor-pointer"
          >
            <Play size={12} />
            <span>Run</span>
          </button>

          {/* 4. Update the onClick handler for the delete button */}
          <button
            onClick={() => handleDeleteClick(row)}
            className="flex items-center justify-center px-2 py-1 text-xs text-white bg-red-500 rounded hover:bg-red-600 transition-colors cursor-pointer"
          >
            <Trash2 size={12} className="mr-1" />
            <span>Delete</span>
          </button>

          <button
            onClick={() => handleEdit(row.s_no)}
            className="flex items-center justify-center px-2 py-1 text-xs text-[#741CDD] bg-white border border-[#741CDD] rounded hover:bg-[#741CDD]/10 transition-colors cursor-pointer"
          >
            <span>Edit Template</span>
          </button>

          <button
            onClick={() => handleSchedule(row)}
            className="flex items-center justify-center space-x-1 px-2 py-1 text-xs text-white bg-[#741CDD] rounded hover:bg-[#5f17b8] transition-colors cursor-pointer"
          >
            <CalendarClock size={12} />
            <span>Schedule Report</span>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {view === "table" ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">All Reports</h1>
            <p className="text-sm text-gray-500">
              <Link to="/reports/all">Reports</Link> /{" "}
              <Link to="/reports/all">Standard Report</Link> / All Reports
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <Table
              data={mockReports}
              columns={columns}
              showSearch={false}
              defaultItemsPerPage={10}
              itemsPerPageOptions={[5, 10, 15, 20]}
            />
          </div>
        </>
      ) : (
        <ScheduleReport
          reportName={selectedReport?.name || ""}
          onCancel={() => setView("table")}
          onSubmit={handleFormSubmit}
        />
      )}

      {/* 5. Render the AlertModal at the end */}
      <AlertModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Remove Report"
        icon={<X size={32} className="text-red-500" />}
      >
        <p>Are you sure you want to remove this report?</p>
      </AlertModal>
    </div>
  );
};

export default AllReports;
