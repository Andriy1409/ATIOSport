"use client";

import { useEffect, useState } from "react";
import type { Client } from "@/types/client";

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/clients")
      .then((res) => res.json())
      .then(setClients)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading clients...</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold tracking-tight">Clients</h1>

      {clients.length === 0 ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">No registered clients yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px] text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                <th className="py-2 pr-4 font-medium">Name</th>
                <th className="py-2 pr-4 font-medium">Email</th>
                <th className="py-2 pr-4 font-medium">Phone</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {clients.map((client) => (
                <tr key={client.id}>
                  <td className="py-2 pr-4">{client.name}</td>
                  <td className="py-2 pr-4">{client.email}</td>
                  <td className="py-2 pr-4">{client.phone || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
