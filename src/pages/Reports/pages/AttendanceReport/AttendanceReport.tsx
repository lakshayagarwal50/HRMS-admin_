// import React, { useState, useEffect, useCallback } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import Table, { type Column } from "../../../../components/common/Table";
// import AttendanceSummaryReportFilters, {type  AttendanceFilters } from "./component/AttendanceSummaryReportFilters";
// import AttendanceSummaryReportTemplate from "./component/AttendanceSummaryReportTemplate";
// import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
// import { fetchAttendanceSummary, downloadAttendanceSummary, type AttendanceRecord } from "../../../../store/slice/attendanceReportSlice";


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


// const ServerPagination = ({ currentPage, totalItems, itemsPerPage, onPageChange }: { currentPage: number, totalItems: number, itemsPerPage: number, onPageChange: (page: number) => void }) => {
//   const totalPages = Math.ceil(totalItems / itemsPerPage);
//   if (totalPages <= 1) return null;

//   const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
//   const indexOfLastItem = indexOfFirstItem + itemsPerPage > totalItems ? totalItems : indexOfFirstItem + itemsPerPage;

//   return (
//     <div className="pagination flex justify-between items-center mt-4 text-sm text-gray-700">
//       <span>
//         Showing {indexOfFirstItem + 1} to {indexOfLastItem} of {totalItems} items
//       </span>
//       <div className="flex space-x-1">
//         <button
//           onClick={() => onPageChange(currentPage - 1)}
//           disabled={currentPage === 1}
//           className="px-3 py-1 border rounded bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           Previous
//         </button>
//         <button
//           onClick={() => onPageChange(currentPage + 1)}
//           disabled={currentPage === totalPages}
//           className="px-3 py-1 border rounded bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           Next
//         </button>
//       </div>
//     </div>
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

//   const navigate = useNavigate();
  
//   useEffect(() => {
//     dispatch(fetchAttendanceSummary({ page: currentPage, limit, filter: currentFilters }));
//   }, [dispatch, currentPage, limit, currentFilters]);

 
//   useEffect(() => {
//     if (error) {
//       toast.error(error);
//     }
//   }, [error]);

//   const handleApplyFilters = useCallback((filters: AttendanceFilters) => {
//     setCurrentFilters(filters);
//     setCurrentPage(1); 
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
            
//              <button onClick={() => handleDownload("csv")} disabled={isDownloading} className="bg-purple-100 text-[#741CDD] font-semibold py-2 px-4 rounded-full hover:bg-purple-200">
//               {isDownloading ? "DOWNLOADING..." : "DOWNLOAD CSV"}
//             </button>
//             <button onClick={() => handleDownload("xlsx")} disabled={isDownloading} className="bg-purple-100 text-[#741CDD] font-semibold py-2 px-4 rounded-full hover:bg-purple-200">
//               {isDownloading ? "DOWNLOADING..." : "DOWNLOAD xlsx"}
//             </button>
//             <button onClick={() => navigate('/reports/all')} className="bg-purple-100 text-[#741CDD] font-semibold py-2 px-4 rounded-full hover:bg-purple-200">SCHEDULE REPORT</button>
//           </div>
//         </div>
//       </div>

//       <div className="bg-white p-6 rounded-lg shadow-sm">
//         <div className="overflow-x-auto">
//           {loading === "pending" && <p className="text-center p-4">Loading report data...</p>}
//           {loading === "succeeded" && (
//             <>
//               <Table
//                 data={data}
//                 columns={columns}
//                 showSearch={false}
//                 showPagination={false} 
//                 className="w-full min-w-[1200px]"
//               />
              
//               <ServerPagination
//                 currentPage={currentPage}
//                 totalItems={totalItems}
//                 itemsPerPage={limit}
//                 onPageChange={(page) => setCurrentPage(page)}
//               />
//             </>
//           )}
//           {loading === "failed" && <p className="text-center text-red-500 p-4">Failed to load report data.</p>}
//         </div>
//       </div>

//       <AttendanceSummaryReportFilters isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} onApplyFilters={handleApplyFilters} />
//     </div>
//   );
// };

// export default AttendanceReport;

// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import Table, { type Column } from "../../../../components/common/Table";
// import AttendanceSummaryReportTemplate from "./component/AttendanceSummaryReportTemplate";
// import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
// import { fetchAttendanceSummary, downloadAttendanceSummary, type AttendanceRecord } from "../../../../store/slice/attendanceReportSlice";


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


// const ServerPagination = ({ currentPage, totalItems, itemsPerPage, onPageChange, loading }: { currentPage: number, totalItems: number, itemsPerPage: number, onPageChange: (page: number) => void, loading: boolean }) => {
//   const totalPages = Math.ceil(totalItems / itemsPerPage);
//   if (totalPages <= 1) return null;

