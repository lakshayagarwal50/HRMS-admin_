// import React, { useState, useRef, useEffect, useMemo } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import Table, { type Column } from "../../../../components/common/Table";
// import { MoreVertical, CalendarDays } from "lucide-react";
// import Modal from "../../../../components/common/NotificationModal";
// import {
//   fetchEmployees,
//   deleteEmployee,
//   updateEmployeeStatus,
//   setFilters as setReduxFilters, // Renamed to avoid conflict
//   clearFilters as clearReduxFilters,
// } from "../../../../store/slice/employeeSlice"; // UPDATE THIS PATH
// import type { RootState, AppDispatch } from "../../../../store/store"; // UPDATE THIS PATH

// // Interface for employee data used within this component
// interface Employee {
//   id: string;
//   code: string;
//   name: string;
//   date: string;
//   designation: string;
//   department: string;
//   location: string;
//   payslip: string;
//   gender: string;
//   status: string;
// }

// // ActionDropdown can remain as-is from your original code
// interface ActionDropdownProps {
//   employee: Employee;
//   onAction: (actionName: string, employee: Employee) => void;
// }

// const ActionDropdown: React.FC<ActionDropdownProps> = ({
//   employee,
//   onAction,
// }) => {
//   const [open, setOpen] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target as Node)
//       ) {
//         setOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const actions = [
//     "View Details",
//     "Create Payslip",
//     employee.status === "Active" ? "Make Inactive" : "Make Active",
//     "Delete",
//     employee.status === "Inactive" ? "Re-invite" : "Invite",
//   ];

//   return (
//     <div className="relative inline-block text-left" ref={dropdownRef}>
//       <button
//         onClick={() => setOpen((prev) => !prev)}
//         className="p-2 rounded-full hover:bg-gray-100"
//       >
//         <MoreVertical size={16} />
//       </button>
//       {open && (
//         <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg focus:outline-none flex flex-col">
//           {actions.map((action, index) => (
//             <button
//               key={index}
//               onClick={() => {
//                 setOpen(false);
//                 onAction(action, employee);
//               }}
//               className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:bg-[#f5f5f5]"
//             >
//               {action}
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// const EmployeesTable: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const navigate = useNavigate();

//   // Get state from Redux store
//   const {
//     employees: employeesFromStore,
//     loading,
//     error,
//     filters: reduxFilters,
//   } = useSelector((state: RootState) => state.employees);

//   // --- LOCAL UI STATE ---
//   // Modal for confirmations (Delete, Status Change, etc.)
//   const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
//   const [modalType, setModalType] = useState<
//     "warning" | "info" | "success" | "error"
//   >("warning");
//   const [modalTitle, setModalTitle] = useState<string>("");
//   const [modalMessage, setModalMessage] = useState<string>("");
//   const [employeeForModal, setEmployeeForModal] = useState<Employee | null>(
//     null
//   );
//   const [actionToConfirm, setActionToConfirm] = useState<string | null>(null);

//   // Filter sidebar state
//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   // Local state to hold filter changes before applying them
//   const [localFilters, setLocalFilters] = useState(reduxFilters);

//   // Create Payslip Modal State
//   const [isPayslipModalOpen, setIsPayslipModalOpen] = useState(false);
//   const [payslipYear, setPayslipYear] = useState(
//     String(new Date().getFullYear())
//   );
//   const [payslipMonth, setPayslipMonth] = useState("");

//   // --- DATA FETCHING & TRANSFORMATION ---
//   // Fetch employees when component mounts
//   useEffect(() => {
//     dispatch(fetchEmployees());
//   }, [dispatch]);

//   // Sync local filter state if Redux filters change from elsewhere
//   useEffect(() => {
//     setLocalFilters(reduxFilters);
//   }, [reduxFilters]);

