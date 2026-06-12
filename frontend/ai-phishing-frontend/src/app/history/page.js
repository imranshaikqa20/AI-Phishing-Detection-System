"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import { isAuthenticated, getScanHistory } from "../../services/api";
import api from "../../services/api";

export default function HistoryPage() {
  const router = useRouter();

  // STATES
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dark, setDark] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [expanded, setExpanded] = useState(null);
  const [userId, setUserId] = useState(null);
  const [reporting, setReporting] = useState(null);
  const [reportMsg, setReportMsg] = useState("");

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
    const uid = localStorage.getItem("userId");
    setUserId(uid ? Number(uid) : null);
    fetchHistory();
  }, [router]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await getScanHistory();
      setHistory(response.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // REPORT THREAT
  const handleReport = async (scan) => {
    if (!userId) return;
    setReporting(scan.id);
    setReportMsg("");
    try {
      await api.post("/scan/report", {
        userId,
        threatValue: scan.rawContent,
        type: scan.inputType,
        reason: `Reported from scan history. Verdict: ${scan.verdict}. Risk score: ${scan.overallRiskScore}.`,
      });
      setReportMsg("Threat reported successfully. Thank you!");
      setTimeout(() => setReportMsg(""), 3000);
    } catch (err) {
      setReportMsg("Failed to report. Please try again.");
      setTimeout(() => setReportMsg(""), 3000);
    } finally {
      setReporting(null);
    }
  };

  // RISK HELPERS
  const getRiskLevel = (score) => {
    if (score >= 80) return "Critical";
    if (score >= 60) return "High";
    if (score >= 40) return "Medium";
    return "Low";
  };

  const getRiskColor = (level) => {
    switch (level) {
      case "Critical": return dark ? "bg-red-600/15 text-red-400" : "bg-red-100 text-red-700";
      case "High": return dark ? "bg-orange-500/15 text-orange-400" : "bg-orange-100 text-orange-700";
      case "Medium": return dark ? "bg-yellow-500/15 text-yellow-400" : "bg-yellow-100 text-yellow-700";
      default: return dark ? "bg-green-500/15 text-green-400" : "bg-green-100 text-green-700";
    }
  };

  const getRiskBarColor = (score) => {
    if (score >= 80) return "bg-red-500";
    if (score >= 60) return "bg-orange-400";
    if (score >= 40) return "bg-yellow-400";
    return "bg-green-500";
  };

  // DERIVED COUNTS
  const totalScans = history.length;
  const phishingCount = history.filter((s) => s.verdict === "PHISHING").length;
  const safeCount = history.filter((s) => s.verdict === "SAFE").length;
  const highRiskCount = history.filter((s) => s.overallRiskScore >= 70).length;

  // FILTERED + SEARCHED
  const filtered = history
    .filter((s) =>
      filter === "ALL" ? true
      : filter === "PHISHING" ? s.verdict === "PHISHING"
      : filter === "SAFE" ? s.verdict === "SAFE"
      : filter === "HIGH" ? s.overallRiskScore >= 70
      : true
    )
    .filter((s) =>
      search.trim() === ""
        ? true
        : s.rawContent?.toLowerCase().includes(search.toLowerCase()) ||
          s.inputType?.toLowerCase().includes(search.toLowerCase())
    );

  // THEME TOKENS
  const bg = dark
    ? "min-h-screen bg-gradient-to-br from-black via-slate-950 to-gray-900 text-white"
    : "min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900";

  const card = dark
    ? "bg-white/5 rounded-2xl p-6 shadow-xl"
    : "bg-white rounded-2xl p-6 shadow-md border border-gray-100";

  const subText = dark ? "text-white/40 text-sm" : "text-gray-500 text-sm";
  const statLabel = dark
    ? "text-white/40 text-xs font-semibold uppercase tracking-wide mb-3"
    : "text-gray-400 text-xs font-semibold uppercase tracking-wide mb-3";

  const searchInput = dark
    ? "w-full md:w-64 px-4 py-2 rounded-xl bg-black/30 border border-white/10 text-white placeholder-white/25 outline-none focus:border-orange-500/50 text-sm transition"
    : "w-full md:w-64 px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 outline-none focus:border-orange-400 text-sm transition";

  const filterPill = (active) =>
    active
      ? "px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-red-500 to-pink-600 text-white"
      : dark
      ? "px-3 py-1.5 rounded-lg text-xs font-bold bg-white/5 border border-white/8 text-white/40 hover:text-white hover:bg-white/10 transition"
      : "px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-gray-200 text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition";

  const row = dark
    ? "rounded-xl p-4 border border-white/5 bg-black/20 hover:bg-black/30 transition cursor-pointer"
    : "rounded-xl p-4 border border-gray-100 bg-gray-50 hover:bg-gray-100 transition cursor-pointer";

  const monoText = dark
    ? "text-white/65 text-sm font-mono truncate"
    : "text-gray-700 text-sm font-mono truncate";

  const timeText = dark ? "text-xs text-white/25" : "text-xs text-gray-400";
  const typeBadge = dark
    ? "text-xs font-semibold px-2 py-0.5 rounded text-cyan-400 bg-cyan-500/10"
    : "text-xs font-semibold px-2 py-0.5 rounded text-cyan-600 bg-cyan-50";

  const summaryBg = dark
    ? "mt-3 bg-black/30 rounded-xl p-4 border border-white/5"
    : "mt-3 bg-white rounded-xl p-4 border border-gray-100";

  const summaryText = dark
    ? "whitespace-pre-wrap text-white/55 text-xs leading-relaxed font-sans"
    : "whitespace-pre-wrap text-gray-600 text-xs leading-relaxed font-sans";

  if (loading) {
    return (
      <div className={`${bg} flex items-center justify-center`}>
        <div className={`text-sm font-medium ${dark ? "text-white/40" : "text-gray-400"}`}>
          Loading History...
        </div>
      </div>
    );
  }

  return (
    <div className={bg}>
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">

        {/* PAGE HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className={`text-3xl font-bold mb-1 ${dark ? "text-white" : "text-gray-900"}`}>
              Scan History
            </h1>
            <p className={subText}>
              All your past scans, verdicts, risk scores, and AI analysis.
            </p>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search content or type..."
            className={searchInput}
          />
        </div>

        {/* REPORT SUCCESS/FAIL MESSAGE */}
        {reportMsg && (
          <div className={`px-4 py-3 rounded-xl text-sm font-medium ${
            reportMsg.includes("success") || reportMsg.includes("Thank")
              ? dark
                ? "bg-green-500/15 border border-green-500/30 text-green-300"
                : "bg-green-50 border border-green-200 text-green-700"
              : dark
              ? "bg-red-500/15 border border-red-500/30 text-red-300"
              : "bg-red-50 border border-red-200 text-red-600"
          }`}>
            {reportMsg}
          </div>
        )}

        {/* SUMMARY PILLS */}
        <div className="flex flex-wrap gap-3">
          {[
            { label: "Total", value: totalScans, color: dark ? "text-white/70" : "text-gray-700" },
            { label: "Phishing", value: phishingCount, color: "text-red-400" },
            { label: "Safe", value: safeCount, color: "text-green-400" },
            { label: "High Risk",value: highRiskCount, color: "text-orange-400" },
          ].map((s) => (
            <div key={s.label} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm ${
              dark ? "bg-white/5 border border-white/8" : "bg-white border border-gray-100 shadow-sm"
            }`}>
              <span className={dark ? "text-white/35 text-xs" : "text-gray-400 text-xs"}>{s.label}</span>
              <span className={`font-bold ${s.color}`}>{s.value}</span>
            </div>
          ))}
        </div>

        {/* FILTER PILLS */}
        <div className="flex flex-wrap gap-2">
          {["ALL", "PHISHING", "SAFE", "HIGH"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={filterPill(filter === f)}
            >
              {f === "HIGH" ? "HIGH RISK" : f}
            </button>
          ))}
        </div>

        {/* HISTORY LIST */}
        {filtered.length === 0 ? (
          <div className={`${card} text-center py-16`}>
            <div className="flex flex-col items-center gap-3">
              <span className="text-4xl">🔍</span>
              <p className={`text-sm ${dark ? "text-white/30" : "text-gray-400"}`}>
                {history.length === 0
                  ? "No scans yet. Run your first scan to see history here."
                  : "No scans match this filter."}
              </p>
              {history.length === 0 && (
                <button
                  onClick={() => router.push("/scan")}
                  className="mt-2 px-5 py-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 text-white text-sm font-bold hover:scale-105 transition-all"
                >
                  Run AI Scan →
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((scan) => {
              const riskLevel = getRiskLevel(scan.overallRiskScore);
              const isExpanded = expanded === scan.id;
              const truncated = scan.rawContent?.length > 80
                ? scan.rawContent.slice(0, 80) + "…"
                : scan.rawContent;

              return (
                <div
                  key={scan.id}
                  className={row}
                  onClick={() => setExpanded(isExpanded ? null : scan.id)}
                >
                  {/* ROW MAIN */}
                  <div className="flex flex-col md:flex-row md:items-center gap-3">

                    {/* LEFT */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={typeBadge}>{scan.inputType}</span>
                        <span className={timeText}>
                          {scan.scannedAt
                            ? new Date(scan.scannedAt).toLocaleString()
                            : ""}
                        </span>
                      </div>
                      <p className={monoText}>{truncated}</p>
                    </div>

                    {/* RIGHT */}
                    <div className="flex items-center gap-3 flex-shrink-0">

                      {/* MINI RISK BAR */}
                      <div className={`w-16 rounded-full h-1.5 overflow-hidden ${dark ? "bg-white/8" : "bg-gray-200"}`}>
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${getRiskBarColor(scan.overallRiskScore)}`}
                          style={{ width: `${scan.overallRiskScore}%` }}
                        />
                      </div>

                      {/* RISK BADGE */}
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${getRiskColor(riskLevel)}`}>
                        {riskLevel}
                      </span>

                      {/* SCORE */}
                      <div className="text-center w-10">
                        <div className={`font-bold text-lg leading-none ${
                          scan.overallRiskScore >= 70 ? "text-red-400"
                          : scan.overallRiskScore >= 40 ? "text-yellow-400"
                          : "text-green-400"
                        }`}>
                          {scan.overallRiskScore}
                        </div>
                        <div className={`text-xs ${dark ? "text-white/25" : "text-gray-400"}`}>score</div>
                      </div>

                      {/* VERDICT */}
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        scan.verdict === "PHISHING"
                          ? dark ? "bg-red-500/15 text-red-400"    : "bg-red-100 text-red-700"
                          : dark ? "bg-green-500/15 text-green-400" : "bg-green-100 text-green-700"
                      }`}>
                        {scan.verdict}
                      </span>

                      {/* REPORT BUTTON — only for PHISHING */}
                      {scan.verdict === "PHISHING" && (
                        <button
                          disabled={reporting === scan.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReport(scan);
                          }}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition ${
                            reporting === scan.id
                              ? dark ? "bg-white/5 text-white/25 cursor-not-allowed" : "bg-gray-100 text-gray-300 cursor-not-allowed"
                              : dark ? "bg-orange-500/15 text-orange-400 hover:bg-orange-500/25" : "bg-orange-100 text-orange-600 hover:bg-orange-200"
                          }`}
                          title="Report this threat to admin"
                        >
                          {reporting === scan.id ? "..." : "Report"}
                        </button>
                      )}

                      {/* EXPAND ICON */}
                      <span className={`text-xs transition-transform duration-200 ${
                        dark ? "text-white/25" : "text-gray-400"
                      } ${isExpanded ? "rotate-180" : ""}`}>
                        ▼
                      </span>

                    </div>
                  </div>

                  {/* EXPANDED AI SUMMARY */}
                  {isExpanded && (
                    <div className={summaryBg} onClick={(e) => e.stopPropagation()}>
                      {scan.aiSummary ? (
                        <>
                          <p className={`text-xs font-bold mb-2 ${dark ? "text-white/60" : "text-gray-600"}`}>
                            AI Security Analysis
                          </p>
                          <pre className={summaryText}>{scan.aiSummary}</pre>
                        </>
                      ) : (
                        <p className={`text-xs ${dark ? "text-white/25" : "text-gray-400"}`}>
                          No AI summary available for this scan.
                        </p>
                      )}
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}