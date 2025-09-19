// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { toast } from "react-toastify";
// import Table, { type Column } from "../../../../../components/common/Table";
// import PayslipComponentReportTemplate from "./component/PayslipComponentReportTemplate";
// import { useAppDispatch, useAppSelector } from "../../../../../store/hooks";
// import {
//   fetchPayslipComponentReports,
//   deletePayslipReport,
//   downloadPayslipReport,
// } from "../../../../../store/slice/payslipReportSlice";

// interface PayslipComponent {
//   name: string;
//   emp_id: string;
//   status: "Active" | "Inactive";
//   phoneNum: string;
//   designation: string;
//   department: string;
//   location: string;
//   componentName: string;
//   code: string;
//   type: string;
//   amount: string | number;
// }

// const formatCurrency = (value: string | number) =>
//   `₹ ${Number(value).toLocaleString("en-IN", {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   })}`;

// const renderStatus = (status: "Active" | "Inactive") => {
//   const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full";
//   const activeClasses = "bg-green-100 text-green-800";
//   const inactiveClasses = "bg-yellow-100 text-yellow-800";
//   return (
//     <span
//       className={`${baseClasses} ${
//         status === "Active" ? activeClasses : inactiveClasses
//       }`}
//     >
//       {status}
//     </span>
//   );
// };

// const PayslipComponentReport: React.FC = () => {
//   const [view, setView] = useState<"report" | "template">("report");
//   const [searchQuery, setSearchQuery] = useState("");
//   const dispatch = useAppDispatch();
//   const { components, pagination, loading, error, reportId, templateId } =
//     useAppSelector((state) => state.payslipReport);

//   // Initial fetch
//   useEffect(() => {
//     dispatch(fetchPayslipComponentReports({ page: 1, limit: 10 }));
//   }, [dispatch]);

//   useEffect(() => {
//     if (error) {
//       toast.error(error);
//     }
//   }, [error]);

//   // ✅ Pagination with search preserved
//   const handlePageChange = (page: number) => {
//     if (page > 0 && page <= (pagination?.totalPages || 0)) {
//       dispatch(
//         fetchPayslipComponentReports({
//           page,
//           limit: pagination?.limit,
//           filter: searchQuery,
//         })
//       );
//     }
//   };

//   // ✅ Built-in table search
//   const handleSearch = (query: string) => {
//     setSearchQuery(query);
//     dispatch(fetchPayslipComponentReports({ page: 1, limit: 10, filter: query }));
//   };

//   const handleDelete = () => {
//     if (reportId) {
//       if (window.confirm("Are you sure you want to delete this report?")) {
//         dispatch(deletePayslipReport(reportId));
//       }
//     } else {
//       toast.warn("No report selected or available for deletion.");
//     }
//   };

//   const handleDownload = (format: "csv" | "excel") => {
//     dispatch(downloadPayslipReport({ format }));
//   };

//   const columns: Column<PayslipComponent>[] = [
//     { key: "name", header: "Name" },
//     { key: "emp_id", header: "Employee ID" },
//     { key: "status", header: "Status", render: (row) => renderStatus(row.status) },
//     { key: "phoneNum", header: "Phone Number" },
//     { key: "designation", header: "Designation" },
//     { key: "department", header: "Department" },
//     { key: "location", header: "Location" },
//     { key: "componentName", header: "Component Name" },
//     { key: "code", header: "Code" },
//     { key: "type", header: "Type" },
//     { key: "amount", header: "Amount", render: (row) => formatCurrency(row.amount) },
//   ];

//   if (view === "template") {
//     return (
//       <PayslipComponentReportTemplate
//         templateId={templateId}
//         onBack={() => setView("report")}
//       />
//     );
//   }

//   return (
//     <div className="p-8 bg-gray-50 min-h-screen">
//       {/* --- HEADER --- */}
//       <div className="flex justify-between items-start mb-6">
//         <h1 className="text-3xl font-bold text-gray-800">Payslip Component Report</h1>
//         <div className="flex flex-col items-end space-y-3">
//           <p className="text-sm text-gray-500">
//             <Link to="/reports/all">Reports</Link> /{" "}
//             <Link to="/reports/finance">Finance Reports</Link> / Payslip Component Report
//           </p>
//           <div className="flex items-center space-x-3">
//             <button
//               onClick={() => {
//                 if (templateId) setView("template");
//                 else toast.warn("Template ID not available.");
//               }}
//               className="bg-purple-100 text-[#741CDD] font-semibold py-2 px-4 rounded-full hover:bg-purple-200 transition-colors"
//               disabled={!templateId || loading}
//             >
//               EDIT TEMPLATE
//             </button>
//             <button
//               onClick={() => handleDownload("csv")}
//               className="bg-blue-100 text-blue-800 font-semibold py-2 px-4 rounded-full hover:bg-blue-200 transition-colors"
//               disabled={loading}
//             >
//               DOWNLOAD CSV
//             </button>
//             <button
//               onClick={() => handleDownload("excel")}
//               className="bg-green-100 text-green-800 font-semibold py-2 px-4 rounded-full hover:bg-green-200 transition-colors"
//               disabled={loading}
//             >
//               DOWNLOAD EXCEL
//             </button>
//             <button
//               onClick={handleDelete}
//               className="bg-red-500 text-white font-semibold py-2 px-4 rounded-full hover:bg-red-600 transition-colors"
//               disabled={!reportId || loading}
//             >
//               DELETE
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* --- TABLE WITH BUILT-IN SEARCH + PAGINATION --- */}
//       <div className="bg-white p-6 rounded-lg shadow-sm">
//         <div className="overflow-x-auto">
//           {loading && components.length === 0 && (
//             <p className="text-center p-4">Loading reports...</p>
//           )}
//           {!loading && error && (
//             <p className="text-center text-red-500 p-4">{error}</p>
//           )}
//           {!loading && !error && (
//             <Table
//               data={components}
//               columns={columns}
//               showSearch={true}
//               searchPlaceholder="Search by name, ID, etc..."
//               onSearch={handleSearch}
//               showPagination={false} // disable table’s pagination
//               className="w-[1350px]"
//             />
//           )}
//         </div>

