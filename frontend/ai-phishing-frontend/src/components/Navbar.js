"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clearUserSession, isAuthenticated, isAdmin } from "../services/api";

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

// NAV LINK
function NavLink({ href, children, dark, accent }) {
  const base = "text-sm font-medium transition-colors duration-200 px-1 py-0.5";
  const color = dark
    ? accent
      ? `text-${accent}-400 hover:text-${accent}-300`
      : "text-white/60 hover:text-white"
    : accent
    ? `text-${accent}-600 hover:text-${accent}-700`
    : "text-gray-600 hover:text-gray-900";
  return (
    <Link href={href}>
      <button className={`${base} ${color}`}>{children}</button>
    </Link>
  );
}

// MAIN NAVBAR
export default function Navbar() {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dark, setDark] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const applyTheme = (isDark) => {
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    document.documentElement.classList.toggle("dark-mode",  isDark);
    document.documentElement.classList.toggle("light-mode", !isDark);
  };

  const loadSession = () => {
    const auth = isAuthenticated();
    setIsLoggedIn(auth);
    if (auth) {
      setRole(localStorage.getItem("role")  || "");
      setName(localStorage.getItem("name")  || "User");
      setEmail(localStorage.getItem("email") || "");
    } else {
      setRole(""); setName(""); setEmail("");
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const isDark = saved === null ? true : saved === "dark";
    setDark(isDark);
    applyTheme(isDark);
    loadSession();
    setMounted(true);

    window.addEventListener("storage", loadSession);
    const interval = setInterval(() => {
      const t = localStorage.getItem("theme");
      const next = t === null ? true : t === "dark";
      setDark((prev) => (prev !== next ? next : prev));
    }, 300);
    return () => {
      window.removeEventListener("storage", loadSession);
      clearInterval(interval);
    };
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem("theme", next ? "dark" : "light");
    applyTheme(next);
  };

  const handleLogout = () => {
    clearUserSession();
    setIsLoggedIn(false); setRole(""); setName(""); setEmail("");
    router.push("/");
  };

  // THEME TOKENS
  const navBg = dark
    ? "bg-[#080c10]/90 backdrop-blur-xl border-b border-white/[0.06]"
    : "bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm";

  const logoGrad = "bg-gradient-to-r from-red-400 via-pink-400 to-red-500 bg-clip-text text-transparent";

  const userPill = dark
    ? "flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/[0.05] border border-white/[0.08]"
    : "flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-gray-100 border border-gray-200";

  const toggleBtn = dark
    ? "w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.07] border border-white/[0.12] text-white/60 hover:text-white hover:bg-white/[0.12] transition-all"
    : "w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition-all";

  // SKELETON
  if (!mounted) {
    return (
      <nav className={`w-full px-6 py-4 ${navBg}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className={`text-base font-bold tracking-tight ${logoGrad}`}>
              AI Phishing Detector
            </span>
          </div>
          <div className="h-8 w-48 rounded-xl bg-white/5 animate-pulse" />
        </div>
      </nav>
    );
  }

  return (
    <nav className={`w-full sticky top-0 z-50 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-6 py-3.5">
        <div className="flex items-center justify-between gap-4">

          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
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
          </Link>

          {/* DESKTOP NAV */}
          {/* Order: Home → Dashboard → Scan → History */}
          <div className="hidden lg:flex items-center gap-1">

            <NavLink href="/" dark={dark}>
              Home
            </NavLink>

            {isLoggedIn && role === "ROLE_USER" && (
              <NavLink href="/dashboard" dark={dark} accent="cyan">
                Dashboard
              </NavLink>
            )}

            {isLoggedIn && isAdmin() && (
              <NavLink href="/admin" dark={dark} accent="yellow">
                Admin Panel
              </NavLink>
            )}

            {isLoggedIn && (
              <NavLink href="/scan" dark={dark} accent="green">
                Scan
              </NavLink>
            )}

            {isLoggedIn && (
              <NavLink href="/history" dark={dark} accent="orange">
                History
              </NavLink>
            )}

          </div>

          {/* RIGHT SECTION */}
          <div className="flex items-center gap-2">

            {/* USER PILL */}
            {isLoggedIn && (
              <div className={userPill}>
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                  dark ? "bg-red-500/20 text-red-400" : "bg-red-100 text-red-600"
                }`}>
                  {name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden md:block">
                  <div className={`text-xs font-semibold leading-none mb-0.5 ${
                    dark ? "text-white/80" : "text-gray-800"
                  }`}>
                    {name}
                  </div>
                  <div className={`text-[10px] leading-none max-w-[120px] truncate ${
                    dark ? "text-white/35" : "text-gray-400"
                  }`}>
                    {email}
                  </div>
                </div>
              </div>
            )}

            {/* AUTH BUTTONS */}
            {!isLoggedIn && (
              <>
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
              </>
            )}

            {/* LOGOUT */}
            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className={`text-sm px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  dark
                    ? "text-red-400/70 hover:text-red-400 hover:bg-red-500/10"
                    : "text-red-500 hover:bg-red-50"
                }`}
              >
                Logout
              </button>
            )}

            {/* THEME TOGGLE */}
            <button
              onClick={toggleTheme}
              title={dark ? "Light Mode" : "Dark Mode"}
              className={toggleBtn}
            >
              {dark ? <SunIcon /> : <MoonIcon />}
            </button>

            {/* MOBILE HAMBURGER */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className={`lg:hidden ${toggleBtn}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4"
              >
                {mobileOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />}
              </svg>
            </button>

          </div>
        </div>

        {/* MOBILE MENU */}
        {/* Order: Home → Dashboard → Scan → History */}
        {mobileOpen && (
          <div className={`lg:hidden mt-3 pt-3 border-t ${
            dark ? "border-white/[0.06]" : "border-gray-200"
          } flex flex-col gap-1`}>

            <Link href="/" onClick={() => setMobileOpen(false)}>
              <button className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium ${
                dark
                  ? "text-white/60 hover:text-white hover:bg-white/[0.06]"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}>
                Home
              </button>
            </Link>

            {isLoggedIn && role === "ROLE_USER" && (
              <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                <button className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium ${
                  dark ? "text-cyan-400 hover:bg-white/[0.06]" : "text-cyan-600 hover:bg-gray-100"
                }`}>
                  Dashboard
                </button>
              </Link>
            )}

            {isLoggedIn && isAdmin() && (
              <Link href="/admin" onClick={() => setMobileOpen(false)}>
                <button className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium ${
                  dark ? "text-yellow-400 hover:bg-white/[0.06]" : "text-yellow-600 hover:bg-gray-100"
                }`}>
                  Admin Panel
                </button>
              </Link>
            )}

            {isLoggedIn && (
              <Link href="/scan" onClick={() => setMobileOpen(false)}>
                <button className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium ${
                  dark ? "text-green-400 hover:bg-white/[0.06]" : "text-green-600 hover:bg-gray-100"
                }`}>
                  Scan
                </button>
              </Link>
            )}

            {isLoggedIn && (
              <Link href="/history" onClick={() => setMobileOpen(false)}>
                <button className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium ${
                  dark ? "text-orange-400 hover:bg-white/[0.06]" : "text-orange-600 hover:bg-gray-100"
                }`}>
                  History
                </button>
              </Link>
            )}

          </div>
        )}

      </div>
    </nav>
  );
}