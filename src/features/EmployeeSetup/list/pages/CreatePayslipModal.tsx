// import React, { useState } from "react";

// interface CreatePayslipModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onProceed: (year: string, month: string) => void;
// }

// const CreatePayslipModal: React.FC<CreatePayslipModalProps> = ({
//   isOpen,
//   onClose,
//   onProceed,
// }) => {
//   const [payslipYear, setPayslipYear] = useState(
//     String(new Date().getFullYear())
//   );
//   const [payslipMonth, setPayslipMonth] = useState("");

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

//   if (!isOpen) {
//     return null;
//   }

//   return (
//     <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
//       <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm mx-auto">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-lg font-semibold">Create Payslip</h3>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600 text-2xl"
//           >
//             &times;
//           </button>
//         </div>
//         <div className="flex flex-col sm:flex-row gap-4 mb-6">
//           <select
//             value={payslipYear}
//             onChange={(e) => setPayslipYear(e.target.value)}
//             className="w-full border rounded-md px-3 py-2"
//           >
//             <option value="">Select Year</option>
//             {years.map((year) => (
//               <option key={year} value={year}>
//                 {year}
//               </option>
//             ))}
//           </select>
//           <select
//             value={payslipMonth}
//             onChange={(e) => setPayslipMonth(e.target.value)}
//             className="w-full border rounded-md px-3 py-2"
//           >
//             <option value="">Select Month</option>
//             {months.map((month) => (
//               <option key={month} value={month}>
//                 {month}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div className="flex justify-center gap-4">
//           <button
//             onClick={onClose}
//             className="border px-6 py-2 rounded-md text-sm"
//           >
//             CANCEL
//           </button>
//           <button
//             onClick={() => onProceed(payslipYear, payslipMonth)}
//             className="bg-[#741CDD] text-white px-6 py-2 rounded-md text-sm"
//           >
//             PROCEED
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreatePayslipModal;
import React, { useState } from "react";
import toast from "react-hot-toast"; // New: Import toast

interface CreatePayslipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: (year: string, month: string) => void;
}

const CreatePayslipModal: React.FC<CreatePayslipModalProps> = ({
  isOpen,
  onClose,
  onProceed,
}) => {
  const [payslipYear, setPayslipYear] = useState(
    String(new Date().getFullYear())
  );
  const [payslipMonth, setPayslipMonth] = useState("");

  const years = Array.from(
    { length: 11 },
    (_, i) => new Date().getFullYear() - 5 + i
  );
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // New: Handle the proceed action with validation
  const handleProceed = () => {
    // Check if either the year or month is not selected
    if (!payslipYear || !payslipMonth) {
      toast.error("Please select both a year and a month.", {
        className: "bg-orange-50 text-orange-800",
      });
      return; // Stop the function from proceeding further
    }
    // If validation passes, call the original onProceed function
    onProceed(payslipYear, payslipMonth);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Create Payslip</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            &times;
          </button>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <select
            value={payslipYear}
            onChange={(e) => setPayslipYear(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
          >
            <option value="">Select Year</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <select
            value={payslipMonth}
            onChange={(e) => setPayslipMonth(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
          >
            <option value="">Select Month</option>
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="border px-6 py-2 rounded-md text-sm"
          >
            CANCEL
          </button>
          <button
            onClick={handleProceed} // Modified: Use the new handler function
            className="bg-[#741CDD] text-white px-6 py-2 rounded-md text-sm"
          >
            PROCEED
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePayslipModal;