import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getDashboardStats,
  getTopRatedBooks,
  getRecentOrders,
} from "../services/admin.service";

export default function AdminDashboard() {
  const [stats, setStats] =
    useState<any>(null);

  const [books, setBooks] =
    useState<any[]>([]);

  const [orders, setOrders] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const loadData =
      async () => {
        try {
          const statsData =
            await getDashboardStats();

          const booksData =
            await getTopRatedBooks();

          const ordersData =
            await getRecentOrders();

          setStats(statsData);
          setBooks(booksData);
          setOrders(ordersData);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <p className="text-lg">
          Loading dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1
        className="mb-10 text-5xl font-bold"
        style={{
          fontFamily:
            "var(--font-serif)",
        }}
      >
        Admin Dashboard
      </h1>

      {/* Stats */}

      <div className="mb-10 grid gap-6 md:grid-cols-5">
        <StatCard
          title="Users"
          value={stats.totalUsers}
        />

        <StatCard
          title="Books"
          value={stats.totalBooks}
        />

        <StatCard
          title="Orders"
          value={stats.totalOrders}
        />

        <StatCard
          title="Pending"
          value={stats.pendingOrders}
        />

        <StatCard
          title="Revenue"
          value={`₹${stats.totalRevenue}`}
        />
      </div>

      {/* Quick Actions */}

      <div className="mb-12 flex flex-wrap gap-4">
        <Link
          to="/admin/orders"
          className="
            rounded-xl
            bg-[var(--color-accent)]
            px-6
            py-3
            font-medium
            text-white
            shadow-sm
            transition
            hover:opacity-90
          "
        >
          Manage Orders
        </Link>

        <Link
          to="/admin/books"
          className="
            rounded-xl
            border
            px-6
            py-3
            font-medium
            transition
            hover:bg-gray-100
            dark:hover:bg-gray-800
          "
        >
          Manage Books
        </Link>

        <Link
          to="/admin/stock-logs"
          className="
            rounded-xl
            border
            px-6
            py-3
            font-medium
            transition
            hover:bg-gray-100
            dark:hover:bg-gray-800
          "
        >
          Stock Logs
        </Link>
      </div>

      {/* Top Rated Books */}

      <div className="mb-12">
        <h2 className="mb-5 text-3xl font-bold">
          Top Rated Books
        </h2>

        <div className="space-y-3">
          {books.map((book) => (
            <div
              key={book.id}
              className="
                flex
                items-center
                justify-between
                rounded-xl
                border
                bg-[var(--color-surface)]
                p-4
                shadow-sm
              "
            >
              <div>
                <p className="font-semibold">
                  {book.title}
                </p>

                <p className="text-sm text-gray-500">
                  {book.author}
                </p>
              </div>

              <div className="text-lg font-semibold">
                ⭐ {book.averageRating}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders */}

      <div>
        <h2 className="mb-5 text-3xl font-bold">
          Recent Orders
        </h2>

        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="p-4 text-left">
                  Customer
                </th>

                <th className="p-4 text-left">
                  Amount
                </th>

                <th className="p-4 text-left">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-t"
                >
                  <td className="p-4">
                    {order.user.name}
                  </td>

                  <td className="p-4 font-medium">
                    ₹{order.totalAmount}
                  </td>

                  <td className="p-4">
                    <span
                      className={`
                        rounded-full
                        px-3
                        py-1
                        text-sm
                        font-medium
                        ${
                          order.status ===
                          "PAID"
                            ? "bg-green-100 text-green-700"
                            : order.status ===
                              "PENDING"
                            ? "bg-yellow-100 text-yellow-700"
                            : order.status ===
                              "SHIPPED"
                            ? "bg-blue-100 text-blue-700"
                            : order.status ===
                              "DELIVERED"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-red-100 text-red-700"
                        }
                      `}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div
      className="
        rounded-2xl
        border
        bg-[var(--color-surface)]
        p-6
        shadow-sm
      "
    >
      <p className="text-sm text-gray-500">
        {title}
      </p>

      <h3 className="mt-3 text-4xl font-bold">
        {value}
      </h3>
    </div>
  );
}