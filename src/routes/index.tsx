import { createFileRoute } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  Bell, BookOpen, Building2, CalendarDays, ChevronDown, CircleDollarSign,
  ClipboardList, CreditCard, Eye, FileBarChart, GraduationCap, LayoutDashboard,
  LockKeyhole, LogOut, Menu, Pencil, ReceiptText, Search, Settings, ShieldCheck,
  Trash2, TrendingUp, UserRound, UsersRound, WalletCards, X,
} from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "UniHostel | Billing Management" },
      { name: "description", content: "University hostel boarder billing, collections, and reporting dashboard." },
      { property: "og:title", content: "UniHostel Billing Management" },
      { property: "og:description", content: "A modern administration system for hostel student billing." },
    ],
  }),
  component: Index,
});

function Index() {
  const [authenticated, setAuthenticated] = useState(false);
  if (!authenticated) return <Login onLogin={() => setAuthenticated(true)} />;
  return <Dashboard onLogout={() => setAuthenticated(false)} />;
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-lg">
        <GraduationCap className="size-6" />
      </div>
      {!compact && <div className="min-w-0"><p className="font-display text-lg font-bold leading-tight">Northbridge</p><p className="text-[10px] font-bold uppercase tracking-[.22em] opacity-65">University</p></div>}
    </div>
  );
}

function Login({ onLogin }: { onLogin: () => void }) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <main className="grid min-h-screen bg-background lg:grid-cols-[1.05fr_.95fr]">
      <section className="login-grid relative hidden overflow-hidden bg-sidebar p-12 text-sidebar-foreground lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-24 top-16 size-80 rounded-full bg-sidebar-primary/15 blur-3xl" />
        <Brand />
        <div className="relative max-w-xl enter-up">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-sidebar-border bg-sidebar-accent/50 px-3 py-1.5 text-xs font-semibold"><ShieldCheck className="size-4 text-sidebar-primary" /> Secure Administration Portal</span>
          <h1 className="font-display text-5xl font-bold leading-[1.08] tracking-tight">Better hostel operations start with clear finances.</h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-sidebar-foreground/70">A unified workspace for student boarding records, accurate billing, collections, and university-ready reports.</p>
          <div className="mt-10 grid grid-cols-3 gap-3">
            {[['1,248','Boarders'],['99.8%','Accuracy'],['24/7','Access']].map(([value,label]) => <div key={label} className="border-l border-sidebar-border pl-4"><p className="text-xl font-extrabold">{value}</p><p className="text-xs text-sidebar-foreground/55">{label}</p></div>)}
          </div>
        </div>
        <p className="text-xs text-sidebar-foreground/45">© 2026 Northbridge University · IT Directorate</p>
      </section>
      <section className="flex items-center justify-center px-5 py-10 sm:px-10">
        <div className="w-full max-w-md enter-up">
          <div className="mb-10 flex justify-center lg:hidden"><Brand /></div>
          <p className="mb-2 text-sm font-bold uppercase tracking-[.18em] text-primary">Welcome back</p>
          <h2 className="font-display text-4xl font-bold tracking-tight">Sign in to UniHostel</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">Use your university administration credentials to continue.</p>
          <form className="mt-9 space-y-5" onSubmit={(event) => { event.preventDefault(); onLogin(); }}>
            <Field label="Username"><div className="relative"><UserRound className="absolute left-3 top-3 size-4 text-muted-foreground"/><Input className="h-11 pl-10" placeholder="e.g. admin.northbridge" defaultValue="admin.northbridge" /></div></Field>
            <Field label="Password"><div className="relative"><LockKeyhole className="absolute left-3 top-3 size-4 text-muted-foreground"/><Input className="h-11 px-10" type={showPassword ? 'text' : 'password'} defaultValue="northbridge2026"/><Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1 size-9" onClick={() => setShowPassword(!showPassword)}><Eye /></Button></div></Field>
            <div className="flex items-center justify-between text-sm"><label className="flex cursor-pointer items-center gap-2"><Checkbox defaultChecked /> Remember me</label><a href="mailto:helpdesk@northbridge.edu" className="font-semibold text-primary hover:underline">Forgot password?</a></div>
            <Button type="submit" variant="enterprise" className="h-11 w-full">Sign in to dashboard</Button>
          </form>
          <div className="mt-8 flex items-center justify-center gap-2 border-t pt-6 text-xs text-muted-foreground"><LockKeyhole className="size-3.5"/> Protected by university single sign-on</div>
        </div>
      </section>
    </main>
  );
}

