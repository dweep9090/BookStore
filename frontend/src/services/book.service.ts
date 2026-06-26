import api from "../api/axios";
import type { Book } from "../types/book";

interface BooksResponse {
  success: boolean;
  count: number;
  books: Book[];
}

export const getBooks = async (): Promise<Book[]> => {
  const response = await api.get<BooksResponse>("/books");

  return response.data.books;
};

export const getBookById = async (
  id: string
): Promise<Book> => {
  const response = await api.get(`/books/${id}`);

  return response.data.book;
};

export const deleteBook = async (
  bookId: string
) => {
  const { data } = await api.delete(
    `/books/${bookId}`
  );

  return data;
};

export const updateBook = async (
  bookId: string,
  payload: any
) => {
  const { data } = await api.put(
    `/books/${bookId}`,
    payload
  );

  return data;
};

export const createBook = async (
  payload: any
) => {
  const { data } = await api.post(
    "/books",
    payload
  );

  return data.book;
};

export const generateSummary = async (
  bookId: string
) => {
  const { data } = await api.post(
    `/books/${bookId}/generate-summary`
  );

  return data.aiSummary;
};

export const getRecommendations =
  async (bookId: string) => {
    const { data } =
      await api.get(
        `/books/${bookId}/recommendations`
      );

    return data.recommendations;
  };

interface GenresResponse {
  success: boolean;
  genres: string[];
}

export const getGenres =
  async (): Promise<string[]> => {
    const response =
      await api.get<GenresResponse>(
        "/books/genres"
      );

    return response.data.genres;
  };