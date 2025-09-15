import React, { useState } from "react";
import { X } from "lucide-react";
import { axiosInstance } from "../../../../services";
import toast from "react-hot-toast";

interface UpdateAttendanceForm {
  year: number;
  date: string; // e.g., "Nov 4"
  status: "P" | "AB"; // "P" for Present, "AB" for Absent
}

interface UpdateAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  employeeCode: string;
}

const UpdateAttendanceModal: React.FC<UpdateAttendanceModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  employeeCode,
}) => {
  const [formData, setFormData] = useState<UpdateAttendanceForm>({
    year: new Date().getFullYear(),
    date: "",
    status: "P",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [dateError, setDateError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const dateFormatRegex =
    /^(?<month>Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(?<day>\d{1,2})$/i;

  const handleChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Perform validation only for the 'date' field
    if (name === "date") {
      if (value && !dateFormatRegex.test(value)) {
        // UPDATED error message
        setDateError("Invalid format. Please use 'Nov 4' format.");
      } else {
        setDateError(""); // Clear error if format is valid or field is empty
      }
    }
  };

  const handleSubmit = async () => {
    if (!formData.date.trim()) {
      toast.error("Please enter a date.", {
        className: "bg-orange-50 text-orange-800",
      });
      return;
    }
    setIsSubmitting(true);

    try {
      const response = await axiosInstance.patch(
        `/employees/edit/attendance/${employeeCode}`,
        {
          year: Number(formData.year),
          date: formData.date,
          status: formData.status,
        }
      );

      toast.success(
        response.data.message || "Attendance updated successfully!",
        {
          className: "bg-green-50 text-green-800",
        }
      );

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Failed to update attendance:", err);

      // New line
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "An error occurred.";
      toast.error(errorMessage, {
        className: "bg-red-50 text-red-800",
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i < 5; i++) {
      years.push(currentYear - i);
    }
    return years;
  };

  const commonInputClasses =
    "block w-full border-0 border-b-2 border-gray-200 bg-transparent py-2 px-1 text-lg text-gray-900 placeholder:text-gray-400 placeholder:text-base focus:border-[#741CDD] focus:outline-none focus:ring-0 transition-colors duration-300";

  return (
    <div className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300">
      <div className="fixed top-0 right-0 h-full w-full max-w-xl transform bg-white shadow-xl transition-transform duration-300 ease-in-out">
        <div className="flex h-full flex-col">
          {/* Header */}
          <header className="relative flex justify-center items-center p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-800">
              Update Attendance
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="absolute right-6 rounded-md p-1 text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </header>

          {/* Body */}
          <div className="flex-grow space-y-8 overflow-y-auto p-8">
            <div>
              <label
                htmlFor="year"
                className="block text-sm font-medium text-gray-700"
              >
                Year
              </label>
              <select
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className={`${commonInputClasses} text-sm`}
              >
                {generateYearOptions().map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700"
              >
                Date
              </label>
              <input
                type="text"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange2}
                placeholder="e.g., Nov 4"
                className={commonInputClasses}
              />
              {dateError && (
                <p className="text-red-500 text-xs mt-1">{dateError}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <div className="flex items-center gap-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="P"
                    checked={formData.status === "P"}
                    onChange={handleChange}
                    className="form-radio text-[#741CDD] focus:ring-[#741CDD]"
                  />
                  <span>Present</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="AB"
                    checked={formData.status === "AB"}
                    onChange={handleChange}
                    className="form-radio text-[#741CDD] focus:ring-[#741CDD]"
                  />
                  <span>Absent</span>
                </label>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="flex flex-shrink-0 items-center justify-center gap-4 border-t border-slate-200 p-6">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-8 font-semibold bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="py-2.5 px-8 font-semibold text-white bg-[#741CDD] rounded-md hover:bg-[#5f3dbb] transition-colors shadow-sm disabled:bg-gray-400"
            >
              {isSubmitting ? "Updating..." : "Update"}
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default UpdateAttendanceModal;
