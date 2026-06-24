import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getOrders,
} from "../services/order.service";

export default function Orders() {
  const [orders, setOrders] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const fetchOrders =
      async () => {
        try {
          const data =
            await getOrders();

          setOrders(data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <p className="text-lg">
          Loading orders...
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1
        className="mb-8 text-5xl font-bold"
        style={{
          fontFamily:
            "var(--font-serif)",
        }}
      >
        My Orders
      </h1>

      {orders.length === 0 ? (
        <div
          className="
            rounded-2xl
            border
            p-12
            text-center
          "
        >
          <h2 className="text-2xl font-semibold">
            No Orders Yet
          </h2>

          <p className="mt-2 text-gray-500">
            Browse books and place
            your first order.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map(
            (order) => (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                className="
                  block
                  rounded-2xl
                  border
                  bg-[var(--color-surface)]
                  p-6
                  shadow-sm
                  transition
                  hover:shadow-lg
                "
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm text-gray-500">
                      Order ID
                    </p>

                    <p className="font-medium">
                      {order.id}
                    </p>

                    <p className="mt-2 text-sm text-gray-500">
                      {new Date(
                        order.createdAt
                      ).toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <span
                      className={`
                        rounded-full
                        px-4
                        py-2
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
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      Total
                    </p>

                    <p className="text-3xl font-bold text-[var(--color-accent)]">
                      ₹
                      {
                        order.totalAmount
                      }
                    </p>
                  </div>

                  <div className="text-gray-400">
                    →
                  </div>
                </div>
              </Link>
            )
          )}
        </div>
      )}
    </div>
  );
}