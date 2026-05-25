"use client";

import { useState } from "react";

import Link from "next/link";

import { useRouter } from "next/navigation";

import api from "../../../services/api";

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

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [success, setSuccess] =
    useState(false);

  // =========================
  // HANDLE REGISTER
  // =========================

  const handleRegister = async (e) => {

    e.preventDefault();

    setLoading(true);

    setMessage("");

    try {

      const response = await api.post(
        "/auth/register",
        {
          name,
          email,
          password,
        }
      );

      console.log(response.data);

      setSuccess(true);

      setMessage(
        response.data.message ||
        "Registration Successful"
      );

      // Redirect to Login

      setTimeout(() => {

        router.push("/auth/login");

      }, 1500);

    } catch (error) {

      console.log(error);

      setSuccess(false);

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

      {/* Register Card */}

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

        {/* Form */}

        <form onSubmit={handleRegister}>

          {/* Name */}

          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
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
              focus:ring-green-400
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
              focus:ring-green-400
            "
            required
          />

          {/* Register Button */}

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
            "
          >

            {
              loading
                ? "Registering..."
                : "Register"
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

        {/* Login Section */}

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