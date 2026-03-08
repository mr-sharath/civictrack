import { useState, useEffect, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from "recharts";

// ─── Supabase Client ────────────────────────────────────────────────────────
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
const supabase = SUPABASE_URL ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;

// ─── Mock Data (used when Supabase not configured) ──────────────────────────
const MOCK_DEPARTMENTS = [
  { id: "d1", name: "Housing & Planning", head_officer: "Director Sarah Mitchell", description: "Permits, zoning, housing assistance" },
  { id: "d2", name: "Infrastructure & Roads", head_officer: "Director James Okafor", description: "Road maintenance, utilities, public works" },
  { id: "d3", name: "Licensing & Compliance", head_officer: "Director Ana Reyes", description: "Business licenses, permits, code enforcement" },
  { id: "d4", name: "Social Services", head_officer: "Director David Chen", description: "Welfare, community support, benefits" },
  { id: "d5", name: "Tax & Revenue", head_officer: "Director Patricia Hall", description: "Property tax, billing, collections" },
];

const MOCK_CONSTITUENTS = [
  { id: "c1", name: "Robert Harrington", email: "r.harrington@email.com", phone: "555-0101", address: "142 Oak Street", type: "individual", created_at: "2026-01-15" },
  { id: "c2", name: "Sandra Kowalski", email: "s.kowalski@email.com", phone: "555-0102", address: "89 Maple Ave", type: "individual", created_at: "2026-01-18" },
  { id: "c3", name: "Acme Construction LLC", email: "info@acmeconstruct.com", phone: "555-0200", address: "500 Industrial Blvd", type: "organization", created_at: "2026-01-20" },
  { id: "c4", name: "Thomas Nguyen", email: "t.nguyen@email.com", phone: "555-0103", address: "33 Pine Road", type: "individual", created_at: "2026-01-22" },
  { id: "c5", name: "City Diner Group", email: "ops@citydiner.com", phone: "555-0201", address: "10 Main Street", type: "organization", created_at: "2026-02-01" },
  { id: "c6", name: "Maria Gonzalez", email: "m.gonzalez@email.com", phone: "555-0104", address: "78 Birch Lane", type: "individual", created_at: "2026-02-05" },
  { id: "c7", name: "Frank Osei", email: "f.osei@email.com", phone: "555-0105", address: "201 Elm Street", type: "individual", created_at: "2026-02-10" },
];

const MOCK_CASES = [
  { id: "k1", title: "Building Permit — 142 Oak Street Extension", type: "permit_application", status: "in_progress", priority: "medium", constituent_id: "c1", department_id: "d1", created_at: "2026-01-16", updated_at: "2026-02-01" },
  { id: "k2", title: "Pothole — Maple Ave near #89", type: "infrastructure_request", status: "open", priority: "high", constituent_id: "c2", department_id: "d2", created_at: "2026-01-19", updated_at: "2026-01-19" },
  { id: "k3", title: "Commercial Construction License — Acme", type: "licensing", status: "resolved", priority: "medium", constituent_id: "c3", department_id: "d3", created_at: "2026-01-21", updated_at: "2026-02-10", resolved_at: "2026-02-10" },
  { id: "k4", title: "Property Tax Dispute — Thomas Nguyen", type: "tax_query", status: "escalated", priority: "high", constituent_id: "c4", department_id: "d5", created_at: "2026-01-23", updated_at: "2026-01-30" },
  { id: "k5", title: "Food Service License Renewal — City Diner", type: "licensing", status: "in_progress", priority: "critical", constituent_id: "c5", department_id: "d3", created_at: "2026-02-02", updated_at: "2026-02-15" },
  { id: "k6", name: "Benefit Assistance Application — M. Gonzalez", title: "Benefit Assistance Application — M. Gonzalez", type: "social_services", status: "open", priority: "high", constituent_id: "c6", department_id: "d4", created_at: "2026-02-06", updated_at: "2026-02-06" },
  { id: "k7", title: "Noise Complaint — 201 Elm Street", type: "complaint", status: "resolved", priority: "low", constituent_id: "c7", department_id: "d1", created_at: "2026-02-11", updated_at: "2026-02-20", resolved_at: "2026-02-20" },
  { id: "k8", title: "Street Light Outage — Pine Road Corridor", type: "infrastructure_request", status: "open", priority: "medium", constituent_id: "c4", department_id: "d2", created_at: "2026-02-14", updated_at: "2026-02-14" },
  { id: "k9", title: "Public Records Request — Zoning Maps", type: "public_records", status: "in_progress", priority: "low", constituent_id: "c1", department_id: "d1", created_at: "2026-02-18", updated_at: "2026-02-22" },
  { id: "k10", title: "Contractor License Application — Acme", type: "licensing", status: "open", priority: "medium", constituent_id: "c3", department_id: "d3", created_at: "2026-03-01", updated_at: "2026-03-01" },
  { id: "k11", title: "Welfare Benefits Query — Frank Osei", type: "social_services", status: "closed", priority: "medium", constituent_id: "c7", department_id: "d4", created_at: "2026-03-02", updated_at: "2026-03-05", resolved_at: "2026-03-05" },
  { id: "k12", title: "Road Resurfacing Request — Industrial Blvd", type: "infrastructure_request", status: "escalated", priority: "critical", constituent_id: "c3", department_id: "d2", created_at: "2026-03-04", updated_at: "2026-03-06" },
];

// ─── Constants ───────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  open: { label: "Open", color: "#3B82F6", bg: "bg-blue-100", text: "text-blue-700" },
  in_progress: { label: "In Progress", color: "#F59E0B", bg: "bg-amber-100", text: "text-amber-700" },
  resolved: { label: "Resolved", color: "#10B981", bg: "bg-emerald-100", text: "text-emerald-700" },
  escalated: { label: "Escalated", color: "#EF4444", bg: "bg-red-100", text: "text-red-700" },
  closed: { label: "Closed", color: "#6B7280", bg: "bg-gray-100", text: "text-gray-600" },
};