//   const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
//   const indexOfLastItem = indexOfFirstItem + itemsPerPage > totalItems ? totalItems : indexOfFirstItem + itemsPerPage;

//   return (
//     <div className="pagination flex justify-between items-center mt-4 text-sm text-gray-700">
//       <span>
//         Showing {indexOfFirstItem + 1} to {indexOfLastItem} of {totalItems} items
//       </span>
//       <div className="flex space-x-1">
//         <button
//           onClick={() => onPageChange(currentPage - 1)}
//           disabled={currentPage === 1 || loading}
//           className="px-3 py-1 border rounded bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           Previous
//         </button>
//         <span className="px-3 py-1">
//           Page {currentPage} of {totalPages}
//         </span>
//         <button
//           onClick={() => onPageChange(currentPage + 1)}
//           disabled={currentPage === totalPages || loading}
//           className="px-3 py-1 border rounded bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };


// const AttendanceReport: React.FC = () => {
//   const [view, setView] = useState<"report" | "template">("report");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [activeSearchQuery, setActiveSearchQuery] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);

//   const dispatch = useAppDispatch();
//   const { data, loading, error, totalItems, limit, isDownloading } = useAppSelector(
//     (state) => state.attendanceReport
//   );

//   const navigate = useNavigate();

//   useEffect(() => {
//     dispatch(fetchAttendanceSummary({ page: currentPage, limit, search: activeSearchQuery }));
//   }, [dispatch, currentPage, limit, activeSearchQuery]);


//   useEffect(() => {
//     if (error) {
//       toast.error(error);
//     }
//   }, [error]);

//   const handleSearchSubmit = (event: React.FormEvent) => {
//     event.preventDefault();
//     setActiveSearchQuery(searchQuery);
//     setCurrentPage(1);
//   };

//   const handleClearSearch = () => {
//     setSearchQuery("");
//     setActiveSearchQuery("");
//     setCurrentPage(1);
//   };

//   const handleDownload = (format: "csv" | "xlsx") => {
//     if (isDownloading) return;
//     toast.info(`Your ${format.toUpperCase()} download will begin shortly...`);
//     dispatch(downloadAttendanceSummary({ format, search: activeSearchQuery }));
//   };

//   const handleBackFromTemplate = (shouldRefetch = false) => {
//     setView("report");
//     if (shouldRefetch) {
//       dispatch(fetchAttendanceSummary({ page: currentPage, limit, search: activeSearchQuery }));
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

//   const isDataAvailable = data && data.length > 0;

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

//             <button onClick={() => handleDownload("csv")} disabled={isDownloading || !isDataAvailable} className="bg-purple-100 text-[#741CDD] font-semibold py-2 px-4 rounded-full hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed">
//               {isDownloading ? "DOWNLOADING..." : "DOWNLOAD CSV"}
//             </button>
//             <button onClick={() => handleDownload("xlsx")} disabled={isDownloading || !isDataAvailable} className="bg-purple-100 text-[#741CDD] font-semibold py-2 px-4 rounded-full hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed">
//               {isDownloading ? "DOWNLOADING..." : "DOWNLOAD XLSX"}
//             </button>
//             <button onClick={() => navigate('/reports/all')} className="bg-purple-100 text-[#741CDD] font-semibold py-2 px-4 rounded-full hover:bg-purple-200">SCHEDULE REPORT</button>
//           </div>
//         </div>
//       </div>

//       <div className="bg-white p-6 rounded-lg shadow-sm">
//         <div className="flex items-center justify-end mb-4">
//           <form
//             className="flex items-center gap-2"
//             onSubmit={handleSearchSubmit}
//           >
//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="Search by name, ID, etc..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:border-purple-500 pr-8"
//               />
//               {searchQuery && (
//                 <button
//                   type="button"
//                   onClick={handleClearSearch}
//                   className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
//                   aria-label="Clear search"
//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-5 w-5"
//                     viewBox="0 0 20 20"
//                     fill="currentColor"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                 </button>
//               )}
//             </div>
//             <button
//               type="submit"
//               className="bg-purple-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
//               disabled={loading === 'pending'}
//             >
//               Search
//             </button>
//           </form>
//         </div>
//         <div className="overflow-x-auto">
//           {loading === "pending" && <p className="text-center p-4">Loading report data...</p>}
//           {loading === "succeeded" && data.length > 0 ? (
//             <>
//               <Table
//                 data={data}
//                 columns={columns}
//                 showSearch={false}
//                 showItemsPerPage={false}
//                 showPagination={false}
//                 className="w-full min-w-[1200px]"
//               />

