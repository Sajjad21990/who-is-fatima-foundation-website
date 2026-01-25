"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Loader2, CheckCircle, AlertCircle, X } from "lucide-react";
import { contactFormSchema, type ContactFormData } from "@/lib/validations/contact";
import { submitContactForm, type ContactFormState } from "@/app/actions/contact";
import { motion } from "framer-motion";

export function ContactForm() {
  const [formState, setFormState] = useState<ContactFormState | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setFormState(null);
    const result = await submitContactForm(data);
    setFormState(result);
    setShowPopup(true);

    if (result.success) {
      reset();
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <MessageSquare className="w-6 h-6 text-[#E63946]" />
        <h3 className="text-2xl font-bold text-[#1D3557]">Send a Message</h3>
      </div>

      {/* Success/Error Popup */}
      {showPopup && formState && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white max-w-sm w-full rounded-3xl shadow-2xl p-6 text-center"
          >
            <div className={`w-16 h-16 ${formState.success ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"} rounded-full flex items-center justify-center mx-auto mb-4`}>
              {formState.success ? <CheckCircle className="w-8 h-8" /> : <X className="w-8 h-8" />}
            </div>
            <h3 className="text-xl font-bold text-[#1D3557] mb-2">{formState.success ? "Success!" : "Error"}</h3>
            <p className="text-gray-600 mb-6">{formState.message}</p>
            <Button
              onClick={() => setShowPopup(false)}
              className={`w-full ${formState.success ? "bg-[#1D3557] hover:bg-[#1D3557]/90" : "bg-[#E63946] hover:bg-[#E63946]/90"} text-white rounded-xl h-11`}
            >
              Okay, got it
            </Button>
          </motion.div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#1D3557]">Name</label>
            <Input
              placeholder="Your Name"
              {...register("name")}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#1D3557]">Email</label>
            <Input
              placeholder="your@email.com"
              type="email"
              {...register("email")}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#1D3557]">Subject</label>
          <Input
            placeholder="How can we help?"
            {...register("subject")}
            className={errors.subject ? "border-red-500" : ""}
          />
          {errors.subject && (
            <p className="text-sm text-red-500">{errors.subject.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#1D3557]">Message</label>
          <Textarea
            placeholder="Write your message here..."
            className={`min-h-[120px] ${errors.message ? "border-red-500" : ""}`}
            {...register("message")}
          />
          {errors.message && (
            <p className="text-sm text-red-500">{errors.message.message}</p>
          )}
        </div>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#E63946] hover:bg-[#E63946]/90 text-white h-12"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            "Send Message"
          )}
        </Button>
      </form>
    </div>
  );
}