//   // Transform API data structure to the one used by the UI
//   const employeesData = useMemo(() => {
//     // Ensure employeesFromStore is an array before mapping
//     if (!Array.isArray(employeesFromStore)) return [];
//     return employeesFromStore.map((apiEmp: any) => ({
//       id: apiEmp.id,
//       code: apiEmp.employeeCode,
//       name: apiEmp.employeeName,
//       date: new Date(apiEmp.joiningDate).toLocaleDateString("en-GB", {
//         day: "2-digit",
//         month: "short",
//         year: "numeric",
//       }),
//       designation: apiEmp.designation,
//       department: apiEmp.department,
//       location: apiEmp.location,
//       payslip: apiEmp.payslipComponent || "Default",
//       gender: apiEmp.gender,
//       status: apiEmp.status,
//     }));
//   }, [employeesFromStore]);

//   // --- FILTERING ---
//   const filteredEmployees = useMemo(() => {
//     return employeesData.filter((emp) => {
//       const id = emp.id;
//       // The date format from API is 'YYYY-MM-DD', new Date() handles it correctly
//       const empDate = new Date(
//         emp.date.replace(/(\d{2}) (\w{3}) (\d{4})/, "$2 $1, $3")
//       );
//       const startDate = reduxFilters.startDate
//         ? new Date(reduxFilters.startDate)
//         : null;
//       const endDate = reduxFilters.endDate
//         ? new Date(reduxFilters.endDate)
//         : null;
//       const matchDate =
//         (!startDate || empDate >= startDate) &&
//         (!endDate || empDate <= endDate);
//       const matchDepartment =
//         reduxFilters.department === "All" ||
//         emp.department === reduxFilters.department;
//       const matchDesignation =
//         reduxFilters.designation === "All" ||
//         emp.designation === reduxFilters.designation;
//       const matchLocation =
//         !reduxFilters.location ||
//         emp.location
//           .toLowerCase()
//           .includes(reduxFilters.location.toLowerCase());

//       return matchDate && matchDepartment && matchDesignation && matchLocation;
//     });
//   }, [employeesData, reduxFilters]);
//   console.log("-------------------------->", filteredEmployees);

//   // --- EVENT HANDLERS ---
//   const handleAction = (actionName: string, employee: Employee) => {
//     setEmployeeForModal(employee);
//     setActionToConfirm(actionName);

//     switch (actionName) {
//       case "View Details":
//         navigate(`/employees/list/detail/${employee.code}/${employee.id}`, {
//           state: { mainEmployeeId: employee.id },
//         });
//         break;
//       case "Create Payslip":
//         setIsPayslipModalOpen(true);
//         break;
//       case "Delete":
//         setModalType("error");
//         setModalTitle("Delete Employee?");
//         setModalMessage(
//           `Are you absolutely sure you want to delete employee ${employee.name} (${employee.code})? This action cannot be undone.`
//         );
//         setIsModalOpen(true);
//         break;
//       case "Invite":
//         setModalType("info");
//         setModalTitle("Invite User?");
//         setModalMessage(
//           `Do you want to send an invitation to employee ${employee.name} (${employee.code})?`
//         );
//         setIsModalOpen(true);
//         break;
//       case "Re-invite":
//         setModalType("warning");
//         setModalTitle("Re-invite User?");
//         setModalMessage(
//           `Are you sure you want to re-invite ${employee.name} for login?`
//         );
//         setIsModalOpen(true);
//         break;
//       case "Make Inactive":
//         setModalType("warning");
//         setModalTitle("Make Inactive?");
//         setModalMessage(
//           `Are you sure you want to make employee ${employee.name} inactive?`
//         );
//         setIsModalOpen(true);
//         break;
//       case "Make Active":
//         setModalType("info");
//         setModalTitle("Make Active?");
//         setModalMessage(
//           `Are you sure you want to make employee ${employee.name} active?`
//         );
//         setIsModalOpen(true);
//         break;
//       default:
//         break;
//     }
//   };

//   const handleConfirmAction = () => {
//     if (!employeeForModal || !actionToConfirm) return;