const navItems = [
  [LayoutDashboard, 'Dashboard'], [UsersRound, 'Student Management'], [Building2, 'Boarder Students'],
  [ReceiptText, 'Billing Management'], [WalletCards, 'Expenses Entry'], [FileBarChart, 'Reports'], [Settings, 'Settings'],
] as const;

const revenueData = [
  { month: 'Jan', collected: 32, due: 12 }, { month: 'Feb', collected: 38, due: 10 }, { month: 'Mar', collected: 35, due: 14 },
  { month: 'Apr', collected: 46, due: 9 }, { month: 'May', collected: 50, due: 8 }, { month: 'Jun', collected: 57, due: 11 },
];

const students = [
  ['CMS-21-1042', 'Areeba Khan', '86,500', '86,500', '0', 'Paid', '10 Jun 2026'],
  ['CMS-22-0874', 'Hamza Siddiqui', '91,200', '60,000', '31,200', 'Partial', '09 Jun 2026'],
  ['CMS-23-1138', 'Maham Raza', '78,750', '0', '78,750', 'Unpaid', '—'],
  ['CMS-21-0955', 'Rayan Ahmed', '84,000', '84,000', '0', 'Paid', '07 Jun 2026'],
  ['CMS-24-1201', 'Zoya Faisal', '88,500', '50,000', '38,500', 'Partial', '05 Jun 2026'],
];

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [active, setActive] = useState('Dashboard');
  return (
    <div className="min-h-screen bg-canvas lg:grid lg:grid-cols-[260px_minmax(0,1fr)]">
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-foreground/30 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col bg-sidebar text-sidebar-foreground transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex h-20 items-center justify-between border-b border-sidebar-border px-5"><Brand /><Button variant="ghost" size="icon" className="text-sidebar-foreground lg:hidden" onClick={() => setSidebarOpen(false)}><X /></Button></div>
        <nav className="flex-1 space-y-1 p-3">
          <p className="px-3 pb-2 pt-3 text-[10px] font-bold uppercase tracking-[.2em] text-sidebar-foreground/40">Administration</p>
          {navItems.map(([Icon, label]) => <Button key={label} variant="ghost" onClick={() => { setActive(label); setSidebarOpen(false); }} className={`h-11 w-full justify-start px-3 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${active === label ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-sm' : ''}`}><Icon />{label}</Button>)}
        </nav>
        <div className="border-t border-sidebar-border p-3"><Button variant="ghost" className="h-11 w-full justify-start px-3 text-sidebar-foreground/65 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" onClick={onLogout}><LogOut /> Logout</Button></div>
      </aside>
      <div className="min-w-0">
        <header className="sticky top-0 z-20 grid h-20 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b bg-card/95 px-4 backdrop-blur sm:px-7">
          <div className="flex min-w-0 items-center gap-3"><Button variant="subtle" size="icon" className="shrink-0 lg:hidden" onClick={() => setSidebarOpen(true)}><Menu /></Button><div className="min-w-0"><p className="truncate font-display text-lg font-bold sm:text-xl">Northbridge University</p><p className="hidden text-xs text-muted-foreground sm:block">Hostel Billing Management System</p></div></div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-4"><div className="hidden items-center gap-2 border-r pr-4 text-xs text-muted-foreground md:flex"><CalendarDays className="size-4"/> Saturday, 13 June 2026</div><Button variant="subtle" size="icon" className="relative"><Bell/><span className="absolute right-2 top-2 size-2 rounded-full bg-destructive ring-2 ring-card" /></Button><Button variant="ghost" className="h-11 gap-2 px-1.5"><span className="grid size-8 place-items-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">AK</span><span className="hidden text-left sm:block"><span className="block text-xs font-bold">Ayesha Karim</span><span className="block text-[10px] text-muted-foreground">Finance Admin</span></span><ChevronDown className="hidden size-3.5 sm:block"/></Button></div>
        </header>
        <main className="mx-auto max-w-[1560px] p-4 sm:p-7">
          <div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="text-sm font-semibold text-primary">Academic Year 2025–26</p><h1 className="mt-1 font-display text-3xl font-bold tracking-tight">Administration overview</h1><p className="mt-1 text-sm text-muted-foreground">Monitor collections and manage boarder student billing.</p></div><Button variant="subtle"><FileBarChart/> Export summary</Button></div>
          <Kpis />
          <div className="mt-6 grid gap-6 xl:grid-cols-[1.7fr_1fr]">
            <section className="rounded-xl border bg-card p-5 enterprise-shadow"><div className="mb-5 flex items-start justify-between"><div><h2 className="font-bold">Revenue overview</h2><p className="text-xs text-muted-foreground">Collected and outstanding amounts · PKR in millions</p></div><span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground">Last 6 months</span></div><div className="h-64"><ResponsiveContainer width="100%" height="100%"><AreaChart data={revenueData}><defs><linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.28}/><stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)"/><XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={11}/><YAxis axisLine={false} tickLine={false} fontSize={11}/><Tooltip contentStyle={{ borderRadius: 10, borderColor: 'var(--color-border)' }}/><Area type="monotone" dataKey="collected" stroke="var(--color-primary)" strokeWidth={2.5} fill="url(#revenue)"/></AreaChart></ResponsiveContainer></div></section>
            <section className="rounded-xl border bg-card p-5 enterprise-shadow"><div className="mb-5"><h2 className="font-bold">Collection health</h2><p className="text-xs text-muted-foreground">Paid vs. pending billing</p></div><div className="h-48"><ResponsiveContainer width="100%" height="100%"><BarChart data={revenueData.slice(-4)}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)"/><XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={11}/><YAxis hide/><Tooltip/><Bar dataKey="collected" fill="var(--color-primary)" radius={[5,5,0,0]}/><Bar dataKey="due" fill="var(--color-warning)" radius={[5,5,0,0]}/></BarChart></ResponsiveContainer></div><div className="mt-3 flex gap-5 text-xs"><span className="flex items-center gap-2"><i className="size-2 rounded-full bg-primary"/>Collected</span><span className="flex items-center gap-2"><i className="size-2 rounded-full bg-warning"/>Outstanding</span></div></section>
          </div>
          <BillingForm />
          <StudentTable />
        </main>
      </div>
    </div>
  );
}

