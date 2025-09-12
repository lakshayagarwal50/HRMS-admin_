import React, { useState, useEffect } from "react";
import { useParams, useLocation, Link, useNavigate } from "react-router-dom";
import { X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { useDispatch, useSelector } from "react-redux";
import { updateLoan, type Loan } from "../../store/slice/loanAndAdvancesSlice";
import { type AppDispatch, type RootState } from "../../store/store";

const InfoCardItem: React.FC<{ label: string; value: React.ReactNode }> = ({
  label,
  value,
}) => (
  <div className="flex justify-between items-center py-3 px-4 border-b last:border-b-0">
    <span className="text-sm text-gray-500">{label}</span>
    <span className="text-sm font-semibold text-gray-800 text-right">
      {value}
    </span>
  </div>
);

// Updated FormInput to handle the disabled cursor style
const FormInput: React.FC<{
  label: string;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
}> = ({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  onBlur,
  disabled = false,
  required = false,
  error,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      disabled={disabled}
      className={`w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${
        
        error
          ? "border-red-500 focus:ring-red-500"
          : "border-gray-300 focus:ring-[#741CDD]"
      }`}
    />
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
);
//main page
const DisplayLoanDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const loan = location.state?.loan as Loan | undefined;
  const { status, error: reduxError } = useSelector(
    (state: RootState) => state.loans
  );

  const parseCurrency = (amount: string) =>
    amount ? amount.replace(/[₹,]/g, "").trim() : "";

  const [approvedAmount, setApprovedAmount] = useState(
    loan ? parseCurrency(loan.approvedAmount) : ""
  );
  const [staffNote, setStaffNote] = useState(loan?.staffNote || "");
  const [installmentDate, setInstallmentDate] = useState("");

  
  const [errors, setErrors] = useState({
    approvedAmount: "",
    staffNote: "",
    installmentDate: "",
  });

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "approvedAmount":
        if (!value) return "Approved amount is required.";
        // --- NEW RULE ADDED HERE ---
        if (Number(value) < 0) return "Approved amount cannot be negative.";
        if (Number(value) > 200000)
          return "Approved amount cannot exceed 200,000.";
        return "";
      case "staffNote":
        if (!value.trim()) return "Staff notes are required.";
        if (value.trim().length < 10)
          return "Notes must be at least 10 characters.";
        if (value.trim().length > 30)
          return "Notes cannot exceed 30 characters.";
        return "";
      case "installmentDate":
        if (value) {
          const selectedDate = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0); 
          if (selectedDate < today) {
            return "Installment date cannot be in the past.";
          }
        }
        return "";
      default:
        return "";
    }
  };

  // Validate when user clicks away from a field
  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check all fields on submit
    const approvedAmountError = validateField("approvedAmount", approvedAmount);
    const staffNoteError = validateField("staffNote", staffNote);
    const installmentDateError = validateField(
      "installmentDate",
      installmentDate
    ); // <-- Add this line

    if (approvedAmountError || staffNoteError || installmentDateError) {
      // <-- Add the check here
      setErrors({
        approvedAmount: approvedAmountError,
        staffNote: staffNoteError,
        installmentDate: installmentDateError, // <-- Add this line
      });
      toast.error("Please fix the errors before submitting.");
      return;
    }

    if (!id) {
      toast.error("Loan ID is missing. Cannot update.");
      return;
    }

    const toastId = toast.loading("Updating loan...");
    try {
      await dispatch(
        updateLoan({
          loanId: id,
          amountApp: approvedAmount,
          staffNote: staffNote,
        })
      ).unwrap();

      toast.success("Loan updated successfully!", { id: toastId });
      navigate("/loanandadvance");
    } catch (err: any) {
      toast.error(`Failed to update loan: ${err.message || err}`, {
        id: toastId,
      });
    }
  };

  if (!loan) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold mb-2">Loan Data Not Found</h2>
        <p>Please navigate from the loans list to see details.</p>
        <Link
          to="/loanandandvance/list"
          className="text-[#741CDD] hover:underline mt-4 inline-block"
        >
          Go back to Loans & Advances
        </Link>
      </div>
    );
  }

  const isFormValid =
    !errors.approvedAmount &&
    !errors.staffNote &&
    approvedAmount &&
    staffNote.trim();

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {loan.employeeName}
        </h1>
        <p className="text-sm text-gray-500">
          <Link to="/loanandadvance" className="hover:text-[#741CDD]">
            {" "}
            Loans & Advances
          </Link>{" "}
          /<span className="font-semibold"> Edit request</span>
        </p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md self-start">
          <InfoCardItem label="Name ID" value={`${loan.employeeName} `} />
          <InfoCardItem label="Email" value="bowman@shane.com" />
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold mb-1">Edit For LOAN & ADVANCE</h2>
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <FormInput
              label="Requested Amount"
              placeholder="Requested Loan Amount"
              value={loan.requestedAmount}
              onChange={() => {}}
              disabled={true}
            />
            <FormInput
              label="Approved Amount"
              placeholder="Enter approved amount"
              type="number"
              value={approvedAmount}
              onChange={(e) => setApprovedAmount(e.target.value)}
              onBlur={(e) =>
                handleBlur({
                  target: { name: "approvedAmount", value: e.target.value },
                } as any)
              }
              required={true}
              error={errors.approvedAmount}
            />
            <FormInput
              label="1st Installment Date (Optional)"
              placeholder="Select Date"
              type="date"
              value={installmentDate}
              onChange={(e) => setInstallmentDate(e.target.value)}
              onBlur={(e) =>
                handleBlur({
                  target: { name: "installmentDate", value: e.target.value },
                } as any)
              }
              error={errors.installmentDate}
            />
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Staff Notes {<span className="text-red-500">*</span>}
              </label>
              <textarea
                name="staffNote"
                rows={4}
                placeholder="Enter notes here..."
                value={staffNote}
                onChange={(e) => setStaffNote(e.target.value)}
                onBlur={handleBlur}
                className={`w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#741CDD] focus:border-transparent ${
                  errors.staffNote
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-[#741CDD]"
                }`}
              />
              {errors.staffNote && (
                <p className="mt-1 text-xs text-red-600">{errors.staffNote}</p>
              )}
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => navigate("/loanandadvance")}
                className="px-8 py-3 border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-3 text-white rounded-lg text-sm font-semibold disabled:bg-purple-300 disabled:cursor-not-allowed flex items-center"
                style={{ backgroundColor: "#741CDD" }}
                disabled={status === "loading" || !isFormValid}
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Submitting...
                  </>
                ) : (
                  "SUBMIT"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DisplayLoanDetail;
