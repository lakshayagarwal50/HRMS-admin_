import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Table, { type Column } from "../../../../../components/common/Table";
import PayslipSummaryTemplate from "./component/PayslipSummaryTemplate";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../../../../store/store";
import {
  fetchPayslipSummary,
  downloadPayslipSummary,
  deletePayslipSummary,
  schedulePayslipSummary,
  resetScheduleStatus,
  type ScheduleData,
} from "../../../../../store/slice/payslipSummarySlice";
import { toast } from "react-toastify";
import AlertModal from "../../../../../components/Modal/AlertModal";
import { Trash2, Search } from "lucide-react";
import useDebounce from "../../../../../hooks/useDebounce";

// INTERFACE
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

// HELPER FUNCTIONS
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

// CHILD COMPONENTS
const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 10 }) => (
  <div className="space-y-4 animate-pulse">
    <div className="h-8 bg-gray-200 rounded w-full mb-4"></div>
    {Array.from({ length: rows }).map((_, index) => (
      <div key={index} className="h-10 bg-gray-200 rounded w-full"></div>
    ))}
  </div>
);

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

const frequencyOptions = ["Daily", "Weekly", "Monthly", "Yearly"];
const hourOptions = Array.from({ length: 24 }, (_, i) => `${i}`);
const minuteOptions = Array.from({ length: 60 }, (_, i) => `${i}`);

