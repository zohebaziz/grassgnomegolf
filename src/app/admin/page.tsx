'use client'

import { Email } from "@/model/email.interface";
import { useEffect, useState } from "react";

const AdminPage = () => {
  const [emails, setEmails] = useState<Email[]>([]);

  useEffect(() => {
    const fetchEmails = async () => {
      const res = await fetch('/api/ea-signups')
      const retrievedEmails: Email[] = await res.json()
      setEmails(retrievedEmails)
    }

    fetchEmails();
  }, [])

  return (
    <main className="min-h-screen bg-zinc-900 text-white p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <p className="text-zinc-400 mb-6">Total signups: {emails.length}</p>
      <ul className="space-y-2">
        {emails.map((email, i) => (
          <li key={i} className="bg-zinc-800 p-3 rounded-lg">
            {email.email}
          </li>
        ))}
      </ul>
    </main>
  );
}

export default AdminPage;