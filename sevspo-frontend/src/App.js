import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";


import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import ProductDetailPage from "./pages/ProductDetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminDashboard from "./pages/AdminDashboard";
import CartPage from "./pages/CartPage";


import CheckoutPage from "./pages/CheckoutPage";
import PaymentStatusPage from "./pages/PaymentStatusPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";


function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-sevspo-light text-sevspo-dark font-sans">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/orders" element={<OrderHistoryPage />} />
                <Route path="/payment/status" element={<PaymentStatusPage />} />
                {}
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
export default App;
