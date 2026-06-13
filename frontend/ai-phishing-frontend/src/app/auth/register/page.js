"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api, { isAuthenticated } from "../../../services/api";

export default function RegisterPage() {
  const router = useRouter();

  // STATES
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("ROLE_USER");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [dark, setDark] = useState(true);
  const [showPass, setShowPass] = useState(false);

  // THEME SYNC
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    setDark(saved === null ? true : saved === "dark");
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  // REDIRECT IF ALREADY LOGGED IN
  useEffect(() => {
    if (isAuthenticated()) {
      const userRole = localStorage.getItem("role");
      router.push(userRole === "ROLE_ADMIN" ? "/admin" : "/dashboard");
    }
  }, [router]);

  // REGISTER
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await api.post("/auth/register", { name, email, password, role });
      setSuccess(true);
      setMessage(response.data.message || "Registration Successful");
      localStorage.setItem("registeredEmail", email);
      setTimeout(() => router.push("/auth/login"), 1500);
    } catch (error) {
      setSuccess(false);
      setMessage(error.response?.data?.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  // PASSWORD STRENGTH
  const getStrength = (p) => {
    if (!p) return null;
    const has = {
      upper: /[A-Z]/.test(p),
      lower: /[a-z]/.test(p),
      number: /\d/.test(p),
      special: /[@#$%^&+=!]/.test(p),
      length: p.length >= 6,
    };
    const score = Object.values(has).filter(Boolean).length;
    if (score <= 2) return { label: "Weak", color: "bg-red-500", text: dark ? "text-red-400" : "text-red-600"    };
    if (score <= 3) return { label: "Fair", color: "bg-orange-400", text: dark ? "text-orange-400" : "text-orange-600" };
    if (score <= 4) return { label: "Good", color: "bg-yellow-400", text: dark ? "text-yellow-400" : "text-yellow-600" };
    return { label: "Strong", color: "bg-green-500", text: dark ? "text-green-400" : "text-green-600"  };
  };

  const strength = getStrength(password);

  // THEME TOKENS
  const pageBg = dark
    ? "min-h-screen bg-gradient-to-br from-black via-slate-950 to-gray-900 text-white"
    : "min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900";

  const card = dark
    ? "w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl"
    : "w-full max-w-md bg-white border border-gray-200 rounded-3xl p-8 shadow-xl";

  const inputClass = dark
    ? "w-full px-4 py-3.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-white/25 outline-none focus:border-red-500/60 transition text-sm"
    : "w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 outline-none focus:border-red-400 transition text-sm";

  const labelClass = dark
    ? "block text-xs font-semibold uppercase tracking-wide text-white/40 mb-2"
    : "block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2";

  const dividerLine = dark ? "flex-1 h-px bg-white/10"   : "flex-1 h-px bg-gray-200";
  const dividerText = dark ? "text-white/30 text-xs px-4" : "text-gray-400 text-xs px-4";

  const toggleBg = dark
    ? "bg-white/10 border border-white/15 text-white/60 hover:text-white"
    : "bg-gray-100 border border-gray-200 text-gray-500 hover:text-gray-900";

  const footerText = dark ? "text-white/25 text-xs" : "text-gray-400 text-xs";

  const showPassBtn = dark
    ? "text-white/30 hover:text-white/60 transition text-xs"
    : "text-gray-400 hover:text-gray-600 transition text-xs";

  const rolePill = (active) =>
    active
      ? "flex-1 py-2.5 rounded-xl text-xs font-bold transition bg-gradient-to-r from-red-500 to-pink-600 text-white"
      : dark
      ? "flex-1 py-2.5 rounded-xl text-xs font-bold transition bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10"
      : "flex-1 py-2.5 rounded-xl text-xs font-bold transition bg-gray-100 border border-gray-200 text-gray-400 hover:text-gray-900 hover:bg-gray-200";

  return (
    <div className={`${pageBg} flex flex-col`}>

      {/* TOP NAV BAR */}
      <div className={`flex items-center justify-between px-6 py-4 border-b ${dark ? "border-white/8" : "border-gray-200"}`}>

        {/* LOGO */}
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className={`text-sm font-semibold tracking-wide ${dark ? "text-white/90" : "text-gray-900"}`}>
              AI Phishing Detector
            </span>
          </div>
        </Link>

        {/* THEME TOGGLE */}
        <button
          onClick={toggleTheme}
          title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300 hover:scale-110 ${toggleBg}`}
        >
          {dark ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
              <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.166 17.834a.75.75 0 00-1.06 1.06l1.59 1.591a.75.75 0 001.061-1.06l-1.59-1.591zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.166 6.166a.75.75 0 001.06 1.06l1.591-1.59a.75.75 0 00-1.06-1.061L6.166 6.166z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
              <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>

      {/* CENTERED FORM */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className={card}>

          {/* HEADER */}
          <div className="text-center mb-8">
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-5 ${
              dark ? "bg-green-500/10 border border-green-500/20 text-green-400" : "bg-green-50 border border-green-200 text-green-600"
            }`}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Create Account
            </div>
            <h1 className={`text-3xl font-bold mb-2 ${dark ? "text-white" : "text-gray-900"}`}>
              Join the platform
            </h1>
            <p className={`text-sm ${dark ? "text-white/40" : "text-gray-500"}`}>
              Start scanning for phishing threats for free
            </p>
          </div>

          {/* MESSAGE */}
          {message && (
            <div className={`mb-5 px-4 py-3 rounded-xl text-sm ${
              success
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

          {/* FORM */}
          <form onSubmit={handleRegister} className="space-y-5">

            {/* NAME */}
            <div>
              <label className={labelClass}>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                required
                className={inputClass}
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className={labelClass}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className={inputClass}
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className={labelClass}>Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 chars, uppercase, number, symbol"
                  required
                  className={`${inputClass} pr-16`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 ${showPassBtn}`}
                >
                  {showPass ? "Hide" : "Show"}
                </button>
              </div>

              {/* PASSWORD STRENGTH */}
              {strength && (
                <div className="mt-2 flex items-center gap-2">
                  <div className={`flex-1 h-1 rounded-full ${dark ? "bg-white/10" : "bg-gray-200"}`}>
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                      style={{
                        width: strength.label === "Weak" ? "25%" : strength.label === "Fair" ? "50%" : strength.label === "Good" ? "75%" : "100%"
                      }}
                    />
                  </div>
                  <span className={`text-xs font-semibold ${strength.text}`}>{strength.label}</span>
                </div>
              )}
            </div>

            {/* ROLE TOGGLE */}
            <div>
              <label className={labelClass}>Account Type</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setRole("ROLE_USER")}
                  className={rolePill(role === "ROLE_USER")}
                >
                  User
                </button>
                <button
                  type="button"
                  onClick={() => setRole("ROLE_ADMIN")}
                  className={rolePill(role === "ROLE_ADMIN")}
                >
                  Admin
                </button>
              </div>
            </div>

            {/* REGISTER BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white py-3.5 rounded-xl font-bold text-sm transition-all hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 mt-2"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

          </form>

          {/* DIVIDER */}
          <div className="flex items-center my-6">
            <div className={dividerLine} />
            <span className={dividerText}>OR</span>
            <div className={dividerLine} />
          </div>

          {/* LOGIN LINK */}
          <Link href="/auth/login">
            <button className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all hover:scale-105 border ${
              dark
                ? "bg-white/5 border-white/10 text-white/70 hover:text-white hover:bg-white/10"
                : "bg-gray-50 border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}>
              Already have an account? Sign In
            </button>
          </Link>

          {/* FOOTER */}
          <p className={`text-center mt-6 ${footerText}`}>
            AI Powered Phishing Detection · Secured
          </p>

        </div>
      </div>
    </div>
  );
}