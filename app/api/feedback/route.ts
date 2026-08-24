import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Missing required feedback fields" }, { status: 400 });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const targetEmail = process.env.FEEDBACK_EMAIL || "info@elegancefashion.lk";

    // If Resend API key is configured, send email notification
    if (resendApiKey && !resendApiKey.includes("placeholder")) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Elegance Fashion <onboarding@resend.dev>",
            to: [targetEmail],
            subject: `[Customer Feedback] ${subject}`,
            html: `
              <h2>New Customer Feedback Received</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Subject:</strong> ${subject}</p>
              <hr />
              <p><strong>Message:</strong></p>
              <p>${message.replace(/\n/g, "<br/>")}</p>
            `,
          }),
        });
      } catch (err) {
        console.error("Resend API error:", err);
      }
    }

    return NextResponse.json({ success: true, message: "Feedback notification received" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}
