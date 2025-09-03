// // src/pages/Reports/pages/AttendanceReport/AttendanceReport.tsx
// import React, { useState, useEffect, useCallback } from "react";
// import { Link } from "react-router-dom";
// import { toast } from "react-toastify";
// import Table, { type Column } from "../../../../components/common/Table";
// import AttendanceSummaryReportFilters, {type  AttendanceFilters } from "./component/AttendanceSummaryReportFilters";
// import AttendanceSummaryReportTemplate from "./component/AttendanceSummaryReportTemplate";
// import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
// import { fetchAttendanceSummary, downloadAttendanceSummary, type AttendanceRecord } from "../../../../store/slice/attendanceReportSlice";

// // Helper to render status badges
// const renderStatus = (status: "Active" | "Inactive") => {
//   const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full";
//   const activeClasses = "bg-green-100 text-green-800";
//   const inactiveClasses = "bg-red-100 text-red-800";
//   return (
//     <span className={`${baseClasses} ${status === "Active" ? activeClasses : inactiveClasses}`}>
//       {status}
//     </span>
//   );
// };

// const AttendanceReport: React.FC = () => {
//   const [view, setView] = useState<"report" | "template">("report");
//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [currentFilters, setCurrentFilters] = useState<Partial<AttendanceFilters>>({});

//   const dispatch = useAppDispatch();
//   const { data, loading, error, totalItems, limit, isDownloading } = useAppSelector(
//     (state) => state.attendanceReport
//   );

//   // Fetch data when page or filters change
//   useEffect(() => {
//     dispatch(fetchAttendanceSummary({ page: currentPage, limit, filter: currentFilters }));
//   }, [dispatch, currentPage, limit, currentFilters]);

//   // Display errors via toast notifications
//   useEffect(() => {
//     if (error) {
//       toast.error(error);
//     }
//   }, [error]);

//   const handleApplyFilters = useCallback((filters: AttendanceFilters) => {
//     setCurrentFilters(filters);
//     setCurrentPage(1); // Reset to page 1 when filters are applied
//     setIsFilterOpen(false);
//   }, []);

//   const handleDownload = (format: "csv" | "xlsx") => {
//     if (isDownloading) return;
//     toast.info(`Your ${format.toUpperCase()} download will begin shortly...`);
//     dispatch(downloadAttendanceSummary({ format, filter: currentFilters }));
//   };

//   const handleBackFromTemplate = (shouldRefetch = false) => {
//     setView("report");
//     if (shouldRefetch) {
//       // Refetch the attendance summary with current filters and page
//       dispatch(fetchAttendanceSummary({ page: currentPage, limit, filter: currentFilters }));
//     }
//   };

//   const columns: Column<AttendanceRecord>[] = [
//     { key: "name", header: "Name" },
//     { key: "emp_id", header: "Employee ID" },
//     { key: "status", header: "Status", render: (row) => renderStatus(row.status) },
//     { key: "attendanceStatus", header: "Attendance Type" },
//     { key: "date", header: "Date" },
//     { key: "inTime", header: "In Time" },
//     { key: "outTime", header: "Out Time" },
//     { key: "timeSpent", header: "Time Spent" },
//     { key: "lateBy", header: "Late by" },
//     { key: "earlyBy", header: "Early by" },
//     { key: "overTime", header: "Overtime" },
//   ];

//   if (view === "template") {
//     return <AttendanceSummaryReportTemplate onBack={handleBackFromTemplate} />;
//   }

