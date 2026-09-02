import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, otp, fullName } = body;

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 });
    }

    const resendApiKey = process.env.RESEND_API_KEY;

    let emailSent = false;

    // Send real email via Resend API if API Key is configured
    if (resendApiKey && !resendApiKey.includes("placeholder") && !resendApiKey.includes("123456789")) {
      try {
        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Style Loom <onboarding@resend.dev>",
            to: [email],
            subject: `Your Style Loom Verification Code: ${otp}`,
            html: `
              <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px;">
                <div style="text-align: center; padding-bottom: 16px; border-bottom: 1px solid #f1f5f9;">
                  <h1 style="color: #e11d48; margin: 0; font-size: 24px; font-weight: 800;">Style Loom</h1>
                  <p style="color: #64748b; font-size: 13px; margin-top: 4px;">Style That Speaks, Quality That Lasts.</p>
                </div>
                <div style="padding: 24px 0; text-align: center;">
                  <p style="font-size: 14px; color: #334155; margin-bottom: 12px;">Hello <strong>${fullName || "Customer"}</strong>,</p>
                  <p style="font-size: 14px; color: #475569;">Your 6-digit account verification code is:</p>
                  <div style="font-size: 36px; font-weight: 900; color: #e11d48; letter-spacing: 6px; padding: 16px 0; font-family: monospace;">
                    ${otp}
                  </div>
                  <p style="font-size: 12px; color: #94a3b8; margin-top: 12px;">Please enter this code on the website to complete your registration.</p>
                </div>
                <div style="text-align: center; pt-16px; border-top: 1px solid #f1f5f9; font-size: 11px; color: #94a3b8;">
                  © Style Loom LK — High Quality Apparel & Custom Designs.
                </div>
              </div>
            `,
          }),
        });

        if (response.ok) {
          emailSent = true;
        } else {
          const errData = await response.json();
          console.warn("Resend API Warning:", errData);
        }
      } catch (err) {
        console.error("Resend API Error:", err);
      }
    }

    return NextResponse.json({ success: true, emailSent, otp });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}
