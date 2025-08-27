// import React, { useState, useEffect, useRef, type ReactNode } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import {
//   MoreHorizontal,
//   Filter,
//   Eye,
//   Pencil,
//   X,
//   ChevronUp,
//   ChevronDown,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// // --- COMPONENT IMPORTS ---
// import Table, { type Column } from "../../components/common/Table";
// import LoanConfirmationModal from "../../features/EmployeeSetup/list/common/LoanConfirmationModal"; // 1. IMPORT THE MODAL
// import { type FormField } from "../../components/common/GenericForm"; // Import FormField type

// // --- REDUX IMPORTS ---
// import { type RootState, type AppDispatch } from "../../store/store";
// import {
//   fetchLoans,
//   approveLoan,
//   cancelLoan,
//   type Loan,
// } from "../../store/slice/loanAndAdvancesSlice";

// // --- TYPE DEFINITIONS ---
// type Status = "Approved" | "Canceled" | "Pending" | "Paid" | "Declined";

// interface FilterState {
//   startDate: string;
//   endDate: string;
//   statuses: Status[];
// }

// // --- FORM FIELD DEFINITIONS for LoanConfirmationModal ---
// const approveLoanFields: FormField[] = [
//   {
//     name: "amountApp",
//     label: "Approved Amount",
//     type: "number",
//     required: true,
//   },
//   {
//     name: "installment",
//     label: "Installments",
//     type: "number",
//     required: true,
//   },
//   {
//     name: "date",
//     label: "Payment Release Date",
//     type: "date",
//     required: true,
//   },
//   { name: "staffNote", label: "Staff Note", type: "textarea", spanFull: true },
// ];

// const declineLoanFields: FormField[] = [
//   {
//     name: "cancelReason",
//     label: "Reason for Decline",
//     type: "textarea",
//     required: true,
//     spanFull: true,
//   },
// ];

// // --- HELPER COMPONENTS ---

// // Generic Detail Item for the Modal
// const DetailItem: React.FC<{ label: string; value: ReactNode }> = ({
//   label,
//   value,
// }) => (
//   <div className="flex justify-between items-start py-2 border-b border-gray-100 last:border-b-0">
//     <span className="text-sm text-gray-500">{label}</span>
//     <span className="text-sm font-semibold text-gray-800 text-right">
//       {value}
//     </span>
//   </div>
// );

// // Loan Detail View Modal (Now simpler, it just triggers actions)
// const LoanDetailView: React.FC<{
//   loan: Loan;
//   onClose: () => void;
//   onApprove: () => void; // Simplified: just triggers the next step
//   onDecline: () => void; // Simplified: just triggers the next step
// }> = ({ loan, onClose, onApprove, onDecline }) => {
//   return (
//     <div
//       className="fixed inset-0 bg-black bg-opacity-30 z-40"
//       onClick={onClose}
//     >
//       <div
//         className="absolute top-0 right-0 h-full w-full max-w-lg bg-white shadow-2xl flex flex-col"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="relative flex items-center justify-center p-6 border-b border-gray-200">
//           <h2 className="text-xl font-bold text-slate-800">
//             Loan {loan.requestedAmount} Requested
//           </h2>
//           <button
//             onClick={onClose}
//             className="absolute right-6 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
//           >
//             <X size={20} />
//           </button>
//         </div>
//         <div className="flex-grow overflow-y-auto px-6 py-4">
//           <div className="bg-gray-50 p-4 rounded-md">
//             <h3 className="text-md font-semibold text-gray-700 mb-2">
//               Loan & Advance Details
//             </h3>
//             <DetailItem label="Employee" value={loan.employeeName} />
//             <DetailItem label="Requested Date" value={loan.requestDate} />
//             <DetailItem
//               label="Status"
//               value={<StatusBadge status={loan.status} />}
//             />
//             <DetailItem label="Amount Requested" value={loan.requestedAmount} />
//             <DetailItem label="Approved Amount" value={loan.approvedAmount} />
//             <DetailItem label="Balance" value={loan.balance} />
//             <DetailItem label="Installments" value={loan.installments} />
//             <DetailItem label="Approved By" value={loan.approvedBy || "--"} />
//             <DetailItem label="Staff Notes" value={loan.staffNote || "--"} />
//             <DetailItem label="Notes" value={loan.note || "--"} />
//           </div>
//           <div className="mt-6 border-t border-gray-200 pt-4">
//             <h3 className="text-md font-semibold text-gray-700 mb-2">
//               Activities
//             </h3>
//             <p className="text-sm text-gray-500">--</p>
//           </div>
//         </div>

//         {loan.status === "Pending" && (
//           <div className="flex items-center justify-end gap-4 p-6 border-t border-gray-200">
//             <button
//               onClick={onDecline} // Now calls the handler passed via props
//               className="py-2.5 px-6 font-semibold bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
//             >
//               Decline
//             </button>
//             <button
//               onClick={onApprove} // Now calls the handler passed via props
//               className="py-2.5 px-6 font-semibold text-white bg-[#741CDD] rounded-md hover:bg-[#5f3dbb] transition-colors"
//             >
//               Approve
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// const StatusBadge: React.FC<{ status: Status }> = ({ status }) => {
//   const baseClasses =
//     "px-3 py-1 text-xs font-semibold rounded-full inline-block";
//   const statusClasses = {
//     Approved: "bg-green-100 text-green-800",
//     Canceled: "bg-red-100 text-red-800",
//     Declined: "bg-red-100 text-red-800",
//     Pending: "bg-yellow-100 text-yellow-800",
//     Paid: "bg-blue-100 text-blue-800",
//   };
//   return (
//     <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>
//   );
// };

// const ActionMenu: React.FC<{
//   loan: Loan;
//   activeMenuId: string | null;
//   onToggle: (id: string) => void;
//   onViewDetails: (loan: Loan) => void;
// }> = ({ loan, activeMenuId, onToggle, onViewDetails }) => {
//   const navigate = useNavigate();
//   const isActive = activeMenuId === loan.id;

//   const handleEditDetails = () => {
//     navigate(`/loanandandvance/list/detail/${loan.id}`, { state: { loan } });
//   };

//   if (isActive) {
//     return (
//       <div className="absolute right-0 z-10 mt-2 w-32 bg-white border border-gray-200 rounded shadow-lg">
//         <button
//           onClick={() => onViewDetails(loan)}
//           className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//         >
//           <Eye size={16} className="mr-2" /> View Details
//         </button>
//         {loan.status === "Pending" && (
//           <button
//             onClick={handleEditDetails}
//             className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//           >
//             <Pencil size={16} className="mr-2" /> Edit
//           </button>
//         )}
//       </div>
//     );
//   }
//   return (
//     <button
//       onClick={() => onToggle(loan.id)}
//       className="p-2 rounded-full hover:bg-gray-200"
//     >
//       <MoreHorizontal size={20} />
//     </button>
//   );
// };

