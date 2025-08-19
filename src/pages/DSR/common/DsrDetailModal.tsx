// import React, { useState } from "react";
// import { X, Check, ChevronUp, ChevronDown } from "lucide-react";

// // We need to know the shape of the data, so let's define the type here as well.
// // In a real project, this type would likely live in a shared types file.
// type DsrEntry = {
//   id: number;
//   employeeName: string;
//   employeeId: string;
//   email: string;
//   department: string;
//   designation: string;
//   date: string;
//   totalLoggedHours: string;
//   submissionStatus: "Submitted" | "Due";
//   approvalStatus: "Approved" | "Declined" | "Pending" | "Due - On Leave" | "-";
// };

// // The component receives props to control its state and content
// interface DsrDetailModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   details: DsrEntry | null;
// }

// // A small helper to render styled status text
// const renderStatus = (status: string) => {
//   const isDeclined = status.toLowerCase().includes("declined");
//   const isSubmitted = status.toLowerCase().includes("submitted");

//   if (isDeclined) {
//     return <span className="text-red-500 font-semibold">{status}</span>;
//   }
//   if (isSubmitted) {
//     return <span className="text-green-500 font-semibold">{status}</span>;
//   }
//   return <span>{status}</span>;
// };

// const DsrDetailModal: React.FC<DsrDetailModalProps> = ({
//   isOpen,
//   onClose,
//   details,
// }) => {
//   const [isPayrollOpen, setIsPayrollOpen] = useState(true);
//   const [isAccountingOpen, setIsAccountingOpen] = useState(true);

//   // If the modal isn't open or there are no details, render nothing
//   if (!isOpen || !details) {
//     return null;
//   }

//   return (
//     // Backdrop
//     <div
//       className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
//       onClick={onClose} // Close modal on backdrop click
//     >
//       {/* Modal Panel */}
//       <div
//         className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 relative"
//         onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking inside the panel
//       >
//         {/* Header */}
//         <div className="flex justify-between items-center pb-4 border-b">
//           <h2 className="text-lg font-bold text-gray-800">
//             {details.employeeName} ({details.employeeId}) | DSR {details.date}
//           </h2>
//           <button
//             onClick={onClose}
//             className="p-1 rounded-full hover:bg-gray-200"
//           >
//             <X size={24} className="text-red-500" />
//           </button>
//         </div>

//         {/* Body */}
//         <div className="mt-4 space-y-4">
//           {/* Email */}
//           <div>
//             <label className="text-sm font-medium text-gray-500">
//               Email ID
//             </label>
//             <p className="text-gray-800">{details.email}</p>
//           </div>

//           {/* Payroll Section (Accordion) */}
//           <div className="border rounded-md">
//             <div
//               className="flex justify-between items-center p-3 bg-gray-50 cursor-pointer"
//               onClick={() => setIsPayrollOpen(!isPayrollOpen)}
//             >
//               <h3 className="font-semibold text-gray-700">Pythru Payroll</h3>
//               <div className="flex items-center gap-4">
//                 <Check
//                   size={20}
//                   className="text-green-500 cursor-pointer hover:opacity-70"
//                 />
//                 <X
//                   size={20}
//                   className="text-red-500 cursor-pointer hover:opacity-70"
//                 />
//                 {isPayrollOpen ? (
//                   <ChevronUp size={20} />
//                 ) : (
//                   <ChevronDown size={20} />
//                 )}
//               </div>
//             </div>
//             {isPayrollOpen && (
//               <div className="p-4 space-y-3">
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">DSR Description</span>
//                   <p className="text-right w-1/2 text-gray-800">
//                     Lorem ipsum is simply dummy text of the printing and
//                     typesetting industry.
//                   </p>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Logged Hours</span>
//                   <span className="text-gray-800">
//                     {details.totalLoggedHours}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Submission Status</span>
//                   {renderStatus(details.submissionStatus)}
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Final Approval status</span>
//                   {renderStatus("(Declined)")}
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">My approval status</span>
//                   {renderStatus(`(${details.approvalStatus})`)}
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Note</span>
//                   <span className="text-gray-800">
//                     Due to the Deadline of the project
//                   </span>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Accounting Section (Accordion) */}
//           <div className="border rounded-md">
//             <div
//               className="flex justify-between items-center p-3 bg-gray-50 cursor-pointer"
//               onClick={() => setIsAccountingOpen(!isAccountingOpen)}
//             >
//               <h3 className="font-semibold text-gray-700">Pythru Accounting</h3>
//               <div className="flex items-center gap-4">
//                 <Check
//                   size={20}
//                   className="text-green-500 cursor-pointer hover:opacity-70"
//                 />
//                 <X
//                   size={20}
//                   className="text-red-500 cursor-pointer hover:opacity-70"
//                 />
//                 {isAccountingOpen ? (
//                   <ChevronUp size={20} />
//                 ) : (
//                   <ChevronDown size={20} />
//                 )}
//               </div>
//             </div>
//             {isAccountingOpen && (
//               <div className="p-4">
//                 <p className="text-gray-500">
//                   Accounting details would go here.
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DsrDetailModal;
import React, { useState } from "react";
import { X, Check, ChevronUp, ChevronDown } from "lucide-react";

