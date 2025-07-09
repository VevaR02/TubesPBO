// Navbar.js

import React, { useState, useEffect, useRef } from "react";
import logo from "../image/logo1.png";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [isAdminDropdownOpen, setAdminDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const isAdmin = user?.roles.includes("ROLE_ADMIN");

  // --- FUNGSI NAVIGASI BARU ---
  const handleAdminNav = (view) => {
    // Navigasi ke halaman admin dengan parameter view
    navigate(`/admin?view=${view}`);
    setAdminDropdownOpen(false); // Selalu tutup dropdown setelah klik
  };

  // Efek untuk menutup dropdown saat URL berubah atau klik di luar area
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setAdminDropdownOpen(false);
      }
    };

    setAdminDropdownOpen(false);

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [location]);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-2">
          {/* ... (bagian logo dan link home/cart tidak berubah) ... */}
          <Link to="/" className="flex items-center space-x-2">
            <img
              src={logo}
              alt="Sevspo Logo"
              style={{ height: "70px", padding: "10px 0" }}
            />
          </Link>
          <div className="flex items-center space-x-4 sm:space-x-6">
            <Link
              to="/"
              className="text-gray-600 hover:text-orange-600 transition"
            >
              Home
            </Link>
            {!isAdmin && (
              <Link
                to="/cart"
                className="text-gray-600 hover:text-orange-600 transition relative"
              >
                Keranjang{" "}
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
            )}

            {user ? (
              <>
                {!isAdmin && (
                  <Link
                    to="/orders"
                    className="text-gray-600 hover:text-orange-600 transition"
                  >
                    Riwayat Pesanan
                  </Link>
                )}

                {isAdmin && (
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setAdminDropdownOpen(!isAdminDropdownOpen)}
                      className="text-gray-600 hover:text-orange-600 transition flex items-center"
                    >
                      Admin
                      <svg
                        className={`w-4 h-4 ml-1 transition-transform ${
                          isAdminDropdownOpen ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    </button>
                    {isAdminDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                        {/* --- UBAH LINK INI --- */}
                        <a
                          onClick={() => handleAdminNav("pesanan")}
                          className="cursor-pointer block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Manajemen Pesanan
                        </a>
                        <a
                          onClick={() => handleAdminNav("kategori")}
                          className="cursor-pointer block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Manajemen Kategori
                        </a>
                        <a
                          onClick={() => handleAdminNav("produk")}
                          className="cursor-pointer block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Manajemen Produk
                        </a>
                        <a
                          onClick={() => handleAdminNav("carousel")}
                          className="cursor-pointer block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Manajemen Carousel
                        </a>
                        <a
                          onClick={() => handleAdminNav("galeri")}
                          className="cursor-pointer block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Manajemen Galeri
                        </a>
                        {/* ------------------- */}
                      </div>
                    )}
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-orange-600 hover:underline transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-orange-600 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-gray-600 hover:text-orange-600 transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