// const FilterModal: React.FC<{
//   isOpen: boolean;
//   onClose: () => void;
//   onApply: (filters: FilterState) => void;
// }> = ({ isOpen, onClose, onApply }) => {
//   const allStatuses: Status[] = [
//     "Approved",
//     "Canceled",
//     "Pending",
//     "Paid",
//     "Declined",
//   ];
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [selectedStatuses, setSelectedStatuses] = useState<Status[]>([]);
//   const [isDateOpen, setIsDateOpen] = useState(true);
//   const [isStatusOpen, setIsStatusOpen] = useState(true);

//   const handleStatusChange = (status: Status) => {
//     setSelectedStatuses((prev) =>
//       prev.includes(status)
//         ? prev.filter((s) => s !== status)
//         : [...prev, status]
//     );
//   };

//   const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.checked) {
//       setSelectedStatuses(allStatuses);
//     } else {
//       setSelectedStatuses([]);
//     }
//   };

//   const handleApply = () => {
//     onApply({ startDate, endDate, statuses: selectedStatuses });
//     onClose();
//   };

//   const handleClear = () => {
//     setStartDate("");
//     setEndDate("");
//     setSelectedStatuses([]);
//     onApply({ startDate: "", endDate: "", statuses: [] });
//   };

//   if (!isOpen) return null;

