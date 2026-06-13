"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import {
  isAuthenticated,
  getDashboardMetrics,
  getScanHistory,
} from "../../services/api";
import api from "../../services/api";

// PAYMENT BANNER
function PaymentBanner({ dark, userId, onUpgradeConfirmed }) {
  const searchParams = useSearchParams();
  const [banner, setBanner] = useState(null);
  const calledRef = useRef(false);

  useEffect(() => {
    const payment = searchParams.get("payment");
    const paramUserId = searchParams.get("userId");

    if (payment === "success") {
      setBanner({ type: "success", msg: "Payment successful! Activating your Pro Plan..." });
      const uid = paramUserId || userId;
      if (uid && !calledRef.current) {
        calledRef.current = true;
        api.put(`/users/${uid}/upgrade`)
          .then(() => {
            setBanner({ type: "success", msg: "You are now on the Pro Plan! Enjoy unlimited scans." });
            if (onUpgradeConfirmed) onUpgradeConfirmed();
          })
          .catch(() => {
            setBanner({ type: "success", msg: "Payment successful! You are now on the Pro Plan." });
            if (onUpgradeConfirmed) onUpgradeConfirmed();
          });
      }
    } else if (payment === "cancel") {
      setBanner({ type: "cancel", msg: "Payment was cancelled. You remain on the Free Plan." });
    }
  }, [searchParams, userId]);

  if (!banner) return null;

  return (
    <div className={`rounded-xl px-5 py-3 text-sm font-medium ${
      banner.type === "success"
        ? dark
          ? "bg-green-500/15 border border-green-500/30 text-green-300"
          : "bg-green-50 border border-green-300 text-green-700"
        : dark
        ? "bg-yellow-500/15 border border-yellow-500/30 text-yellow-300"
        : "bg-yellow-50 border border-yellow-300 text-yellow-700"
    }`}>
      {banner.msg}
    </div>
  );
}

