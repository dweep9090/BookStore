import api from "../api/axios";

export const getDashboardStats =
  async () => {
    const response =
      await api.get("/admin/stats");

    return response.data;
  };

export const getTopRatedBooks =
  async () => {
    const response =
      await api.get(
        "/admin/top-rated-books"
      );

    return response.data.books;
  };

export const getRecentOrders =
  async () => {
    const response =
      await api.get(
        "/admin/recent-orders"
      );

    return response.data.orders;
  };

export const getStockLogs =
  async () => {
    const response =
      await api.get(
        "/admin/stock-logs"
      );

    return response.data.logs;
  };