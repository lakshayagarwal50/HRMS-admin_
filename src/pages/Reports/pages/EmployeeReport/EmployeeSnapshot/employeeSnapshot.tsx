import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Table, { type Column } from "../../../../../components/common/Table";
import EmployeeSnapshotFilters from "./component/EmployeeSnapshotFilters";
import EmployeeReportTemplate from "./component/EmployeeReportTemplate";
import type { AppDispatch, RootState } from "../../../../../store/store"; 
import { fetchEmployeeSnapshot } from "../../../../../store/slice/employeeSnapshotSlice"; 

interface EmployeeData {
  name: string;
  employeeId: string;
  status: "Active" | "Inactive";
  joiningDate: string;
  designation: string;
  department: string;
  location: string;
  gender: string;
  email: string;
  pan: string | null;
  grossPaid: number;
  lossOfPay: number | null;
  taxPaid: number | null;
  netPaid: number | null;
  leaveType: string;
  leavesAdjusted: number | null;
  leaveBalance: number | null;
  workingPattern: string;
  phone: string;
}

const columns: Column<EmployeeData>[] = [
  { key: "name", header: "Name" },
  { key: "employeeId", header: "Employee ID" },
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
    render: (row) => `₹ ${row.grossPaid.toLocaleString()}`,
  },
  {
    key: "lossOfPay",
    header: "Loss of Pay",
    render: (row) => `₹ ${row.lossOfPay?.toLocaleString() ?? "N/A"}`,
  },
  {
    key: "taxPaid",
    header: "Tax Paid",
    render: (row) => `₹ ${row.taxPaid?.toLocaleString() ?? "N/A"}`,
  },
  {
    key: "netPaid",
    header: "Net Paid",
    render: (row) => `₹ ${row.netPaid?.toLocaleString() ?? "N/A"}`,
  },
  { key: "leaveType", header: "Last Leave Type" },
  { key: "leavesAdjusted", header: "Leaves Adjusted" },
  { key: "leaveBalance", header: "Leave Balance" },
  { key: "workingPattern", header: "Working Pattern" },
  { key: "phone", header: "Phone Number" },
];

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

const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange }) => {
  
  if (totalPages <= 1) {
    return null;
  }
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


const EmployeeSnapshot: React.FC = () => {
  const [view, setView] = useState<"table" | "editTemplate">("table");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<any>({});

  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const dispatch = useDispatch<AppDispatch>();
  const { employees, status, error, total, limit, templateId } = useSelector(
    (state: RootState) => state.employeeSnapshot
  );

  useEffect(() => {
    dispatch(
      fetchEmployeeSnapshot({
        page: currentPage,
        limit,
        filters: activeFilters,
      })
    );
  }, [dispatch, currentPage, limit, JSON.stringify(activeFilters)]);

  const handleApplyFilters = (filters: any) => {
    if (JSON.stringify(filters) !== JSON.stringify(activeFilters)) {
      setActiveFilters(filters);
      setSearchParams({ page: "1" });
    }
    setIsFilterOpen(false);
  };

  const totalPages = Math.ceil(total / limit) || 1;

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setSearchParams({ page: String(newPage) });
    }
  };

  if (view === "editTemplate") {
    return (
      <EmployeeReportTemplate
        onBack={() => setView("table")}
        templateId={templateId}
      />
    );
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

    if (employees.length === 0) {
      return <div className="text-center p-10">No employee data found.</div>;
    }

    return (
      <>
        <div className="overflow-x-auto">
          <Table
            data={employees}
            columns={columns}
            showSearch={false}
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
              disabled={!templateId}
              className="bg-purple-100 text-[#741CDD] font-semibold py-2 px-4 rounded-full hover:bg-purple-200 transition-colors cursor-pointer"
            >
              EDIT TEMPLATE
            </button>
            <button
              onClick={() => setIsFilterOpen(true)}
              className="bg-purple-100 text-[#741CDD] font-semibold py-2 px-4 rounded-full hover:bg-purple-200 transition-colors cursor-pointer"
            >
              FILTER
            </button>
            <button className="bg-purple-100 text-[#741CDD] font-semibold py-2 px-4 rounded-full hover:bg-purple-200 transition-colors cursor-pointer">
              SCHEDULE REPORT
            </button>
            <button className="bg-red-500 text-white font-semibold py-2 px-4 rounded-full hover:bg-red-600 transition-colors cursor-pointer">
              DELETE
            </button>
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
