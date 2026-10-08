"use server";

import { writeClient } from "@/lib/sanity/client";

type SubmitResult = { success: true } | { success: false; error: string };

export async function submitInquiry(formData: FormData): Promise<SubmitResult> {
  const name = formData.get("name") as string;
  const organization = formData.get("organization") as string;
  const email = formData.get("email") as string;
  const phone = (formData.get("phone") as string) || "";
  const interest = (formData.get("interest") as string) || "";
  const message = formData.get("message") as string;

  if (!name || !organization || !email || !message) {
    return { success: false, error: "Please fill in all required fields." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: "Please enter a valid email address." };
  }

  try {
    await writeClient.create({
      _type: "formSubmission",
      name,
      organization,
      email,
      phone,
      interest,
      message,
      submittedAt: new Date().toISOString(),
    });
  } catch {
    return { success: false, error: "Something went wrong. Please try again." };
  }

  try {
    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: "Molytex Website <noreply@molytexproducts.com>",
        to: ["info@molytexproducts.com"],
        subject: `New inquiry from ${name} — ${organization}`,
        text: `Name: ${name}\nOrganization: ${organization}\nEmail: ${email}\nPhone: ${phone}\nProduct Interest: ${interest}\n\nMessage:\n${message}`,
      });
    }
  } catch {
    // Email failed but submission was saved — don't fail the user
  }

  return { success: true };
}
