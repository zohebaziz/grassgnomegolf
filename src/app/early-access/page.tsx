"use client";

import { useState, useEffect } from "react";
import { FaSteam } from "react-icons/fa";

const STEAM_APP_ID = "4169150";

export default function HomePage() {

  const steamWishlistUrl = `https://store.steampowered.com/app/${STEAM_APP_ID}/`

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (localStorage.getItem("ggg_signup_success") === "true") {
      setSubmitted(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    localStorage.setItem("ggg_signup_success", "true");
    setSubmitted(true);

    fetch("/api/ea-signups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    }).catch((err) => console.error("Signup failed:", err));

    setEmail("");
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-black text-white px-6">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight">Wishlist Grass Gnome Golf</h1>

        {submitted && (
          <div className="space-y-2">
            <p className="text-green-400 text-lg">✅ Thanks for signing up!</p>
          </div>
        )}
        {!submitted && (
          <p className="text-zinc-400">Enter your email for exclusive in-game rewards</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            required
            disabled={submitted} // Disable email input if already submitted
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading || submitted}
            className="w-full py-3 rounded-xl bg-indigo-500 text-sm font-semibold
              hover:bg-indigo-600 active:bg-indigo-700
              transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitted ? "Already Signed Up!" : "Sign up today for exclusive in-game content"}
          </button>

          <a
            href={steamWishlistUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Wishlist on Steam"
            className="w-full group inline-flex items-center justify-center gap-3
              rounded-xl px-6 py-3 text-sm font-semibold text-white
              bg-gradient-to-r from-[#1b2838] to-[#171a21]
              shadow-lg transition-all duration-200
              hover:shadow-xl sm:hover:scale-[1.03]
              focus:outline-none focus:ring-2 focus:ring-[#66c0f4]"
          >
            <FaSteam className="h-5 w-5 text-[#66c0f4] transition-transform duration-200 group-hover:rotate-6" />
            <span className="tracking-wide">Wishlist on Steam</span>
          </a>
        </form>

        <footer className="pt-8 text-xs text-zinc-500">
          © 2025 Grass Gnome Golf
        </footer>
      </div>
    </main>
  );
}
