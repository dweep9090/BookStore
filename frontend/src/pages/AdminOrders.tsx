import { useEffect, useState } from "react";

import {
  getRecentOrdersAdmin,
  updateOrderStatus,
} from "../services/order.service";

export default function AdminOrders() {
  const [orders, setOrders] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const fetchOrders =
    async () => {
      try {
        const data =
          await getRecentOrdersAdmin();

        setOrders(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange =
    async (
      orderId: string,
      status: string
    ) => {
      try {
        await updateOrderStatus(
          orderId,
          status
        );

        fetchOrders();
      } catch (error) {
        console.error(error);

        alert(
          "Failed to update status"
        );
      }
    };

  if (loading) {
    return (
      <div className="p-8">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <h1 className="mb-8 text-4xl font-bold">
        Manage Orders
      </h1>

      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead>
            <tr>
              <th className="border p-3">
                Customer
              </th>

              <th className="border p-3">
                Amount
              </th>

              <th className="border p-3">
                Status
              </th>

              <th className="border p-3">
                Update
              </th>
            </tr>
          </thead>

          <tbody>
            {orders.map(
              (order) => (
                <tr key={order.id}>
                  <td className="border p-3">
                    {
                      order.user
                        .name
                    }
                  </td>

                  <td className="border p-3">
                    ₹
                    {
                      order.totalAmount
                    }
                  </td>

                  <td className="border p-3">
                    {
                      order.status
                    }
                  </td>

                  <td className="border p-3">
                    <select
                      value={
                        order.status
                      }
                      onChange={(
                        e
                      ) =>
                        handleStatusChange(
                          order.id,
                          e.target
                            .value
                        )
                      }
                      className="
                        rounded-lg
                        border
                        p-2
                      "
                    >
                      <option value="PENDING">
                        PENDING
                      </option>

                      <option value="PAID">
                        PAID
                      </option>

                      <option value="SHIPPED">
                        SHIPPED
                      </option>

                      <option value="DELIVERED">
                        DELIVERED
                      </option>

                      <option value="FAILED">
                        FAILED
                      </option>

                      <option value="CANCELLED">
                        CANCELLED
                      </option>
                    </select>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}