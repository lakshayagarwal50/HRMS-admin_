import { z } from "zod";

// Static options mirroring CreateEmployee.tsx
const staticDropdownOptions = {
  title: ["MR", "MRS", "MS"] as const,
  gender: ["Male", "Female", "Other"] as const,
  reportingManager: [
    "Kushal Singh (1001)",
    "Rohit Sharma (1002)",
    "Jane Doe (1003)",
  ] as const,
};


export const employeeSchema = z.object({
  title: z.enum(staticDropdownOptions.title, { message: "Please select a valid title" }),
  
  firstName: z.string().trim().min(1, "First Name is required").max(50, "First Name is too long")
    .regex(/^[a-zA-Z\s-]+$/, "First Name cannot contain numbers and special char"),

  lastName: z.string().trim().min(1, "Last Name is required").max(50, "Last Name is too long")
    .regex(/^[a-zA-Z\s-]+$/, "Last Name cannot contain numbers and special char"),

  email: z.string().trim().min(1, "Email is required").email("Invalid email address")
    .max(100).toLowerCase(),

  gender: z.enum(staticDropdownOptions.gender, { message: "Please select a valid gender" }),

  joiningDate: z.coerce.date({
    invalid_type_error: "Invalid date format",
    required_error: "Joining Date is required",
  })
    .refine((date) => date <= new Date(), { message: "Joining date cannot be in the future" })
    .transform((date) => date.toISOString().split("T")[0]),

  department: z.string().min(1, "Please select a department"),
  designation: z.string().min(1, "Please select a designation"),
  role: z.string().min(1, "Please select a role"),

  ctc: z.string().min(1, "CTC is required")
    .regex(/^[1-9]\d*(\.\d{0,2})?$/, "CTC must be a positive number with up to two decimals"),

  phone: z.string().trim().min(1, "Phone number is required")
    .regex(/^[6-9]\d{9}$/, "Phone number must be a valid 10-digit Indian mobile number"),

  leaveType: z.string().min(1, "Please select a leave type"),

  reportingManager: z.enum(staticDropdownOptions.reportingManager, {
    message: "Please select a valid reporting manager",
  }),

  location: z.string().min(1, "Please select a location"),
  payslipComponent: z.string().min(1, "Please select a payslip component"),
  workingPattern: z.string().min(1, "Please select a working pattern"),

  holidayGroup: z.string().optional().or(z.literal("")),
}).refine((data) => {
  const rmName = data.reportingManager.split("(")[0].trim();
  return rmName !== `${data.firstName} ${data.lastName}`;
}, {
  message: "Reporting manager cannot be the employee themselves",
  path: ["reportingManager"],
});
