"use client";

import { useEffect, useState } from "react";

import api from "../../../services/api";

import AdminNavbar from "../../../components/AdminNavbar";

export default function AnalyticsPage() {

  // =========================
  // STATES
  // =========================

  const [analytics, setAnalytics] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  // =========================
  // LOAD ANALYTICS
  // =========================

  useEffect(() => {

    fetchAnalytics();

  }, []);

  // =========================
  // FETCH ANALYTICS
  // =========================

  const fetchAnalytics = async () => {

    try {

      const response =
        await api.get(
          "/admin/analytics"
        );

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
        Loading Analytics...
      </div>
    );
  }

  return (

    <div
      className="
        min-h-screen
        bg-gradient-to-br
        from-black
        via-slate-950
        to-gray-900
        text-white
        p-6
      "
    >

      {/* =========================
          ADMIN NAVBAR
      ========================= */}

      <AdminNavbar />

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
          Analytics Dashboard
        </h1>

        <p
          className="
            text-gray-400
            text-lg
          "
        >
          Monitor cybersecurity analytics,
          phishing activity, malware reports,
          and user statistics.
        </p>

      </div>

      {/* =========================
          ANALYTICS CARDS
      ========================= */}

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          lg:grid-cols-4
          gap-6
          mb-10
        "
      >

        {/* Total Users */}

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

        {/* Active Users */}

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

        {/* Admin Users */}

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

        {/* Normal Users */}

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

      </div>

      {/* =========================
          SECURITY ANALYTICS
      ========================= */}

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-3
          gap-6
        "
      >

        {/* Threat Detection */}

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
            fake login pages,
            malicious domains,
            and suspicious URLs.
          </p>

        </div>

        {/* Malware Analysis */}

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
            Malware Analysis
          </h2>

          <p
            className="
              text-gray-300
              leading-relaxed
            "
          >
            Analyze risky activity,
            malware behavior,
            suspicious APIs,
            and cybersecurity threats.
          </p>

        </div>

        {/* Security Reports */}

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
            Security Reports
          </h2>

          <p
            className="
              text-gray-300
              leading-relaxed
            "
          >
            Generate security reports,
            monitor suspicious activity,
            and track phishing trends.
          </p>

        </div>

      </div>

    </div>
  );
}