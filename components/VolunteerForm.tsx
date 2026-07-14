"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, CheckCircle, AlertCircle, X } from "lucide-react";
import { volunteerFormSchema, type VolunteerFormData } from "@/lib/validations/volunteer";
import { submitVolunteerForm, type VolunteerFormState } from "@/app/actions/volunteer";

import { motion } from "framer-motion";

export function VolunteerForm() {
  const [formState, setFormState] = useState<VolunteerFormState | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<VolunteerFormData>({
    resolver: zodResolver(volunteerFormSchema),
  });

  const onSubmit = async (data: VolunteerFormData) => {
    setFormState(null);
    const result = await submitVolunteerForm(data);
    setFormState(result);
    setShowPopup(true);

    if (result.success) {
      reset();
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
      <h3 className="text-2xl font-bold text-brand-navy mb-6">Volunteer Sign Up</h3>

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
            <h3 className="text-xl font-bold text-brand-navy mb-2">{formState.success ? "Success!" : "Error"}</h3>
            <p className="text-gray-600 mb-6">{formState.message}</p>
            <Button
              onClick={() => setShowPopup(false)}
              className={`w-full ${formState.success ? "bg-brand-navy hover:bg-brand-navy/90" : "bg-brand-red hover:bg-brand-red/90"} text-white rounded-xl h-11`}
            >
              Okay, got it
            </Button>
          </motion.div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-brand-navy">Full Name</label>
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
            <label className="text-sm font-medium text-brand-navy">Age</label>
            <Input
              placeholder="25"
              type="number"
              {...register("age")}
              className={errors.age ? "border-red-500" : ""}
            />
            {errors.age && (
              <p className="text-sm text-red-500">{errors.age.message}</p>
            )}
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-brand-navy">Phone</label>
            <Input
              placeholder="+91 98765 43210"
              {...register("phone")}
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-brand-navy">Email</label>
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
          <label className="text-sm font-medium text-brand-navy">Location</label>
          <Input
            placeholder="Your City, Country"
            {...register("location")}
            className={errors.location ? "border-red-500" : ""}
          />
          {errors.location && (
            <p className="text-sm text-red-500">{errors.location.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-brand-navy">Area of Interest</label>
          <Input
            placeholder="Teaching, Events, Admin, Fundraising..."
            {...register("areaOfInterest")}
            className={errors.areaOfInterest ? "border-red-500" : ""}
          />
          {errors.areaOfInterest && (
            <p className="text-sm text-red-500">{errors.areaOfInterest.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-brand-red hover:bg-brand-red/90 text-white h-12"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Application"
          )}
        </Button>
      </form>
    </div>
  );
}