//         {/* --- SERVER-SIDE PAGINATION CONTROLS --- */}
//         {pagination && pagination.totalItems > 0 && (
//           <div className="pagination flex justify-between items-center mt-4 text-sm text-gray-700">
//             <span>
//               Showing {(pagination.currentPage - 1) * pagination.limit + 1} to{" "}
//               {Math.min(pagination.currentPage * pagination.limit, pagination.totalItems)} of{" "}
//               {pagination.totalItems} items
//             </span>
//             <div className="flex space-x-1">
//               <button
//                 onClick={() => handlePageChange(pagination.currentPage - 1)}
//                 disabled={pagination.currentPage === 1 || loading}
//                 className="px-3 py-1 border rounded bg-gray-50 hover:bg-gray-100 disabled:opacity-50"
//               >
//                 Previous
//               </button>
//               <span className="px-3 py-1">
//                 Page {pagination.currentPage} of {pagination.totalPages}
//               </span>
//               <button
//                 onClick={() => handlePageChange(pagination.currentPage + 1)}
//                 disabled={pagination.currentPage === pagination.totalPages || loading}
//                 className="px-3 py-1 border rounded bg-gray-50 hover:bg-gray-100 disabled:opacity-50"
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PayslipComponentReport;

// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { toast } from "react-toastify";
// import Table, { type Column } from "../../../../../components/common/Table";
// import PayslipComponentReportTemplate from "./component/PayslipComponentReportTemplate";
// import { useAppDispatch, useAppSelector } from "../../../../../store/hooks";
// import {
//   fetchPayslipComponentReports,
//   deletePayslipReport,
//   downloadPayslipReport,
// } from "../../../../../store/slice/payslipReportSlice";

// interface PayslipComponent {
//   name: string;
//   emp_id: string;
//   status: "Active" | "Inactive";
//   phoneNum: string;
//   designation: string;
//   department: string;
//   location: string;
//   componentName: string;
//   code: string;
//   type: string;
//   amount: string | number;
// }

// const formatCurrency = (value: string | number) =>
//   `₹ ${Number(value).toLocaleString("en-IN", {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   })}`;

// const renderStatus = (status: "Active" | "Inactive") => {
//   const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full";
//   const activeClasses = "bg-green-100 text-green-800";
//   const inactiveClasses = "bg-yellow-100 text-yellow-800";
//   return (
//     <span
//       className={`${baseClasses} ${
//         status === "Active" ? activeClasses : inactiveClasses
//       }`}
//     >
//       {status}
//     </span>
//   );
// };

// const PayslipComponentReport: React.FC = () => {
//   const [view, setView] = useState<"report" | "template">("report");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [activeSearchQuery, setActiveSearchQuery] = useState("");
//   const dispatch = useAppDispatch();
//   const { components, pagination, loading, error, reportId, templateId } =
//     useAppSelector((state) => state.payslipReport);

//   // Initial fetch and fetch on search change
//   useEffect(() => {
//     dispatch(
//       fetchPayslipComponentReports({
//         page: 1,
//         limit: 10,
//         filter: activeSearchQuery,
//       })
//     );
//   }, [dispatch, activeSearchQuery]);

//   useEffect(() => {
//     if (error) {
//       toast.error(error);
//     }
//   }, [error]);

//   // Handle page change while preserving the active search query
//   const handlePageChange = (page: number) => {
//     if (page > 0 && page <= (pagination?.totalPages || 0)) {
//       dispatch(
//         fetchPayslipComponentReports({
//           page,
//           limit: pagination?.limit,
//           filter: activeSearchQuery,
//         })
//       );
//     }
//   };

//   // New handler for submitting the search form
//   const handleSearchSubmit = (event: React.FormEvent) => {
//     event.preventDefault();
//     setActiveSearchQuery(searchQuery);
//   };

//   // New handler to clear the search
//   const handleClearSearch = () => {
//     setSearchQuery("");
//     setActiveSearchQuery("");
//   };

//   const handleDelete = () => {
//     if (reportId) {
//       if (window.confirm("Are you sure you want to delete this report?")) {
//         dispatch(deletePayslipReport(reportId));
//       }
//     } else {
//       toast.warn("No report selected or available for deletion.");
//     }
//   };

//   const handleDownload = (format: "csv" | "excel") => {
//     dispatch(downloadPayslipReport({ format }));
//   };

//   const columns: Column<PayslipComponent>[] = [
//     { key: "name", header: "Name" },
//     { key: "emp_id", header: "Employee ID" },
//     { key: "status", header: "Status", render: (row) => renderStatus(row.status) },
//     { key: "phoneNum", header: "Phone Number" },
//     { key: "designation", header: "Designation" },
//     { key: "department", header: "Department" },
//     { key: "location", header: "Location" },
//     { key: "componentName", header: "Component Name" },
//     { key: "code", header: "Code" },
//     { key: "type", header: "Type" },
//     { key: "amount", header: "Amount", render: (row) => formatCurrency(row.amount) },
//   ];

//   if (view === "template") {
//     return (
//       <PayslipComponentReportTemplate
//         templateId={templateId}
//         onBack={() => setView("report")}
//       />
//     );
//   }

//   return (
//     <div className="p-8 bg-gray-50 min-h-screen">
//       {/* --- HEADER --- */}
//       <div className="flex justify-between items-start mb-6">
//         <h1 className="text-3xl font-bold text-gray-800">Payslip Component Report</h1>
//         <div className="flex flex-col items-end space-y-3">
//           <p className="text-sm text-gray-500">
//             <Link to="/reports/all">Reports</Link> /{" "}
//             <Link to="/reports/finance">Finance Reports</Link> / Payslip Component Report
//           </p>
//           <div className="flex items-center space-x-3">
//             <button
//               onClick={() => {
//                 if (templateId) setView("template");
//                 else toast.warn("Template ID not available.");
//               }}
//               className="bg-purple-100 text-[#741CDD] font-semibold py-2 px-4 rounded-full hover:bg-purple-200 transition-colors"
//               disabled={!templateId || loading}
//             >
//               EDIT TEMPLATE
//             </button>
//             <button
//               onClick={() => handleDownload("csv")}
//               className="bg-blue-100 text-blue-800 font-semibold py-2 px-4 rounded-full hover:bg-blue-200 transition-colors"
//               disabled={loading}
//             >
//               DOWNLOAD CSV
//             </button>
//             <button
//               onClick={() => handleDownload("excel")}
//               className="bg-green-100 text-green-800 font-semibold py-2 px-4 rounded-full hover:bg-green-200 transition-colors"
//               disabled={loading}
//             >
//               DOWNLOAD EXCEL
//             </button>
//             <button
//               onClick={handleDelete}
//               className="bg-red-500 text-white font-semibold py-2 px-4 rounded-full hover:bg-red-600 transition-colors"
//               disabled={!reportId || loading}
//             >
//               DELETE
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* --- TABLE WITH NEW SEARCH AND PAGINATION CONTROLS --- */}
//       <div className="bg-white p-6 rounded-lg shadow-sm">
//         {/* New Search and Filter controls */}
//         <div className="flex items-center mb-4">
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
//               className="bg-purple-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-purple-700"
//             >
//               Search
//             </button>
//           </form>
//         </div>

