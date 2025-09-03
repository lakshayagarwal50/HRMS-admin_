//imports
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import type { AppDispatch, RootState } from "../../../store/store";
//are TypeScript types that you create from your Redux store to ensure your code is type-safe when interacting with Redux. They help you catch errors early and enable autocompletion in your editor
import {
  updateScheduledReport,
  resetScheduleStatus,
  type ScheduledReport,
  type ScheduleReportData,
} from "../../../store/slice/reportSlice";

//it create arrays of strings for populating hour and minute selection dropdowns
const frequencyOptions = ["Daily", "Weekly", "Monthly", "Yearly"];
const hourOptions = Array.from({ length: 24 }, (_, i) => `${i}`);
const minuteOptions = Array.from({ length: 60 }, (_, i) => `${i}`);

//This function takes a date string in the format "DD MMM YYYY" (e.g., "02 Sep 2025") and converts it into the YYYY-MM-DD format
const formatDateForInput = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(
    dateString.replace(/(\d{2}) (\w{3}) (\d{4})/, "$2 $1, $3")
  );
  if (isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
};

//(like the YYYY-MM-DD from an input field) and formats it into the "DD MMM YYYY" string
const formatDateForAPI = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

interface EditScheduledReportProps {
  initialData: ScheduledReport;
  onCancel: () => void;
  onSubmit: () => void;
}

const EditScheduledReport: React.FC<EditScheduledReportProps> = ({
  initialData,
  onCancel,
  onSubmit,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { scheduleStatus, error } = useSelector(
    (state: RootState) => state.reports
  );

  const [formData, setFormData] = useState<ScheduleReportData>({
    frequency: "",
    startDate: "",
    hours: "",
    minutes: "",
    format: "EXCEL",
    to: "",
    cc: "",
    subject: "",
    body: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        frequency: initialData.frequency,
        startDate: formatDateForInput(initialData.startDate),
        hours: initialData.hours,
        minutes: initialData.minutes,
        format: initialData.format as "EXCEL" | "CSV",
        to: initialData.to,
        cc: initialData.cc,
        subject: initialData.subject,
        body: initialData.body,
      });
    }
  }, [initialData]);

  useEffect(() => {
    if (scheduleStatus === "failed" && error) {
      toast.error(error, { className: "bg-red-50 text-red-800" });
    }
  }, [scheduleStatus, error]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const requiredFields = [
      "frequency",
      "startDate",
      "hours",
      "minutes",
      "to",
      "subject",
      "body",
    ];
    if (requiredFields.some((field) => !(formData as any)[field]?.trim())) {
      toast.error("Please fill out all required fields.", {
        className: "bg-orange-50 text-orange-800",
      });
      return;
    }

    const payload = {
      ...formData,
      startDate: formatDateForAPI(formData.startDate),
    };
    const toastId = toast.loading("Updating scheduled report...");

    try {
      await dispatch(
        updateScheduledReport({
          scheduleId: initialData.id,
          updatedData: payload,
        })
      ).unwrap();
      toast.success("Report updated successfully!", {
        id: toastId,
        className: "bg-green-50 text-green-800",
      });
      dispatch(resetScheduleStatus());
      onSubmit();
    } catch (err: any) {
      console.error("Failed to update report:", err);
      toast.error(err.message || "Failed to update report.", {
        id: toastId,
        className: "bg-red-50 text-red-800",
      });
    }
  };

  const isSubmitting = scheduleStatus === "loading";

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Edit Scheduled Report
        </h1>
        <p className="text-sm text-gray-500">
          <Link to="/reports/all">Reports</Link> {" / "}
          <Link to="/reports/scheduled">Scheduled Reports</Link> {" / "} Edit
        </p>
      </div>
      <div className="bg-white p-8 rounded-lg shadow-sm">
        <div className="inline-block bg-purple-100 text-purple-800 text-sm font-medium px-4 py-1 rounded-full mb-8">
          Editing Schedule For Report: {initialData.subject}
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hours (24h)
              </label>
              <select
                name="hours"
                value={formData.hours}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="" disabled>
                  Select Hour
                </option>
                {hourOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
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
                  Select Minute
                </option>
                {minuteOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Send As
            </label>
            <div className="flex items-center space-x-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="format"
                  value="EXCEL"
                  checked={formData.format === "EXCEL"}
                  onChange={handleChange}
                  className="h-4 w-4 text-purple-600"
                />
                <span className="text-sm">EXCEL</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="format"
                  value="CSV"
                  checked={formData.format === "CSV"}
                  onChange={handleChange}
                  className="h-4 w-4 text-purple-600"
                />
                <span className="text-sm">CSV</span>
              </label>
            </div>
          </div>
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
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Body
              </label>
              <textarea
                name="body"
                value={formData.body}
                onChange={handleChange}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          <div className="mt-8">
            <div className="flex items-center space-x-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#7F56D9] text-white font-semibold py-2 px-6 rounded-lg hover:bg-opacity-90 transition-colors disabled:bg-gray-400"
              >
                {isSubmitting ? "UPDATING..." : "UPDATE"}
              </button>
              <button
                type="button"
                onClick={onCancel}
                disabled={isSubmitting}
                className="bg-gray-200 text-gray-800 font-semibold py-2 px-6 rounded-lg hover:bg-gray-300 transition-colors"
              >
                CANCEL
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditScheduledReport;
