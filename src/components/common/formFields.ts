// src/components/employee/forms/formFields.ts
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
  },
  {
    name: "ifscCode",
    label: "IFSC Code",
    type: "text",
    required: true,
    spanFull: true,
  },
];