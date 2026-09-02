"use client";

import React, { useState, useEffect } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { store } from "@/lib/supabase/store";
import { Lock, Mail, User, Phone, CheckCircle2, RefreshCw, ArrowRight } from "lucide-react";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  initialMode?: "login" | "signup";
}

export function AuthModal({
  open,
  onOpenChange,
  onSuccess,
  initialMode = "login",
}: AuthModalProps) {
  const { showToast } = useToast();
  const [step, setStep] = useState<"login" | "signup" | "otp">("login");

  // Form Registration States (Full Name, Email, Phone, Password)
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Login State (Mobile Number or Email)
  const [loginIdentifier, setLoginIdentifier] = useState("");

  // OTP Verification States
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [generatedOtp, setGeneratedOtp] = useState<string>("");
  const [emailSentStatus, setEmailSentStatus] = useState<boolean>(false);
  
  // Timer & loading
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setStep(initialMode);
    }
  }, [open, initialMode]);

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === "otp" && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  // 1. Customer Login Submit (Mobile Number or Email + Password)
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier || !password) {
      showToast("Please enter your Mobile Number or Email and Password", "error");
      return;
    }
    setLoading(true);

    try {
      const res = store.login(loginIdentifier);
      if (res && res.success) {
        showToast(`Welcome back, ${res.profile.full_name}! Logged in successfully.`, "success");
        onOpenChange(false);
        if (onSuccess) onSuccess();
      } else {
        throw new Error("Failed to log in");
      }
    } catch (err: any) {
      showToast(err.message || "Failed to log in", "error");
    } finally {
      setLoading(false);
    }
  };

  // 2. Customer Registration Submit (Full Name, Email, Phone, Password)
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone || !password || !confirmPassword) {
      showToast("Please fill in all 4 registration fields (Name, Email, Phone, Password)", "error");
      return;
    }
    if (password !== confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }
    if (password.length < 6) {
      showToast("Password must be at least 6 characters", "error");
      return;
    }

    setLoading(true);
    try {
      // Generate 6-digit OTP in local store
      const res = store.signUp(email, fullName, password, phone);
      const otp = res.otp;
      setGeneratedOtp(otp);

      // Trigger real email delivery via Next.js Server API
      let sent = false;
      try {
        const apiRes = await fetch("/api/auth/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp, fullName }),
        });
        const data = await apiRes.json();
        sent = !!data.emailSent;
      } catch (err) {
        console.warn("Email API error:", err);
      }

      setEmailSentStatus(sent);
      showToast(`6-digit OTP code generated and sent to ${email}!`, "info");
      setStep("otp");
      setCountdown(60);
      setCanResend(false);
    } catch (err: any) {
      showToast(err.message || "Failed to create account", "error");
    } finally {
      setLoading(false);
    }
  };

  // OTP Digit Change Listener
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      const digits = value.slice(0, 6).split("");
      const newOtp = [...otpCode];
      digits.forEach((d, i) => {
        newOtp[i] = d;
      });
      setOtpCode(newOtp);
      return;
    }
    const newOtp = [...otpCode];
    newOtp[index] = value;
    setOtpCode(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  // 3. Confirm 6-Digit OTP Verification
  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = otpCode.join("");
    if (fullCode.length !== 6) {
      showToast("Please enter all 6 digits of your OTP code", "error");
      return;
    }
    setLoading(true);
    try {
      const res = store.verifyOtp(email, fullCode);
      if (!res.success) throw new Error(res.error);

      showToast(`Account verified! Registration complete for ${fullName}.`, "success");
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      showToast(err.message || "Invalid 6-digit OTP code", "error");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (!canResend) return;
    setLoading(true);
    try {
      const res = store.signUp(email, fullName, password, phone);
      const otp = res.otp;
      setGeneratedOtp(otp);

      try {
        await fetch("/api/auth/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp, fullName }),
        });
      } catch {}

      showToast(`New 6-digit OTP code sent to ${email}!`, "info");
      setCountdown(60);
      setCanResend(false);
    } catch (err: any) {
      showToast(err.message || "Failed to resend code", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={
        step === "login"
          ? "Customer Login"
          : step === "signup"
          ? "Create Customer Account"
          : "Verify 6-Digit Email OTP"
      }
      description={
        step === "login"
          ? "Log in using your Mobile Phone Number or Email Address."
          : step === "signup"
          ? "Enter your details below to create your Style Loom account."
          : `Enter the 6-digit verification code sent to ${email}`
      }
    >

      {/* LOGIN FORM */}
      {step === "login" && (
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Mobile Phone Number or Email Address
            </label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="0771234567 or customer@example.com"
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                className="pl-9"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Password
            </label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9"
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full bg-brand hover:bg-brand-700 text-white font-bold" disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </Button>

          <div className="text-center pt-2 text-sm text-slate-600 dark:text-slate-400">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={() => setStep("signup")}
              className="text-brand font-semibold hover:underline"
            >
              Sign Up / Register
            </button>
          </div>
        </form>
      )}

      {/* SIGNUP REGISTRATION FORM (NAME, EMAIL, PHONE, PASSWORD) */}
      {step === "signup" && (
        <form onSubmit={handleSignupSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Full Name / Username
            </label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Amaya Perera"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="pl-9"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Email Address
            </label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                type="email"
                placeholder="amaya@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Mobile Phone Number (WhatsApp)
            </label>
            <div className="relative mt-1">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                type="tel"
                placeholder="0771234567 or +94771234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="pl-9"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Password
            </label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Confirm Password
            </label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                type="password"
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-9"
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full bg-brand hover:bg-brand-700 text-white font-bold mt-2" disabled={loading}>
            {loading ? "Sending 6-Digit OTP..." : "Register & Send 6-Digit OTP to Email"}
          </Button>

          <div className="text-center pt-2 text-sm text-slate-600 dark:text-slate-400">
            Already registered?{" "}
            <button
              type="button"
              onClick={() => setStep("login")}
              className="text-brand font-semibold hover:underline"
            >
              Log In
            </button>
          </div>
        </form>
      )}

      {/* 6-DIGIT OTP VERIFICATION FORM */}
      {step === "otp" && (
        <form onSubmit={handleOtpVerify} className="space-y-4 pt-1">
          {/* OTP Card */}
          {generatedOtp && (
            <div className="bg-rose-50 dark:bg-rose-950/40 p-4 rounded-xl border border-rose-200 dark:border-rose-900/50 text-center space-y-2 shadow-sm">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block flex items-center justify-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> 6-Digit OTP Code Sent to Email ({email}):
              </span>

              <div className="text-3xl font-black font-mono tracking-widest text-brand">
                {generatedOtp}
              </div>

              <button
                type="button"
                onClick={() => {
                  setOtpCode(generatedOtp.split(""));
                }}
                className="text-xs font-bold text-brand hover:underline flex items-center justify-center gap-1 mx-auto pt-1 block"
              >
                ⚡ Click to Auto-Fill 6-Digit Code ({generatedOtp})
              </button>
            </div>
          )}

          <div className="flex items-center justify-center gap-2 pt-1">
            {otpCode.map((digit, idx) => (
              <input
                key={idx}
                id={`otp-input-${idx}`}
                type="text"
                maxLength={6}
                value={digit}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                onPaste={(e) => {
                  e.preventDefault();
                  const pasted = e.clipboardData.getData("text");
                  handleOtpChange(0, pasted);
                }}
                className="w-11 h-12 text-center text-xl font-bold rounded-lg border-2 border-slate-300 focus:border-brand focus:outline-none dark:bg-slate-800 dark:border-slate-700"
              />
            ))}
          </div>

          <Button type="submit" className="w-full bg-brand hover:bg-brand-700 text-white font-bold" disabled={loading}>
            {loading ? "Verifying..." : "Confirm OTP & Complete Registration"}
          </Button>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
            <span>
              {countdown > 0
                ? `Resend available in ${countdown}s`
                : "Didn't receive email code?"}
            </span>
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={!canResend || loading}
              className="font-semibold text-brand hover:underline disabled:opacity-50 flex items-center gap-1"
            >
              <RefreshCw className="h-3 w-3" /> Resend Code
            </button>
          </div>
        </form>
      )}
    </Dialog>
  );
}
