"use client";

import { useEffect, useState } from "react";
import api from "../../../services/api";
import AdminNavbar from "../../../components/AdminNavbar";

export default function BlocklistPage() {

  // STATES
  const [blocklist, setBlocklist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dark, setDark] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [message, setMessage] = useState("");
  const [messageOk, setMessageOk] = useState(true);
  const [search, setSearch] = useState("");

  // ADD FORM
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ domainOrIp: "", type: "URL", reason: "" });
  const [adding, setAdding] = useState(false);

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
    fetchBlocklist();
  }, []);

  const fetchBlocklist = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/blocklist");
      setBlocklist(response.data?.blocklist || []);
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

  // ADD TO BLOCKLIST
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!formData.domainOrIp.trim()) {
      showMessage("Domain or IP is required", false);
      return;
    }
    setAdding(true);
    try {
      await api.post("/admin/blocklist/add", formData);
      showMessage("Added to blocklist successfully", true);
      setFormData({ domainOrIp: "", type: "URL", reason: "" });
      setShowForm(false);
      fetchBlocklist();
    } catch (err) {
      showMessage(err?.response?.data?.message || "Failed to add to blocklist", false);
    } finally {
      setAdding(false);
    }
  };

  // REMOVE FROM BLOCKLIST
  const handleRemove = async (id) => {
    if (!confirm("Remove this entry from the blocklist?")) return;
    setActionLoading(id);
    try {
      const response = await api.delete(`/admin/blocklist/${id}`);
      showMessage(response.data.message || "Removed from blocklist", true);
      setBlocklist((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      showMessage(err?.response?.data?.message || "Failed to remove entry", false);
    } finally {
      setActionLoading(null);
    }
  };

  // DERIVED COUNTS
  const urlCount = blocklist.filter((b) => b.type === "URL").length;
  const ipCount = blocklist.filter((b) => b.type === "IP").length;
  const emailCount = blocklist.filter((b) => b.type === "EMAIL" || b.type === "TEXT").length;

  // FILTERED
  const filtered = blocklist.filter((b) =>
    search.trim() === ""
      ? true
      : b.domainOrIp?.toLowerCase().includes(search.toLowerCase()) ||
        b.type?.toLowerCase().includes(search.toLowerCase())
  );

  // THEME TOKENS
  const bg = dark
    ? "min-h-screen bg-gradient-to-br from-black via-slate-950 to-gray-900 text-white"
    : "min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900";

  const card = dark
    ? "bg-white/5 rounded-2xl shadow-xl overflow-hidden"
    : "bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden";

  const formCard = dark
    ? "bg-white/5 rounded-2xl p-6 shadow-xl"
    : "bg-white rounded-2xl p-6 shadow-md border border-gray-100";

  const subText = dark ? "text-white/40 text-sm" : "text-gray-500 text-sm";
  const theadRow = dark ? "border-b border-white/8" : "border-b border-gray-100";
  const thClass = dark
    ? "px-4 py-3 text-xs font-semibold uppercase tracking-wide text-white/35 text-left"
    : "px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400 text-left";
  const tbodyRow = dark
    ? "border-b border-white/5 hover:bg-white/3 transition"
    : "border-b border-gray-50 hover:bg-gray-50 transition";
  const tdClass = dark
    ? "px-4 py-3.5 text-sm text-white/70"
    : "px-4 py-3.5 text-sm text-gray-600";

  const summaryPill = dark
    ? "flex items-center gap-2 px-4 py-2 rounded-xl text-sm bg-white/5 border border-white/8"
    : "flex items-center gap-2 px-4 py-2 rounded-xl text-sm bg-white border border-gray-100 shadow-sm";

  const summaryLabelText = dark ? "text-white/35 text-xs" : "text-gray-400 text-xs";

  const searchInput = dark
    ? "w-full md:w-64 px-4 py-2 rounded-xl bg-black/30 border border-white/10 text-white placeholder-white/25 outline-none focus:border-red-500/50 text-sm transition"
    : "w-full md:w-64 px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 outline-none focus:border-red-400 text-sm transition";

  const inputClass = dark
    ? "w-full px-4 py-2.5 rounded-xl bg-black/30 border border-white/10 text-white placeholder-white/25 outline-none focus:border-red-500/50 text-sm transition"
    : "w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 outline-none focus:border-red-400 text-sm transition";

  const labelClass = dark
    ? "block text-xs font-semibold uppercase tracking-wide text-white/40 mb-2"
    : "block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2";

  const typePill = (active) =>
    active
      ? "flex-1 py-2 rounded-xl text-xs font-bold transition bg-gradient-to-r from-red-500 to-pink-600 text-white"
      : dark
      ? "flex-1 py-2 rounded-xl text-xs font-bold transition bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10"
      : "flex-1 py-2 rounded-xl text-xs font-bold transition bg-gray-100 border border-gray-200 text-gray-400 hover:text-gray-900 hover:bg-gray-200";

  if (loading) {
    return (
      <div className={`${bg} flex items-center justify-center`}>
        <div className={`text-sm font-medium ${dark ? "text-white/40" : "text-gray-400"}`}>
          Loading Blocklist...
        </div>
      </div>
    );
  }

  return (
    <div className={bg}>

      <AdminNavbar />

      <div className="max-w-6xl mx-auto px-4 pt-6 pb-12 space-y-6">

        {/* PAGE HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className={`text-3xl font-bold mb-1 ${dark ? "text-white" : "text-gray-900"}`}>
              Blocklist
            </h1>
            <p className={subText}>
              Domains, IPs, and addresses blocked across the platform.
            </p>
          </div>

          <div className="flex gap-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search blocklist..."
              className={searchInput}
            />
            <button
              onClick={() => setShowForm((v) => !v)}
              className="flex-shrink-0 px-5 py-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white text-sm font-bold transition-all hover:scale-105"
            >
              {showForm ? "Cancel" : "+ Add Entry"}
            </button>
          </div>
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

        {/* ADD FORM */}
        {showForm && (
          <div className={formCard}>
            <form onSubmit={handleAdd} className="space-y-4">

              <div>
                <label className={labelClass}>Domain / IP / Address</label>
                <input
                  type="text"
                  value={formData.domainOrIp}
                  onChange={(e) => setFormData({ ...formData, domainOrIp: e.target.value })}
                  placeholder="e.g. malicious-site.com or 192.168.1.1"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className={labelClass}>Type</label>
                <div className="flex gap-2">
                  {["URL", "IP", "EMAIL"].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setFormData({ ...formData, type: t })}
                      className={typePill(formData.type === t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={labelClass}>Reason (optional)</label>
                <input
                  type="text"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="e.g. Confirmed phishing domain"
                  className={inputClass}
                />
              </div>

              <button
                type="submit"
                disabled={adding}
                className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white py-3 rounded-xl font-bold text-sm transition-all hover:scale-105 disabled:opacity-60"
              >
                {adding ? "Adding..." : "Add to Blocklist"}
              </button>

            </form>
          </div>
        )}

        {/* SUMMARY PILLS */}
        <div className="flex flex-wrap gap-3">
          {[
            { label: "Total Blocked", value: blocklist.length, color: dark ? "text-white/70" : "text-gray-700" },
            { label: "URLs", value: urlCount, color: "text-cyan-400" },
            { label: "IPs", value: ipCount, color: "text-purple-400" },
            { label: "Emails/Text", value: emailCount, color: "text-pink-400" },
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
                  <th className={thClass}>Domain / IP / Address</th>
                  <th className={thClass}>Reason</th>
                  <th className={thClass}>Blocked At</th>
                  <th className={thClass}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="6" className={`${tdClass} text-center py-12`}>
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-2xl">🚫</span>
                        <span className={dark ? "text-white/25" : "text-gray-400"}>
                          {blocklist.length === 0
                            ? "No blocked entries yet."
                            : "No entries match your search."}
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((entry) => (
                    <tr key={entry.id} className={tbodyRow}>

                      {/* ID */}
                      <td className={`${tdClass} font-mono text-xs ${dark ? "text-white/30" : "text-gray-400"}`}>
                        {entry.id}
                      </td>

                      {/* TYPE */}
                      <td className={tdClass}>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          dark ? "bg-cyan-500/15 text-cyan-400" : "bg-cyan-50 text-cyan-700"
                        }`}>
                          {entry.type}
                        </span>
                      </td>

                      {/* DOMAIN / IP */}
                      <td className={`${tdClass} max-w-xs`}>
                        <p className={`font-mono text-xs truncate ${dark ? "text-white/70" : "text-gray-700"}`}>
                          {entry.domainOrIp}
                        </p>
                      </td>

                      {/* REASON */}
                      <td className={`${tdClass} max-w-xs`}>
                        <p className={`text-xs truncate ${dark ? "text-white/45" : "text-gray-500"}`}>
                          {entry.reason || "—"}
                        </p>
                      </td>

                      {/* BLOCKED AT */}
                      <td className={`${tdClass} text-xs ${dark ? "text-white/30" : "text-gray-400"}`}>
                        {entry.blockedAt
                          ? new Date(entry.blockedAt).toLocaleString()
                          : "—"}
                      </td>

                      {/* ACTIONS */}
                      <td className={tdClass}>
                        <button
                          disabled={actionLoading === entry.id}
                          onClick={() => handleRemove(entry.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500/15 text-red-400 hover:bg-red-500/25 transition disabled:opacity-50"
                        >
                          {actionLoading === entry.id ? "..." : "Unblock"}
                        </button>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>

            </table>
          </div>
        </div>

      </div>
    </div>
  );
}