//     if (actionToConfirm === "Delete") {
//       dispatch(deleteEmployee(employeeForModal.code));
//     } else if (actionToConfirm === "Make Inactive") {
//       dispatch(
//         updateEmployeeStatus({
//           employeeCode: employeeForModal.code,
//           status: "Inactive",
//         })
//       );
//     } else if (actionToConfirm === "Make Active") {
//       dispatch(
//         updateEmployeeStatus({
//           employeeCode: employeeForModal.code,
//           status: "Active",
//         })
//       );
//     } else if (actionToConfirm.includes("Invite")) {
//       console.log(`Dispatching invite/re-invite for ${employeeForModal.name}`);
//       // dispatch(inviteEmployee(employeeForModal.code)); // Example
//     }

//     // Close and reset modal state
//     setIsModalOpen(false);
//     setEmployeeForModal(null);
//     setActionToConfirm(null);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setEmployeeForModal(null);
//     setActionToConfirm(null);
//   };

//   const handleApplyFilters = () => {
//     dispatch(setReduxFilters(localFilters));
//     setIsFilterOpen(false);
//   };

//   const handleClearFilters = () => {
//     dispatch(clearReduxFilters());
//     // No need to close the sidebar, let the user decide.
//   };

//   const handleProceedPayslip = () => {
//     if (employeeForModal && payslipYear && payslipMonth) {
//       const params = new URLSearchParams({
//         year: payslipYear,
//         month: payslipMonth,
//         name: employeeForModal.name,
//         empid: employeeForModal.code,
//       });
//       navigate(`/employees/list/SalaryComponent?${params.toString()}`);
//       setIsPayslipModalOpen(false);
//     }
//   };

//   const handleClosePayslipModal = () => {
//     setIsPayslipModalOpen(false);
//     setPayslipYear(String(new Date().getFullYear()));
//     setPayslipMonth("");
//     setEmployeeForModal(null);
//   };

//   // --- RENDER LOGIC ---
//   const columns: Column<Employee>[] = [
//     { key: "code", header: "Employee Code" },
//     { key: "name", header: "Employee Name" },
//     { key: "date", header: "Joining date" },
//     { key: "designation", header: "Designation" },
//     { key: "department", header: "Department" },
//     { key: "location", header: "Location" },
//     { key: "payslip", header: "Payslip Component" },
//     { key: "gender", header: "Gender" },
//     {
//       key: "status",
//       header: "Status",
//       render: (row) => (
//         <span
//           className={`px-2 py-1 rounded text-xs font-semibold ${
//             row.status === "Active"
//               ? "bg-green-100 text-green-800"
//               : "bg-red-100 text-red-800"
//           }`}
//         >
//           {row.status}
//         </span>
//       ),
//     },
//     {
//       key: "action",
//       header: "Action",
//       render: (row) => (
//         <ActionDropdown employee={row} onAction={handleAction} />
//       ),
//     },
//   ];

//   // Options for filter dropdowns
//   const departmentOptions = [
//     "All",
//     "Designing",
//     "Development",
//     "QA",
//     "Project Manager",
//   ];
//   const designationOptions = [
//     "All",
//     "Designing",
//     "Development",
//     "QA",
//     "Management",
//   ];
//   const years = Array.from(
//     { length: 11 },
//     (_, i) => new Date().getFullYear() - 5 + i
//   );
//   const months = [
//     "January",
//     "February",
//     "March",
//     "April",
//     "May",
//     "June",
//     "July",
//     "August",
//     "September",
//     "October",
//     "November",
//     "December",
//   ];

