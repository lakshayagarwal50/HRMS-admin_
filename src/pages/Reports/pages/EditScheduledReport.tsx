import React, { useState } from "react";
import { Link } from "react-router-dom";

// Helper arrays for dropdown options
const frequencyOptions = ["Daily", "Weekly", "Monthly", "Yearly"];
const hourOptions = Array.from({ length: 24 }, (_, i) => {
  const hour = i % 12 === 0 ? 12 : i % 12;
  const ampm = i < 12 ? "AM" : "PM";
  return `${hour} ${ampm}`;
});
const minuteOptions = Array.from({ length: 60 }, (_, i) => i);

interface EditScheduledReportProps {
  reportName: string;
  onCancel: () => void;
  onSubmit: (formData: any) => void;
}

const EditScheduledReport: React.FC<EditScheduledReportProps> = ({
  reportName,
  onCancel,
  onSubmit,
}) => {
  // The initial state is now empty to allow for placeholders
  const [formData, setFormData] = useState({
    frequency: "",
    startDate: "",
    hours: "",
    minutes: "",
    sendAs: "EXCEL",
    to: "",
    cc: "",
    subject: "",
    text: "",
  });

  // Generic handler to update form state as the user types
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Edit Scheduled Reports
        </h1>

        <p className="text-sm text-gray-500">
          <Link to="/reports/all">Reports</Link>
          {" / "}
          <Link to="/reports/scheduled">Scheduled Reports</Link>
          {" / "}
          Edit Scheduled Reports
        </p>
      </div>

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
              <select
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="" disabled>
                  Select One
                </option>
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
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            {/* Hours */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hours
              </label>
              <select
                name="hours"
                value={formData.hours}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="" disabled>
                  Select One
                </option>
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
              <select
                name="minutes"
                value={formData.minutes}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="" disabled>
                  Select One
                </option>
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
                  checked={formData.sendAs === "EXCEL"}
                  onChange={handleChange}
                  className="h-4 w-4 text-purple-600"
                />
                <span className="text-sm">EXCEL</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="sendAs"
                  value="CSV"
                  checked={formData.sendAs === "CSV"}
                  onChange={handleChange}
                  className="h-4 w-4 text-purple-600"
                />
                <span className="text-sm">CSV</span>
              </label>
            </div>
          </div>
          {/* Email Fields with placeholders */}
          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To
              </label>
              <input
                type="email"
                name="to"
                value={formData.to}
                onChange={handleChange}
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
                name="cc"
                value={formData.cc}
                onChange={handleChange}
                placeholder="thuhang.nute@gmail.com"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="trungkienqaktm@gmail.com"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Text
              </label>
              <textarea
                name="text"
                value={formData.text}
                onChange={handleChange}
                placeholder="Welcome to the pythru private technologies"
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md"
              ></textarea>
            </div>
          </div>

          <div className="mt-8 flex items-center space-x-4">
            <button
              type="submit"
              className="bg-[#7F56D9] text-white font-semibold py-2 px-6 rounded-lg hover:bg-opacity-90 transition-colors"
            >
              UPDATE
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

export default EditScheduledReport;
