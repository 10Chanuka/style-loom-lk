"use client";

import React, { useState, useEffect } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { store } from "@/lib/supabase/store";
import { createClient } from "@/lib/supabase/client";
import { Lock, Mail, User, KeyRound, ArrowRight, RefreshCw } from "lucide-react";

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

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  
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
    if (!email || !password) {
      showToast("Please enter your email and password", "error");
      return;
    }
    setLoading(true);

    try {
      const supabase = createClient();
      if (supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        showToast("Logged in successfully!", "success");
      } else {
        // Fallback store
        store.login(email);
        showToast("Logged in successfully!", "success");
      }
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      showToast(err.message || "Failed to log in", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password || !confirmPassword) {
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
      const supabase = createClient();
      if (supabase) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });
        if (error) throw error;
      } else {
        store.signUp(email, fullName, password);
      }
      showToast("6-digit verification code sent to your email!", "info");
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
      // Handle paste
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

    // Auto focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = otpCode.join("");
    if (fullCode.length !== 6) {
      showToast("Please enter all 6 digits of the code", "error");
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      if (supabase) {
        const { error } = await supabase.auth.verifyOtp({
          email,
          token: fullCode,
          type: "email",
        });
        if (error) throw error;
      } else {
        const res = store.verifyOtp(email, fullCode);
        if (!res.success) throw new Error(res.error);
      }
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
      const supabase = createClient();
      if (supabase) {
        await supabase.auth.resend({ email, type: "signup" });
      } else {
        store.signUp(email, fullName, password);
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

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={
        step === "login"
          ? "Customer Login"
          : step === "signup"
          ? "Create Customer Account"
          : "Verify Email with 6-Digit OTP"
      }
      description={
        step === "login"
          ? "Log in to add items to cart, order via WhatsApp, or submit requests."
          : step === "signup"
          ? "Join Elegance Fashion to shop and request custom designs."
          : `Enter the 6-digit verification code sent to ${email}`
      }
    >
      {step === "login" && (
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Email Address
            </label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
          <Button type="submit" className="w-full" disabled={loading}>
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
          <Button type="submit" className="w-full mt-2" disabled={loading}>
            {loading ? "Creating Account..." : "Continue to Verification"}
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

      {step === "otp" && (
        <form onSubmit={handleOtpVerify} className="space-y-4 pt-2">
          <div className="flex items-center justify-center gap-2">
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

          <Button type="submit" className="w-full" disabled={loading}>
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
