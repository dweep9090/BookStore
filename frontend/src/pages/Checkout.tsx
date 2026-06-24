import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  getOrderById,
} from "../services/order.service";

import {
  checkoutOrder,
  payOrder,
} from "../services/payment.service";

export default function Checkout() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [order, setOrder] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  const [processing, setProcessing] =
    useState(false);

  useEffect(() => {
    const fetchOrder =
      async () => {
        if (!id) return;

        try {
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

  const handlePayment =
    async () => {
      if (!id) return;

      try {
        setProcessing(true);

        await checkoutOrder(id);

        await payOrder(id);

        navigate("/orders");
      } catch (error) {
        console.error(error);
      } finally {
        setProcessing(false);
      }
    };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <p className="text-lg">
          Loading checkout...
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
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1
        className="mb-8 text-5xl font-bold"
        style={{
          fontFamily:
            "var(--font-serif)",
        }}
      >
        Checkout
      </h1>

      <div
        className="
          rounded-2xl
          border
          border-gray-300
          bg-[var(--color-surface)]
          p-8
          shadow-lg
        "
      >
        <div className="mb-6">
          <p className="text-sm text-gray-500">
            Order ID
          </p>

          <p className="break-all font-medium">
            {order.id}
          </p>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-500">
            Current Status
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
                order.status === "PAID"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }
            `}
          >
            {order.status}
          </span>
        </div>

        <div className="mb-8">
          <p className="text-sm text-gray-500">
            Total Amount
          </p>

          <h2 className="mt-2 text-5xl font-bold text-[var(--color-accent)]">
            ₹{order.totalAmount}
          </h2>
        </div>

        <div
          className="
            mb-8
            rounded-lg
            border
            border-blue-200
            bg-blue-50
            p-4
            text-sm
            text-blue-700
          "
        >
          This is a mock payment gateway
          used for project demonstration.
        </div>

        {order.status !== "PAID" ? (
          <button
            onClick={handlePayment}
            disabled={processing}
            className="
              w-full
              rounded-lg
              bg-green-600
              px-6
              py-4
              text-lg
              font-semibold
              text-white
              transition
              hover:bg-green-700
              disabled:opacity-50
            "
          >
            {processing
              ? "Processing Payment..."
              : `Pay ₹${order.totalAmount}`}
          </button>
        ) : (
          <button
            disabled
            className="
              w-full
              rounded-lg
              bg-gray-400
              px-6
              py-4
              text-lg
              font-semibold
              text-white
            "
          >
            Payment Completed
          </button>
        )}
      </div>
    </div>
  );
}