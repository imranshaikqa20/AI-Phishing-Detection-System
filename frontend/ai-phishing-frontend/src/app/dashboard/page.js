"use client";

import Link from "next/link";

import { useRouter } from "next/navigation";

export default function DashboardPage() {

  const router = useRouter();

  // =========================
  // HANDLE LOGOUT
  // =========================

  const handleLogout = () => {

    localStorage.removeItem(
      "token"
    );

    router.push("/auth/login");
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

      {/* Navbar */}

      <div
        className="
          flex
          items-center
          justify-between
          mb-10
        "
      >

        {/* Title */}

        <div>

          <h1
            className="
              text-4xl
              font-bold
            "
          >
            Dashboard
          </h1>

          <p
            className="
              text-gray-400
              mt-1
            "
          >
            AI Phishing Detection System
          </p>

        </div>

        {/* Buttons */}

        <div
          className="
            flex
            gap-4
          "
        >

          {/* Scan URL */}

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

          {/* Logout */}

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

      {/* Dashboard Cards */}

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-3
          gap-6
        "
      >

        {/* Total Scans */}

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
            120
          </p>

        </div>

        {/* Safe URLs */}

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
            80
          </p>

        </div>

        {/* Suspicious URLs */}

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
            40
          </p>

        </div>

      </div>

    </div>
  );
}