//         <div className="overflow-x-auto">
//           {loading && components.length === 0 && (
//             <p className="text-center p-4">Loading reports...</p>
//           )}
//           {!loading && error && (
//             <p className="text-center text-red-500 p-4">{error}</p>
//           )}
//           {!loading && !error && (
//             <Table
//               data={components}
//               columns={columns}
//               showSearch={false}
//               onSearch={() => {}}
//               showPagination={false}
//               className="w-[1350px]"
//             />
//           )}
//         </div>

//         {/* --- SERVER-SIDE PAGINATION CONTROLS --- */}
//         {pagination && pagination.totalItems > 0 && (
//           <div className="pagination flex justify-between items-center mt-4 text-sm text-gray-700">
//             <span>
//               Showing {(pagination.currentPage - 1) * pagination.limit + 1} to{" "}
//               {Math.min(pagination.currentPage * pagination.limit, pagination.totalItems)} of{" "}
//               {pagination.totalItems} items
//             </span>
//             <div className="flex space-x-1">
//               <button
//                 onClick={() => handlePageChange(pagination.currentPage - 1)}
//                 disabled={pagination.currentPage === 1 || loading}
//                 className="px-3 py-1 border rounded bg-gray-50 hover:bg-gray-100 disabled:opacity-50"
//               >
//                 Previous
//               </button>
//               <span className="px-3 py-1">
//                 Page {pagination.currentPage} of {pagination.totalPages}
//               </span>
//               <button
//                 onClick={() => handlePageChange(pagination.currentPage + 1)}
//                 disabled={pagination.currentPage === pagination.totalPages || loading}
//                 className="px-3 py-1 border rounded bg-gray-50 hover:bg-gray-100 disabled:opacity-50"
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PayslipComponentReport;

// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { toast } from "react-toastify";
// import Table, { type Column } from "../../../../../components/common/Table";
// import PayslipComponentReportTemplate from "./component/PayslipComponentReportTemplate";
// import { useAppDispatch, useAppSelector } from "../../../../../store/hooks";
// import {
//   fetchPayslipComponentReports,
//   deletePayslipReport,
//   downloadPayslipReport,
// } from "../../../../../store/slice/payslipReportSlice";

// interface PayslipComponent {
//   name: string;
//   emp_id: string;
//   status: "Active" | "Inactive";
//   phoneNum: string;
//   designation: string;
//   department: string;
//   location: string;
//   componentName: string;
//   code: string;
//   type: string;
//   amount: string | number;
// }

// const formatCurrency = (value: string | number) =>
//   `₹ ${Number(value).toLocaleString("en-IN", {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   })}`;

// const renderStatus = (status: "Active" | "Inactive") => {
//   const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full";
//   const activeClasses = "bg-green-100 text-green-800";
//   const inactiveClasses = "bg-yellow-100 text-yellow-800";
//   return (
//     <span
//       className={`${baseClasses} ${
//         status === "Active" ? activeClasses : inactiveClasses
//       }`}
//     >
//       {status}
//     </span>
//   );
// };

// const PayslipComponentReport: React.FC = () => {
//   const [view, setView] = useState<"report" | "template">("report");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [activeSearchQuery, setActiveSearchQuery] = useState("");
//   const dispatch = useAppDispatch();
//   const { components, pagination, loading, error, reportId, templateId } =
//     useAppSelector((state) => state.payslipReport);

//   // Initial fetch and fetch on search change
//   useEffect(() => {
//     dispatch(
//       fetchPayslipComponentReports({
//         page: 1,
//         limit: 10,
//         filter: activeSearchQuery,
//       })
//     );
//   }, [dispatch, activeSearchQuery]);

//   useEffect(() => {
//     if (error) {
//       toast.error(error);
//     }
//   }, [error]);

//   // Handle page change while preserving the active search query
//   const handlePageChange = (page: number) => {
//     if (page > 0 && page <= (pagination?.totalPages || 0)) {
//       dispatch(
//         fetchPayslipComponentReports({
//           page,
//           limit: pagination?.limit,
//           filter: activeSearchQuery,
//         })
//       );
//     }
//   };

//   // New handler for submitting the search form
//   const handleSearchSubmit = (event: React.FormEvent) => {
//     event.preventDefault();
//     setActiveSearchQuery(searchQuery);
//   };

//   // New handler to clear the search
//   const handleClearSearch = () => {
//     setSearchQuery("");
//     setActiveSearchQuery("");
//   };

//   const handleDelete = () => {
//     if (reportId) {
//       if (window.confirm("Are you sure you want to delete this report?")) {
//         dispatch(deletePayslipReport(reportId));
//       }
//     } else {
//       toast.warn("No report selected or available for deletion.");
//     }
//   };

//   const handleDownload = (format: "csv" | "excel") => {
//     dispatch(downloadPayslipReport({ format }));
//   };

//   const columns: Column<PayslipComponent>[] = [
//     { key: "name", header: "Name" },
//     { key: "emp_id", header: "Employee ID" },
//     { key: "status", header: "Status", render: (row) => renderStatus(row.status) },
//     { key: "phoneNum", header: "Phone Number" },
//     { key: "designation", header: "Designation" },
//     { key: "department", header: "Department" },
//     { key: "location", header: "Location" },
//     { key: "componentName", header: "Component Name" },
//     { key: "code", header: "Code" },
//     { key: "type", header: "Type" },
//     { key: "amount", header: "Amount", render: (row) => formatCurrency(row.amount) },
//   ];

//   if (view === "template") {
//     return (
//       <PayslipComponentReportTemplate
//         templateId={templateId}
//         onBack={() => setView("report")}
//       />
//     );
//   }

//   return (
//     <div className="p-8 bg-gray-50 min-h-screen">
//       {/* --- HEADER --- */}
//       <div className="flex justify-between items-start mb-6">
//         <h1 className="text-3xl font-bold text-gray-800">Payslip Component Report</h1>
//         <div className="flex flex-col items-end space-y-3">
//           <p className="text-sm text-gray-500">
//             <Link to="/reports/all">Reports</Link> /{" "}
//             <Link to="/reports/finance">Finance Reports</Link> / Payslip Component Report
//           </p>
//           <div className="flex items-center space-x-3">
//             <button
//               onClick={() => {
//                 if (templateId) setView("template");
//                 else toast.warn("Template ID not available.");
//               }}
//               className="bg-purple-100 text-[#741CDD] font-semibold py-2 px-4 rounded-full hover:bg-purple-200 transition-colors"
//               disabled={!templateId || loading}
//             >
//               EDIT TEMPLATE
//             </button>
//             <button
//               onClick={() => handleDownload("csv")}
//               className="bg-blue-100 text-blue-800 font-semibold py-2 px-4 rounded-full hover:bg-blue-200 transition-colors"
//               disabled={loading}
//             >
//               DOWNLOAD CSV
//             </button>
//             <button
//               onClick={() => handleDownload("excel")}
//               className="bg-green-100 text-green-800 font-semibold py-2 px-4 rounded-full hover:bg-green-200 transition-colors"
//               disabled={loading}
//             >
//               DOWNLOAD EXCEL
//             </button>
//             <button
//               onClick={handleDelete}
//               className="bg-red-500 text-white font-semibold py-2 px-4 rounded-full hover:bg-red-600 transition-colors"
//               disabled={!reportId || loading}
//             >
//               DELETE
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* --- TABLE WITH NEW SEARCH AND PAGINATION CONTROLS --- */}
//       <div className="bg-white p-6 rounded-lg shadow-sm">
//         {/* New Search and Filter controls */}
//         <div className="flex items-center mb-4">
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
//               className="bg-purple-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-purple-700"
//             >
//               Search
//             </button>
//           </form>
//         </div>

