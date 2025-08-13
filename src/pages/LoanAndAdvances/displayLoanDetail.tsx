// import React from "react";
// import { useParams, useLocation, Link } from "react-router-dom";
// import { X } from "lucide-react";
// import { type Loan } from "../../store/slice/loanAndAdvancesSlice"; // Assuming the type is exported from your slice

// // --- Helper Components ---
// const InfoCardItem: React.FC<{ label: string; value: React.ReactNode }> = ({
//   label,
//   value,
// }) => (
//   <div className="flex justify-between items-center py-3 px-4 border-b last:border-b-0">
//     <span className="text-sm text-gray-500">{label}</span>
//     <span className="text-sm font-semibold text-gray-800 text-right">
//       {value}
//     </span>
//   </div>
// );

// const FormInput: React.FC<{
//   label: string;
//   placeholder: string;
//   type?: string;
//   defaultValue?: string;
// }> = ({ label, placeholder, type = "text", defaultValue }) => (
//   <div>
//     <label className="block text-sm font-medium text-gray-600 mb-1">
//       {label}
//     </label>
//     <input
//       type={type}
//       placeholder={placeholder}
//       defaultValue={defaultValue}
//       className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#741CDD] focus:border-transparent"
//     />
//   </div>
// );

// // --- Main Detail Page Component ---
// const displayLoanDetail: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const location = useLocation();

//   // Get the entire loan object from the state passed during navigation
//   const loan = location.state?.loan as Loan | undefined;

//   // Handle case where user navigates directly to this page without state
//   if (!loan) {
//     return (
//       <div className="p-8 text-center">
//         <h2 className="text-xl font-semibold mb-2">Loan Data Not Found</h2>
//         <p>Please navigate from the loans list to see details.</p>
//         <Link
//           to="/loanandandvance/list"
//           className="text-[#741CDD] hover:underline mt-4 inline-block"
//         >
//           Go back to Loans & Advances
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="p-8 bg-gray-50 min-h-screen font-sans">
//       <header className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">
//           {loan.employeeName}
//         </h1>
//         <p className="text-sm text-gray-500">
//           <Link to="/loanandandvance/list" className="hover:underline">
//             Dashboard
//           </Link>{" "}
//           /
//           <Link to="/loanandandvance/list" className="hover:underline">
//             {" "}
//             Employee Loans & Advances
//           </Link>{" "}
//           /<span className="font-semibold"> Edit request</span>
//         </p>
//       </header>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         {/* Left Side: Employee Info Card */}
//         <div className="bg-white rounded-lg shadow-md self-start">
//           <InfoCardItem
//             label="Name ID"
//             value={`${loan.employeeName} (${id})`}
//           />
//           <InfoCardItem label="Email" value="bowman@shane.com" />
//           <InfoCardItem label="D.O.B." value="n/a" />
//           <InfoCardItem label="Contact:" value="n/a" />
//           <InfoCardItem label="Email 2" value="n/a" />
//           <InfoCardItem label="Marital Status" value="n/a" />
//           <InfoCardItem label="Gender" value="n/a" />
//           <InfoCardItem label="PAN:" value="n/a" />
//           <InfoCardItem label="Aadhaar:" value="n/a" />
//           <InfoCardItem label="Current Address:" value="n/a" />
//           <InfoCardItem label="Permanent Address:" value="n/a" />
//           <InfoCardItem label="Username:" value="n/a" />
//           <InfoCardItem
//             label="Login Enabled:"
//             value={
//               <X
//                 size={20}
//                 className="text-red-500 bg-red-100 rounded-full p-1"
//               />
//             }
//           />
//           <InfoCardItem
//             label="Account Locked:"
//             value={
//               <X
//                 size={20}
//                 className="text-red-500 bg-red-100 rounded-full p-1"
//               />
//             }
//           />
//         </div>

//         {/* Right Side: Edit Form */}
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <h2 className="text-lg font-bold mb-1">Edit For LOAN & ADVANCE</h2>
//           <p className="text-sm text-gray-500 mb-6">Edit Loan & Advance</p>

//           <form className="space-y-6">
//             <FormInput
//               label="Requested Amount"
//               placeholder="Enter Loan Amount"
//               defaultValue={loan.requestedAmount}
//             />
//             {/* --- MODIFIED SECTION --- */}
//             <FormInput
//               label="Approved Amount"
//               placeholder="Enter approved amount"
//               defaultValue={loan.approvedAmount}
//             />
//             {/* --- END MODIFIED SECTION --- */}
//             <FormInput
//               label="1st Installment Date"
//               placeholder="Select Date"
//               type="date"
//             />
//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1">
//                 Staff Notes
//               </label>
//               <textarea
//                 rows={4}
//                 placeholder="Enter notes here..."
//                 className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#741CDD] focus:border-transparent"
//               />
//             </div>
//             <div className="flex justify-end space-x-4 pt-4">
//               <button
//                 type="button"
//                 className="px-8 py-3 border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-100"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className="px-8 py-3 text-white rounded-lg text-sm font-semibold"
//                 style={{ backgroundColor: "#741CDD" }}
//               >
//                 SUBMIT
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default displayLoanDetail;
import React, { useState } from "react";
import { useParams, useLocation, Link, useNavigate } from "react-router-dom";
import { X } from "lucide-react";

