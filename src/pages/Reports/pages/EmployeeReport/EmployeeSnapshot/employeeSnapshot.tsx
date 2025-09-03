//imports
import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Table, { type Column } from "../../../../../components/common/Table";
import EmployeeSnapshotFilters from "./component/EmployeeSnapshotFilters";
import EmployeeReportTemplate from "./component/EmployeeReportTemplate";
import { useAppDispatch, useAppSelector } from "../../../../../store/hooks";
import {
  fetchEmployeeSnapshot,
  downloadEmployeeSnapshot,
  type EmployeeData,
} from "../../../../../store/slice/employeeSnapshotSlice";
import { toast } from "react-toastify";

const columns: Column<EmployeeData>[] = [
  { key: "name", header: "Name" },
  { key: "emp_id", header: "Employee ID" },
  {
    key: "status",
    header: "Status",
    render: (row) => (
      <span
        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
          row.status === "Active"
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {row.status}
      </span>
    ),
  },
  { key: "joiningDate", header: "Joining Date" },
  { key: "designation", header: "Designation" },
  { key: "department", header: "Department" },
  { key: "location", header: "Location" },
  { key: "gender", header: "Gender" },
  { key: "email", header: "Email" },
  { key: "pan", header: "PAN Number" },
  {
    key: "grossPaid",
    header: "Gross Paid",
    render: (row) => `₹ ${row.grossPaid?.toLocaleString("en-IN") ?? "N/A"}`,
  },
  {
    key: "lossOfPay",
    header: "Loss of Pay",
    render: (row) => `₹ ${row.lossOfPay?.toLocaleString("en-IN") ?? "N/A"}`,
  },
  {
    key: "taxPaid",
    header: "Tax Paid",
    render: (row) => `₹ ${row.taxPaid?.toLocaleString("en-IN") ?? "N/A"}`,
  },
  {
    key: "netPaid",
    header: "Net Paid",
    render: (row) => `₹ ${row.netPaid?.toLocaleString("en-IN") ?? "N/A"}`,
  },
  { key: "leaveType", header: "Last Leave Type" },
  { key: "leavesAdjusted", header: "Leaves Adjusted" },
  { key: "leaveBalance", header: "Leave Balance" },
  { key: "workingPattern", header: "Working Pattern" },
  { key: "phone", header: "Phone Number" },
];

//skeleton loader
const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 10 }) => {
  return (
    <div className="overflow-x-auto">
      <div className="w-[1350px] space-y-4">
        <div className="flex space-x-4 p-4">
          <div className="h-4 bg-gray-200 rounded w-1/12"></div>
          <div className="h-4 bg-gray-200 rounded w-1/12"></div>
          <div className="h-4 bg-gray-200 rounded w-1/12"></div>
          <div className="h-4 bg-gray-200 rounded w-2/12"></div>
          <div className="h-4 bg-gray-200 rounded w-2/12"></div>
          <div className="h-4 bg-gray-200 rounded w-3/12"></div>
        </div>
        <div className="space-y-2 p-4 pt-0">
          {Array.from({ length: rows }).map((_, index) => (
            <div
              key={index}
              className="flex items-center space-x-4 p-2 animate-pulse"
            >
              <div className="h-5 bg-gray-200 rounded w-1/12"></div>
              <div className="h-5 bg-gray-200 rounded w-1/12"></div>
              <div className="h-5 bg-gray-200 rounded w-1/12"></div>
              <div className="h-5 bg-gray-200 rounded w-2/12"></div>
              <div className="h-5 bg-gray-200 rounded w-2/12"></div>
              <div className="h-5 bg-gray-200 rounded w-3/12"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

//pagination logic
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
      <div className="flex items-center space-x-1">
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

//main body
const EmployeeSnapshot: React.FC = () => {
  const [view, setView] = useState<"table" | "editTemplate">("table");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<any>({});
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const dispatch = useAppDispatch();
  const { employees, status, error, total, limit, isDownloading } =
    useAppSelector((state) => state.employeeSnapshot);

  useEffect(() => {
    dispatch(
      fetchEmployeeSnapshot({
        page: currentPage,
        limit,
        filters: activeFilters,
      })
    );
  }, [dispatch, currentPage, limit, JSON.stringify(activeFilters)]);

  useEffect(() => {
    if (status === "failed" && error) {
      toast.error(error);
    }
  }, [status, error]);

  const handleApplyFilters = (filters: any) => {
    setActiveFilters(filters);
    setSearchParams({ page: "1" });
    setIsFilterOpen(false);
  };

  const totalPages = Math.ceil(total / limit) || 1;

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setSearchParams({ page: String(newPage) });
    }
  };

  const handleBackFromTemplate = () => {
    setView("table");
    dispatch(
      fetchEmployeeSnapshot({
        page: currentPage,
        limit,
        filters: activeFilters,
      })
    );
  };

  const handleDownload = (format: "csv" | "excel") => {
    if (isDownloading) return;
    toast(`Your ${format.toUpperCase()} download will begin shortly...`);
    dispatch(downloadEmployeeSnapshot({ format, filters: activeFilters }));
  };

  if (view === "editTemplate") {
    return <EmployeeReportTemplate onBack={handleBackFromTemplate} />;
  }

  const renderContent = () => {
    if (status === "loading") {
      return <TableSkeleton rows={limit} />;
    }
    if (status === "failed") {
      return (
        <div className="text-center p-10 text-red-500">Error: {error}</div>
      );
    }
    if (employees.length === 0 && status === "succeeded") {
      return <div className="text-center p-10">No employee data found.</div>;
    }
    return (
      <>
        <div className="overflow-x-auto">
          <Table
            data={employees}
            columns={columns}
            showPagination={false}
            className="w-[1350px]"
          />
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={total}
          itemsPerPage={limit}
          onPageChange={handlePageChange}
        />
      </>
    );
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Employees Snapshot Report
        </h1>
        <div className="flex flex-col items-end space-y-3">
          <p className="text-sm text-gray-500">
            <Link to="/reports/all">Reports</Link>
            {" / "}
            <Link to="/reports/all">All Reports</Link>
            {" / "}
            Employee Snapshot
          </p>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setView("editTemplate")}
              className="bg-purple-100 text-[#741CDD] font-semibold py-2 px-4 rounded-full hover:bg-purple-200 transition-colors cursor-pointer"
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
            <button
              onClick={() => setIsFilterOpen(true)}
              className="bg-purple-100 text-[#741CDD] font-semibold py-2 px-4 rounded-full hover:bg-purple-200 transition-colors cursor-pointer"
            >
              FILTER
            </button>
            {/* <button className="bg-purple-100 text-[#741CDD] font-semibold py-2 px-4 rounded-full hover:bg-purple-200 transition-colors cursor-pointer">
              SCHEDULE REPORT
            </button> */}
            {/* <button className="bg-red-500 text-white font-semibold py-2 px-4 rounded-full hover:bg-red-600 transition-colors cursor-pointer">
              DELETE
            </button> */}
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm">{renderContent()}</div>
      <EmployeeSnapshotFilters
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
};

export default EmployeeSnapshot;
