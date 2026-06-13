"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import ScanResultCard from "../../components/ScanResultCard";
import api from "../../services/api";

export default function ScanPage() {
  const router = useRouter();

  // THEME
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    setDark(saved === null ? true : saved === "dark");
    const interval = setInterval(() => {
      const t = localStorage.getItem("theme");
      setDark(t === null ? true : t === "dark");
    }, 300);
    return () => clearInterval(interval);
  }, []);

  // STATES
  const [content, setContent] = useState("");
  const [scanType, setScanType] = useState("URL");
  const [result, setResult] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(1);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  // LOAD USER ID
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      if (storedUserId) setUserId(storedUserId);
    }
  }, []);

  // RESET
  const handleReset = () => {
    setContent("");
    setResult(null);
    setMetrics(null);
    setError("");
    setLoading(false);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // FILE SELECT
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setError("");
    setResult(null);
  };

  // SCAN
  const handleScan = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("userId", userId);
        formData.append("type", scanType);
        const response = await api.post("/scan/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setResult(response.data.scanResult);
        setMetrics(response.data.subscriptionMetrics);
      } else {
        if (!content.trim()) {
          setError("Please enter content to scan");
          setLoading(false);
          return;
        }
        const response = await api.post("/scan/analyze", {
          userId,
          type: scanType,
          content,
        });
        setResult(response.data.scanResult);
        setMetrics(response.data.subscriptionMetrics);
      }
    } catch (err) {
      console.log(err);
      setError(err?.response?.data?.message || "AI Scan Failed");
    } finally {
      setLoading(false);
    }
  };

  // THEME TOKENS
  const pageBg = dark
    ? "min-h-screen bg-gradient-to-br from-black via-slate-950 to-gray-900 text-white"
    : "min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900";

  const card = dark
    ? "bg-white/5 rounded-2xl p-6 shadow-xl"
    : "bg-white rounded-2xl p-6 shadow-md border border-gray-100";

  const typeActive = "bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg";

  const typeInactive = dark
    ? "bg-white/8 text-white/50 hover:text-white hover:bg-white/12 border border-white/10"
    : "bg-gray-100 text-gray-500 hover:text-gray-900 hover:bg-gray-200 border border-gray-200";

  const textareaClass = dark
    ? "w-full p-4 rounded-xl bg-black/40 border border-white/10 text-white placeholder-white/25 resize-none outline-none focus:border-red-500/50 text-sm leading-relaxed transition"
    : "w-full p-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 resize-none outline-none focus:border-red-400 text-sm leading-relaxed transition";

  const resetBtn = dark
    ? "text-sm px-4 py-2 rounded-xl transition text-red-400/70 hover:text-red-400 hover:bg-red-500/10"
    : "text-sm px-4 py-2 rounded-xl transition text-red-500 hover:bg-red-50";

  return (
    <div className={pageBg}>

      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-5">

        {/* PAGE HEADER BAR */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className={`text-sm font-semibold ${dark ? "text-white/80" : "text-gray-700"}`}>
              AI Phishing Scanner
            </span>
          </div>

          <button onClick={handleReset} className={resetBtn}>
            Reset
          </button>
        </div>

        {/* SCAN CARD */}
        <div className={card}>

          <div className="text-center mb-6">
            <h1 className={`text-2xl font-bold mb-1.5 ${dark ? "text-white" : "text-gray-900"}`}>
              Deep Scan
            </h1>
            <p className={`text-sm ${dark ? "text-white/40" : "text-gray-500"}`}>
              Analyze URLs, emails, and messages with Gemini AI
            </p>
          </div>

          {/* TYPE TOGGLES */}
          <div className="flex gap-2 mb-4">
            {["URL", "EMAIL", "TEXT"].map((t) => (
              <button
                key={t}
                onClick={() => setScanType(t)}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold transition ${
                  scanType === t ? typeActive : typeInactive
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* TEXTAREA */}
          <textarea
            rows={6}
            placeholder={
              scanType === "URL"
                ? "Enter suspicious URL (e.g. http://secure-verify-bank.com/login)"
                : scanType === "EMAIL"
                ? "Paste full email content including headers..."
                : "Paste any suspicious text, message, or content..."
            }
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={textareaClass}
          />

          {/* FILE BADGE */}
          {selectedFile && (
            <div className={`mt-3 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm ${
              dark
                ? "bg-green-500/10 border border-green-500/20 text-green-300"
                : "bg-green-50 border border-green-200 text-green-700"
            }`}>
              <span>📎</span>
              <span className="flex-1 truncate">{selectedFile.name}</span>
              <button
                onClick={() => {
                  setSelectedFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className={dark ? "text-white/40 hover:text-white" : "text-gray-400 hover:text-gray-700"}
              >
                ✕
              </button>
            </div>
          )}

          {/* BUTTONS */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleScan}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? "⟳ Scanning..." : "Run AI Scan"}
            </button>

            <label className={`flex-1 cursor-pointer py-2.5 rounded-xl text-center font-semibold text-sm transition ${
              dark
                ? "bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10"
                : "bg-gray-100 border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-200"
            }`}>
              Upload File
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          </div>

          {/* ERROR */}
          {error && (
            <div className={`mt-4 p-4 rounded-xl text-sm ${
              dark
                ? "bg-red-500/15 border border-red-500/30 text-red-300"
                : "bg-red-50 border border-red-200 text-red-600"
            }`}>
              {error}
            </div>
          )}
        </div>

        {/* RESULT */}
        {result && (
          <>
            <ScanResultCard
              result={result}
              metrics={metrics}
              dark={dark}
            />

            {/* POST-SCAN ACTIONS */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleReset}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition ${
                  dark
                    ? "bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10"
                    : "bg-gray-100 border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                }`}
              >
                Scan Another
              </button>
              <button
                onClick={() => router.push("/history")}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2 ${
                  dark
                    ? "bg-orange-500/15 border border-orange-500/25 text-orange-400 hover:bg-orange-500/25"
                    : "bg-orange-50 border border-orange-200 text-orange-600 hover:bg-orange-100"
                }`}
              >
                View in History →
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}