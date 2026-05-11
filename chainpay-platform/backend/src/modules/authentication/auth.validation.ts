import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  // .regex(/[A-Z]/, "Must contain at least one uppercase letter")
  // .regex(/[0-9]/, "Must contain at least one number")
  // .regex(/[^a-zA-Z0-9]/, "Must contain at least one special character"),
});

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  bio: z.string().max(200).optional(),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  dateOfBirth: z.coerce.date().optional(),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
