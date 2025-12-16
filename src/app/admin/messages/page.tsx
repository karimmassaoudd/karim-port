import { promises as fs } from "fs";
import path from "path";
import Link from "next/link";

export const runtime = "nodejs"; // server component with Node APIs

async function getMessages() {
  const dataFile = path.join(process.cwd(), "src", "data", "contacts.json");
  try {
    const raw = await fs.readFile(dataFile, "utf8");
    return JSON.parse(raw || "[]") as Array<{
      id: string;
      name: string;
      email: string;
      phone?: string;
      message: string;
      createdAt: string;
    }>;
  } catch {
    return [];
  }
}

export default async function MessagesPage() {
  const messages = await getMessages();
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-secondary text-base font-bold text-headline mb-2">Contact Messages</h3>
          <p className="text-xs font-secondary text-gray-600 dark:text-gray-400">Reading from src/data/contacts.json</p>
        </div>
        <a 
          href="/admin/dashboard"
          className="px-4 py-2 rounded-lg font-secondary font-semibold backdrop-blur-md bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 hover:bg-[var(--accent)]/20 transition-all shadow-sm"
        >
          Homepage Dashboard
        </a>
      </div>
      {messages.length === 0 ? (
        <p className="font-secondary text-gray-600 dark:text-gray-400">No messages yet.</p>
      ) : (
        <div className="space-y-4">
          {messages.map((m) => (
            <div key={m.id} className="backdrop-blur-xl bg-white/80 dark:bg-[var(--card)]/80 rounded-lg shadow-sm border border-white/20 dark:border-white/10 p-4">
              <div className="flex flex-wrap justify-between gap-2 text-xs font-secondary">
                <div><span className="font-semibold">Name:</span> {m.name}</div>
                <div><span className="font-semibold">Email:</span> {m.email}</div>
                {m.phone ? <div><span className="font-semibold">Phone:</span> {m.phone}</div> : null}
                <div className="text-gray-600 dark:text-gray-400">{new Date(m.createdAt).toLocaleString()}</div>
              </div>
              <div className="mt-2 text-sm font-secondary text-gray-900 dark:text-white whitespace-pre-wrap">{m.message}</div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