const PRIORITY_CONFIG = {
  low: { label: "Low", bg: "bg-slate-100", text: "text-slate-600" },
  medium: { label: "Medium", bg: "bg-blue-50", text: "text-blue-600" },
  high: { label: "High", bg: "bg-orange-100", text: "text-orange-700" },
  critical: { label: "Critical", bg: "bg-red-100", text: "text-red-700" },
};

const CASE_TYPES = {
  permit_application: "Permit Application",
  complaint: "Complaint",
  infrastructure_request: "Infrastructure",
  public_records: "Public Records",
  social_services: "Social Services",
  tax_query: "Tax Query",
  licensing: "Licensing",
};

// ─── Data Hook ───────────────────────────────────────────────────────────────
function useAppData() {
  const [departments, setDepartments] = useState(MOCK_DEPARTMENTS);
  const [constituents, setConstituents] = useState(MOCK_CONSTITUENTS);
  const [cases, setCases] = useState(MOCK_CASES);
  const [loading, setLoading] = useState(false);
  const isLive = !!supabase;

  useEffect(() => {
    if (!supabase) return;
    setLoading(true);
    Promise.all([
      supabase.from("departments").select("*"),
      supabase.from("constituents").select("*").order("created_at", { ascending: false }),
      supabase.from("cases").select("*").order("created_at", { ascending: false }),
    ]).then(([depts, cons, cas]) => {
      if (depts.data) setDepartments(depts.data);
      if (cons.data) setConstituents(cons.data);
      if (cas.data) setCases(cas.data);
    }).finally(() => setLoading(false));
  }, []);

  const addConstituent = async (data) => {
    const newC = { ...data, id: `c${Date.now()}`, created_at: new Date().toISOString() };
    if (supabase) {
      const { data: d } = await supabase.from("constituents").insert([data]).select().single();
      if (d) { setConstituents(p => [d, ...p]); return; }
    }
    setConstituents(p => [newC, ...p]);
  };

  const addCase = async (data) => {
    const newCase = { ...data, id: `k${Date.now()}`, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    if (supabase) {
      const { data: d } = await supabase.from("cases").insert([data]).select().single();
      if (d) { setCases(p => [d, ...p]); return; }
    }
    setCases(p => [newCase, ...p]);
  };

  const updateCase = async (id, updates) => {
    if (supabase) await supabase.from("cases").update(updates).eq("id", id);
    setCases(p => p.map(c => c.id === id ? { ...c, ...updates, updated_at: new Date().toISOString() } : c));
  };

  const deleteCase = async (id) => {
    if (supabase) await supabase.from("cases").delete().eq("id", id);
    setCases(p => p.filter(c => c.id !== id));
  };

  return { departments, constituents, cases, loading, isLive, addConstituent, addCase, updateCase, deleteCase };
}

// ─── Small Components ────────────────────────────────────────────────────────
const Badge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.open;
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>{cfg.label}</span>;
};

