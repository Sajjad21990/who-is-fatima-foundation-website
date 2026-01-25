"use server";

import { adminDb } from "@/lib/firebase-admin";
import { volunteerFormSchema, type VolunteerFormData } from "@/lib/validations/volunteer";

export type VolunteerFormState = {
  success: boolean;
  message: string;
};

export async function submitVolunteerForm(data: VolunteerFormData): Promise<VolunteerFormState> {
  try {
    // Validate the data on the server
    const validatedData = volunteerFormSchema.safeParse(data);

    if (!validatedData.success) {
      return {
        success: false,
        message: "Invalid form data. Please check your inputs.",
      };
    }

    // Sanitize data
    const sanitizedData = {
      name: validatedData.data.name.trim(),
      age: Number(validatedData.data.age),
      phone: validatedData.data.phone.trim(),
      email: validatedData.data.email.trim().toLowerCase(),
      areaOfInterest: validatedData.data.areaOfInterest.trim(),
      location: validatedData.data.location.trim(),
      createdAt: new Date().toISOString(),
      status: "new",
    };

    // Store in Firestore
    await adminDb.collection("volunteer_applications").add(sanitizedData);

    return {
      success: true,
      message: "Thank you for your interest in volunteering! We will contact you soon.",
    };
  } catch (error) {
    console.error("Error submitting volunteer form:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }
}
