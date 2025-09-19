//imports
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { createReportAPI } from "../../../store/slice/reportSlice";
import type { AppDispatch, RootState } from "../../../store/store";

//options for report type
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

//main body
const CreateReport: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
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
    const regex = /^[A-Za-z\s]*$/;
    if (regex.test(value)) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.reportType ||
      !formData.name.trim() ||
      !formData.description.trim()
    ) {
      toast.error("Please fill out all required fields.", {
        className: "bg-orange-50 text-orange-800",
      });
      return;
    }

    const reportData = {
      type: formData.reportType,
      name: formData.name,
      description: formData.description,
    };

    const toastId = toast.loading("Creating report...");
    try {
      await dispatch(createReportAPI(reportData)).unwrap();
      toast.success("Report created successfully!", {
        id: toastId,
        className: "bg-green-50 text-green-800",
      });
      navigate("/reports/all");
    } catch (err: any) {
      console.error("Failed to create the report:", err);
      toast.error(err || "Failed to create the report.", {
        id: toastId,
        className: "bg-red-50 text-red-800",
      });
    }
  };

  const handleCancel = () => {
    toast("Report creation cancelled.", {
      icon: "🚫",
      className: "bg-blue-50 text-blue-800",
    });
    navigate("/reports/all");
  };

  const isSubmitting = status === "loading";

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Create Report</h1>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-sm">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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

export default CreateReport;
