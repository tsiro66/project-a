"use client";
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Button from "../Button/Button";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type FieldName = "name" | "email" | "phone" | "message";
type FormErrors = Partial<Record<FieldName, string>>;

type ContactSection = {
  title: string;
  subtitle: string;
  labelName: string;
  labelEmail: string;
  labelPhone: string;
  labelBudget: string;
  labelMessage: string;
  placeholderName: string;
  placeholderEmail: string;
  placeholderPhone: string;
  placeholderMessage: string;
  button: string;
  successTitle: string;
  successMessage: string;
  sendAnother: string;
};

function validate(fields: Record<FieldName, string>): FormErrors {
  const errors: FormErrors = {};

  if (!fields.name.trim()) errors.name = "Name is required.";

  if (!fields.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!fields.phone.trim()) {
    errors.phone = "Phone number is required.";
  } else if (!/^[+\d\s\-().]{7,20}$/.test(fields.phone)) {
    errors.phone = "Please enter a valid phone number.";
  }

  return errors;
}

export default function Contact({ section }: { section: ContactSection }) {
  const container = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [values, setValues] = useState<Record<FieldName, string>>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: "top 80%",
        },
      });

      tl.from(".contact-title", {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
      }).from(
        ".form-row",
        { y: 30, opacity: 0, duration: 0.6, stagger: 0.08, ease: "power3.out" },
        "-=0.6"
      );
    },
    { scope: container }
  );

  useGSAP(
    () => {
      if (isSubmitted) {
        gsap.from(".success-content > *", {
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power4.out",
        });
      }
    },
    { scope: successRef, dependencies: [isSubmitted] }
  );

  const handleChange = (field: FieldName, value: string) => {
    const updated = { ...values, [field]: value };
    setValues(updated);
    if (touched[field]) {
      const fieldErrors = validate(updated);
      setErrors((prev) => ({ ...prev, [field]: fieldErrors[field] }));
    }
  };

  const handleBlur = (field: FieldName) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const fieldErrors = validate(values);
    setErrors((prev) => ({ ...prev, [field]: fieldErrors[field] }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTouched({ name: true, email: true, phone: true, message: true });
    const allErrors = validate(values);
    setErrors(allErrors);
    if (Object.keys(allErrors).length > 0) return;

    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsSubmitted(true);
        setValues({ name: "", email: "", phone: "", message: "" });
        setTouched({});
        setErrors({});
        formRef.current?.reset();
      } else {
        const errorData = await res.json();
        console.error("Server Error:", errorData);
        alert("Error sending message. Please try again.");
      }
    } catch (err) {
      console.error("Connection Error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const RequiredMark = () => <span className="text-lime-400 ml-0.5">*</span>;

  const FieldError = ({ field }: { field: FieldName }) =>
    touched[field] && errors[field] ? (
      <span className="text-red-400 font-mono text-sm tracking-wide mt-1">
        {errors[field]}
      </span>
    ) : null;

  const fieldBorderClass = (field: FieldName) =>
    touched[field] && errors[field]
      ? "border-red-500"
      : "border-zinc-800 focus-within:border-lime-400";

  return (
    <section
      id="contact-section"
      ref={container}
      className="bg-zinc-950 min-h-screen py-12 md:py-24 px-6 md:px-12 lg:px-24 text-white flex items-center"
    >
      <div className="max-w-6xl mx-auto w-full">
        {isSubmitted ? (
          <div ref={successRef} className="success-content py-20">
            <h2 className="text-5xl md:text-7xl lg:text-9xl font-bold uppercase tracking-tighter italic text-lime-400">
              {section.successTitle}
            </h2>
            <p className="mt-6 text-xl md:text-2xl text-zinc-400 max-w-2xl leading-relaxed">
              {section.successMessage}
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="mt-12 group flex items-center gap-3 text-xs uppercase tracking-[0.2em] font-mono text-zinc-500 hover:text-white transition-colors"
            >
              <span className="w-8 h-px bg-zinc-800 group-hover:bg-lime-400 transition-colors" />
              {section.sendAnother}
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-hidden mb-12">
              <h2 className="contact-title text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tighter leading-[0.9] break-words">
                {section.title} <br />
                <span className="text-lime-400 italic text-[0.85em] highlighted-text">
                  {section.subtitle}
                </span>
              </h2>
            </div>

            <form
              ref={formRef}
              onSubmit={handleSubmit}
              noValidate
              className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10"
            >
              {/* 01 / Name */}
              <div className="form-row flex flex-col gap-2">
                <div className={`flex flex-col gap-2 border-b pb-2 transition-colors duration-500 ${fieldBorderClass("name")}`}>
                  <label className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                    01 / {section.labelName}<RequiredMark />
                  </label>
                  <input
                    type="text"
                    name="name"
                    autoComplete="name"
                    placeholder={section.placeholderName}
                    value={values.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    onBlur={() => handleBlur("name")}
                    className="bg-transparent text-xl md:text-2xl outline-none placeholder:text-zinc-800"
                  />
                </div>
                <FieldError field="name" />
              </div>

              {/* 02 / Email */}
              <div className="form-row flex flex-col gap-2">
                <div className={`flex flex-col gap-2 border-b pb-2 transition-colors duration-500 ${fieldBorderClass("email")}`}>
                  <label className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                    02 / {section.labelEmail}<RequiredMark />
                  </label>
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder={section.placeholderEmail}
                    value={values.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    onBlur={() => handleBlur("email")}
                    className="bg-transparent text-xl md:text-2xl outline-none placeholder:text-zinc-800"
                  />
                </div>
                <FieldError field="email" />
              </div>

              {/* 03 / Phone */}
              <div className="form-row flex flex-col gap-2">
                <div className={`flex flex-col gap-2 border-b pb-2 transition-colors duration-500 ${fieldBorderClass("phone")}`}>
                  <label className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                    03 / {section.labelPhone}<RequiredMark />
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    placeholder={section.placeholderPhone}
                    value={values.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    onBlur={() => handleBlur("phone")}
                    className="bg-transparent text-xl md:text-2xl outline-none placeholder:text-zinc-800"
                  />
                </div>
                <FieldError field="phone" />
              </div>

              {/* 04 / Budget */}
              <div className="form-row flex flex-col gap-3 border-b border-zinc-800 pb-4">
                <label className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                  04 / {section.labelBudget}
                </label>
                <div className="flex flex-wrap gap-2">
                  {["< 1k", "1k - 5k", "5k - 10k", "10k+"].map((level) => (
                    <label key={level} className="group cursor-pointer">
                      <input type="radio" name="budget" value={level} className="hidden peer" />
                      <span className="inline-block text-[11px] uppercase font-medium border border-zinc-800 px-3 py-1 rounded-full peer-checked:bg-lime-400 peer-checked:text-black peer-checked:border-lime-400 transition-all duration-300">
                        {level}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 05 / Message */}
              <div className="form-row md:col-span-2 flex flex-col gap-2">
                <div className={`flex flex-col gap-2 border-b pb-2 transition-colors duration-500 ${fieldBorderClass("message")}`}>
                  <label className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                    05 / {section.labelMessage}
                  </label>
                  <textarea
                    name="message"
                    rows={1}
                    placeholder={section.placeholderMessage}
                    value={values.message}
                    onChange={(e) => {
                      handleChange("message", e.target.value);
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = "auto";
                      target.style.height = `${target.scrollHeight}px`;
                    }}
                    onBlur={() => handleBlur("message")}
                    className="bg-transparent text-xl md:text-2xl outline-none placeholder:text-zinc-800 resize-none overflow-hidden"
                  />
                </div>
                <FieldError field="message" />
              </div>

              {/* Submit */}
              <div className="form-row md:col-span-2 flex justify-end mt-4">
                <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
                  <span className="relative z-10 px-10 flex items-center justify-center min-w-30">
                    {isSubmitting ? (
                      <span className="w-4 h-4 border-2 border-zinc-500 border-t-white rounded-full animate-spin" />
                    ) : (
                      section.button
                    )}
                  </span>
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </section>
  );
}