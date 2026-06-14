import Image from "next/image";
import { LoginForm } from "@/components/auth/LoginForm";

const features = [
  {
    icon: "🎓",
    color: "bg-red-50 text-red-600 ring-red-100",
    title: "Student Records",
    desc: "NS, GC, PC & AES — Boarders & Day Scholars",
  },
  {
    icon: "🍽️",
    color: "bg-amber-50 text-amber-600 ring-amber-100",
    title: "Mess & Washing",
    desc: "Messing, dhobi & laundry charges tracking",
  },
  {
    icon: "📋",
    color: "bg-sky-50 text-sky-600 ring-sky-100",
    title: "Monthly Billing",
    desc: "Bills, payments, balance & vouchers",
  },
  {
    icon: "📤",
    color: "bg-emerald-50 text-emerald-600 ring-emerald-100",
    title: "Excel Upload",
    desc: "Import master, billing & invoice sheets",
  },
  {
    icon: "🔍",
    color: "bg-violet-50 text-violet-600 ring-violet-100",
    title: "CMS ID Lookup",
    desc: "Instant full student billing history",
  },
  {
    icon: "📊",
    color: "bg-orange-50 text-orange-600 ring-orange-100",
    title: "Live Dashboard",
    desc: "Dues, collections & category reports",
  },
];

const categories = ["NS", "GC", "PC", "AES"];

export default function LoginPage() {
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
          <div className="login-fade-up flex items-center gap-5">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-amber-400/20 blur-xl" />
              <Image
                src="/nust-eme-logo.png"
                alt="NUST EME Logo"
                width={96}
                height={96}
                className="relative h-24 w-24 object-contain drop-shadow-md"
                priority
              />
            </div>
            <div>
              <div className="mb-1.5 inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-red-700 shadow-sm ring-1 ring-red-100">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
                NUST · College of EME
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 lg:text-3xl">
                Student Billing System
              </h1>
            </div>
          </div>

          <h2 className="login-fade-up login-fade-delay-1 mt-8 text-3xl font-extrabold leading-[1.15] tracking-tight text-slate-900 lg:text-[2.6rem]">
            Manage Charges.
            <br />
            <span className="bg-gradient-to-r from-red-600 via-red-500 to-amber-600 bg-clip-text text-transparent">
              Track Every Bill.
            </span>
          </h2>

          <p className="login-fade-up login-fade-delay-2 mt-5 max-w-xl text-[15px] leading-relaxed text-slate-600">
            NUST EME digital billing portal for messing, washing, laundry, and monthly bills —
            built for mess staff, accounts office, and administration.
          </p>

          <div className="login-fade-up login-fade-delay-2 mt-5 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <span
                key={cat}
                className="rounded-lg bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 shadow-sm ring-1 ring-slate-200/80"
              >
                {cat}
              </span>
            ))}
            <span className="rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm">
              Boarder · Day Scholar
            </span>
          </div>

          <div className="login-fade-up login-fade-delay-3 mt-10 grid gap-3 sm:grid-cols-2">
            {features.map((f) => (
              <div
                key={f.title}
                className="group flex items-start gap-3.5 rounded-2xl border border-white/60 bg-white/70 p-4 shadow-sm backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-lg hover:shadow-amber-100/50"
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg ring-1 ${f.color}`}
                >
                  {f.icon}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{f.title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{f.desc}</p>
                </div>
              </div>
            ))}
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
                      src="/nust-eme-logo.png"
                      alt="NUST EME"
                      width={88}
                      height={88}
                      className="relative mx-auto h-[88px] w-[88px] object-contain"
                      priority
                    />
                  </div>
                  <h3 className="text-2xl font-extrabold tracking-tight text-slate-900">
                    Welcome Back
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