// --- Redux Imports ---
// These imports must be resolvable by your project's build tool (e.g., Vite, Webpack).
import { useDispatch, useSelector } from "react-redux";
// The following paths are assumed. Adjust them to match your project structure.
import { updateLoan, type Loan } from "../../store/slice/loanAndAdvancesSlice";
import { type AppDispatch, type RootState } from "../../store/store";

// --- Helper Components ---
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

const FormInput: React.FC<{
  label: string;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}> = ({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  disabled = false,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 mb-1">
      {label}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#741CDD] focus:border-transparent disabled:bg-gray-100"
    />
  </div>
);

// --- Main Detail Page Component ---
const DisplayLoanDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Get the entire loan object from the navigation state
  const loan = location.state?.loan as Loan | undefined;

  // --- Get Async Status from the Redux Store ---
  // This assumes your slice is named 'loans' in your root reducer.
  const { status, error } = useSelector((state: RootState) => state.loans);

  // --- Form Input State ---
  // Helper to remove currency formatting (₹ and commas) for the input field
  const parseCurrency = (amount: string) =>
    amount ? amount.replace(/[₹,]/g, "").trim() : "";

  const [approvedAmount, setApprovedAmount] = useState(
    loan ? parseCurrency(loan.approvedAmount) : ""
  );
  const [staffNote, setStaffNote] = useState("");
  const [installmentDate, setInstallmentDate] = useState("");

  // --- Form Submission Handler ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) {
      alert("Loan ID is missing.");
      return;
    }
    if (!approvedAmount || !staffNote) {
      alert("Please fill in both Approved Amount and Staff Notes.");
      return;
    }

    // Dispatch the updateLoan thunk from your slice
    dispatch(
      updateLoan({
        loanId: id,
        amountApp: approvedAmount,
        staffNote: staffNote,
      })
    )
      .unwrap() // .unwrap() returns a promise that will reject on failure
      .then(() => {
        navigate("/loanandandvance"); // Navigate back to the list on success
      })
      .catch((err) => {
        // The error payload from rejectWithValue is available here
        alert(`Failed to update loan: ${err}`);
      });
  };

  // --- Render Logic ---
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

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {loan.employeeName}
        </h1>
        <p className="text-sm text-gray-500">
          <Link to="/loanandandvance/list" className="hover:underline">
            Dashboard
          </Link>{" "}
          /
          <Link to="/loanandandvance/list" className="hover:underline">
            {" "}
            Employee Loans & Advances
          </Link>{" "}
          /<span className="font-semibold"> Edit request</span>
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side: Employee Info Card */}
        <div className="bg-white rounded-lg shadow-md self-start">
          <InfoCardItem
            label="Name ID"
            value={`${loan.employeeName} (${id})`}
          />
          <InfoCardItem label="Email" value="bowman@shane.com" />
          <InfoCardItem label="D.O.B." value="n/a" />
          <InfoCardItem label="Contact:" value="n/a" />
          <InfoCardItem label="Email 2" value="n/a" />
          {/* ... other info items ... */}
        </div>

        {/* Right Side: Edit Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold mb-1">Edit For LOAN & ADVANCE</h2>
          <p className="text-sm text-gray-500 mb-6">Edit Loan & Advance</p>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <FormInput
              label="Requested Amount"
              placeholder="Requested Loan Amount"
              value={loan.requestedAmount}
              onChange={() => {}} // No-op, this field is read-only
              disabled={true}
            />
            <FormInput
              label="Approved Amount"
              placeholder="Enter approved amount"
              type="number"
              value={approvedAmount}
              onChange={(e) => setApprovedAmount(e.target.value)}
            />
            <FormInput
              label="1st Installment Date (Optional)"
              placeholder="Select Date"
              type="date"
              value={installmentDate}
              onChange={(e) => setInstallmentDate(e.target.value)}
            />
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Staff Notes
              </label>
              <textarea
                rows={4}
                placeholder="Enter notes here..."
                value={staffNote}
                onChange={(e) => setStaffNote(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#741CDD] focus:border-transparent"
              />
            </div>

            {/* UI Feedback for API call status */}
            {status === "failed" && error && (
              <p className="text-sm text-red-500 mt-2">Error: {error}</p>
            )}

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => navigate("/loanandandvance/list")}
                className="px-8 py-3 border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-3 text-white rounded-lg text-sm font-semibold disabled:bg-purple-300"
                style={{ backgroundColor: "#741CDD" }}
                disabled={status === "loading"}
              >
                {status === "loading" ? "Submitting..." : "SUBMIT"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DisplayLoanDetail;
