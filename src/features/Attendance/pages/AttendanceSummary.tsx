// // src/features/Attendance/pages/AttendanceSummary.tsx

// import  { useState } from "react";
// import Table, {
//   type Column,
// } from "../../../components/common/Table";

// // --- TYPE DEFINITIONS ---
// // It's recommended to move these to a dedicated types file like `src/types/attendance.ts`

// type AttendanceStatus = "P" | "W" | "L" | "HD" | "H" | "AB";

// interface MonthlyAttendanceSummary {
//   P: number;
//   W: number;
//   L: number;
//   HD: number;
//   H: number;
//   AB: number;
//   Total: number;
// }

// interface EmployeeSummary {
//   id: string;
//   employeeId: string;
//   name: string;
//   attendance: {
//     [month: string]: MonthlyAttendanceSummary;
//   };
// }

// interface DailyAttendance {
//   day: number;
//   status: AttendanceStatus | null;
// }

// interface LeaveBalance {
//   id: number;
//   period: string;
//   type: string;
//   allowed: number;
//   taken: number;
//   unpaid: number;
//   balance: number;
// }

// interface UpcomingLeave {
//   id: number;
//   period: string;
//   name: string;
// }

// interface EmployeeDetail extends EmployeeSummary {
//   attendanceByDay: {
//     [month: string]: DailyAttendance[];
//   };
//   leaveBalance: LeaveBalance[];
//   upcomingLeaves: UpcomingLeave[];
// }

// // --- DUMMY DATA ---
// // This data would typically be fetched from an API via a Redux Toolkit slice.

// const dummyEmployees: EmployeeDetail[] = [
//   {
//     id: "1",
//     employeeId: "1001",
//     name: "John Doe",
//     attendance: {
//       "Jan-2025": { P: 20, W: 8, L: 2, HD: 0, H: 0, AB: 0, Total: 21 },
//       "Feb-2025": { P: 10, W: 0, L: 0, HD: 0, H: 0, AB: 0, Total: 22 },
//       "Mar-2025": { P: 8, W: 0, L: 0, HD: 0, H: 0, AB: 0, Total: 22 },
//       "Apr-2025": { P: 9, W: 0, L: 0, HD: 0, H: 0, AB: 0, Total: 22 },
//     },
//     attendanceByDay: {}, // Populate for detailed view if needed
//     leaveBalance: [],
//     upcomingLeaves: [],
//   },
//   {
//     id: "2",
//     employeeId: "1002",
//     name: "Richard Miles",
//     attendance: {
//       "Jan-2025": { P: 20, W: 8, L: 2, HD: 0, H: 0, AB: 0, Total: 21 },
//       "Feb-2025": { P: 10, W: 0, L: 0, HD: 0, H: 0, AB: 0, Total: 22 },
//       "Mar-2025": { P: 8, W: 0, L: 0, HD: 0, H: 0, AB: 0, Total: 22 },
//       "Apr-2025": { P: 9, W: 0, L: 0, HD: 0, H: 0, AB: 0, Total: 22 },
//     },
//     // Detailed data for Richard Miles to match the calendar screenshot
//     attendanceByDay: {
//       April: Array.from({ length: 30 }, (_, i) => ({
//         day: i + 1,
//         status: i % 7 === 5 || i % 7 === 6 ? "W" : "P",
//       })),
//       May: Array.from({ length: 31 }, (_, i) => {
//         if (i === 10) return { day: i + 1, status: "L" };
//         if (i === 15) return { day: i + 1, status: "HD" };
//         return {
//           day: i + 1,
//           status: i % 7 === 0 || i % 7 === 1 ? "W" : "P",
//         };
//       }),
//       June: Array.from({ length: 30 }, (_, i) => ({
//         day: i + 1,
//         status: i % 7 === 5 || i % 7 === 6 ? "W" : "P",
//       })),
//       // ... Add other months as needed
//     },
//     leaveBalance: [
//       {
//         id: 1,
//         period: "01-Jan-2025 to 31-Dec-2025",
//         type: "Casual Leave",
//         allowed: 12,
//         taken: 6,
//         unpaid: 0,
//         balance: 6,
//       },
//     ],
//     upcomingLeaves: [
//       { id: 1, period: "15-Sep-2025 to 17-Sep-2025", name: "Personal Leave" },
//     ],
//   },
//   // Add other employees...
// ];

// const months = [
//   "Jan-2025",
//   "Feb-2025",
//   "Mar-2025",
//   "Apr-2025",
//   "May-2025",
//   "Jun-2025",
//   "Jul-2025",
//   "Aug-2025",
//   "Sep-2025",
//   "Oct-2025",
//   "Nov-2025",
//   "Dec-2025",
// ];

// const calendarMonths = [
//   "Jan", "Feb", "Mar", "Apr", "May", "Jun",
//   "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
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

// /**
//  * Renders the list view of all employees' attendance summary.
//  */
// const AttendanceListView = ({
//   employees,
//   onSelectEmployee,
//   selectedYear,
//   setSelectedYear,
// }: {
//   employees: EmployeeSummary[];
//   onSelectEmployee: (employee: EmployeeDetail) => void;
//   selectedYear: number;
//   setSelectedYear: (year: number) => void;
// }) => {
//   return (
//     <div className="bg-white p-6 rounded-lg shadow-md">
//       <div className="flex justify-between items-start mb-4">
//         <div>
//           <h1 className="text-2xl font-semibold text-gray-800">
//             Employees Attendance List
//           </h1>
//           <div className="mt-2 p-4 bg-purple-50 border border-purple-200 rounded-md text-sm text-purple-800">
//             <ul>
//               <li>
//                 <strong>Half Day:</strong> If Employee Check In - Check Out
//                 Hours Is Less Than 8 Hours And Greater Than Or Equal To 4 Hours
//               </li>
//               <li>
//                 <strong>Absent:</strong> If Employee Check In - Check Out Hours
//                 Is Less Than 4 Hours
//               </li>
//             </ul>
//           </div>
//         </div>
//         <div className="relative">
//           <select
//             value={selectedYear}
//             onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
//             className="appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
//           >
//             <option value={2025}>2025</option>
//             <option value={2022}>2022</option>
//             <option value={2023}>2023</option>
//             <option value={2024}>2024</option>
//             <option value={2025}>2025</option>
//           </select>
//           <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
//             <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
//               <path d="M5.516 7.548c.436-.446 1.144-.446 1.58 0L10 10.43l2.904-2.882c.436-.446 1.144-.446 1.58 0 .436.446.436 1.17 0 1.615l-3.694 3.668c-.436.446-1.144.446-1.58 0L5.516 9.163c-.436-.446-.436-1.17 0-1.615z" />
//             </svg>
//           </div>
//         </div>
//       </div>