const PriorityBadge = ({ priority }) => {
  const cfg = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.medium;
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${cfg.bg} ${cfg.text}`}>{cfg.label}</span>;
};

const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl leading-none">&times;</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

const FormField = ({ label, children, required }) => (
  <div className="mb-4">
    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
      {label}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

const inputCls = "w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-400 focus:border-transparent transition";

// ─── Dashboard View ───────────────────────────────────────────────────────────
function Dashboard({ cases, departments, constituents }) {
  const stats = useMemo(() => {
    const total = cases.length;
    const open = cases.filter(c => c.status === "open").length;
    const inProgress = cases.filter(c => c.status === "in_progress").length;
    const resolved = cases.filter(c => c.status === "resolved" || c.status === "closed").length;
    const escalated = cases.filter(c => c.status === "escalated").length;
    const critical = cases.filter(c => c.priority === "critical").length;
    return { total, open, inProgress, resolved, escalated, critical };
  }, [cases]);

  const statusData = useMemo(() => [
    { name: "Open", value: cases.filter(c => c.status === "open").length, color: "#3B82F6" },
    { name: "In Progress", value: cases.filter(c => c.status === "in_progress").length, color: "#F59E0B" },
    { name: "Resolved", value: cases.filter(c => c.status === "resolved").length, color: "#10B981" },
    { name: "Escalated", value: cases.filter(c => c.status === "escalated").length, color: "#EF4444" },
    { name: "Closed", value: cases.filter(c => c.status === "closed").length, color: "#6B7280" },
  ].filter(d => d.value > 0), [cases]);

  const deptData = useMemo(() => departments.map(d => ({
    name: d.name.split(" ")[0],
    cases: cases.filter(c => c.department_id === d.id).length,
    open: cases.filter(c => c.department_id === d.id && c.status === "open").length,
    resolved: cases.filter(c => c.department_id === d.id && (c.status === "resolved" || c.status === "closed")).length,
  })), [cases, departments]);

  const typeData = useMemo(() => Object.entries(CASE_TYPES).map(([k, v]) => ({
    name: v,
    count: cases.filter(c => c.type === k).length,
  })).filter(d => d.count > 0).sort((a, b) => b.count - a.count), [cases]);

  const recentCases = useMemo(() =>
    [...cases].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5),
    [cases]
  );

  const KpiCard = ({ label, value, sub, accent }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col gap-1">
      <div className="text-3xl font-black" style={{ color: accent || "#1e3a5f" }}>{value}</div>
      <div className="text-sm font-bold text-slate-700">{label}</div>
      {sub && <div className="text-xs text-slate-400">{sub}</div>}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-800">Operations Dashboard</h2>
        <p className="text-slate-500 text-sm mt-1">Real-time overview of all active cases and departmental activity</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KpiCard label="Total Cases" value={stats.total} sub="All time" />
        <KpiCard label="Open" value={stats.open} accent="#3B82F6" sub="Awaiting action" />
        <KpiCard label="In Progress" value={stats.inProgress} accent="#F59E0B" sub="Being handled" />
        <KpiCard label="Resolved" value={stats.resolved} accent="#10B981" sub="Completed" />
        <KpiCard label="Escalated" value={stats.escalated} accent="#EF4444" sub="Needs attention" />
        <KpiCard label="Constituents" value={constituents.length} accent="#6366F1" sub="Registered" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Status Pie */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-700 mb-4 text-sm uppercase tracking-wide">Cases by Status</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} innerRadius={40}>
                {statusData.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-2">
            {statusData.map(d => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs text-slate-600">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                {d.name} ({d.value})
              </div>
            ))}
          </div>
        </div>

        {/* Dept Bar */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 lg:col-span-2">
          <h3 className="font-bold text-slate-700 mb-4 text-sm uppercase tracking-wide">Cases by Department</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={deptData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend iconSize={10} />
              <Bar dataKey="open" name="Open" fill="#3B82F6" radius={[3,3,0,0]} />
              <Bar dataKey="resolved" name="Resolved" fill="#10B981" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Case Type + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-700 mb-4 text-sm uppercase tracking-wide">Case Types</h3>
          <div className="space-y-2.5">
            {typeData.map(d => (
              <div key={d.name} className="flex items-center gap-3">
                <div className="text-xs text-slate-600 w-32 truncate">{d.name}</div>
                <div className="flex-1 bg-slate-100 rounded-full h-2">
                  <div className="bg-navy-600 h-2 rounded-full" style={{ width: `${(d.count / stats.total) * 100}%`, background: "#1e3a5f" }} />
                </div>
                <div className="text-xs font-bold text-slate-600 w-4 text-right">{d.count}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 lg:col-span-2">
          <h3 className="font-bold text-slate-700 mb-4 text-sm uppercase tracking-wide">Recent Activity</h3>
          <div className="space-y-3">
            {recentCases.map(c => (
              <div key={c.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                <div className="flex-1 min-w-0 pr-4">
                  <p className="text-sm font-semibold text-slate-700 truncate">{c.title}</p>
                  <p className="text-xs text-slate-400">{CASE_TYPES[c.type]} · {new Date(c.created_at).toLocaleDateString()}</p>
                </div>
                <Badge status={c.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Cases View ───────────────────────────────────────────────────────────────
function CasesView({ cases, departments, constituents, addCase, updateCase, deleteCase }) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDept, setFilterDept] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [form, setForm] = useState({ title: "", description: "", type: "complaint", status: "open", priority: "medium", constituent_id: "", department_id: "" });

  const filtered = useMemo(() => cases.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || c.status === filterStatus;
    const matchDept = filterDept === "all" || c.department_id === filterDept;
    return matchSearch && matchStatus && matchDept;
  }), [cases, search, filterStatus, filterDept]);

  const getConstituentName = (id) => constituents.find(c => c.id === id)?.name || "—";
  const getDeptName = (id) => departments.find(d => d.id === id)?.name || "—";

  const handleSubmit = () => {
    if (!form.title) return;
    addCase(form);
    setShowAdd(false);
    setForm({ title: "", description: "", type: "complaint", status: "open", priority: "medium", constituent_id: "", department_id: "" });
  };

  const handleStatusChange = (caseId, newStatus) => {
    const updates = { status: newStatus };
    if (newStatus === "resolved" || newStatus === "closed") updates.resolved_at = new Date().toISOString();
    updateCase(caseId, updates);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-800">Cases</h2>
          <p className="text-slate-500 text-sm mt-0.5">{filtered.length} of {cases.length} cases</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-700 transition">
          <span className="text-lg leading-none">+</span> New Case
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search cases..." className="border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 w-60" />
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none bg-white">
          <option value="all">All Statuses</option>
          {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <select value={filterDept} onChange={e => setFilterDept(e.target.value)} className="border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none bg-white">
          <option value="all">All Departments</option>
          {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              {["Case", "Type", "Constituent", "Department", "Priority", "Status", "Date", "Actions"].map(h => (
                <th key={h} className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map(c => (
              <tr key={c.id} className="hover:bg-slate-50/50 transition group">
                <td className="px-5 py-4 font-semibold text-slate-700 max-w-xs">
                  <div className="truncate">{c.title}</div>
                </td>
                <td className="px-5 py-4 text-slate-500">{CASE_TYPES[c.type] || c.type}</td>
                <td className="px-5 py-4 text-slate-600">{getConstituentName(c.constituent_id)}</td>
                <td className="px-5 py-4 text-slate-500 whitespace-nowrap">{getDeptName(c.department_id).split(" ")[0]}</td>
                <td className="px-5 py-4"><PriorityBadge priority={c.priority} /></td>
                <td className="px-5 py-4">
                  <select value={c.status} onChange={e => handleStatusChange(c.id, e.target.value)}
                    className="border border-slate-200 rounded-lg px-2 py-1 text-xs focus:outline-none bg-white font-medium cursor-pointer">
                    {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select>
                </td>
                <td className="px-5 py-4 text-slate-400 text-xs whitespace-nowrap">{new Date(c.created_at).toLocaleDateString()}</td>
                <td className="px-5 py-4">
                  <button onClick={() => deleteCase(c.id)} className="text-slate-300 hover:text-red-400 transition opacity-0 group-hover:opacity-100 text-lg">×</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="text-center py-12 text-slate-400">No cases found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Open New Case">
        <FormField label="Case Title" required>
          <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className={inputCls} placeholder="Brief description of the case" />
        </FormField>
        <FormField label="Description">
          <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className={inputCls} rows={3} placeholder="Full details..." />
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Case Type" required>
            <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} className={inputCls}>
              {Object.entries(CASE_TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </FormField>
          <FormField label="Priority">
            <select value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))} className={inputCls}>
              {Object.entries(PRIORITY_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </FormField>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Constituent">
            <select value={form.constituent_id} onChange={e => setForm(p => ({ ...p, constituent_id: e.target.value }))} className={inputCls}>
              <option value="">Select constituent</option>
              {constituents.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </FormField>
          <FormField label="Department">
            <select value={form.department_id} onChange={e => setForm(p => ({ ...p, department_id: e.target.value }))} className={inputCls}>
              <option value="">Assign department</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </FormField>
        </div>
        <div className="flex gap-3 pt-2">
          <button onClick={handleSubmit} className="flex-1 bg-slate-800 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-slate-700 transition">Open Case</button>
          <button onClick={() => setShowAdd(false)} className="flex-1 border border-slate-200 py-2.5 rounded-xl font-semibold text-sm text-slate-600 hover:bg-slate-50 transition">Cancel</button>
        </div>
      </Modal>
    </div>
  );
}

// ─── Constituents View ────────────────────────────────────────────────────────
function ConstituentsView({ constituents, cases, addConstituent }) {
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", type: "individual" });

  const filtered = constituents.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.email || "").toLowerCase().includes(search.toLowerCase())
  );

  const getCaseCount = (id) => cases.filter(c => c.constituent_id === id).length;
  const getOpenCases = (id) => cases.filter(c => c.constituent_id === id && (c.status === "open" || c.status === "in_progress")).length;

  const handleSubmit = () => {
    if (!form.name) return;
    addConstituent(form);
    setShowAdd(false);
    setForm({ name: "", email: "", phone: "", address: "", type: "individual" });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-800">Constituents</h2>
          <p className="text-slate-500 text-sm mt-0.5">{filtered.length} registered</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-700 transition">
          <span className="text-lg leading-none">+</span> Add Constituent
        </button>
      </div>

      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..." className="border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 w-72" />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(c => (
          <div key={c.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: c.type === "organization" ? "#6366F1" : "#1e3a5f" }}>
                  {c.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">{c.name}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.type === "organization" ? "bg-purple-100 text-purple-700" : "bg-slate-100 text-slate-600"}`}>
                    {c.type === "organization" ? "Organization" : "Individual"}
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-1.5 text-xs text-slate-500">
              {c.email && <div className="flex items-center gap-2"><span className="opacity-50">✉</span>{c.email}</div>}
              {c.phone && <div className="flex items-center gap-2"><span className="opacity-50">✆</span>{c.phone}</div>}
              {c.address && <div className="flex items-center gap-2"><span className="opacity-50">⌂</span>{c.address}</div>}
            </div>
            <div className="flex gap-3 mt-4 pt-3 border-t border-slate-50">
              <div className="text-center">
                <div className="text-lg font-black text-slate-700">{getCaseCount(c.id)}</div>
                <div className="text-xs text-slate-400">Total Cases</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-black text-blue-600">{getOpenCases(c.id)}</div>
                <div className="text-xs text-slate-400">Active</div>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-3 text-center py-12 text-slate-400">No constituents found</div>
        )}
      </div>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Register Constituent">
        <FormField label="Full Name / Organization Name" required>
          <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className={inputCls} placeholder="Name" />
        </FormField>
        <FormField label="Type">
          <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} className={inputCls}>
            <option value="individual">Individual</option>
            <option value="organization">Organization</option>
          </select>
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Email">
            <input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className={inputCls} placeholder="email@example.com" />
          </FormField>
          <FormField label="Phone">
            <input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className={inputCls} placeholder="555-0100" />
          </FormField>
        </div>
        <FormField label="Address">
          <input value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} className={inputCls} placeholder="Street address" />
        </FormField>
        <div className="flex gap-3 pt-2">
          <button onClick={handleSubmit} className="flex-1 bg-slate-800 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-slate-700 transition">Register</button>
          <button onClick={() => setShowAdd(false)} className="flex-1 border border-slate-200 py-2.5 rounded-xl font-semibold text-sm text-slate-600 hover:bg-slate-50 transition">Cancel</button>
        </div>
      </Modal>
    </div>
  );
}

