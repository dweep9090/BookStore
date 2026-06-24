import api from "../api/axios";

export const checkoutOrder = async (
  orderId: string
) => {
  const response = await api.post(
    "/payments/checkout",
    {
      orderId,
    }
  );

  return response.data;
};

export const payOrder = async (
  orderId: string
) => {
  const response = await api.post(
    "/payments/success",
    {
      orderId,
    }
  );

  return response.data;
};