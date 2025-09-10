import type { FormField } from "./GenericForm";

export const generalInfoFields: FormField[] = [
  {
    name: "title",
    label: "Title",
    type: "select",
    required: true,
    options: [
      { value: "MR", label: "MR" },
      { value: "MISS", label: "MISS" },
    ],
  },
  { name: "firstName", label: "First Name", type: "text", required: true },
  { name: "lastName", label: "Last Name", type: "text", required: true },
  { name: "empCode", label: "Employee ID", type: "text", required: true },
  {
    name: "status",
    label: "Status",
    type: "select",
    required: true,
    options: [
      { value: "Active", label: "Active" },
      { value: "Inactive", label: "Inactive" },
    ],
  },
  {
    name: "gender",
    label: "Gender",
    type: "select",
    required: true,
    options: [
      { value: "Male", label: "Male" },
      { value: "Female", label: "Female" },
    ],
  },
  { name: "phoneNum", label: "Phone Number", type: "text", required: true },
  {
    name: "maritalStatus",
    label: "Marital Status",
    type: "select",
    required: true,
    options: [
      { value: "Single", label: "Single" },
      { value: "Married", label: "Married" },
    ],
  },
  {
    name: "primaryEmail",
    label: "Email Primary",
    type: "email",
    required: true,
    spanFull: true,
  },
];

export const professionalInfoFields: FormField[] = [
  {
    name: "location",
    label: "Location",
    type: "select",
    options: [
      { value: "Noida", label: "Noida" },
      { value: "Gurgaon", label: "Gurgaon" },
    ],
  },
  {
    name: "department",
    label: "Department",
    type: "select",
    options: [
      { value: "HR", label: "HR" },
      { value: "Design", label: "Design" },
    ],
  },
  { name: "designation", label: "Designation", type: "text" },
  {
    name: "payslipComponent",
    label: "Payslip Component",
    type: "select",
    options: [
      { value: "Default", label: "Default" },
      { value: "Intern", label: "Intern" },
    ],
  },
  {
    name: "taxRegime",
    label: "Tax Regime",
    type: "select",
    options: [
      { value: "Old", label: "Old" },
      { value: "New", label: "New" },
    ],
  },
  {
    name: "holidayGroup",
    label: "Holiday Group",
    type: "select",
    options: [{ value: "National Holidays", label: "National Holidays" }],
  },
  { name: "role", label: "Role", type: "text" },
  { name: "reportingManager", label: "Reporting Manager", type: "text" },
  { name: "workWeek", label: "Work Pattern", type: "text" },
  { name: "ctcAnnual", label: "Yearly CTC", type: "number" },
  { name: "rentalCity", label: "Rental City", type: "text" },
  { name: "joiningDate", label: "Joining Date", type: "date" },
  { name: "leavingDate", label: "Leaving Date", type: "date" },
];

export const bankDetailsFields: FormField[] = [
  {
    name: "bankName",
    label: "Bank Name",
    type: "text",
    required: true,
    spanFull: true,
    allowedChars: "alpha-space",
    validation: (value) => {
      // This regex ensures the value contains only letters (upper/lowercase) and spaces.
      const regex = /^[a-zA-Z\s]+$/;
      if (!regex.test(value)) {
        return "Bank name can only contain letters and spaces.";
      }
      return null; // Return null if validation passes
    },
  },
  {
    name: "branchName",
    label: "Branch Name",
    type: "text",
    required: true,
    spanFull: true,
    allowedChars: "alpha-space",
    validation: (value) => {
      if (!value || value.trim() === "") {
        return "Branch name is required.";
      }
      return null;
    },
  },
  {
    name: "accountName",
    label: "Account Name",
    type: "text",
    required: true,
    spanFull: true,
    allowedChars: "alpha-space",
    validation: (value) => {
      if (!value || value.trim() === "") {
        return "Account name is required.";
      }
      return null;
    },
  },
  {
    name: "accountType",
    label: "Account Type",
    type: "select",
    required: true,
    options: [
      { value: "Saving", label: "Saving" },
      { value: "Current", label: "Current" },
    ],
    spanFull: true,
  },
  {
    name: "accountNum",
    label: "Account No",
    type: "text",
    required: true,
    spanFull: true,
    allowedChars: "numeric",
    validation: (value) => {
      if (!value) return "Account number is required.";
      const accNumRegex = /^\d{10}$/;
      if (!accNumRegex.test(value)) {
        return "Account number must be exactly 10 digits.";
      }
      return null;
    },
  },
  {
    name: "ifscCode",
    label: "IFSC Code",
    type: "text",
    required: true,
    spanFull: true,
    allowedChars: "alphanumeric",
    validation: (value) => {
      if (!value) return "IFSC code is required.";
      // Validates format like SBIN0123456
      const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
      if (!ifscRegex.test(value.toUpperCase())) {
        return "Please enter a valid 11-character IFSC code.";
      }
      return null;
    },
  },
];

export const loanInfoFields: FormField[] = [
  {
    name: "empName",
    label: "Employee Name",
    type: "text",
    required: true,
    placeholder: "Employee Name",
    spanFull: true,
  },
  {
    name: "amountReq",
    label: "Requested Amount",
    type: "number",
    required: true,
    placeholder: "e.g., 500000",
    spanFull: true,
  },
  {
    name: "note",
    label: "Note",
    type: "textarea",
    required: true,
    spanFull: true,
    placeholder: "Need for home",
  },
  {
    name: "staffNote",
    label: "Staff Note",
    type: "textarea",
    required: true,
    spanFull: true,
    placeholder: "Urgent requirement",
  },
];

export const approveLoanFields: FormField[] = [
  { name: "loanAmount", label: "Loan Amount", type: "number", required: true },
  {
    name: "installments",
    label: "Installments",
    type: "number",
    required: true,
  },
  {
    name: "paymentReleaseMonth",
    label: "Payment Release Month",
    type: "date",
    required: true,
  },
  { name: "staffNote", label: "Staff Note", type: "textarea", spanFull: true },
];

// --- NEW: Form fields for the decline modal ---
export const declineLoanFields: FormField[] = [
  {
    name: "cancelReason",
    label: "Cancel Reason",
    type: "textarea",
    required: true,
    spanFull: true,
  },
];
