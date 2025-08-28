// import React, { useState } from "react";
// import { Link } from "react-router-dom";

// // Helper array for the dropdown options
// const reportTypeOptions = [
//   "Attendance Summary Report",
//   "Employees Snapshot Report",
//   "Finance Report",
// ];

// const createReport: React.FC = () => {
//   // State to manage the form's input values
//   const [formData, setFormData] = useState({
//     reportType: "",
//     name: "",
//     description: "",
//   });

//   // Handler to update state when form fields change
//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
//     >
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   // Placeholder handlers for form submission and cancellation
//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     alert("Updating report... Check the console for the form data.");
//     console.log(formData);
//   };

//   const handleCancel = () => {
//     alert("Creation cancelled.");
//   };

//   return (
//     <div className="p-8 bg-gray-50 min-h-screen">
//       {/* --- Page Header --- */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold text-gray-800">Create Report</h1>

//         <p className="text-sm text-gray-500">
//           <Link to="/reports/all">Reports</Link>
//           {" / "}
//           <Link to="/reports/all">Standard Report</Link>
//           {" / "}
//           <Link to="/reports/all">All Reports</Link>
//           {" / "}
//           Create Report
//         </p>
//       </div>

//       {/* --- Form Section --- */}
//       <div className="bg-white p-8 rounded-lg shadow-sm">
//         <form onSubmit={handleSubmit}>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//             {/* Select Report Type */}
//             <div>
//               <label
//                 htmlFor="reportType"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 Select Report Type
//               </label>
//               <select
//                 id="reportType"
//                 name="reportType"
//                 value={formData.reportType}
//                 onChange={handleChange}
//                 className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#741CDD] focus:border-[#741CDD]"
//               >
//                 <option value="" disabled>
//                   Select one Report
//                 </option>
//                 {reportTypeOptions.map((opt) => (
//                   <option key={opt} value={opt}>
//                     {opt}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Name */}
//             <div>
//               <label
//                 htmlFor="name"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 Name
//               </label>
//               <input
//                 type="text"
//                 id="name"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 placeholder="Report name"
//                 className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#741CDD] focus:border-[#741CDD]"
//               />
//             </div>
//           </div>

//           {/* Description */}
//           <div className="mb-8">
//             <label
//               htmlFor="description"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               Description
//             </label>
//             <textarea
//               id="description"
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               rows={4}
//               placeholder="Lorem Ipsum is simply dummy text of the printing and typesetting industry..."
//               className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#741CDD] focus:border-[#741CDD]"
//             />
//           </div>

//           {/* Action Buttons */}
//           <div className="flex items-center space-x-4">
//             <button
//               type="submit"
//               className="bg-[#741CDD] text-white font-semibold py-2 px-8 rounded-lg hover:bg-opacity-90 transition-colors shadow"
//             >
//               UPDATE
//             </button>
//             <button
//               type="button"
//               onClick={handleCancel}
//               className="bg-gray-200 text-gray-800 font-semibold py-2 px-8 rounded-lg hover:bg-gray-300 transition-colors"
//             >
//               CANCEL
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default createReport;
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createReportAPI } from "../../../store/slice/reportSlice"; // Adjust path as needed
import type { AppDispatch, RootState } from "../../../store/store"; // Adjust path as needed
// Adjust path as needed

// Helper array for the dropdown options
const reportTypeOptions = [
  "Payslip Component Report",
  "Employees Snapshot Report",
  "Payslip Summary Report",
  "Provident Fund Report",
  "Employee Declaration Report",
  "Attendance Time log Report",
  "Attendance Summary Report",
  "Leave Report",
];

const CreateReport: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Get the status and error from the Redux store
  const { status, error } = useSelector((state: RootState) => state.reports);

  const [formData, setFormData] = useState({
    reportType: "",
    name: "",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Map component state to the API's expected request body
    const reportData = {
      type: formData.reportType,
      name: formData.name,
      description: formData.description,
    };

    try {
      // Dispatch the async thunk and wait for it to complete
      await dispatch(createReportAPI(reportData)).unwrap();

      // If it succeeds, show an alert and navigate away
      // alert("Report created successfully!");
      navigate("/reports/all"); // Navigate to the reports list page
    } catch (err) {
      // The `unwrap()` method throws an error if the thunk is rejected
      console.error("Failed to create the report:", err);
      // The error is already in the Redux state, so we can display it from there
    }
  };

  const handleCancel = () => {
    alert("Creation cancelled.");
    navigate("/reports/all");
  };

  const isSubmitting = status === "loading";

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* --- Page Header --- */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Create Report</h1>

        <p className="text-sm text-gray-500">
          <Link to="/reports/all">Reports</Link>
          {" / "}
          <Link to="/reports/all">Standard Report</Link>
          {" / "}
          <Link to="/reports/all">All Reports</Link>
          {" / "}
          Create Report
        </p>
      </div>

      {/* --- Form Section --- */}
      <div className="bg-white p-8 rounded-lg shadow-sm">
        <form onSubmit={handleSubmit}>
          {/* ... (Your form fields remain the same) ... */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Select Report Type */}
            <div>
              <label
                htmlFor="reportType"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Select Report Type
              </label>
              <select
                id="reportType"
                name="reportType"
                value={formData.reportType}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#741CDD] focus:border-[#741CDD]"
                required
              >
                <option value="" disabled>
                  Select one Report
                </option>
                {reportTypeOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Report name"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#741CDD] focus:border-[#741CDD]"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="A brief description of the report..."
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#741CDD] focus:border-[#741CDD]"
              required
            />
          </div>

          {/* --- UI Feedback for Loading/Error States --- */}
          {status === "loading" && (
            <p className="text-blue-600 mb-4">Submitting report...</p>
          )}
          {status === "failed" && (
            <p className="text-red-600 font-bold mb-4">Error: {error}</p>
          )}

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <button
              type="submit"
              className="bg-[#741CDD] text-white font-semibold py-2 px-8 rounded-lg hover:bg-opacity-90 transition-colors shadow disabled:bg-gray-400"
              disabled={isSubmitting}
            >
              {isSubmitting ? "CREATING..." : "CREATE"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-200 text-gray-800 font-semibold py-2 px-8 rounded-lg hover:bg-gray-300 transition-colors"
              disabled={isSubmitting}
            >
              CANCEL
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateReport; // Renamed for clarity