//         <div className="overflow-x-auto">
//           {loading && components.length === 0 && (
//             <p className="text-center p-4">Loading reports...</p>
//           )}
//           {!loading && error && (
//             <p className="text-center text-red-500 p-4">{error}</p>
//           )}
//           {!loading && !error && (
//             <Table
//               data={components}
//               columns={columns}
//               showSearch={false}
//               showItemsPerPage={false} // Add this prop to hide the dropdown
//               showPagination={false}
//               className="w-[1350px]"
//             />
//           )}
//         </div>

//         {/* --- SERVER-SIDE PAGINATION CONTROLS --- */}
//         {pagination && pagination.totalItems > 0 && (
//           <div className="pagination flex justify-between items-center mt-4 text-sm text-gray-700">
//             <span>
//               Showing {(pagination.currentPage - 1) * pagination.limit + 1} to{" "}
//               {Math.min(pagination.currentPage * pagination.limit, pagination.totalItems)} of{" "}
//               {pagination.totalItems} items
//             </span>
//             <div className="flex space-x-1">
//               <button
//                 onClick={() => handlePageChange(pagination.currentPage - 1)}
//                 disabled={pagination.currentPage === 1 || loading}
//                 className="px-3 py-1 border rounded bg-gray-50 hover:bg-gray-100 disabled:opacity-50"
//               >
//                 Previous
//               </button>
//               <span className="px-3 py-1">
//                 Page {pagination.currentPage} of {pagination.totalPages}
//               </span>
//               <button
//                 onClick={() => handlePageChange(pagination.currentPage + 1)}
//                 disabled={pagination.currentPage === pagination.totalPages || loading}
//                 className="px-3 py-1 border rounded bg-gray-50 hover:bg-gray-100 disabled:opacity-50"
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PayslipComponentReport;

// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { toast } from "react-toastify";
// import Table, { type Column } from "../../../../../components/common/Table";
// import PayslipComponentReportTemplate from "./component/PayslipComponentReportTemplate";
// import { useAppDispatch, useAppSelector } from "../../../../../store/hooks";
// import {
//   fetchPayslipComponentReports,
//   deletePayslipReport,
//   downloadPayslipReport,
// } from "../../../../../store/slice/payslipReportSlice";

// interface PayslipComponent {
//   name: string;
//   emp_id: string;
//   status: "Active" | "Inactive";
//   phoneNum: string;
//   designation: string;
//   department: string;
//   location: string;
//   componentName: string;
//   code: string;
//   type: string;
//   amount: string | number;
// }

// const formatCurrency = (value: string | number) =>
//   `₹ ${Number(value).toLocaleString("en-IN", {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   })}`;

// const renderStatus = (status: "Active" | "Inactive") => {
//   const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full";
//   const activeClasses = "bg-green-100 text-green-800";
//   const inactiveClasses = "bg-yellow-100 text-yellow-800";
//   return (
//     <span
//       className={`${baseClasses} ${
//         status === "Active" ? activeClasses : inactiveClasses
//       }`}
//     >
//       {status}
//     </span>
//   );
// };

// const PayslipComponentReport: React.FC = () => {
//   const [view, setView] = useState<"report" | "template">("report");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [activeSearchQuery, setActiveSearchQuery] = useState("");
//   const dispatch = useAppDispatch();
//   const { components, pagination, loading, error, reportId, templateId } =
//     useAppSelector((state) => state.payslipReport);

//   // Initial fetch and fetch on search change
//   useEffect(() => {
//     dispatch(
//       fetchPayslipComponentReports({
//         page: 1,
//         limit: 10,
//         filter: activeSearchQuery,
//       })
//     );
//   }, [dispatch, activeSearchQuery]);

//   useEffect(() => {
//     if (error) {
//       toast.error(error);
//     }
//   }, [error]);

//   // Handle page change while preserving the active search query
//   const handlePageChange = (page: number) => {
//     if (page > 0 && page <= (pagination?.totalPages || 0)) {
//       dispatch(
//         fetchPayslipComponentReports({
//           page,
//           limit: pagination?.limit,
//           filter: activeSearchQuery,
//         })
//       );
//     }
//   };

//   // New handler for submitting the search form
//   const handleSearchSubmit = (event: React.FormEvent) => {
//     event.preventDefault();
//     setActiveSearchQuery(searchQuery);
//   };

//   // New handler to clear the search
//   const handleClearSearch = () => {
//     setSearchQuery("");
//     setActiveSearchQuery("");
//   };

//   const handleDelete = () => {
//     if (reportId) {
//       if (window.confirm("Are you sure you want to delete this report?")) {
//         dispatch(deletePayslipReport(reportId));
//       }
//     } else {
//       toast.warn("No report selected or available for deletion.");
//     }
//   };

//   const handleDownload = (format: "csv" | "excel") => {
//     dispatch(downloadPayslipReport({ format }));
//   };

//   const columns: Column<PayslipComponent>[] = [
//     { key: "name", header: "Name" },
//     { key: "emp_id", header: "Employee ID" },
//     { key: "status", header: "Status", render: (row) => renderStatus(row.status) },
//     { key: "phoneNum", header: "Phone Number" },
//     { key: "designation", header: "Designation" },
//     { key: "department", header: "Department" },
//     { key: "location", header: "Location" },
//     { key: "componentName", header: "Component Name" },
//     { key: "code", header: "Code" },
//     { key: "type", header: "Type" },
//     { key: "amount", header: "Amount", render: (row) => formatCurrency(row.amount) },
//   ];

//   if (view === "template") {
//     return (
//       <PayslipComponentReportTemplate
//         templateId={templateId}
//         onBack={() => setView("report")}
//       />
//     );
//   }

