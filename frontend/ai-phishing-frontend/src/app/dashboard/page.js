"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { useRouter } from "next/navigation";

import api, {

  clearUserSession,

  isAuthenticated

} from "../../services/api";

export default function DashboardPage() {

  const router = useRouter();

  // =========================
  // USER STATES
  // =========================

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [role, setRole] =
    useState("");

  const [loginCount, setLoginCount] =
    useState(0);

  const [lastLoginAt, setLastLoginAt] =
    useState("");

  // =========================
  // DASHBOARD STATES
  // =========================

  const [totalScans, setTotalScans] =
    useState(0);

  const [safeUrls, setSafeUrls] =
    useState(0);

  const [suspiciousUrls, setSuspiciousUrls] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  // =========================
  // LOAD DASHBOARD DATA
  // =========================

  useEffect(() => {

    // =========================
    // CHECK JWT LOGIN
    // =========================

    if (!isAuthenticated()) {

      router.push(
        "/auth/login"
      );

      return;
    }

    // =========================
    // CHECK ROLE
    // =========================

    const storedRole =

      localStorage.getItem(
        "role"
      );

    // Redirect Admin

    if (
      storedRole ===
      "ROLE_ADMIN"
    ) {

      router.push("/admin");

      return;
    }

    // =========================
    // LOAD USER DATA
    // =========================

    setName(

      localStorage.getItem(
        "name"
      ) || "User"
    );

    setEmail(

      localStorage.getItem(
        "email"
      ) || ""
    );

    setRole(
      storedRole || ""
    );

    setLoginCount(

      localStorage.getItem(
        "loginCount"
      ) || 0
    );

    setLastLoginAt(

      localStorage.getItem(
        "lastLoginAt"
      ) || "N/A"
    );

    // =========================
    // LOAD DASHBOARD API
    // =========================

    fetchDashboard();

  }, [router]);

  // =========================
  // FETCH DASHBOARD DATA
  // =========================

  const fetchDashboard = async () => {

    try {

      setLoading(true);

      const response =
        await api.get(
          "/dashboard"
        );

      console.log(response.data);

      // =========================
      // UPDATE DASHBOARD
      // =========================

      setTotalScans(
        response.data.totalScans
      );

      setSafeUrls(
        response.data.safeUrls
      );

      setSuspiciousUrls(
        response.data.suspiciousUrls
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

  return (

    <div
      className="
        min-h-screen
        bg-gradient-to-br
        from-slate-900
        via-black
        to-gray-900
        text-white
        p-6
      "
    >

      {/* =========================
          NAVBAR
      ========================= */}

      <div
        className="
          flex
          flex-col
          md:flex-row
          md:items-center
          md:justify-between
          gap-4
          mb-10
        "
      >

        {/* LEFT */}

        <div>

          <h1
            className="
              text-4xl
              font-bold
            "
          >
            User Dashboard
          </h1>

          <p
            className="
              text-gray-400
              mt-2
            "
          >
            AI Phishing Detection System
          </p>

        </div>

        {/* RIGHT */}

        <div
          className="
            flex
            gap-4
          "
        >

          {/* SCAN URL */}

          <Link href="/scan">

            <button
              className="
                bg-gradient-to-r
                from-cyan-500
                to-blue-600
                px-5
                py-3
                rounded-xl
                font-semibold
                hover:scale-105
                transition
                duration-300
                shadow-lg
              "
            >
              Scan URL
            </button>

          </Link>

          {/* LOGOUT */}

          <button
            onClick={handleLogout}
            className="
              bg-gradient-to-r
              from-red-500
              to-pink-600
              px-5
              py-3
              rounded-xl
              font-semibold
              hover:scale-105
              transition
              duration-300
              shadow-lg
            "
          >
            Logout
          </button>

        </div>

      </div>

      {/* =========================
          USER PROFILE
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
          mb-8
        "
      >

        <h2
          className="
            text-3xl
            font-bold
            mb-6
          "
        >
          Welcome Back 👋
        </h2>

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            lg:grid-cols-5
            gap-6
          "
        >

          {/* NAME */}

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
                text-xl
                font-semibold
              "
            >
              {name}
            </h3>

          </div>

          {/* EMAIL */}

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
              "
            >
              {email}
            </h3>

          </div>

          {/* ROLE */}

          <div>

            <p
              className="
                text-gray-400
                mb-2
              "
            >
              Role
            </p>

            <h3
              className="
                text-xl
                font-semibold
                text-cyan-400
              "
            >
              {role}
            </h3>

          </div>

          {/* LOGIN COUNT */}

          <div>

            <p
              className="
                text-gray-400
                mb-2
              "
            >
              Login Count
            </p>

            <h3
              className="
                text-xl
                font-semibold
                text-yellow-400
              "
            >
              {loginCount}
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
                text-green-400
                break-words
              "
            >
              {lastLoginAt}
            </h3>

          </div>

        </div>

      </div>

      {/* =========================
          DASHBOARD STATS
      ========================= */}

      {
        loading

          ?

          <div
            className="
              text-center
              text-2xl
              font-bold
              mt-20
            "
          >
            Loading Dashboard...
          </div>

          :

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-3
              gap-6
            "
          >

            {/* TOTAL SCANS */}

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
                  text-2xl
                  font-bold
                  mb-4
                "
              >
                Total Scans
              </h2>

              <p
                className="
                  text-6xl
                  font-bold
                  text-cyan-400
                "
              >
                {totalScans}
              </p>

            </div>

            {/* SAFE URLS */}

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
                  text-2xl
                  font-bold
                  mb-4
                "
              >
                Safe URLs
              </h2>

              <p
                className="
                  text-6xl
                  font-bold
                  text-green-400
                "
              >
                {safeUrls}
              </p>

            </div>

            {/* SUSPICIOUS URLS */}

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
                  text-2xl
                  font-bold
                  mb-4
                "
              >
                Suspicious URLs
              </h2>

              <p
                className="
                  text-6xl
                  font-bold
                  text-red-400
                "
              >
                {suspiciousUrls}
              </p>

            </div>

          </div>
      }

    </div>
  );
}