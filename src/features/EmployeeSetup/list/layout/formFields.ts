import  {
    type FormField,
  } from "../../../../components/common/GenericForm";

// General Info Fields
export const generalInfoFields: FormField[] = [
    {
      name: "title",
      label: "Title",
      type: "select",
      required: true,
      options: [
        { value: "MR", label: "MR" },
        { value: "MRS", label: "MRS" },
      ],
      disabled: false, // Disabled
    },
    {
      name: "firstName",
      label: "First Name",
      type: "text",
      allowedChars: "alpha-space",
      required: true,
      validation: (value) => {
        if (!value || value.trim() === "") {
          return "First name is required.";
        }
        if (value.length < 2) {
          return "First name must be at least 2 characters long.";
        }
        return null;
      },
    },
    {
      name: "lastName",
      label: "Last Name",
      type: "text",
      allowedChars: "alpha-space",
      required: true,
      validation: (value) => {
        true;
        if (!value || value.trim() === "") {
          return "Last name is required.";
        }
        return null;
      },
    },
    {
      name: "empCode",
      label: "Employee ID",
      type: "text",
      required: true,
      disabled: true, // Disabled
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      required: true,
      options: [
        { value: "Active", label: "Active" },
        { value: "Inactive", label: "Inactive" },
      ],
      disabled: false, // Disabled
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
      disabled: false,
    },
    {
      name: "phoneNum",
      label: "Phone Number",
      type: "text",
      required: true,
      disabled: false,
      allowedChars: "numeric",
      validation: (value) => {
        if (!value) return "Phone number is required.";
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(value)) {
          return "Phone number must be exactly 10 digits.";
        }
        return null;
      },
    },
    {
      name: "maritalStatus",
      label: "Marital Status",
      type: "select",
      required: true,
      options: [
        { value: "Single", label: "Single" },
        { value: "Married", label: "Married" },
      ],
      disabled: false,
    },
    {
      name: "primaryEmail",
      label: "Email Primary",
      type: "email",
      required: true,
      spanFull: true,
      disabled: false,
      validation: (value) => {
        if (!value) return "Email is required.";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return "Please enter a valid email address.";
        }
        return null;
      },
    },
  ];

// Bank Details Fields
export const bankDetailsFields: FormField[] = [
    {
      name: "bankName",
      label: "Bank Name",
      type: "text",
      required: true,
      spanFull: true,
      allowedChars: "alpha-space",
      validation: (value) => {
        if (value) {
          const regex = /^[a-zA-Z\s]+$/;
          if (!regex.test(value)) {
            return "Bank name can only contain letters and spaces.";
          }
        }
        return null;
      },
    },
    {
      name: "branchName",
      label: "Branch Name",
      type: "text",
      required: true,
      spanFull: true,
    },
    {
      name: "accountName",
      label: "Account Name",
      type: "text",
      required: true,
      spanFull: true,
      allowedChars: "alpha-space",
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
        const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
        if (!ifscRegex.test(value.toUpperCase())) {
          return "Please enter a valid 11-character IFSC code.";
        }
        return null;
      },
    },
  ];

// Loan Info Fields
export const loanInfoFields: FormField[] = [
  {
    name: "loanAmount",
    label: "Loan Amount",
    type: "number",
    required: true,
    placeholder: "e.g., 154250.00",
  },
  {
    name: "installments",
    label: "Installments",
    type: "number",
    required: true,
    placeholder: "e.g., 12",
  },
  {
    name: "firstInstallmentDate",
    label: "1st Installment Date",
    type: "date",
    required: true,
  },
  {
    name: "staffNotes",
    label: "Staff Notes",
    type: "textarea",
    spanFull: true,
    placeholder: "Sample Text",
  },
];


