import api from "../api/axios";

export const getBookReviews = async (
  bookId: string
) => {
  const response = await api.get(
    `/reviews/book/${bookId}`
  );

  return response.data.reviews;
};

export const createReview = async (
  bookId: string,
  rating: number,
  content: string
) => {
  const response = await api.post(
    "/reviews",
    {
      bookId,
      rating,
      content,
    }
  );

  return response.data;
};

export const deleteReview = async (
  reviewId: string
) => {
  const response = await api.delete(
    `/reviews/${reviewId}`
  );

  return response.data;
};