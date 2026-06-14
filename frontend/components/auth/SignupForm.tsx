"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiClientError } from "@/lib/api";
import { setAuth } from "@/lib/auth";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { Alert } from "../ui/Alert";

export function SignupForm() {
  const router = useRouter();
  const [step, setStep] = useState<"key" | "form">("key");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [signupKey, setSignupKey] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });

  const verifyKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/auth/verify-invite", { signupKey }, false);
      setStep("form");
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Invalid invite key");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await api.post<{ user: { id: string; name: string; email: string; role: string }; token: string }>(
        "/auth/signup",
        { ...form, signupKey },
        false
      );
      setAuth(data.token, data.user);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  if (step === "key") {
    return (
      <form onSubmit={verifyKey} className="space-y-4">
        {error && <Alert type="error" message={error} />}
        <Alert
          type="warning"
          message="Private registration — invite key required. This page is not linked publicly."
        />
        <Input
          label="Private Invite Key"
          type="password"
          value={signupKey}
          onChange={(e) => setSignupKey(e.target.value)}
          required
          placeholder="Enter your private signup key"
        />
        <Button type="submit" loading={loading} className="w-full">
          Verify Key
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSignup} className="space-y-4">
      {error && <Alert type="error" message={error} />}
      <Input label="Full Name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
      <Input label="Email" type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} required />
      <Input label="Password" type="password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} required />
      <Input label="Confirm Password" type="password" value={form.confirmPassword} onChange={(e) => setForm((p) => ({ ...p, confirmPassword: e.target.value }))} required />
      <Button type="submit" loading={loading} className="w-full">
        Create Account
      </Button>
    </form>
  );
}
