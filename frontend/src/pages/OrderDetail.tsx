import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  getOrderById,
} from "../services/order.service";

export default function OrderDetail() {
  const { id } = useParams();

  const [order, setOrder] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const fetchOrder =
      async () => {
        try {
          if (!id) return;

          const data =
            await getOrderById(id);

          setOrder(data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <p className="text-lg">
          Loading order...
        </p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex justify-center py-20">
        <p className="text-lg">
          Order not found
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
        Order Details
      </h1>

      {/* Order Summary */}

      <div
        className="
          mb-10
          rounded-2xl
          border
          bg-[var(--color-surface)]
          p-8
          shadow-sm
        "
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <p className="text-sm text-gray-500">
              Order ID
            </p>

            <p className="break-all font-medium">
              {order.id}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Order Date
            </p>

            <p>
              {new Date(
                order.createdAt
              ).toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Status
            </p>

            <span
              className={`
                inline-block
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

          <div>
            <p className="text-sm text-gray-500">
              Total Amount
            </p>

            <p className="text-4xl font-bold text-[var(--color-accent)]">
              ₹{order.totalAmount}
            </p>
          </div>
        </div>
      </div>

      {/* Items */}

      <h2 className="mb-6 text-3xl font-bold">
        Ordered Books
      </h2>

      <div className="space-y-5">
        {order.items.map(
          (item: any) => (
            <div
              key={item.id}
              className="
                rounded-2xl
                border
                bg-[var(--color-surface)]
                p-6
                shadow-sm
              "
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-xl font-semibold">
                    {item.book.title}
                  </h3>

                  <p className="text-gray-500">
                    {item.book.author}
                  </p>
                </div>

                <div className="text-right">
                  <p>
                    Quantity:
                    {" "}
                    {
                      item.quantity
                    }
                  </p>

                  <p>
                    Price:
                    {" "}
                    ₹
                    {
                      item.price
                    }
                  </p>

                  <p className="mt-2 text-lg font-bold text-[var(--color-accent)]">
                    ₹
                    {item.price *
                      item.quantity}
                  </p>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}