//   return (
//     <div className="p-8 bg-gray-50 min-h-screen">
//       {/* --- HEADER --- */}
//       <div className="flex justify-between items-start mb-6">
//         <h1 className="text-3xl font-bold text-gray-800">Payslip Component Report</h1>
//         <div className="flex flex-col items-end space-y-3">
//           <p className="text-sm text-gray-500">
//             <Link to="/reports/all">Reports</Link> /{" "}
//             <Link to="/reports/finance">Finance Reports</Link> / Payslip Component Report
//           </p>
//           <div className="flex items-center space-x-3">
//             <button
//               onClick={() => {
//                 if (templateId) setView("template");
//                 else toast.warn("Template ID not available.");
//               }}
//               className="bg-purple-100 text-[#741CDD] font-semibold py-2 px-4 rounded-full hover:bg-purple-200 transition-colors"
//               disabled={!templateId || loading}
//             >
//               EDIT TEMPLATE
//             </button>
//             <button
//               onClick={() => handleDownload("csv")}
//               className="bg-blue-100 text-blue-800 font-semibold py-2 px-4 rounded-full hover:bg-blue-200 transition-colors"
//               disabled={loading}
//             >
//               DOWNLOAD CSV
//             </button>
//             <button
//               onClick={() => handleDownload("excel")}
//               className="bg-green-100 text-green-800 font-semibold py-2 px-4 rounded-full hover:bg-green-200 transition-colors"
//               disabled={loading}
//             >
//               DOWNLOAD EXCEL
//             </button>
//             <button
//               onClick={handleDelete}
//               className="bg-red-500 text-white font-semibold py-2 px-4 rounded-full hover:bg-red-600 transition-colors"
//               disabled={!reportId || loading}
//             >
//               DELETE
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* --- TABLE WITH NEW SEARCH AND PAGINATION CONTROLS --- */}
//       <div className="bg-white p-6 rounded-lg shadow-sm">
//         {/* New Search and Filter controls */}
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
//               className="bg-purple-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-purple-700"
//             >
//               Search
//             </button>
//           </form>
//         </div>

//         <div className="overflow-x-auto">
//           {loading && components.length === 0 && (
//             <p className="text-center p-4">Loading reports...</p>
//           )}
//           {!loading && error && (
//             <p className="text-center text-red-500 p-4">{error}</p>
//           )}
//           {!loading && !error && (
//             <Table
//               data={components}
//               columns={columns}
//               showSearch={false}
//               showItemsPerPage={false}
//               showPagination={false}
//               className="w-[1350px]"
//             />
//           )}
//         </div>

//         {/* --- SERVER-SIDE PAGINATION CONTROLS --- */}
//         {pagination && pagination.totalItems > 0 && (
//           <div className="pagination flex justify-between items-center mt-4 text-sm text-gray-700">
//             <span>
//               Showing {(pagination.currentPage - 1) * pagination.limit + 1} to{" "}
//               {Math.min(pagination.currentPage * pagination.limit, pagination.totalItems)} of{" "}
//               {pagination.totalItems} items
//             </span>
//             <div className="flex space-x-1">
//               <button
//                 onClick={() => handlePageChange(pagination.currentPage - 1)}
//                 disabled={pagination.currentPage === 1 || loading}
//                 className="px-3 py-1 border rounded bg-gray-50 hover:bg-gray-100 disabled:opacity-50"
//               >
//                 Previous
//               </button>
//               <span className="px-3 py-1">
//                 Page {pagination.currentPage} of {pagination.totalPages}
//               </span>
//               <button
//                 onClick={() => handlePageChange(pagination.currentPage + 1)}
//                 disabled={pagination.currentPage === pagination.totalPages || loading}
//                 className="px-3 py-1 border rounded bg-gray-50 hover:bg-gray-100 disabled:opacity-50"
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PayslipComponentReport;

// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { toast } from "react-toastify";
// import Table, { type Column } from "../../../../../components/common/Table";
// import PayslipComponentReportTemplate from "./component/PayslipComponentReportTemplate";
// import { useAppDispatch, useAppSelector } from "../../../../../store/hooks";
// import {
//   fetchPayslipComponentReports,
//   deletePayslipReport,
//   downloadPayslipReport,
//   clearPayslipReportError,
// } from "../../../../../store/slice/payslipReportSlice";

// interface PayslipComponent {
//   name: string;
//   emp_id: string;
//   status: "Active" | "Inactive";
//   phoneNum: string;
//   designation: string;
//   department: string;
//   location: string;
//   componentName: string;
//   code: string;
//   type: string;
//   amount: string | number;
// }

// const formatCurrency = (value: string | number) =>
//   `₹ ${Number(value).toLocaleString("en-IN", {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   })}`;

// const renderStatus = (status: "Active" | "Inactive") => {
//   const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full";
//   const activeClasses = "bg-green-100 text-green-800";
//   const inactiveClasses = "bg-yellow-100 text-yellow-800";
//   return <span className={`${baseClasses} ${status === "Active" ? activeClasses : inactiveClasses}`}>{status}</span>;
// };

// const PayslipComponentReport: React.FC = () => {
//   const [view, setView] = useState<"report" | "template">("report");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [activeSearchQuery, setActiveSearchQuery] = useState("");
//   const dispatch = useAppDispatch();
//   const { components, pagination, loading, error, reportId, templateId, isDownloading, isDeleting } =
//     useAppSelector((state) => state.payslipReport);

//   useEffect(() => {
//     dispatch(fetchPayslipComponentReports({ page: 1, limit: 10, filter: activeSearchQuery }));
//   }, [dispatch, activeSearchQuery]);

//   useEffect(() => {
//     if (error) {
//       toast.error(error);
//       dispatch(clearPayslipReportError());
//     }
//   }, [error, dispatch]);

//   const handlePageChange = (page: number) => {
//     if (page > 0 && page <= (pagination?.totalPages || 0)) {
//       dispatch(fetchPayslipComponentReports({ page, limit: pagination?.limit, filter: activeSearchQuery }));
//     }
//   };

//   const handleSearchSubmit = (event: React.FormEvent) => {
//     event.preventDefault();
//     setActiveSearchQuery(searchQuery);
//   };

//   const handleClearSearch = () => {
//     setSearchQuery("");
//     setActiveSearchQuery("");
//   };

//   const handleDelete = () => {
//     if (reportId) {
//       if (window.confirm("Are you sure you want to delete this report?")) {
//         dispatch(deletePayslipReport(reportId))
//           .unwrap()
//           .then(() => toast.success("Report deleted successfully."))
//           .catch((err) => toast.error(err as string));
//       }
//     } else {
//       toast.warn("No report selected or available for deletion.");
//     }
//   };

//   const handleDownload = (format: "csv" | "excel") => {
//     if (isDownloading) return;
//     toast.info(`Download starting for ${format.toUpperCase()} file...`);
//     dispatch(downloadPayslipReport({ format }))
//       .unwrap()
//       .then(() => toast.success("Report download started."))
//       .catch((err) => toast.error(err as string));
//   };

