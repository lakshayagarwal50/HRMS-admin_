//import
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Table, { type Column } from "../../../../../components/common/Table";
import PayslipSummaryReportFilter from "./component/PayslipSummaryReportFilter";
import PayslipSummaryTemplate from "./component/PayslipSummaryTemplate";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../../../../store/store";
import {
  fetchPayslipSummary,
  downloadPayslipSummary,
} from "../../../../../store/slice/payslipSummarySlice";

import toast from "react-hot-toast";

// interface
interface PayslipSummary {
  name: string;
  emp_id: string;
  status: "Active" | "Inactive";
  designation: string;
  department: string;
  location: string;
  basic: string | null;
  hra: string | null;
  conveyance: string | null;
  totalEarnings: number | null;
  totalDeductions: number | null;
  pf: string | null;
  pt: string | null;
  esi: string | null;
  epf: string | null;
  eesi: string | null;
}

//currency change
const formatCurrency = (value: number | null | undefined) => {
  if (value === null || value === undefined) return "N/A";
  return `₹ ${value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const renderStatus = (status: "Active" | "Inactive") => {
  const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full";
  const activeClasses = "bg-green-100 text-green-800";
  const inactiveClasses = "bg-red-100 text-red-800";
  return status === "Active" ? (
    <span className={`${baseClasses} ${activeClasses}`}>{status}</span>
  ) : (
    <span className={`${baseClasses} ${inactiveClasses}`}>{status}</span>
  );
};

//skeleton loader
const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 10 }) => (
  <div className="space-y-4 animate-pulse">
    <div className="h-8 bg-gray-200 rounded w-full mb-4"></div>
    {Array.from({ length: rows }).map((_, index) => (
      <div key={index} className="h-10 bg-gray-200 rounded w-full"></div>
    ))}
  </div>
);

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
          className="px-3 py-1 border rounded bg-white hover:bg-gray-100 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-3 py-1 font-medium">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded bg-white hover:bg-gray-100 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

// main body
const REPORT_NOT_FOUND_ERROR =
  'Report for type "payslipSummary" not found. Please create this report first.';

const PayslipSummaryReport: React.FC = () => {
  const [view, setView] = useState<"report" | "template">("report");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentFilters, setCurrentFilters] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const [itemsPerPage] = useState(10);

  const {
    reportData,
    isReportLoading,
    reportError,
    totalPages,
    totalItems,
    isDownloading,
  } = useSelector((state: RootState) => state.payslipSummary);

  useEffect(() => {
    dispatch(
      fetchPayslipSummary({
        page: currentPage,
        limit: itemsPerPage,
        filter: currentFilters,
      })
    );
  }, [dispatch, currentPage, itemsPerPage]);

  useEffect(() => {
    if (reportError && reportError.includes(REPORT_NOT_FOUND_ERROR)) {
      toast.error(reportError);
    }
  }, [reportError]);

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: String(newPage) });
    window.scrollTo(0, 0);
  };

  const handleBackFromTemplate = () => {
    dispatch(fetchPayslipSummary({ page: currentPage, limit: itemsPerPage }));
    setView("report");
  };

  const columns: Column<PayslipSummary>[] = [
    { key: "name", header: "Name" },
    { key: "emp_id", header: "Employee ID" },
    { key: "designation", header: "Designation" },
    {
      key: "status",
      header: "Employee Status",
      render: (row) => renderStatus(row.status),
    },
    { key: "department", header: "Department" },
    { key: "location", header: "Location" },
    {
      key: "basic",
      header: "Basic",
      render: (row) => formatCurrency(row.basic ? parseFloat(row.basic) : null),
    },
    {
      key: "hra",
      header: "HRA",
      render: (row) => formatCurrency(row.hra ? parseFloat(row.hra) : null),
    },
    {
      key: "totalEarnings",
      header: "Total Earnings",
      render: (row) => formatCurrency(row.totalEarnings),
    },
    {
      key: "totalDeductions",
      header: "Total Deductions",
      render: (row) => formatCurrency(row.totalDeductions),
    },
  ];

  const handleApplyFilters = (filters: any) => {
    setCurrentFilters(filters);
    setSearchParams({ page: "1" }); // Reset to page 1 on new filter
    setIsFilterOpen(false);
  };

  const handleDownload = (format: "csv" | "excel") => {
    if (isDownloading) return;
    toast(`Your ${format.toUpperCase()} download will begin shortly...`);
    // Pass the current filters to the download action
    dispatch(downloadPayslipSummary({ format, filter: currentFilters }));
  };

  const renderContent = () => {
    if (isReportLoading && reportData.length === 0) {
      return <TableSkeleton rows={itemsPerPage} />;
    }
    if (reportError) {
      if (reportError.includes(REPORT_NOT_FOUND_ERROR)) {
        return (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-lg text-gray-600 mb-4">{reportError}</p>
            <button
              onClick={() => navigate("/reports/create")}
              className="font-semibold py-2 px-6 rounded-full text-white"
              style={{ backgroundColor: "#741CDD" }}
            >
              Create Payslip Summary Report
            </button>
          </div>
        );
      }
      return (
        <p className="p-10 text-center text-red-500">Error: {reportError}</p>
      );
    }
    return (
      <>
        <Table
          data={reportData}
          columns={columns}
          showSearch={true}
          searchPlaceholder="Search Employees..."
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

  if (view === "template") {
    return <PayslipSummaryTemplate onBack={handleBackFromTemplate} />;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Payslip Summary Report
        </h1>
        <div className="flex flex-col items-end space-y-3">
          <p className="text-sm text-gray-500">
            <Link to="/reports">Reports</Link> / Payslip Summary Report
          </p>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setView("template")}
              className="bg-purple-100 text-[#741CDD] font-semibold py-2 px-4 rounded-full hover:bg-purple-200"
            >
              EDIT TEMPLATE
            </button>
            <button
              onClick={() => handleDownload("csv")}
              disabled={isDownloading}
              className="bg-purple-100 text-[#741CDD] font-semibold py-2 px-4 rounded-full hover:bg-purple-200 disabled:opacity-50"
            >
              {isDownloading ? "DOWNLOADING..." : "DOWNLOAD CSV"}
            </button>
            <button
              onClick={() => handleDownload("excel")}
              disabled={isDownloading}
              className="bg-purple-100 text-[#741CDD] font-semibold py-2 px-4 rounded-full hover:bg-purple-200 disabled:opacity-50"
            >
              {isDownloading ? "DOWNLOADING..." : "DOWNLOAD EXCEL"}
            </button>
            {/* <button
              onClick={() => setIsFilterOpen(true)}
              className="bg-purple-100 text-[#741CDD] font-semibold py-2 px-4 rounded-full hover:bg-purple-200"
            >
              FILTER
            </button> */}
            {/* <button className="bg-red-500 text-white font-semibold py-2 px-4 rounded-full hover:bg-red-600">
              DELETE
            </button> */}
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm">{renderContent()}</div>
      <PayslipSummaryReportFilter
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
};

export default PayslipSummaryReport;
