import api from "../api/axios";

export const getCart = async () => {
  const response = await api.get("/cart");

  return response.data.cartItems;
};

export const addToCart = async (
  bookId: string,
  quantity: number = 1
) => {
  const response = await api.post("/cart", {
    bookId,
    quantity,
  });

  return response.data;
};

export const updateCartItem = async (
  itemId: string,
  quantity: number
) => {
  const response = await api.put(
    `/cart/${itemId}`,
    {
      quantity,
    }
  );

  return response.data;
};

export const removeCartItem = async (
  itemId: string
) => {
  const response = await api.delete(
    `/cart/${itemId}`
  );

  return response.data;
};