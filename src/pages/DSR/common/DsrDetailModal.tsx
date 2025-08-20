// import React, { useState } from "react";
// import { X, Check, ChevronUp, ChevronDown } from "lucide-react";
// import type { DsrEntry } from "../../../store/slice/dsrSlice"; // Adjust path if needed
// // Adjust path if needed
// import AlertModal from "../../../components/Modal/AlertModal"; // Adjust path if needed
// import DeclineReasonModal from "./DeclineReasonModal"; // Adjust path if needed

// interface DsrDetailModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   details: DsrEntry | null;
//   onApprove: (dsr: DsrEntry) => void;
//   onDecline: (dsr: DsrEntry, reason: string) => void;
// }

// const renderStatus = (status: string) => {
//   const isDeclined = status?.toLowerCase().includes("declined");
//   const isSubmitted = status?.toLowerCase().includes("submitted");

//   if (isDeclined)
//     return <span className="text-red-500 font-semibold">{status}</span>;
//   if (isSubmitted)
//     return <span className="text-green-500 font-semibold">{status}</span>;
//   return <span>{status || "-"}</span>;
// };

// const DsrDetailModal: React.FC<DsrDetailModalProps> = ({
//   isOpen,
//   onClose,
//   details,
//   onApprove,
//   onDecline,
// }) => {
//   const [isPayrollOpen, setIsPayrollOpen] = useState(true);
//   const [isAccountingOpen, setIsAccountingOpen] = useState(true);
//   const [isDeclineConfirmOpen, setIsDeclineConfirmOpen] = useState(false);
//   const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);

//   if (!details) return null;

//   const handleConfirmDecline = () => {
//     setIsDeclineConfirmOpen(false);
//     setIsReasonModalOpen(true);
//   };

//   const handleSubmitDeclineReason = (reason: string) => {
//     onDecline(details, reason);
//     setIsReasonModalOpen(false);
//   };

//   return (
//     <>
//       <div
//         className={`fixed inset-0 z-50 transition-opacity duration-300 ${
//           isOpen
//             ? "bg-black/50 bg-opacity-60"
//             : "bg-opacity-0 pointer-events-none"
//         }`}
//         onClick={onClose}
//       >
//         <div
//           className={`bg-white shadow-xl w-full max-w-2xl h-full p-6 absolute top-0 right-0 transform transition-transform ease-in-out duration-300 ${
//             isOpen ? "translate-x-0" : "translate-x-full"
//           }`}
//           onClick={(e) => e.stopPropagation()}
//         >
//           {/* Header */}
//           <div className="flex justify-between items-center pb-4 border-b">
//             <h2 className="text-lg font-bold text-gray-800">
//               {details.employeeName} ({details.empId}) | DSR {details.date}
//             </h2>
//             <button
//               onClick={onClose}
//               className="p-1 rounded-full hover:bg-gray-200"
//             >
//               <X size={24} className="text-red-500" />
//             </button>
//           </div>

//           {/* Body */}
//           <div className="mt-4 space-y-4">
//             <div>
//               <label className="text-sm font-medium text-gray-500">
//                 Email ID
//               </label>
//               <p className="text-gray-800">{details.email}</p>
//             </div>
//             <div className="border rounded-md">
//               <div className="flex justify-between items-center p-3 bg-gray-50">
//                 <h3 className="font-semibold text-gray-700">Pythru Payroll</h3>
//                 <div className="flex items-center gap-4">
//                   <button
//                     onClick={() => onApprove(details)}
//                     className="hover:opacity-70"
//                   >
//                     <Check size={20} className="text-green-500" />
//                   </button>
//                   <button
//                     onClick={() => setIsDeclineConfirmOpen(true)}
//                     className="hover:opacity-70"
//                   >
//                     <X size={20} className="text-red-500" />
//                   </button>
//                   <button onClick={() => setIsPayrollOpen(!isPayrollOpen)}>
//                     {isPayrollOpen ? (
//                       <ChevronUp size={20} />
//                     ) : (
//                       <ChevronDown size={20} />
//                     )}
//                   </button>
//                 </div>
//               </div>
//               {isPayrollOpen && (
//                 <div className="p-4 space-y-3">
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">DSR Description</span>
//                     <p className="text-right w-1/2 text-gray-800">
//                       {details.description}
//                     </p>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Logged Hours</span>
//                     <span className="text-gray-800">
//                       {details.totalLoggedHours}
//                     </span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Submission Status</span>
//                     {renderStatus(details.submissionStatus)}
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">My approval status</span>
//                     {renderStatus(details.myApprovalStatus)}
//                   </div>
//                   {details.declineReason && (
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Note</span>
//                       <span className="text-gray-800">
//                         {details.declineReason}
//                       </span>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//             <div className="border rounded-md">
//               <div
//                 className="flex justify-between items-center p-3 bg-gray-50 cursor-pointer"
//                 onClick={() => setIsAccountingOpen(!isAccountingOpen)}
//               >
//                 <h3 className="font-semibold text-gray-700">
//                   Pythru Accounting
//                 </h3>
//                 {isAccountingOpen ? (
//                   <ChevronUp size={20} />
//                 ) : (
//                   <ChevronDown size={20} />
//                 )}
//               </div>
//               {isAccountingOpen && (
//                 <div className="p-4">
//                   <p className="text-gray-500">
//                     Accounting details would go here.
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       <AlertModal
//         isOpen={isDeclineConfirmOpen}
//         onClose={() => setIsDeclineConfirmOpen(false)}
//         onConfirm={handleConfirmDecline}
//         title="Decline DSR"
//         confirmText="SURE"
//         icon={<X size={32} className="text-red-500" />}
//       >
//         <p>Are you sure you want to decline the DSR?</p>
//       </AlertModal>