//   const columns: Column<PayslipComponent>[] = [
//     { key: "name", header: "Name" },
//     { key: "emp_id", header: "Employee ID" },
//     { key: "status", header: "Status", render: (row) => renderStatus(row.status) },
//     { key: "phoneNum", header: "Phone Number" },
//     { key: "designation", header: "Designation" },
//     { key: "department", header: "Department" },
//     { key: "location", header: "Location" },
//     { key: "componentName", header: "Component Name" },
//     { key: "code", header: "Code" },
//     { key: "type", header: "Type" },
//     { key: "amount", header: "Amount", render: (row) => formatCurrency(row.amount) },
//   ];

//   if (view === "template") {
//     return <PayslipComponentReportTemplate templateId={templateId} onBack={() => setView("report")} />;
//   }

//   const anyActionInProgress = loading === 'pending' || !!isDownloading || isDeleting;

//   return (
//     <div className="p-8 bg-gray-50 min-h-screen">
//       <div className="flex justify-between items-start mb-6">
//         <h1 className="text-3xl font-bold text-gray-800">Payslip Component Report</h1>
//         <div className="flex flex-col items-end space-y-3">
//           <p className="text-sm text-gray-500">
//             <Link to="/reports/all">Reports</Link> / <Link to="/reports/finance">Finance Reports</Link> / Payslip Component Report
//           </p>
//           <div className="flex items-center space-x-3">
//             <button
//               onClick={() => { if (templateId) setView("template"); else toast.warn("Template ID not available."); }}
//               className="bg-purple-100 text-[#741CDD] font-semibold py-2 px-4 rounded-full hover:bg-purple-200 transition-colors disabled:opacity-50"
//               disabled={!templateId || anyActionInProgress}
//             >EDIT TEMPLATE</button>
//             <button
//               onClick={() => handleDownload("csv")}
//               className="bg-blue-100 text-blue-800 font-semibold py-2 px-4 rounded-full hover:bg-blue-200 transition-colors disabled:opacity-50"
//               disabled={anyActionInProgress}
//             >{isDownloading === 'csv' ? "DOWNLOADING..." : "DOWNLOAD CSV"}</button>
//             <button
//               onClick={() => handleDownload("excel")}
//               className="bg-green-100 text-green-800 font-semibold py-2 px-4 rounded-full hover:bg-green-200 transition-colors disabled:opacity-50"
//               disabled={anyActionInProgress}
//             >{isDownloading === 'excel' ? "DOWNLOADING..." : "DOWNLOAD EXCEL"}</button>
//             <button
//               onClick={handleDelete}
//               className="bg-red-500 text-white font-semibold py-2 px-4 rounded-full hover:bg-red-600 transition-colors disabled:opacity-50"
//               disabled={!reportId || anyActionInProgress}
//             >{isDeleting ? "DELETING..." : "DELETE"}</button>
//           </div>
//         </div>
//       </div>
//       <div className="bg-white p-6 rounded-lg shadow-sm">
//         <div className="flex items-center justify-end mb-4">
//           <form className="flex items-center gap-2" onSubmit={handleSearchSubmit}>
//             <div className="relative">
//               <input type="text" placeholder="Search by name, ID, etc..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:border-purple-500 pr-8" />
//               {searchQuery && (<button type="button" onClick={handleClearSearch} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600" aria-label="Clear search"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg></button>)}
//             </div>
//             <button type="submit" className="bg-purple-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-purple-700" disabled={loading === 'pending'}>Search</button>
//           </form>
//         </div>
//         <div className="overflow-x-auto">
//           {loading === 'pending' && components.length === 0 && <p className="text-center p-4">Loading reports...</p>}
//           {loading === 'failed' && <p className="text-center text-red-500 p-4">Could not load reports. Please try again.</p>}
//           {loading !== 'failed' && (
//             <Table data={components} columns={columns} showSearch={false} showItemsPerPage={false} showPagination={false} className="w-[1350px]" isLoading={loading === 'pending'} />
//           )}
//         </div>
//         {pagination && pagination.totalItems > 0 && (
//           <div className="pagination flex justify-between items-center mt-4 text-sm text-gray-700">
//             <span>Showing {(pagination.currentPage - 1) * pagination.limit + 1} to {Math.min(pagination.currentPage * pagination.limit, pagination.totalItems)} of {pagination.totalItems} items</span>
//             <div className="flex space-x-1">
//               <button onClick={() => handlePageChange(pagination.currentPage - 1)} disabled={pagination.currentPage === 1 || loading === 'pending'} className="px-3 py-1 border rounded bg-gray-50 hover:bg-gray-100 disabled:opacity-50">Previous</button>
//               <span className="px-3 py-1">Page {pagination.currentPage} of {pagination.totalPages}</span>
//               <button onClick={() => handlePageChange(pagination.currentPage + 1)} disabled={pagination.currentPage === pagination.totalPages || loading === 'pending'} className="px-3 py-1 border rounded bg-gray-50 hover:bg-gray-100 disabled:opacity-50">Next</button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PayslipComponentReport;

// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { toast } from "react-toastify";
// import Table, { type Column } from "../../../../../components/common/Table";
// import PayslipComponentReportTemplate from "./component/PayslipComponentReportTemplate";
// import { useAppDispatch, useAppSelector } from "../../../../../store/hooks";
// import {
//   fetchPayslipComponentReports,
//   deletePayslipReport,
//   downloadPayslipReport,
//   clearPayslipReportError,
// } from "../../../../../store/slice/payslipReportSlice";

// interface PayslipComponent {
//   name: string;
//   emp_id: string;
//   status: "Active" | "Inactive";
//   phoneNum: string;
//   designation: string;
//   department: string;
//   location: string;
//   componentName: string;
//   code: string;
//   type: string;
//   amount: string | number;
// }

// const formatCurrency = (value: string | number) =>
//   `₹ ${Number(value).toLocaleString("en-IN", {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   })}`;

// const renderStatus = (status: "Active" | "Inactive") => {
//   const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full";
//   const activeClasses = "bg-green-100 text-green-800";
//   const inactiveClasses = "bg-yellow-100 text-yellow-800";
//   return <span className={`${baseClasses} ${status === "Active" ? activeClasses : inactiveClasses}`}>{status}</span>;
// };

// const PayslipComponentReport: React.FC = () => {
//   const [view, setView] = useState<"report" | "template">("report");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [activeSearchQuery, setActiveSearchQuery] = useState("");
//   const dispatch = useAppDispatch();
//   const { components, pagination, loading, error, reportId, templateId, isDownloading, isDeleting } =
//     useAppSelector((state) => state.payslipReport);

