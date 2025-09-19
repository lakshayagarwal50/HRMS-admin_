// import React, { useState, useEffect, useMemo, useRef } from "react";
// import { useAppDispatch, useAppSelector } from "../../store/hooks";
// import {
//   fetchAllDsrs,
//   type DsrEntry,
//   setDsrFilters,
//   clearDsrFilters,
//   approveDsr,
//   declineDsr,
// } from "../../store/slice/dsrSlice";
// import Table, { type Column } from "../../components/common/Table";
// import DsrDetailModal from "./common/DsrDetailModal";
// import DsrFilterSidebar from "./pages/DsrFilterSidebar";
// import { MoreHorizontal, Filter, Search } from "lucide-react";
// import { Link } from "react-router-dom";
// import toast from "react-hot-toast";

// const renderStatusBadge = (status: string) => {
//   let baseClasses = "px-3 py-1 text-xs font-medium rounded-md";
//   let statusClasses = "";
//   switch (status?.toLowerCase()) {
//     case "submitted":
//     case "approved":
//       statusClasses = "bg-green-100 text-green-700";
//       break;
//     case "due":
//     case "declined":
//       statusClasses = "bg-red-100 text-red-700";
//       break;
//     case "pending":
//       statusClasses = "bg-yellow-100 text-yellow-700";
//       break;
//     case "due - on leave":
//       return (
//         <span className={`${baseClasses} bg-red-100 text-red-700`}>
//           Due - <span className="font-bold">On Leave</span>
//         </span>
//       );
//     default:
//       return <span>{status || "-"}</span>;
//   }
//   return <span className={`${baseClasses} ${statusClasses}`}>{status}</span>;
// };

// type DsrFilterState = any;

// // NEW: Skeleton Loader Component
// const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 10 }) => {
//   return (
//     <div className="space-y-4 animate-pulse">
//       {/* Skeleton Header */}
//       <div className="flex space-x-4 px-4">
//         <div className="h-4 bg-gray-200 rounded w-[15%]"></div>
//         <div className="h-4 bg-gray-200 rounded w-[10%]"></div>
//         <div className="h-4 bg-gray-200 rounded w-[20%]"></div>
//         <div className="h-4 bg-gray-200 rounded w-[15%]"></div>
//         <div className="h-4 bg-gray-200 rounded w-[15%]"></div>
//         <div className="h-4 bg-gray-200 rounded w-[15%]"></div>
//         <div className="h-4 bg-gray-200 rounded w-[10%]"></div>
//       </div>

//       {/* Skeleton Rows */}
//       <div className="space-y-2">
//         {Array.from({ length: rows }).map((_, index) => (
//           <div
//             key={index}
//             className="flex items-center space-x-4 p-4 border-t border-gray-100"
//           >
//             <div className="h-5 bg-gray-200 rounded w-[15%]"></div>
//             <div className="h-5 bg-gray-200 rounded w-[10%]"></div>
//             <div className="h-5 bg-gray-200 rounded w-[20%]"></div>
//             <div className="h-5 bg-gray-200 rounded w-[15%]"></div>
//             <div className="h-5 bg-gray-200 rounded w-[15%]"></div>
//             <div className="h-5 bg-gray-200 rounded w-[15%]"></div>
//             <div className="h-5 bg-gray-200 rounded w-[10%]"></div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// //main body
// const DisplayDSR = () => {
//   const dispatch = useAppDispatch();
//   const {
//     dsrList,
//     status,
//     error,
//     filters: reduxFilters,
//   } = useAppSelector((state) => state.dsr);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [openMenuId, setOpenMenuId] = useState<string | null>(null);
//   const menuRef = useRef<HTMLDivElement>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedDsr, setSelectedDsr] = useState<DsrEntry | null>(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [isFilterOpen, setIsFilterOpen] = useState(false);

//   useEffect(() => {
//     dispatch(fetchAllDsrs());
//   }, [dispatch]);

//   useEffect(() => {
//     if (status === "failed" && error) {
//       toast.error(error, { className: "bg-red-50 text-red-800" });
//     }
//   }, [status, error]);

