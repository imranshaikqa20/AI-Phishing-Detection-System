"use client";

import { useEffect, useState } from "react";

import api from "../../../services/api";

import AdminNavbar from "../../../components/AdminNavbar";

export default function ReportsPage() {

  // =========================
  // STATES
  // =========================

  const [reports, setReports] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // =========================
  // LOAD REPORTS
  // =========================

  useEffect(() => {

    fetchReports();

  }, []);

  // =========================
  // FETCH REPORTS
  // =========================

  const fetchReports = async () => {

    try {

      await api.get(
        "/admin/reports"
      );

      // Dummy Reports

      setReports([

        {
          id: 1,
          url:
            "http://fake-login.com",
          status:
            "Suspicious",
          risk:
            "High",
        },

        {
          id: 2,
          url:
            "http://secure-google.com",
          status:
            "Safe",
          risk:
            "Low",
        },

        {
          id: 3,
          url:
            "http://verify-bank-account.com",
          status:
            "Malware",
          risk:
            "Critical",
        },

        {
          id: 4,
          url:
            "http://crypto-airdrop.net",
          status:
            "Suspicious",
          risk:
            "Medium",
        },
      ]);

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
        Loading Reports...
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
          Security Reports
        </h1>

        <p
          className="
            text-gray-400
            text-lg
          "
        >
          Monitor phishing attacks,
          malware activity,
          suspicious URLs,
          and cybersecurity threats.
        </p>

      </div>

      {/* =========================
          ALERT CARDS
      ========================= */}

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-3
          gap-6
          mb-10
        "
      >

        {/* Critical Threats */}

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
            Critical Threats
          </h2>

          <p
            className="
              text-5xl
              font-bold
            "
          >
            12
          </p>

        </div>

        {/* Suspicious URLs */}

        <div
          className="
            bg-yellow-500/10
            border
            border-yellow-500/20
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
              text-yellow-400
            "
          >
            Suspicious URLs
          </h2>

          <p
            className="
              text-5xl
              font-bold
            "
          >
            45
          </p>

        </div>

        {/* Safe URLs */}

        <div
          className="
            bg-green-500/10
            border
            border-green-500/20
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
              text-green-400
            "
          >
            Safe URLs
          </h2>

          <p
            className="
              text-5xl
              font-bold
            "
          >
            220
          </p>

        </div>

      </div>

      {/* =========================
          REPORTS TABLE
      ========================= */}

      <div
        className="
          overflow-x-auto
          bg-white/10
          backdrop-blur-lg
          border
          border-white/20
          rounded-3xl
          shadow-2xl
          p-6
        "
      >

        <table
          className="
            w-full
            text-left
          "
        >

          {/* TABLE HEAD */}

          <thead>

            <tr
              className="
                border-b
                border-white/20
              "
            >

              <th className="p-4">
                ID
              </th>

              <th className="p-4">
                URL
              </th>

              <th className="p-4">
                Status
              </th>

              <th className="p-4">
                Risk Level
              </th>

            </tr>

          </thead>

          {/* TABLE BODY */}

          <tbody>

            {
              reports.map((report) => (

                <tr
                  key={report.id}
                  className="
                    border-b
                    border-white/10
                    hover:bg-white/5
                    transition
                  "
                >

                  {/* ID */}

                  <td className="p-4">
                    {report.id}
                  </td>

                  {/* URL */}

                  <td className="p-4">
                    {report.url}
                  </td>

                  {/* STATUS */}

                  <td className="p-4">

                    <span
                      className={`
                        px-4
                        py-1
                        rounded-full
                        text-sm
                        font-semibold

                        ${
                          report.status === "Safe"

                            ? "bg-green-500/20 text-green-300"

                            : report.status === "Malware"

                            ? "bg-red-500/20 text-red-300"

                            : "bg-yellow-500/20 text-yellow-300"
                        }
                      `}
                    >
                      {report.status}
                    </span>

                  </td>

                  {/* RISK */}

                  <td className="p-4">

                    <span
                      className={`
                        font-semibold

                        ${
                          report.risk === "Critical"

                            ? "text-red-400"

                            : report.risk === "High"

                            ? "text-orange-400"

                            : report.risk === "Medium"

                            ? "text-yellow-400"

                            : "text-green-400"
                        }
                      `}
                    >
                      {report.risk}
                    </span>

                  </td>

                </tr>
              ))
            }

          </tbody>

        </table>

      </div>

    </div>
  );
}