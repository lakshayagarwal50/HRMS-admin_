import React, { useState, useEffect } from "react";
import Table, { type Column } from "../../../components/common/Table";
import { Play, CalendarClock, Trash2, X } from "lucide-react";
import { Link } from "react-router-dom";
import ScheduleReport from "./ScheduleReport";
import AlertModal from "../../../components/Modal/AlertModal";

// --- REDUX IMPORTS ---
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store"; // Adjust path
// Adjust path
import { fetchAllReports, type Report } from "../../../store/slice/reportSlice"; // Adjust path

const AllReports: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { reports, status, error } = useSelector(
    (state: RootState) => state.reports
  );

  // Fetch data when the component mounts
  useEffect(() => {
    // Only fetch if the data hasn't been fetched yet
    if (status === "idle") {
      dispatch(fetchAllReports());
    }
  }, [status, dispatch]);

  const [view, setView] = useState<"table" | "schedule">("table");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<Report | null>(null);

  const handleRun = (id: string) => alert(`Running report ${id}`);
  const handleEdit = (id: string) => alert(`Editing template for report ${id}`);

  const handleDeleteClick = (report: Report) => {
    setReportToDelete(report);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (reportToDelete) {
      alert(`Report "${reportToDelete.name}" has been removed.`);
      // TODO: Dispatch a deleteReportAPI thunk here
    }
    setIsDeleteModalOpen(false);
    setReportToDelete(null);
  };

  const handleSchedule = (report: Report) => {
    setSelectedReport(report);
    setView("schedule");
  };

  const handleFormSubmit = (formData: any) => {
    alert("Form submitted! Check console.");
    console.log(formData);
    setView("table");
  };

  // --- UPDATED --- Columns to match the API data structure
  const columns: Column<Report>[] = [
    { key: "Snum", header: "S no.", className: "w-1/12" },
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
            onClick={() => handleRun(row.id)}
            className="flex items-center justify-center space-x-1 px-2 py-1 text-xs text-white bg-[#741CDD] rounded hover:bg-[#5f17b8]"
          >
            <Play size={12} />
            <span>Run</span>
          </button>
          <button
            onClick={() => handleDeleteClick(row)}
            className="flex items-center justify-center px-2 py-1 text-xs text-white bg-red-500 rounded hover:bg-red-600"
          >
            <Trash2 size={12} className="mr-1" />
            <span>Delete</span>
          </button>
          <button
            onClick={() => handleEdit(row.id)}
            className="flex items-center justify-center px-2 py-1 text-xs text-[#741CDD] bg-white border border-[#741CDD] rounded hover:bg-[#741CDD]/10"
          >
            <span>Edit Template</span>
          </button>
          <button
            onClick={() => handleSchedule(row)}
            className="flex items-center justify-center space-x-1 px-2 py-1 text-xs text-white bg-[#741CDD] rounded hover:bg-[#5f17b8]"
          >
            <CalendarClock size={12} />
            <span>Schedule Report</span>
          </button>
        </div>
      ),
    },
  ];

  // --- NEW --- Content renderer based on fetch status
  const renderContent = () => {
    if (status === "loading") {
      return <p className="text-center p-10">Loading reports...</p>;
    }
    if (status === "failed") {
      return <p className="text-center p-10 text-red-500">Error: {error}</p>;
    }
    return (
      <Table
        data={reports}
        columns={columns}
        showSearch={false}
        defaultItemsPerPage={10}
        itemsPerPageOptions={[5, 10, 15, 20]}
      />
    );
  };

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
            {renderContent()}
          </div>
        </>
      ) : (
        <ScheduleReport
          reportName={selectedReport?.name || ""}
          onCancel={() => setView("table")}
          onSubmit={handleFormSubmit}
        />
      )}

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
