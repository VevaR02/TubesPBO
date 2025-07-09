// CartPage.js

import React from "react"; // Hapus useState
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function CartPage() {
  // --- DAPATKAN FUNGSI BARU DARI useCart ---
  const { cartItems, removeFromCart, updateCartItemQty } = useCart();
  // ----------------------------------------
  const { user } = useAuth();
  const navigate = useNavigate();

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.qty * item.price,
    0
  );

  const handleCheckout = () => {
    if (!user) {
      navigate("/login", { state: { from: "/checkout" } });
    } else {
      navigate("/checkout");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Keranjang Belanja</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg shadow-lg">
          <p>Keranjang Anda kosong.</p>
          <Link
            to="/"
            className="text-orange-600 mt-2 inline-block hover:underline"
          >
            Mulai belanja
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {/* --- MODIFIKASI TAMPILAN ITEM DI SINI --- */}
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center bg-white p-4 rounded-lg shadow"
              >
                <img
                  src={
                    item.imageUrl ||
                    `https://placehold.co/100x100/e2e8f0/1a1a1a?text=img`
                  }
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded mr-4"
                />
                <div className="flex-grow">
                  <h2 className="font-semibold">{item.name}</h2>
                  <p className="text-sm text-gray-600">
                    Rp{new Intl.NumberFormat("id-ID").format(item.price)}
                  </p>
                  {/* Kontrol Kuantitas */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateCartItemQty(item.id, item.qty - 1)}
                      className="w-7 h-7 bg-gray-200 rounded-full font-bold text-lg flex items-center justify-center hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span className="font-semibold px-2">{item.qty}</span>
                    <button
                      onClick={() => updateCartItemQty(item.id, item.qty + 1)}
                      className="w-7 h-7 bg-gray-200 rounded-full font-bold text-lg flex items-center justify-center hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold mr-4">
                    Rp
                    {new Intl.NumberFormat("id-ID").format(
                      item.price * item.qty
                    )}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700 font-bold text-xl mt-2"
                  >
                    &times;
                  </button>
                </div>
              </div>
            ))}
            {/* ------------------------------------------- */}
          </div>
          {cartItems.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow self-start">
              <h2 className="text-xl font-semibold mb-4">Ringkasan Pesanan</h2>
              <div className="flex justify-between mb-4">
                <span>Subtotal</span>
                <span className="font-bold">
                  Rp{new Intl.NumberFormat("id-ID").format(totalPrice)}
                </span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full bg-sevspo-dark text-white py-2 mt-4 rounded-md"
              >
                Lanjutkan ke Checkout
              </button>
              {!user && (
                <p className="text-xs text-center mt-2">
                  Anda harus{" "}
                  <Link to="/login" className="underline">
                    login
                  </Link>{" "}
                  untuk checkout.
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
