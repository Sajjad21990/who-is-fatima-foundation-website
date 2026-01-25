import { z } from "zod";

export const volunteerFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  age: z
    .string()
    .min(1, "Age is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 16 && Number(val) <= 100, {
      message: "Age must be between 16 and 100",
    }),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be less than 15 digits"),
  email: z
    .string()
    .email("Please enter a valid email address"),
  areaOfInterest: z
    .string()
    .min(3, "Please specify your area of interest")
    .max(200, "Area of interest must be less than 200 characters"),
  location: z
    .string()
    .min(2, "Location must be at least 2 characters")
    .max(100, "Location must be less than 100 characters"),
});

export type VolunteerFormData = z.infer<typeof volunteerFormSchema>;
