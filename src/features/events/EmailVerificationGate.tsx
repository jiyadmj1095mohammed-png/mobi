"use client";

import { FormEvent, useState } from "react";
import { AtSign, CheckCircle2, Loader2, Mail, ShieldCheck, X } from "lucide-react";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

interface EmailVerificationGateProps {
  onClose: () => void;
  onVerified: () => void;
}

export default function EmailVerificationGate({ onClose, onVerified }: EmailVerificationGateProps) {
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const redirectTo = typeof window === "undefined" ? undefined : `${window.location.origin}/app/events`;

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!isSupabaseConfigured) {
      setError("Email verification is not configured yet. Add the Supabase environment variables before accepting bookings.");
      return;
    }

    setIsLoading(true);
    try {
      if (mode === "sign-up") {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: redirectTo },
        });
        if (signUpError) throw signUpError;
        setMessage("Verification email sent. Open the link in your inbox, then sign in here to complete booking.");
        setMode("sign-in");
        return;
      }

      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;

      if (!data.user?.email_confirmed_at) {
        setError("This email is not verified yet. Check your inbox, then use the link before booking.");
        return;
      }

      onVerified();
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : "Unable to verify this email right now.");
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerification = async () => {
    setError("");
    setMessage("");
    if (!email) {
      setError("Enter your email address first so we know where to resend the verification link.");
      return;
    }
    if (!isSupabaseConfigured) {
      setError("Email verification is not configured yet.");
      return;
    }

    setIsLoading(true);
    try {
      const { error: resendError } = await supabase.auth.resend({
        type: "signup",
        email,
        options: { emailRedirectTo: redirectTo },
      });
      if (resendError) throw resendError;
      setMessage("A new verification link has been sent to your inbox.");
    } catch (resendError) {
      setError(resendError instanceof Error ? resendError.message : "Could not resend the verification email.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
      <div className="w-full max-w-md rounded-[28px] border border-white/15 bg-white/[0.08] p-6 text-white shadow-2xl backdrop-blur-2xl sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-white">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/50">Secure event booking</p>
              <h2 className="mt-0.5 text-lg font-extrabold">Verify your email</h2>
            </div>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-1.5 text-white/55 transition hover:bg-white/10 hover:text-white" aria-label="Close verification dialog">
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-5 text-xs leading-relaxed text-white/70">
          A verified email is required before an event ticket can be confirmed.
        </p>

        <div className="mt-5 grid grid-cols-2 rounded-2xl border border-white/10 bg-black/20 p-1 text-xs font-bold">
          <button type="button" onClick={() => setMode("sign-in")} className={`rounded-xl px-3 py-2 transition ${mode === "sign-in" ? "mobi-light-action bg-white text-black" : "text-white/60 hover:text-white"}`}>
            Sign in
          </button>
          <button type="button" onClick={() => setMode("sign-up")} className={`rounded-xl px-3 py-2 transition ${mode === "sign-up" ? "mobi-light-action bg-white text-black" : "text-white/60 hover:text-white"}`}>
            Create account
          </button>
        </div>

        <form className="mt-5 space-y-3" onSubmit={submit}>
          <label className="block text-xs font-semibold text-white/75">
            College email
            <span className="relative mt-1.5 block">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/45" />
              <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@example.com" className="w-full rounded-2xl border border-white/15 bg-white/[0.07] py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-white/40 focus:border-white/45" />
            </span>
          </label>
          <label className="block text-xs font-semibold text-white/75">
            Password
            <span className="relative mt-1.5 block">
              <AtSign className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/45" />
              <input type="password" required minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 6 characters" className="w-full rounded-2xl border border-white/15 bg-white/[0.07] py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-white/40 focus:border-white/45" />
            </span>
          </label>

          {error && <p className="rounded-2xl border border-red-300/20 bg-red-400/10 px-3 py-2.5 text-xs text-red-200">{error}</p>}
          {message && <p className="flex items-start gap-2 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-3 py-2.5 text-xs text-emerald-100"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" />{message}</p>}

          <button type="submit" disabled={isLoading} className="flex min-h-[46px] w-full items-center justify-center gap-2 rounded-2xl bg-white text-xs font-extrabold text-black transition hover:bg-white/85 disabled:cursor-not-allowed disabled:opacity-60">
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === "sign-in" ? "Verify and continue" : "Send verification email"}
          </button>
        </form>

        <button type="button" disabled={isLoading} onClick={resendVerification} className="mt-4 w-full text-center text-xs font-bold text-white/65 underline-offset-4 transition hover:text-white hover:underline disabled:opacity-50">
          Resend verification email
        </button>
      </div>
    </div>
  );
}
