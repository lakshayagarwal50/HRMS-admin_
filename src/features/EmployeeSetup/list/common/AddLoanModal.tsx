// import React, { useState, useEffect, type FormEvent } from "react";

// interface LoanFormData {
//   empName: string;
//   amountReq: string;
//   note: string;
//   staffNote: string;
// }

// interface AddLoanModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSubmit: (data: LoanFormData) => void;
//   initialState: LoanFormData;
// }

// export default function AddLoanModal({
//   isOpen,
//   onClose,
//   onSubmit,
//   initialState,
// }: AddLoanModalProps) {
//   const [formData, setFormData] = useState<LoanFormData>(initialState);

//   useEffect(() => {
//     if (isOpen) {
//       setFormData(initialState);
//     }
//   }, [isOpen, initialState]);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = (e: FormEvent) => {
//     e.preventDefault();
//     onSubmit(formData);
//   };

//   if (!isOpen) {
//     return null;
//   }

//   return (
//     <div className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300">
//       <div className="fixed top-0 right-0 h-full w-full max-w-2xl transform bg-white shadow-xl transition-transform duration-300 ease-in-out">
//         <form onSubmit={handleSubmit} className="flex h-full flex-col">
//           {/* Modal Header */}
//           <header className="flex items-center justify-between border-b border-gray-200 p-6">
//             <h2 className="text-lg font-semibold text-gray-900">
//               Add Loan Request
//             </h2>
//             <button
//               type="button"
//               onClick={onClose}
//               className="rounded-md p-1 text-gray-400 hover:bg-gray-100"
//             >
//               <svg
//                 className="h-6 w-6"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M6 18L18 6M6 6l12 12"
//                 />
//               </svg>
//             </button>
//           </header>

//           {/* Modal Body */}
//           <div className="flex-grow space-y-6 overflow-y-auto p-6">
//             <div>
//               <label
//                 htmlFor="empName"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Employee Name
//               </label>
//               <input
//                 type="text"
//                 id="empName"
//                 name="empName"
//                 value={formData.empName}
//                 readOnly
//                 className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm sm:text-sm"
//               />
//             </div>
//             <div>
//               <label
//                 htmlFor="amountReq"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Requested Amount
//               </label>
//               <input
//                 type="number"
//                 id="amountReq"
//                 name="amountReq"
//                 value={formData.amountReq}
//                 onChange={handleChange}
//                 placeholder="e.g., 500000"
//                 required
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#741CDD] focus:ring-[#741CDD] sm:text-sm"
//               />
//             </div>
//             <div>
//               <label
//                 htmlFor="note"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Note
//               </label>
//               <textarea
//                 id="note"
//                 name="note"
//                 value={formData.note}
//                 onChange={handleChange}
//                 rows={4}
//                 placeholder="e.g., Need for home repairs"
//                 required
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#741CDD] focus:ring-[#741CDD] sm:text-sm"
//               />
//             </div>
//             <div>
//               <label
//                 htmlFor="staffNote"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Staff Note
//               </label>
//               <textarea
//                 id="staffNote"
//                 name="staffNote"
//                 value={formData.staffNote}
//                 onChange={handleChange}
//                 rows={4}
//                 placeholder="e.g., Urgent requirement"
//                 required
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#741CDD] focus:ring-[#741CDD] sm:text-sm"
//               />
//             </div>
//           </div>

//           {/* Modal Footer */}
//           <footer className="flex flex-shrink-0 justify-end space-x-4 border-t border-gray-200 p-6">
//             <button
//               type="button"
//               onClick={onClose}
//               className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="rounded-md border border-transparent bg-[#741CDD] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#6318b3]"
//             >
//               Submit
//             </button>
//           </footer>
//         </form>
//       </div>
//     </div>
//   );
// }
import React, { useState, useEffect, type FormEvent } from "react";

interface LoanFormData {
  empName: string;
  amountReq: string;
  note: string;
  staffNote: string;
}

interface AddLoanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LoanFormData) => void;
  initialState: LoanFormData;
}

export default function AddLoanModal({
  isOpen,
  onClose,
  onSubmit,
  initialState,
}: AddLoanModalProps) {
  const [formData, setFormData] = useState<LoanFormData>(initialState);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialState);
    }
  }, [isOpen, initialState]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) {
    return null;
  }

  // --- STYLING CHANGE: commonInputClasses ---
  // This variable defines the new look for all our form fields.
  const commonInputClasses =
    "block w-full border-0 border-b-2 border-gray-200 bg-transparent py-2 px-1 text-lg text-gray-900 placeholder:text-gray-400 placeholder:text-base focus:border-[#741CDD] focus:outline-none focus:ring-0 transition-colors duration-300";

  return (
    <div className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300">
      <div className="fixed top-0 right-0 h-full w-full max-w-2xl transform bg-white shadow-xl transition-transform duration-300 ease-in-out">
        <form onSubmit={handleSubmit} className="flex h-full flex-col">
          <header className="relative flex justify-center items-center p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-800">
              Add Loan Request
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="absolute right-6 rounded-md p-1 text-gray-400 hover:text-gray-600"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </header>

          <div className="flex-grow space-y-8 overflow-y-auto p-8">
            <div>
              <label
                htmlFor="empName"
                className="block text-sm font-medium text-gray-700"
              >
                Employee Name
              </label>
              <input
                type="text"
                id="empName"
                name="empName"
                value={formData.empName}
                readOnly
                // Readonly fields have a slightly different, non-interactive style.
                className="mt-1 block w-full border-0 border-b border-gray-300 bg-slate-50 py-2 px-1 sm:text-sm text-gray-500"
              />
            </div>
            <div>
              <label
                htmlFor="amountReq"
                className="block text-sm font-medium text-gray-700"
              >
                Requested Amount
              </label>
              <input
                type="number"
                id="amountReq"
                name="amountReq"
                value={formData.amountReq}
                onChange={handleChange}
                placeholder="e.g., 500000"
                required
                className={commonInputClasses}
              />
            </div>
            <div>
              <label
                htmlFor="note"
                className="block text-sm font-medium text-gray-700"
              >
                Note
              </label>
              <textarea
                id="note"
                name="note"
                value={formData.note}
                onChange={handleChange}
                rows={3}
                placeholder="e.g., Need for home repairs"
                required
                className={commonInputClasses}
              />
            </div>
            <div>
              <label
                htmlFor="staffNote"
                className="block text-sm font-medium text-gray-700"
              >
                Staff Note
              </label>
              <textarea
                id="staffNote"
                name="staffNote"
                value={formData.staffNote}
                onChange={handleChange}
                rows={3}
                placeholder="e.g., Urgent requirement"
                required
                className={commonInputClasses}
              />
            </div>
          </div>

          <footer className="flex flex-shrink-0 items-center justify-center gap-4 border-t border-slate-200 p-6">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-8 font-semibold bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2.5 px-8 font-semibold text-white bg-[#741CDD] rounded-md hover:bg-[#5f3dbb] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#741CDD] transition-colors shadow-sm"
            >
              Submit
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
