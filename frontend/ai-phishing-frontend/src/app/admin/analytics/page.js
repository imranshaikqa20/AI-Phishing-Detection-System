"use client";

import { useEffect, useState } from "react";
import { getDashboardMetrics, getScanHistory } from "../../../services/api";
import AdminNavbar from "../../../components/AdminNavbar";
import ScanHistoryTable from "../../../components/ScanHistoryTable";

export default function AnalyticsPage() {

  // STATES
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
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

  // LOAD DATA
  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const historyResponse = await getScanHistory();
      setHistory(historyResponse.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // DERIVED ANALYTICS
  const totalScans = history.length;
  const phishingCount = history.filter((i) => i.verdict === "PHISHING").length;
  const safeCount = history.filter((i) => i.verdict === "SAFE").length;
  const highRiskScans = history.filter((i) => i.overallRiskScore >= 70).length;
  const averageRisk = totalScans > 0
    ? Math.round(history.reduce((acc, i) => acc + i.overallRiskScore, 0) / totalScans)
    : 0;
  const urlScans = history.filter((i) => i.inputType === "URL").length;
  const textScans = history.filter((i) => i.inputType === "TEXT" || i.inputType === "EMAIL").length;
  const phishingRate = totalScans > 0 ? Math.round((phishingCount / totalScans) * 100) : 0;

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

  const barBg = dark ? "bg-white/8 rounded-full h-1.5 overflow-hidden mt-3" : "bg-gray-200 rounded-full h-1.5 overflow-hidden mt-3";

  const sectionTitle = dark
    ? "text-base font-bold text-white/80 mb-4"
    : "text-base font-bold text-gray-800 mb-4";

  if (loading) {
    return (
      <div className={`${bg} flex items-center justify-center`}>
        <div className={`text-sm font-medium ${dark ? "text-white/40" : "text-gray-400"}`}>
          Loading Analytics...
        </div>
      </div>
    );
  }

  return (
    <div className={bg}>

      <AdminNavbar />

      <div className="max-w-6xl mx-auto px-4 pb-12 space-y-6">

        {/* PAGE HEADER */}
        <div>
          <h1 className={`text-3xl font-bold mb-1 ${dark ? "text-white" : "text-gray-900"}`}>
            AI Analytics
          </h1>
          <p className={subText}>
            Real-time phishing analytics, AI threat intelligence, and cybersecurity insights.
          </p>
        </div>

        {/* TOP STAT ROW */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Scans", value: totalScans, color: "text-cyan-400" },
            { label: "Phishing Detected",value: phishingCount, color: "text-red-400" },
            { label: "Safe Content", value: safeCount, color: "text-green-400" },
            { label: "Avg Risk Score", value: averageRisk, color: "text-yellow-400" },
          ].map((s) => (
            <div key={s.label} className={card}>
              <p className={statLabel}>{s.label}</p>
              <p className={`text-4xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* SECOND ROW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* PHISHING RATE */}
          <div className={card}>
            <p className={statLabel}>Phishing Rate</p>
            <p className={`text-4xl font-bold text-red-400 mb-1`}>{phishingRate}%</p>
            <div className={barBg}>
              <div
                className="bg-red-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${phishingRate}%` }}
              />
            </div>
            <p className={`text-xs mt-2 ${dark ? "text-white/25" : "text-gray-400"}`}>
              of total scans flagged as phishing
            </p>
          </div>

          {/* HIGH RISK */}
          <div className={`${card} ${dark ? "border border-red-500/15" : "border border-red-100"}`}>
            <p className={statLabel}>High Risk Threats</p>
            <p className="text-4xl font-bold text-red-400 mb-1">{highRiskScans}</p>
            <div className={barBg}>
              <div
                className="bg-red-500 h-full rounded-full transition-all duration-700"
                style={{ width: totalScans > 0 ? `${Math.round((highRiskScans / totalScans) * 100)}%` : "0%" }}
              />
            </div>
            <p className={`text-xs mt-2 ${dark ? "text-white/25" : "text-gray-400"}`}>
              scans with risk score ≥ 70
            </p>
          </div>

          {/* AI ENGINE */}
          <div className={`${card} ${dark ? "border border-purple-500/15" : "border border-purple-100"}`}>
            <p className={statLabel}>AI Engine</p>
            <p className={`text-2xl font-bold mb-1 ${dark ? "text-purple-400" : "text-purple-600"}`}>
              Gemini AI
            </p>
            <div className="flex items-center gap-2 mt-3">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className={`text-xs ${dark ? "text-white/40" : "text-gray-500"}`}>
                Active · {totalScans} analyses completed
              </span>
            </div>
          </div>

        </div>

        {/* SCAN BREAKDOWN */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* BY TYPE */}
          <div className={card}>
            <p className={sectionTitle}>Scans by Type</p>
            <div className="space-y-4">
              {[
                { label: "URL Scans", value: urlScans, color: "bg-cyan-500", pct: totalScans > 0 ? Math.round((urlScans / totalScans) * 100) : 0 },
                { label: "Email / Text Scans", value: textScans, color: "bg-pink-500", pct: totalScans > 0 ? Math.round((textScans / totalScans) * 100) : 0 },
              ].map((row) => (
                <div key={row.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-sm ${dark ? "text-white/60" : "text-gray-600"}`}>{row.label}</span>
                    <span className={`text-sm font-bold ${dark ? "text-white/80" : "text-gray-800"}`}>
                      {row.value} <span className={`text-xs font-normal ${dark ? "text-white/30" : "text-gray-400"}`}>({row.pct}%)</span>
                    </span>
                  </div>
                  <div className={`${dark ? "bg-white/8" : "bg-gray-200"} rounded-full h-1.5 overflow-hidden`}>
                    <div
                      className={`${row.color} h-full rounded-full transition-all duration-700`}
                      style={{ width: `${row.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* BY VERDICT */}
          <div className={card}>
            <p className={sectionTitle}>Scans by Verdict</p>
            <div className="space-y-4">
              {[
                { label: "Safe", value: safeCount, color: "bg-green-500", pct: totalScans > 0 ? Math.round((safeCount / totalScans) * 100) : 0 },
                { label: "Phishing", value: phishingCount, color: "bg-red-500", pct: totalScans > 0 ? Math.round((phishingCount / totalScans) * 100) : 0 },
              ].map((row) => (
                <div key={row.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-sm ${dark ? "text-white/60" : "text-gray-600"}`}>{row.label}</span>
                    <span className={`text-sm font-bold ${dark ? "text-white/80" : "text-gray-800"}`}>
                      {row.value} <span className={`text-xs font-normal ${dark ? "text-white/30" : "text-gray-400"}`}>({row.pct}%)</span>
                    </span>
                  </div>
                  <div className={`${dark ? "bg-white/8" : "bg-gray-200"} rounded-full h-1.5 overflow-hidden`}>
                    <div
                      className={`${row.color} h-full rounded-full transition-all duration-700`}
                      style={{ width: `${row.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RECENT THREAT INTELLIGENCE */}
        <div>
          <p className={sectionTitle}>Recent Threat Intelligence</p>
          <ScanHistoryTable
            history={history}
            dark={dark}
            limit={8}
          />
        </div>

      </div>
    </div>
  );
}