function Kpis() {
  const items = [
    [UsersRound, 'Total boarder students', '1,248', '+3.2%', 'bg-secondary text-secondary-foreground'],
    [CircleDollarSign, 'Outstanding balance', 'PKR 8.42M', '-4.1%', 'bg-warning/15 text-warning'],
    [TrendingUp, 'Amount collected', 'PKR 42.8M', '+8.6%', 'bg-success/15 text-success'],
    [ClipboardList, 'Pending bills', '186', '14.9%', 'bg-destructive/10 text-destructive'],
    [CreditCard, 'Monthly revenue', 'PKR 7.15M', '+6.4%', 'bg-info/10 text-info'],
  ] as const;
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">{items.map(([Icon,label,value,delta,color]) => <article key={label} className="rounded-xl border bg-card p-4 enterprise-shadow"><div className="flex items-start justify-between"><span className={`grid size-10 place-items-center rounded-lg ${color}`}><Icon className="size-5"/></span><span className="text-[10px] font-bold text-muted-foreground">{delta}</span></div><p className="mt-4 text-xs font-semibold text-muted-foreground">{label}</p><p className="mt-1 text-xl font-extrabold tracking-tight">{value}</p></article>)}</div>;
}

const studentFields = [
  ['CMS ID','CMS-24-1201'], ['Student Name','Zoya Faisal'], ['Father Name','Faisal Mahmood'], ['Father Occupation','Civil Engineer'],
  ['Student Contact Number','0301 555 0198'], ['Parent Contact Number','0321 884 1092'], ['Email Address','zoya.faisal@northbridge.edu'], ['Location','Lahore, Punjab'],
];
const billingFields = [
  ['Six Month Fixed Charges','45000'], ['Security Hostel/Mess','10000'], ['Water & Room Contribution','6000'], ['Messing Charges','18500'],
  ['Fine','0'], ['Utility Bill','4500'], ['Sports Charges','1500'], ['UMS Charges','1000'], ['Convocation Charges','0'],
  ['Outfit Items Charges','2000'], ['Dhobi / Uniform Washing Charges','1500'], ['Late Fee Fine','0'],
];

