// import { useState, useEffect } from "react";
// import Table, { type Column } from "../../../components/common/Table";
// import { useDispatch, useSelector } from "react-redux";
// import toast from "react-hot-toast";
// import {
//   getYearlyAttendance,
//   getEmployeeAttendance,
//   clearSelectedEmployee,
//   clearEmployees,
// } from "../../../store/slice/attendanceSlice";
// import type { AppDispatch, RootState } from "../../../store/store";
// import type {
//   EmployeeDetail,
//   LeaveBalance,
//   UpcomingLeave,
//   AttendanceStatus,
// } from "../../../store/slice/attendanceSlice";

// const calendarMonths = [
//   "Jan", "Feb", "Mar", "Apr", "May", "Jun",
//   "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
// ];

// // --- HELPER COMPONENTS ---
// const attendanceConfig: Record<
//   AttendanceStatus,
//   { color: string; label: string }
// > = {
//   P: { color: "bg-green-500", label: "Present" },
//   W: { color: "bg-yellow-400", label: "WeekOff" },
//   L: { color: "bg-red-500", label: "Leave" },
//   HD: { color: "bg-blue-500", label: "HalfDay" },
//   H: { color: "bg-cyan-400", label: "Holiday" },
//   AB: { color: "bg-gray-400", label: "Absent" },
// };

// const AttendanceLegend = () => (
//   <div className="flex flex-wrap gap-x-4 gap-y-2 items-center text-sm text-gray-700">
//     {Object.entries(attendanceConfig).map(([key, { color, label }]) => (
//       <div key={key} className="flex items-center gap-2">
//         <span className={`w-4 h-4 rounded-sm ${color}`}></span>
//         <span>{`${key}-${label}`}</span>
//       </div>
//     ))}
//   </div>
// );

// // --- MAIN VIEWS ---

// const AttendanceListView = ({
//   employees,
//   onSelectEmployee,
//   selectedYear,
//   onYearChange,
//   months,
//   loading,
//   error,
//   hasSearched,
// }: {
//   employees: EmployeeDetail[];
//   onSelectEmployee: (employee: EmployeeDetail) => void;
//   selectedYear: number | null;
//   onYearChange: (year: number) => void;
//   months: string[];
//   loading: boolean;
//   error: string | null;
//   hasSearched: boolean;
// }) => {
//   return (
//     <div className="bg-white p-6 rounded-lg shadow-md">
//       <div className="flex justify-between items-start mb-4">
//         <div>
//           <h1 className="text-2xl font-semibold text-gray-800">
//             Employees Attendance List
//           </h1>
//         </div>
//         <div className="relative">
//           <select
//             value={selectedYear ?? ""}
//             onChange={(e) => {
//               const year = parseInt(e.target.value, 10);
//               if (!isNaN(year)) {
//                 onYearChange(year);
//               }
//             }}
//             className="appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
//           >
//             <option value="" disabled>
//               Select a Year
//             </option>
//             <option value={2025}>2025</option>
//             <option value={2024}>2024</option>
//             <option value={2023}>2023</option>
//             <option value={2022}>2022</option>
//             <option value={2021}>2021</option>
//           </select>
//         </div>
//       </div>

