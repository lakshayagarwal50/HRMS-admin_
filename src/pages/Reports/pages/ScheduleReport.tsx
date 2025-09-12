//imports
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import type { AppDispatch, RootState } from "../../../store/store";
import {
  scheduleReportAPI,
  resetScheduleStatus,
} from "../../../store/slice/reportSlice";
import { type ScheduleReportData } from "../../../store/slice/reportSlice";

const frequencyOptions = ["Daily", "Weekly", "Monthly", "Yearly"];
const hourOptions = Array.from({ length: 24 }, (_, i) => `${i}`);
const minuteOptions = Array.from({ length: 60 }, (_, i) => `${i}`);

interface ScheduleReportProps {
  reportName: string;
  reportId: string;
  onCancel: () => void;
  onSubmit: (formData: any) => void;
}

//  format date from YYYY-MM-DD to DD MMM YYYY
const formatDateForAPI = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

//main body
const ScheduleReport: React.FC<ScheduleReportProps> = ({
  reportName,
  reportId,
  onCancel,
  onSubmit,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { scheduleStatus, error } = useSelector(
    (state: RootState) => state.reports
  );

  const [formData, setFormData] = useState<ScheduleReportData>({
    frequency: "",
    startDate: "",
    hours: "",
    minutes: "",
    format: "XLSX",
    to: "",
    cc: "",
    subject: `Scheduled Report: ${reportName}`,
    body: `Please find the attached report: ${reportName}.`,
  });

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
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const requiredFields: (keyof ScheduleReportData)[] = [
      "frequency",
      "startDate",
      "hours",
      "minutes",
      "to",
      "subject",
      "body",
    ];
    if (requiredFields.some((field) => !(formData[field] as string)?.trim())) {
      toast.error("Please fill out all required fields.", {
        className: "bg-orange-50 text-orange-800",
      });
      return;
    }

    const payload = {
      ...formData,
      startDate: formatDateForAPI(formData.startDate),
    };

    const toastId = toast.loading("Scheduling report...");
    try {
      await dispatch(
        scheduleReportAPI({ reportId, scheduleData: payload })
      ).unwrap();

      toast.success("Report scheduled successfully!", {
        id: toastId,
        className: "bg-green-50 text-green-800",
      });
      dispatch(resetScheduleStatus());
      navigate("/reports/scheduled");
    } catch (err: any) {
      console.error("Failed to schedule report:", err);
      toast.error(err.message || "Failed to schedule report.", {
        id: toastId,
        className: "bg-red-50 text-red-800",
      });
    }
  };

  const isSubmitting = scheduleStatus === "loading";

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Schedule Reports</h1>
        
      </div>
      <div className="bg-white p-8 rounded-lg shadow-sm">
        <div className="inline-block bg-purple-100 text-purple-800 text-sm font-medium px-4 py-1 rounded-full mb-8">
          Schedule Email For Report: {reportName}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="frequency"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Frequency
              </label>
              <select
                id="frequency"
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
                required
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
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Start Date
              </label>
              <input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label
                htmlFor="hours"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Hours (24h)
              </label>
              <select
                id="hours"
                name="hours"
                value={formData.hours}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="" disabled>
                  Select Hour
                </option>
                {hourOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt.padStart(2, "0")}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="minutes"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Minutes
              </label>
              <select
                id="minutes"
                name="minutes"
                value={formData.minutes}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="" disabled>
                  Select Minute
                </option>
                {minuteOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt.padStart(2, "0")}
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
                  value="XLSX"
                  checked={formData.format === "XLSX"}
                  onChange={handleChange}
                  className="h-4 w-4 text-purple-600"
                />
                <span>XLSX</span>
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
                <span>CSV</span>
              </label>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="to"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                To
              </label>
              <input
                id="to"
                name="to"
                type="email"
                value={formData.to}
                onChange={handleChange}
                placeholder="comma,separated,emails"
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label
                htmlFor="cc"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                CC
              </label>
              <input
                id="cc"
                name="cc"
                type="email"
                value={formData.cc}
                required
                onChange={handleChange}
                placeholder="comma,separated,emails"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Subject
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label
                htmlFor="body"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Body
              </label>
              <textarea
                id="body"
                name="body"
                value={formData.body}
                onChange={handleChange}
                rows={3}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          <div className="mt-8">
            <div className="flex items-center space-x-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#7F56D9] text-white font-semibold py-2 px-6 rounded-lg hover:bg-opacity-90 disabled:bg-gray-400"
              >
                {isSubmitting ? "SUBMITTING..." : "SUBMIT"}
              </button>
              <button
                type="button"
                onClick={onCancel}
                disabled={isSubmitting}
                className="bg-gray-200 text-gray-800 font-semibold py-2 px-6 rounded-lg hover:bg-gray-300"
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

export default ScheduleReport;