//   return (
//     <div className="p-8 bg-gray-50 min-h-screen">
//       <div className="flex justify-between items-start mb-6">
//         <h1 className="text-3xl font-bold text-gray-800">Attendance Summary Report</h1>
//         <div className="flex flex-col items-end space-y-3">
//           <p className="text-sm text-gray-500">
//             <Link to="/reports/all">Reports</Link> / <Link to="/reports/scheduled">Scheduled Reports</Link> / Attendance Report
//           </p>
//           <div className="flex items-center space-x-2 flex-wrap gap-y-2">
//             <button onClick={() => setView("template")} className="bg-purple-100 text-[#741CDD] font-semibold py-2 px-4 rounded-full hover:bg-purple-200">EDIT TEMPLATE</button>
//             <button onClick={() => setIsFilterOpen(true)} className="bg-purple-100 text-[#741CDD] font-semibold py-2 px-4 rounded-full hover:bg-purple-200">FILTER</button>
//             <button onClick={() => handleDownload("csv")} disabled={isDownloading} className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-full hover:bg-blue-600 disabled:opacity-50">
//               {isDownloading ? "DOWNLOADING..." : "DOWNLOAD CSV"}
//             </button>
//             <button onClick={() => handleDownload("xlsx")} disabled={isDownloading} className="bg-green-500 text-white font-semibold py-2 px-4 rounded-full hover:bg-green-600 disabled:opacity-50">
//               {isDownloading ? "DOWNLOADING..." : "DOWNLOAD xlsx"}
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="bg-white p-6 rounded-lg shadow-sm">
//         <div className="overflow-x-auto">
//           {loading === "pending" && <p className="text-center p-4">Loading report data...</p>}
//           {loading === "succeeded" && (
//             <Table
//               data={data}
//               columns={columns}
//               showSearch={false} // Server-side search should be implemented via filter
//               showPagination={true}
//               totalItems={totalItems}
//               itemsPerPage={limit}
//               currentPage={currentPage}
//               onPageChange={(page) => setCurrentPage(page)}
//               className="w-full min-w-[1200px]"
//             />
//           )}
//           {loading === "failed" && <p className="text-center text-red-500 p-4">Failed to load report data.</p>}
//         </div>
//       </div>

//       <AttendanceSummaryReportFilters isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} onApplyFilters={handleApplyFilters} />
//     </div>
//   );
// };

// export default AttendanceReport;

// src/pages/Reports/pages/AttendanceReport/AttendanceReport.tsx
import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Table, { type Column } from "../../../../components/common/Table";
import AttendanceSummaryReportFilters, {type  AttendanceFilters } from "./component/AttendanceSummaryReportFilters";
import AttendanceSummaryReportTemplate from "./component/AttendanceSummaryReportTemplate";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { fetchAttendanceSummary, downloadAttendanceSummary, type AttendanceRecord } from "../../../../store/slice/attendanceReportSlice";

// Helper to render status badges
const renderStatus = (status: "Active" | "Inactive") => {
  const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full";
  const activeClasses = "bg-green-100 text-green-800";
  const inactiveClasses = "bg-red-100 text-red-800";
  return (
    <span className={`${baseClasses} ${status === "Active" ? activeClasses : inactiveClasses}`}>
      {status}
    </span>
  );
};

