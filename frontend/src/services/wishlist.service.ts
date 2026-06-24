import api from "../api/axios";

export const getWishlist = async () => {
  const response = await api.get("/wishlist");

  return response.data.wishlist;
};

export const addToWishlist = async (
  bookId: string
) => {
  const response = await api.post(
    "/wishlist",
    {
      bookId,
    }
  );

  return response.data;
};

export const removeFromWishlist = async (
  bookId: string
) => {
  const response = await api.delete(
    `/wishlist/${bookId}`
  );

  return response.data;
};