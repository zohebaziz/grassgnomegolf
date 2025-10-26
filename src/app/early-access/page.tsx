"use client";

import { useState, useEffect } from "react";

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/ea-signups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (data.error) throw new Error(data.error);
      setSubmitted(true);

      // Redirect to Steam wishlist page
      window.open("https://store.steampowered.com/app/YOUR_APP_ID/", '_blank');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-black text-white px-6">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight">Wishlist Grass Gnome Golf</h1>
        <p className="text-zinc-400">Sign up today and be featured on Guiseepe!</p>

        {!submitted ? (
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
        ) : (
          <p className="text-green-400 text-lg">Thanks! Redirecting you to Steam...</p>
        )}

        <footer className="pt-8 text-xs text-zinc-500">
          © 2025 Grass Gnome Golf
        </footer>
      </div>
    </main>
  );
}
