import { z } from "zod";

const fiveDaysAgo = new Date();
fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
fiveDaysAgo.setHours(0, 0, 0, 0);

const today = new Date();
today.setHours(23, 59, 59, 999);

export const resourceAllocationSchema = z.object({
  empCode: z.string().min(1, "Employee Code is required").regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{2,}$/, "Must contain at least one letter and one number, and no special characters"),
  name: z.string().min(1, "Resource Name is required").regex(/^[a-zA-Z\s]+$/, "Only alphabets and spaces are allowed"),
  department: z.string().min(1, "Department is required").regex(/^[a-zA-Z\s]+$/, "Only alphabets and spaces are allowed"),
  designation: z.string().min(1, "Designation is required").regex(/^[a-zA-Z\s]+$/, "Only alphabets and spaces are allowed"),
  experience: z.preprocess(
    (val) => Number(val),
    z.number().positive("Experience must be a positive number")
  ),
  allocatedHours: z.preprocess(
    (val) => Number(val),
    z.number().positive("Allocation hours must be a positive number")
  ),
  allocatedFrom: z.preprocess((arg) => {
    if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
  }, z.date().min(fiveDaysAgo, "Allocation start date can be from past 5 days to present").max(today, "Allocation start date cannot be in the future")),
  allocatedtill: z.preprocess((arg) => {
    if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
  }, z.date()),
}).refine(data => data.allocatedtill > data.allocatedFrom, {
  message: "Allocation end date must be at least one day after the start date",
  path: ["allocatedtill"],
});

export type ResourceAllocationFormData = z.infer<typeof resourceAllocationSchema>;
