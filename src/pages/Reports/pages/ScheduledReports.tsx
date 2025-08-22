import React, { useState, useEffect, useRef } from "react";
import Table, { type Column } from ".././../../components/common/Table"; // Adjust the import path
import { MoreHorizontal, X } from "lucide-react";
import AlertModal from "../../../components/Modal/AlertModal"; // Adjust the import path
import EditScheduledReport from "./EditScheduledReport"; // Adjust the import path
import { Link } from "react-router-dom";

// Define the type for our scheduled report data
interface ScheduledReport {
  id: number;
  subject: string;
  frequency: string;
  report: string;
  nextRunDate: string;
}

// Expanded mock data to ensure pagination is visible
const mockData: ScheduledReport[] = [
  {
    id: 1,
    subject: "Employee Detail",
    frequency: "Weekly",
    report: "Employee Snapshot",
    nextRunDate: "27 Jun 2021",
  },
  {
    id: 2,
    subject: "Employee Detail",
    frequency: "Weekly",
    report: "Employee Snapshot",
    nextRunDate: "30 Feb 2020",
  },
  {
    id: 3,
    subject: "Employee Detail",
    frequency: "Monthly",
    report: "Employee Snapshot",
    nextRunDate: "22 Jun 2020",
  },
  {
    id: 4,
    subject: "Employee Detail",
    frequency: "Weekly",
    report: "Employee Snapshot",
    nextRunDate: "01 May 2021",
  },
  {
    id: 5,
    subject: "Employee Detail",
    frequency: "Monthly",
    report: "Employee Snapshot",
    nextRunDate: "09 Jun 2021",
  },
  {
    id: 6,
    subject: "Employee Detail",
    frequency: "Weekly",
    report: "Employee Snapshot",
    nextRunDate: "19 Apr 2021",
  },
  {
    id: 7,
    subject: "Payroll Summary",
    frequency: "Monthly",
    report: "Payslip Report",
    nextRunDate: "05 Jul 2021",
  },
  {
    id: 8,
    subject: "Attendance Log",
    frequency: "Daily",
    report: "Attendance Snapshot",
    nextRunDate: "11 Aug 2021",
  },
  {
    id: 9,
    subject: "Employee Detail",
    frequency: "Weekly",
    report: "Employee Snapshot",
    nextRunDate: "22 Aug 2021",
  },
  {
    id: 10,
    subject: "Finance Overview",
    frequency: "Yearly",
    report: "Annual Finance Report",
    nextRunDate: "01 Jan 2022",
  },
  {
    id: 11,
    subject: "Employee Detail",
    frequency: "Weekly",
    report: "Employee Snapshot",
    nextRunDate: "15 Sep 2021",
  },
  {
    id: 12,
    subject: "Leave Balance",
    frequency: "Monthly",
    report: "Leave Summary",
    nextRunDate: "01 Oct 2021",
  },
];

const ScheduledReports: React.FC = () => {
  // State for the main page view (table vs. edit form)
  const [view, setView] = useState<"table" | "edit">("table");
  const [reportToEdit, setReportToEdit] = useState<ScheduledReport | null>(
    null
  );

  // State for the action popover menu
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // State for the delete confirmation modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<ScheduledReport | null>(
    null
  );

  // Effect to close the action popover when clicking outside
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

  // Handler to switch to the edit view
  const handleEdit = (report: ScheduledReport) => {
    setReportToEdit(report);
    setView("edit");
    setOpenMenuId(null);
  };

  // Handler to open the delete confirmation modal
  const handleDeleteClick = (report: ScheduledReport) => {
    setReportToDelete(report);
    setIsDeleteModalOpen(true);
    setOpenMenuId(null);
  };

  // Handler for when deletion is confirmed
  const confirmDelete = () => {
    if (reportToDelete) {
      alert(`Report "${reportToDelete.subject}" has been removed.`);
      // Add logic here to remove the item from your data array or call an API
    }
    setIsDeleteModalOpen(false);
    setReportToDelete(null);
  };

  // Handler for submitting the updated form data
  const handleUpdateSubmit = (formData: any) => {
    alert("Report updated successfully!");
    console.log("Updated data:", formData);
    setView("table");
  };

  // Define the columns for the table, including the custom action menu
  const columns: Column<ScheduledReport>[] = [
    { key: "subject", header: "Subject" },
    { key: "frequency", header: "Frequency" },
    {
      key: "report",
      header: "Report",
      render: (row) => (
        <span className="text-purple-600 font-medium cursor-pointer hover:underline">
          {row.report}
        </span>
      ),
    },
    { key: "nextRunDate", header: "Next Run Date" },
    {
      key: "action",
      header: "Action",
      className: "text-right",
      render: (row) => (
        <div className="relative inline-block text-left">
          <button
            onClick={() => setOpenMenuId(openMenuId === row.id ? null : row.id)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <MoreHorizontal size={20} />
          </button>
          {openMenuId === row.id && (
            <div
              ref={menuRef}
              className="origin-top-right absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white z-10"
            >
              <div className="py-1" role="menu" aria-orientation="vertical">
                <button
                  onClick={() => handleEdit(row)}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(row)}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Conditionally render the table or the edit form */}
      {view === "table" ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              Scheduled Reports
            </h1>
            <p className="text-sm text-gray-500">
              <Link to="/reports/all">Reports</Link>
              {" / "}
              Scheduled Reports
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <Table
              data={mockData}
              columns={columns}
              showSearch={false}
              showPagination={true}
              defaultItemsPerPage={10}
            />
          </div>
        </>
      ) : (
        <EditScheduledReport
          reportName={reportToEdit?.report || ""}
          onCancel={() => setView("table")}
          onSubmit={handleUpdateSubmit}
        />
      )}

      {/* The confirmation modal is always available in the DOM, but only visible when isOpen is true */}
      <AlertModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Remove Report"
        icon={<X size={32} className="text-red-500" />}
      >
        <p>Are you sure you want to remove this Report?</p>
      </AlertModal>
    </div>
  );
};

export default ScheduledReports;
