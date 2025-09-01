
import React, { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { MoreHorizontal, X } from "lucide-react";
import toast from "react-hot-toast"; 

import Table, { type Column } from "../../../components/common/Table";
import AlertModal from "../../../components/Modal/AlertModal";
import EditScheduledReport from "./EditScheduledReport";

import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import {
  fetchScheduledReports,
  deleteScheduledReport,
  type ScheduledReport,
} from "../../../store/slice/reportSlice";

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
  const {
    scheduledReports,
    status,
    error,
    scheduledTotalPages,
    scheduledTotalItems,
  } = useSelector((state: RootState) => state.reports);
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    dispatch(fetchScheduledReports({ page: currentPage, limit: itemsPerPage }));
  }, [dispatch, currentPage, itemsPerPage]);

  useEffect(() => {
    if (status === "failed" && error) {
      toast.error(error, { className: "bg-red-50 text-red-800" });
    }
  }, [status, error]);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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

    const toastId = toast.loading("Deleting scheduled report...");
    try {
      await dispatch(deleteScheduledReport(reportToDelete.id)).unwrap();
      toast.success(
        `Scheduled report "${reportToDelete.subject}" has been removed.`,
        { id: toastId, className: "bg-green-50 text-green-800" }
      );
      dispatch(
        fetchScheduledReports({ page: currentPage, limit: itemsPerPage })
      );
    } catch (err: any) {
      console.error("Failed to delete scheduled report:", err);
      toast.error(err.message || "Failed to delete scheduled report.", {
        id: toastId,
        className: "bg-red-50 text-red-800",
      });
    } finally {
      setIsDeleteModalOpen(false);
      setReportToDelete(null);
    }
  };

  const handleUpdateSubmit = () => {
    setView("table");
  };

  const columns: Column<ScheduledReport>[] = [
    { key: "subject", header: "Subject" },
    { key: "frequency", header: "Frequency" },
    {
      key: "reportId",
      header: "Report",
      render: (row) => (
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
      return (
        <p className="text-center p-10 text-gray-500">
          Could not load scheduled reports.
        </p>
      );
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
        reportToEdit && (
          <EditScheduledReport
            initialData={reportToEdit}
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