export const approveLoanFields: FormField[] = [
    {
      name: "loanAmount",
      label: "Loan Amount",
      type: "number",
      required: true,
      validation: (value: string) => {
        if (!value) return "Loan amount is required.";
        const amount = Number(value);
        if (isNaN(amount)) return "Please enter a valid number.";
        if (amount < 0) return "Amount cannot be negative.";
        if (amount > 2000000) return "Amount cannot exceed ₹200,000.";
        return null;
      },
    },
    {
      name: "installments",
      label: "Installments",
      type: "number",
      required: true,
      validation: (value: string) => {
        if (!value) return "Number of installments is required.";
        const installments = Number(value);
        if (!Number.isInteger(installments))
          return "Installments must be a whole number.";
        if (installments < 0) return "Installments cannot be negative.";
        if (installments > 60) return "Installments cannot exceed 60.";
        return null;
      },
    },
    {
      name: "paymentReleaseMonth",
      label: "Payment Release Month",
      type: "date",
      required: true,
      validation: (value: string) => {
        if (!value) return "Payment release date is required.";
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
  
        if (selectedDate < today) {
          return "Date cannot be in the past.";
        }
  
        const maxDate = new Date();
        maxDate.setFullYear(maxDate.getFullYear() + 2);
  
        if (selectedDate > maxDate) {
          return "Date cannot be more than 2 years in the future.";
        }
        return null;
      },
    },
    {
      name: "staffNote",
      label: "Staff Note",
      type: "textarea",
      spanFull: true,
      required: true,
      validation: (value: string) => {
        const len = value.trim().length;
        if (len < 10)
          return `Note must be at least 10 characters. (Current: ${len})`;
        if (len > 30)
          return `Note cannot exceed 30 characters. (Current: ${len})`;
        return null;
      },
    },
  ];
  export const declineLoanFields: FormField[] = [
    {
      name: "cancelReason",
      label: "Cancel Reason",
      type: "textarea",
      required: true,
      spanFull: true,
      validation: (value: string) => {
        if (!value || value.trim() === "") {
          return "A reason is required.";
        }
        const len = value.trim().length;
        if (len < 3) {
          return `Reason must be at least 3 characters long. (Current: ${len})`;
        }
        if (len > 10) {
          return `Reason cannot exceed 10 characters. (Current: ${len})`;
        }
        return null;
      },
    },
  ];
  
  export const addLoanRequestFields: FormField[] = [
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
  
  export const editLoanFields: FormField[] = [
    {
      name: "amountApp",
      label: "Approved Amount",
      type: "number",
      required: true,
      placeholder: "e.g., 400000",
      spanFull: true,
      allowedChars: "numeric",
      validation: (value) => {
        const numberValue = parseFloat(value);
        if (!isNaN(numberValue) && numberValue < 0) {
          return "Amount cannot be negative.";
        }
        if (numberValue > 2000000) {
          return "Amount cannot be more than 2000000.";
        }
        return null;
      },
    },
    {
      name: "staffNote",
      label: "Staff Note",
      type: "textarea",
      spanFull: true,
      placeholder: "Updated based on limit",
      allowedChars: "alpha-space",
      validation: (value) => {
        if (!value) {
          return "Note is required.";
        }
  
        const len = value.length;
        if (len < 10 || len > 30) {
          return `Must be 10-30 characters long. (Current: ${len})`;
        }
        return null;
      },
    },
  ];
  
  export const pfEsiFields: FormField[] = [
    {
      name: "employeePfEnable",
      label: "Employee PF Enabled",
      type: "select",
      options: [
        { value: true, label: "Yes" },
        { value: false, label: "No" },
      ],
    },
    {
      name: "pfNum",
      label: "Employee PF Number",
      type: "text",
      allowedChars: "alphanumeric",
      validation: (value) => {
        if (value) {
          const regex = /^[A-Z]{2}\d{9}$/;
          if (!regex.test(value.toUpperCase())) {
            return "Enter a valid 11-character PF number (e.g., PF123456789).";
          }
        }
        return null;
      },
    },
    {
      name: "uanNum",
      label: "Employee UAN Number",
      type: "text",
      allowedChars: "numeric",
      validation: (value) => {
        if (value) {
          const regex = /^\d{12}$/;
          if (!regex.test(value)) {
            return "Please enter a valid 12-digit UAN.";
          }
        }
        return null;
      },
    },
    {
      name: "employeerPfEnable",
      label: "Employer PF Enabled",
      type: "select",
      options: [
        { value: true, label: "Yes" },
        { value: false, label: "No" },
      ],
    },
    {
      name: "esiEnable",
      label: "ESI Enabled",
      type: "select",
      options: [
        { value: true, label: "Yes" },
        { value: false, label: "No" },
      ],
    },
    {
      name: "esiNum",
      label: "ESI Number",
      type: "text",
      allowedChars: "alphanumeric",
      validation: (value) => {
        if (value) {
          const regex = /^[A-Z]{3}\d{6}$/;
          if (!regex.test(value.toUpperCase())) {
            return "Enter a valid 9-character ESI number (e.g., ESI123456).";
          }
        }
        return null;
      },
    },
    {
      name: "professionalTax",
      label: "Professional Tax Enabled",
      type: "select",
      options: [
        { value: true, label: "Yes" },
        { value: false, label: "No" },
      ],
    },
    {
      name: "labourWelfare",
      label: "Labour Welfare Fund Enabled",
      type: "select",
      options: [
        { value: true, label: "Yes" },
        { value: false, label: "No" },
      ],
    },
  ];