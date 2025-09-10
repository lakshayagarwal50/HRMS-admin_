// import React, { useState, useEffect } from "react";
// import { type DsrFilterState } from "../../../store/slice/dsrSlice";
// import { X } from "lucide-react";

// const SUBMISSION_STATUSES = ["Submitted", "Due", "Pending", "Due - On Leave"];
// const APPROVAL_STATUSES = ["Approved", "Declined", "Pending"];

// interface DsrFilterSidebarProps {
//   isOpen: boolean;
//   onClose: () => void;
//   initialFilters: DsrFilterState;
//   onApply: (filters: DsrFilterState) => void;
//   onClear: () => void;
// }

// const DsrFilterSidebar: React.FC<DsrFilterSidebarProps> = ({
//   isOpen,
//   onClose,
//   initialFilters,
//   onApply,
//   onClear,
// }) => {
//   const [filters, setFilters] = useState<DsrFilterState>(initialFilters);

//   useEffect(() => {
//     setFilters(initialFilters);
//   }, [initialFilters, isOpen]);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFilters((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleCheckboxChange = (
//     field: "submissionStatuses" | "approvalStatuses",
//     value: string
//   ) => {
//     setFilters((prev) => {
//       const currentValues = prev[field] as string[];
//       const newValues = currentValues.includes(value)
//         ? currentValues.filter((item) => item !== value)
//         : [...currentValues, value];
//       return { ...prev, [field]: newValues };
//     });
//   };

//   const handleApplyClick = () => {
//     onApply(filters);
//     onClose();
//   };

//   const handleClearClick = () => {
//     onClear();
//     onClose();
//   };

//   return (
//     <>
//       <div
//         className={`fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity bg-black/50 ${
//           isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
//         }`}
//         onClick={onClose}
//       />

//       <div
//         className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform ${
//           isOpen ? "translate-x-0" : "translate-x-full"
//         } flex flex-col`}
//       >
//         <div className="flex justify-between items-center p-4 border-b">
//           <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
//           <button
//             onClick={onClose}
//             className="p-1 rounded-full hover:bg-gray-100"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         <div className="flex-grow p-4 space-y-6 overflow-y-auto">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Date
//             </label>
//             <input
//               type="date"
//               name="date"
//               value={filters.date}
//               onChange={handleInputChange}
//               className="w-full border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Project Name
//             </label>
//             <input
//               type="text"
//               name="projects"
//               placeholder="Search by project name..."
//               value={filters.projects}
//               onChange={handleInputChange}
//               className="w-full border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Submission Status
//             </label>
//             <div className="space-y-2">
//               {SUBMISSION_STATUSES.map((status) => (
//                 <div key={status} className="flex items-center">
//                   <input
//                     type="checkbox"
//                     id={`sub-${status}`}
//                     checked={filters.submissionStatuses.includes(status)}
//                     onChange={() =>
//                       handleCheckboxChange("submissionStatuses", status)
//                     }
//                     className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
//                   />
//                   <label
//                     htmlFor={`sub-${status}`}
//                     className="ml-2 text-sm text-gray-600"
//                   >
//                     {status}
//                   </label>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Approval Status
//             </label>
//             <div className="space-y-2">
//               {APPROVAL_STATUSES.map((status) => (
//                 <div key={status} className="flex items-center">
//                   <input
//                     type="checkbox"
//                     id={`app-${status}`}
//                     checked={filters.approvalStatuses.includes(status)}
//                     onChange={() =>
//                       handleCheckboxChange("approvalStatuses", status)
//                     }
//                     className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
//                   />
//                   <label
//                     htmlFor={`app-${status}`}
//                     className="ml-2 text-sm text-gray-600"
//                   >
//                     {status}
//                   </label>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         <div className="p-4 border-t flex gap-3">
//           <button
//             onClick={handleClearClick}
//             className="w-full py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
//           >
//             Clear
//           </button>
//           <button
//             onClick={handleApplyClick}
//             className="w-full py-2 px-4 bg-[#741CDD] text-white rounded-md text-sm font-medium hover:bg-purple-700"
//           >
//             Apply
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };

// export default DsrFilterSidebar;
import React, { useState, useEffect } from "react";
import { type DsrFilterState } from "../../../store/slice/dsrSlice";
// import { CalendarDays } from "lucide-react";

const SUBMISSION_STATUSES = ["Submitted", "Due", "Due-Onleave"];
const APPROVAL_STATUSES = ["Approved", "Declined", "Pending"];

interface DsrFilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  initialFilters: DsrFilterState;
  onApply: (filters: DsrFilterState) => void;
  onClear: () => void;
}

const DsrFilterSidebar: React.FC<DsrFilterSidebarProps> = ({
  isOpen,
  onClose,
  initialFilters,
  onApply,
  onClear,
}) => {
  const [filters, setFilters] = useState<DsrFilterState>(initialFilters);

  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (
    field: "submissionStatuses" | "approvalStatuses",
    value: string
  ) => {
    setFilters((prev) => {
      const currentValues = prev[field] as string[];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value];
      return { ...prev, [field]: newValues };
    });
  };

  const handleApplyClick = () => {
    onApply(filters);
    onClose();
  };

  const handleClearClick = () => {
    onClear();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[99] flex justify-end animate-fade-in-right">
      <div className="bg-white w-full sm:w-96 h-full shadow-lg p-6 relative flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
        >
          ✖
        </button>

        {/* Heading */}
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Filters</h2>

        {/* Content */}
        <div className="flex-grow overflow-y-auto space-y-6">
          {/* Date */}
          <div>
            <label className="block font-medium text-sm uppercase text-[#741CDD] mb-2">
              Date
            </label>
            <div className="relative">
              <input
                type="date"
                name="date"
                value={filters.date}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md pl-3 pr-10 py-2"
              />
              {/* <CalendarDays
                size={18}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              /> */}
            </div>
          </div>

          {/* Project Name */}
          <div>
            <label className="block font-medium text-sm uppercase text-[#741CDD] mb-2">
              Project Name
            </label>
            <input
              type="text"
              name="projects"
              placeholder="Search by project name..."
              value={filters.projects}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          {/* Submission Status */}
          <div>
            <label className="block font-medium text-sm uppercase text-[#741CDD] mb-2">
              Submission Status
            </label>
            <div className="flex flex-col gap-2">
              {SUBMISSION_STATUSES.map((status) => (
                <button
                  key={status}
                  onClick={() =>
                    handleCheckboxChange("submissionStatuses", status)
                  }
                  className={`px-4 py-2 rounded-md text-sm w-full text-left ${
                    filters.submissionStatuses.includes(status)
                      ? "bg-[#741CDD] text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Approval Status */}
          <div>
            <label className="block font-medium text-sm uppercase text-[#741CDD] mb-2">
              Approval Status
            </label>
            <div className="flex flex-col gap-2">
              {APPROVAL_STATUSES.map((status) => (
                <button
                  key={status}
                  onClick={() =>
                    handleCheckboxChange("approvalStatuses", status)
                  }
                  className={`px-4 py-2 rounded-md text-sm w-full text-left ${
                    filters.approvalStatuses.includes(status)
                      ? "bg-[#741CDD] text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-center gap-3 mt-6 pt-4 border-t">
          <button
            onClick={handleClearClick}
            className="border border-gray-300 px-4 py-2 rounded-md text-sm w-full"
          >
            CLEAR
          </button>
          <button
            onClick={handleApplyClick}
            className="bg-[#741CDD] text-white px-6 py-2 rounded-md text-sm w-full"
          >
            APPLY FILTERS
          </button>
        </div>
      </div>
    </div>
  );
};

export default DsrFilterSidebar;
