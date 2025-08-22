// src/pages/ScheduleReport.tsx

import React from "react";
import { Link } from "react-router-dom";

// Helper arrays for dropdown options
const frequencyOptions = ["Daily", "Weekly", "Monthly", "Yearly"];
const hourOptions = Array.from({ length: 24 }, (_, i) => {
  const hour = i % 12 === 0 ? 12 : i % 12;
  const ampm = i < 12 ? "AM" : "PM";
  return `${hour} ${ampm}`;
});
const minuteOptions = Array.from({ length: 60 }, (_, i) => i);

interface ScheduleReportProps {
  reportName: string;
  onCancel: () => void;
  onSubmit: (formData: any) => void;
}

const ScheduleReport: React.FC<ScheduleReportProps> = ({
  reportName,
  onCancel,
  onSubmit,
}) => {
  const [formData, setFormData] = React.useState({
    // ... form state
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div>
      {/* --- Page Header (Re-added) --- */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Schedule Reports</h1>

        <p className="text-sm text-gray-500">
          <Link to="/reports/all">Reports</Link>
          {" / "}
          <Link to="/reports/all">Standard Report</Link>
          {" / "}
          Schedule Reports
        </p>
      </div>

      {/* --- Form Section --- */}
      <div className="bg-white p-8 rounded-lg shadow-sm">
        <div className="inline-block bg-purple-100 text-purple-800 text-sm font-medium px-4 py-1 rounded-full mb-8">
          Schedule Email For Report: {reportName}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Frequency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Frequency
              </label>
              <select className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500">
                <option value="">Select One</option>
                {frequencyOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            {/* Hours */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hours
              </label>
              <select className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500">
                <option value="">Select One</option>
                {hourOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Minutes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minutes
              </label>
              <select className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500">
                <option value="">Select One</option>
                {minuteOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Send As Radio Buttons */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Send As (Select any one)
            </label>
            <div className="flex items-center space-x-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="sendAs"
                  value="EXCEL"
                  className="h-4 w-4 text-purple-600 border-gray-300"
                  defaultChecked
                />
                <span className="text-sm">EXCEL</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="sendAs"
                  value="CSV"
                  className="h-4 w-4 text-purple-600 border-gray-300"
                />
                <span className="text-sm">CSV</span>
              </label>
            </div>
          </div>

          {/* Email Fields */}
          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To
              </label>
              <input
                type="email"
                placeholder="sales@gonowfly.co.in"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CC
              </label>
              <input
                type="email"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Subject
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Text
              </label>
              <textarea
                placeholder="sales@gonowfly.co.in"
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md"
              ></textarea>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex items-center space-x-4">
            <button
              type="submit"
              className="bg-[#7F56D9] text-white font-semibold py-2 px-6 rounded-lg hover:bg-opacity-90 transition-colors"
            >
              SUBMIT
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-200 text-gray-800 font-semibold py-2 px-6 rounded-lg hover:bg-gray-300 transition-colors"
            >
              CANCEL
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleReport;
