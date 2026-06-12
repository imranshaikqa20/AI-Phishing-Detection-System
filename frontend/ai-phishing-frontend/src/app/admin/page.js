"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api, { isAuthenticated, isAdmin } from "../../services/api";
import AdminNavbar from "../../components/AdminNavbar";

export default function AdminPage() {
  const router = useRouter();

  // STATES
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [lastLoginAt, setLastLoginAt] = useState("");
  const [dark, setDark] = useState(true);

  // THEME SYNC
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    setDark(saved === null ? true : saved === "dark");
    const interval = setInterval(() => {
      const t = localStorage.getItem("theme");
      setDark(t === null ? true : t === "dark");
    }, 300);
    return () => clearInterval(interval);
  }, []);

  // AUTH + LOAD
  useEffect(() => {
    if (!isAuthenticated()) { router.push("/auth/login"); return; }
    if (!isAdmin()) { router.push("/dashboard");  return; }
    setAdminName(localStorage.getItem("name") || "Admin");
    setAdminEmail(localStorage.getItem("email") || "");
    setLastLoginAt(localStorage.getItem("lastLoginAt") || "N/A");
    fetchAnalytics();
  }, [router]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/analytics");
      setAnalytics(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // THEME TOKENS
  const bg = dark
    ? "min-h-screen bg-gradient-to-br from-black via-slate-950 to-gray-900 text-white"
    : "min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900";

  const card = dark
    ? "bg-white/5 rounded-2xl p-6 shadow-xl"
    : "bg-white rounded-2xl p-6 shadow-md border border-gray-100";

  const subText   = dark ? "text-white/40 text-sm"  : "text-gray-500 text-sm";
  const statLabel = dark
    ? "text-white/40 text-xs font-semibold uppercase tracking-wide mb-3"
    : "text-gray-400 text-xs font-semibold uppercase tracking-wide mb-3";
  const infoLabel = dark
    ? "text-white/35 text-xs uppercase tracking-wide mb-1"
    : "text-gray-400 text-xs uppercase tracking-wide mb-1";

  if (loading) {
    return (
      <div className={`${bg} flex items-center justify-center`}>
        <div className={`text-sm font-medium ${dark ? "text-white/40" : "text-gray-400"}`}>
          Loading Admin Dashboard...
        </div>
      </div>
    );
  }

  const stats = [
    { label: "Total Users", value: analytics?.totalUsers || 0, color: "text-cyan-400" },
    { label: "Active Users", value: analytics?.activeUsers || 0, color: "text-green-400" },
    { label: "Admin Users", value: analytics?.adminUsers || 0, color: "text-yellow-400" },
    { label: "Normal Users", value: analytics?.normalUsers || 0, color: "text-pink-400" },
    { label: "Locked Users", value: analytics?.lockedUsers || 0, color: "text-red-400" },
  ];

  // SCAN STATS from backend analytics
  const scanStats = [
    { label: "Total Scans", value: analytics?.totalScans || 0, color: "text-cyan-400" },
    { label: "Phishing Found", value: analytics?.totalPhishing || 0, color: "text-red-400" },
    { label: "Safe Content", value: analytics?.totalSafe || 0, color: "text-green-400" },
    { label: "High Risk", value: analytics?.highRiskScans || 0, color: "text-orange-400" },
    { label: "Avg Risk Score", value: analytics?.avgRiskScore || 0, color: "text-yellow-400" },
  ];

  return (
    <div className={bg}>

      <AdminNavbar />

      <div className="max-w-6xl mx-auto px-4 pb-12 space-y-6">

        {/* PAGE HEADER */}
        <div>
          <h1 className={`text-3xl font-bold mb-1 ${dark ? "text-white" : "text-gray-900"}`}>
            Admin Dashboard
          </h1>
          <p className={subText}>
            Monitor users, analytics, phishing reports, and cybersecurity threats.
          </p>
        </div>

        {/* ADMIN PROFILE CARD */}
        <div className={card}>
          <div className="flex flex-col md:flex-row md:items-center gap-6">

            {/* ADMIN AVATAR */}
            <div className={`flex items-center justify-center w-12 h-12 rounded-2xl flex-shrink-0 text-lg font-bold ${
              dark
                ? "bg-yellow-500/15 border border-yellow-500/25 text-yellow-400"
                : "bg-yellow-50 border border-yellow-200 text-yellow-600"
            }`}>
              {adminName.charAt(0).toUpperCase()}
            </div>

            {/* INFO */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className={infoLabel}>Name</p>
                <p className={`text-sm font-semibold ${dark ? "text-cyan-400" : "text-cyan-600"}`}>
                  {adminName}
                </p>
              </div>
              <div>
                <p className={infoLabel}>Email</p>
                <p className={`text-sm font-semibold break-all ${dark ? "text-white/80" : "text-gray-700"}`}>
                  {adminEmail}
                </p>
              </div>
              <div>
                <p className={infoLabel}>Last Login</p>
                <p className={`text-xs font-medium ${dark ? "text-yellow-400/80" : "text-yellow-600"}`}>
                  {lastLoginAt}
                </p>
              </div>
            </div>

            {/* ROLE BADGE */}
            <div className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold ${
              dark
                ? "bg-yellow-500/15 border border-yellow-500/25 text-yellow-400"
                : "bg-yellow-50 border border-yellow-200 text-yellow-700"
            }`}>
              ROLE_ADMIN
            </div>

          </div>
        </div>

        {/* USER STAT CARDS */}
        <div>
          <p className={`${statLabel} mb-3`}>User Overview</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {stats.map((s) => (
              <div key={s.label} className={card}>
                <p className={statLabel}>{s.label}</p>
                <p className={`text-4xl font-bold ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SCAN STAT CARDS */}
        <div>
          <p className={`${statLabel} mb-3`}>Scan Overview</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {scanStats.map((s) => (
              <div key={s.label} className={card}>
                <p className={statLabel}>{s.label}</p>
                <p className={`text-4xl font-bold ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SECURITY MONITORING */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div className={`rounded-2xl p-6 ${
            dark ? "bg-red-500/8 border border-red-500/15" : "bg-red-50 border border-red-200"
          }`}>
            <h3 className={`font-bold text-base mb-3 ${dark ? "text-red-400" : "text-red-600"}`}>
              Threat Detection
            </h3>
            <p className={subText}>
              Detect phishing websites, malicious URLs, suspicious APIs,
              and cybersecurity attacks in real-time.
            </p>
          </div>

          <div className={`rounded-2xl p-6 ${
            dark ? "bg-purple-500/8 border border-purple-500/15" : "bg-purple-50 border border-purple-200"
          }`}>
            <h3 className={`font-bold text-base mb-3 ${dark ? "text-purple-400" : "text-purple-600"}`}>
              Malware Reports
            </h3>
            <p className={subText}>
              Monitor malware activity, suspicious files, risky domains,
              and phishing scan reports.
            </p>
          </div>

          <div className={`rounded-2xl p-6 ${
            dark ? "bg-cyan-500/8 border border-cyan-500/15" : "bg-cyan-50 border border-cyan-200"
          }`}>
            <h3 className={`font-bold text-base mb-3 ${dark ? "text-cyan-400" : "text-cyan-600"}`}>
              User Monitoring
            </h3>
            <p className={subText}>
              Track user activity, login attempts, scan history,
              and suspicious platform usage.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}