//   useEffect(() => {
//     dispatch(fetchPayslipComponentReports({ page: 1, limit: 10, filter: activeSearchQuery }));
//   }, [dispatch, activeSearchQuery]);

//   useEffect(() => {
//     if (error) {
//       toast.error(error);
//       dispatch(clearPayslipReportError());
//     }
//   }, [error, dispatch]);

//   const handlePageChange = (page: number) => {
//     if (page > 0 && page <= (pagination?.totalPages || 0)) {
//       dispatch(fetchPayslipComponentReports({ page, limit: pagination?.limit, filter: activeSearchQuery }));
//     }
//   };

//   const handleSearchSubmit = (event: React.FormEvent) => {
//     event.preventDefault();
//     setActiveSearchQuery(searchQuery);
//   };

//   const handleClearSearch = () => {
//     setSearchQuery("");
//     setActiveSearchQuery("");
//   };

//   const handleDelete = () => {
//     if (reportId) {
//       if (window.confirm("Are you sure you want to delete this report?")) {
//         dispatch(deletePayslipReport(reportId))
//           .unwrap()
//           .then(() => toast.success("Report deleted successfully."))
//           .catch((err) => toast.error(err as string));
//       }
//     } else {
//       toast.warn("No report selected or available for deletion.");
//     }
//   };

//   const handleDownload = (format: "csv" | "excel") => {
//     if (isDownloading) return;
//     toast.info(`Download starting for ${format.toUpperCase()} file...`);
//     dispatch(downloadPayslipReport({ format }))
//       .unwrap()
//       .then(() => toast.success("Report download started."))
//       .catch((err) => toast.error(err as string));
//   };

//   const columns: Column<PayslipComponent>[] = [
//     { key: "name", header: "Name" },
//     { key: "emp_id", header: "Employee ID" },
//     { key: "status", header: "Status", render: (row) => renderStatus(row.status) },
//     { key: "phoneNum", header: "Phone Number" },
//     { key: "designation", header: "Designation" },
//     { key: "department", header: "Department" },
//     { key: "location", header: "Location" },
//     { key: "componentName", header: "Component Name" },
//     { key: "code", header: "Code" },
//     { key: "type", header: "Type" },
//     { key: "amount", header: "Amount", render: (row) => formatCurrency(row.amount) },
//   ];

//   if (view === "template") {
//     return <PayslipComponentReportTemplate templateId={templateId} onBack={() => setView("report")} />;
//   }

//   const anyActionInProgress = loading === 'pending' || !!isDownloading || isDeleting;

//   // The main rendering logic fix is here
//   let content;
//   if (loading === 'pending') {
//     content = <p className="text-center p-4">Loading reports...</p>;
//   } else if (loading === 'failed') {
//     content = <p className="text-center text-red-500 p-4">Could not load reports. Please try again.</p>;
//   } else if (components.length === 0) {
//     content = <p className="text-center p-4">No reports found.</p>;
//   } else {
//     content = (
//       <>
//         <div className="overflow-x-auto">
//           <Table
//             data={components}
//             columns={columns}
//             showSearch={false}
//             showItemsPerPage={false}
//             showPagination={false}
//             className="w-[1350px]"
//             isLoading={false} // Loading state is now handled externally
//           />
//         </div>
//         {pagination && pagination.totalItems > 0 && (
//           <div className="pagination flex justify-between items-center mt-4 text-sm text-gray-700">
//             <span>Showing {(pagination.currentPage - 1) * pagination.limit + 1} to {Math.min(pagination.currentPage * pagination.limit, pagination.totalItems)} of {pagination.totalItems} items</span>
//             <div className="flex space-x-1">
//               <button onClick={() => handlePageChange(pagination.currentPage - 1)} disabled={pagination.currentPage === 1 || loading === 'pending'} className="px-3 py-1 border rounded bg-gray-50 hover:bg-gray-100 disabled:opacity-50">Previous</button>
//               <span className="px-3 py-1">Page {pagination.currentPage} of {pagination.totalPages}</span>
//               <button onClick={() => handlePageChange(pagination.currentPage + 1)} disabled={pagination.currentPage === pagination.totalPages || loading === 'pending'} className="px-3 py-1 border rounded bg-gray-50 hover:bg-gray-100 disabled:opacity-50">Next</button>
//             </div>
//           </div>
//         )}
//       </>
//     );
//   }

//   return (
//     <div className="p-8 bg-gray-50 min-h-screen">
//       <div className="flex justify-between items-start mb-6">
//         <h1 className="text-3xl font-bold text-gray-800">Payslip Component Report</h1>
//         <div className="flex flex-col items-end space-y-3">
//           <p className="text-sm text-gray-500">
//             <Link to="/reports/all">Reports</Link> / <Link to="/reports/finance">Finance Reports</Link> / Payslip Component Report
//           </p>
//           <div className="flex items-center space-x-3">
//             <button
//               onClick={() => { if (templateId) setView("template"); else toast.warn("Template ID not available."); }}
//               className="bg-purple-100 text-[#741CDD] font-semibold py-2 px-4 rounded-full hover:bg-purple-200 transition-colors disabled:opacity-50"
//               disabled={!templateId || anyActionInProgress}
//             >EDIT TEMPLATE</button>
//             <button
//               onClick={() => handleDownload("csv")}
//               className="bg-blue-100 text-blue-800 font-semibold py-2 px-4 rounded-full hover:bg-blue-200 transition-colors disabled:opacity-50"
//               disabled={anyActionInProgress}
//             >{isDownloading === 'csv' ? "DOWNLOADING..." : "DOWNLOAD CSV"}</button>
//             <button
//               onClick={() => handleDownload("excel")}
//               className="bg-green-100 text-green-800 font-semibold py-2 px-4 rounded-full hover:bg-green-200 transition-colors disabled:opacity-50"
//               disabled={anyActionInProgress}
//             >{isDownloading === 'excel' ? "DOWNLOADING..." : "DOWNLOAD EXCEL"}</button>
//             <button
//               onClick={handleDelete}
//               className="bg-red-500 text-white font-semibold py-2 px-4 rounded-full hover:bg-red-600 transition-colors disabled:opacity-50"
//               disabled={!reportId || anyActionInProgress}
//             >{isDeleting ? "DELETING..." : "DELETE"}</button>
//           </div>
//         </div>
//       </div>
//       <div className="bg-white p-6 rounded-lg shadow-sm">
//         <div className="flex items-center justify-end mb-4">
//           <form className="flex items-center gap-2" onSubmit={handleSearchSubmit}>
//             <div className="relative">
//               <input type="text" placeholder="Search by name, ID, etc..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:border-purple-500 pr-8" />
//               {searchQuery && (<button type="button" onClick={handleClearSearch} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600" aria-label="Clear search"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg></button>)}
//             </div>
//             <button type="submit" className="bg-purple-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-purple-700" disabled={loading === 'pending'}>Search</button>
//           </form>
//         </div>
//         {content}
//       </div>
//     </div>
//   );
// };

