"use client";

import AdminNavbar from "../../../components/AdminNavbar";

export default function SuspiciousPage() {

  // =========================
  // SAMPLE DATA
  // =========================

  const suspiciousUrls = [

    {
      id: 1,
      url: "http://fake-paypal-login.com",
      risk: "High",
      status: "Phishing"
    },

    {
      id: 2,
      url: "http://secure-bank-alert.net",
      risk: "Medium",
      status: "Suspicious"
    },

    {
      id: 3,
      url: "http://free-gift-card.xyz",
      risk: "High",
      status: "Malware"
    }
  ];

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
          PAGE TITLE
      ========================= */}

      <div className="mb-10">

        <h1
          className="
            text-5xl
            font-bold
            mb-3
          "
        >
          Suspicious URL Reports
        </h1>

        <p
          className="
            text-gray-400
            text-lg
          "
        >
          Monitor detected phishing,
          malware, and suspicious URLs.
        </p>

      </div>

      {/* =========================
          TABLE
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

          {/* TABLE HEADER */}

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
                Risk Level
              </th>

              <th className="p-4">
                Status
              </th>

            </tr>

          </thead>

          {/* TABLE BODY */}

          <tbody>

            {
              suspiciousUrls.map((item) => (

                <tr
                  key={item.id}
                  className="
                    border-b
                    border-white/10
                    hover:bg-white/5
                    transition
                  "
                >

                  {/* ID */}

                  <td className="p-4">
                    {item.id}
                  </td>

                  {/* URL */}

                  <td
                    className="
                      p-4
                      break-all
                      text-cyan-300
                    "
                  >
                    {item.url}
                  </td>

                  {/* RISK */}

                  <td className="p-4">

                    <span
                      className={`
                        px-4
                        py-1
                        rounded-full
                        text-sm
                        font-semibold

                        ${
                          item.risk === "High"

                            ? "bg-red-500/20 text-red-300"

                            : "bg-yellow-500/20 text-yellow-300"
                        }
                      `}
                    >
                      {item.risk}
                    </span>

                  </td>

                  {/* STATUS */}

                  <td className="p-4">

                    <span
                      className="
                        text-pink-300
                        font-semibold
                      "
                    >
                      {item.status}
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