//   const renderTableContent = () => {
//     if (loading) {
//       return (
//         <div className="text-center p-10 font-semibold text-gray-500">
//           Loading employees... ⏳
//         </div>
//       );
//     }
//     if (error) {
//       return (
//         <div className="text-center p-10 font-semibold text-red-600">
//           Error: {error} ❌
//         </div>
//       );
//     }
//     if (filteredEmployees.length === 0) {
//       return (
//         <div className="text-center p-10 font-semibold text-gray-500">
//           No employees found matching your criteria. 📭
//         </div>
//       );
//     }
//     return (
//       <Table
//         data={filteredEmployees}
//         columns={columns}
//         className="w-[70vw] text-sm"
//       />
//     );
//   };

//   return (
//     <div className="px-4 py-6 w-full">
//       <div className="bg-white shadow-lg rounded-lg p-4 md:p-6">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 mb-4">
//           <h2 className="text-lg md:text-xl font-semibold text-gray-800">
//             Employees
//           </h2>
//           <div className="text-sm text-gray-500 space-x-1">
//             <a href="#" className="text-[#741CDD] hover:underline">
//               Dashboard
//             </a>{" "}
//             /{" "}
//             <a href="#" className="text-[#741CDD] hover:underline">
//               Employee Setup
//             </a>{" "}
//             /{" "}
//             <a href="#" className="text-[#741CDD] hover:underline">
//               List
//             </a>
//           </div>
//         </div>

//         {/* Action buttons and Filter */}
//         <div className="flex justify-between items-center flex-wrap mb-4">
//           <button className="bg-[#741CDD] hover:bg-[#5b14a9] text-white px-4 py-2 text-sm rounded transition duration-200">
//             + NEW EMPLOYEE
//           </button>
//           <button
//             onClick={() => setIsFilterOpen(true)}
//             className="border border-[#741CDD] text-[#741CDD] hover:bg-[#f0e6fa] px-4 py-2 text-sm rounded transition duration-200"
//           >
//             Filter
//           </button>
//         </div>

//         {/* Table Wrapper for Responsiveness */}
//         <div className="overflow-x-auto">{renderTableContent()}</div>
//       </div>

//       {/* Filter Sidebar */}
//       {isFilterOpen && (
//         <div className="fixed inset-0 bg-black/50 z-[99] flex justify-end animate-fade-in-right">
//           <div className="bg-white w-full sm:w-96 h-full shadow-lg p-6 relative overflow-y-auto">
//             <button
//               onClick={() => setIsFilterOpen(false)}
//               className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
//             >
//               ✖
//             </button>
//             <h2 className="text-lg font-semibold mb-4 text-gray-800">Filter</h2>

//             {/* Date Inputs */}
//             <div className="mb-4">
//               <label className="block font-medium text-sm uppercase text-[#741CDD] mb-2">
//                 Joining Date
//               </label>
//               <div className="relative mb-2">
//                 <input
//                   type="date"
//                   value={localFilters.startDate}
//                   onChange={(e) =>
//                     setLocalFilters({
//                       ...localFilters,
//                       startDate: e.target.value,
//                     })
//                   }
//                   className="w-full border border-gray-300 rounded-md pl-3 pr-10 py-2"
//                 />
//                 <CalendarDays
//                   size={18}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
//                 />
//               </div>
//               <label className="block font-medium text-sm uppercase text-[#741CDD] mb-2">
//                 End Date
//               </label>
//               <div className="relative">
//                 <input
//                   type="date"
//                   value={localFilters.endDate}
//                   onChange={(e) =>
//                     setLocalFilters({
//                       ...localFilters,
//                       endDate: e.target.value,
//                     })
//                   }
//                   className="w-full border border-gray-300 rounded-md pl-3 pr-10 py-2"
//                 />
//                 <CalendarDays
//                   size={18}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
//                 />
//               </div>
//             </div>