//   const filteredData = useMemo(() => {
//     return dsrList.filter((row) =>
//       Object.values(row).some((value) =>
//         String(value).toLowerCase().includes(searchTerm.toLowerCase())
//       )
//     );
//   }, [dsrList, searchTerm]);

//   useEffect(() => {
//     if (currentPage !== 1) {
//       setCurrentPage(1);
//     }
//   }, [searchTerm]);

//   const paginatedData = useMemo(() => {
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     return filteredData.slice(startIndex, startIndex + itemsPerPage);
//   }, [filteredData, currentPage, itemsPerPage]);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
//         setOpenMenuId(null);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleViewDetails = (dsr: DsrEntry) => {
//     setSelectedDsr(dsr);
//     setIsModalOpen(true);
//     setOpenMenuId(null);
//   };

//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//   };

//   const handleItemsPerPageChange = (newSize: number) => {
//     setItemsPerPage(newSize);
//     setCurrentPage(1);
//   };

//   const handleApplyFilters = (filters: DsrFilterState) => {
//     dispatch(setDsrFilters(filters));
//     dispatch(fetchAllDsrs());
//     toast.success("Filters applied successfully!", {
//       className: "bg-green-50 text-green-800",
//     });
//     setIsFilterOpen(false);
//   };

//   const handleClearFilters = () => {
//     dispatch(clearDsrFilters());
//     dispatch(fetchAllDsrs());
//     toast("Filters have been cleared.", {
//       icon: "ℹ️",
//       className: "bg-blue-50 text-blue-800",
//     });
//   };

//   const handleApprove = async (dsr: DsrEntry) => {
//     const toastId = toast.loading("Approving DSR...");
//     try {
//       await dispatch(approveDsr(dsr)).unwrap();
//       toast.success("DSR approved successfully!", {
//         id: toastId,
//         className: "bg-green-50 text-green-800",
//       });
//       setIsModalOpen(false);
//     } catch (err: any) {
//       console.error("Failed to approve DSR:", err);
//       toast.error(err.message || "Failed to approve DSR.", {
//         id: toastId,
//         className: "bg-red-50 text-red-800",
//       });
//     }
//   };

//   const handleDecline = async (dsr: DsrEntry, reason: string) => {
//     const toastId = toast.loading("Declining DSR...");
//     try {
//       await dispatch(declineDsr({ dsr, reason })).unwrap();
//       toast.success("DSR declined successfully!", {
//         id: toastId,
//         className: "bg-green-50 text-green-800",
//       });
//       setIsModalOpen(false);
//     } catch (err: any) {
//       console.error("Failed to decline DSR:", err);
//       toast.error(err.message || "Failed to decline DSR.", {
//         id: toastId,
//         className: "bg-red-50 text-red-800",
//       });
//     }
//   };

//   const columns: Column<DsrEntry>[] = [
//     { header: "Employee Name", key: "employeeName" },
//     { header: "Employee ID", key: "empId" },
//     { header: "Email", key: "email" },
//     { header: "Department", key: "department" },
//     { header: "Designation", key: "designation" },
//     { header: "Date", key: "date" },
//     { header: "Total logged Hours", key: "totalLoggedHours" },
//     {
//       header: "Submission Status",
//       key: "submissionStatus",
//       render: (row) => renderStatusBadge(row.submissionStatus),
//     },
//     {
//       header: "My approval Status",
//       key: "myApprovalStatus",
//       render: (row) => renderStatusBadge(row.myApprovalStatus),
//     },
//     {
//       header: "Action",
//       key: "action",
//       render: (row) => (
//         <div className="relative">
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               setOpenMenuId(openMenuId === row.id ? null : row.id);
//             }}
//             className="p-1 rounded-full hover:bg-gray-100"
//           >
//             <MoreHorizontal size={20} />
//           </button>
//           {openMenuId === row.id && (
//             <div
//               ref={menuRef}
//               className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg z-10"
//             >
//               <button
//                 onClick={() => handleViewDetails(row)}
//                 className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//               >
//                 View Details
//               </button>
//             </div>
//           )}
//         </div>
//       ),
//     },
//   ];

