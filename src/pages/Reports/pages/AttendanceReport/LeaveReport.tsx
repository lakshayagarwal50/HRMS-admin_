

import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Table, { type Column } from "../../../../components/common/Table";
import LeaveReportFilters, { type LeaveFilters } from "./component/LeaveReportFilters";
import LeaveReportTemplate from "./component/LeaveReportTemplate";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import {
  fetchLeaveSummaryReport,
  downloadLeaveReport,
  resetLeaveReportState,
  selectLeaveReport,
} from "../../../../store/slice/leaveReportSlice";
import type { LeaveRecord } from "../../../../store/slice/leaveReportSlice";
import { toast } from "react-toastify";

const renderStatus = (status: "Active" | "Inactive" | null) => {
  if (!status) {
    return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Unknown</span>;
  }
  const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full";
  const activeClasses = "bg-green-100 text-green-800";
  const inactiveClasses = "bg-red-100 text-red-800";

  return (
    <span className={`${baseClasses} ${status === "Active" ? activeClasses : inactiveClasses}`}>
      {status}
    </span>
  );
};

const ServerPagination = ({ currentPage, totalPages, onPageChange, totalRecords, limit }: { currentPage: number, totalPages: number, onPageChange: (page: number) => void, totalRecords: number, limit: number }) => {
  if (totalPages <= 1) return null;

  const indexOfFirstItem = (currentPage - 1) * limit;
  const indexOfLastItem = indexOfFirstItem + limit > totalRecords ? totalRecords : indexOfFirstItem + limit;

  return (
    <div className="pagination flex justify-between items-center mt-4 text-sm text-gray-700">
      <span>
        Showing {indexOfFirstItem + 1} to {indexOfLastItem} of {totalRecords} items
      </span>
      <div className="flex space-x-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

const LeaveReport: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data, pagination, loading, error, templateId, isDownloading } = useAppSelector(selectLeaveReport);

  const [view, setView] = useState<"report" | "template">("report");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<Partial<LeaveFilters>>({});

  const columns: Column<LeaveRecord>[] = [
    { key: "name", header: "Name" },
    { key: "emp_id", header: "Employee ID" },
    { key: "status", header: "Status", render: (row) => renderStatus(row.status) },
    { header: "Sick - Taken", render: (row) => row.sick.leaveTaken },
    { header: "Sick - Balance", render: (row) => row.sick.balance },
    { header: "Casual - Taken", render: (row) => row.casual.leaveTaken },
    { header: "Casual - Balance", render: (row) => row.casual.balance },
    { header: "Privileged - Taken", render: (row) => row.privileged.leaveTaken },
    { header: "Privileged - Balance", render: (row) => row.privileged.balance },
    { header: "Planned - Taken", render: (row) => row.planned.leaveTaken },
    { header: "Planned - Balance", render: (row) => row.planned.balance },
    {
      header: "Overall - Total Taken",
      render: (row) =>
        row.sick.leaveTaken +
        row.casual.leaveTaken +
        row.privileged.leaveTaken +
        row.planned.leaveTaken,
    },
    {
      header: "Overall - Total Balance",
      render: (row) =>
        row.sick.balance +
        row.casual.balance +
        row.privileged.balance +
        row.planned.balance,
    },
  ];

  const fetchData = useCallback(() => {
    dispatch(fetchLeaveSummaryReport({ page: currentPage, limit: pagination.limit, filter: filters }));
  }, [dispatch, currentPage, pagination.limit, filters]);

  useEffect(() => {
    if (view === "report") {
      fetchData();
    }
  }, [fetchData, view]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetLeaveReportState());
    }
  }, [error, dispatch]);

  const handleApplyFilters = (appliedFilters: LeaveFilters) => {
    setFilters(appliedFilters);
    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  const handleDownload = async (format: "csv" | "xlsx") => {
    if (isDownloading) return;
    toast.info(`Your ${format.toUpperCase()} download will begin shortly...`);
    
    const resultAction = await dispatch(downloadLeaveReport({ format, filter: filters }));

    if (downloadLeaveReport.fulfilled.match(resultAction)) {
      const { data: blobData, format: fileFormat } = resultAction.payload;
      const url = window.URL.createObjectURL(blobData);
      const a = document.createElement("a");
      a.href = url;
      a.download = `leave_report.${fileFormat}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Report download started successfully!");
    }
  };

  if (view === "template") {
    return <LeaveReportTemplate templateId={templateId} onBack={() => setView("report")} />;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Leave Report</h1>
        <div className="flex flex-col items-end space-y-3">
          <p className="text-sm text-gray-500">
            <Link to="/reports/all">Reports</Link> / Leave Report
          </p>
          <div className="flex items-center space-x-2 flex-wrap gap-y-2">
            <button
              onClick={() => setView("template")}
              disabled={!templateId || loading === 'pending'}
              className="bg-purple-100 text-[#741CDD] font-semibold py-2 px-4 rounded-full hover:bg-purple-200 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              EDIT TEMPLATE
            </button>
            
            <button
              onClick={() => handleDownload("csv")}
              disabled={isDownloading}
              className="bg-purple-100 text-[#741CDD] font-semibold py-2 px-4 rounded-full hover:bg-purple-200"
            >
              {isDownloading ? "DOWNLOADING..." : "DOWNLOAD CSV"}
            </button>
            <button
              onClick={() => handleDownload("xlsx")}
              disabled={isDownloading}
              className="bg-purple-100 text-[#741CDD] font-semibold py-2 px-4 rounded-full hover:bg-purple-200"
            >
              {isDownloading ? "DOWNLOADING..." : "DOWNLOAD XLSX"}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          {loading === 'pending' && <p className="text-center p-4">Loading report data...</p>}
          {loading === 'succeeded' && (
            <>
              <Table
                data={data}
                columns={columns}
                showSearch={false}
                showPagination={false}
                className="w-full"
              />
              <ServerPagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={(page) => setCurrentPage(page)}
                totalRecords={pagination.totalRecords}
                limit={pagination.limit}
              />
            </>
          )}
          {loading === 'failed' && <p className="text-center text-red-500 p-4">Failed to load report data.</p>}
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