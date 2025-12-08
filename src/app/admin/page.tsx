'use client'

import { Email } from "@/model/email.interface";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

const AdminPage = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // This effect will only run if the user is authenticated
    if (isAuthenticated) {
      const fetchEmails = async () => {
        const res = await fetch('/api/ea-signups')
        const retrievedEmails: Email[] = await res.json()
        setEmails(retrievedEmails)
      }

      fetchEmails();
    }
  }, [isAuthenticated])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password: password }),
    });

    if (res.ok) {
      setIsAuthenticated(true);
    } else {
      const data = await res.json();
      setError(data.error || "Authentication failed");
    }
  };

  const handleDelete = async (emailToDelete: string) => {
    if (window.confirm(`Are you sure you want to delete ${emailToDelete}?`)) {
      try {
        const res = await fetch(`/api/ea-signups/${emailToDelete}`, {
          method: "DELETE",
        });

        if (res.ok) {
          setEmails(emails.filter((email) => email.email !== emailToDelete));
        } else {
          const data = await res.json();
          alert(data.error || "Deletion failed");
        }
      } catch (err) {
        console.error(err);
        alert("An error occurred while deleting the email.");
      }
    }
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-black text-white px-6">
        <div className="max-w-md w-full text-center space-y-6">
          <h1 className="text-4xl font-bold tracking-tight">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              required
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 transition-colors font-semibold disabled:opacity-50"
            >
              Login
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-900 text-white p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <p className="text-zinc-400 mb-6">Total signups: {emails.length}</p>
      <ul className="space-y-2">
        {emails.map((email, i) => (
          <li key={i} className="bg-zinc-800 p-3 rounded-lg flex justify-between">
            <div>{email.email}</div>
            <Trash2 className="hover:cursor-pointer" onClick={() => handleDelete(email.email)} />
          </li>
        ))}
      </ul>
    </main>
  );
}

export default AdminPage;