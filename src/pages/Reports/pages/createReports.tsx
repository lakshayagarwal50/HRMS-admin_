import React, { useState } from "react";
import { Link } from "react-router-dom";

// Helper array for the dropdown options
const reportTypeOptions = [
  "Attendance Summary Report",
  "Employee Report",
  "Finance Report",
];

const createReport: React.FC = () => {
  // State to manage the form's input values
  const [formData, setFormData] = useState({
    reportType: "",
    name: "",
    description: "",
  });

  // Handler to update state when form fields change
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

  // Placeholder handlers for form submission and cancellation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Updating report... Check the console for the form data.");
    console.log(formData);
  };

  const handleCancel = () => {
    alert("Creation cancelled.");
  };

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
              placeholder="Lorem Ipsum is simply dummy text of the printing and typesetting industry..."
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#741CDD] focus:border-[#741CDD]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <button
              type="submit"
              className="bg-[#741CDD] text-white font-semibold py-2 px-8 rounded-lg hover:bg-opacity-90 transition-colors shadow"
            >
              UPDATE
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-200 text-gray-800 font-semibold py-2 px-8 rounded-lg hover:bg-gray-300 transition-colors"
            >
              CANCEL
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default createReport;