//   const renderContent = () => {
//     if (status === "loading" && dsrList.length === 0) {
//       return <TableSkeleton rows={itemsPerPage} />;
//     }
//     if (status === "failed") {
//       return (
//         <div className="text-center p-8 text-gray-500">
//           Could not load DSR data.
//         </div>
//       );
//     }
//     return (
//       <div className="overflow-x-auto">
//         <div style={{ width: "1350px" }}>
//           <Table<DsrEntry>
//             columns={columns}
//             data={paginatedData}
//             showSearch={false}
//             itemsPerPageOptions={[5, 10, 15, 20]}
//             totalItems={filteredData.length}
//             currentPage={currentPage}
//             itemsPerPage={itemsPerPage}
//             onPageChange={handlePageChange}
//             onItemsPerPageChange={handleItemsPerPageChange}
//           />
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="p-8 bg-gray-50 min-h-screen font-sans">
//       <div className="mb-6 flex items-center justify-between">
//         <h1 className="text-2xl font-bold text-gray-800">Employees DSR list</h1>
//         {/* <p className="text-sm text-gray-500">
//           <Link
//             to="/dashboard"
//             className="hover:text-[#741CDD] transition-colors"
//           >
//             Dashboard
//           </Link>
//           <span className="mx-2">/</span>
//           <span>Employees DSR list</span>
//         </p> */}
//       </div>

//       <div className="bg-white p-6 rounded-lg shadow-sm">
//         <div className="flex justify-between items-center mb-4">
//   {/* Left: Show entries */}
//   <div>
//     <label className="text-sm text-gray-700">
//       Show{" "}
//       <select
//         value={itemsPerPage}
//         onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
//         className="border rounded-md px-2 py-1 text-sm"
//       >
//         {[5, 10, 15, 20].map((size) => (
//           <option key={size} value={size}>
//             {size}
//           </option>
//         ))}
//       </select>{" "}
//       entries
//     </label>
//   </div>

//   {/* Right: Search + Filter */}
//   <div className="flex items-center gap-2">
//     <div className="relative">
//       <span className="absolute inset-y-0 left-0 flex items-center pl-2">
//         <Search size={16} className="text-gray-400" />
//       </span>
//       <input
//         type="text"
//         placeholder="Search by name, ID, email..."
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         className="border rounded-md pl-8 pr-3 py-1.5 text-sm w-80 focus:outline-none focus:ring-2 focus:ring-purple-500"
//       />
//     </div>
//     <button
//       onClick={() => setIsFilterOpen(true)}
//       className="flex-shrink-0 p-2 rounded-md bg-[#741CDD] text-white hover:bg-purple-700"
//     >
//       <Filter size={18} />
//     </button>
//   </div>
// </div>

//         {renderContent()}
//       </div>

//       <DsrFilterSidebar
//         isOpen={isFilterOpen}
//         onClose={() => setIsFilterOpen(false)}
//         initialFilters={reduxFilters}
//         onApply={handleApplyFilters}
//         onClear={handleClearFilters}
//       />

//       <DsrDetailModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         details={selectedDsr}
//         onApprove={handleApprove}
//         onDecline={handleDecline}
//       />
//     </div>
//   );
// };

// export default DisplayDSR;
import React, { useState, useEffect, useMemo, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  fetchAllDsrs,
  type DsrEntry,
  type DsrFilterState,
  setDsrFilters,
  clearDsrFilters,
  approveDsr,
  declineDsr,
} from "../../store/slice/dsrSlice";
import Table, { type Column } from "../../components/common/Table";
import DsrDetailModal from "./common/DsrDetailModal";
import DsrFilterSidebar from "./pages/DsrFilterSidebar";
import { MoreHorizontal, Filter, Search } from "lucide-react";
import toast from "react-hot-toast";

