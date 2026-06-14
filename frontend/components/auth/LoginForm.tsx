"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiClientError } from "@/lib/api";
import { setAuth } from "@/lib/auth";
import { Input } from "../ui/Input";
import { PasswordInput } from "../ui/PasswordInput";
import { Alert } from "../ui/Alert";

export function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await api.post<{ user: { id: string; name: string; email: string; role: string }; token: string }>(
        "/auth/login",
        form,
        false
      );
      setAuth(data.token, data.user);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <Alert type="error" message={error} />}

      <Input
        label="Email Address"
        type="email"
        placeholder="name@nust.edu.pk"
        value={form.email}
        onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
        required
        autoComplete="email"
        className="!rounded-xl !border-slate-200 !py-2.5 !shadow-sm focus:!border-red-400 focus:!ring-red-100"
      />

      <PasswordInput
        label="Password"
        placeholder="Enter your password"
        value={form.password}
        onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
        required
        autoComplete="current-password"
        className="!rounded-xl !border-slate-200 !py-2.5 !shadow-sm focus:!border-red-400 focus:!ring-red-100"
      />

      <button
        type="submit"
        disabled={loading}
        className="login-btn relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-red-700 via-red-600 to-red-700 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-red-200/60 transition hover:shadow-xl hover:shadow-red-300/50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Signing in...
          </span>
        ) : (
          "Sign In to Dashboard →"
        )}
      </button>
    </form>
  );
}
