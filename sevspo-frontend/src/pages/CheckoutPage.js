import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const CheckoutPage = () => {
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [shippingAddress, setShippingAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const handlePlaceOrder = async () => {
    if (!shippingAddress) {
      setError("Alamat pengiriman harus diisi.");
      return;
    }
    if (!user) {
      setError("Anda harus login untuk membuat pesanan.");
      navigate("/login");
      return;
    }

    setIsLoading(true);
    setError("");

    const orderRequest = {
      shippingAddress: shippingAddress,
      items: cartItems.map((item) => ({
        productId: item.id,
        quantity: item.qty,
      })),
    };

    try {
      // 1. Buat pesanan di sistem kita
      const orderResponse = await api.post("/orders", orderRequest);
      const newOrder = orderResponse.data;

      // 2. Kosongkan keranjang belanja
      clearCart();

      // 3. Buat transaksi di payment gateway (simulasi)
      const paymentResponse = await api.post("/payments/create-transaction", {
        orderId: newOrder.id,
      });
      const { paymentUrl } = paymentResponse.data;

      // 4. Alihkan pengguna ke halaman pembayaran
      window.location.href = paymentUrl;
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Gagal membuat pesanan. Stok mungkin tidak mencukupi."
      );
      setIsLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold">Keranjang Anda Kosong</h1>
        <p className="text-gray-600 mt-2">
          Silakan tambahkan produk ke keranjang sebelum checkout.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Checkout</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Rincian Pesanan */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Ringkasan Pesanan</h2>
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center border-b py-2"
            >
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-500">Jumlah: {item.qty}</p>
              </div>
              <p>
                Rp{new Intl.NumberFormat("id-ID").format(item.price * item.qty)}
              </p>
            </div>
          ))}
          <div className="flex justify-between font-bold text-xl mt-4">
            <span>Total</span>
            <span>Rp{new Intl.NumberFormat("id-ID").format(totalAmount)}</span>
          </div>
        </div>

        {/* Alamat Pengiriman & Tombol Aksi */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Informasi Pengiriman</h2>
          <textarea
            className="w-full p-2 border rounded"
            rows="4"
            placeholder="Masukkan alamat lengkap Anda di sini..."
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
          ></textarea>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          <button
            onClick={handlePlaceOrder}
            disabled={isLoading}
            className="w-full bg-orange-600 text-white py-3 mt-4 rounded-md hover:bg-orange-700 transition disabled:bg-gray-400"
          >
            {isLoading ? "Memproses..." : "Lanjutkan ke Pembayaran"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
