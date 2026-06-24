import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BookDetail from "./pages/BookDetail";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import AdminDashboard from "./pages/AdminDashboard";
import AdminOrders from "./pages/AdminOrders";
import AdminBooks from "./pages/AdminBooks";
import AdminEditBook from "./pages/AdminEditBook";
import AdminStockLogs from "./pages/AdminStockLogs";
import AdminCreateBook from "./pages/AdminCreateBook";
import AdminRoute from "./components/AdminRoute";
import { SearchProvider } from "./context/SearchContext";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SearchProvider>
        <CartProvider>
          <Navbar />
          <Toaster position="top-right" />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/books/:id" element={<BookDetail />}/>
            <Route path="/wishlist" element={<Wishlist />}/>
            <Route path="/cart" element={<Cart />}/>
            <Route path="/checkout/:id" element={<Checkout />}/>
            <Route path="/orders" element={<Orders />}/>
            <Route path="/orders/:id" element={<OrderDetail />}/>
            <Route
  path="/admin"
  element={
    <AdminRoute>
      <AdminDashboard />
    </AdminRoute>
  }
/>

<Route
  path="/admin/books"
  element={
    <AdminRoute>
      <AdminBooks />
    </AdminRoute>
  }
/>

<Route
  path="/admin/orders"
  element={
    <AdminRoute>
      <AdminOrders />
    </AdminRoute>
  }
/>

<Route
  path="/admin/stock-logs"
  element={
    <AdminRoute>
      <AdminStockLogs />
    </AdminRoute>
  }
/>

<Route
  path="/admin/books/:id"
  element={
    <AdminRoute>
      <AdminEditBook />
    </AdminRoute>
  }
/>

<Route path="/admin/books/new" element={ <AdminRoute> <AdminCreateBook /> </AdminRoute>}/>
          </Routes>
        </CartProvider>
        </SearchProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}