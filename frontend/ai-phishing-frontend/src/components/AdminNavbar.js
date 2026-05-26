"use client";

import Link from "next/link";

import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";

import {

  clearUserSession,

  isAuthenticated,

  isAdmin

} from "../services/api";

export default function AdminNavbar() {

  const router = useRouter();

  // =========================
  // STATES
  // =========================

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [lastLoginAt, setLastLoginAt] =
    useState("");

  // =========================
  // AUTH CHECK
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
    // LOAD USER SESSION
    // =========================

    setName(

      localStorage.getItem(
        "name"
      ) || "Admin"
    );

    setEmail(

      localStorage.getItem(
        "email"
      ) || ""
    );

    setLastLoginAt(

      localStorage.getItem(
        "lastLoginAt"
      ) || "N/A"
    );

  }, [router]);

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

    <nav
      className="
        w-full
        bg-white/10
        backdrop-blur-lg
        border
        border-white/20
        rounded-3xl
        p-5
        mb-10
        shadow-2xl
      "
    >

      <div
        className="
          flex
          flex-col
          lg:flex-row
          lg:items-center
          lg:justify-between
          gap-5
        "
      >

        {/* =========================
            LEFT SECTION
        ========================= */}

        <div>

          <h1
            className="
              text-3xl
              font-bold
              text-white
            "
          >
            Admin Control Panel
          </h1>

          <p
            className="
              text-gray-400
              mt-1
            "
          >
            Welcome Back,
            {" "}

            <span
              className="
                text-cyan-400
                font-semibold
              "
            >
              {name}
            </span>

          </p>

          {/* EMAIL */}

          <p
            className="
              text-sm
              text-gray-500
              mt-1
              break-all
            "
          >
            {email}
          </p>

          {/* LAST LOGIN */}

          <p
            className="
              text-xs
              text-yellow-400
              mt-1
            "
          >
            Last Login:
            {" "}
            {lastLoginAt}
          </p>

        </div>

        {/* =========================
            NAVIGATION BUTTONS
        ========================= */}

        <div
          className="
            flex
            flex-wrap
            gap-4
          "
        >

          {/* DASHBOARD */}

          <Link href="/admin">

            <button
              className="
                bg-cyan-600
                hover:bg-cyan-700
                px-5
                py-3
                rounded-xl
                font-semibold
                transition
                shadow-lg
              "
            >
              Dashboard
            </button>

          </Link>

          {/* USERS */}

          <Link href="/admin/users">

            <button
              className="
                bg-blue-600
                hover:bg-blue-700
                px-5
                py-3
                rounded-xl
                font-semibold
                transition
                shadow-lg
              "
            >
              Users
            </button>

          </Link>

          {/* ANALYTICS */}

          <Link href="/admin/analytics">

            <button
              className="
                bg-green-600
                hover:bg-green-700
                px-5
                py-3
                rounded-xl
                font-semibold
                transition
                shadow-lg
              "
            >
              Analytics
            </button>

          </Link>

          {/* REPORTS */}

          <Link href="/admin/reports">

            <button
              className="
                bg-purple-600
                hover:bg-purple-700
                px-5
                py-3
                rounded-xl
                font-semibold
                transition
                shadow-lg
              "
            >
              Reports
            </button>

          </Link>

          {/* SUSPICIOUS */}

          <Link href="/admin/suspicious">

            <button
              className="
                bg-orange-600
                hover:bg-orange-700
                px-5
                py-3
                rounded-xl
                font-semibold
                transition
                shadow-lg
              "
            >
              Suspicious
            </button>

          </Link>

          {/* LOGOUT */}

          <button
            onClick={handleLogout}
            className="
              bg-red-600
              hover:bg-red-700
              px-5
              py-3
              rounded-xl
              font-semibold
              transition
              shadow-lg
            "
          >
            Logout
          </button>

        </div>

      </div>

    </nav>
  );
}