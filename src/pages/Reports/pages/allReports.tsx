//imports
import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Play, CalendarClock, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import Table, { type Column } from "../../../components/common/Table";
import ScheduleReport from "./ScheduleReport";
import AlertModal from "../../../components/Modal/AlertModal";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import {
  fetchAllReports,
  deleteReport,
  type Report,
} from "../../../store/slice/reportSlice";


//skeleton
const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 10 }) => {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="flex space-x-4 px-4">
        <div className="h-4 bg-gray-200 rounded w-1/12"></div>
        <div className="h-4 bg-gray-200 rounded w-2/12"></div>
        <div className="h-4 bg-gray-200 rounded w-5/12"></div>
        <div className="h-4 bg-gray-200 rounded w-4/12"></div>
      </div>

      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className="flex items-center space-x-4 p-4 border-t border-gray-100"
          >
            <div className="h-5 bg-gray-200 rounded w-1/12"></div>
            <div className="h-5 bg-gray-200 rounded w-2/12"></div>
            <div className="h-5 bg-gray-200 rounded w-5/12"></div>
            <div className="flex items-center space-x-2 w-4/12">
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

//pagination
const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange }) => {
  if (totalPages <= 1) return null;
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  return (
    <div className="flex justify-between items-center mt-4 px-2 text-sm text-gray-700">
      <span>
        Showing {startItem} to {endItem} of {totalItems} items
      </span>
      <div className="flex space-x-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 border rounded ${
              currentPage === page
                ? "bg-[#741CDD] text-white"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

//main component
const AllReports: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { reports, status, error, totalPages, totalItems } = useSelector(
    (state: RootState) => state.reports
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    dispatch(fetchAllReports({ page: currentPage, limit: itemsPerPage }));
  }, [dispatch, currentPage, itemsPerPage]);

  useEffect(() => {
    if (status === "failed" && error) {
      toast.error(error, { className: "bg-red-50 text-red-800" });
    }
  }, [status, error]);

  const [view, setView] = useState<"table" | "schedule">("table");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<Report | null>(null);

  const handleRun = (id: string) =>
    toast.success(`Running report ${id}...`, {
      icon: "🚀",
      className: "bg-blue-50 text-blue-800",
    });
  const handleEdit = (id: string) =>
    toast("Opening template editor...", {
      icon: "📝",
      className: "bg-blue-50 text-blue-800",
    });

  const handleDeleteClick = (report: Report) => {
    setReportToDelete(report);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!reportToDelete) return;

    const toastId = toast.loading("Deleting report...");
    try {
      await dispatch(deleteReport(reportToDelete.id)).unwrap();
      toast.success(`Report "${reportToDelete.name}" deleted successfully.`, {
        id: toastId,
        className: "bg-green-50 text-green-800",
      });
      dispatch(fetchAllReports({ page: currentPage, limit: itemsPerPage }));
    } catch (err: any) {
      console.error("Failed to delete report:", err);
      toast.error(err.message || "Failed to delete report.", {
        id: toastId,
        className: "bg-red-50 text-red-800",
      });
    } finally {
      setIsDeleteModalOpen(false);
      setReportToDelete(null);
    }
  };

  const handleSchedule = (report: Report) => {
    setSelectedReport(report);
    setView("schedule");
  };

  const handleFormSubmit = (formData: any) => {
    console.log(formData);
    toast.success("Report scheduled successfully!", {
      className: "bg-green-50 text-green-800",
    });
    setView("table");
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: String(newPage) }); //change the query parameters in the URL
    window.scrollTo(0, 0); //scrolls them back to the top of the page to see the new content
  };

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

  const renderContent = () => {
    if (status === "loading" && reports.length === 0) {
      return <TableSkeleton rows={itemsPerPage} />;
    }
    if (status === "failed") {
      return (
        <p className="text-center p-10 text-gray-500">
          Could not load reports. Please try again.
        </p>
      );
    }
    return (
      <>
        <Table
          data={reports}
          columns={columns}
          showSearch={false}
          showPagination={false}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      </>
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
          reportId={selectedReport?.id || ""}
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
