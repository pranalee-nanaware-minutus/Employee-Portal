import { z } from "zod"

export const employeeSchema = z.object({
  name: z
    .string()
    .min(1, "Full name is required")
    .min(2, "Name must be at least 2 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  department: z.string().min(1, "Department is required"),
  position: z.string().min(1, "Position is required"),
  salary: z
    .string()
    .min(1, "Salary is required")
    .refine((val) => !isNaN(Number(val)), {
      message: "Salary must be a valid number",
    })
    .refine((val) => Number(val) >= 0, {
      message: "Salary must be at least 0",
    }),
  joinDate: z.string().min(1, "Join date is required"),
  status: z.enum(["active", "inactive"], {
    error: "Status is required",
  }),
})

export type EmployeeFormData = z.infer<typeof employeeSchema>