//       <div className="overflow-x-auto border rounded-md">
//         <table className="min-w-full divide-y divide-gray-200 text-sm">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">#</th>
//               <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Employee Name</th>
//               {months.slice(0, 4).map((month) => ( // Displaying first 4 months for brevity
//                 <th key={month} className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider border-l">
//                   {month}
//                   <div className="grid grid-cols-7 gap-1 mt-1 font-normal">
//                     <span className="text-center">P</span>
//                     <span className="text-center">W</span>
//                     <span className="text-center">H</span>
//                     <span className="text-center">L</span>
//                     <span className="text-center">HD</span>
//                     <span className="text-center">AB</span>
//                     <span className="text-center font-bold">All</span>
//                   </div>
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {employees.map((emp) => (
//               <tr key={emp.id} className="hover:bg-gray-50">
//                 <td className="px-4 py-3 whitespace-nowrap">{emp.employeeId}</td>
//                 <td
//                   className="px-4 py-3 whitespace-nowrap text-purple-700 font-medium cursor-pointer"
//                   onClick={() => onSelectEmployee(emp as EmployeeDetail)}
//                 >
//                   {emp.name}
//                 </td>
//                 {months.slice(0, 4).map((month) => (
//                   <td key={`${emp.id}-${month}`} className="px-1 py-3 whitespace-nowrap border-l">
//                     <div className="grid grid-cols-7 gap-1 text-center">
//                       <span>{emp.attendance[month]?.P ?? 0}</span>
//                       <span>{emp.attendance[month]?.W ?? 0}</span>
//                       <span>{emp.attendance[month]?.H ?? 0}</span>
//                       <span>{emp.attendance[month]?.L ?? 0}</span>
//                       <span>{emp.attendance[month]?.HD ?? 0}</span>
//                       <span>{emp.attendance[month]?.AB ?? 0}</span>
//                       <span className="font-bold">{emp.attendance[month]?.Total ?? 0}</span>
//                     </div>
//                   </td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div className="mt-6">
//         <AttendanceLegend />
//       </div>
//     </div>
//   );
// };

// /**
//  * Renders the detailed calendar view for a single employee.
//  */
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

//         <button
//           onClick={onBack}
//           className="mb-4 text-purple-700 hover:text-purple-900 font-medium text-sm"
//         >
//           &larr; Back to Summary
//         </button>
//         <div className="flex justify-between items-center">
//             <h1 className="text-2xl font-semibold text-gray-800">
//                 {`${employee.name} (${employee.employeeId})`}
//             </h1>
//         </div>
//         <div className="mt-4">
//              <AttendanceLegend />
//         </div>
//       </div>

//       {/* Calendar Table */}
//       <div className="overflow-x-auto border rounded-md">
//         <table className="min-w-full">
//             <thead className="bg-gray-50">
//                 <tr>
//                     <th className="w-24 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
//                     {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
//                         <th key={day} className="w-8 text-center text-xs font-medium text-gray-500">{day}</th>
//                     ))}
//                 </tr>
//             </thead>
//             <tbody>
//                 {calendarMonths.map(month => (
//                     <tr key={month} className="border-t">
//                         <td className="px-4 py-2 font-medium text-sm text-gray-800">{month}</td>
//                         {Array.from({ length: 31 }, (_, i) => i + 1).map(day => {
//                             const dayData = employee.attendanceByDay[month]?.find(d => d.day === day);
//                             const status = dayData?.status;
//                             const color = status ? attendanceConfig[status].color : 'bg-white';
//                             return (
//                                 <td key={day} className="text-center border-l">
//                                     <div className={`w-full h-8 flex items-center justify-center ${color}`}>
//                                         {/* Optional: Add a tooltip with the status label */}
//                                     </div>
//                                 </td>
//                             );
//                         })}
//                     </tr>
//                 ))}
//             </tbody>
//         </table>
//       </div>

//       {/* Leave Balance Table */}
//       <div>
//         <h2 className="text-xl font-semibold text-gray-700 mb-4">
//           Leave Balance And Details
//         </h2>
//         <Table
//           columns={leaveBalanceColumns}
//           data={employee.leaveBalance}
//           showSearch={false}
//           showPagination={false}
//         />
//       </div>

//       {/* Upcoming Leaves Table */}
//       <div>
//         <h2 className="text-xl font-semibold text-gray-700 mb-4">
//           Upcoming Requested Leaves
//         </h2>
//         <Table
//           columns={upcomingLeavesColumns}
//           data={employee.upcomingLeaves}
//           showSearch={false}
//           showPagination={false}
//         />
//       </div>
//     </div>
//   );
// };

// /**
//  * Main component to manage and switch between attendance views.
//  */
// const AttendanceSummary = () => {
//   const [view, setView] = useState<"list" | "detail">("list");
//   const [selectedYear, setSelectedYear] = useState<number>(2025);
//   const [selectedEmployee, setSelectedEmployee] = useState<EmployeeDetail | null>(
//     null
//   );

//   // In a real app, you would use a selector to get data from the Redux store
//   // and dispatch an action to fetch data when the year changes.
//   // const { data: employees, isLoading } = useGetAttendanceQuery(selectedYear);

//   const handleSelectEmployee = (employee: EmployeeDetail) => {
//     // A more complete data object would be fetched for the detail view in a real app
//     const detailedData = dummyEmployees.find(e => e.id === employee.id);
//     if(detailedData){
//         setSelectedEmployee(detailedData);
//         setView("detail");
//     }
//   };

//   const handleGoBack = () => {
//     setView("list");
//     setSelectedEmployee(null);
//   };

//   return (
//     <div className="p-4 sm:p-6 lg:p-8">

//       {view === "list" ? (
//         <AttendanceListView
//           employees={dummyEmployees}
//           onSelectEmployee={handleSelectEmployee}
//           selectedYear={selectedYear}
//           setSelectedYear={setSelectedYear}
//         />
//       ) : selectedEmployee ? (
//         <AttendanceDetailView employee={selectedEmployee} onBack={handleGoBack} />
//       ) : null}
//     </div>
//   );
// };

// export default AttendanceSummary;
// src/features/Attendance/pages/AttendanceSummary.tsx

// import  { useState, useEffect } from "react";
// import Table, { type Column } from "../../../components/common/Table";

// // --- REDUX & TYPE IMPORTS ---
// import { useDispatch, useSelector } from 'react-redux';
// import { getYearlyAttendance, getEmployeeAttendance, clearSelectedEmployee } from "../../../store/slice/attendanceSlice";
// import type { AppDispatch, RootState } from "../../../store/store";
// import type { EmployeeDetail, LeaveBalance, UpcomingLeave, AttendanceStatus } from "../../../store/slice/attendanceSlice";

// const months = [
//     "Jan-2025", "Feb-2025", "Mar-2025", "Apr-2025", "May-2025", "Jun-2025",
//     "Jul-2025", "Aug-2025", "Sep-2025", "Oct-2025", "Nov-2025", "Dec-2025",
// ];

// const calendarMonths = [
//     "Jan", "Feb", "Mar", "Apr", "May", "Jun",
//     "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
// ];

// // --- HELPER COMPONENTS ---
// const attendanceConfig: Record<AttendanceStatus, { color: string; label: string }> = {
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

// /**
//  * Renders the list view of all employees' attendance summary.
//  */
// const AttendanceListView = ({
//   employees,
//   onSelectEmployee,
//   selectedYear,
//   setSelectedYear,
// }: {
//   employees: EmployeeDetail[];
//   onSelectEmployee: (employee: EmployeeDetail) => void;
//   selectedYear: number;
//   setSelectedYear: (year: number) => void;
// }) => {
//     return (
//         <div className="bg-white p-6 rounded-lg shadow-md">
//             <div className="flex justify-between items-start mb-4">
//                 <div>
//                     <h1 className="text-2xl font-semibold text-gray-800">
//                         Employees Attendance List
//                     </h1>
//                     <div className="mt-2 p-4 bg-purple-50 border border-purple-200 rounded-md text-sm text-purple-800">
//                         <ul>
//                             <li>
//                                 <strong>Half Day:</strong> If Employee Check In - Check Out
//                                 Hours Is Less Than 8 Hours And Greater Than Or Equal To 4 Hours
//                             </li>
//                             <li>
//                                 <strong>Absent:</strong> If Employee Check In - Check Out Hours
//                                 Is Less Than 4 Hours
//                             </li>
//                         </ul>
//                     </div>
//                 </div>
//                 <div className="relative">
//                     <select
//                         value={selectedYear}
//                         onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
//                         className="appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
//                     >
//                         <option value={2025}>2025</option>
//                         <option value={2022}>2022</option>
//                         <option value={2023}>2023</option>
//                         <option value={2024}>2024</option>
//                         <option value={2025}>2025</option>
//                     </select>
//                     <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
//                         <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
//                             <path d="M5.516 7.548c.436-.446 1.144-.446 1.58 0L10 10.43l2.904-2.882c.436-.446 1.144-.446 1.58 0 .436.446.436 1.17 0 1.615l-3.694 3.668c-.436.446-1.144.446-1.58 0L5.516 9.163c-.436-.446-.436-1.17 0-1.615z" />
//                         </svg>
//                     </div>
//                 </div>
//             </div>

//             <div className="overflow-x-auto border rounded-md">
//                 <table className="min-w-full divide-y divide-gray-200 text-sm">
//                     <thead className="bg-gray-50">
//                         <tr>
//                             <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">#</th>
//                             <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Employee Name</th>
//                             {months.slice(0, 4).map((month) => ( // Displaying first 4 months for brevity
//                                 <th key={month} className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider border-l">
//                                     {month}
//                                     <div className="grid grid-cols-7 gap-1 mt-1 font-normal">
//                                         <span className="text-center">P</span>
//                                         <span className="text-center">W</span>
//                                         <span className="text-center">H</span>
//                                         <span className="text-center">L</span>
//                                         <span className="text-center">HD</span>
//                                         <span className="text-center">AB</span>
//                                         <span className="text-center font-bold">All</span>
//                                     </div>
//                                 </th>
//                             ))}
//                         </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                         {employees.map((emp) => (
//                             <tr key={emp.id} className="hover:bg-gray-50">
//                                 <td className="px-4 py-3 whitespace-nowrap">{emp.employeeId}</td>
//                                 <td
//                                     className="px-4 py-3 whitespace-nowrap text-purple-700 font-medium cursor-pointer"
//                                     onClick={() => onSelectEmployee(emp)}
//                                 >
//                                     {emp.name}
//                                 </td>
//                                 {months.slice(0, 4).map((month) => (
//                                     <td key={`${emp.id}-${month}`} className="px-1 py-3 whitespace-nowrap border-l">
//                                         <div className="grid grid-cols-7 gap-1 text-center">
//                                             <span>{emp.attendance[month]?.P ?? 0}</span>
//                                             <span>{emp.attendance[month]?.W ?? 0}</span>
//                                             <span>{emp.attendance[month]?.H ?? 0}</span>
//                                             <span>{emp.attendance[month]?.L ?? 0}</span>
//                                             <span>{emp.attendance[month]?.HD ?? 0}</span>
//                                             <span>{emp.attendance[month]?.AB ?? 0}</span>
//                                             <span className="font-bold">{emp.attendance[month]?.Total ?? 0}</span>
//                                         </div>
//                                     </td>
//                                 ))}
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>

//             <div className="mt-6">
//                 <AttendanceLegend />
//             </div>
//         </div>
//     );
// };
// /**
//  * Renders the detailed calendar view for a single employee.
//  */
// const AttendanceDetailView = ({
//   employee,
//   onBack,
// }: {
//   employee: EmployeeDetail;
//   onBack: () => void;
// }) => {
//     const leaveBalanceColumns: Column<LeaveBalance>[] = [
//         { key: "id", header: "#" },
//         { key: "period", header: "Period" },
//         { key: "type", header: "Type" },
//         { key: "allowed", header: "Allowed Leaves" },
//         { key: "taken", header: "Leaves Taken" },
//         { key: "unpaid", header: "Unpaid Leaves" },
//         { key: "balance", header: "Balance" },
//     ];

//     const upcomingLeavesColumns: Column<UpcomingLeave>[] = [
//         { key: "id", header: "#" },
//         { key: "period", header: "Period" },
//         { key: "name", header: "Name" },
//     ];

//     return (
//         <div className="bg-white p-6 rounded-lg shadow-md space-y-8">

//             <div>

//                 <button
//                     onClick={onBack}
//                     className="mb-4 text-purple-700 hover:text-purple-900 font-medium text-sm"
//                 >
//                     &larr; Back to Summary
//                 </button>
//                 <div className="flex justify-between items-center">
//                     <h1 className="text-2xl font-semibold text-gray-800">
//                         {`${employee.name} (${employee.employeeId})`}
//                     </h1>
//                 </div>
//                 <div className="mt-4">
//                     <AttendanceLegend />
//                 </div>
//             </div>

//             {/* Calendar Table */}
//             <div className="overflow-x-auto border rounded-md">
//                 <table className="min-w-full">
//                     <thead className="bg-gray-50">
//                         <tr>
//                             <th className="w-24 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
//                             {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
//                                 <th key={day} className="w-8 text-center text-xs font-medium text-gray-500">{day}</th>
//                             ))}
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {calendarMonths.map(month => (
//                             <tr key={month} className="border-t">
//                                 <td className="px-4 py-2 font-medium text-sm text-gray-800">{month}</td>
//                                 {Array.from({ length: 31 }, (_, i) => i + 1).map(day => {
//                                     const dayData = employee.attendanceByDay?.[month]?.find(d => d.day === day);
//                                     const status = dayData?.status;
//                                     const color = status ? attendanceConfig[status].color : 'bg-white';
//                                     return (
//                                         <td key={day} className="text-center border-l">
//                                             <div className={`w-full h-8 flex items-center justify-center ${color}`}>
//                                                 {/* Optional: Add a tooltip with the status label */}
//                                             </div>
//                                         </td>
//                                     );
//                                 })}
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>

//             {/* Leave Balance Table */}
//             <div>
//                 <h2 className="text-xl font-semibold text-gray-700 mb-4">
//                     Leave Balance And Details
//                 </h2>
//                 <Table
//                     columns={leaveBalanceColumns}
//                     data={employee.leaveBalance}
//                     showSearch={false}
//                     showPagination={false}
//                 />
//             </div>

//             {/* Upcoming Leaves Table */}
//             <div>
//                 <h2 className="text-xl font-semibold text-gray-700 mb-4">
//                     Upcoming Requested Leaves
//                 </h2>
//                 <Table
//                     columns={upcomingLeavesColumns}
//                     data={employee.upcomingLeaves}
//                     showSearch={false}
//                     showPagination={false}
//                 />
//             </div>
//         </div>
//     );
// };

// /**
//  * Main component to manage and switch between attendance views.
//  */
// const AttendanceSummary = () => {
//   // --- REDUX HOOKS ---
//   const dispatch: AppDispatch = useDispatch();
//   const { employees, selectedEmployee, loading, error } = useSelector(
//     (state: RootState) => state.attendance
//   );

//   // --- COMPONENT STATE ---
//   const [view, setView] = useState<"list" | "detail">("list");
//   const [selectedYear, setSelectedYear] = useState<number>(2025);

//   // --- DATA FETCHING & VIEW LOGIC ---
//   useEffect(() => {
//     dispatch(getYearlyAttendance({ year: selectedYear }));
//   }, [dispatch, selectedYear]);

//   useEffect(() => {
//     // Switch view based on whether `selectedEmployee` has data in the store
//     setView(selectedEmployee ? "detail" : "list");
//   }, [selectedEmployee]);

//   // --- EVENT HANDLERS ---
//   const handleSelectEmployee = (employee: EmployeeDetail) => {
//     dispatch(getEmployeeAttendance({ code: employee.employeeId, year: selectedYear }));
//   };

//   const handleGoBack = () => {
//     dispatch(clearSelectedEmployee()); // Clears data in the store, useEffect handles the view switch
//   };

//   // --- RENDER LOGIC ---

//   // Show a loading indicator for the initial page load
//   if (loading && employees.length === 0) {
//     return <div className="p-8 text-center text-gray-600">Loading Employees...</div>;
//   }

//   // Display a prominent error message if fetching fails
//   if (error) {
//     return <div className="p-8 text-center text-red-500">Error: {error}</div>;
//   }

//   return (
//     <div className="p-4 sm:p-6 lg:p-8">
//       {view === "list" ? (
//         <AttendanceListView
//           employees={employees}
//           onSelectEmployee={handleSelectEmployee}
//           selectedYear={selectedYear}
//           setSelectedYear={setSelectedYear}
//         />
//       ) : selectedEmployee ? (
//         <AttendanceDetailView employee={selectedEmployee} onBack={handleGoBack} />
//       ) : (
//         // Show loading state for the detail view specifically
//         <div className="p-8 text-center text-gray-600">Loading Employee Details...</div>
//       )}
//     </div>
//   );
// };

// export default AttendanceSummary;

// src/features/Attendance/pages/AttendanceSummary.tsx

// import React, { useState, useEffect } from "react";
// import Table, { type Column } from "../../../components/common/Table";

// // --- REDUX & TYPE IMPORTS ---
// import { useDispatch, useSelector } from 'react-redux';
// import { getYearlyAttendance, getEmployeeAttendance, clearSelectedEmployee, clearEmployees } from "../../../store/slice/attendanceSlice";
// import type { AppDispatch, RootState } from "../../../store/store";
// import type { EmployeeDetail, LeaveBalance, UpcomingLeave, AttendanceStatus } from "../../../store/slice/attendanceSlice";

// const calendarMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// // --- HELPER COMPONENTS ---
// const attendanceConfig: Record<AttendanceStatus, { color: string; label: string }> = {
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

// /**
//  * Renders the list view of all employees' attendance summary.
//  */
// const AttendanceListView = ({
//   employees,
//   onSelectEmployee,
//   selectedYear,
//   onYearChange,
//   months,
//   loading,
//   error,
//   hasSearched
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
//     return (
//         <div className="bg-white p-6 rounded-lg shadow-md">
//             <div className="flex justify-between items-start mb-4">
//                 <div>
//                     <h1 className="text-2xl font-semibold text-gray-800">
//                         Employees Attendance List
//                     </h1>
//                 </div>
//                 <div className="relative">
//                     <select
//                         value={selectedYear ?? ""}
//                         onChange={(e) => {
//                             const year = parseInt(e.target.value, 10);
//                             if (!isNaN(year)) {
//                                 onYearChange(year);
//                             }
//                         }}
//                         className="appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
//                     >
//                         <option value="" disabled>Select a Year</option>
//                         <option value={2025}>2025</option>
//                         <option value={2024}>2024</option>
//                         <option value={2023}>2023</option>
//                         <option value={2022}>2022</option>
//                     </select>
//                 </div>
//             </div>

//             {/* Conditional Rendering for Data */}
//             {!hasSearched ? (
//                 <div className="text-center py-16 text-gray-500">
//                     <p>Please select a year to view the attendance report.</p>
//                 </div>
//             ) : loading ? (
//                 <div className="text-center py-16 text-gray-600">Loading Employees...</div>
//             ) : error ? (
//                 <div className="text-center py-16 text-red-500">Error: {error}</div>
//             ) : employees.length === 0 ? (
//                 <div className="text-center py-16 text-gray-500">No attendance records found for the selected year.</div>
//             ) : (
//                 <div className="overflow-x-auto border rounded-md">
//                     <table className="min-w-full divide-y divide-gray-200 text-sm">
//                         <thead className="bg-gray-50">
//                             <tr>
//                                 <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">#</th>
//                                 <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Employee Name</th>
//                                 {months.slice(0, 4).map((month) => (
//                                     <th key={month} className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider border-l">
//                                         {month}
//                                         <div className="grid grid-cols-7 gap-1 mt-1 font-normal">
//                                             <span>P</span><span>W</span><span>H</span><span>L</span><span>HD</span><span>AB</span><span className="font-bold">All</span>
//                                         </div>
//                                     </th>
//                                 ))}
//                             </tr>
//                         </thead>
//                         <tbody className="bg-white divide-y divide-gray-200">
//                             {employees.map((emp) => (
//                                 <tr key={emp.id} className="hover:bg-gray-50">
//                                     <td className="px-4 py-3 whitespace-nowrap">{emp.employeeId}</td>
//                                     <td className="px-4 py-3 whitespace-nowrap text-purple-700 font-medium cursor-pointer" onClick={() => onSelectEmployee(emp)}>
//                                         {emp.name}
//                                     </td>
//                                     {months.slice(0, 4).map((month) => (
//                                         <td key={`${emp.id}-${month}`} className="px-1 py-3 whitespace-nowrap border-l">
//                                             <div className="grid grid-cols-7 gap-1 text-center">
//                                                 <span>{emp.attendance[month]?.P ?? 0}</span>
//                                                 <span>{emp.attendance[month]?.W ?? 0}</span>
//                                                 <span>{emp.attendance[month]?.H ?? 0}</span>
//                                                 <span>{emp.attendance[month]?.L ?? 0}</span>
//                                                 <span>{emp.attendance[month]?.HD ?? 0}</span>
//                                                 <span>{emp.attendance[month]?.AB ?? 0}</span>
//                                                 <span className="font-bold">{emp.attendance[month]?.Total ?? 0}</span>
//                                             </div>
//                                         </td>
//                                     ))}
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             )}
//              <div className="mt-6">
//                 <AttendanceLegend />
//             </div>
//         </div>
//     );
// };

// /**
//  * Renders the detailed calendar view for a single employee.
//  */
// const AttendanceDetailView = ({
//   employee,
//   onBack,
// }: {
//   employee: EmployeeDetail;
//   onBack: () => void;
// }) => {
//     // This component remains unchanged
//     return (
//         <div className="bg-white p-6 rounded-lg shadow-md space-y-8">
//             {/* ... JSX for detail view */}
//         </div>
//     );
// };

// /**
//  * Main component to manage and switch between attendance views.
//  */
// const AttendanceSummary = () => {
//   const dispatch: AppDispatch = useDispatch();
//   const { employees, selectedEmployee, loading, error } = useSelector(
//     (state: RootState) => state.attendance
//   );

//   const [view, setView] = useState<"list" | "detail">("list");
//   const [selectedYear, setSelectedYear] = useState<number | null>(null);
//   const [hasSearched, setHasSearched] = useState(false);

//   // ✅ FIX: Dynamically generate month strings based on the selected year to prevent data mismatch errors.
//   const months = selectedYear
//     ? calendarMonths.map(m => `${m}-${selectedYear}`)
//     : [];

//   useEffect(() => {
//     setView(selectedEmployee ? "detail" : "list");
//   }, [selectedEmployee]);

//   // ✅ API call is now triggered by this handler, not on initial load
//   const handleYearChange = (year: number) => {
//     if (year !== selectedYear) {
//       dispatch(clearEmployees());
//       setSelectedYear(year);
//       setHasSearched(true);
//       dispatch(getYearlyAttendance({ year }));
//     }
//   };

//   const handleSelectEmployee = (employee: EmployeeDetail) => {
//     if (selectedYear) {
//       dispatch(getEmployeeAttendance({ code: employee.employeeId, year: selectedYear }));
//     }
//   };

//   const handleGoBack = () => {
//     dispatch(clearSelectedEmployee());
//   };

//   return (
//     <div className="p-4 sm:p-6 lg:p-8">
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

// src/features/Attendance/pages/AttendanceSummary.tsx

// import { useState, useEffect } from "react";
// import Table, { type Column } from "../../../components/common/Table";
// import { useDispatch, useSelector } from "react-redux";
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
//   "Jan",
//   "Feb",
//   "Mar",
//   "Apr",
//   "May",
//   "Jun",
//   "Jul",
//   "Aug",
//   "Sep",
//   "Oct",
//   "Nov",
//   "Dec",
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

//       {/* Conditional Rendering for Data */}
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
//         // <div className="overflow-x-auto border rounded-md">
//         //   <table className="min-w-full divide-y divide-gray-200 text-sm">
//         //     <thead className="bg-gray-50">
//         //       <tr>
//         //         <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
//         //           #
//         //         </th>
//         //         <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
//         //           Employee Name
//         //         </th>
//         //         {months.map((month) => (
//         //           <th
//         //             key={month}
//         //             className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider border-l min-w-[180px]"
//         //           >
//         //             {month}
//         //             <div className="grid grid-cols-7 gap-1 mt-1 font-normal text-center">
//         //               <span>P</span>
//         //               <span>W</span>
//         //               <span>H</span>
//         //               <span>L</span>
//         //               <span>HD</span>
//         //               <span>AB</span>
//         //               <span className="font-bold">All</span>
//         //             </div>
//         //           </th>
//         //         ))}
//         //       </tr>
//         //     </thead>
//         //     <tbody className="bg-white divide-y divide-gray-200">
//         //       {employees.map((emp) => (
//         //         <tr key={emp.id} className="hover:bg-gray-50">
//         //           <td className="px-4 py-3 whitespace-nowrap">
//         //             {emp.employeeId}
//         //           </td>
//         //           <td
//         //             className="px-4 py-3 whitespace-nowrap text-purple-700 font-medium cursor-pointer"
//         //             onClick={() => onSelectEmployee(emp)}
//         //           >
//         //             {emp.name}
//         //           </td>
//         //           {months.map((month) => (
//         //             <td
//         //               key={`${emp.id}-${month}`}
//         //               className="px-1 py-3 whitespace-nowrap border-l min-w-[180px]"
//         //             >
//         //               <div className="grid grid-cols-7 gap-1 text-center">
//         //                 <span>{emp.attendance[month]?.P ?? 0}</span>
//         //                 <span>{emp.attendance[month]?.W ?? 0}</span>
//         //                 <span>{emp.attendance[month]?.H ?? 0}</span>
//         //                 <span>{emp.attendance[month]?.L ?? 0}</span>
//         //                 <span>{emp.attendance[month]?.HD ?? 0}</span>
//         //                 <span>{emp.attendance[month]?.AB ?? 0}</span>
//         //                 <span className="font-bold">
//         //                   {emp.attendance[month]?.Total ?? 0}
//         //                 </span>
//         //               </div>
//         //             </td>
//         //           ))}
//         //         </tr>
//         //       ))}
//         //     </tbody>
//         //   </table>
//         // </div>
//         <div className="border rounded-md overflow-x-auto">
//   <table className="min-w-max divide-y divide-gray-200 text-sm">
//     <thead className="bg-gray-50">
//       <tr>
//         <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
//           #
//         </th>
//         <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
//           Employee Name
//         </th>
//         {months.map((month) => (
//           <th
//             key={month}
//             className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider border-l min-w-[180px]"
//           >
//             {month}
//             <div className="grid grid-cols-7 gap-1 mt-1 font-normal text-center">
//               <span>P</span>
//               <span>W</span>
//               <span>H</span>
//               <span>L</span>
//               <span>HD</span>
//               <span>AB</span>
//               <span className="font-bold">All</span>
//             </div>
//           </th>
//         ))}
//       </tr>
//     </thead>
//     <tbody className="bg-white divide-y divide-gray-200">
//       {employees.map((emp) => (
//         <tr key={emp.id} className="hover:bg-gray-50">
//           <td className="px-4 py-3 whitespace-nowrap">
//             {emp.employeeId}
//           </td>
//           <td
//             className="px-4 py-3 whitespace-nowrap text-purple-700 font-medium cursor-pointer"
//             onClick={() => onSelectEmployee(emp)}
//           >
//             {emp.name}
//           </td>
//           {months.map((month) => (
//             <td
//               key={`${emp.id}-${month}`}
//               className="px-1 py-3 whitespace-nowrap border-l min-w-[180px]"
//             >
//               <div className="grid grid-cols-7 gap-1 text-center">
//                 <span>{emp.attendance[month]?.P ?? 0}</span>
//                 <span>{emp.attendance[month]?.W ?? 0}</span>
//                 <span>{emp.attendance[month]?.H ?? 0}</span>
//                 <span>{emp.attendance[month]?.L ?? 0}</span>
//                 <span>{emp.attendance[month]?.HD ?? 0}</span>
//                 <span>{emp.attendance[month]?.AB ?? 0}</span>
//                 <span className="font-bold">
//                   {emp.attendance[month]?.Total ?? 0}
//                 </span>
//               </div>
//             </td>
//           ))}
//         </tr>
//       ))}
//     </tbody>
//   </table>
// </div>

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
//         <button
//           onClick={onBack}
//           className="mb-4 text-purple-700 hover:text-purple-900 font-medium text-sm"
//         >
//           &larr; Back to Summary
//         </button>
//         <div className="flex justify-between items-center">
//           <h1 className="text-2xl font-semibold text-gray-800">
//             {`${employee.name} (${employee.employeeId})`}
//           </h1>
//         </div>
//         <div className="mt-4">
//           <AttendanceLegend />
//         </div>
//       </div>
//       {/* Calendar Table */}
//       <div className="overflow-x-auto border rounded-md">
//         <table className="min-w-full">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="w-24 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Month
//               </th>
//               {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
//                 <th
//                   key={day}
//                   className="w-8 text-center text-xs font-medium text-gray-500"
//                 >
//                   {day}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {calendarMonths.map((month) => (
//               <tr key={month} className="border-t">
//                 <td className="px-4 py-2 font-medium text-sm text-gray-800">
//                   {month}
//                 </td>
//                 {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
//                   const dayData = employee.attendanceByDay?.[month]?.find(
//                     (d) => d.day === day
//                   );
//                   const status = dayData?.status;
//                   const color = status
//                     ? attendanceConfig[status].color
//                     : "bg-white";
//                   return (
//                     <td key={day} className="text-center border-l">
//                       <div
//                         className={`w-full h-8 flex items-center justify-center ${color}`}
//                       ></div>
//                     </td>
//                   );
//                 })}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       {/* Leave Balance Table */}
//       <div>
//         <h2 className="text-xl font-semibold text-gray-700 mb-4">
//           Leave Balance And Details
//         </h2>
//         <Table
//           columns={leaveBalanceColumns}
//           data={employee.leaveBalance}
//           showSearch={false}
//           showPagination={false}
//         />
//       </div>
//       {/* Upcoming Leaves Table */}
//       <div>
//         <h2 className="text-xl font-semibold text-gray-700 mb-4">
//           Upcoming Requested Leaves
//         </h2>
//         <Table
//           columns={upcomingLeavesColumns}
//           data={employee.upcomingLeaves}
//           showSearch={false}
//           showPagination={false}
//         />
//       </div>
//     </div>
//   );
// };

// const AttendanceSummary = () => {
//   const dispatch: AppDispatch = useDispatch();
//   const { employees, selectedEmployee, loading, error } = useSelector(
//     (state: RootState) => state.attendance
//   );

//   const [view, setView] = useState<"list" | "detail">("list");
//   const [selectedYear, setSelectedYear] = useState<number | null>(null);
//   const [hasSearched, setHasSearched] = useState(false);

//   // Dynamically generate month strings based on the selected year to prevent data mismatch errors.
//   const months = selectedYear
//     ? calendarMonths.map((m) => `${m}-${selectedYear}`)
//     : [];

//   useEffect(() => {
//     setView(selectedEmployee ? "detail" : "list");
//   }, [selectedEmployee]);

//   // API call is now triggered by this handler, not on initial load
//   const handleYearChange = (year: number) => {
//     if (year !== selectedYear) {
//       dispatch(clearEmployees());
//       setSelectedYear(year);
//       setHasSearched(true);
//       dispatch(getYearlyAttendance({ year }));
//     }
//   };

//   const handleSelectEmployee = (employee: EmployeeDetail) => {
//     if (selectedYear) {
//       dispatch(
//         getEmployeeAttendance({ code: employee.employeeId, year: selectedYear })
//       );
//     }
//   };

//   const handleGoBack = () => {
//     dispatch(clearSelectedEmployee());
//   };

//   return (
//     <div className="p-4 sm:p-6 lg:p-8 w-[96rem]">
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
//         <AttendanceDetailView
//           employee={selectedEmployee}
//           onBack={handleGoBack}
//         />
//       ) : (
//         <div className="p-8 text-center text-gray-600">
//           Loading Employee Details...
//         </div>
//       )}
//     </div>
//   );
// };

// export default AttendanceSummary;


import { useState, useEffect } from "react";
import Table, { type Column } from "../../../components/common/Table";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast"; // Import react-hot-toast
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
} from "../../../store/slice/attendanceSlice";

const calendarMonths = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// --- HELPER COMPONENTS ---
const attendanceConfig: Record<
  AttendanceStatus,
  { color: string; label: string }
> = {
  P: { color: "bg-green-500", label: "Present" },
  W: { color: "bg-yellow-400", label: "WeekOff" },
  L: { color: "bg-red-500", label: "Leave" },
  HD: { color: "bg-blue-500", label: "HalfDay" },
  H: { color: "bg-cyan-400", label: "Holiday" },
  AB: { color: "bg-gray-400", label: "Absent" },
};

const AttendanceLegend = () => (
  <div className="flex flex-wrap gap-x-4 gap-y-2 items-center text-sm text-gray-700">
    {Object.entries(attendanceConfig).map(([key, { color, label }]) => (
      <div key={key} className="flex items-center gap-2">
        <span className={`w-4 h-4 rounded-sm ${color}`}></span>
        <span>{`${key}-${label}`}</span>
      </div>
    ))}
  </div>
);

// --- MAIN VIEWS ---

const AttendanceListView = ({
  employees,
  onSelectEmployee,
  selectedYear,
  onYearChange,
  months,
  loading,
  error,
  hasSearched,
}: {
  employees: EmployeeDetail[];
  onSelectEmployee: (employee: EmployeeDetail) => void;
  selectedYear: number | null;
  onYearChange: (year: number) => void;
  months: string[];
  loading: boolean;
  error: string | null;
  hasSearched: boolean;
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Employees Attendance List
          </h1>
        </div>
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
            <option value="" disabled>
              Select a Year
            </option>
            <option value={2025}>2025</option>
            <option value={2024}>2024</option>
            <option value={2023}>2023</option>
            <option value={2022}>2022</option>
            <option value={2021}>2021</option>
          </select>
        </div>
      </div>

      {/* Conditional Rendering for Data */}
      {!hasSearched ? (
        <div className="text-center py-16 text-gray-500">
          <p>Please select a year to view the attendance report.</p>
        </div>
      ) : loading ? (
        <div className="text-center py-16 text-gray-600">
          Loading Employees...
        </div>
      ) : error ? (
        <div className="text-center py-16 text-red-500">Error: {error}</div>
      ) : employees.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          No attendance records found for the selected year.
        </div>
      ) : (
        <div className="border rounded-md overflow-x-auto">
          <table className="min-w-max divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                  #
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                  Employee Name
                </th>
                {months.map((month) => (
                  <th
                    key={month}
                    className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider border-l min-w-[180px]"
                  >
                    {month}
                    <div className="grid grid-cols-7 gap-1 mt-1 font-normal text-center">
                      <span>P</span>
                      <span>W</span>
                      <span>H</span>
                      <span>L</span>
                      <span>HD</span>
                      <span>AB</span>
                      <span className="font-bold">All</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    {emp.employeeId}
                  </td>
                  <td
                    className="px-4 py-3 whitespace-nowrap text-purple-700 font-medium cursor-pointer"
                    onClick={() => onSelectEmployee(emp)}
                  >
                    {emp.name}
                  </td>
                  {months.map((month) => (
                    <td
                      key={`${emp.id}-${month}`}
                      className="px-1 py-3 whitespace-nowrap border-l min-w-[180px]"
                    >
                      <div className="grid grid-cols-7 gap-1 text-center">
                        <span>{emp.attendance[month]?.P ?? 0}</span>
                        <span>{emp.attendance[month]?.W ?? 0}</span>
                        <span>{emp.attendance[month]?.H ?? 0}</span>
                        <span>{emp.attendance[month]?.L ?? 0}</span>
                        <span>{emp.attendance[month]?.HD ?? 0}</span>
                        <span>{emp.attendance[month]?.AB ?? 0}</span>
                        <span className="font-bold">
                          {emp.attendance[month]?.Total ?? 0}
                        </span>
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-6">
        <AttendanceLegend />
      </div>
    </div>
  );
};

const AttendanceDetailView = ({
  employee,
  onBack,
}: {
  employee: EmployeeDetail;
  onBack: () => void;
}) => {
  const leaveBalanceColumns: Column<LeaveBalance>[] = [
    { key: "id", header: "#" },
    { key: "period", header: "Period" },
    { key: "type", header: "Type" },
    { key: "allowed", header: "Allowed Leaves" },
    { key: "taken", header: "Leaves Taken" },
    { key: "unpaid", header: "Unpaid Leaves" },
    { key: "balance", header: "Balance" },
  ];

  const upcomingLeavesColumns: Column<UpcomingLeave>[] = [
    { key: "id", header: "#" },
    { key: "period", header: "Period" },
    { key: "name", header: "Name" },
  ];
  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-8">
      <div>
        <button
          onClick={onBack}
          className="mb-4 text-purple-700 hover:text-purple-900 font-medium text-sm"
        >
          &larr; Back to Summary
        </button>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">
            {`${employee.name} (${employee.employeeId})`}
          </h1>
        </div>
        <div className="mt-4">
          <AttendanceLegend />
        </div>
      </div>
      {/* Calendar Table */}
      <div className="overflow-x-auto border rounded-md">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-24 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Month
              </th>
              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                <th
                  key={day}
                  className="w-8 text-center text-xs font-medium text-gray-500"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {calendarMonths.map((month) => (
              <tr key={month} className="border-t">
                <td className="px-4 py-2 font-medium text-sm text-gray-800">
                  {month}
                </td>
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                  const dayData = employee.attendanceByDay?.[month]?.find(
                    (d) => d.day === day
                  );
                  const status = dayData?.status;
                  const color = status
                    ? attendanceConfig[status].color
                    : "bg-white";
                  return (
                    <td key={day} className="text-center border-l">
                      <div
                        className={`w-11 h-8 flex items-center justify-center ${color} m-0.5`} 
                      ></div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Leave Balance Table */}
      <div>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Leave Balance And Details
        </h2>
        <Table
          columns={leaveBalanceColumns}
          data={employee.leaveBalance}
          showSearch={false}
          showPagination={false}
        />
      </div>
      {/* Upcoming Leaves Table */}
      <div>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Upcoming Requested Leaves
        </h2>
        <Table
          columns={upcomingLeavesColumns}
          data={employee.upcomingLeaves}
          showSearch={false}
          showPagination={false}
        />
      </div>
    </div>
  );
};

const AttendanceSummary = () => {
  const dispatch: AppDispatch = useDispatch();
  const { employees, selectedEmployee, loading, error } = useSelector(
    (state: RootState) => state.attendance
  );

  const [view, setView] = useState<"list" | "detail">("list");
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Dynamically generate month strings based on the selected year to prevent data mismatch errors.
  const months = selectedYear
    ? calendarMonths.map((m) => `${m}-${selectedYear}`)
    : [];

  useEffect(() => {
    setView(selectedEmployee ? "detail" : "list");
  }, [selectedEmployee]);

  // API call is now triggered by this handler, not on initial load
  const handleYearChange = (year: number) => {
    if (year !== selectedYear) {
      dispatch(clearEmployees());
      setSelectedYear(year);
      setHasSearched(true);
      // Use toast.promise to handle async state automatically
      const promise = dispatch(getYearlyAttendance({ year }));
      toast.promise(
        promise,
        {
          loading: "Fetching attendance report...",
          success: "Report loaded successfully!",
          error: "Failed to load the report. Please try again.",
        },
        {
          // Optional: Add custom styling
          success: {
            className: "bg-green-100 text-green-800",
          },
          error: {
            className: "bg-red-100 text-red-800",
          },
        }
      );
    }
  };

  const handleSelectEmployee = (employee: EmployeeDetail) => {
    if (selectedYear) {
      // Use toast.promise to handle the loading/success/error states
      const promise = dispatch(
        getEmployeeAttendance({ code: employee.employeeId, year: selectedYear })
      );
      toast.promise(
        promise,
        {
          loading: `Fetching details for ${employee.name}...`,
          success: `Details for ${employee.name} loaded successfully!`,
          error: `Failed to load details for ${employee.name}.`,
        },
        {
          success: {
            className: "bg-blue-50 text-blue-800",
          },
          error: {
            className: "bg-red-100 text-red-800",
          },
        }
      );
    }
  };

  const handleGoBack = () => {
    dispatch(clearSelectedEmployee());
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-[97rem]">
      {view === "list" ? (
        <AttendanceListView
          employees={employees}
          onSelectEmployee={handleSelectEmployee}
          selectedYear={selectedYear}
          onYearChange={handleYearChange}
          months={months}
          loading={loading}
          error={error}
          hasSearched={hasSearched}
        />
      ) : selectedEmployee ? (
        <AttendanceDetailView
          employee={selectedEmployee}
          onBack={handleGoBack}
        />
      ) : (
        <div className="p-8 text-center text-gray-600">
          Loading Employee Details...
        </div>
      )}
    </div>
  );
};

export default AttendanceSummary;