//       {!hasSearched ? (
//         <div className="text-center py-16 text-gray-500">
//           <p>Please select a year to view the attendance report.</p>
//         </div>
//       ) : loading ? (
//         <div className="text-center py-16 text-gray-600">
//           Loading Employees...
//         </div>
//       ) : error ? (
//         <div className="text-center py-16 text-red-500">Error: {error}</div>
//       ) : employees.length === 0 ? (
//         <div className="text-center py-16 text-gray-500">
//           No attendance records found for the selected year.
//         </div>
//       ) : (
//         <div className="border rounded-md overflow-x-auto">
//           <table className="min-w-max divide-y divide-gray-200 text-sm">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">#</th>
//                 <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Employee Name</th>
//                 {months.map((month) => (
//                   <th
//                     key={month}
//                     className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider border-l min-w-[180px]"
//                   >
//                     {month}
//                     <div className="grid grid-cols-7 gap-1 mt-1 font-normal text-center">
//                       <span>P</span>
//                       <span>W</span>
//                       <span>H</span>
//                       <span>L</span>
//                       <span>HD</span>
//                       <span>AB</span>
//                       <span className="font-bold">All</span>
//                     </div>
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {employees.map((emp) => (
//                 <tr key={emp.id} className="hover:bg-gray-50">
//                   <td className="px-4 py-3 whitespace-nowrap">{emp.employeeId}</td>
//                   <td
//                     className="px-4 py-3 whitespace-nowrap text-purple-700 font-medium cursor-pointer"
//                     onClick={() => onSelectEmployee(emp)}
//                   >
//                     {emp.name}
//                   </td>
//                   {months.map((month) => (
//                     <td key={`${emp.id}-${month}`} className="px-1 py-3 whitespace-nowrap border-l min-w-[180px]">
//                       <div className="grid grid-cols-7 gap-1 text-center">
//                         <span>{emp.attendance[month]?.P ?? 0}</span>
//                         <span>{emp.attendance[month]?.W ?? 0}</span>
//                         <span>{emp.attendance[month]?.H ?? 0}</span>
//                         <span>{emp.attendance[month]?.L ?? 0}</span>
//                         <span>{emp.attendance[month]?.HD ?? 0}</span>
//                         <span>{emp.attendance[month]?.AB ?? 0}</span>
//                         <span className="font-bold">{emp.attendance[month]?.Total ?? 0}</span>
//                       </div>
//                     </td>
//                   ))}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//       <div className="mt-6">
//         <AttendanceLegend />
//       </div>
//     </div>
//   );
// };

// const AttendanceDetailView = ({
//   employee,
//   onBack,
// }: {
//   employee: EmployeeDetail;
//   onBack: () => void;
// }) => {
//   const leaveBalanceColumns: Column<LeaveBalance>[] = [
//     { key: "id", header: "#" },
//     { key: "period", header: "Period" },
//     { key: "type", header: "Type" },
//     { key: "allowed", header: "Allowed Leaves" },
//     { key: "taken", header: "Leaves Taken" },
//     { key: "unpaid", header: "Unpaid Leaves" },
//     { key: "balance", header: "Balance" },
//   ];

//   const upcomingLeavesColumns: Column<UpcomingLeave>[] = [
//     { key: "id", header: "#" },
//     { key: "period", header: "Period" },
//     { key: "name", header: "Name" },
//   ];

//   return (
//     <div className="bg-white p-6 rounded-lg shadow-md space-y-8">
//       <div>
//         <button onClick={onBack} className="mb-4 text-purple-700 hover:text-purple-900 font-medium text-sm">
//           &larr; Back to Summary
//         </button>
//         <div className="flex justify-between items-center">
//           <h1 className="text-2xl font-semibold text-gray-800">{`${employee.name} (${employee.employeeId})`}</h1>
//         </div>
//         <div className="mt-4">
//           <AttendanceLegend />
//         </div>
//       </div>
      
//       <div className="overflow-x-auto border rounded-md">
//         <table className="min-w-full">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="w-24 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
//               {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
//                 <th key={day} className="w-8 text-center text-xs font-medium text-gray-500">{day}</th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {calendarMonths.map((month) => (
//               <tr key={month} className="border-t">
//                 <td className="px-4 py-2 font-medium text-sm text-gray-800">{month}</td>
//                 {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
//                   const dayData = employee.attendanceByDay?.[month]?.find((d) => d.day === day);
//                   const status = dayData?.status;
//                   const color = status ? attendanceConfig[status].color : "bg-white";
//                   return (
//                     <td key={day} className="text-center border-l">
//                       <div className={`w-11 h-8 flex items-center justify-center ${color} m-0.5`}></div>
//                     </td>
//                   );
//                 })}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div>
//         <h2 className="text-xl font-semibold text-gray-700 mb-4">Leave Balance And Details</h2>
//         <Table columns={leaveBalanceColumns} data={employee.leaveBalance} showSearch={false} showPagination={false} />
//       </div>

//       <div>
//         <h2 className="text-xl font-semibold text-gray-700 mb-4">Upcoming Requested Leaves</h2>
//         <Table columns={upcomingLeavesColumns} data={employee.upcomingLeaves} showSearch={false} showPagination={false} />
//       </div>
//     </div>
//   );
// };

// const AttendanceSummary = () => {
//   const dispatch: AppDispatch = useDispatch();
//   const { employees, selectedEmployee, loading, error } = useSelector((state: RootState) => state.attendance);

//   const [view, setView] = useState<"list" | "detail">("list");
//   const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
//   const [hasSearched, setHasSearched] = useState(true);

//   const months = selectedYear ? calendarMonths.map((m) => `${m}-${selectedYear}`) : [];

//   useEffect(() => {
//     const promise = dispatch(getYearlyAttendance({ year: selectedYear }));
//     toast.promise(
//       promise,
//       {
//         loading: "Fetching attendance report...",
//         success: "Report loaded successfully!",
//         error: "Failed to load the report. Please try again.",
//       },
//       {
//         success: { className: "bg-green-100 text-green-800" },
//         error: { className: "bg-red-100 text-red-800" },
//       }
//     );
//   }, [dispatch]);

//   useEffect(() => {
//     setView(selectedEmployee ? "detail" : "list");
//   }, [selectedEmployee]);

//   const handleYearChange = (year: number) => {
//     if (year !== selectedYear) {
//       dispatch(clearEmployees());
//       setSelectedYear(year);
//       setHasSearched(true);
//       const promise = dispatch(getYearlyAttendance({ year }));
//       toast.promise(
//         promise,
//         {
//           loading: "Fetching attendance report...",
//           success: "Report loaded successfully!",
//           error: "Failed to load the report. Please try again.",
//         },
//         {
//           success: { className: "bg-green-100 text-green-800" },
//           error: { className: "bg-red-100 text-red-800" },
//         }
//       );
//     }
//   };

//   const handleSelectEmployee = (employee: EmployeeDetail) => {
//     if (selectedYear) {
//       const promise = dispatch(getEmployeeAttendance({ code: employee.employeeId, year: selectedYear }));
//       toast.promise(
//         promise,
//         {
//           loading: `Fetching details for ${employee.name}...`,
//           success: `Details for ${employee.name} loaded successfully!`,
//           error: `Failed to load details for ${employee.name}.`,
//         },
//         {
//           success: { className: "bg-blue-50 text-blue-800" },
//           error: { className: "bg-red-100 text-red-800" },
//         }
//       );
//     }
//   };

//   const handleGoBack = () => {
//     dispatch(clearSelectedEmployee());
//   };

//   return (
//     <div className="p-4 sm:p-6 lg:p-8 w-[97rem] max-w-8xl">
//       {view === "list" ? (
//         <AttendanceListView
//           employees={employees}
//           onSelectEmployee={handleSelectEmployee}
//           selectedYear={selectedYear}
//           onYearChange={handleYearChange}
//           months={months}
//           loading={loading}
//           error={error}
//           hasSearched={hasSearched}
//         />
//       ) : selectedEmployee ? (
//         <AttendanceDetailView employee={selectedEmployee} onBack={handleGoBack} />
//       ) : (
//         <div className="p-8 text-center text-gray-600">Loading Employee Details...</div>
//       )}
//     </div>
//   );
// };

// export default AttendanceSummary;
import { useState, useEffect } from "react";
import Table, { type Column } from "../../../components/common/Table";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  getYearlyAttendance,
  getEmployeeAttendance,
  clearSelectedEmployee,
  clearEmployees,
} from "../../../store/slice/attendanceSlice";
import type { AppDispatch, RootState } from "../../../store/store";
import type {
  EmployeeDetail,
  LeaveBalance,
  UpcomingLeave,
  AttendanceStatus,
  Pagination,
} from "../../../store/slice/attendanceSlice";

// No changes to helper components, keeping them for context
const calendarMonths = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
const attendanceConfig: Record<AttendanceStatus, { color: string; label: string }> = { P: { color: "bg-green-500", label: "Present" }, W: { color: "bg-yellow-400", label: "WeekOff" }, L: { color: "bg-red-500", label: "Leave" }, HD: { color: "bg-blue-500", label: "HalfDay" }, H: { color: "bg-cyan-400", label: "Holiday" }, AB: { color: "bg-gray-400", label: "Absent" }, };
const AttendanceLegend = () => ( <div className="flex flex-wrap gap-x-4 gap-y-2 items-center text-sm text-gray-700"> {Object.entries(attendanceConfig).map(([key, { color, label }]) => ( <div key={key} className="flex items-center gap-2"> <span className={`w-4 h-4 rounded-sm ${color}`}></span> <span>{`${key}-${label}`}</span> </div> ))} </div> );
const PaginationControls = ({ pagination, onPageChange, }: { pagination: Pagination; onPageChange: (page: number) => void; }) => { const totalPages = Math.ceil(pagination.total / pagination.limit); if (totalPages <= 1) return null; return ( <div className="flex justify-between items-center mt-4 text-sm text-gray-600"> <span> Page {pagination.page} of {totalPages} </span> <div className="flex gap-2"> <button onClick={() => onPageChange(pagination.page - 1)} disabled={pagination.page === 1} className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed" > Previous </button> <button onClick={() => onPageChange(pagination.page + 1)} disabled={pagination.page >= totalPages} className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed" > Next </button> </div> </div> ); };

// --- MAIN VIEWS ---

const AttendanceListView = ({
  employees,
  onSelectEmployee,
  selectedYear,
  onYearChange,
  months,
  loading,
  error,
  pagination,
  onPageChange,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  // ✨ NEW: Prop for clearing the search
  onClearSearch,
}: {
  employees: EmployeeDetail[];
  onSelectEmployee: (employee: EmployeeDetail) => void;
  selectedYear: number | null;
  onYearChange: (year: number) => void;
  months: string[];
  loading: boolean;
  error: string | null;
  pagination: Pagination | null;
  onPageChange: (page: number) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSubmit: () => void;
  // ✨ NEW: Prop type for the clear handler
  onClearSearch: () => void;
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
        <h1 className="text-2xl font-semibold text-gray-800">
          Employees Attendance List
        </h1>
        <div className="flex items-center gap-4">
          <form
            className="flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              onSearchSubmit();
            }}
          >
            {/* ✨ NEW: Wrapper for positioning the clear icon */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search employees..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:border-purple-500 pr-8"
              />
              {/* ✨ NEW: Conditionally rendered clear button (icon) */}
              {searchQuery && (
                <button
                  type="button"
                  onClick={onClearSearch}
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
            >
              Search
            </button>
          </form>

          <div className="relative">
            <select
              value={selectedYear ?? ""}
              onChange={(e) => {
                const year = parseInt(e.target.value, 10);
                if (!isNaN(year)) {
                  onYearChange(year);
                }
              }}
              className="appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            >
              <option value="" disabled>Select a Year</option>
              <option value={2025}>2025</option>
              <option value={2024}>2024</option>
              <option value={2023}>2023</option>
              <option value={2022}>2022</option>
              <option value={2021}>2021</option>
            </select>
          </div>
        </div>
      </div>
      {/* ...rest of the component is unchanged... */}
       {loading ? ( <div className="text-center py-16 text-gray-600"> Loading Employees... </div> ) : error ? ( <div className="text-center py-16 text-red-500">Error: {error}</div> ) : employees.length === 0 ? ( <div className="text-center py-16 text-gray-500"> No attendance records found. </div> ) : ( <> <div className="border rounded-md overflow-x-auto"> <table className="min-w-max w-full divide-y divide-gray-200 text-sm"> <thead className="bg-gray-50"> <tr> <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">#</th> <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Employee Name</th> {months.map((month) => ( <th key={month} className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider border-l min-w-[180px]"> {month} <div className="grid grid-cols-7 gap-1 mt-1 font-normal text-center"> <span>P</span> <span>W</span> <span>H</span> <span>L</span> <span>HD</span> <span>AB</span> <span className="font-bold">All</span> </div> </th> ))} </tr> </thead> <tbody className="bg-white divide-y divide-gray-200"> {employees.map((emp) => ( <tr key={emp.id} className="hover:bg-gray-50"> <td className="px-4 py-3 whitespace-nowrap">{emp.employeeId}</td> <td className="px-4 py-3 whitespace-nowrap text-purple-700 font-medium cursor-pointer" onClick={() => onSelectEmployee(emp)}> {emp.name} </td> {months.map((month) => ( <td key={`${emp.id}-${month}`} className="px-1 py-3 whitespace-nowrap border-l min-w-[180px]"> <div className="grid grid-cols-7 gap-1 text-center"> <span>{emp.attendance[month]?.P ?? 0}</span> <span>{emp.attendance[month]?.W ?? 0}</span> <span>{emp.attendance[month]?.H ?? 0}</span> <span>{emp.attendance[month]?.L ?? 0}</span> <span>{emp.attendance[month]?.HD ?? 0}</span> <span>{emp.attendance[month]?.AB ?? 0}</span> <span className="font-bold">{emp.attendance[month]?.Total ?? 0}</span> </div> </td> ))} </tr> ))} </tbody> </table> </div> {pagination && ( <PaginationControls pagination={pagination} onPageChange={onPageChange} /> )} </> )} <div className="mt-6"> <AttendanceLegend /> </div>
    </div>
  );
};