// MAIN DASHBOARD
export default function DashboardPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [userId, setUserId] = useState(null);
  const [isPro, setIsPro] = useState(false);
  const [dark, setDark] = useState(true);
  const [history, setHistory] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [metrics, setMetrics] = useState(null);

  // THEME SYNC
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    setDark(saved === null ? true : saved === "dark");
    const onStorage = () => {
      const t = localStorage.getItem("theme");
      setDark(t === null ? true : t === "dark");
    };
    window.addEventListener("storage", onStorage);
    const interval = setInterval(() => {
      const t = localStorage.getItem("theme");
      setDark(t === null ? true : t === "dark");
    }, 300);
    return () => { window.removeEventListener("storage", onStorage); clearInterval(interval); };
  }, []);

  // AUTH
  useEffect(() => {
    if (!isAuthenticated()) { router.push("/auth/login"); return; }
    const role = localStorage.getItem("role");
    if (role === "ROLE_ADMIN") { router.push("/admin"); return; }
    setName(localStorage.getItem("name") || "User");
    const uid = localStorage.getItem("userId");
    setUserId(uid ? Number(uid) : 1);
    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      setLoadingData(true);
      const [metricsRes, histRes] = await Promise.all([
        getDashboardMetrics().catch(() => null),
        getScanHistory().catch(() => ({ data: [] })),
      ]);
      setHistory(histRes?.data || []);
      if (metricsRes?.data?.isPro) setIsPro(true);
      if (metricsRes?.data) setMetrics(metricsRes.data);
    } catch (_) {
    } finally {
      setLoadingData(false);
    }
  };

  // STRIPE UPGRADE
  const handleUpgrade = async () => {
    if (!userId) return;
    setUpgrading(true);
    try {
      const res = await api.put(`/users/${userId}/upgrade-session`);
      const { checkoutUrl } = res.data;
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        alert("Could not start payment session. Please try again.");
      }
    } catch (err) {
      alert(err?.response?.data?.error || "Payment session failed. Please try again.");
    } finally {
      setUpgrading(false);
    }
  };

  const handleUpgradeConfirmed = () => setIsPro(true);

  // DERIVED STATS
  const urlScans = history.filter((h) => h.inputType === "URL").length;
  const emailScans = history.filter((h) => h.inputType === "TEXT" || h.inputType === "EMAIL").length;
  const phishingUrls = history.filter((h) => h.inputType === "URL" && h.verdict === "PHISHING").length;
  const phishingEmails = history.filter((h) => (h.inputType === "TEXT" || h.inputType === "EMAIL") && h.verdict === "PHISHING").length;
  const remainingScans = isPro ? "∞" : metrics ? metrics.remainingScans : Math.max(0, 100 - (history.length || 0));

  const suspiciousAddresses = history
    .filter((h) => h.verdict === "PHISHING" && h.inputType === "URL")
    .slice(0, 3)
    .map((h) => {
      try { return new URL(h.rawContent.trim()).hostname; }
      catch { return h.rawContent.slice(0, 40); }
    });

  // THEME TOKENS
  const bg = dark
    ? "min-h-screen bg-gradient-to-br from-black via-slate-950 to-gray-900 text-white"
    : "min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900";

  const card = dark
    ? "bg-white/5 rounded-2xl p-6 shadow-xl"
    : "bg-white rounded-2xl p-6 shadow-md border border-gray-100";

  const statLabel = dark
    ? "text-white/50 text-xs font-semibold uppercase tracking-wide mb-3"
    : "text-gray-400 text-xs font-semibold uppercase tracking-wide mb-3";
  const statValue = dark ? "text-white/55" : "text-gray-600";
  const tierBar   = dark ? "bg-white/10"   : "bg-gray-200";
  const tierText  = dark ? "text-white/60" : "text-gray-600";

  // RECENT 3 SCANS for quick preview
  const recentScans = history.slice(0, 3);

  return (
    <div className={bg}>
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">

        {/* PAYMENT BANNER */}
        <Suspense fallback={null}>
          <PaymentBanner
            dark={dark}
            userId={userId}
            onUpgradeConfirmed={handleUpgradeConfirmed}
          />
        </Suspense>

        {/* WELCOME + QUICK ACTIONS */}
        <div className={`${card} flex flex-col md:flex-row md:items-center md:justify-between gap-4`}>
          <div>
            <h1 className={`text-2xl font-bold mb-1 ${dark ? "text-white" : "text-gray-900"}`}>
              Welcome back, {name} !!
            </h1>
            <p className={`text-sm ${dark ? "text-white/40" : "text-gray-500"}`}>
              Your cybersecurity dashboard. Run scans, track threats, monitor your activity.
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <button
              onClick={() => router.push("/scan")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white text-sm font-bold transition-all hover:scale-105"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Run AI Scan
            </button>
            <button
              onClick={() => router.push("/history")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition ${
                dark
                  ? "bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10"
                  : "bg-white border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              View History
            </button>
          </div>
        </div>

        {/* STATS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div className={card}>
            <h3 className={statLabel}>📈 Total Scans</h3>
            {loadingData
              ? <div className={`text-sm ${dark ? "text-white/30" : "text-gray-400"}`}>Loading...</div>
              : (
                <div className="space-y-1.5 text-sm">
                  <div className="flex items-center justify-between">
                    <span className={statValue}>Email / Text</span>
                    <span className="text-cyan-500 font-bold">{emailScans}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={statValue}>URLs</span>
                    <span className="text-cyan-500 font-bold">{urlScans}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={statValue}>Total</span>
                    <span className={`font-bold ${dark ? "text-white/70" : "text-gray-700"}`}>{history.length}</span>
                  </div>
                </div>
              )}
          </div>

          <div className={card}>
            <h3 className={statLabel}>🛑 Phishing Detected</h3>
            {loadingData
              ? <div className={`text-sm ${dark ? "text-white/30" : "text-gray-400"}`}>Loading...</div>
              : (
                <div className="space-y-1.5 text-sm">
                  <div className="flex items-center justify-between">
                    <span className={statValue}>Phishing Emails</span>
                    <span className="text-red-500 font-bold">{phishingEmails}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={statValue}>Phishing URLs</span>
                    <span className="text-red-500 font-bold">{phishingUrls}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={statValue}>Total Threats</span>
                    <span className="text-red-500 font-bold">{phishingEmails + phishingUrls}</span>
                  </div>
                </div>
              )}
          </div>

          <div className={card}>
            <h3 className={statLabel}>🌐 Suspicious Addresses</h3>
            {loadingData
              ? <div className={`text-sm ${dark ? "text-white/30" : "text-gray-400"}`}>Loading...</div>
              : suspiciousAddresses.length === 0
              ? <p className={`text-sm ${dark ? "text-white/30" : "text-gray-400"}`}>None flagged yet.</p>
              : (
                <ul className="space-y-1.5">
                  {suspiciousAddresses.map((addr, i) => (
                    <li key={i} className="text-orange-400 text-xs font-mono truncate">• {addr}</li>
                  ))}
                </ul>
              )}
          </div>

        </div>

        {/* FREE TIER STATUS + UPGRADE */}
        <div className={`${card} px-5 py-4 flex flex-col md:flex-row md:items-center gap-4`}>
          <div className={`flex items-center gap-2 text-sm flex-1 ${tierText}`}>
            {isPro ? (
              <span>Plan: <span className="text-yellow-400 font-semibold">⭐ Pro - Unlimited Scans</span></span>
            ) : (
              <span>
                Free Tier:{" "}
                <span className="text-cyan-500 font-semibold">{remainingScans}</span>
                {" "}/ 100 daily scans remaining
              </span>
            )}
          </div>
          {!isPro && (
            <div className={`w-full md:w-40 rounded-full h-1.5 ${tierBar}`}>
              <div
                className="bg-cyan-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, ((100 - Number(remainingScans)) / 100) * 100)}%` }}
              />
            </div>
          )}
          {!isPro && (
            <button
              onClick={handleUpgrade}
              disabled={upgrading}
              className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-yellow-500/15 border border-yellow-500/25 hover:bg-yellow-500/30 text-yellow-300 text-sm font-medium transition disabled:opacity-60"
            >
              {upgrading ? "⟳ Redirecting..." : "⭐ Upgrade to Pro"}
            </button>
          )}
          {isPro && (
            <div className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm font-semibold">
              ⭐ Pro Plan Active
            </div>
          )}
        </div>

        {/* RECENT SCANS PREVIEW */}
        {recentScans.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className={`text-sm font-semibold uppercase tracking-wide ${dark ? "text-white/40" : "text-gray-400"}`}>
                Recent Scans
              </h2>
              <button
                onClick={() => router.push("/history")}
                className={`text-xs font-medium transition ${dark ? "text-cyan-400 hover:text-cyan-300" : "text-cyan-600 hover:text-cyan-700"}`}
              >
                View all →
              </button>
            </div>
            <div className={`${dark ? "bg-zinc-900/80 backdrop-blur-md rounded-2xl p-4" : "bg-white rounded-2xl p-4 shadow-sm border border-gray-100"} space-y-3`}>
              {recentScans.map((scan) => {
                const truncated = scan.rawContent?.length > 60
                  ? scan.rawContent.slice(0, 60) + "…"
                  : scan.rawContent;
                return (
                  <div key={scan.id} className={`flex items-center gap-3 p-3 rounded-xl ${dark ? "bg-black/30" : "bg-gray-50"}`}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded ${dark ? "text-cyan-400 bg-cyan-500/10" : "text-cyan-600 bg-cyan-50"}`}>
                          {scan.inputType}
                        </span>
                        <span className={`text-xs ${dark ? "text-white/25" : "text-gray-400"}`}>
                          {scan.scannedAt ? new Date(scan.scannedAt).toLocaleString() : ""}
                        </span>
                      </div>
                      <p className={`text-xs font-mono truncate ${dark ? "text-white/60" : "text-gray-600"}`}>{truncated}</p>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg flex-shrink-0 ${
                      scan.verdict === "PHISHING"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-green-500/20 text-green-500"
                    }`}>
                      {scan.verdict}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}