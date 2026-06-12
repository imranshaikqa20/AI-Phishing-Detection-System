"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
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

export default function AdminNavbar() {
  const router = useRouter();
  const pathname = usePathname();

  // STATES
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dark, setDark] = useState(true);

  // MOUNT + THEME + SESSION
  useEffect(() => {
    if (!isAuthenticated() || !isAdmin()) {
      router.push(!isAuthenticated() ? "/auth/login" : "/dashboard");
      return;
    }

    const saved  = localStorage.getItem("theme");
    const isDark = saved === null ? true : saved === "dark";
    setDark(isDark);
    applyTheme(isDark);

    setName(localStorage.getItem("name")   || "Admin");
    setEmail(localStorage.getItem("email") || "");
    setMounted(true);

    const interval = setInterval(() => {
      const t = localStorage.getItem("theme");
      setDark(t === null ? true : t === "dark");
    }, 300);

    return () => clearInterval(interval);
  }, [router]);

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

  const handleLogout = () => {
    clearUserSession();
    router.push("/");
  };

  // NAV LINKS — Blocklist added
  const navLinks = [
    { label: "Dashboard", href: "/admin" },
    { label: "Users", href: "/admin/users" },
    { label: "Analytics", href: "/admin/analytics" },
    { label: "Reports", href: "/admin/reports" },
    { label: "Blocklist",  href: "/admin/blocklist" },
    { label: "Suspicious", href: "/admin/suspicious" },
  ];

  // THEME TOKENS — mirrors Navbar.js exactly
  const navBg = dark
    ? "bg-[#080c10]/90 backdrop-blur-xl border-b border-white/[0.06]"
    : "bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm";

  const logoGrad = "bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent";

  const linkBase = "text-sm font-medium transition-colors duration-200 px-3 py-1.5 rounded-lg";
  const linkActive = dark
    ? `${linkBase} bg-white/10 text-white`
    : `${linkBase} bg-gray-100 text-gray-900`;
  const linkInactive = dark
    ? `${linkBase} text-white/55 hover:text-white hover:bg-white/[0.07]`
    : `${linkBase} text-gray-500 hover:text-gray-900 hover:bg-gray-100`;

  const userCard = dark
    ? "flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/[0.05] border border-white/[0.08]"
    : "flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-gray-100 border border-gray-200";

  const toggleBtn = dark
    ? "w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.07] border border-white/[0.12] text-white/60 hover:text-white hover:bg-white/[0.12] transition-all"
    : "w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition-all";

  const subText = dark ? "text-[10px] leading-none text-white/30" : "text-[10px] leading-none text-gray-400";

  // SKELETON
  if (!mounted) {
    return (
      <nav className={`w-full sticky top-0 z-50 ${navBg}`}>
        <div className="max-w-7xl mx-auto px-6 py-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                dark ? "bg-yellow-500/20 text-yellow-400" : "bg-yellow-100 text-yellow-500"
              }`}>
                <ShieldIcon />
              </div>
              <div>
                <div className={`text-sm font-bold tracking-tight ${logoGrad}`}>Admin Panel</div>
                <div className={subText}>AI Phishing Detector</div>
              </div>
            </div>
            <div className="h-8 w-48 rounded-xl bg-white/5 animate-pulse" />
          </div>
        </div>
      </nav>
    );
  }

  // FULL NAV
  return (
    <nav className={`w-full sticky top-0 z-50 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-6 py-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">

          {/* LOGO */}
          <Link href="/admin" className="flex items-center gap-2.5 flex-shrink-0">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
              dark ? "bg-yellow-500/20 text-yellow-400" : "bg-yellow-100 text-yellow-500"
            }`}>
              <ShieldIcon />
            </div>
            <div>
              <div className={`text-sm font-bold tracking-tight ${logoGrad}`}>
                Admin Panel
              </div>
              <div className={subText}>
                AI Phishing Detector ·{" "}
                <span className={dark ? "text-yellow-400/70" : "text-yellow-600"}>
                  {name}
                </span>
              </div>
            </div>
          </Link>

          {/* NAV LINKS + CONTROLS */}
          <div className="flex flex-wrap items-center gap-1.5">

            {/* PAGE LINKS */}
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <button className={pathname === link.href ? linkActive : linkInactive}>
                  {link.label}
                </button>
              </Link>
            ))}

            {/* DIVIDER */}
            <div className={`w-px h-5 mx-1 ${dark ? "bg-white/[0.08]" : "bg-gray-300"}`} />

            {/* USER CARD */}
            <div className={userCard}>
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                dark ? "bg-yellow-500/20 text-yellow-400" : "bg-yellow-100 text-yellow-600"
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

            {/* LOGOUT */}
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

            {/* THEME TOGGLE */}
            <button
              onClick={toggleTheme}
              title={dark ? "Light Mode" : "Dark Mode"}
              className={toggleBtn}
            >
              {dark ? <SunIcon /> : <MoonIcon />}
            </button>

          </div>
        </div>
      </div>
    </nav>
  );
}