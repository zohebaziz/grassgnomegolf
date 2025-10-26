import { promises as fs } from "fs";
import path from "path";

export const dynamic = "force-dynamic"; // ensure latest file read each time

export default async function AdminPage() {
  const filePath = path.join(process.cwd(), "data", "emails.json");
  const data = await fs.readFile(filePath, "utf-8");
  const emails: string[] = JSON.parse(data);

  return (
    <main className="min-h-screen bg-zinc-900 text-white p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <p className="text-zinc-400 mb-6">Total signups: {emails.length}</p>
      <ul className="space-y-2">
        {emails.map((email, i) => (
          <li key={i} className="bg-zinc-800 p-3 rounded-lg">
            {email}
          </li>
        ))}
      </ul>
    </main>
  );
}
