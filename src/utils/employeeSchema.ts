import { z } from 'zod';

/**
 * Defines the validation schema for the create employee form.
 * This schema is the single source of truth for the form's data structure and rules.
 */
export const employeeSchema = z.object({
  title: z.string(), // Default value is set, so no specific validation needed
  firstName: z.string().trim().min(1, "First Name is required"),
  lastName: z.string().trim().min(1, "Last Name is required"),
  email: z.string().trim().min(1, "Email is required").email("Invalid email address"),
  gender: z.string().min(1, "Please select a gender"),
  joiningDate: z.string().min(1, "Joining Date is required"),
  department: z.string().min(1, "Please select a department"),
  designation: z.string().min(1, "Please select a designation"),
  role: z.string().min(1, "Please select a role"),
  // Validates that the CTC is a string containing only positive numbers
  ctc: z.string()
    .min(1, "CTC is required")
    .regex(/^[1-9][0-9]*$/, "CTC must be a positive number"),
  phone: z.string()
    .min(1, "Phone number is required")
    .regex(/^\d{10}$/, "Phone number must be 10 digits"),
  leaveType: z.string().min(1, "Please select a leave type"),
  reportingManager: z.string(), // Default value is set
  location: z.string().min(1, "Please select a location"),
  payslipComponent: z.string().min(1, "Please select a payslip component"),
  workingPattern: z.string().min(1, "Please select a working pattern"),
  // Holiday group is optional, so we use .optional()
  holidayGroup: z.string().optional(),
});

/**
 * Infers the TypeScript type from the Zod schema.
 * This ensures the form's data type always matches the validation rules.
 */
export type FormData = z.infer<typeof employeeSchema>;