//             {/* Department & Designation Buttons */}
//             <div className="mb-4">
//               <label className="block font-medium text-sm uppercase text-[#741CDD] mb-2">
//                 Department
//               </label>
//               <div className="flex flex-col gap-2">
//                 {departmentOptions.map((dept) => (
//                   <button
//                     key={dept}
//                     onClick={() =>
//                       setLocalFilters({ ...localFilters, department: dept })
//                     }
//                     className={`px-4 py-2 rounded-md text-sm w-full text-left ${
//                       localFilters.department === dept
//                         ? "bg-gray-200"
//                         : "bg-gray-100 hover:bg-gray-200"
//                     }`}
//                   >
//                     {dept}
//                   </button>
//                 ))}
//               </div>
//             </div>
//             <div className="mb-4">
//               <label className="block font-medium text-sm uppercase text-[#741CDD] mb-2">
//                 Designation
//               </label>
//               <div className="flex flex-col gap-2">
//                 {designationOptions.map((desig) => (
//                   <button
//                     key={desig}
//                     onClick={() =>
//                       setLocalFilters({ ...localFilters, designation: desig })
//                     }
//                     className={`px-4 py-2 rounded-md text-sm w-full text-left ${
//                       localFilters.designation === desig
//                         ? "bg-gray-200"
//                         : "bg-gray-100 hover:bg-gray-200"
//                     }`}
//                   >
//                     {desig}
//                   </button>
//                 ))}
//               </div>
//             </div>
//             {/* Location Input */}
//             <div className="mb-4">
//               <label className="block font-medium text-sm uppercase text-[#741CDD] mb-2">
//                 Location
//               </label>
//               <input
//                 type="text"
//                 value={localFilters.location}
//                 onChange={(e) =>
//                   setLocalFilters({ ...localFilters, location: e.target.value })
//                 }
//                 className="w-full border border-gray-300 rounded-md px-3 py-2"
//                 placeholder="e.g., Delhi"
//               />
//             </div>

//             {/* Filter Actions */}
//             <div className="flex justify-center gap-3 mt-6">
//               <button
//                 onClick={handleClearFilters}
//                 className="border border-gray-300 px-4 py-2 rounded-md text-sm"
//               >
//                 CLEAR
//               </button>
//               <button
//                 onClick={handleApplyFilters}
//                 className="bg-[#741CDD] text-white px-6 py-2 rounded-md text-sm"
//               >
//                 APPLY FILTERS
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Generic Confirmation Modal */}
//       <Modal
//         isOpen={isModalOpen}
//         onClose={handleCloseModal}
//         title={modalTitle}
//         message={modalMessage}
//         onConfirm={handleConfirmAction}
//         type={modalType}
//       />

//       {/* Create Payslip Modal */}
//       {isPayslipModalOpen && (
//         <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
//           <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm mx-auto">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-semibold">Create Payslip</h3>
//               <button
//                 onClick={handleClosePayslipModal}
//                 className="text-gray-400 hover:text-gray-600 text-2xl"
//               >
//                 &times;
//               </button>
//             </div>
//             <div className="flex flex-col sm:flex-row gap-4 mb-6">
//               <select
//                 value={payslipYear}
//                 onChange={(e) => setPayslipYear(e.target.value)}
//                 className="w-full border rounded-md px-3 py-2"
//               >
//                 <option value="">Select Year</option>
//                 {years.map((year) => (
//                   <option key={year} value={year}>
//                     {year}
//                   </option>
//                 ))}
//               </select>
//               <select
//                 value={payslipMonth}
//                 onChange={(e) => setPayslipMonth(e.target.value)}
//                 className="w-full border rounded-md px-3 py-2"
//               >
//                 <option value="">Select Month</option>
//                 {months.map((month) => (
//                   <option key={month} value={month}>
//                     {month}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="flex justify-center gap-4">
//               <button
//                 onClick={handleClosePayslipModal}
//                 className="border px-6 py-2 rounded-md text-sm"
//               >
//                 CANCEL
//               </button>
//               <button
//                 onClick={handleProceedPayslip}
//                 className="bg-[#741CDD] text-white px-6 py-2 rounded-md text-sm"
//               >
//                 PROCEED
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default EmployeesTable;
import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Table, { type Column } from "../../../../components/common/Table";
import Modal from "../../../../components/common/NotificationModal";
import {
  fetchEmployees,
  deleteEmployee,
  updateEmployeeStatus,
  setFilters as setReduxFilters,
  clearFilters as clearReduxFilters,
} from "../../../../store/slice/employeeSlice";
import type { RootState, AppDispatch } from "../../../../store/store";
import ActionDropdown from "./ActionDropdown";
import FilterSidebar from "./FilterSidebar";
import CreatePayslipModal from "./CreatePayslipModal";
import type { Employee } from "../../../../types";

const EmployeesTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const {
    employees: employeesFromStore,
    loading,
    error,
    filters: reduxFilters,
  } = useSelector((state: RootState) => state.employees);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<
    "warning" | "info" | "success" | "error"
  >("warning");
  const [modalTitle, setModalTitle] = useState<string>("");
  const [modalMessage, setModalMessage] = useState<string>("");
  const [employeeForModal, setEmployeeForModal] = useState<Employee | null>(
    null
  );
  const [actionToConfirm, setActionToConfirm] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPayslipModalOpen, setIsPayslipModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  const employeesData = useMemo(() => {
    if (!Array.isArray(employeesFromStore)) return [];
    return employeesFromStore.map((apiEmp: any) => ({
      id: apiEmp.id,
      code: apiEmp.employeeCode,
      name: apiEmp.employeeName,
      date: new Date(apiEmp.joiningDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      designation: apiEmp.designation,
      department: apiEmp.department,
      location: apiEmp.location,
      payslip: apiEmp.payslipComponent || "Default",
      gender: apiEmp.gender,
      status: apiEmp.status,
    }));
  }, [employeesFromStore]);

  const filteredEmployees = useMemo(() => {
    return employeesData.filter((emp) => {
      const empDate = new Date(
        emp.date.replace(/(\d{2}) (\w{3}) (\d{4})/, "$2 $1, $3")
      );
      const startDate = reduxFilters.startDate
        ? new Date(reduxFilters.startDate)
        : null;
      const endDate = reduxFilters.endDate
        ? new Date(reduxFilters.endDate)
        : null;
      const matchDate =
        (!startDate || empDate >= startDate) &&
        (!endDate || empDate <= endDate);
      const matchDepartment =
        reduxFilters.department === "All" ||
        emp.department === reduxFilters.department;
      const matchDesignation =
        reduxFilters.designation === "All" ||
        emp.designation === reduxFilters.designation;
      const matchLocation =
        !reduxFilters.location ||
        emp.location
          .toLowerCase()
          .includes(reduxFilters.location.toLowerCase());
      return matchDate && matchDepartment && matchDesignation && matchLocation;
    });
  }, [employeesData, reduxFilters]);

  const handleAction = (actionName: string, employee: Employee) => {
    setEmployeeForModal(employee);
    setActionToConfirm(actionName);
    switch (actionName) {
      case "View Details":
        navigate(`/employees/list/detail/${employee.code}/${employee.id}`, {
          state: { mainEmployeeId: employee.id },
        });
        break;
      case "Create Payslip":
        setIsPayslipModalOpen(true);
        break;
      case "Delete":
        setModalType("error");
        setModalTitle("Delete Employee?");
        setModalMessage(`Are you sure you want to delete ${employee.name}?`);
        setIsModalOpen(true);
        break;
      case "Invite":
        setModalType("info");
        setModalTitle("Invite User?");
        setModalMessage(
          `Do you want to send an invitation to employee ${employee.name} (${employee.code})?`
        );
        setIsModalOpen(true);
        break;
      case "Re-invite":
        setModalType("warning");
        setModalTitle("Re-invite User?");
        setModalMessage(
          `Are you sure you want to re-invite ${employee.name} for login?`
        );
        setIsModalOpen(true);
        break;
      case "Make Inactive":
        setModalType("warning");
        setModalTitle("Make Inactive?");
        setModalMessage(
          `Are you sure you want to make employee ${employee.name} inactive?`
        );
        setIsModalOpen(true);
        break;
      case "Make Active":
        setModalType("info");
        setModalTitle("Make Active?");
        setModalMessage(
          `Are you sure you want to make employee ${employee.name} active?`
        );
        setIsModalOpen(true);
        break;
      default:
        break;
    }
  };

  const handleConfirmAction = () => {
    if (!employeeForModal || !actionToConfirm) return;
    switch (actionToConfirm) {
      case "Delete":
        dispatch(deleteEmployee(employeeForModal.id)); // <-- MODIFIED
        break;
      case "Make Inactive":
        dispatch(
          updateEmployeeStatus({
            id: employeeForModal.id, // <-- MODIFIED
            status: "Inactive",
          })
        );
        break;
      case "Make Active":
        dispatch(
          updateEmployeeStatus({
            id: employeeForModal.id, // <-- MODIFIED
            status: "Active",
          })
        );
        break;
      default:
        // Handle any other actions if needed
        break;
    }
    setIsModalOpen(false);
  };

  const handleApplyFilters = (filters: any) => {
    dispatch(setReduxFilters(filters));
    setIsFilterOpen(false);
  };

  const handleClearFilters = () => {
    dispatch(clearReduxFilters());
  };

  const handleProceedPayslip = (year: string, month: string) => {
    if (employeeForModal && year && month) {
      const params = new URLSearchParams({
        year,
        month,
        name: employeeForModal.name,
        empid: employeeForModal.code,
      });
      navigate(`/employees/list/SalaryComponent?${params.toString()}`);
      setIsPayslipModalOpen(false);
    }
  };

  const columns: Column<Employee>[] = [
    { key: "code", header: "Employee Code" },
    { key: "name", header: "Employee Name" },
    { key: "date", header: "Joining date" },
    { key: "designation", header: "Designation" },
    { key: "department", header: "Department" },
    { key: "location", header: "Location" },
    { key: "payslip", header: "Payslip Component" },
    { key: "gender", header: "Gender" },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded text-xs font-semibold ${
            row.status === "Active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      key: "action",
      header: "Action",
      render: (row) => (
        <ActionDropdown employee={row} onAction={handleAction} />
      ),
    },
  ];

  const renderTableContent = () => {
    if (loading) return <div className="text-center p-10">Loading...</div>;
    if (error)
      return (
        <div className="text-center p-10 text-red-600">Error: {error}</div>
      );
    if (filteredEmployees.length === 0)
      return <div className="text-center p-10">No employees found.</div>;
    return (
      <Table
        data={filteredEmployees}
        columns={columns}
        className="w-[70vw] text-sm"
      />
    );
  };

  return (
    <div className="px-4 py-6 w-full">
      <div className="bg-white shadow-lg rounded-lg p-4 md:p-6">
        <div className="flex justify-between items-center flex-wrap mb-4">
          <button className="bg-[#741CDD] hover:bg-[#5b14a9] text-white px-4 py-2 text-sm rounded transition duration-200">
            + NEW EMPLOYEE
          </button>
          <button
            onClick={() => setIsFilterOpen(true)}
            className="border border-[#741CDD] text-[#741CDD] hover:bg-[#f0e6fa] px-4 py-2 text-sm rounded transition duration-200"
          >
            Filter
          </button>
        </div>

        <div className="overflow-x-auto">{renderTableContent()}</div>
      </div>

      <FilterSidebar
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        initialFilters={reduxFilters}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      />

      <CreatePayslipModal
        isOpen={isPayslipModalOpen}
        onClose={() => setIsPayslipModalOpen(false)}
        onProceed={handleProceedPayslip}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalTitle}
        message={modalMessage}
        onConfirm={handleConfirmAction}
        type={modalType}
      />
    </div>
  );
};

export default EmployeesTable;
