import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home/homePage";
import LoginPage from "../pages/Auth/LoginPage";
import RegisterPage from "../pages/Auth/RegisterPage";
import ProductsListPage from "../pages/Products/ProductsListPage";
import ProductDetailPage from "../pages/Products/ProductDetailPage";
import CartPage from "../pages/Cart/CartPage";
import CheckoutPage from "../pages/Checkout/CheckoutPage";
import OrdersPage from "../pages/Orders/OrdersPage";
import OrderDetailPage from "../pages/Orders/OrderDetailPage";
import ShippingOrdersPage from "../pages/Orders/ShippingOrdersPage";
import UserProfilePage from "../pages/Profile/UserProfilePage";
import AdminHomePage from "../pages/Admin/AdminHomePage";
import AdminDashboardPage from "../pages/Admin/AdminDashboardPage";
import AdminProductsPage from "../pages/Admin/AdminProductsPage";
import AdminOrdersPage from "../pages/Admin/AdminOrdersPage";
import AdminUsersPage from "../pages/Admin/AdminUsersPage";
import ProtectedRoute from "../components/ProtectedRoute";
import AdminRoute from "../components/AdminRoute";
import Layout from "../components/Layout";

export default function AppRouter() {
  return (
    <Routes>
        {/* Home page */}
        <Route path="/" element={<Home />} />
        
        {/* Auth Pages */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Admin Routes - Only for admins */}
        <Route path="/admin" element={<AdminRoute><Layout><AdminHomePage /></Layout></AdminRoute>} />
        <Route path="/admin/dashboard" element={<AdminRoute><Layout><AdminDashboardPage /></Layout></AdminRoute>} />
        <Route path="/admin/products" element={<AdminRoute><Layout><AdminProductsPage /></Layout></AdminRoute>} />
        <Route path="/admin/orders" element={<AdminRoute><Layout><AdminOrdersPage /></Layout></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><Layout><AdminUsersPage /></Layout></AdminRoute>} />

        {/* User Profile - Protected Route */}
        <Route path="/profile" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />

        {/* Products Pages */}
        <Route path="/products" element={<ProductsListPage />} />
        <Route path="/products/:id" element={<Layout><ProductDetailPage /></Layout>} />

        {/* Cart & Checkout - Protected Routes */}
        <Route path="/cart" element={<ProtectedRoute><Layout><CartPage /></Layout></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Layout><CheckoutPage /></Layout></ProtectedRoute>} />

        {/* Orders Pages - Protected Routes */}
        <Route path="/orders" element={<ProtectedRoute><Layout><OrdersPage /></Layout></ProtectedRoute>} />
        <Route path="/orders/shipping" element={<ProtectedRoute><Layout><ShippingOrdersPage /></Layout></ProtectedRoute>} />
        <Route path="/orders/:id" element={<ProtectedRoute><Layout><OrderDetailPage /></Layout></ProtectedRoute>} />
    </Routes>
  );
}
