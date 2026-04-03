import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, message } = req.body;

  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // 1. Send confirmation email to the user (patient)
    await resend.emails.send({
      from: "Dental App <onboarding@resend.dev>",
      to: email,
      subject: "We received your message",
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #2563eb;">Hi ${name},</h2>
          <p>Thank you for reaching out to <strong>BrightSmile Dental</strong>. We have received your message and will get back to you as soon as possible.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 0.9em; color: #666;">This is an automated confirmation. Please do not reply directly to this email.</p>
        </div>
      `,
    });

    // 2. Send notification email to the clinic/admin
    await resend.emails.send({
      from: "Dental App <onboarding@resend.dev>",
      to: "ahmedsaleem20102010@gmail.com", // notification target
      subject: `New Contact Form Submission: ${name}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h3 style="color: #2563eb; margin-top: 0;">New Lead Received</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Message:</strong></p>
          <div style="background: #f9fafb; padding: 15px; border-radius: 5px; border: 1px solid #e5e7eb;">
            ${message.replace(/\n/g, '<br/>')}
          </div>
        </div>
      `,
    });

    return res.status(200).json({ success: true, message: "Emails sent successfully" });

  } catch (err: any) {
    console.error("Resend API Error:", err);
    return res.status(500).json({ 
      error: "Failed to send email", 
      details: err.message || "Unknown error" 
    });
  }
}