const formatDateForAPI = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// MAIN COMPONENT
const PayslipSummaryReport: React.FC = () => {
  const [view, setView] = useState<"report" | "template" | "schedule">(
    "report"
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentFilters, setCurrentFilters] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [scheduleFormData, setScheduleFormData] = useState<
    Omit<ScheduleData, "startDate"> & { startDate: string }
  >({
    frequency: "",
    startDate: "",
    hours: "",
    minutes: "",
    format: "XLSX",
    to: "",
    cc: "",
    subject: "Scheduled Report: Payslip Summary",
    body: "Please find the attached report: Payslip Summary.",
  });

  // Read state from URL
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const currentLimit = parseInt(searchParams.get("limit") || "10", 10);
  const currentSearch = searchParams.get("search") || "";

  // Local state for live search input
  const [searchQuery, setSearchQuery] = useState(currentSearch);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const {
    reportData,
    status,
    error,
    totalPages,
    totalItems,
    isDownloading,
    reportId,
    reportExists,
    scheduleStatus,
  } = useSelector((state: RootState) => state.payslipSummary);

  useEffect(() => {
    dispatch(
      fetchPayslipSummary({
        page: currentPage,
        limit: currentLimit,
        search: currentSearch,
        filters: currentFilters,
      })
    );
  }, [
    dispatch,
    currentPage,
    currentLimit,
    currentSearch,
    JSON.stringify(currentFilters),
    refetchTrigger, 
  ]);
  
  useEffect(() => {
    if (debouncedSearchQuery !== currentSearch) {
      setSearchParams(
        (prev) => {
          const newParams = new URLSearchParams(prev);
          newParams.set("page", "1");
          newParams.set("search", debouncedSearchQuery);
          newParams.set("limit", String(currentLimit));
          return newParams;
        },
        { replace: true }
      );
    }
  }, [debouncedSearchQuery, currentSearch, currentLimit, setSearchParams]);

  useEffect(() => {
    if (status === "failed" && error && reportExists) {
      toast.error(error);
    }
  }, [status, error, reportExists]);

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("limit", e.target.value);
      newParams.set("page", "1");
      return newParams;
    });
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("page", String(newPage));
      return newParams;
    });
    window.scrollTo(0, 0);
  };

  const handleBackFromTemplate = () => {
    dispatch(
      fetchPayslipSummary({
        page: currentPage,
        limit: currentLimit,
        search: currentSearch,
        filters: currentFilters,
      })
    );
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
    setSearchParams({
      page: "1",
      limit: String(currentLimit),
      search: currentSearch,
    });
    setIsFilterOpen(false);
  };


  const handleDownload = async (format: "csv" | "xlsx") => {
    if (isDownloading) return;

    const toastId = toast.loading(
      `Preparing your ${format.toUpperCase()} download...`
    );

    try {
      const result = await dispatch(
        downloadPayslipSummary({ format, filters: currentFilters })
      ).unwrap();

      const url = window.URL.createObjectURL(new Blob([result.fileData]));

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", result.fileName); 

      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url); 

      toast.update(toastId, {
        render: "Download started successfully!",
        type: "success",
        isLoading: false,
        autoClose: 5000,
      });
    } catch (err: any) {
      
      toast.update(toastId, {
        render: err || "Download failed. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    }
  };

  const handleDeleteClick = () => {
    if (!reportId) {
      toast.error("Report ID is missing. Cannot delete.");
      return;
    }
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!reportId) return;
    try {
      await dispatch(deletePayslipSummary(reportId)).unwrap();

      setSearchParams({ page: "1", limit: String(currentLimit), search: "" });

      setRefetchTrigger((prev) => prev + 1);
    } catch (err: any) {
      console.error("Failed to delete report:", err);
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  const handleScheduleClick = () => {
    if (!reportId) {
      toast.error("Cannot schedule report without a Report ID.");
      return;
    }
    setView("schedule");
  };

  const handleScheduleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setScheduleFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportId) return;

    const payload: ScheduleData = {
      ...scheduleFormData,
      startDate: formatDateForAPI(scheduleFormData.startDate),
    };

    const toastId = toast.loading("Scheduling report...");
    try {
      await dispatch(
        schedulePayslipSummary({ reportId, scheduleData: payload })
      ).unwrap();
      toast.update(toastId, {
        render: "Report scheduled successfully!",
        type: "success",
        isLoading: false,
        autoClose: 5000,
      });
      dispatch(resetScheduleStatus());
      navigate("/reports/scheduled");
    } catch (err: any) {
      toast.update(toastId, {
        render: err.message || "Failed to schedule report.",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    }
  };

  const renderContent = () => {
    if (status === "failed" && !reportExists) {
      return (
        <div className="text-center p-10 space-y-4">
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => navigate("/reports/create")}
            className="font-semibold py-2 px-6 rounded-full text-white bg-[#741CDD] hover:bg-[#5f17b3]"
          >
            Create Report
          </button>
        </div>
      );
    }
    if (status === "loading" && reportData.length === 0) {
      return <TableSkeleton rows={currentLimit} />;
    }
    if (status === "failed") {
      return <p className="p-10 text-center text-red-500">Error: {error}</p>;
    }
    if (reportData.length === 0 && status === "succeeded") {
      return (
        <div className="text-center p-10">
          <p className="text-lg text-gray-600">
            No data available for this report.
          </p>
        </div>
      );
    }
    return (
      <>
        <Table
          key={currentLimit}
          defaultItemsPerPage={currentLimit}
          data={reportData}
          columns={columns}
          className="[&_.table-controls]:hidden"
          showSearch={false}
          showPagination={false}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={currentLimit}
          onPageChange={handlePageChange}
        />
      </>
    );
  };

  if (view === "template") {
    return <PayslipSummaryTemplate onBack={handleBackFromTemplate} />;
  }

  if (view === "schedule") {
    const isSubmitting = scheduleStatus === "loading";
    return (
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Schedule Report</h1>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-sm">
          <div className="inline-block bg-purple-100 text-purple-800 text-sm font-medium px-4 py-1 rounded-full mb-8">
            Schedule Email For Report: Payslip Summary
          </div>
          <form onSubmit={handleScheduleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="frequency"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Frequency
                </label>
                <select
                  id="frequency"
                  name="frequency"
                  value={scheduleFormData.frequency}
                  onChange={handleScheduleFormChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="" disabled>
                    Select One
                  </option>
                  {frequencyOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="startDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Start Date
                </label>
                <input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={scheduleFormData.startDate}
                  onChange={handleScheduleFormChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label
                  htmlFor="hours"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Hours (24h)
                </label>
                <select
                  id="hours"
                  name="hours"
                  value={scheduleFormData.hours}
                  onChange={handleScheduleFormChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="" disabled>
                    Select Hour
                  </option>
                  {hourOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt.padStart(2, "0")}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="minutes"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Minutes
                </label>
                <select
                  id="minutes"
                  name="minutes"
                  value={scheduleFormData.minutes}
                  onChange={handleScheduleFormChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="" disabled>
                    Select Minute
                  </option>
                  {minuteOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt.padStart(2, "0")}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Send As
              </label>
              <div className="flex items-center space-x-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="format"
                    value="XLSX"
                    checked={scheduleFormData.format === "XLSX"}
                    onChange={handleScheduleFormChange}
                    className="h-4 w-4 text-purple-600"
                  />
                  <span>XLSX</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="format"
                    value="CSV"
                    checked={scheduleFormData.format === "CSV"}
                    onChange={handleScheduleFormChange}
                    className="h-4 w-4 text-purple-600"
                  />
                  <span>CSV</span>
                </label>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="to"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  To
                </label>
                <input
                  id="to"
                  name="to"
                  type="email"
                  value={scheduleFormData.to}
                  onChange={handleScheduleFormChange}
                  placeholder="comma,separated,emails"
                  required
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label
                  htmlFor="cc"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  CC
                </label>
                <input
                  id="cc"
                  name="cc"
                  type="email"
                  value={scheduleFormData.cc}
                  onChange={handleScheduleFormChange}
                  placeholder="comma,separated,emails"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  value={scheduleFormData.subject}
                  onChange={handleScheduleFormChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label
                  htmlFor="body"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Body
                </label>
                <textarea
                  id="body"
                  name="body"
                  value={scheduleFormData.body}
                  onChange={handleScheduleFormChange}
                  rows={3}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="mt-8">
              <div className="flex items-center space-x-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#7F56D9] text-white font-semibold py-2 px-6 rounded-lg hover:bg-opacity-90 disabled:bg-gray-400"
                >
                  {isSubmitting ? "SUBMITTING..." : "SUBMIT"}
                </button>
                <button
                  type="button"
                  onClick={() => setView("report")}
                  disabled={isSubmitting}
                  className="bg-gray-200 text-gray-800 font-semibold py-2 px-6 rounded-lg hover:bg-gray-300"
                >
                  CANCEL
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Payslip Summary Report
        </h1>
        <div className="flex flex-col items-end space-y-3">
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setView("template")}
              disabled={status !== "succeeded" || !reportId}
              className="bg-purple-100 text-[#741CDD] font-semibold py-2 px-4 rounded-full hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              EDIT TEMPLATE
            </button>
            <button
              onClick={() => handleDownload("csv")}
              disabled={isDownloading || status !== "succeeded" || !reportId}
              className="bg-purple-100 text-[#741CDD] font-semibold py-2 px-4 rounded-full hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDownloading ? "DOWNLOADING..." : "DOWNLOAD CSV"}
            </button>
            <button
              onClick={() => handleDownload("xlsx")}
              disabled={isDownloading || status !== "succeeded" || !reportId}
              className="bg-purple-100 text-[#741CDD] font-semibold py-2 px-4 rounded-full hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDownloading ? "DOWNLOADING..." : "DOWNLOAD XLSX"}
            </button>
            <button
              onClick={handleScheduleClick}
              disabled={status !== "succeeded" || !reportId}
              className="bg-purple-100 text-[#741CDD] font-semibold py-2 px-4 rounded-full hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              SCHEDULE REPORT
            </button>
            <button
              onClick={handleDeleteClick}
              disabled={status !== "succeeded" || !reportId}
              className="bg-red-500 text-white font-semibold py-2 px-4 rounded-full hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              DELETE
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        {reportExists && (
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <label
                htmlFor="limit-select"
                className="text-sm font-medium text-gray-700"
              >
                Show
              </label>
              <select
                id="limit-select"
                value={currentLimit}
                onChange={handleLimitChange}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[#741CDD]"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
              <span className="text-sm font-medium text-gray-700">entries</span>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search on Name and EmpId"
                className="border border-gray-300 rounded-md pl-9 pr-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[#741CDD]"
              />
            </div>
          </div>
        )}
        {renderContent()}
      </div>

      <AlertModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Report"
        icon={<Trash2 size={32} className="text-red-500" />}
      >
        <p>
          Are you sure you want to delete this report? This action cannot be
          undone.
        </p>
      </AlertModal>
    </div>
  );
};

export default PayslipSummaryReport;
