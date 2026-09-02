"use client";

import React, { useState, useEffect } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { store } from "@/lib/supabase/store";
import { Lock, Mail, User, Phone, MessageCircle, ArrowRight, RefreshCw, Sparkles, CheckCircle2 } from "lucide-react";

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
  const [authMethod, setAuthMethod] = useState<"phone" | "email">("phone");

  // Form states
  const [fullName, setFullName] = useState("");
  const [identifier, setIdentifier] = useState(""); // Phone number or email
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [generatedOtp, setGeneratedOtp] = useState<string>("");
  
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

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) {
      showToast("Please enter your Phone Number or Email and Password", "error");
      return;
    }
    setLoading(true);

    try {
      const res = store.login(identifier);
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

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !identifier || !password || !confirmPassword) {
      showToast("Please fill in all fields", "error");
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
      const res = store.signUp(identifier, fullName, password);
      if (res && res.otp) {
        setGeneratedOtp(res.otp);
      }
      showToast("6-digit verification OTP generated!", "info");
      setStep("otp");
      setCountdown(60);
      setCanResend(false);
    } catch (err: any) {
      showToast(err.message || "Failed to create account", "error");
    } finally {
      setLoading(false);
    }
  };

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

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = otpCode.join("");
    if (fullCode.length !== 6) {
      showToast("Please enter all 6 digits of the OTP code", "error");
      return;
    }
    setLoading(true);
    try {
      const res = store.verifyOtp(identifier, fullCode);
      if (!res.success) throw new Error(res.error);

      showToast("Account verified successfully! You are logged in.", "success");
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      showToast(err.message || "Invalid 6-digit OTP code", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    setLoading(true);
    try {
      const res = store.signUp(identifier, fullName, password);
      if (res && res.otp) {
        setGeneratedOtp(res.otp);
      }
      showToast("New 6-digit OTP code sent!", "info");
      setCountdown(60);
      setCanResend(false);
    } catch (err: any) {
      showToast(err.message || "Failed to resend code", "error");
    } finally {
      setLoading(false);
    }
  };

  const isPhoneMode = authMethod === "phone";

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={
        step === "login"
          ? "Customer Login"
          : step === "signup"
          ? "Create Customer Account"
          : "Verify Account with 6-Digit OTP"
      }
      description={
        step === "login"
          ? "Log in to add items to cart, order via WhatsApp, or submit requests."
          : step === "signup"
          ? "Join Style Loom to shop and request custom designs."
          : `Enter the 6-digit verification code for ${identifier}`
      }
    >
      {/* Auth Method Toggle Selector */}
      {step !== "otp" && (
        <div className="grid grid-cols-2 gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-4 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setAuthMethod("phone");
              setIdentifier("");
            }}
            className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              authMethod === "phone"
                ? "bg-white dark:bg-slate-900 text-brand shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <Phone className="h-3.5 w-3.5" /> Mobile Phone
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthMethod("email");
              setIdentifier("");
            }}
            className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              authMethod === "email"
                ? "bg-white dark:bg-slate-900 text-brand shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <Mail className="h-3.5 w-3.5" /> Email Address
          </button>
        </div>
      )}

      {/* LOGIN STEP */}
      {step === "login" && (
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {isPhoneMode ? "Mobile Phone Number (WhatsApp)" : "Email Address"}
            </label>
            <div className="relative mt-1">
              {isPhoneMode ? (
                <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              ) : (
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              )}
              <Input
                type={isPhoneMode ? "tel" : "email"}
                placeholder={isPhoneMode ? "0771234567 or +94771234567" : "name@example.com"}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
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
              Sign Up
            </button>
          </div>
        </form>
      )}

      {/* SIGNUP STEP */}
      {step === "signup" && (
        <form onSubmit={handleSignupSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Full Name
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
              {isPhoneMode ? "Mobile Phone Number (WhatsApp)" : "Email Address"}
            </label>
            <div className="relative mt-1">
              {isPhoneMode ? (
                <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              ) : (
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              )}
              <Input
                type={isPhoneMode ? "tel" : "email"}
                placeholder={isPhoneMode ? "0771234567 or +94771234567" : "amaya@example.com"}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
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
            {loading ? "Creating Account..." : "Continue to 6-Digit OTP Verification"}
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

      {/* OTP STEP */}
      {step === "otp" && (
        <form onSubmit={handleOtpVerify} className="space-y-4 pt-1">
          {/* WhatsApp / Email OTP Card */}
          {generatedOtp && (
            <div className="bg-rose-50 dark:bg-rose-950/40 p-4 rounded-xl border border-rose-200 dark:border-rose-900/50 text-center space-y-2 shadow-sm">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block flex items-center justify-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Your 6-Digit Verification OTP Code:
              </span>

              <div className="text-3xl font-black font-mono tracking-widest text-brand">
                {generatedOtp}
              </div>

              {/* Direct WhatsApp OTP Dispatch Link */}
              {isPhoneMode && identifier && (
                <a
                  href={`https://wa.me/${identifier.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                    `Hello ${fullName}! Your Style Loom account verification OTP code is: ${generatedOtp}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow transition-all"
                >
                  <MessageCircle className="h-3.5 w-3.5" /> Send Code to My WhatsApp
                </a>
              )}

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
            {loading ? "Verifying..." : "Verify Code & Log In"}
          </Button>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
            <span>
              {countdown > 0
                ? `Resend available in ${countdown}s`
                : "Didn't receive code?"}
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
