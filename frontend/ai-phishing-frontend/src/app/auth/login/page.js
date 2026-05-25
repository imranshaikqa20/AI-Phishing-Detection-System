"use client";

import { useState } from "react";

import Link from "next/link";

import { useRouter } from "next/navigation";

import api from "../../../services/api";

export default function LoginPage() {

  const router = useRouter();

  // =========================
  // STATES
  // =========================

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [success, setSuccess] =
    useState(false);

  // =========================
  // HANDLE LOGIN
  // =========================

  const handleLogin = async (e) => {

    e.preventDefault();

    setLoading(true);

    setMessage("");

    try {

      const response = await api.post(
        "/auth/login",
        {
          email,
          password,
        }
      );

      console.log(response.data);

      // Store Token

      localStorage.setItem(
        "token",
        "loggedin"
      );

      setSuccess(true);

      setMessage(
        response.data.message ||
        "Login Successful"
      );

      // Redirect

      setTimeout(() => {

        router.push("/dashboard");

      }, 1500);

    } catch (error) {

      console.log(error);

      setSuccess(false);

      setMessage(
        error.response?.data?.message ||
        "Login Failed"
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
        from-blue-900
        via-black
        to-gray-900
        px-4
      "
    >

      {/* Login Card */}

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

        {/* Heading */}

        <h1
          className="
            text-4xl
            font-bold
            text-center
            text-white
            mb-2
          "
        >
          Welcome Back
        </h1>

        <p
          className="
            text-center
            text-gray-300
            mb-8
          "
        >
          AI Phishing Detection System
        </p>

        {/* Form */}

        <form onSubmit={handleLogin}>

          {/* Email */}

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
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
              focus:ring-cyan-400
            "
            required
          />

          {/* Password */}

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
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
              mb-6
              outline-none
              focus:ring-2
              focus:ring-cyan-400
            "
            required
          />

          {/* Login Button */}

          <button
            type="submit"
            disabled={loading}
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

            {
              loading
                ? "Logging In..."
                : "Login"
            }

          </button>

        </form>

        {/* Message */}

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

        {/* Sign Up Section */}

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
            Don&apos;t have an account?
          </p>

          <Link href="/auth/register">

            <button
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
              "
            >
              Sign Up
            </button>

          </Link>

        </div>

      </div>

    </div>
  );
}