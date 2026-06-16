"use client";

import { useState } from "react";
import Image from "next/image";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<"boarders" | "dayscholars">("boarders");

  return (
    <div className="login-page relative min-h-screen overflow-hidden bg-[#faf8f5]">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="login-blob absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-amber-200/30 blur-3xl" />
        <div className="login-blob login-blob-delay absolute -right-24 top-1/4 h-[420px] w-[420px] rounded-full bg-red-200/25 blur-3xl" />
        <div className="login-blob absolute bottom-0 left-1/3 h-[380px] w-[380px] rounded-full bg-sky-200/20 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #d4a574 1px, transparent 0)`,
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col-reverse lg:flex-row">
        {/* Left — Hero */}
        <div className="hidden flex-1 flex-col justify-center px-6 py-12 md:flex lg:px-14 lg:py-16">
          <div className="login-fade-up flex items-center justify-between gap-6 border-b border-slate-200/60 pb-8">
            <div className="relative shrink-0">
              <div className="absolute inset-0 rounded-full bg-amber-400/20 blur-xl" />
              <Image
                src="/eme-logo.png"
                alt="NUST EME Logo"
                width={88}
                height={88}
                className="relative h-20 w-20 object-contain drop-shadow-md"
                priority
              />
            </div>
            
            <div className="text-center flex-1">
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl lg:text-3xl leading-tight">
                NUST College of EME Rawalpindi
              </h1>
              <h2 className="mt-2 text-sm font-semibold tracking-wider text-red-700 uppercase lg:text-base">
                Billing Management System
              </h2>
            </div>

            <div className="relative shrink-0">
              <div className="absolute inset-0 rounded-full bg-blue-400/20 blur-xl" />
              <Image
                src="/nust-logo.png"
                alt="NUST Logo"
                width={88}
                height={88}
                className="relative h-20 w-20 object-contain drop-shadow-md"
                priority
              />
            </div>
          </div>

          <div className="login-fade-up login-fade-delay-1 mt-8">
            <div className="relative inline-flex w-full rounded-2xl bg-slate-200/50 p-1.5 backdrop-blur-sm">
              <button
                type="button"
                onClick={() => setActiveTab("boarders")}
                className={`relative z-10 flex-1 py-3 text-center text-sm font-bold transition-all duration-300 rounded-xl ${
                  activeTab === "boarders"
                    ? "text-slate-900 shadow-md"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {activeTab === "boarders" && (
                  <span className="absolute inset-0 -z-10 rounded-xl bg-white shadow-sm" />
                )}
                Boarders
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("dayscholars")}
                className={`relative z-10 flex-1 py-3 text-center text-sm font-bold transition-all duration-300 rounded-xl ${
                  activeTab === "dayscholars"
                    ? "text-slate-900 shadow-md"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {activeTab === "dayscholars" && (
                  <span className="absolute inset-0 -z-10 rounded-xl bg-white shadow-sm" />
                )}
                Dayscholars
              </button>
            </div>
          </div>
        </div>

        {/* Right — Login */}
        <div className="flex flex-1 items-center justify-center px-6 py-12 lg:px-10">
          <div className="login-fade-up login-fade-delay-2 w-full max-w-[420px]">
            <div className="relative">
              {/* Card glow */}
              <div className="absolute -inset-1 rounded-[28px] bg-gradient-to-br from-amber-300/40 via-red-300/30 to-sky-300/30 blur-sm" />

              <div className="relative overflow-hidden rounded-[26px] border border-white/80 bg-white/95 p-6 shadow-2xl shadow-slate-300/30 backdrop-blur-xl sm:p-8 lg:p-10">
                {/* Top accent bar */}
                <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-red-600 via-amber-500 to-red-600" />

                <div className="text-center">
                  <div className="relative mx-auto mb-5 inline-block">
                    <div className="absolute inset-0 scale-110 rounded-full bg-gradient-to-br from-amber-100 to-red-50 blur-md" />
                    <Image
                      src="/eme-logo.png"
                      alt="NUST EME"
                      width={88}
                      height={88}
                      className="relative mx-auto h-[88px] w-[88px] object-contain"
                      priority
                    />
                  </div>
                  <h3 className="text-2xl font-extrabold tracking-tight text-slate-900 uppercase">
                    WELCOME SAG ACCT
                  </h3>
                  <p className="mt-1.5 text-sm font-medium text-slate-600">
                    College of Electrical & Mechanical Engineering
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Sign in to your billing dashboard
                  </p>
                </div>

                <div className="mt-8">
                  <LoginForm />
                </div>

                <div className="mt-8 flex items-center justify-center gap-2 border-t border-slate-100 pt-6">
                  <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <p className="text-xs text-slate-400">
                    Authorized staff only · Contact admin for access
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