// Type definition remains the same
type DsrEntry = {
  id: number;
  employeeName: string;
  employeeId: string;
  email: string;
  department: string;
  designation: string;
  date: string;
  totalLoggedHours: string;
  submissionStatus: "Submitted" | "Due";
  approvalStatus: "Approved" | "Declined" | "Pending" | "Due - On Leave" | "-";
};

interface DsrDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  details: DsrEntry | null;
}

// renderStatus helper function remains the same
const renderStatus = (status: string) => {
  const isDeclined = status.toLowerCase().includes("declined");
  const isSubmitted = status.toLowerCase().includes("submitted");

  if (isDeclined) {
    return <span className="text-red-500 font-semibold">{status}</span>;
  }
  if (isSubmitted) {
    return <span className="text-green-500 font-semibold">{status}</span>;
  }
  return <span>{status}</span>;
};

const DsrDetailModal: React.FC<DsrDetailModalProps> = ({
  isOpen,
  onClose,
  details,
}) => {
  const [isPayrollOpen, setIsPayrollOpen] = useState(true);
  const [isAccountingOpen, setIsAccountingOpen] = useState(true);

  // We only need to check for details here. The `isOpen` prop will handle the animation.
  if (!details) {
    return null;
  }

  return (
    // MODIFIED: Backdrop now handles opacity transition
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${
        isOpen ? "bg-black bg-opacity-60" : "bg-opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
    >
      {/* MODIFIED: Modal Panel now slides from the right */}
      <div
        className={`bg-white shadow-xl w-full max-w-2xl h-full p-6 absolute top-0 right-0 transform transition-transform ease-in-out duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b">
          <h2 className="text-lg font-bold text-gray-800">
            {details.employeeName} ({details.employeeId}) | DSR {details.date}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200"
          >
            <X size={24} className="text-red-500" />
          </button>
        </div>

        {/* Body (No changes needed here) */}
        <div className="mt-4 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500">
              Email ID
            </label>
            <p className="text-gray-800">{details.email}</p>
          </div>
          <div className="border rounded-md">
            <div
              className="flex justify-between items-center p-3 bg-gray-50 cursor-pointer"
              onClick={() => setIsPayrollOpen(!isPayrollOpen)}
            >
              <h3 className="font-semibold text-gray-700">Pythru Payroll</h3>
              <div className="flex items-center gap-4">
                <Check
                  size={20}
                  className="text-green-500 cursor-pointer hover:opacity-70"
                />
                <X
                  size={20}
                  className="text-red-500 cursor-pointer hover:opacity-70"
                />
                {isPayrollOpen ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </div>
            </div>
            {isPayrollOpen && (
              <div className="p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">DSR Description</span>
                  <p className="text-right w-1/2 text-gray-800">
                    Lorem ipsum is simply dummy text of the printing and
                    typesetting industry.
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
                  <span className="text-gray-600">Final Approval status</span>
                  {renderStatus("(Declined)")}
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">My approval status</span>
                  {renderStatus(`(${details.approvalStatus})`)}
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Note</span>
                  <span className="text-gray-800">
                    Due to the Deadline of the project
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className="border rounded-md">
            <div
              className="flex justify-between items-center p-3 bg-gray-50 cursor-pointer"
              onClick={() => setIsAccountingOpen(!isAccountingOpen)}
            >
              <h3 className="font-semibold text-gray-700">Pythru Accounting</h3>
              <div className="flex items-center gap-4">
                <Check
                  size={20}
                  className="text-green-500 cursor-pointer hover:opacity-70"
                />
                <X
                  size={20}
                  className="text-red-500 cursor-pointer hover:opacity-70"
                />
                {isAccountingOpen ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </div>
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
  );
};

export default DsrDetailModal;
