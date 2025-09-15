//imports
import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
// We no longer import the Table component as we are building it manually
// import Table, { type Column } from "../../../components/common/Table";
import type { Column } from "../../../components/common/Table"; // Keep type import if needed
// Redux imports
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAuditHistory,
  type AuditLog,
} from "../../../store/slice/auditHistorySlice";
import type { AppDispatch, RootState } from "../../../store/store";

// skeleton component (No changes needed)
const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 10 }) => {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="flex space-x-4 px-4">
        <div className="h-4 bg-gray-200 rounded w-2/12"></div>{" "}
        <div className="h-4 bg-gray-200 rounded w-1/12"></div> {/* Object */}
        <div className="h-4 bg-gray-200 rounded w-2/12"></div> {/* Type */}
        <div className="h-4 bg-gray-200 rounded w-6/12"></div> {/* Message */}
        <div className="h-4 bg-gray-200 rounded w-1/12"></div> {/* Who? */}
      </div>

      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className="flex items-center space-x-4 p-4 border-t border-gray-100"
          >
            <div className="h-5 bg-gray-200 rounded w-2/12"></div>
            <div className="h-5 bg-gray-200 rounded w-1/12"></div>
            <div className="h-5 bg-gray-200 rounded w-2/12"></div>
            <div className="h-5 bg-gray-200 rounded w-6/12"></div>
            <div className="h-5 bg-gray-200 rounded w-1/12"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

// pagination logic (No changes needed)
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

// main body
const AuditHistory: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { logs, status, error, totalPages, totalItems } = useSelector(
    (state: RootState) => state.auditHistory
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    dispatch(fetchAuditHistory({ page: currentPage, limit: itemsPerPage }));
  }, [dispatch, currentPage, itemsPerPage]);

  useEffect(() => {
    if (status === "failed" && error) {
      toast.error(error);
    }
  }, [status, error]);

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: String(newPage) });
    window.scrollTo(0, 0);
  };

  const handleItemsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newLimit = parseInt(event.target.value, 10);
    setItemsPerPage(newLimit);
    setSearchParams({ page: "1" });
  };

  const formatDateTime = (isoString: string) => {
    if (!isoString) return "N/A";
    return new Date(isoString).toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const columns: Column<AuditLog>[] = [
    {
      key: "activityTime",
      header: "Activity Time",
      render: (row) => formatDateTime(row.activityTime),
    },
    { key: "object", header: "Object" },
    {
      key: "type",
      header: "Type",
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900">{row.type.name}</p>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-xs text-gray-500">Severity</p>
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
              {row.type.severity}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "message",
      header: "Message",
      className: "whitespace-normal",
    },
    { key: "who", header: "Who?" },
  ];

  const renderContent = () => {
    if (status === "loading" && logs.length === 0) {
      return <TableSkeleton rows={itemsPerPage} />;
    }

    if (status === "failed" && logs.length === 0) {
      return (
        <div className="text-center p-10 text-red-500">Error: {error}</div>
      );
    }

    if (status === "succeeded" && logs.length === 0) {
      return (
        <div className="text-center p-10 text-gray-500">
          No audit history found.
        </div>
      );
    }

    // --- START: NEW MANUAL TABLE IMPLEMENTATION ---
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {logs.map((log) => (
              <tr key={log.id}>
                {columns.map((column) => (
                  <td
                    key={`${log.id}-${column.key}`}
                    className={`px-6 py-4 text-sm text-gray-700 ${
                      column.className || ""
                    }`}
                  >
                    {column.render
                      ? column.render(log)
                      : (log as any)[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      </div>
    );
    // --- END: NEW MANUAL TABLE IMPLEMENTATION ---
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Audit History</h1>

        <div className="flex items-center space-x-2 text-sm">
          <label htmlFor="entries-select" className="text-gray-600">
            Show Entries:
          </label>
          <select
            id="entries-select"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#741CDD]"
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">{renderContent()}</div>
    </div>
  );
};

export default AuditHistory;
