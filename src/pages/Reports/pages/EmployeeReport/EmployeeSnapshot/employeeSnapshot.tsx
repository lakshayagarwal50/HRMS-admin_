import React, { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Search, Trash2 } from "lucide-react";
import Table, { type Column } from "../../../../../components/common/Table";
import EmployeeSnapshotFilters from "./component/EmployeeSnapshotFilters";
import EmployeeReportTemplate from "./component/EmployeeReportTemplate";
import useDebounce from "../../../../../hooks/useDebounce";

import { useAppDispatch, useAppSelector } from "../../../../../store/hooks";
import {
  fetchEmployeeSnapshot,
  downloadEmployeeSnapshot,
  deleteEmployeeSnapshot,
  scheduleEmployeeSnapshot,
  resetScheduleStatus,
  type EmployeeData,
  type ScheduleData,
} from "../../../../../store/slice/employeeSnapshotSlice";
import { toast } from "react-toastify";
import AlertModal from "../../../../../components/Modal/AlertModal";

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
  // { key: "leavesAdjusted", header: "Leaves Adjusted" },
  // { key: "leaveBalance", header: "Leave Balance" },
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

const EmployeeSnapshot: React.FC = () => {
  const [view, setView] = useState<"table" | "editTemplate" | "schedule">(
    "table"
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<any>({});
  const [searchParams, setSearchParams] = useSearchParams();
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
    subject: "Scheduled Report: Employee Snapshot",
    body: "Please find the attached report: Employee Snapshot.",
  });

  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const currentLimit = parseInt(searchParams.get("limit") || "10", 10);
  const currentSearch = searchParams.get("search") || "";

  const [searchQuery, setSearchQuery] = useState(currentSearch);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    employees,
    status,
    error,
    total,
    isDownloading,
    reportId,
    reportExists,
    scheduleStatus,
  } = useAppSelector((state) => state.employeeSnapshot);

  useEffect(() => {
    dispatch(
      fetchEmployeeSnapshot({
        page: currentPage,
        limit: currentLimit,
        search: currentSearch,
        filters: activeFilters,
      })
    );
  }, [
    dispatch,
    currentPage,
    currentLimit,
    currentSearch,
    JSON.stringify(activeFilters),
  ]);

  useEffect(() => {
    if (debouncedSearchQuery !== currentSearch) {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.set("page", "1");
        newParams.set("search", debouncedSearchQuery);
        return newParams;
      });
    }
  }, [debouncedSearchQuery, currentSearch, setSearchParams]);

  useEffect(() => {
    if (status === "failed" && error) {
      toast.error(error);
    }
  }, [status, error]);

  const handleApplyFilters = (filters: any) => {
    setActiveFilters(filters);
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("page", "1");
      return newParams;
    });
    setIsFilterOpen(false);
  };

  const totalPages = Math.ceil(total / currentLimit) || 1;

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("limit", e.target.value);
      newParams.set("page", "1");
      return newParams;
    });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.set("page", String(newPage));
        return newParams;
      });
    }
  };

  const handleBackFromTemplate = () => {
    setView("table");
    dispatch(
      fetchEmployeeSnapshot({
        page: currentPage,
        limit: currentLimit,
        search: currentSearch,
        filters: activeFilters,
      })
    );
  };

  const handleDownload = (format: "csv" | "xlsx") => {
    if (isDownloading) return;
    toast(`Your ${format.toUpperCase()} download will begin shortly...`);
    dispatch(downloadEmployeeSnapshot({ format, filters: activeFilters }));
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
      await dispatch(deleteEmployeeSnapshot(reportId)).unwrap();
      setSearchParams({
        page: "1",
        limit: String(currentLimit),
        search: currentSearch,
      });
      dispatch(
        fetchEmployeeSnapshot({
          page: 1,
          limit: currentLimit,
          search: currentSearch,
          filters: activeFilters,
        })
      );
    } catch (err: any) {
      console.error("Failed to delete report:", err);
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  const handleScheduleClick = () => {
    if (!reportId) {
      toast.error("Cannot schedule a report without a Report ID.");
      return;
    }
    setView("schedule");
  };

  const handleScheduleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setScheduleFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportId) {
      toast.error("Report ID is missing.");
      return;
    }
    const requiredFields: (keyof ScheduleData)[] = [
      "frequency",
      "startDate",
      "hours",
      "minutes",
      "to",
      "subject",
      "body",
    ];
    if (
      requiredFields.some(
        (field) => !(scheduleFormData[field] as string)?.trim()
      )
    ) {
      toast.error("Please fill out all required fields.");
      return;
    }
    const payload: ScheduleData = {
      ...scheduleFormData,
      startDate: formatDateForAPI(scheduleFormData.startDate),
    };

    const toastId = toast.loading("Scheduling report...");
    try {
      await dispatch(
        scheduleEmployeeSnapshot({ reportId, scheduleData: payload })
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

  if (view === "editTemplate") {
    return <EmployeeReportTemplate onBack={handleBackFromTemplate} />;
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
            Schedule Email For Report: Employee Snapshot
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
                  onClick={() => setView("table")}
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

  const renderContent = () => {
    if (status === "failed" && !reportExists) {
      return (
        <div className="text-center p-10 space-y-4">
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => navigate("/reports/create")}
            className="bg-[#741CDD] text-white font-semibold py-2 px-6 rounded-full hover:bg-[#5f17b8] transition-colors"
          >
            Create Report
          </button>
        </div>
      );
    }
    if (status === "loading") {
      return <TableSkeleton rows={currentLimit} />;
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
            key={currentLimit}
            defaultItemsPerPage={currentLimit}
            data={employees}
            columns={columns}
            showPagination={false}
            className="[&_.table-controls]:hidden w-[1350px]"
          />
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={total}
          itemsPerPage={currentLimit}
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
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setView("editTemplate")}
              disabled={
                status === "loading" || status === "failed" || !reportId
              }
              className="bg-purple-100 text-[#741CDD] font-semibold py-2 px-4 rounded-full hover:bg-purple-200 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              EDIT TEMPLATE
            </button>
            <button
              onClick={() => handleDownload("csv")}
              disabled={
                isDownloading ||
                status === "loading" ||
                status === "failed" ||
                !reportId
              }
              className="bg-purple-100 text-[#741CDD] font-semibold py-2 px-4 rounded-full hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDownloading ? "DOWNLOADING..." : "DOWNLOAD CSV"}
            </button>
            <button
              onClick={() => handleDownload("xlsx")}
              disabled={
                isDownloading ||
                status === "loading" ||
                status === "failed" ||
                !reportId
              }
              className="bg-purple-100 text-[#741CDD] font-semibold py-2 px-4 rounded-full hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDownloading ? "DOWNLOADING..." : "DOWNLOAD XLSX"}
            </button>
            <button
              onClick={() => setIsFilterOpen(true)}
              disabled={
                status === "loading" || status === "failed" || !reportId
              }
              className="bg-purple-100 text-[#741CDD] font-semibold py-2 px-4 rounded-full hover:bg-purple-200 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              FILTER
            </button>
            <button
              onClick={handleScheduleClick}
              disabled={
                status === "loading" || status === "failed" || !reportId
              }
              className="bg-purple-100 text-[#741CDD] font-semibold py-2 px-4 rounded-full hover:bg-purple-200 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              SCHEDULE REPORT
            </button>
            <button
              onClick={handleDeleteClick}
              disabled={
                !reportId || status === "loading" || status === "failed"
              }
              className="bg-red-500 text-white font-semibold py-2 px-4 rounded-full hover:bg-red-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
                placeholder="Search on Name and emp_id"
                className="border border-gray-300 rounded-md pl-9 pr-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[#741CDD]"
              />
            </div>
          </div>
        )}
        {renderContent()}
      </div>
      <EmployeeSnapshotFilters
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApplyFilters={handleApplyFilters}
      />
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

export default EmployeeSnapshot;