function Field({ label, children }: { label: string; children: ReactNode }) { return <div><Label className="mb-1.5 block text-xs font-bold text-foreground/75">{label}</Label>{children}</div>; }
function FieldInput({ label, value }: { label: string; value: string }) { return <Field label={label}><Input className="h-10 bg-card" defaultValue={value}/></Field>; }
function SelectField({ label, value, options }: { label: string; value: string; options: string[] }) { return <Field label={label}><Select defaultValue={value}><SelectTrigger className="h-10 bg-card"><SelectValue/></SelectTrigger><SelectContent>{options.map(item => <SelectItem value={item} key={item}>{item}</SelectItem>)}</SelectContent></Select></Field>; }

function BillingForm() {
  return <section className="mt-6 overflow-hidden rounded-xl border bg-card enterprise-shadow">
    <div className="flex flex-col justify-between gap-3 border-b bg-secondary/40 px-5 py-4 sm:flex-row sm:items-center"><div><h2 className="flex items-center gap-2 font-bold"><BookOpen className="size-5 text-primary"/> Boarder student billing entry</h2><p className="mt-1 text-xs text-muted-foreground">Create and calculate a new six-month billing record.</p></div><span className="w-fit rounded-full border bg-card px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Draft entry · #BIL-260613</span></div>
    <form className="p-5 sm:p-6" onSubmit={(e) => e.preventDefault()}>
      <FormHeading number="01" title="Student information" />
      <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2 xl:grid-cols-4">{studentFields.map(([label,value]) => <FieldInput key={label} label={label} value={value}/>)}<SelectField label="Gender" value="Female" options={['Female','Male','Other']}/><SelectField label="Category" value="Regular" options={['Regular','Scholarship','Self Finance']}/><SelectField label="Discipline" value="Computer Science" options={['Computer Science','Engineering','Business','Social Sciences']}/><SelectField label="Degree Program" value="BS Computer Science" options={['BS Computer Science','BBA','BS Engineering','MS Data Science']}/><SelectField label="Arrear Status" value="No Arrears" options={['No Arrears','Arrears Pending','Under Review']}/></div>
      <div className="my-7 border-t" />
      <FormHeading number="02" title="Billing information" />
      <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2 xl:grid-cols-4">{billingFields.map(([label,value]) => <Field key={label} label={label}><div className="relative"><span className="absolute left-3 top-3 text-[10px] font-extrabold text-muted-foreground">PKR</span><Input type="number" className="h-10 pl-12 text-right font-semibold tabular-nums" defaultValue={value}/></div></Field>)}</div>
      <div className="my-7 border-t" />
      <FormHeading number="03" title="Payment summary" />
      <div className="grid gap-5 xl:grid-cols-[1.3fr_.7fr]">
        <div className="grid gap-4 sm:grid-cols-2"><Field label="Bill Deposit Date"><Input type="date" className="h-10" defaultValue="2026-06-13"/></Field><SelectField label="Status" value="Partial" options={['Paid','Unpaid','Partial']}/><div className="sm:col-span-2"><Field label="Remarks"><Textarea className="min-h-24 resize-none" defaultValue="First installment received. Remaining balance due by 30 June 2026."/></Field></div></div>
        <div className="rounded-xl bg-sidebar p-5 text-sidebar-foreground"><p className="text-xs font-bold uppercase tracking-[.15em] text-sidebar-foreground/55">Auto calculation</p><div className="mt-5 space-y-4"><SummaryRow label="Total Bill" value="PKR 90,000"/><div><Label className="mb-1.5 block text-xs text-sidebar-foreground/60">Paid Amount</Label><Input className="h-11 border-sidebar-border bg-sidebar-accent text-sidebar-accent-foreground" defaultValue="50,000"/></div><div className="border-t border-sidebar-border pt-4"><SummaryRow label="Remaining Balance" value="PKR 40,000" strong/></div></div></div>
      </div>
      <div className="mt-6 flex flex-col-reverse justify-end gap-3 border-t pt-5 sm:flex-row"><Button type="reset" variant="subtle">Clear form</Button><Button type="submit" variant="enterprise"><ReceiptText/> Save billing record</Button></div>
    </form>
  </section>;
}

