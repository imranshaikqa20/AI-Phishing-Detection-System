"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { useRouter } from "next/navigation";

import api, {

  isAuthenticated

} from "../../../services/api";

export default function RegisterPage() {

  const router = useRouter();

  // =========================
  // STATES
  // =========================

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  // =========================
  // ROLE STATE
  // =========================

  const [role, setRole] =
    useState("ROLE_USER");

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [success, setSuccess] =
    useState(false);

  // =========================
  // AUTO REDIRECT
  // IF ALREADY LOGGED IN
  // =========================

  useEffect(() => {

    if (isAuthenticated()) {

      const userRole =
        localStorage.getItem(
          "role"
        );

      // =========================
      // ADMIN REDIRECT
      // =========================

      if (
        userRole ===
        "ROLE_ADMIN"
      ) {

        router.push("/admin");
      }

      // =========================
      // USER REDIRECT
      // =========================

      else {

        router.push(
          "/dashboard"
        );
      }
    }

  }, [router]);

  // =========================
  // HANDLE REGISTER
  // =========================

  const handleRegister = async (e) => {

    e.preventDefault();

    setLoading(true);

    setMessage("");

    try {

      // =========================
      // REGISTER API
      // =========================

      const response = await api.post(

        "/auth/register",

        {
          name,
          email,
          password,
          role,
        }
      );

      console.log(response.data);

      // =========================
      // SUCCESS
      // =========================

      setSuccess(true);

      setMessage(

        response.data.message ||

        "Registration Successful"
      );

      // =========================
      // SAVE TEMP EMAIL
      // =========================

      localStorage.setItem(
        "registeredEmail",
        email
      );

      // =========================
      // REDIRECT TO LOGIN
      // =========================

      setTimeout(() => {

        router.push(
          "/auth/login"
        );

      }, 1500);

    } catch (error) {

      console.log(error);

      setSuccess(false);

      // =========================
      // ERROR MESSAGE
      // =========================

      setMessage(

        error.response?.data?.message ||

        "Registration Failed"
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-gradient-to-br
        from-green-900
        via-black
        to-gray-900
        px-4
      "
    >

      {/* =========================
          REGISTER CARD
      ========================= */}

      <div
        className="
          w-full
          max-w-md
          bg-white/10
          backdrop-blur-lg
          border
          border-white/20
          rounded-3xl
          shadow-2xl
          p-8
        "
      >

        {/* =========================
            HEADING
        ========================= */}

        <h1
          className="
            text-4xl
            font-bold
            text-center
            text-white
            mb-2
          "
        >
          Create Account
        </h1>

        <p
          className="
            text-center
            text-gray-300
            mb-8
          "
        >
          Join AI Phishing Detection
        </p>

        {/* =========================
            REGISTER FORM
        ========================= */}

        <form onSubmit={handleRegister}>

          {/* NAME */}

          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) =>

              setName(
                e.target.value
              )
            }
            className="
              w-full
              p-4
              rounded-xl
              bg-white/10
              border
              border-white/20
              text-white
              placeholder-gray-300
              mb-4
              outline-none
              focus:ring-2
              focus:ring-green-400
            "
            required
          />

          {/* EMAIL */}

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) =>

              setEmail(
                e.target.value
              )
            }
            className="
              w-full
              p-4
              rounded-xl
              bg-white/10
              border
              border-white/20
              text-white
              placeholder-gray-300
              mb-4
              outline-none
              focus:ring-2
              focus:ring-green-400
            "
            required
          />

          {/* PASSWORD */}

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) =>

              setPassword(
                e.target.value
              )
            }
            className="
              w-full
              p-4
              rounded-xl
              bg-white/10
              border
              border-white/20
              text-white
              placeholder-gray-300
              mb-4
              outline-none
              focus:ring-2
              focus:ring-green-400
            "
            required
          />

          {/* ROLE */}

          <select
            value={role}
            onChange={(e) =>

              setRole(
                e.target.value
              )
            }
            className="
              w-full
              p-4
              rounded-xl
              bg-white/10
              border
              border-white/20
              text-white
              mb-6
              outline-none
              focus:ring-2
              focus:ring-yellow-400
            "
          >

            <option
              value="ROLE_USER"
              className="text-black"
            >
              User
            </option>

            <option
              value="ROLE_ADMIN"
              className="text-black"
            >
              Admin
            </option>

          </select>

          {/* REGISTER BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              bg-gradient-to-r
              from-green-500
              to-emerald-600
              text-white
              py-4
              rounded-xl
              font-semibold
              hover:scale-105
              transition
              duration-300
              shadow-lg
              disabled:opacity-50
            "
          >

            {
              loading

                ? "Creating Account..."

                : "Register"
            }

          </button>

        </form>

        {/* =========================
            RESPONSE MESSAGE
        ========================= */}

        {
          message && (

            <div
              className={`
                mt-5
                text-center
                p-3
                rounded-xl
                font-medium
                ${
                  success

                    ? "bg-green-500/20 text-green-300"

                    : "bg-red-500/20 text-red-300"
                }
              `}
            >
              {message}
            </div>
          )
        }

        {/* =========================
            LOGIN SECTION
        ========================= */}

        <div
          className="
            mt-6
            text-center
          "
        >

          <p
            className="
              text-gray-300
              mb-3
            "
          >
            Already have an account?
          </p>

          <Link href="/auth/login">

            <button
              className="
                w-full
                bg-gradient-to-r
                from-cyan-500
                to-blue-600
                text-white
                py-4
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

        </div>

      </div>

    </div>
  );
}