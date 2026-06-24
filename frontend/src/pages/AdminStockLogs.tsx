import { useEffect, useState } from "react";

import {
  getStockLogs,
} from "../services/admin.service";

interface StockLog {
  id: string;
  delta: number;
  reason: string;
  createdAt: string;

  book: {
    id: string;
    title: string;
  };
}

export default function AdminStockLogs() {
  const [logs, setLogs] =
    useState<StockLog[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data =
          await getStockLogs();

        setLogs(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        Loading stock logs...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <h1
        className="mb-8 text-4xl font-bold"
        style={{
          fontFamily:
            "var(--font-serif)",
        }}
      >
        Stock Logs
      </h1>

      {logs.length === 0 ? (
        <p>No stock logs found.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="p-4 text-left">
                  Book
                </th>

                <th className="p-4 text-left">
                  Change
                </th>

                <th className="p-4 text-left">
                  Reason
                </th>

                <th className="p-4 text-left">
                  Date
                </th>
              </tr>
            </thead>

            <tbody>
              {logs.map((log) => (
                <tr
                  key={log.id}
                  className="border-b"
                >
                  <td className="p-4">
                    {log.book.title}
                  </td>

                  <td
                    className={`p-4 font-semibold ${
                      log.delta > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {log.delta > 0
                      ? `+${log.delta}`
                      : log.delta}
                  </td>

                  <td className="p-4">
                    {log.reason}
                  </td>

                  <td className="p-4">
                    {new Date(
                      log.createdAt
                    ).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}