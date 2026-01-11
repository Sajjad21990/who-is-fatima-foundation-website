"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { volunteerFormSchema, type VolunteerFormData } from "@/lib/validations/volunteer";
import { submitVolunteerForm, type VolunteerFormState } from "@/app/actions/volunteer";

export function VolunteerForm() {
  const [formState, setFormState] = useState<VolunteerFormState | null>(null);

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

    if (result.success) {
      reset();
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
      <h3 className="text-2xl font-bold text-[#1D3557] mb-6">Volunteer Sign Up</h3>

      {formState && (
        <div
          className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            formState.success
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {formState.success ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <p>{formState.message}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#1D3557]">Full Name</label>
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
            <label className="text-sm font-medium text-[#1D3557]">Age</label>
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
            <label className="text-sm font-medium text-[#1D3557]">Phone</label>
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
          <label className="text-sm font-medium text-[#1D3557]">Area of Interest</label>
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
          className="w-full bg-[#E63946] hover:bg-[#E63946]/90 text-white h-12"
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