// export default PayslipComponentReport;

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Table, { type Column } from "../../../../../components/common/Table";
import PayslipComponentReportTemplate from "./component/PayslipComponentReportTemplate";
import { useAppDispatch, useAppSelector } from "../../../../../store/hooks";
import {
  fetchPayslipComponentReports,
  deletePayslipReport,
  downloadPayslipReport,
  clearPayslipReportError,
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
  const [activeSearchQuery, setActiveSearchQuery] = useState("");
  const dispatch = useAppDispatch();
  const {
    components,
    pagination,
    loading,
    error,
    reportId,
    templateId,
    isDownloading,
    isDeleting,
    reportExists,
  } = useAppSelector((state) => state.payslipReport);

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(
      fetchPayslipComponentReports({
        page: 1,
        limit: 10,
        filter: activeSearchQuery,
      })
    );
  }, [dispatch, activeSearchQuery]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearPayslipReportError());
    }
  }, [error, dispatch]);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= (pagination?.totalPages || 0)) {
      dispatch(
        fetchPayslipComponentReports({
          page,
          limit: pagination?.limit,
          filter: activeSearchQuery,
        })
      );
    }
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setActiveSearchQuery(searchQuery);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setActiveSearchQuery("");
  };

  const handleDelete = () => {
    if (reportId) {
      if (window.confirm("Are you sure you want to delete this report?")) {
        dispatch(deletePayslipReport(reportId))
          .unwrap()
          .then(() => toast.success("Report deleted successfully."))
          .catch((err) => toast.error(err as string));
      }
    } else {
      toast.warn("No report selected or available for deletion.");
    }
  };

  const handleDownload = (format: "csv" | "excel") => {
    if (isDownloading) return;
    toast.info(`Download starting for ${format.toUpperCase()} file...`);
    dispatch(downloadPayslipReport({ format }))
      .unwrap()
      .then(() => toast.success("Report download started."))
      .catch((err) => toast.error(err as string));
  };

  const handleCreateReport = () => {
    navigate("/reports/create")
  };

  const columns: Column<PayslipComponent>[] = [
    { key: "name", header: "Name" },
    { key: "emp_id", header: "Employee ID" },
    {
      key: "status",
      header: "Status",
      render: (row) => renderStatus(row.status),
    },
    { key: "phoneNum", header: "Phone Number" },
    { key: "designation", header: "Designation" },
    { key: "department", header: "Department" },
    { key: "location", header: "Location" },
    { key: "componentName", header: "Component Name" },
    { key: "code", header: "Code" },
    { key: "type", header: "Type" },
    {
      key: "amount",
      header: "Amount",
      render: (row) => formatCurrency(row.amount),
    },
  ];

  if (view === "template") {
    return (
      <PayslipComponentReportTemplate
        templateId={templateId}
        onBack={() => setView("report")}
      />
    );
  }

  const anyActionInProgress =
    loading === "pending" || !!isDownloading || isDeleting;

  let content;
  if (loading === "pending") {
    content = <p className="text-center p-4">Loading reports...</p>;
  } else if (loading === "failed" && !reportExists) {
    content = (
      <div className="text-center p-8">
        <p className="text-xl font-semibold text-gray-700 mb-4">
          Report not found.
        </p>
        <p className="text-gray-500 mb-6">
          It looks like the Payslip Component Report has not been created yet.
        </p>
        <button
          onClick={handleCreateReport}
          className="bg-purple-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-purple-700 transition-colors"
        >
          CREATE NEW REPORT
        </button>
      </div>
    );
  } else if (loading === "failed") {
    content = (
      <p className="text-center text-red-500 p-4">
        Could not load reports. Please try again.
      </p>
    );
  } else if (components.length === 0) {
    content = <p className="text-center p-4">No data found in the report.</p>;
  } else {
    content = (
      <>
        <div className="overflow-x-auto">
          <Table
            data={components}
            columns={columns}
            showSearch={false}
            showItemsPerPage={false}
            showPagination={false}
            className="w-[1350px]"
            isLoading={false}
          />
        </div>
        {pagination && pagination.totalItems > 0 && (
          <div className="pagination flex justify-between items-center mt-4 text-sm text-gray-700">
            <span>
              Showing {(pagination.currentPage - 1) * pagination.limit + 1} to{" "}
              {Math.min(
                pagination.currentPage * pagination.limit,
                pagination.totalItems
              )}{" "}
              of {pagination.totalItems} items
            </span>
            <div className="flex space-x-1">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1 || loading === "pending"}
                className="px-3 py-1 border rounded bg-gray-50 hover:bg-gray-100 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={
                  pagination.currentPage === pagination.totalPages ||
                  loading === "pending"
                }
                className="px-3 py-1 border rounded bg-gray-50 hover:bg-gray-100 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Payslip Component Report
        </h1>
        <div className="flex flex-col items-end space-y-3">
          {/* <p className="text-sm text-gray-500">
            <Link to="/reports/all">Reports</Link> /{" "}
            <Link to="/reports/finance">Finance Reports</Link> / Payslip
            Component Report
          </p> */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                if (templateId) setView("template");
                else toast.warn("Template ID not available.");
              }}
              className="bg-purple-100 text-[#741CDD] font-semibold py-2 px-4 rounded-full hover:bg-purple-200 transition-colors disabled:opacity-50"
              disabled={!templateId || anyActionInProgress}
            >
              EDIT TEMPLATE
            </button>
            <button
              onClick={() => handleDownload("csv")}
              className="bg-blue-100 text-blue-800 font-semibold py-2 px-4 rounded-full hover:bg-blue-200 transition-colors disabled:opacity-50"
              disabled={anyActionInProgress}
            >
              {isDownloading === "csv" ? "DOWNLOADING..." : "DOWNLOAD CSV"}
            </button>
            <button
              onClick={() => handleDownload("excel")}
              className="bg-green-100 text-green-800 font-semibold py-2 px-4 rounded-full hover:bg-green-200 transition-colors disabled:opacity-50"
              disabled={anyActionInProgress}
            >
              {isDownloading === "excel" ? "DOWNLOADING..." : "DOWNLOAD EXCEL"}
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white font-semibold py-2 px-4 rounded-full hover:bg-red-600 transition-colors disabled:opacity-50"
              disabled={!reportId || anyActionInProgress}
            >
              {isDeleting ? "DELETING..." : "DELETE"}
            </button>
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
              className="bg-purple-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-purple-700"
              disabled={loading === "pending"}
            >
              Search
            </button>
          </form>
        </div>
        {content}
      </div>
    </div>
  );
};

export default PayslipComponentReport;
