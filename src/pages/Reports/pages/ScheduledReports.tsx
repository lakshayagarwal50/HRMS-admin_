import React, { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { MoreHorizontal, X } from "lucide-react";

// --- COMPONENT IMPORTS ---
import Table, { type Column } from "../../../components/common/Table";
import AlertModal from "../../../components/Modal/AlertModal";
import EditScheduledReport from "./EditScheduledReport";

// --- REDUX IMPORTS ---
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import {
  fetchScheduledReports,deleteScheduledReport,
  type ScheduledReport,
} from "../../../store/slice/reportSlice";

// --- PAGINATION COMPONENT ---
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

const ScheduledReports: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams, setSearchParams] = useSearchParams();

  // Get data and pagination info from the Redux store
  const {
    scheduledReports,
    status,
    error,
    scheduledTotalPages,
    scheduledTotalItems,
  } = useSelector((state: RootState) => state.reports);

  // Manage page state
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const [itemsPerPage] = useState(10);

  // Fetch data when page changes
  useEffect(() => {
    dispatch(fetchScheduledReports({ page: currentPage, limit: itemsPerPage }));
  }, [dispatch, currentPage, itemsPerPage]);

  // State for the component's UI (modals, menus, etc.)
  const [view, setView] = useState<"table" | "edit">("table");
  const [reportToEdit, setReportToEdit] = useState<ScheduledReport | null>(
    null
  );
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
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

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: String(newPage) });
    window.scrollTo(0, 0);
  };

  const handleEdit = (report: ScheduledReport) => {
    setReportToEdit(report);
    setView("edit");
    setOpenMenuId(null);
  };

  const handleDeleteClick = (report: ScheduledReport) => {
    setReportToDelete(report);
    setIsDeleteModalOpen(true);
    setOpenMenuId(null);
  };

  const confirmDelete = async () => {
    if (!reportToDelete) return;

    try {
      // Dispatch the delete action and wait for it to complete
      await dispatch(deleteScheduledReport(reportToDelete.id)).unwrap();

      alert(`Scheduled report "${reportToDelete.subject}" has been removed.`);

      // **IMPORTANT**: Re-fetch the reports to ensure the list is up-to-date.
      // This is especially important if deleting the last item on a page.
      dispatch(
        fetchScheduledReports({ page: currentPage, limit: itemsPerPage })
      );
    } catch (err) {
      alert(`Failed to delete scheduled report: ${err}`);
    } finally {
      // Always close the modal and clear the state
      setIsDeleteModalOpen(false);
      setReportToDelete(null);
    }
  };

  const handleUpdateSubmit = (formData: any) => {
    alert("Report updated successfully!");
    console.log("Updated data:", formData);
    setView("table");
  };

  const columns: Column<ScheduledReport>[] = [
    { key: "subject", header: "Subject" },
    { key: "frequency", header: "Frequency" },
    {
      key: "reportId",
      header: "Report",
      render: (row) => (
        // You might want to map reportId to a name if you have that data available
        <span className="text-purple-600 font-medium">{row.subject}</span>
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

  const renderContent = () => {
    if (status === "loading" && scheduledReports.length === 0) {
      return <p className="text-center p-10">Loading scheduled reports...</p>;
    }
    if (status === "failed") {
      return <p className="text-center p-10 text-red-500">Error: {error}</p>;
    }
    return (
      <>
        <Table
          data={scheduledReports}
          columns={columns}
          showSearch={false}
          showPagination={false}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={scheduledTotalPages}
          totalItems={scheduledTotalItems}
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
            <h1 className="text-3xl font-bold text-gray-800">
              Scheduled Reports
            </h1>
            <p className="text-sm text-gray-500">
              <Link to="/reports/all">Reports</Link> / Scheduled Reports
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            {renderContent()}
          </div>
        </>
      ) : (
        // <EditScheduledReport
        //   reportName={reportToEdit?.subject || ""}
        //   onCancel={() => setView("table")}
        //   onSubmit={handleUpdateSubmit}
        // />

        // Ensure reportToEdit is not null before rendering
        reportToEdit && (
          <EditScheduledReport
            initialData={reportToEdit} // <-- This prop is essential
            onCancel={() => setView("table")}
            onSubmit={handleUpdateSubmit}
          />
        )
      )}

      <AlertModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Remove Scheduled Report"
        icon={<X size={32} className="text-red-500" />}
      >
        <p>Are you sure you want to remove this Scheduled Report?</p>
      </AlertModal>
    </div>
  );
};

export default ScheduledReports;
