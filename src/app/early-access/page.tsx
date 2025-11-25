"use client";

import { useState, useEffect } from "react";


const STEAM_APP_ID = "4169150";

export default function HomePage() {
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

    const steamWebUrl = `https://store.steampowered.com/app/${STEAM_APP_ID}/`;

    localStorage.setItem("ggg_signup_success", "true");
    setSubmitted(true);

    window.open(steamWebUrl, "_blank");

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

        {!submitted ? (
          <>
            <p className="text-zinc-400">Sign up today and be featured on Guiseepe!</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                required
              />
              {error && <p className="text-red-400 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 transition-colors font-semibold disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Sign Up"}
              </button>
            </form>
          </>
        ) : (
          <div className="space-y-2">
            <p className="text-green-400 text-lg">✅ Thanks for signing up!</p>
            <p className="text-zinc-400 text-sm">You can safely close this page.</p>
          </div>
        )}

        <footer className="pt-8 text-xs text-zinc-500">
          © 2025 Grass Gnome Golf
        </footer>
      </div>
    </main>
  );
}
