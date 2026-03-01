"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

const SESSION_KEY = "condolence-modal-shown";

export function CondolenceModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const alreadyShown = sessionStorage.getItem(SESSION_KEY);
    if (!alreadyShown) {
      const timer = setTimeout(() => setOpen(true), 600);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setOpen(false);
    sessionStorage.setItem(SESSION_KEY, "true");
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogPortal>
        <DialogOverlay className="bg-black/80 backdrop-blur-sm" />
        <DialogPrimitive.Content
          className="
            fixed top-[50%] left-[50%] z-50
            translate-x-[-50%] translate-y-[-50%]
            w-[calc(100%-2rem)] max-w-[540px]
            overflow-hidden rounded-2xl
            shadow-[0_0_80px_rgba(0,0,0,0.6)]
            outline-none
            data-[state=open]:animate-in data-[state=closed]:animate-out
            data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
            data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95
            duration-500
          "
          style={{
            background: "linear-gradient(180deg, #0a0a0a 0%, #111111 40%, #0d0d0d 100%)",
          }}
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="
              absolute top-4 right-4 z-20
              w-8 h-8 rounded-full
              flex items-center justify-center
              text-neutral-500 hover:text-neutral-300
              bg-white/5 hover:bg-white/10
              transition-all duration-300
              backdrop-blur-sm
            "
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Decorative top border — muted gold line */}
          <div
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, #8B7355 30%, #C4A265 50%, #8B7355 70%, transparent 100%)",
            }}
          />

          {/* Content */}
          <div className="relative flex flex-col items-center text-center px-8 pt-10 pb-10 sm:px-12">
            {/* Arabic verse */}
            <p
              className="text-[1.5rem] sm:text-[1.75rem] leading-tight tracking-wide mb-6"
              style={{
                color: "#C4A265",
                fontFamily: "var(--font-amiri), 'Noto Naskh Arabic', serif",
                direction: "rtl",
              }}
            >
              إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ
            </p>

            {/* Thin separator */}
            <div
              className="w-16 h-px mb-8 mx-auto"
              style={{
                background:
                  "linear-gradient(90deg, transparent, #8B7355, transparent)",
              }}
            />

            {/* Photo — bordered with subtle gold ring */}
            <div className="relative mb-8">
              <div
                className="absolute -inset-[3px] rounded-full"
                style={{
                  background:
                    "linear-gradient(135deg, #8B7355 0%, #C4A265 50%, #8B7355 100%)",
                  opacity: 0.6,
                }}
              />
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden border-[3px] border-neutral-900">
                <Image
                  src="/images/condolence/ayatullah-khamenai.png"
                  alt="Ayatollah Sayed Ali Khamenei"
                  fill
                  className="object-cover object-top"
                  priority
                />
              </div>
            </div>

            {/* Title */}
            <DialogTitle className="text-[1.1rem] sm:text-[1.25rem] font-semibold tracking-[0.04em] text-neutral-100 mb-2 leading-snug">
              Heartfelt Condolences
            </DialogTitle>

            {/* Name */}
            <h3
              className="text-[1rem] sm:text-[1.1rem] font-medium tracking-[0.02em] mb-5"
              style={{ color: "#C4A265" }}
            >
              Ayatollah Sayed Ali Khamenei (r.a.)
            </h3>

            {/* Message */}
            <DialogDescription className="text-[0.85rem] sm:text-[0.9rem] leading-[1.8] text-neutral-400 max-w-[420px] mb-8">
              We extend our deepest condolences to the Muslim Ummah on the
              tragic martyrdom of the Supreme Leader, Ayatollah Sayed Ali
              Khamenei. May Allah (SWT) elevate his status and grant patience
              to all the believers in this immense loss.
            </DialogDescription>

            {/* Dua */}
            <p
              className="text-[0.8rem] italic tracking-wide text-neutral-500"
            >
              &ldquo;May his soul rest in eternal peace.&rdquo;
            </p>

            {/* Bottom decorative line */}
            <div
              className="w-10 h-px mt-8 mx-auto"
              style={{
                background:
                  "linear-gradient(90deg, transparent, #8B7355, transparent)",
              }}
            />
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
