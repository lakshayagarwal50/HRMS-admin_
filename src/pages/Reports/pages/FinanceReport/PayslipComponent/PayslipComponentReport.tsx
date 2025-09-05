import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Table, { type Column } from "../../../../../components/common/Table";
import PayslipComponentReportTemplate from "./component/PayslipComponentReportTemplate";
import { useAppDispatch, useAppSelector } from "../../../../../store/hooks";
import {
  fetchPayslipComponentReports,
  deletePayslipReport,
  downloadPayslipReport,
} from "../../../../../store/slice/payslipReportSlice";

interface PayslipComponent {
  name: string;
  emp_id: string;
  status: "Active" | "Inactive";
  phoneNum: string;
  designation: string;
  department: string;
  location: string;
  componentName: string;
  code: string;
  type: string;
  amount: string | number;
}

const formatCurrency = (value: string | number) =>
  `₹ ${Number(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const renderStatus = (status: "Active" | "Inactive") => {
  const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full";
  const activeClasses = "bg-green-100 text-green-800";
  const inactiveClasses = "bg-yellow-100 text-yellow-800";
  return (
    <span
      className={`${baseClasses} ${
        status === "Active" ? activeClasses : inactiveClasses
      }`}
    >
      {status}
    </span>
  );
};

const PayslipComponentReport: React.FC = () => {
  const [view, setView] = useState<"report" | "template">("report");
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useAppDispatch();
  const { components, pagination, loading, error, reportId, templateId } =
    useAppSelector((state) => state.payslipReport);

  // Initial fetch
  useEffect(() => {
    dispatch(fetchPayslipComponentReports({ page: 1, limit: 10 }));
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // ✅ Pagination with search preserved
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= (pagination?.totalPages || 0)) {
      dispatch(
        fetchPayslipComponentReports({
          page,
          limit: pagination?.limit,
          filter: searchQuery,
        })
      );
    }
  };

  // ✅ Built-in table search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    dispatch(fetchPayslipComponentReports({ page: 1, limit: 10, filter: query }));
  };

  const handleDelete = () => {
    if (reportId) {
      if (window.confirm("Are you sure you want to delete this report?")) {
        dispatch(deletePayslipReport(reportId));
      }
    } else {
      toast.warn("No report selected or available for deletion.");
    }
  };

  const handleDownload = (format: "csv" | "excel") => {
    dispatch(downloadPayslipReport({ format }));
  };

  const columns: Column<PayslipComponent>[] = [
    { key: "name", header: "Name" },
    { key: "emp_id", header: "Employee ID" },
    { key: "status", header: "Status", render: (row) => renderStatus(row.status) },
    { key: "phoneNum", header: "Phone Number" },
    { key: "designation", header: "Designation" },
    { key: "department", header: "Department" },
    { key: "location", header: "Location" },
    { key: "componentName", header: "Component Name" },
    { key: "code", header: "Code" },
    { key: "type", header: "Type" },
    { key: "amount", header: "Amount", render: (row) => formatCurrency(row.amount) },
  ];

  if (view === "template") {
    return (
      <PayslipComponentReportTemplate
        templateId={templateId}
        onBack={() => setView("report")}
      />
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* --- HEADER --- */}
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Payslip Component Report</h1>
        <div className="flex flex-col items-end space-y-3">
          <p className="text-sm text-gray-500">
            <Link to="/reports/all">Reports</Link> /{" "}
            <Link to="/reports/finance">Finance Reports</Link> / Payslip Component Report
          </p>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                if (templateId) setView("template");
                else toast.warn("Template ID not available.");
              }}
              className="bg-purple-100 text-[#741CDD] font-semibold py-2 px-4 rounded-full hover:bg-purple-200 transition-colors"
              disabled={!templateId || loading}
            >
              EDIT TEMPLATE
            </button>
            <button
              onClick={() => handleDownload("csv")}
              className="bg-blue-100 text-blue-800 font-semibold py-2 px-4 rounded-full hover:bg-blue-200 transition-colors"
              disabled={loading}
            >
              DOWNLOAD CSV
            </button>
            <button
              onClick={() => handleDownload("excel")}
              className="bg-green-100 text-green-800 font-semibold py-2 px-4 rounded-full hover:bg-green-200 transition-colors"
              disabled={loading}
            >
              DOWNLOAD EXCEL
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white font-semibold py-2 px-4 rounded-full hover:bg-red-600 transition-colors"
              disabled={!reportId || loading}
            >
              DELETE
            </button>
          </div>
        </div>
      </div>

      {/* --- TABLE WITH BUILT-IN SEARCH + PAGINATION --- */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          {loading && components.length === 0 && (
            <p className="text-center p-4">Loading reports...</p>
          )}
          {!loading && error && (
            <p className="text-center text-red-500 p-4">{error}</p>
          )}
          {!loading && !error && (
            <Table
              data={components}
              columns={columns}
              showSearch={true}
              searchPlaceholder="Search by name, ID, etc..."
              onSearch={handleSearch}
              showPagination={false} // disable table’s pagination
              className="w-[1350px]"
            />
          )}
        </div>

        {/* --- SERVER-SIDE PAGINATION CONTROLS --- */}
        {pagination && pagination.totalItems > 0 && (
          <div className="pagination flex justify-between items-center mt-4 text-sm text-gray-700">
            <span>
              Showing {(pagination.currentPage - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.currentPage * pagination.limit, pagination.totalItems)} of{" "}
              {pagination.totalItems} items
            </span>
            <div className="flex space-x-1">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1 || loading}
                className="px-3 py-1 border rounded bg-gray-50 hover:bg-gray-100 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-3 py-1">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages || loading}
                className="px-3 py-1 border rounded bg-gray-50 hover:bg-gray-100 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PayslipComponentReport;