function FormHeading({ number, title }: { number: string; title: string }) { return <div className="mb-5 flex items-center gap-3"><span className="grid size-7 place-items-center rounded-md bg-secondary text-[10px] font-extrabold text-secondary-foreground">{number}</span><h3 className="text-sm font-extrabold">{title}</h3></div>; }
function SummaryRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) { return <div className="flex items-center justify-between gap-3"><span className="text-xs text-sidebar-foreground/60">{label}</span><strong className={strong ? 'text-xl text-sidebar-primary' : 'text-base'}>{value}</strong></div>; }

function StudentTable() {
  const [query, setQuery] = useState('');
  const shown = students.filter(row => `${row[0]} ${row[1]}`.toLowerCase().includes(query.toLowerCase()));
  return <section className="mt-6 overflow-hidden rounded-xl border bg-card enterprise-shadow"><div className="flex flex-col gap-4 border-b px-5 py-5 lg:flex-row lg:items-center lg:justify-between"><div><h2 className="font-bold">Recent billing records</h2><p className="mt-1 text-xs text-muted-foreground">Showing the latest boarder payment activity.</p></div><div className="flex flex-col gap-2 sm:flex-row"><div className="relative"><Search className="absolute left-3 top-2.5 size-4 text-muted-foreground"/><Input className="w-full pl-9 sm:w-64" placeholder="Search CMS ID or student…" value={query} onChange={e => setQuery(e.target.value)}/></div><Select defaultValue="all"><SelectTrigger className="w-full sm:w-36"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="all">All statuses</SelectItem><SelectItem value="paid">Paid</SelectItem><SelectItem value="partial">Partial</SelectItem><SelectItem value="unpaid">Unpaid</SelectItem></SelectContent></Select></div></div><div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-sm"><thead className="bg-muted/70 text-[10px] uppercase tracking-wider text-muted-foreground"><tr>{['CMS ID','Student Name','Total Bill','Paid Amount','Balance','Status','Deposit Date','Actions'].map(h => <th className="px-5 py-3 font-extrabold" key={h}>{h}</th>)}</tr></thead><tbody className="divide-y">{shown.map(row => <tr key={row[0]} className="transition-colors hover:bg-muted/40"><td className="px-5 py-4 font-mono text-xs font-bold text-primary">{row[0]}</td><td className="px-5 py-4 font-bold">{row[1]}</td>{row.slice(2,5).map((value,index) => <td key={index} className="px-5 py-4 tabular-nums">PKR {value}</td>)}<td className="px-5 py-4"><Status status={row[5]}/></td><td className="px-5 py-4 text-muted-foreground">{row[6]}</td><td className="px-5 py-4"><div className="flex gap-1"><Button variant="ghost" size="icon" title="View"><Eye/></Button><Button variant="ghost" size="icon" title="Edit"><Pencil/></Button><Button variant="ghost" size="icon" className="text-destructive" title="Delete"><Trash2/></Button></div></td></tr>)}</tbody></table></div><div className="flex items-center justify-between border-t px-5 py-4 text-xs text-muted-foreground"><span>Showing {shown.length} of 1,248 records</span><div className="flex gap-2"><Button variant="subtle" size="sm" disabled>Previous</Button><Button variant="subtle" size="sm">Next</Button></div></div></section>;
}
function Status({ status }: { status: string }) { const styles = status === 'Paid' ? 'bg-success/10 text-success' : status === 'Partial' ? 'bg-warning/15 text-warning' : 'bg-destructive/10 text-destructive'; return <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-extrabold ${styles}`}>{status}</span>; }
