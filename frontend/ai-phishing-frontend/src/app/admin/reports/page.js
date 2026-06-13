"use client";

import { useEffect, useState } from "react";
import api from "../../../services/api";
import AdminNavbar from "../../../components/AdminNavbar";

export default function ReportsPage() {

  // STATES
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dark, setDark] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [message, setMessage] = useState("");
  const [messageOk, setMessageOk] = useState(true);

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

  // LOAD DATA
  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/reports");
      setReports(response.data?.reports || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (msg, ok = true) => {
    setMessage(msg);
    setMessageOk(ok);
    setTimeout(() => setMessage(""), 3000);
  };

  // APPROVE - move to blocklist
  const handleApprove = async (id) => {
    setActionLoading(id);
    try {
      const response = await api.post(`/admin/reports/${id}/approve`);
      showMessage(response.data.message || "Threat blocked successfully", true);
      setReports((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      showMessage(err?.response?.data?.message || "Failed to approve report", false);
    } finally {
      setActionLoading(null);
    }
  };

  // REJECT - delete report
  const handleReject = async (id) => {
    if (!confirm("Reject and delete this report?")) return;
    setActionLoading(id);
    try {
      const response = await api.delete(`/admin/reports/${id}`);
      showMessage(response.data.message || "Report rejected", true);
      setReports((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      showMessage(err?.response?.data?.message || "Failed to reject report", false);
    } finally {
      setActionLoading(null);
    }
  };

  // DERIVED COUNTS
  const urlReports = reports.filter((r) => r.type === "URL").length;
  const emailReports = reports.filter((r) => r.type === "TEXT" || r.type === "EMAIL").length;

  // THEME TOKENS
  const bg = dark
    ? "min-h-screen bg-gradient-to-br from-black via-slate-950 to-gray-900 text-white"
    : "min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900";

  const card = dark
    ? "bg-white/5 rounded-2xl shadow-xl overflow-hidden"
    : "bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden";

  const subText = dark ? "text-white/40 text-sm" : "text-gray-500 text-sm";
  const theadRow = dark ? "border-b border-white/8" : "border-b border-gray-100";
  const thClass = dark
    ? "px-4 py-3 text-xs font-semibold uppercase tracking-wide text-white/35 text-left"
    : "px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400 text-left";
  const tbodyRow = dark
    ? "border-b border-white/5 hover:bg-white/3 transition"
    : "border-b border-gray-50 hover:bg-gray-50 transition";
  const tdClass  = dark
    ? "px-4 py-3.5 text-sm text-white/70"
    : "px-4 py-3.5 text-sm text-gray-600";

  const summaryPill = dark
    ? "flex items-center gap-2 px-4 py-2 rounded-xl text-sm bg-white/5 border border-white/8"
    : "flex items-center gap-2 px-4 py-2 rounded-xl text-sm bg-white border border-gray-100 shadow-sm";

  const summaryLabelText = dark ? "text-white/35 text-xs" : "text-gray-400 text-xs";

  if (loading) {
    return (
      <div className={`${bg} flex items-center justify-center`}>
        <div className={`text-sm font-medium ${dark ? "text-white/40" : "text-gray-400"}`}>
          Loading Reports...
        </div>
      </div>
    );
  }

  return (
    <div className={bg}>

      <AdminNavbar />

      <div className="max-w-6xl mx-auto px-4 pt-6 pb-12 space-y-6">

        {/* PAGE HEADER */}
        <div>
          <h1 className={`text-3xl font-bold mb-1 ${dark ? "text-white" : "text-gray-900"}`}>
            User Reports
          </h1>
          <p className={subText}>
            Review threats reported by users. Approve to add to the blocklist, or reject if invalid.
          </p>
        </div>

        {/* MESSAGE */}
        {message && (
          <div className={`px-4 py-3 rounded-xl text-sm font-medium ${
            messageOk
              ? dark
                ? "bg-green-500/15 border border-green-500/30 text-green-300"
                : "bg-green-50 border border-green-200 text-green-700"
              : dark
              ? "bg-red-500/15 border border-red-500/30 text-red-300"
              : "bg-red-50 border border-red-200 text-red-600"
          }`}>
            {message}
          </div>
        )}

        {/* SUMMARY PILLS */}
        <div className="flex flex-wrap gap-3">
          {[
            { label: "Pending Reports", value: reports.length, color: dark ? "text-white/70" : "text-gray-700" },
            { label: "URL Threats", value: urlReports, color: "text-cyan-400" },
            { label: "Email/Text", value: emailReports, color: "text-pink-400" },
          ].map((s) => (
            <div key={s.label} className={summaryPill}>
              <span className={summaryLabelText}>{s.label}</span>
              <span className={`font-bold ${s.color}`}>{s.value}</span>
            </div>
          ))}
        </div>

        {/* TABLE */}
        <div className={card}>
          <div className="overflow-x-auto">
            <table className="w-full text-left">

              <thead>
                <tr className={theadRow}>
                  <th className={thClass}>ID</th>
                  <th className={thClass}>Type</th>
                  <th className={thClass}>Threat Value</th>
                  <th className={thClass}>Reason</th>
                  <th className={thClass}>Reported By (User ID)</th>
                  <th className={thClass}>Reported At</th>
                  <th className={thClass}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {reports.length === 0 ? (
                  <tr>
                    <td colSpan="7" className={`${tdClass} text-center py-12`}>
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-2xl">🛡️</span>
                        <span className={dark ? "text-white/25" : "text-gray-400"}>
                          No pending reports. All clear!
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  reports.map((report) => {
                    const truncated =
                      report.threatValue?.length > 50
                        ? report.threatValue.slice(0, 50) + "…"
                        : report.threatValue;

                    const truncatedReason =
                      report.reason?.length > 60
                        ? report.reason.slice(0, 60) + "…"
                        : report.reason;

                    return (
                      <tr key={report.id} className={tbodyRow}>

                        {/* ID */}
                        <td className={`${tdClass} font-mono text-xs ${dark ? "text-white/30" : "text-gray-400"}`}>
                          {report.id}
                        </td>

                        {/* TYPE */}
                        <td className={tdClass}>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            dark ? "bg-cyan-500/15 text-cyan-400" : "bg-cyan-50 text-cyan-700"
                          }`}>
                            {report.type}
                          </span>
                        </td>

                        {/* THREAT VALUE */}
                        <td className={`${tdClass} max-w-xs`}>
                          <p className={`font-mono text-xs truncate ${dark ? "text-white/60" : "text-gray-600"}`}>
                            {truncated}
                          </p>
                        </td>

                        {/* REASON */}
                        <td className={`${tdClass} max-w-xs`}>
                          <p className={`text-xs truncate ${dark ? "text-white/45" : "text-gray-500"}`}>
                            {truncatedReason || "—"}
                          </p>
                        </td>

                        {/* REPORTED BY */}
                        <td className={`${tdClass} font-mono text-xs ${dark ? "text-white/30" : "text-gray-400"}`}>
                          #{report.userId}
                        </td>

                        {/* REPORTED AT */}
                        <td className={`${tdClass} text-xs ${dark ? "text-white/30" : "text-gray-400"}`}>
                          {report.reportedAt
                            ? new Date(report.reportedAt).toLocaleString()
                            : "—"}
                        </td>

                        {/* ACTIONS */}
                        <td className={tdClass}>
                          <div className="flex gap-2">
                            <button
                              disabled={actionLoading === report.id}
                              onClick={() => handleApprove(report.id)}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500/15 text-red-400 hover:bg-red-500/25 transition disabled:opacity-50"
                            >
                              {actionLoading === report.id ? "..." : "Approve & Block"}
                            </button>
                            <button
                              disabled={actionLoading === report.id}
                              onClick={() => handleReject(report.id)}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>

            </table>
          </div>
        </div>

      </div>
    </div>
  );
}