//   return (
//     <div
//       className="fixed inset-0 bg-black bg-opacity-30 z-40"
//       onClick={onClose}
//     >
//       <div
//         className="absolute top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl flex flex-col"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="flex justify-between items-center p-6 border-b">
//           <h2 className="text-lg font-semibold text-gray-800">Filter</h2>
//           <button
//             onClick={onClose}
//             className="p-1 rounded-full hover:bg-gray-200"
//           >
//             <X size={20} />
//           </button>
//         </div>
//         <div className="p-6 space-y-4 flex-grow overflow-y-auto">
//           <div className="border-b pb-4">
//             <button
//               onClick={() => setIsDateOpen(!isDateOpen)}
//               className="w-full flex justify-between items-center"
//             >
//               <h3 className="text-sm font-semibold text-gray-700">
//                 Requested Date
//               </h3>
//               {isDateOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//             </button>
//             {isDateOpen && (
//               <div className="mt-4 space-y-3">
//                 <input
//                   type="date"
//                   value={startDate}
//                   onChange={(e) => setStartDate(e.target.value)}
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#741CDD] focus:border-transparent"
//                 />
//                 <input
//                   type="date"
//                   value={endDate}
//                   onChange={(e) => setEndDate(e.target.value)}
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#741CDD] focus:border-transparent"
//                 />
//               </div>
//             )}
//           </div>
//           <div>
//             <button
//               onClick={() => setIsStatusOpen(!isStatusOpen)}
//               className="w-full flex justify-between items-center"
//             >
//               <h3 className="text-sm font-semibold text-gray-700">Status</h3>
//               {isStatusOpen ? (
//                 <ChevronUp size={18} />
//               ) : (
//                 <ChevronDown size={18} />
//               )}
//             </button>
//             {isStatusOpen && (
//               <div className="mt-4 space-y-3">
//                 <label className="flex items-center justify-between w-full">
//                   <span className="text-sm text-gray-700">All</span>
//                   <input
//                     type="checkbox"
//                     checked={selectedStatuses.length === allStatuses.length}
//                     onChange={handleSelectAll}
//                     className="h-4 w-4 rounded border-gray-300 text-[#741CDD] focus:ring-[#741CDD]"
//                   />
//                 </label>
//                 {allStatuses.map((status) => (
//                   <label
//                     key={status}
//                     className="flex items-center justify-between w-full"
//                   >
//                     <span className="text-sm text-gray-700">{status}</span>
//                     <input
//                       type="checkbox"
//                       checked={selectedStatuses.includes(status)}
//                       onChange={() => handleStatusChange(status)}
//                       className="h-4 w-4 rounded border-gray-300 text-[#741CDD] focus:ring-[#741CDD]"
//                     />
//                   </label>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//         <div className="p-6 bg-white border-t flex justify-end space-x-3">
//           <button
//             onClick={handleClear}
//             className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-100"
//           >
//             CLEAR
//           </button>
//           <button
//             onClick={handleApply}
//             className="px-6 py-2 bg-[#741CDD] text-white rounded-lg text-sm font-semibold hover:opacity-90"
//           >
//             APPLY
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const Pagination: React.FC<{
//   currentPage: number;
//   totalPages: number;
//   totalItems: number;
//   itemsPerPage: number;
//   onPageChange: (page: number) => void;
// }> = ({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange }) => {
//   if (totalPages <= 1) return null;

//   const startItem = (currentPage - 1) * itemsPerPage + 1;
//   const endItem = Math.min(currentPage * itemsPerPage, totalItems);

//   return (
//     <div className="flex justify-between items-center mt-4 text-sm text-gray-700">
//       <span>
//         Showing {startItem} to {endItem} of {totalItems} items
//       </span>
//       <div className="flex space-x-1">
//         <button
//           onClick={() => onPageChange(currentPage - 1)}
//           disabled={currentPage === 1}
//           className="px-3 py-1 border rounded bg-white hover:bg-gray-100 disabled:opacity-50"
//         >
//           Previous
//         </button>
//         {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//           <button
//             key={page}
//             onClick={() => onPageChange(page)}
//             className={`px-3 py-1 border rounded ${
//               currentPage === page
//                 ? "bg-[#741CDD] text-white"
//                 : "bg-white hover:bg-gray-100"
//             }`}
//           >
//             {page}
//           </button>
//         ))}
//         <button
//           onClick={() => onPageChange(currentPage + 1)}
//           disabled={currentPage === totalPages}
//           className="px-3 py-1 border rounded bg-white hover:bg-gray-100 disabled:opacity-50"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// // --- MAIN PAGE COMPONENT ---
// const DisplayLoans: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { loans, status, error, totalPages, totalItems } = useSelector(
//     (state: RootState) => state.loans
//   );

//   const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
//   const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [currentFilters, setCurrentFilters] = useState<
//     Omit<FilterState, "statuses"> & { statuses?: string[] }
//   >({});
//   const tableContainerRef = useRef<HTMLDivElement>(null);

//   // 2. ADD STATE FOR THE CONFIRMATION MODAL
//   const [confirmingLoan, setConfirmingLoan] = useState<Loan | null>(null);
//   const [confirmationAction, setConfirmationAction] = useState<
//     "approve" | "decline" | null
//   >(null);

//   useEffect(() => {
//     dispatch(
//       fetchLoans({ page: currentPage, limit: itemsPerPage, ...currentFilters })
//     );
//   }, [dispatch, currentPage, itemsPerPage, currentFilters]);

//   // --- HANDLER FUNCTIONS ---

//   const handleApplyFilters = (filters: FilterState) => {
//     setCurrentPage(1);
//     setCurrentFilters({
//       startDate: filters.startDate,
//       endDate: filters.endDate,
//       statuses: filters.statuses,
//     });
//   };

//   const handleToggleMenu = (id: string) => {
//     setActiveMenuId((prevId) => (prevId === id ? null : id));
//   };

//   const handleViewDetails = (loan: Loan) => {
//     setSelectedLoan(loan);
//     setActiveMenuId(null);
//   };

//   const handleCloseDetails = () => {
//     setSelectedLoan(null);
//   };

//   // 3. CREATE HANDLERS TO INITIATE THE CONFIRMATION FLOW
//   const handleInitiateApproval = () => {
//     if (!selectedLoan) return;
//     setConfirmingLoan(selectedLoan);
//     setConfirmationAction("approve");
//     handleCloseDetails(); // Close the first modal
//   };

//   const handleInitiateDecline = () => {
//     if (!selectedLoan) return;
//     setConfirmingLoan(selectedLoan);
//     setConfirmationAction("decline");
//     handleCloseDetails(); // Close the first modal
//   };

//   // 4. CREATE THE FINAL SUBMISSION HANDLER
//   const handleConfirmationSubmit = (data: Record<string, any>) => {
//     if (!confirmingLoan || !confirmationAction) return;

//     if (confirmationAction === "approve") {
//       const approvalPayload = {
//         loanId: confirmingLoan.id,
//         amountApp: String(data.amountApp),
//         installment: String(data.installment),
//         date: data.date,
//         staffNote: data.staffNote,
//       };
//       dispatch(approveLoan(approvalPayload));
//     } else if (confirmationAction === "decline") {
//       const declinePayload = {
//         loanId: confirmingLoan.id,
//         cancelReason: data.cancelReason,
//       };
//       dispatch(cancelLoan(declinePayload));
//     }

//     // Reset state to close the confirmation modal
//     setConfirmingLoan(null);
//     setConfirmationAction(null);
//   };

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         tableContainerRef.current &&
//         !tableContainerRef.current.contains(event.target as Node)
//       ) {
//         setActiveMenuId(null);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const columns: Column<Loan>[] = [
//     {
//       key: "employeeName",
//       header: "Employee",
//       render: (row: Loan) => (
//         <div>
//           <div className="font-semibold">{row.employeeName}</div>
//           <div className="text-xs text-gray-500">on {row.requestDate}</div>
//         </div>
//       ),
//     },
//     { key: "requestedAmount", header: "Requested Amt" },
//     {
//       key: "status",
//       header: "Status",
//       render: (row: Loan) => <StatusBadge status={row.status} />,
//     },
//     { key: "approvedAmount", header: "Approved Amt" },
//     { key: "installments", header: "Installments" },
//     { key: "balance", header: "Balance" },
//     {
//       key: "action",
//       header: "Action",
//       className: "text-right",
//       render: (row: Loan) => {
//         if (["Approved", "Pending", "Declined"].includes(row.status)) {
//           return (
//             <div className="relative flex justify-end">
//               <ActionMenu
//                 loan={row}
//                 activeMenuId={activeMenuId}
//                 onToggle={handleToggleMenu}
//                 onViewDetails={handleViewDetails}
//               />
//             </div>
//           );
//         }
//         return null;
//       },
//     },
//   ];

//   // 5. CREATE THE RENDER FUNCTION FOR THE CONFIRMATION MODAL
//   const renderConfirmationModal = () => {
//     if (!confirmingLoan || !confirmationAction) return null;

//     const isApproving = confirmationAction === "approve";

//     // The initial state for amount comes from 'requestedAmount' but needs parsing
//     const numericRequestedAmount = Number(
//       confirmingLoan.requestedAmount.replace(/[^0-9.-]+/g, "")
//     );

//     return (
//       <LoanConfirmationModal
//         isOpen={true}
//         onClose={() => setConfirmingLoan(null)}
//         loan={{
//           ...confirmingLoan,
//           amountReq: confirmingLoan.requestedAmount.replace(/₹\s?/, ""),
//         }}
//         onConfirm={handleConfirmationSubmit}
//         onCancel={() => setConfirmingLoan(null)}
//         formFields={isApproving ? approveLoanFields : declineLoanFields}
//         initialState={
//           isApproving
//             ? {
//                 amountApp: numericRequestedAmount, // Use parsed numeric value
//                 installment: confirmingLoan.installments || "",
//                 date: "",
//                 staffNote: confirmingLoan.staffNote || "",
//               }
//             : { cancelReason: "" }
//         }
//         title={isApproving ? "Approve Loan Request" : "Decline Loan Request"}
//         message={
//           isApproving
//             ? "You can change loan amount and number of installments before approving this request."
//             : "Please provide a reason for declining this loan request."
//         }
//         confirmButtonText={isApproving ? "Approve" : "Decline"}
//         cancelButtonText="Cancel"
//       />
//     );
//   };

//   return (
//     <div className="p-8 bg-gray-50 min-h-screen font-sans">
//       <header className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">Loans & Advances</h1>
//         <p className="text-sm text-gray-500">
//           Dashboard / Employee Loans & Advances
//         </p>
//       </header>
//       <div ref={tableContainerRef}>
//         <div className="flex justify-end mb-4">
//           <button
//             onClick={() => setIsFilterOpen(true)}
//             className="p-2 rounded-full"
//             style={{ backgroundColor: "#741CDD" }}
//           >
//             <Filter size={20} className="text-white" />
//           </button>
//         </div>

//         {status === "loading" && (
//           <div className="text-center p-4">Loading...</div>
//         )}
//         {status === "failed" && (
//           <div className="text-center p-4 text-red-500">Error: {error}</div>
//         )}
//         {status === "succeeded" && (
//           <>
//             <Table
//               data={loans}
//               columns={columns}
//               showSearch={false}
//               showPagination={false}
//             />
//             <Pagination
//               currentPage={currentPage}
//               totalPages={totalPages}
//               totalItems={totalItems}
//               itemsPerPage={itemsPerPage}
//               onPageChange={setCurrentPage}
//             />
//           </>
//         )}
//       </div>
//       <FilterModal
//         isOpen={isFilterOpen}
//         onClose={() => setIsFilterOpen(false)}
//         onApply={handleApplyFilters}
//       />
//       {selectedLoan && (
//         <LoanDetailView
//           loan={selectedLoan}
//           onClose={handleCloseDetails}
//           onApprove={handleInitiateApproval}
//           onDecline={handleInitiateDecline}
//         />
//       )}
//       {/* 6. RENDER THE MODAL */}
//       {renderConfirmationModal()}
//     </div>
//   );
// };

// export default DisplayLoans;
// src/pages/loan/displayLoans.tsx

// import React, { useState, useEffect, useRef, type ReactNode } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import {
//   MoreHorizontal,
//   Filter,
//   Eye,
//   Pencil,
//   X,
//   ChevronUp,
//   ChevronDown,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// // --- COMPONENT IMPORTS ---
// import Table, { type Column } from "../../components/common/Table";
// import LoanConfirmationModal from "../../features/EmployeeSetup/list/common/LoanConfirmationModal";
// import { type FormField } from "../../components/common/GenericForm";

// // --- REDUX IMPORTS ---
// import { type RootState, type AppDispatch } from "../../store/store";
// import {
//   fetchLoans,
//   approveLoan,
//   cancelLoan,
//   type Loan,
// } from "../../store/slice/loanAndAdvancesSlice";

// // --- TYPE DEFINITIONS ---
// type Status = "Approved" | "Pending" | "Paid" | "Declined";

// interface FilterState {
//   startDate: string;
//   endDate: string;
//   statuses: Status[];
// }

// // --- FORM FIELD DEFINITIONS for LoanConfirmationModal ---
// const approveLoanFields: FormField[] = [
//   {
//     name: "amountApp",
//     label: "Approved Amount",
//     type: "number",
//     required: true,
//   },
//   {
//     name: "installment",
//     label: "Installments",
//     type: "number",
//     required: true,
//   },
//   {
//     name: "date",
//     label: "Payment Release Date",
//     type: "date",
//     required: true,
//   },
//   { name: "staffNote", label: "Staff Note", type: "textarea", spanFull: true },
// ];

// const declineLoanFields: FormField[] = [
//   {
//     name: "cancelReason",
//     label: "Reason for Decline",
//     type: "textarea",
//     required: true,
//     spanFull: true,
//   },
// ];

// // --- HELPER COMPONENTS ---

// // Generic Detail Item for the Modal
// const DetailItem: React.FC<{ label: string; value: ReactNode }> = ({
//   label,
//   value,
// }) => (
//   <div className="flex justify-between items-start py-2 border-b border-gray-100 last:border-b-0">
//     <span className="text-sm text-gray-500">{label}</span>
//     <span className="text-sm font-semibold text-gray-800 text-right">
//       {value}
//     </span>
//   </div>
// );

// // Loan Detail View Modal
// const LoanDetailView: React.FC<{
//   loan: Loan;
//   onClose: () => void;
//   onApprove: () => void;
//   onDecline: () => void;
// }> = ({ loan, onClose, onApprove, onDecline }) => {
//   return (
//     <div
//       className="fixed inset-0 bg-black bg-opacity-30 z-40"
//       onClick={onClose}
//     >
//       <div
//         className="absolute top-0 right-0 h-full w-full max-w-lg bg-white shadow-2xl flex flex-col"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="relative flex items-center justify-center p-6 border-b border-gray-200">
//           <h2 className="text-xl font-bold text-slate-800">
//             Loan {loan.requestedAmount} Requested
//           </h2>
//           <button
//             onClick={onClose}
//             className="absolute right-6 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
//           >
//             <X size={20} />
//           </button>
//         </div>
//         <div className="flex-grow overflow-y-auto px-6 py-4">
//           <div className="bg-gray-50 p-4 rounded-md">
//             <h3 className="text-md font-semibold text-gray-700 mb-2">
//               Loan & Advance Details
//             </h3>
//             <DetailItem label="Employee" value={loan.employeeName} />
//             <DetailItem label="Requested Date" value={loan.requestDate} />
//             <DetailItem
//               label="Status"
//               value={<StatusBadge status={loan.status} />}
//             />
//             <DetailItem label="Amount Requested" value={loan.requestedAmount} />
//             <DetailItem label="Approved Amount" value={loan.approvedAmount} />
//             <DetailItem label="Balance" value={loan.balance} />
//             <DetailItem label="Installments" value={loan.installments} />
//             <DetailItem label="Approved By" value={loan.approvedBy || "--"} />
//             <DetailItem label="Staff Notes" value={loan.staffNote || "--"} />
//             <DetailItem label="Notes" value={loan.note || "--"} />
//           </div>
//           <div className="mt-6 border-t border-gray-200 pt-4">
//             <h3 className="text-md font-semibold text-gray-700 mb-2">
//               Activities
//             </h3>
//             <p className="text-sm text-gray-500">--</p>
//           </div>
//         </div>

//         {loan.status === "Pending" && (
//           <div className="flex items-center justify-end gap-4 p-6 border-t border-gray-200">
//             <button
//               onClick={onDecline}
//               className="py-2.5 px-6 font-semibold bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
//             >
//               Decline
//             </button>
//             <button
//               onClick={onApprove}
//               className="py-2.5 px-6 font-semibold text-white bg-[#741CDD] rounded-md hover:bg-[#5f3dbb] transition-colors"
//             >
//               Approve
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// const StatusBadge: React.FC<{ status: Status }> = ({ status }) => {
//   const baseClasses =
//     "px-3 py-1 text-xs font-semibold rounded-full inline-block";
//   const statusClasses = {
//     Approved: "bg-green-100 text-green-800",
//     Declined: "bg-red-100 text-red-800",
//     Pending: "bg-yellow-100 text-yellow-800",
//     Paid: "bg-blue-100 text-blue-800",
//   };
//   return (
//     <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>
//   );
// };

// const ActionMenu: React.FC<{
//   loan: Loan;
//   activeMenuId: string | null;
//   onToggle: (id: string) => void;
//   onViewDetails: (loan: Loan) => void;
// }> = ({ loan, activeMenuId, onToggle, onViewDetails }) => {
//   const navigate = useNavigate();
//   const isActive = activeMenuId === loan.id;

//   const handleEditDetails = () => {
//     navigate(`/loanandandvance/list/detail/${loan.id}`, { state: { loan } });
//   };

//   if (isActive) {
//     return (
//       <div className="absolute right-0 z-10 mt-2 w-32 bg-white border border-gray-200 rounded shadow-lg">
//         <button
//           onClick={() => onViewDetails(loan)}
//           className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//         >
//           <Eye size={16} className="mr-2" /> View Details
//         </button>
//         {loan.status === "Pending" && (
//           <button
//             onClick={handleEditDetails}
//             className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//           >
//             <Pencil size={16} className="mr-2" /> Edit
//           </button>
//         )}
//       </div>
//     );
//   }
//   return (
//     <button
//       onClick={() => onToggle(loan.id)}
//       className="p-2 rounded-full hover:bg-gray-200"
//     >
//       <MoreHorizontal size={20} />
//     </button>
//   );
// };

// const FilterModal: React.FC<{
//   isOpen: boolean;
//   onClose: () => void;
//   onApply: (filters: FilterState) => void;
// }> = ({ isOpen, onClose, onApply }) => {
//   const allStatuses: Status[] = ["Approved", "Pending", "Paid", "Declined"];
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [selectedStatuses, setSelectedStatuses] = useState<Status[]>([]);
//   const [isDateOpen, setIsDateOpen] = useState(true);
//   const [isStatusOpen, setIsStatusOpen] = useState(true);

//   const handleStatusChange = (status: Status) => {
//     setSelectedStatuses((prev) =>
//       prev.includes(status)
//         ? prev.filter((s) => s !== status)
//         : [...prev, status]
//     );
//   };

//   const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.checked) {
//       setSelectedStatuses(allStatuses);
//     } else {
//       setSelectedStatuses([]);
//     }
//   };

//   const handleApply = () => {
//     onApply({ startDate, endDate, statuses: selectedStatuses });
//     onClose();
//   };

//   const handleClear = () => {
//     setStartDate("");
//     setEndDate("");
//     setSelectedStatuses([]);
//     onApply({ startDate: "", endDate: "", statuses: [] });
//   };

//   if (!isOpen) return null;

//   return (
//     <div
//       className="fixed inset-0 bg-black bg-opacity-30 z-40"
//       onClick={onClose}
//     >
//       <div
//         className="absolute top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl flex flex-col"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="flex justify-between items-center p-6 border-b">
//           <h2 className="text-lg font-semibold text-gray-800">Filter</h2>
//           <button
//             onClick={onClose}
//             className="p-1 rounded-full hover:bg-gray-200"
//           >
//             <X size={20} />
//           </button>
//         </div>
//         <div className="p-6 space-y-4 flex-grow overflow-y-auto">
//           <div className="border-b pb-4">
//             <button
//               onClick={() => setIsDateOpen(!isDateOpen)}
//               className="w-full flex justify-between items-center"
//             >
//               <h3 className="text-sm font-semibold text-gray-700">
//                 Requested Date
//               </h3>
//               {isDateOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//             </button>
//             {isDateOpen && (
//               <div className="mt-4 space-y-3">
//                 <input
//                   type="date"
//                   value={startDate}
//                   onChange={(e) => setStartDate(e.target.value)}
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#741CDD] focus:border-transparent"
//                 />
//                 <input
//                   type="date"
//                   value={endDate}
//                   onChange={(e) => setEndDate(e.target.value)}
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#741CDD] focus:border-transparent"
//                 />
//               </div>
//             )}
//           </div>
//           <div>
//             <button
//               onClick={() => setIsStatusOpen(!isStatusOpen)}
//               className="w-full flex justify-between items-center"
//             >
//               <h3 className="text-sm font-semibold text-gray-700">Status</h3>
//               {isStatusOpen ? (
//                 <ChevronUp size={18} />
//               ) : (
//                 <ChevronDown size={18} />
//               )}
//             </button>
//             {isStatusOpen && (
//               <div className="mt-4 space-y-3">
//                 <label className="flex items-center justify-between w-full">
//                   <span className="text-sm text-gray-700">All</span>
//                   <input
//                     type="checkbox"
//                     checked={selectedStatuses.length === allStatuses.length}
//                     onChange={handleSelectAll}
//                     className="h-4 w-4 rounded border-gray-300 text-[#741CDD] focus:ring-[#741CDD]"
//                   />
//                 </label>
//                 {allStatuses.map((status) => (
//                   <label
//                     key={status}
//                     className="flex items-center justify-between w-full"
//                   >
//                     <span className="text-sm text-gray-700">{status}</span>
//                     <input
//                       type="checkbox"
//                       checked={selectedStatuses.includes(status)}
//                       onChange={() => handleStatusChange(status)}
//                       className="h-4 w-4 rounded border-gray-300 text-[#741CDD] focus:ring-[#741CDD]"
//                     />
//                   </label>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//         <div className="p-6 bg-white border-t flex justify-end space-x-3">
//           <button
//             onClick={handleClear}
//             className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-100"
//           >
//             CLEAR
//           </button>
//           <button
//             onClick={handleApply}
//             className="px-6 py-2 bg-[#741CDD] text-white rounded-lg text-sm font-semibold hover:opacity-90"
//           >
//             APPLY
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const Pagination: React.FC<{
//   currentPage: number;
//   totalPages: number;
//   totalItems: number;
//   itemsPerPage: number;
//   onPageChange: (page: number) => void;
// }> = ({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange }) => {
//   if (totalPages <= 1) return null;

//   const startItem = (currentPage - 1) * itemsPerPage + 1;
//   const endItem = Math.min(currentPage * itemsPerPage, totalItems);

//   return (
//     <div className="flex justify-between items-center mt-4 text-sm text-gray-700">
//       <span>
//         Showing {startItem} to {endItem} of {totalItems} items
//       </span>
//       <div className="flex space-x-1">
//         <button
//           onClick={() => onPageChange(currentPage - 1)}
//           disabled={currentPage === 1}
//           className="px-3 py-1 border rounded bg-white hover:bg-gray-100 disabled:opacity-50"
//         >
//           Previous
//         </button>
//         {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//           <button
//             key={page}
//             onClick={() => onPageChange(page)}
//             className={`px-3 py-1 border rounded ${
//               currentPage === page
//                 ? "bg-[#741CDD] text-white"
//                 : "bg-white hover:bg-gray-100"
//             }`}
//           >
//             {page}
//           </button>
//         ))}
//         <button
//           onClick={() => onPageChange(currentPage + 1)}
//           disabled={currentPage === totalPages}
//           className="px-3 py-1 border rounded bg-white hover:bg-gray-100 disabled:opacity-50"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// // --- MAIN PAGE COMPONENT ---
// const DisplayLoans: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { loans, status, error, totalPages, totalItems } = useSelector(
//     (state: RootState) => state.loans
//   );

//   const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
//   const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [currentFilters, setCurrentFilters] = useState<
//     Omit<FilterState, "statuses"> & { statuses?: string[] }
//   >({});
//   const tableContainerRef = useRef<HTMLDivElement>(null);

//   const [confirmingLoan, setConfirmingLoan] = useState<Loan | null>(null);
//   const [confirmationAction, setConfirmationAction] = useState<
//     "approve" | "decline" | null
//   >(null);

//   useEffect(() => {
//     dispatch(
//       fetchLoans({ page: currentPage, limit: itemsPerPage, ...currentFilters })
//     );
//   }, [dispatch, currentPage, itemsPerPage, currentFilters]);

//   const handleApplyFilters = (filters: FilterState) => {
//     setCurrentPage(1);
//     setCurrentFilters({
//       startDate: filters.startDate,
//       endDate: filters.endDate,
//       statuses: filters.statuses,
//     });
//   };

//   const handleToggleMenu = (id: string) => {
//     setActiveMenuId((prevId) => (prevId === id ? null : id));
//   };

//   const handleViewDetails = (loan: Loan) => {
//     setSelectedLoan(loan);
//     setActiveMenuId(null);
//   };

//   const handleCloseDetails = () => {
//     setSelectedLoan(null);
//   };

//   const handleInitiateApproval = () => {
//     if (!selectedLoan) return;
//     setConfirmingLoan(selectedLoan);
//     setConfirmationAction("approve");
//     handleCloseDetails();
//   };

//   const handleInitiateDecline = () => {
//     if (!selectedLoan) return;
//     setConfirmingLoan(selectedLoan);
//     setConfirmationAction("decline");
//     handleCloseDetails();
//   };

//   const handleConfirmationSubmit = (data: Record<string, any>) => {
//     if (!confirmingLoan || !confirmationAction) return;

//     if (confirmationAction === "approve") {
//       const approvalPayload = {
//         loanId: confirmingLoan.id,
//         amountApp: String(data.amountApp),
//         installment: String(data.installment),
//         date: data.date,
//         staffNote: data.staffNote,
//       };
//       dispatch(approveLoan(approvalPayload));
//     } else if (confirmationAction === "decline") {
//       const declinePayload = {
//         loanId: confirmingLoan.id,
//         cancelReason: data.cancelReason,
//       };
//       dispatch(cancelLoan(declinePayload));
//     }

//     setConfirmingLoan(null);
//     setConfirmationAction(null);
//   };

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         tableContainerRef.current &&
//         !tableContainerRef.current.contains(event.target as Node)
//       ) {
//         setActiveMenuId(null);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const columns: Column<Loan>[] = [
//     {
//       key: "employeeName",
//       header: "Employee",
//       render: (row: Loan) => (
//         <div>
//           <div className="font-semibold">{row.employeeName}</div>
//           <div className="text-xs text-gray-500">on {row.requestDate}</div>
//         </div>
//       ),
//     },
//     { key: "requestedAmount", header: "Requested Amt" },
//     {
//       key: "status",
//       header: "Status",
//       render: (row: Loan) => <StatusBadge status={row.status} />,
//     },
//     { key: "approvedAmount", header: "Approved Amt" },
//     { key: "installments", header: "Installments" },
//     { key: "balance", header: "Balance" },
//     {
//       key: "action",
//       header: "Action",
//       className: "text-right",
//       render: (row: Loan) => {
//         if (["Pending"].includes(row.status)) {
//           return (
//             <div className="relative flex justify-end">
//               <ActionMenu
//                 loan={row}
//                 activeMenuId={activeMenuId}
//                 onToggle={handleToggleMenu}
//                 onViewDetails={handleViewDetails}
//               />
//             </div>
//           );
//         }
//         return null;
//       },
//     },
//   ];

//   const renderConfirmationModal = () => {
//     if (!confirmingLoan || !confirmationAction) return null;

//     const isApproving = confirmationAction === "approve";

//     // The `loan` prop for LoanConfirmationModal was expecting LoanDetails, which had amountReq.
//     // The Loan type has requestedAmount, which is a formatted string like "₹ 50,000".
//     // We need to pass the unformatted number to the modal.
//     const numericRequestedAmount = Number(
//       confirmingLoan.requestedAmount.replace(/[^0-9.-]+/g, "")
//     );

//     return (
//       <LoanConfirmationModal
//         isOpen={true}
//         onClose={() => setConfirmingLoan(null)}
//         loan={{ amountReq: numericRequestedAmount }}
//         onConfirm={handleConfirmationSubmit}
//         onCancel={() => setConfirmingLoan(null)}
//         formFields={isApproving ? approveLoanFields : declineLoanFields}
//         initialState={
//           isApproving
//             ? {
//                 amountApp: numericRequestedAmount,
//                 installment: confirmingLoan.installments || "",
//                 date: "",
//                 staffNote: confirmingLoan.staffNote || "",
//               }
//             : { cancelReason: "" }
//         }
//         title={isApproving ? "Approve Loan Request" : "Decline Loan Request"}
//         message={
//           isApproving
//             ? "You can change loan amount and number of installments before approving this request."
//             : "Please provide a reason for declining this loan request."
//         }
//         confirmButtonText={isApproving ? "Approve" : "Decline"}
//         cancelButtonText="Cancel"
//       />
//     );
//   };

//   return (
//     <div className="p-8 bg-gray-50 min-h-screen font-sans">
//       <header className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">Loans & Advances</h1>
//         <p className="text-sm text-gray-500">
//           Dashboard / Employee Loans & Advances
//         </p>
//       </header>
//       <div ref={tableContainerRef}>
//         <div className="flex justify-end mb-4">
//           <button
//             onClick={() => setIsFilterOpen(true)}
//             className="p-2 rounded-full"
//             style={{ backgroundColor: "#741CDD" }}
//           >
//             <Filter size={20} className="text-white" />
//           </button>
//         </div>

//         {status === "loading" && (
//           <div className="text-center p-4">Loading...</div>
//         )}
//         {status === "failed" && (
//           <div className="text-center p-4 text-red-500">Error: {error}</div>
//         )}
//         {status === "succeeded" && (
//           <>
//             <Table
//               data={loans}
//               columns={columns}
//               showSearch={false}
//               showPagination={false}
//             />
//             <Pagination
//               currentPage={currentPage}
//               totalPages={totalPages}
//               totalItems={totalItems}
//               itemsPerPage={itemsPerPage}
//               onPageChange={setCurrentPage}
//             />
//           </>
//         )}
//       </div>
//       <FilterModal
//         isOpen={isFilterOpen}
//         onClose={() => setIsFilterOpen(false)}
//         onApply={handleApplyFilters}
//       />
//       {selectedLoan && (
//         <LoanDetailView
//           loan={selectedLoan}
//           onClose={handleCloseDetails}
//           onApprove={handleInitiateApproval}
//           onDecline={handleInitiateDecline}
//         />
//       )}
//       {renderConfirmationModal()}
//     </div>
//   );
// };

// export default DisplayLoans;
// src/pages/loan/displayLoans.tsx

import React, { useState, useEffect, useRef, type ReactNode } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  MoreHorizontal,
  Filter,
  Eye,
  Pencil,
  X,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

// --- COMPONENT IMPORTS ---
import Table, { type Column } from "../../components/common/Table";
import LoanConfirmationModal from "../../features/EmployeeSetup/list/modal/LoanConfirmationModal";
import { type FormField } from "../../components/common/GenericForm";

// --- REDUX IMPORTS ---
import { type RootState, type AppDispatch } from "../../store/store";
import {
  fetchLoans,
  approveLoan,
  cancelLoan,
  type Loan,
} from "../../store/slice/loanAndAdvancesSlice";

// --- TYPE DEFINITIONS ---
type Status = "Approved" | "Pending" | "Paid" | "Declined";

interface FilterState {
  startDate: string;
  endDate: string;
  statuses: Status[];
}

// --- FORM FIELD DEFINITIONS for LoanConfirmationModal ---
const approveLoanFields: FormField[] = [
  {
    name: "amountApp",
    label: "Approved Amount",
    type: "number",
    required: true,
  },
  {
    name: "installment",
    label: "Installments",
    type: "number",
    required: true,
  },
  {
    name: "date",
    label: "Payment Release Date",
    type: "date",
    required: true,
  },
  { name: "staffNote", label: "Staff Note", type: "textarea", spanFull: true },
];

const declineLoanFields: FormField[] = [
  {
    name: "cancelReason",
    label: "Reason for Decline",
    type: "textarea",
    required: true,
    spanFull: true,
  },
];

// --- HELPER COMPONENTS ---

// Generic Detail Item for the Modal
const DetailItem: React.FC<{ label: string; value: ReactNode }> = ({
  label,
  value,
}) => (
  <div className="flex justify-between items-start py-2 border-b border-gray-100 last:border-b-0">
    <span className="text-sm text-gray-500">{label}</span>
    <span className="text-sm font-semibold text-gray-800 text-right">
      {value}
    </span>
  </div>
);

// Loan Detail View Modal
const LoanDetailView: React.FC<{
  loan: Loan;
  onClose: () => void;
  onApprove: () => void;
  onDecline: () => void;
}> = ({ loan, onClose, onApprove, onDecline }) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-30 z-40"
      onClick={onClose}
    >
      <div
        className="absolute top-0 right-0 h-full w-full max-w-lg bg-white shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative flex items-center justify-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-slate-800">
            Loan {loan.requestedAmount} Requested
          </h2>
          <button
            onClick={onClose}
            className="absolute right-6 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-grow overflow-y-auto px-6 py-4">
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-md font-semibold text-gray-700 mb-2">
              Loan & Advance Details
            </h3>
            <DetailItem label="Employee" value={loan.employeeName} />
            <DetailItem label="Requested Date" value={loan.requestDate} />
            <DetailItem
              label="Status"
              value={<StatusBadge status={loan.status} />}
            />
            <DetailItem label="Amount Requested" value={loan.requestedAmount} />
            <DetailItem label="Approved Amount" value={loan.approvedAmount} />
            <DetailItem label="Balance" value={loan.balance} />
            <DetailItem label="Installments" value={loan.installments} />
            <DetailItem label="Approved By" value={loan.approvedBy || "--"} />
            <DetailItem label="Staff Notes" value={loan.staffNote || "--"} />
            <DetailItem label="Notes" value={loan.note || "--"} />
          </div>
          <div className="mt-6 border-t border-gray-200 pt-4">
            <h3 className="text-md font-semibold text-gray-700 mb-2">
              Activities
            </h3>
            <p className="text-sm text-gray-500">--</p>
          </div>
        </div>

        {loan.status === "Pending" && (
          <div className="flex items-center justify-end gap-4 p-6 border-t border-gray-200">
            <button
              onClick={onDecline}
              className="py-2.5 px-6 font-semibold bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
            >
              Decline
            </button>
            <button
              onClick={onApprove}
              className="py-2.5 px-6 font-semibold text-white bg-[#741CDD] rounded-md hover:bg-[#5f3dbb] transition-colors"
            >
              Approve
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const StatusBadge: React.FC<{ status: Status }> = ({ status }) => {
  const baseClasses =
    "px-3 py-1 text-xs font-semibold rounded-full inline-block";
  const statusClasses = {
    Approved: "bg-green-100 text-green-800",
    Declined: "bg-red-100 text-red-800",
    Pending: "bg-yellow-100 text-yellow-800",
    Paid: "bg-blue-100 text-blue-800",
  };
  return (
    <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>
  );
};

const ActionMenu: React.FC<{
  loan: Loan;
  activeMenuId: string | null;
  onToggle: (id: string) => void;
  onViewDetails: (loan: Loan) => void;
}> = ({ loan, activeMenuId, onToggle, onViewDetails }) => {
  const navigate = useNavigate();
  const isActive = activeMenuId === loan.id;

  const handleEditDetails = () => {
    navigate(`/loanandandvance/list/detail/${loan.id}`, { state: { loan } });
  };

  if (isActive) {
    return (
      <div className="absolute right-0 z-10 mt-2 w-32 bg-white border border-gray-200 rounded shadow-lg">
        <button
          onClick={() => onViewDetails(loan)}
          className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          <Eye size={16} className="mr-2" /> View Details
        </button>
        {loan.status === "Pending" && (
          <button
            onClick={handleEditDetails}
            className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <Pencil size={16} className="mr-2" /> Edit
          </button>
        )}
      </div>
    );
  }
  return (
    <button
      onClick={() => onToggle(loan.id)}
      className="p-2 rounded-full hover:bg-gray-200"
    >
      <MoreHorizontal size={20} />
    </button>
  );
};

const FilterModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
}> = ({ isOpen, onClose, onApply }) => {
  const allStatuses: Status[] = ["Approved", "Pending", "Paid", "Declined"];
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<Status[]>([]);
  const [isDateOpen, setIsDateOpen] = useState(true);
  const [isStatusOpen, setIsStatusOpen] = useState(true);

  const handleStatusChange = (status: Status) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedStatuses(allStatuses);
    } else {
      setSelectedStatuses([]);
    }
  };

  const handleApply = () => {
    onApply({ startDate, endDate, statuses: selectedStatuses });
    onClose();
  };

  const handleClear = () => {
    setStartDate("");
    setEndDate("");
    setSelectedStatuses([]);
    onApply({ startDate: "", endDate: "", statuses: [] });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-30 z-40"
      onClick={onClose}
    >
      <div
        className="absolute top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Filter</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6 space-y-4 flex-grow overflow-y-auto">
          <div className="border-b pb-4">
            <button
              onClick={() => setIsDateOpen(!isDateOpen)}
              className="w-full flex justify-between items-center"
            >
              <h3 className="text-sm font-semibold text-gray-700">
                Requested Date
              </h3>
              {isDateOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {isDateOpen && (
              <div className="mt-4 space-y-3">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#741CDD] focus:border-transparent"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#741CDD] focus:border-transparent"
                />
              </div>
            )}
          </div>
          <div>
            <button
              onClick={() => setIsStatusOpen(!isStatusOpen)}
              className="w-full flex justify-between items-center"
            >
              <h3 className="text-sm font-semibold text-gray-700">Status</h3>
              {isStatusOpen ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </button>
            {isStatusOpen && (
              <div className="mt-4 space-y-3">
                <label className="flex items-center justify-between w-full">
                  <span className="text-sm text-gray-700">All</span>
                  <input
                    type="checkbox"
                    checked={selectedStatuses.length === allStatuses.length}
                    onChange={handleSelectAll}
                    className="h-4 w-4 rounded border-gray-300 text-[#741CDD] focus:ring-[#741CDD]"
                  />
                </label>
                {allStatuses.map((status) => (
                  <label
                    key={status}
                    className="flex items-center justify-between w-full"
                  >
                    <span className="text-sm text-gray-700">{status}</span>
                    <input
                      type="checkbox"
                      checked={selectedStatuses.includes(status)}
                      onChange={() => handleStatusChange(status)}
                      className="h-4 w-4 rounded border-gray-300 text-[#741CDD] focus:ring-[#741CDD]"
                    />
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="p-6 bg-white border-t flex justify-end space-x-3">
          <button
            onClick={handleClear}
            className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-100"
          >
            CLEAR
          </button>
          <button
            onClick={handleApply}
            className="px-6 py-2 bg-[#741CDD] text-white rounded-lg text-sm font-semibold hover:opacity-90"
          >
            APPLY
          </button>
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
    <div className="flex justify-between items-center mt-4 text-sm text-gray-700">
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
          className="px-3 py-1 border rounded bg-white hover:bg-gray-100 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---
const DisplayLoans: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loans, status, error, totalPages, totalItems } = useSelector(
    (state: RootState) => state.loans
  );

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  // const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentFilters, setCurrentFilters] = useState<
    Omit<FilterState, "statuses"> & { statuses?: string[] }
  >({});
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const [confirmingLoan, setConfirmingLoan] = useState<Loan | null>(null);
  const [confirmationAction, setConfirmationAction] = useState<
    "approve" | "decline" | null
  >(null);

  useEffect(() => {
    dispatch(
      fetchLoans({ page: currentPage, limit: itemsPerPage, ...currentFilters })
    );
  }, [dispatch, currentPage, itemsPerPage, currentFilters]);

  // const handleApplyFilters = (filters: FilterState) => {
  //   setCurrentPage(1);
  //   setCurrentFilters({
  //     startDate: filters.startDate,
  //     endDate: filters.endDate,
  //     statuses: filters.statuses,
  //   });
  // };
  const handleApplyFilters = (filters: FilterState) => {
    setSearchParams({ page: "1" }); // <-- Update the URL to reset to page 1
    setCurrentFilters({
      startDate: filters.startDate,
      endDate: filters.endDate,
      statuses: filters.statuses,
    });
  };

  const handleToggleMenu = (id: string) => {
    setActiveMenuId((prevId) => (prevId === id ? null : id));
  };
  const handlePageChange = (newPage: number) => {
    // This will update the URL (e.g., to '?page=2') and trigger a re-render
    setSearchParams({ page: String(newPage) });
  };

  const handleViewDetails = (loan: Loan) => {
    setSelectedLoan(loan);
    setActiveMenuId(null);
  };

  const handleCloseDetails = () => {
    setSelectedLoan(null);
  };

  const handleInitiateApproval = () => {
    if (!selectedLoan) return;
    setConfirmingLoan(selectedLoan);
    setConfirmationAction("approve");
    handleCloseDetails();
  };

  const handleInitiateDecline = () => {
    if (!selectedLoan) return;
    setConfirmingLoan(selectedLoan);
    setConfirmationAction("decline");
    handleCloseDetails();
  };

  const handleConfirmationSubmit = (data: Record<string, any>) => {
    if (!confirmingLoan || !confirmationAction) return;

    if (confirmationAction === "approve") {
      const approvalPayload = {
        loanId: confirmingLoan.id,
        amountApp: String(data.amountApp),
        installment: String(data.installment),
        date: data.date,
        staffNote: data.staffNote,
      };
      dispatch(approveLoan(approvalPayload));
    } else if (confirmationAction === "decline") {
      const declinePayload = {
        loanId: confirmingLoan.id,
        cancelReason: data.cancelReason,
      };
      dispatch(cancelLoan(declinePayload));
    }

    setConfirmingLoan(null);
    setConfirmationAction(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tableContainerRef.current &&
        !tableContainerRef.current.contains(event.target as Node)
      ) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const columns: Column<Loan>[] = [
    {
      key: "employeeName",
      header: "Employee",
      render: (row: Loan) => (
        <div>
          <div className="font-semibold">{row.employeeName}</div>
          <div className="text-xs text-gray-500">on {row.requestDate}</div>
        </div>
      ),
    },
    { key: "requestedAmount", header: "Requested Amt" },
    {
      key: "status",
      header: "Status",
      render: (row: Loan) => <StatusBadge status={row.status} />,
    },
    { key: "approvedAmount", header: "Approved Amt" },
    { key: "installments", header: "Installments" },
    { key: "balance", header: "Balance" },
    {
      key: "action",
      header: "Action",
      className: "text-right",
      render: (row: Loan) => {
        // --- THIS IS THE CHANGE ---
        // Action button is now shown for Approved and Declined statuses, not just Pending.
        if (["Approved", "Pending", "Declined"].includes(row.status)) {
          return (
            <div className="relative flex justify-end">
              <ActionMenu
                loan={row}
                activeMenuId={activeMenuId}
                onToggle={handleToggleMenu}
                onViewDetails={handleViewDetails}
              />
            </div>
          );
        }
        return null;
      },
    },
  ];

  const renderConfirmationModal = () => {
    if (!confirmingLoan || !confirmationAction) return null;

    const isApproving = confirmationAction === "approve";

    const numericRequestedAmount = Number(
      confirmingLoan.requestedAmount.replace(/[^0-9.-]+/g, "")
    );

    return (
      <LoanConfirmationModal
        isOpen={true}
        onClose={() => setConfirmingLoan(null)}
        loan={{ amountReq: numericRequestedAmount }}
        onConfirm={handleConfirmationSubmit}
        onCancel={() => setConfirmingLoan(null)}
        formFields={isApproving ? approveLoanFields : declineLoanFields}
        initialState={
          isApproving
            ? {
                amountApp: numericRequestedAmount,
                installment: confirmingLoan.installments || "",
                date: "",
                staffNote: confirmingLoan.staffNote || "",
              }
            : { cancelReason: "" }
        }
        title={isApproving ? "Approve Loan Request" : "Decline Loan Request"}
        message={
          isApproving
            ? "You can change loan amount and number of installments before approving this request."
            : "Please provide a reason for declining this loan request."
        }
        confirmButtonText={isApproving ? "Approve" : "Decline"}
        cancelButtonText="Cancel"
      />
    );
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Loans & Advances</h1>
        <p className="text-sm text-gray-500">
          Dashboard / Employee Loans & Advances
        </p>
      </header>
      <div ref={tableContainerRef}>
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setIsFilterOpen(true)}
            className="p-2 rounded-full"
            style={{ backgroundColor: "#741CDD" }}
          >
            <Filter size={20} className="text-white" />
          </button>
        </div>

        {status === "loading" && (
          <div className="text-center p-4">Loading...</div>
        )}
        {status === "failed" && (
          <div className="text-center p-4 text-red-500">Error: {error}</div>
        )}
        {status === "succeeded" && (
          <>
            <Table
              data={loans}
              columns={columns}
              showSearch={false}
              showPagination={false}
            />
            <Pagination
              // currentPage={currentPage}
              // totalPages={totalPages}
              // totalItems={totalItems}
              // itemsPerPage={itemsPerPage}
              // onPageChange={setCurrentPage}
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApplyFilters}
      />
      {selectedLoan && (
        <LoanDetailView
          loan={selectedLoan}
          onClose={handleCloseDetails}
          onApprove={handleInitiateApproval}
          onDecline={handleInitiateDecline}
        />
      )}
      {renderConfirmationModal()}
    </div>
  );
};

export default DisplayLoans;
