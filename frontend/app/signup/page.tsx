import { SignupForm } from "@/components/auth/SignupForm";

export const metadata = {
  robots: "noindex, nofollow",
};

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 p-4">
      <div className="w-full max-w-md rounded-2xl border border-purple-500/20 bg-white/95 p-8 shadow-2xl backdrop-blur">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-600 text-2xl text-white">
            🔒
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Private Signup</h1>
          <p className="mt-1 text-sm text-slate-500">Invite-only registration</p>
        </div>
        <SignupForm />
      </div>
    </div>
  );
}