//       <DeclineReasonModal
//         isOpen={isReasonModalOpen}
//         onClose={() => setIsReasonModalOpen(false)}
//         onSubmit={handleSubmitDeclineReason}
//       />
//     </>
//   );
// };

// export default DsrDetailModal;
import React, { useState } from "react";
import { X, Check, ChevronUp, ChevronDown } from "lucide-react";
import type { DsrEntry } from "../../../store/slice/dsrSlice"; // Adjust path if needed
import AlertModal from "../../../components/Modal/AlertModal"; // Adjust path if needed
import DeclineReasonModal from "./DeclineReasonModal"; // Adjust path if needed

interface DsrDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  details: DsrEntry | null;
  onApprove: (dsr: DsrEntry) => void;
  onDecline: (dsr: DsrEntry, reason: string) => void;
}

const renderStatus = (status: string) => {
  const isDeclined = status?.toLowerCase().includes("declined");
  const isSubmitted = status?.toLowerCase().includes("submitted");

  if (isDeclined)
    return <span className="text-red-500 font-semibold">{status}</span>;
  if (isSubmitted)
    return <span className="text-green-500 font-semibold">{status}</span>;
  return <span>{status || "-"}</span>;
};

const DsrDetailModal: React.FC<DsrDetailModalProps> = ({
  isOpen,
  onClose,
  details,
  onApprove,
  onDecline,
}) => {
  const [isPayrollOpen, setIsPayrollOpen] = useState(true);
  const [isAccountingOpen, setIsAccountingOpen] = useState(true);
  const [isDeclineConfirmOpen, setIsDeclineConfirmOpen] = useState(false);
  const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);

  // ✅ 1. Add state for the approve confirmation modal
  const [isApproveConfirmOpen, setIsApproveConfirmOpen] = useState(false);

  if (!details) return null;

  const handleConfirmDecline = () => {
    setIsDeclineConfirmOpen(false);
    setIsReasonModalOpen(true);
  };

  // ✅ 2. Add a handler for when the user confirms the approve action
  const handleConfirmApprove = () => {
    onApprove(details);
    setIsApproveConfirmOpen(false); // Close the confirmation modal
  };

  const handleSubmitDeclineReason = (reason: string) => {
    onDecline(details, reason);
    setIsReasonModalOpen(false);
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          isOpen
            ? "bg-black/50 bg-opacity-60"
            : "bg-opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      >
        <div
          className={`bg-white shadow-xl w-full max-w-2xl h-full p-6 absolute top-0 right-0 transform transition-transform ease-in-out duration-300 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center pb-4 border-b">
            <h2 className="text-lg font-bold text-gray-800">
              {details.employeeName} ({details.empId}) | DSR {details.date}
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-200"
            >
              <X size={24} className="text-red-500" />
            </button>
          </div>

          {/* Body */}
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Email ID
              </label>
              <p className="text-gray-800">{details.email}</p>
            </div>
            <div className="border rounded-md">
              <div className="flex justify-between items-center p-3 bg-gray-50">
                <h3 className="font-semibold text-gray-700">Pythru Payroll</h3>
                <div className="flex items-center gap-4">
                  {/* ✅ 3. Update this button to open the approve confirmation modal */}
                  <button
                    onClick={() => setIsApproveConfirmOpen(true)}
                    className="hover:opacity-70"
                  >
                    <Check size={20} className="text-green-500" />
                  </button>
                  <button
                    onClick={() => setIsDeclineConfirmOpen(true)}
                    className="hover:opacity-70"
                  >
                    <X size={20} className="text-red-500" />
                  </button>
                  <button onClick={() => setIsPayrollOpen(!isPayrollOpen)}>
                    {isPayrollOpen ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                  </button>
                </div>
              </div>
              {isPayrollOpen && (
                <div className="p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">DSR Description</span>
                    <p className="text-right w-1/2 text-gray-800">
                      {details.description}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Logged Hours</span>
                    <span className="text-gray-800">
                      {details.totalLoggedHours}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Submission Status</span>
                    {renderStatus(details.submissionStatus)}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">My approval status</span>
                    {renderStatus(details.myApprovalStatus)}
                  </div>
                  {details.declineReason && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Note</span>
                      <span className="text-gray-800">
                        {details.declineReason}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="border rounded-md">
              <div
                className="flex justify-between items-center p-3 bg-gray-50 cursor-pointer"
                onClick={() => setIsAccountingOpen(!isAccountingOpen)}
              >
                <h3 className="font-semibold text-gray-700">
                  Pythru Accounting
                </h3>
                {isAccountingOpen ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </div>
              {isAccountingOpen && (
                <div className="p-4">
                  <p className="text-gray-500">
                    Accounting details would go here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ✅ 4. Add a new AlertModal instance for the approve confirmation */}
      <AlertModal
        isOpen={isApproveConfirmOpen}
        onClose={() => setIsApproveConfirmOpen(false)}
        onConfirm={handleConfirmApprove}
        title="Approve DSR"
        confirmText="SURE"
        icon={<Check size={32} className="text-green-500" />}
      >
        <p>Are you sure you want to approve this DSR?</p>
      </AlertModal>

      <AlertModal
        isOpen={isDeclineConfirmOpen}
        onClose={() => setIsDeclineConfirmOpen(false)}
        onConfirm={handleConfirmDecline}
        title="Decline DSR"
        confirmText="SURE"
        icon={<X size={32} className="text-red-500" />}
      >
        <p>Are you sure you want to decline the DSR?</p>
      </AlertModal>

      <DeclineReasonModal
        isOpen={isReasonModalOpen}
        onClose={() => setIsReasonModalOpen(false)}
        onSubmit={handleSubmitDeclineReason}
      />
    </>
  );
};

export default DsrDetailModal;