const renderStatusBadge = (status: string) => {
  let baseClasses = "px-3 py-1 text-xs font-medium rounded-md";
  let statusClasses = "";
  switch (status?.toLowerCase()) {
    case "submitted":
    case "approved":
      statusClasses = "bg-green-100 text-green-700";
      break;
    case "due":
    case "due-onleave":
    case "declined":
      statusClasses = "bg-red-100 text-red-700";
      break;
    case "pending":
      statusClasses = "bg-yellow-100 text-yellow-700";
      break;

    default:
      return <span>{status || "-"}</span>;
  }
  return <span className={`${baseClasses} ${statusClasses}`}>{status}</span>;
};

// NEW: Skeleton Loader Component
const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 10 }) => {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Skeleton Header */}
      <div className="flex space-x-4 px-4">
        <div className="h-4 bg-gray-200 rounded w-[15%]"></div>
        <div className="h-4 bg-gray-200 rounded w-[10%]"></div>
        <div className="h-4 bg-gray-200 rounded w-[20%]"></div>
        <div className="h-4 bg-gray-200 rounded w-[15%]"></div>
        <div className="h-4 bg-gray-200 rounded w-[15%]"></div>
        <div className="h-4 bg-gray-200 rounded w-[15%]"></div>
        <div className="h-4 bg-gray-200 rounded w-[10%]"></div>
      </div>

      {/* Skeleton Rows */}
      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className="flex items-center space-x-4 p-4 border-t border-gray-100"
          >
            <div className="h-5 bg-gray-200 rounded w-[15%]"></div>
            <div className="h-5 bg-gray-200 rounded w-[10%]"></div>
            <div className="h-5 bg-gray-200 rounded w-[20%]"></div>
            <div className="h-5 bg-gray-200 rounded w-[15%]"></div>
            <div className="h-5 bg-gray-200 rounded w-[15%]"></div>
            <div className="h-5 bg-gray-200 rounded w-[15%]"></div>
            <div className="h-5 bg-gray-200 rounded w-[10%]"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

