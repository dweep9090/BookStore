import api from "../api/axios";

export const createOrder = async () => {
  const response = await api.post("/orders");

  return response.data.order;
};

export const getOrders = async () => {
  const response = await api.get("/orders");

  return response.data.orders;
};

export const getOrderById = async (
  orderId: string
) => {
  const response = await api.get(
    `/orders/${orderId}`
  );

  return response.data.order;
};

export const getRecentOrdersAdmin =
  async () => {
    const { data } =
      await api.get(
        "/admin/recent-orders"
      );

    return data.orders;
  };

export const updateOrderStatus =
  async (
    orderId: string,
    status: string
  ) => {
    const { data } =
      await api.patch(
        `/orders/${orderId}/status`,
        {
          status,
        }
      );

    return data.order;
  };