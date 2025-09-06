import { z } from 'zod';

// --- Authentication Schemas ---
export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long." }),
});


// --- Master Configuration Schemas ---

export const departmentSchema = z.object({
  name: z.string().min(1, { message: "Department Name is required." }),
  code: z.string().optional(),
  description: z.string().optional(),
});

export const designationSchema = z.object({
  name: z.string().min(1, { message: "Designation Name is required." }),
  code: z.string().optional(),
  description: z.string().optional(),
  department: z.string().min(1, { message: "Please select a department." }),
});

export const workingPatternSchema = z.object({
  name: z.string().min(1, { message: "Pattern Name is required." }),
  code: z.string().optional(),
  week1: z.array(z.boolean()).length(7),
  week2: z.array(z.boolean()).length(7),
  week3: z.array(z.boolean()).length(7),
  week4: z.array(z.boolean()).length(7),
}).refine(data => 
    data.week1.includes(true) || 
    data.week2.includes(true) || 
    data.week3.includes(true) || 
    data.week4.includes(true), {
  message: "At least one working day must be selected in the pattern.",
  path: ["week1"], // Assign error to a field for display
});


// --- Role & Permissions Schema ---
// Defines the shape for a single permission setting
const permissionValueSchema = z.record(z.boolean());
// Defines the overall permissions object
const permissionsSchema = z.record(permissionValueSchema);

export const roleSchema = z.object({
    name: z.string().min(1, { message: "Role Name is required." }),
    code: z.string().optional(),
    description: z.string().optional(),
    permissions: permissionsSchema,
});


// --- Leave Configuration Schemas ---

export const holidayConfigurationSchema = z.object({
    groupName: z.string().min(1, { message: "Group Name is required." }),
    code: z.string().optional(),
    description: z.string().optional(),
});

export const leaveSetupSchema = z.object({
    name: z.string().min(1, { message: "Leave Type name is required." }),
    type: z.enum(['Every Month', 'Every Year']),
    noOfLeaves: z.coerce.number().min(0, { message: "Number of leaves cannot be negative." }),
    isCarryForward: z.boolean(),
    enableLeaveEncashment: z.boolean(),
});


// --- Payslip & Salary Schemas ---

export const salaryStructureSchema = z.object({
  groupName: z.string().min(1, { message: "Group Name is required." }),
  code: z.string().optional(),
  description: z.string().optional(),
});