// ─── Departments View ─────────────────────────────────────────────────────────
function DepartmentsView({ departments, cases }) {
  const deptStats = useMemo(() => departments.map(d => {
    const deptCases = cases.filter(c => c.department_id === d.id);
    return {
      ...d,
      total: deptCases.length,
      open: deptCases.filter(c => c.status === "open").length,
      inProgress: deptCases.filter(c => c.status === "in_progress").length,
      resolved: deptCases.filter(c => c.status === "resolved" || c.status === "closed").length,
      escalated: deptCases.filter(c => c.status === "escalated").length,
      critical: deptCases.filter(c => c.priority === "critical").length,
    };
  }), [departments, cases]);

  const colors = ["#1e3a5f", "#2563EB", "#0891B2", "#059669", "#7C3AED"];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-black text-slate-800">Departments</h2>
        <p className="text-slate-500 text-sm mt-0.5">{departments.length} operational departments</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {deptStats.map((d, i) => (
          <div key={d.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-lg font-black" style={{ background: colors[i % colors.length] }}>
                {d.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-black text-slate-800">{d.name}</h3>
                <p className="text-xs text-slate-400">{d.head_officer}</p>
                <p className="text-xs text-slate-400 mt-0.5">{d.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 pt-4 border-t border-slate-50">
              <div className="text-center">
                <div className="text-xl font-black text-slate-700">{d.total}</div>
                <div className="text-xs text-slate-400">Total</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-black text-blue-600">{d.open + d.inProgress}</div>
                <div className="text-xs text-slate-400">Active</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-black text-emerald-600">{d.resolved}</div>
                <div className="text-xs text-slate-400">Resolved</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-black text-red-500">{d.escalated}</div>
                <div className="text-xs text-slate-400">Escalated</div>
              </div>
            </div>

            {d.total > 0 && (
              <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden flex">
                <div className="bg-blue-500 h-full transition-all" style={{ width: `${(d.open / d.total) * 100}%` }} />
                <div className="bg-amber-400 h-full transition-all" style={{ width: `${(d.inProgress / d.total) * 100}%` }} />
                <div className="bg-emerald-500 h-full transition-all" style={{ width: `${(d.resolved / d.total) * 100}%` }} />
                <div className="bg-red-500 h-full transition-all" style={{ width: `${(d.escalated / d.total) * 100}%` }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────
const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "⊞" },
  { id: "cases", label: "Cases", icon: "◫" },
  { id: "constituents", label: "Constituents", icon: "◉" },
  { id: "departments", label: "Departments", icon: "⊡" },
];

function Sidebar({ active, setActive, caseCount, isLive }) {
  return (
    <aside className="w-64 shrink-0 bg-slate-900 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="px-6 py-7 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-900 font-black text-sm" style={{ background: "#D4A853" }}>C</div>
          <div>
            <div className="text-white font-black text-sm tracking-wide">CivicTrack</div>
            <div className="text-slate-400 text-xs">Public Sector CRM</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-1">
        {NAV.map(n => (
          <button key={n.id} onClick={() => setActive(n.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition text-left ${active === n.id ? "bg-white/10 text-white" : "text-slate-400 hover:text-white hover:bg-white/5"}`}>
            <span className="text-base opacity-80">{n.icon}</span>
            {n.label}
            {n.id === "cases" && caseCount > 0 && (
              <span className="ml-auto bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{caseCount}</span>
            )}
          </button>
        ))}
      </nav>

      {/* Status */}
      <div className="px-5 py-4 border-t border-slate-800">
        <div className={`flex items-center gap-2 text-xs ${isLive ? "text-emerald-400" : "text-amber-400"}`}>
          <div className={`w-2 h-2 rounded-full ${isLive ? "bg-emerald-400" : "bg-amber-400"} animate-pulse`} />
          {isLive ? "Connected to Supabase" : "Demo mode (mock data)"}
        </div>
      </div>
    </aside>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("dashboard");
  const { departments, constituents, cases, loading, isLive, addConstituent, addCase, updateCase, deleteCase } = useAppData();
  const openCases = cases.filter(c => c.status === "open").length;

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar active={view} setActive={setView} caseCount={openCases} isLive={isLive} />
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {loading && (
            <div className="flex items-center justify-center py-20 text-slate-400">
              <div className="animate-spin w-6 h-6 border-2 border-slate-300 border-t-slate-700 rounded-full mr-3" />
              Loading...
            </div>
          )}
          {!loading && (
            <>
              {view === "dashboard" && <Dashboard cases={cases} departments={departments} constituents={constituents} />}
              {view === "cases" && <CasesView cases={cases} departments={departments} constituents={constituents} addCase={addCase} updateCase={updateCase} deleteCase={deleteCase} />}
              {view === "constituents" && <ConstituentsView constituents={constituents} cases={cases} addConstituent={addConstituent} />}
              {view === "departments" && <DepartmentsView departments={departments} cases={cases} />}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