// No changes needed for AttendanceDetailView
const AttendanceDetailView = ({ employee, onBack, }: { employee: EmployeeDetail; onBack: () => void; }) => { const leaveBalanceColumns: Column<LeaveBalance>[] = [ { key: "id", header: "#" }, { key: "period", header: "Period" }, { key: "type", header: "Type" }, { key: "allowed", header: "Allowed Leaves" }, { key: "taken", header: "Leaves Taken" }, { key: "unpaid", header: "Unpaid Leaves" }, { key: "balance", header: "Balance" }, ]; const upcomingLeavesColumns: Column<UpcomingLeave>[] = [ { key: "id", header: "#" }, { key: "period", header: "Period" }, { key: "name", header: "Name" }, ]; return ( <div className="bg-white p-6 rounded-lg shadow-md space-y-8"> <div> <button onClick={onBack} className="mb-4 text-purple-700 hover:text-purple-900 font-medium text-sm"> &larr; Back to Summary </button> <div className="flex justify-between items-center"> <h1 className="text-2xl font-semibold text-gray-800">{`${employee.name} (${employee.employeeId})`}</h1> </div> <div className="mt-4"> <AttendanceLegend /> </div> </div> <div className="overflow-x-auto border rounded-md"> <table className="min-w-full"> <thead className="bg-gray-50"> <tr> <th className="w-24 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th> {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => ( <th key={day} className="w-8 text-center text-xs font-medium text-gray-500">{day}</th> ))} </tr> </thead> <tbody> {calendarMonths.map((month) => ( <tr key={month} className="border-t"> <td className="px-4 py-2 font-medium text-sm text-gray-800">{month}</td> {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => { const dayData = employee.attendanceByDay?.[month]?.find((d) => d.day === day); const status = dayData?.status; const color = status ? attendanceConfig[status].color : "bg-white"; return ( <td key={day} className="text-center border-l"> <div className={`w-11 h-8 flex items-center justify-center ${color} m-0.5`}></div> </td> ); })} </tr> ))} </tbody> </table> </div> <div> <h2 className="text-xl font-semibold text-gray-700 mb-4">Leave Balance And Details</h2> <Table columns={leaveBalanceColumns} data={employee.leaveBalance} showSearch={false} showPagination={false} /> </div> <div> <h2 className="text-xl font-semibold text-gray-700 mb-4">Upcoming Requested Leaves</h2> <Table columns={upcomingLeavesColumns} data={employee.upcomingLeaves} showSearch={false} showPagination={false} /> </div> </div> ); };


const AttendanceSummary = () => {
  const dispatch: AppDispatch = useDispatch();
  const { employees, selectedEmployee, loading, error, pagination } = useSelector(
    (state: RootState) => state.attendance
  );

  const [view, setView] = useState<"list" | "detail">("list");
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearchQuery, setActiveSearchQuery] = useState("");

  const ROWS_PER_PAGE = 10;
  const months = selectedYear ? calendarMonths.map((m) => `${m}-${selectedYear}`) : [];

  useEffect(() => {
    dispatch(clearEmployees());
    const promise = dispatch(
      getYearlyAttendance({
        year: selectedYear,
        page: currentPage,
        limit: ROWS_PER_PAGE,
        search: activeSearchQuery,
      })
    );
    
    toast.promise(promise, {
      loading: "Fetching attendance report...",
      success: "Report loaded successfully!",
      error: "Failed to load the report.",
    });
  }, [dispatch, selectedYear, currentPage, activeSearchQuery]);

  useEffect(() => {
    setView(selectedEmployee ? "detail" : "list");
  }, [selectedEmployee]);

  const handleYearChange = (year: number) => {
    if (year !== selectedYear) {
      setSelectedYear(year);
      setCurrentPage(1);
      setSearchQuery("");
      setActiveSearchQuery("");
    }
  };

  const handleSearchSubmit = () => {
    setCurrentPage(1);
    setActiveSearchQuery(searchQuery);
  };
  
  // ✨ NEW: Handler to clear the search state
  const handleClearSearch = () => {
    setSearchQuery("");
    setActiveSearchQuery("");
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSelectEmployee = (employee: EmployeeDetail) => {
    if (selectedYear) {
      const promise = dispatch(getEmployeeAttendance({ code: employee.employeeId, year: selectedYear }));
      toast.promise(promise, { loading: `Fetching details for ${employee.name}...`, success: `Details for ${employee.name} loaded successfully!`, error: `Failed to load details for ${employee.name}.`, }, { success: { className: "bg-blue-50 text-blue-800" }, error: { className: "bg-red-100 text-red-800" }, });
    }
  };

  const handleGoBack = () => {
    dispatch(clearSelectedEmployee());
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-[97rem] max-w-8xl">
      {view === "list" ? (
        <AttendanceListView
          employees={employees}
          onSelectEmployee={handleSelectEmployee}
          selectedYear={selectedYear}
          onYearChange={handleYearChange}
          months={months}
          loading={loading}
          error={error}
          pagination={pagination}
          onPageChange={handlePageChange}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearchSubmit={handleSearchSubmit}
          // ✨ NEW: Pass the clear handler down
          onClearSearch={handleClearSearch}
        />
      ) : selectedEmployee ? (
        <AttendanceDetailView employee={selectedEmployee} onBack={handleGoBack} />
      ) : (
        <div className="p-8 text-center text-gray-600">Loading Employee Details...</div>
      )}
    </div>
  );
};

export default AttendanceSummary;