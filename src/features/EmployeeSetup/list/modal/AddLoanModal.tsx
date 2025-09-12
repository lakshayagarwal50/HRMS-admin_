import React, { useState, useEffect, type FormEvent } from "react";
import toast from "react-hot-toast";

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
  loading: boolean; 
}

export default function AddLoanModal({
  isOpen,
  onClose,
  onSubmit,
  initialState,
  loading,
}: AddLoanModalProps) {
  const [formData, setFormData] = useState<LoanFormData>(initialState);

  const [errors, setErrors] = useState({
    empName: "",
    amountReq: "",
    note: "",
    staffNote: "",
  });

  useEffect(() => {
    if (isOpen) {
      setFormData(initialState);
      setErrors({ empName: "", amountReq: "", note: "", staffNote: "" });
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

    let errorMessage = "";
    switch (name) {
      case "empName":
        if (value && !/^[A-Za-z\s]+$/.test(value)) {
          errorMessage = "Only letters and spaces are allowed.";
        }
        break;
      case "amountReq":
        if (value && parseFloat(value) < 0) {
          errorMessage = "Amount must be 0 or greater.";
        } else if (value && parseFloat(value) > 2000000) {
          errorMessage = "Amount cannot exceed 20,00,000.";
        }
        break;
      case "note":
      case "staffNote":
        if (value && (value.length < 10 || value.length > 30)) {
          errorMessage = `Must be between 10 and 30 characters. (Current: ${value.length})`;
        }
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (Object.values(errors).some((error) => error !== "")) {
      toast.error("Please fix the errors shown on the form.");
      return;
    }
    if (
      !formData.empName.trim() ||
      !formData.amountReq.trim() ||
      !formData.note.trim() ||
      !formData.staffNote.trim()
    ) {
      toast.error("Please fill out all required fields.");
      return;
    }

    onSubmit(formData);
  };

  if (!isOpen) {
    return null;
  }
  const isFormValid =
    formData.empName.trim() !== "" &&
    formData.amountReq.trim() !== "" &&
    formData.note.trim() !== "" &&
    formData.staffNote.trim() !== "" &&
    Object.values(errors).every((error) => error === "");

  const commonInputClasses = (hasError: boolean) =>
    `block w-full border-0 border-b-2 bg-transparent py-2 px-1 text-lg text-gray-900 placeholder:text-gray-400 placeholder:text-base focus:border-[#741CDD] focus:outline-none focus:ring-0 transition-colors duration-300 ${
      hasError ? "border-red-500" : "border-gray-200"
    }`;

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
                Employee Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="empName"
                name="empName"
                value={formData.empName}
                onChange={handleChange}
                disabled={true}
                className={`mt-1 block cursor-not-allowed w-full border-0 border-b py-2 px-1 sm:text-sm text-gray-500 ${
                  errors.empName
                    ? "border-red-500"
                    : "border-gray-300 bg-slate-50"
                }`}
              />
              {errors.empName && (
                <p className="mt-1 text-xs text-red-600">{errors.empName}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="amountReq"
                className="block text-sm font-medium text-gray-700"
              >
                Requested Amount <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="amountReq"
                name="amountReq"
                value={formData.amountReq}
                onChange={handleChange}
                placeholder="e.g., 500000"
                required
                className={commonInputClasses(!!errors.amountReq)}
              />
              {errors.amountReq && (
                <p className="mt-1 text-xs text-red-600">{errors.amountReq}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="note"
                className="block text-sm font-medium text-gray-700"
              >
                Note <span className="text-red-500">*</span>
              </label>
              <textarea
                id="note"
                name="note"
                value={formData.note}
                onChange={handleChange}
                rows={3}
                placeholder="e.g., Need for home repairs"
                required
                className={commonInputClasses(!!errors.note)}
              />
              {errors.note && (
                <p className="mt-1 text-xs text-red-600">{errors.note}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="staffNote"
                className="block text-sm font-medium text-gray-700"
              >
                Staff Note <span className="text-red-500">*</span>
              </label>
              <textarea
                id="staffNote"
                name="staffNote"
                value={formData.staffNote}
                onChange={handleChange}
                rows={3}
                placeholder="e.g., Urgent requirement"
                required
                className={commonInputClasses(!!errors.staffNote)}
              />
              {errors.staffNote && (
                <p className="mt-1 text-xs text-red-600">{errors.staffNote}</p>
              )}
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
              disabled={!isFormValid || loading}
              className="py-2.5 px-8 font-semibold text-white bg-[#741CDD] rounded-md hover:bg-[#5f3dbb] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#741CDD] transition-colors shadow-sm disabled:bg-purple-300 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
