"use client";

import Link from "next/link";

import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";

import {

  clearUserSession,

  isAuthenticated,

  isAdmin

} from "../services/api";

export default function Navbar() {

  const router = useRouter();

  // =========================
  // STATES
  // =========================

  const [isLoggedIn, setIsLoggedIn] =
    useState(false);

  const [role, setRole] =
    useState("");

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  // =========================
  // LOAD USER SESSION
  // =========================

  useEffect(() => {

    loadSession();

    // =========================
    // AUTO REFRESH SESSION
    // =========================

    window.addEventListener(
      "storage",
      loadSession
    );

    return () => {

      window.removeEventListener(
        "storage",
        loadSession
      );
    };

  }, []);

  // =========================
  // LOAD SESSION FUNCTION
  // =========================

  const loadSession = () => {

    const authenticated =
      isAuthenticated();

    setIsLoggedIn(
      authenticated
    );

    if (authenticated) {

      setRole(

        localStorage.getItem(
          "role"
        ) || ""
      );

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

    } else {

      setRole("");

      setName("");

      setEmail("");
    }
  };

  // =========================
  // HANDLE LOGOUT
  // =========================

  const handleLogout = () => {

    clearUserSession();

    setIsLoggedIn(false);

    setRole("");

    setName("");

    setEmail("");

    router.push(
      "/auth/login"
    );
  };

  return (

    <nav
      className="
        w-full
        bg-black/70
        backdrop-blur-lg
        border-b
        border-white/10
        text-white
        px-6
        py-4
        shadow-xl
      "
    >

      <div
        className="
          flex
          flex-col
          lg:flex-row
          lg:items-center
          lg:justify-between
          gap-4
        "
      >

        {/* =========================
            LOGO
        ========================= */}

        <div>

          <Link href="/">

            <h1
              className="
                text-2xl
                font-bold
                cursor-pointer
                bg-gradient-to-r
                from-cyan-400
                to-blue-500
                bg-clip-text
                text-transparent
              "
            >
              AI Phishing Detection
            </h1>

          </Link>

          <p
            className="
              text-sm
              text-gray-400
              mt-1
            "
          >
            Cybersecurity Protection Platform
          </p>

        </div>

        {/* =========================
            NAVIGATION LINKS
        ========================= */}

        <div
          className="
            flex
            flex-wrap
            items-center
            gap-4
          "
        >

          {/* HOME */}

          <Link href="/">

            <button
              className="
                hover:text-cyan-400
                transition
                font-medium
              "
            >
              Home
            </button>

          </Link>

          {/* USER DASHBOARD */}

          {
            isLoggedIn &&
            role === "ROLE_USER" && (

              <Link href="/dashboard">

                <button
                  className="
                    hover:text-cyan-400
                    transition
                    font-medium
                  "
                >
                  Dashboard
                </button>

              </Link>
            )
          }

          {/* ADMIN PANEL */}

          {
            isLoggedIn &&
            isAdmin() && (

              <Link href="/admin">

                <button
                  className="
                    hover:text-yellow-400
                    transition
                    font-medium
                  "
                >
                  Admin Panel
                </button>

              </Link>
            )
          }

          {/* SCAN PAGE */}

          {
            isLoggedIn && (

              <Link href="/scan">

                <button
                  className="
                    hover:text-green-400
                    transition
                    font-medium
                  "
                >
                  Scan URL
                </button>

              </Link>
            )
          }

          {/* USER INFO */}

          {
            isLoggedIn && (

              <div
                className="
                  px-4
                  py-2
                  rounded-2xl
                  bg-white/10
                  border
                  border-white/10
                  text-sm
                "
              >

                <p
                  className="
                    text-cyan-300
                    font-semibold
                  "
                >
                  {name}
                </p>

                <p
                  className="
                    text-gray-400
                    text-xs
                    break-all
                  "
                >
                  {email}
                </p>

              </div>
            )
          }

          {/* LOGIN BUTTON */}

          {
            !isLoggedIn && (

              <Link href="/auth/login">

                <button
                  className="
                    bg-gradient-to-r
                    from-cyan-500
                    to-blue-600
                    px-5
                    py-2
                    rounded-xl
                    font-semibold
                    hover:scale-105
                    transition
                    duration-300
                    shadow-lg
                  "
                >
                  Login
                </button>

              </Link>
            )
          }

          {/* REGISTER BUTTON */}

          {
            !isLoggedIn && (

              <Link href="/auth/register">

                <button
                  className="
                    bg-gradient-to-r
                    from-green-500
                    to-emerald-600
                    px-5
                    py-2
                    rounded-xl
                    font-semibold
                    hover:scale-105
                    transition
                    duration-300
                    shadow-lg
                  "
                >
                  Register
                </button>

              </Link>
            )
          }

          {/* LOGOUT BUTTON */}

          {
            isLoggedIn && (

              <button
                onClick={handleLogout}
                className="
                  bg-gradient-to-r
                  from-red-500
                  to-pink-600
                  px-5
                  py-2
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
            )
          }

        </div>

      </div>

    </nav>
  );
}