"use client";

import { useState } from "react";

import api from "../../services/api";

export default function ScanPage() {

  const [url, setUrl] =
    useState("");

  const [result, setResult] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const scanUrl = async (e) => {

    e.preventDefault();

    setLoading(true);

    try {

      const response = await api.post(
        "/scan/url",
        url
      );

      setResult(response.data);

    } catch (error) {

      console.log(error);

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
        from-red-900
        via-black
        to-gray-900
        px-4
      "
    >

      <div
        className="
          w-full
          max-w-2xl
          bg-white/10
          backdrop-blur-lg
          border
          border-white/20
          rounded-3xl
          shadow-2xl
          p-8
        "
      >

        <h1
          className="
            text-4xl
            font-bold
            text-center
            text-white
            mb-2
          "
        >
          URL Scanner
        </h1>

        <p
          className="
            text-center
            text-gray-300
            mb-8
          "
        >
          Detect suspicious phishing URLs
        </p>

        <form onSubmit={scanUrl}>

          <input
            type="text"
            placeholder="Enter website URL"
            value={url}
            onChange={(e) =>
              setUrl(e.target.value)
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
            "
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              bg-gradient-to-r
              from-red-500
              to-pink-600
              text-white
              py-4
              rounded-xl
              font-semibold
              hover:scale-105
              transition
              duration-300
            "
          >

            {
              loading
                ? "Scanning..."
                : "Scan URL"
            }

          </button>

        </form>

        {/* Result */}

        {
          result && (

            <div
              className="
                mt-8
                bg-white/10
                border
                border-white/20
                rounded-2xl
                p-6
              "
            >

              <h2
                className="
                  text-2xl
                  font-bold
                  mb-4
                "
              >
                Scan Result
              </h2>

              <p className="mb-2">
                <strong>URL:</strong>
                {" "}
                {result.url}
              </p>

              <p className="mb-2">
                <strong>Status:</strong>
                {" "}
                {result.status}
              </p>

              <p className="mb-2">
                <strong>Risk:</strong>
                {" "}
                {result.riskLevel}
              </p>

              <p>
                <strong>Recommendation:</strong>
                {" "}
                {result.recommendation}
              </p>

            </div>
          )
        }

      </div>

    </div>
  );
}