//               <ServerPagination
//                 currentPage={currentPage}
//                 totalItems={totalItems}
//                 itemsPerPage={limit}
//                 onPageChange={(page) => setCurrentPage(page)}
//                 loading={loading === 'pending'}
//               />
//             </>
//           ) : loading === "succeeded" && data.length === 0 ? (
//             <p className="text-center p-4 text-gray-500">No data found for the applied filters.</p>
//           ) : null}
//           {loading === "failed" && <p className="text-center text-red-500 p-4">Failed to load report data. Please try again later.</p>}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AttendanceReport;

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Table, { type Column } from "../../../../components/common/Table";
import AttendanceSummaryReportTemplate from "./component/AttendanceSummaryReportTemplate";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { fetchAttendanceSummary, downloadAttendanceSummary, clearErrors, type AttendanceRecord } from "../../../../store/slice/attendanceReportSlice";


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


const ServerPagination = ({ currentPage, totalItems, itemsPerPage, onPageChange, loading }: { currentPage: number, totalItems: number, itemsPerPage: number, onPageChange: (page: number) => void, loading: boolean }) => {
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
          disabled={currentPage === 1 || loading}
          className="px-3 py-1 border rounded bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span className="px-3 py-1">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
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
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearchQuery, setActiveSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const dispatch = useAppDispatch();
  const { data, loading, error, totalItems, limit, downloadingFormat } = useAppSelector(
    (state) => state.attendanceReport
  );

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchAttendanceSummary({ page: currentPage, limit, search: activeSearchQuery }));
  }, [dispatch, currentPage, limit, activeSearchQuery]);


  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [error, dispatch]);

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setActiveSearchQuery(searchQuery);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setActiveSearchQuery("");
    setCurrentPage(1);
  };

  const handleDownload = (format: "csv" | "xlsx") => {
    if (downloadingFormat) return;
    toast.info(`Your ${format.toUpperCase()} download will begin shortly...`);
    dispatch(downloadAttendanceSummary({ format, search: activeSearchQuery }));
  };

  const handleBackFromTemplate = (shouldRefetch = false) => {
    setView("report");
    if (shouldRefetch) {
      dispatch(fetchAttendanceSummary({ page: currentPage, limit, search: activeSearchQuery }));
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

  const isDataAvailable = data && data.length > 0;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Attendance Summary Report</h1>
        <div className="flex flex-col items-end space-y-3">
          {/* <p className="text-sm text-gray-500">
            <Link to="/reports/all">Reports</Link> / <Link to="/reports/scheduled">Scheduled Reports</Link> / Attendance Report
          </p> */}
          <div className="flex items-center space-x-2 flex-wrap gap-y-2">
            <button onClick={() => setView("template")} className="bg-purple-100 text-[#741CDD] font-semibold py-2 px-4 rounded-full hover:bg-purple-200">EDIT TEMPLATE</button>

            <button onClick={() => handleDownload("csv")} disabled={!!downloadingFormat || !isDataAvailable} className="bg-purple-100 text-[#741CDD] font-semibold py-2 px-4 rounded-full hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed">
              {downloadingFormat === 'csv' ? "DOWNLOADING..." : "DOWNLOAD CSV"}
            </button>
            <button onClick={() => handleDownload("xlsx")} disabled={!!downloadingFormat || !isDataAvailable} className="bg-purple-100 text-[#741CDD] font-semibold py-2 px-4 rounded-full hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed">
              {downloadingFormat === 'xlsx' ? "DOWNLOADING..." : "DOWNLOAD XLSX"}
            </button>
            <button onClick={() => navigate('/reports/all')} className="bg-purple-100 text-[#741CDD] font-semibold py-2 px-4 rounded-full hover:bg-purple-200">SCHEDULE REPORT</button>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-end mb-4">
          <form
            className="flex items-center gap-2"
            onSubmit={handleSearchSubmit}
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, ID, etc..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:border-purple-500 pr-8"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  aria-label="Clear search"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
            </div>
            <button
              type="submit"
              className="bg-purple-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading === 'pending'}
            >
              Search
            </button>
          </form>
        </div>
        <div className="overflow-x-auto">
          {loading === "pending" && <p className="text-center p-4">Loading report data...</p>}
          {loading === "succeeded" && data.length > 0 ? (
            <>
              <Table
                data={data}
                columns={columns}
                showSearch={false}
                showItemsPerPage={false}
                showPagination={false}
                className="w-full min-w-[1200px]"
              />

              <ServerPagination
                currentPage={currentPage}
                totalItems={totalItems}
                itemsPerPage={limit}
                onPageChange={(page) => setCurrentPage(page)}
                loading={loading === 'pending'}
              />
            </>
          ) : loading === "succeeded" && data.length === 0 ? (
            <p className="text-center p-4 text-gray-500">No data found for the applied filters.</p>
          ) : null}
          {loading === "failed" && <p className="text-center text-red-500 p-4">Failed to load report data. Please try again later.</p>}
        </div>
      </div>
    </div>
  );
};

export default AttendanceReport;