// ▼▼▼ NEW: Custom Pagination Component ▼▼▼
const ServerPagination = ({ currentPage, totalItems, itemsPerPage, onPageChange }: { currentPage: number, totalItems: number, itemsPerPage: number, onPageChange: (page: number) => void }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (totalPages <= 1) return null;

  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
  const indexOfLastItem = indexOfFirstItem + itemsPerPage > totalItems ? totalItems : indexOfFirstItem + itemsPerPage;

  return (
    <div className="pagination flex justify-between items-center mt-4 text-sm text-gray-700">
      <span>
        Showing {indexOfFirstItem + 1} to {indexOfLastItem} of {totalItems} items
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


const AttendanceReport: React.FC = () => {
  const [view, setView] = useState<"report" | "template">("report");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentFilters, setCurrentFilters] = useState<Partial<AttendanceFilters>>({});

  const dispatch = useAppDispatch();
  const { data, loading, error, totalItems, limit, isDownloading } = useAppSelector(
    (state) => state.attendanceReport
  );

  // Fetch data when page or filters change
  useEffect(() => {
    dispatch(fetchAttendanceSummary({ page: currentPage, limit, filter: currentFilters }));
  }, [dispatch, currentPage, limit, currentFilters]);

  // Display errors via toast notifications
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleApplyFilters = useCallback((filters: AttendanceFilters) => {
    setCurrentFilters(filters);
    setCurrentPage(1); // Reset to page 1 when filters are applied
    setIsFilterOpen(false);
  }, []);

  const handleDownload = (format: "csv" | "xlsx") => {
    if (isDownloading) return;
    toast.info(`Your ${format.toUpperCase()} download will begin shortly...`);
    dispatch(downloadAttendanceSummary({ format, filter: currentFilters }));
  };

  const handleBackFromTemplate = (shouldRefetch = false) => {
    setView("report");
    if (shouldRefetch) {
      // Refetch the attendance summary with current filters and page
      dispatch(fetchAttendanceSummary({ page: currentPage, limit, filter: currentFilters }));
    }
  };

  const columns: Column<AttendanceRecord>[] = [
    { key: "name", header: "Name" },
    { key: "emp_id", header: "Employee ID" },
    { key: "status", header: "Status", render: (row) => renderStatus(row.status) },
    { key: "attendanceStatus", header: "Attendance Type" },
    { key: "date", header: "Date" },
    { key: "inTime", header: "In Time" },
    { key: "outTime", header: "Out Time" },
    { key: "timeSpent", header: "Time Spent" },
    { key: "lateBy", header: "Late by" },
    { key: "earlyBy", header: "Early by" },
    { key: "overTime", header: "Overtime" },
  ];

  if (view === "template") {
    return <AttendanceSummaryReportTemplate onBack={handleBackFromTemplate} />;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Attendance Summary Report</h1>
        <div className="flex flex-col items-end space-y-3">
          <p className="text-sm text-gray-500">
            <Link to="/reports/all">Reports</Link> / <Link to="/reports/scheduled">Scheduled Reports</Link> / Attendance Report
          </p>
          <div className="flex items-center space-x-2 flex-wrap gap-y-2">
            <button onClick={() => setView("template")} className="bg-purple-100 text-[#741CDD] font-semibold py-2 px-4 rounded-full hover:bg-purple-200">EDIT TEMPLATE</button>
            <button onClick={() => setIsFilterOpen(true)} className="bg-purple-100 text-[#741CDD] font-semibold py-2 px-4 rounded-full hover:bg-purple-200">FILTER</button>
            <button onClick={() => handleDownload("csv")} disabled={isDownloading} className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-full hover:bg-blue-600 disabled:opacity-50">
              {isDownloading ? "DOWNLOADING..." : "DOWNLOAD CSV"}
            </button>
            <button onClick={() => handleDownload("xlsx")} disabled={isDownloading} className="bg-green-500 text-white font-semibold py-2 px-4 rounded-full hover:bg-green-600 disabled:opacity-50">
              {isDownloading ? "DOWNLOADING..." : "DOWNLOAD xlsx"}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          {loading === "pending" && <p className="text-center p-4">Loading report data...</p>}
          {loading === "succeeded" && (
            <>
              <Table
                data={data}
                columns={columns}
                showSearch={false}
                showPagination={false} // <-- Hide the table's internal pagination
                className="w-full min-w-[1200px]"
              />
              {/* ▼▼▼ RENDER THE CUSTOM PAGINATION CONTROLS HERE ▼▼▼ */}
              <ServerPagination
                currentPage={currentPage}
                totalItems={totalItems}
                itemsPerPage={limit}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </>
          )}
          {loading === "failed" && <p className="text-center text-red-500 p-4">Failed to load report data.</p>}
        </div>
      </div>

      <AttendanceSummaryReportFilters isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} onApplyFilters={handleApplyFilters} />
    </div>
  );
};

export default AttendanceReport;