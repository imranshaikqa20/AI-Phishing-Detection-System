"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// ICONS
const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
    <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.166 17.834a.75.75 0 00-1.06 1.06l1.59 1.591a.75.75 0 001.061-1.06l-1.59-1.591zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.166 6.166a.75.75 0 001.06 1.06l1.591-1.59a.75.75 0 00-1.06-1.061L6.166 6.166z" />
  </svg>
);

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
    <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
  </svg>
);

const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.704-3.08z" clipRule="evenodd" />
  </svg>
);

export default function Home() {
  const [dark, setDark] = useState(true);

  // LOAD SAVED THEME
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const isDark = saved === null ? true : saved === "dark";
    setDark(isDark);
    applyTheme(isDark);
  }, []);

  const applyTheme = (isDark) => {
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    document.documentElement.classList.toggle("dark-mode",  isDark);
    document.documentElement.classList.toggle("light-mode", !isDark);
  };

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem("theme", next ? "dark" : "light");
    applyTheme(next);
  };

  // THEME TOKENS
  const pageBg = dark ? "bg-[#0d1117] text-white" : "bg-gray-50 text-gray-900";
  const navBg = dark
    ? "bg-[#080c10]/90 backdrop-blur-xl border-b border-white/[0.06]"
    : "bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm";
  const logoGrad = "bg-gradient-to-r from-red-400 via-pink-400 to-red-500 bg-clip-text text-transparent";
  const navLink = dark ? "text-white/60 hover:text-white transition-colors duration-200 text-sm" : "text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm";
  const toggleBtn = dark
    ? "w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.07] border border-white/[0.12] text-white/60 hover:text-white hover:bg-white/[0.12] transition-all"
    : "w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition-all";
  const badgeBg = dark ? "bg-white/5 border border-white/10" : "bg-gray-100 border border-gray-200";
  const badgeText = dark ? "text-white/60" : "text-gray-500";
  const heroPara = dark ? "text-white/55" : "text-gray-600";
  const ghostBtn = dark ? "text-white/60 hover:text-white" : "text-gray-500 hover:text-gray-900";
  const featureCard = dark
    ? "bg-white/4 border border-white/8 rounded-xl p-7 hover:bg-white/6 hover:border-white/15 transition-all duration-300"
    : "bg-white border border-gray-200 rounded-xl p-7 hover:border-gray-300 hover:shadow-md transition-all duration-300";
  const featureTitle = dark ? "text-white font-semibold text-base mb-3" : "text-gray-900 font-semibold text-base mb-3";
  const featureDesc = dark ? "text-white/50 text-sm leading-relaxed" : "text-gray-500 text-sm leading-relaxed";
  const sectionBorder = dark ? "border-white/8" : "border-gray-200";
  const stepNum = dark ? "text-4xl font-serif italic text-white/10 font-bold" : "text-4xl font-serif italic text-gray-200 font-bold";
  const stepTitle = dark ? "text-white font-semibold text-base" : "text-gray-900 font-semibold text-base";
  const stepDesc = dark ? "text-white/45 text-sm leading-relaxed" : "text-gray-500 text-sm leading-relaxed";
  const statLabel = dark ? "text-xs text-white/40 tracking-wide uppercase" : "text-xs text-gray-400 tracking-wide uppercase";
  const threatCard = dark
    ? "flex items-center gap-2 bg-white/3 border border-white/7 rounded-lg px-4 py-3"
    : "flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-3 hover:border-gray-300 transition";
  const threatText = dark ? "text-sm text-white/60" : "text-sm text-gray-600";
  const ctaHeading = dark ? "text-3xl md:text-4xl font-serif italic text-white/90 mb-3" : "text-3xl md:text-4xl font-serif italic text-gray-900 mb-3";
  const ctaSubtext = dark ? "text-white/45 text-sm" : "text-gray-500 text-sm";
  const secondaryBtn = dark
    ? "bg-white/8 border border-white/15 hover:bg-white/12 text-white/80"
    : "bg-white border border-gray-200 hover:bg-gray-50 text-gray-700";
  const footerText = dark ? "text-sm text-white/40" : "text-sm text-gray-400";
  const footerSub = dark ? "text-xs text-white/25" : "text-xs text-gray-300";
  const sectionLabel = dark
    ? "text-xs text-white/40 tracking-widest uppercase font-medium mb-3"
    : "text-xs text-gray-400 tracking-widest uppercase font-medium mb-3";
  const sectionHeading = dark
    ? "text-3xl md:text-4xl font-serif italic text-white/90 mb-16 max-w-lg"
    : "text-3xl md:text-4xl font-serif italic text-gray-900 mb-16 max-w-lg";
  const heroHeading1 = dark
    ? "text-5xl md:text-7xl font-serif italic font-normal leading-tight mb-3 text-white/95 max-w-3xl"
    : "text-5xl md:text-7xl font-serif italic font-normal leading-tight mb-3 text-gray-900 max-w-3xl";

  return (
    <div className={`min-h-screen font-sans overflow-x-hidden ${pageBg}`}>

      {/* NAVBAR — matches Navbar.js exactly */}
      <nav className={`w-full sticky top-0 z-50 ${navBg}`}>
        <div className="max-w-7xl mx-auto px-6 py-3.5">
          <div className="flex items-center justify-between gap-4">

            {/* LOGO */}
            <div className="flex items-center gap-2.5 flex-shrink-0">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                dark ? "bg-red-500/20 text-red-400" : "bg-red-100 text-red-500"
              }`}>
                <ShieldIcon />
              </div>
              <div>
                <div className={`text-sm font-bold tracking-tight ${logoGrad}`}>
                  AI Phishing Detector
                </div>
                <div className={`text-[10px] leading-none ${dark ? "text-white/30" : "text-gray-400"}`}>
                  Cybersecurity Platform
                </div>
              </div>
            </div>

            {/* NAV LINKS */}
            <div className="hidden md:flex items-center gap-6">
              {["Home", "Features", "How It Works", "About"].map((item) => (

                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                  className={navLink}
                >
                  {item}
                </a>
              ))}
            </div>

            {/* RIGHT CONTROLS */}
            <div className="flex items-center gap-2">
              <Link href="/auth/login">
                <button className={`text-sm px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  dark
                    ? "text-white/60 hover:text-white hover:bg-white/[0.07]"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}>
                  Login
                </button>
              </Link>
              <Link href="/auth/register">
                <button className="text-sm px-4 py-2 rounded-xl font-semibold bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white transition-all duration-200 hover:scale-105">
                  Get Started
                </button>
              </Link>
              <button
                onClick={toggleTheme}
                title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                className={toggleBtn}
              >
                {dark ? <SunIcon /> : <MoonIcon />}
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* HERO */}
      <section id="home" className="px-8 md:px-16 pt-20 pb-24 max-w-7xl mx-auto">
        <div className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-10 ${badgeBg}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
          <span className={`text-xs tracking-widest uppercase font-medium ${badgeText}`}>
            Gemini AI · Real-Time Detection
          </span>
        </div>
        <h1 className={heroHeading1}>Stop Phishing Attacks,</h1>
        <h1 className="text-5xl md:text-7xl font-serif italic font-normal leading-tight mb-8 text-red-500 max-w-3xl">
          Before They Stop You.
        </h1>
        <p className={`text-lg leading-relaxed max-w-xl mb-12 ${heroPara}`}>
          Paste any suspicious URL, email content, or text message. Our AI engine
          powered by Gemini instantly analyzes threat patterns, assigns a risk
          score, and tells you exactly what to do - in seconds.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/auth/register">
            <button className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold px-7 py-3.5 rounded-md transition-all duration-200 hover:scale-105 text-sm">
              Scan for Free →
            </button>
          </Link>
          <Link href="/auth/login">
            <button className={`text-sm transition-colors duration-200 px-2 ${ghostBtn}`}>
              Already have an account? Login
            </button>
          </Link>
        </div>
      </section>

      {/* FEATURE CARDS */}
      <section id="features" className="px-8 md:px-16 pb-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: "🧠", iconBg: "bg-red-500/15", title: "AI-Powered Detection", desc: "Gemini AI analyzes content for phishing, scam tactics, credential theft, fake domains, and social engineering - generating a detailed threat report." },
            { icon: "📊", iconBg: "bg-cyan-500/15", title: "Risk Score Dashboard", desc: "Every scan produces a 0-100 risk score with a verdict of SAFE or PHISHING. Track your scan history and monitor suspicious addresses flagged over time." },
            { icon: "⚡", iconBg: "bg-yellow-500/15", title: "Instant Verdict", desc: "Results arrive in under 3 seconds. Get clear recommendations - avoid, proceed with caution, or safe - so you can act immediately without guesswork." },
            { icon: "📢", iconBg: "bg-orange-500/15", title: "Community Reporting",  desc: "Flag confirmed phishing threats directly from your scan history. Reported threats are reviewed and added to a shared blocklist to protect everyone." },
          ].map((card) => (
            <div key={card.title} className={featureCard}>
              <div className={`w-11 h-11 ${card.iconBg} rounded-lg flex items-center justify-center text-xl mb-5`}>
                {card.icon}
              </div>
              <h3 className={featureTitle}>{card.title}</h3>
              <p className={featureDesc}>{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className={`px-8 md:px-16 py-20 border-t ${sectionBorder} max-w-7xl mx-auto`}>
        <p className={sectionLabel}>How It Works</p>
        <h2 className={sectionHeading}>Three steps to stay protected.</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { step: "01", title: "Paste the Content", desc: "Drop in a suspicious URL, copy-paste a phishing email, or upload a file. The scanner accepts any text-based input." },
            { step: "02", title: "AI Analyses Instantly", desc: "Gemini AI scans for known threat patterns - fake domains, urgency language, credential harvesting tactics, and malicious links." },
            { step: "03", title: "Get a Clear Verdict", desc: "You receive a risk score, a SAFE or PHISHING verdict, detailed threat breakdown, and actionable security recommendations." },
          ].map((item) => (
            <div key={item.step} className="flex flex-col gap-4">
              <span className={stepNum}>{item.step}</span>
              <h3 className={stepTitle}>{item.title}</h3>
              <p className={stepDesc}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className={`border-t border-b ${sectionBorder} py-12 px-8 md:px-16`}>
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: "98%", label: "Detection Accuracy" },
            { value: "<3s", label: "Average Scan Time" },
            { value: "100", label: "Free Scans / Day" },
            { value: "24/7", label: "Always Available" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-serif italic text-red-400 mb-1">{stat.value}</p>
              <p className={statLabel}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* THREAT COVERAGE */}
      <section id="about" className="px-8 md:px-16 py-20 max-w-7xl mx-auto">
        <p className={sectionLabel}>Threat Coverage</p>
        <h2 className={`text-3xl md:text-4xl font-serif italic mb-12 max-w-lg ${dark ? "text-white/90" : "text-gray-900"}`}>
          Everything our AI watches for.
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            "Phishing URLs", "Scam Emails", "Credential Theft", "Fake Login Pages",
            "Banking Fraud", "Crypto Scams", "Social Engineering", "Malware Links",
            "Brand Impersonation", "Urgency Manipulation", "Suspicious Domains", "Unsafe HTTP Sites",
          ].map((threat) => (
            <div key={threat} className={threatCard}>
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
              <span className={threatText}>{threat}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className={`px-8 md:px-16 py-20 border-t ${sectionBorder}`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className={ctaHeading}>Start scanning for free.</h2>
            <p className={ctaSubtext}>100 free scans daily. No credit card required.</p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <Link href="/auth/register">
              <button className="bg-red-500 hover:bg-red-600 text-white font-semibold px-7 py-3.5 rounded-md text-sm transition-all duration-200 hover:scale-105">
                Create Account →
              </button>
            </Link>
            <Link href="/auth/login">
              <button className={`font-medium px-7 py-3.5 rounded-md text-sm transition-all duration-200 ${secondaryBtn}`}>
                Login
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={`border-t ${sectionBorder} px-8 md:px-16 py-8`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className={`w-6 h-6 rounded-md flex items-center justify-center ${
              dark ? "bg-red-500/20 text-red-400" : "bg-red-100 text-red-500"
            }`}>
              <ShieldIcon />
            </div>
            <span className={footerText}>AI Phishing Detector</span>
          </div>
          <p className={footerSub}>Cybersecurity Protection Platform · Powered by Gemini AI</p>
        </div>
      </footer>

    </div>
  );
}