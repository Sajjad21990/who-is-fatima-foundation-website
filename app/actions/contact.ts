"use server";

import { adminDb } from "@/lib/firebase-admin";
import { contactFormSchema, type ContactFormData } from "@/lib/validations/contact";

export type ContactFormState = {
  success: boolean;
  message: string;
};

export async function submitContactForm(data: ContactFormData): Promise<ContactFormState> {
  try {
    // Validate the data on the server
    const validatedData = contactFormSchema.safeParse(data);

    if (!validatedData.success) {
      return {
        success: false,
        message: "Invalid form data. Please check your inputs.",
      };
    }

    // Sanitize data (trim whitespace)
    const sanitizedData = {
      name: validatedData.data.name.trim(),
      email: validatedData.data.email.trim().toLowerCase(),
      subject: validatedData.data.subject.trim(),
      message: validatedData.data.message.trim(),
      createdAt: new Date().toISOString(),
      status: "new",
    };

    // Store in Firestore
    await adminDb.collection("contact_submissions").add(sanitizedData);

    return {
      success: true,
      message: "Thank you for your message! We will get back to you soon.",
    };
  } catch (error) {
    console.error("Error submitting contact form:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }
}