//main body
const DisplayDSR = () => {
  const dispatch = useAppDispatch();
  const {
    dsrList,
    status,
    error,
    filters: reduxFilters,
  } = useAppSelector((state) => state.dsr);

  const [searchTerm, setSearchTerm] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDsr, setSelectedDsr] = useState<DsrEntry | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchAllDsrs());
  }, [dispatch]);

  useEffect(() => {
    if (status === "failed" && error) {
      toast.error(error, { className: "bg-red-50 text-red-800" });
    }
  }, [status, error]);

  const filteredData = useMemo(() => {
    return dsrList.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [dsrList, searchTerm]);

  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchTerm]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleViewDetails = (dsr: DsrEntry) => {
    setSelectedDsr(dsr);
    setIsModalOpen(true);
    setOpenMenuId(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newSize: number) => {
    setItemsPerPage(newSize);
    setCurrentPage(1);
  };

  const handleApplyFilters = (filters: DsrFilterState) => {
    dispatch(setDsrFilters(filters));
    dispatch(fetchAllDsrs());
    setCurrentPage(1);
    toast.success("Filters applied successfully!", {
      className: "bg-green-50 text-green-800",
    });
    setIsFilterOpen(false);
  };

  const handleClearFilters = () => {
    dispatch(clearDsrFilters());
    dispatch(fetchAllDsrs());
    setCurrentPage(1);
    toast("Filters have been cleared.", {
      icon: "ℹ️",
      className: "bg-blue-50 text-blue-800",
    });
  };

  const handleApprove = async (dsr: DsrEntry) => {
    const toastId = toast.loading("Approving DSR...");
    try {
      await dispatch(approveDsr(dsr)).unwrap();
      toast.success("DSR approved successfully!", {
        id: toastId,
        className: "bg-green-50 text-green-800",
      });
      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Failed to approve DSR:", err);
      toast.error(err.message || "Failed to approve DSR.", {
        id: toastId,
        className: "bg-red-50 text-red-800",
      });
    }
  };

  const handleDecline = async (dsr: DsrEntry, reason: string) => {
    const toastId = toast.loading("Declining DSR...");
    try {
      await dispatch(declineDsr({ dsr, reason })).unwrap();
      toast.success("DSR declined successfully!", {
        id: toastId,
        className: "bg-green-50 text-green-800",
      });
      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Failed to decline DSR:", err);
      toast.error(err.message || "Failed to decline DSR.", {
        id: toastId,
        className: "bg-red-50 text-red-800",
      });
    }
  };

  const columns: Column<DsrEntry>[] = [
    { header: "Employee Name", key: "employeeName" },
    { header: "Employee ID", key: "empId" },
    { header: "Email", key: "email" },
    { header: "Department", key: "department" },
    { header: "Designation", key: "designation" },
    { header: "Date", key: "date" },
    { header: "Total logged Hours", key: "totalLoggedHours" },
    {
      header: "Submission Status",
      key: "submissionStatus",
      render: (row) => renderStatusBadge(row.submissionStatus),
    },
    {
      header: "My approval Status",
      key: "myApprovalStatus",
      render: (row) => renderStatusBadge(row.myApprovalStatus),
    },
    {
      header: "Action",
      key: "action",
      render: (row) => (
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpenMenuId(openMenuId === row.id ? null : row.id);
            }}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <MoreHorizontal size={20} />
          </button>
          {openMenuId === row.id && (
            <div
              ref={menuRef}
              className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg z-10"
            >
              <button
                onClick={() => handleViewDetails(row)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                View Details
              </button>
            </div>
          )}
        </div>
      ),
    },
  ];

  const renderContent = () => {
    if (status === "loading" && dsrList.length === 0) {
      return <TableSkeleton rows={itemsPerPage} />;
    }
    if (status === "failed") {
      return (
        <div className="text-center p-8 text-gray-500">
          Could not load DSR data.
        </div>
      );
    }
    return (
      // Hides the table's internal top controls AND bottom pagination
      <div className="overflow-x-auto [&_.table-controls]:hidden [&_.pagination]:hidden">
        <div style={{ width: "1350px" }}>
          <Table<DsrEntry>
            columns={columns}
            data={paginatedData}
            showSearch={false}
            // Passing these props is no longer necessary with the CSS approach,
            // but it's kept for clarity.
            itemsPerPageOptions={[5, 10, 15, 20]}
            totalItems={filteredData.length}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </div>
      </div>
    );
  };

  // Calculations for custom pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(startIndex + itemsPerPage - 1, filteredData.length);

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Employees DSR list</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          {/* Left: Your custom "Show entries" dropdown */}
          <div>
            <label className="text-sm text-gray-700">
              Show{" "}
              <select
                value={itemsPerPage}
                onChange={(e) =>
                  handleItemsPerPageChange(Number(e.target.value))
                }
                className="border rounded-md px-2 py-1 text-sm"
              >
                {[5, 10, 15, 20].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>{" "}
              entries
            </label>
          </div>

          {/* Right: Search + Filter */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                <Search size={16} className="text-gray-400" />
              </span>
              <input
                type="text"
                placeholder="Search by name, ID, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border rounded-md pl-8 pr-3 py-1.5 text-sm w-80 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <button
              onClick={() => setIsFilterOpen(true)}
              className="flex-shrink-0 p-2 rounded-md bg-[#741CDD] text-white hover:bg-purple-700"
            >
              <Filter size={18} />
            </button>
          </div>
        </div>

        {renderContent()}

        {/* NEW: Custom Pagination Controls */}
        <div className="flex justify-between items-center mt-4 text-sm text-gray-700">
          <span>
            Showing {filteredData.length > 0 ? startIndex : 0} to {endIndex} of{" "}
            {filteredData.length} entries
          </span>
          <div className="flex space-x-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {/* You can add page number buttons here if needed */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1 border rounded bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <DsrFilterSidebar
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        initialFilters={reduxFilters}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      />

      <DsrDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        details={selectedDsr}
        onApprove={handleApprove}
        onDecline={handleDecline}
      />
    </div>
  );
};

export default DisplayDSR;
