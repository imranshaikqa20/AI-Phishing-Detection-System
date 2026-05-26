"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import api, {

  clearUserSession,

  isAuthenticated,

  isAdmin

} from "../../services/api";

import AdminNavbar from "../../components/AdminNavbar";

export default function AdminPage() {

  const router = useRouter();

  // =========================
  // STATES
  // =========================

  const [analytics, setAnalytics] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [adminName, setAdminName] =
    useState("");

  const [adminEmail, setAdminEmail] =
    useState("");

  const [lastLoginAt, setLastLoginAt] =
    useState("");

  // =========================
  // AUTH + LOAD ANALYTICS
  // =========================

  useEffect(() => {

    // =========================
    // CHECK LOGIN
    // =========================

    if (!isAuthenticated()) {

      router.push(
        "/auth/login"
      );

      return;
    }

    // =========================
    // CHECK ADMIN ROLE
    // =========================

    if (!isAdmin()) {

      router.push(
        "/dashboard"
      );

      return;
    }

    // =========================
    // LOAD ADMIN DATA
    // =========================

    setAdminName(

      localStorage.getItem(
        "name"
      ) || "Admin"
    );

    setAdminEmail(

      localStorage.getItem(
        "email"
      ) || ""
    );

    setLastLoginAt(

      localStorage.getItem(
        "lastLoginAt"
      ) || "N/A"
    );

    // =========================
    // FETCH ANALYTICS
    // =========================

    fetchAnalytics();

  }, [router]);

  // =========================
  // FETCH ANALYTICS API
  // =========================

  const fetchAnalytics = async () => {

    try {

      setLoading(true);

      const response =
        await api.get(
          "/admin/analytics"
        );

      console.log(response.data);

      setAnalytics(
        response.data
      );

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  };

  // =========================
  // HANDLE LOGOUT
  // =========================

  const handleLogout = () => {

    clearUserSession();

    router.push(
      "/auth/login"
    );
  };

  // =========================
  // LOADING SCREEN
  // =========================

  if (loading) {

    return (

      <div
        className="
          min-h-screen
          flex
          items-center
          justify-center
          bg-black
          text-white
          text-3xl
          font-bold
        "
      >
        Loading Admin Dashboard...
      </div>
    );
  }

  return (

    <div
      className="
        min-h-screen
        bg-gradient-to-br
        from-slate-950
        via-black
        to-gray-900
        text-white
        p-6
      "
    >

      {/* =========================
          ADMIN NAVBAR
      ========================= */}

      <AdminNavbar
        onLogout={handleLogout}
      />

      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="mb-10">

        <h1
          className="
            text-5xl
            font-bold
            mb-3
          "
        >
          Admin Dashboard
        </h1>

        <p
          className="
            text-gray-400
            text-lg
          "
        >
          Monitor users, analytics,
          phishing reports, malware
          activity, and cybersecurity threats.
        </p>

      </div>

      {/* =========================
          ADMIN PROFILE CARD
      ========================= */}

      <div
        className="
          bg-white/10
          backdrop-blur-lg
          border
          border-white/20
          rounded-3xl
          p-8
          shadow-2xl
          mb-10
        "
      >

        <h2
          className="
            text-3xl
            font-bold
            mb-6
          "
        >
          Welcome Admin 👑
        </h2>

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-3
            gap-6
          "
        >

          {/* ADMIN NAME */}

          <div>

            <p
              className="
                text-gray-400
                mb-2
              "
            >
              Name
            </p>

            <h3
              className="
                text-2xl
                font-semibold
                text-cyan-400
              "
            >
              {adminName}
            </h3>

          </div>

          {/* ADMIN EMAIL */}

          <div>

            <p
              className="
                text-gray-400
                mb-2
              "
            >
              Email
            </p>

            <h3
              className="
                text-lg
                font-semibold
                break-all
                text-green-400
              "
            >
              {adminEmail}
            </h3>

          </div>

          {/* LAST LOGIN */}

          <div>

            <p
              className="
                text-gray-400
                mb-2
              "
            >
              Last Login
            </p>

            <h3
              className="
                text-sm
                font-semibold
                text-yellow-400
                break-words
              "
            >
              {lastLoginAt}
            </h3>

          </div>

        </div>

      </div>

      {/* =========================
          ANALYTICS CARDS
      ========================= */}

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          lg:grid-cols-5
          gap-6
          mb-10
        "
      >

        {/* TOTAL USERS */}

        <div
          className="
            bg-white/10
            backdrop-blur-lg
            border
            border-white/20
            rounded-3xl
            p-8
            shadow-2xl
          "
        >

          <h2
            className="
              text-xl
              text-gray-300
              mb-4
            "
          >
            Total Users
          </h2>

          <p
            className="
              text-6xl
              font-bold
              text-cyan-400
            "
          >
            {
              analytics?.totalUsers || 0
            }
          </p>

        </div>

        {/* ACTIVE USERS */}

        <div
          className="
            bg-white/10
            backdrop-blur-lg
            border
            border-white/20
            rounded-3xl
            p-8
            shadow-2xl
          "
        >

          <h2
            className="
              text-xl
              text-gray-300
              mb-4
            "
          >
            Active Users
          </h2>

          <p
            className="
              text-6xl
              font-bold
              text-green-400
            "
          >
            {
              analytics?.activeUsers || 0
            }
          </p>

        </div>

        {/* ADMIN USERS */}

        <div
          className="
            bg-white/10
            backdrop-blur-lg
            border
            border-white/20
            rounded-3xl
            p-8
            shadow-2xl
          "
        >

          <h2
            className="
              text-xl
              text-gray-300
              mb-4
            "
          >
            Admin Users
          </h2>

          <p
            className="
              text-6xl
              font-bold
              text-yellow-400
            "
          >
            {
              analytics?.adminUsers || 0
            }
          </p>

        </div>

        {/* NORMAL USERS */}

        <div
          className="
            bg-white/10
            backdrop-blur-lg
            border
            border-white/20
            rounded-3xl
            p-8
            shadow-2xl
          "
        >

          <h2
            className="
              text-xl
              text-gray-300
              mb-4
            "
          >
            Normal Users
          </h2>

          <p
            className="
              text-6xl
              font-bold
              text-pink-400
            "
          >
            {
              analytics?.normalUsers || 0
            }
          </p>

        </div>

        {/* LOCKED USERS */}

        <div
          className="
            bg-white/10
            backdrop-blur-lg
            border
            border-white/20
            rounded-3xl
            p-8
            shadow-2xl
          "
        >

          <h2
            className="
              text-xl
              text-gray-300
              mb-4
            "
          >
            Locked Users
          </h2>

          <p
            className="
              text-6xl
              font-bold
              text-red-400
            "
          >
            {
              analytics?.lockedUsers || 0
            }
          </p>

        </div>

      </div>

      {/* =========================
          SECURITY MONITORING
      ========================= */}

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-3
          gap-6
        "
      >

        {/* THREAT DETECTION */}

        <div
          className="
            bg-red-500/10
            border
            border-red-500/20
            rounded-3xl
            p-8
            shadow-xl
          "
        >

          <h2
            className="
              text-2xl
              font-bold
              mb-4
              text-red-400
            "
          >
            Threat Detection
          </h2>

          <p
            className="
              text-gray-300
              leading-relaxed
            "
          >
            Detect phishing websites,
            malicious URLs, suspicious
            APIs, and cybersecurity attacks
            in real-time.
          </p>

        </div>

        {/* MALWARE REPORTS */}

        <div
          className="
            bg-purple-500/10
            border
            border-purple-500/20
            rounded-3xl
            p-8
            shadow-xl
          "
        >

          <h2
            className="
              text-2xl
              font-bold
              mb-4
              text-purple-400
            "
          >
            Malware Reports
          </h2>

          <p
            className="
              text-gray-300
              leading-relaxed
            "
          >
            Monitor malware activity,
            suspicious files, risky domains,
            and phishing scan reports.
          </p>

        </div>

        {/* USER MONITORING */}

        <div
          className="
            bg-cyan-500/10
            border
            border-cyan-500/20
            rounded-3xl
            p-8
            shadow-xl
          "
        >

          <h2
            className="
              text-2xl
              font-bold
              mb-4
              text-cyan-400
            "
          >
            User Monitoring
          </h2>

          <p
            className="
              text-gray-300
              leading-relaxed
            "
          >
            Track user activity,
            login attempts, scan history,
            and suspicious platform usage.
          </p>

        </div>

      </div>

    </div>
  );
}