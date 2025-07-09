import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";

const PaymentStatusPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState("processing");
  const [message, setMessage] = useState("Memproses pembayaran Anda...");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const orderId = params.get("order_id");
    const transactionStatus = "settlement"; // Kita simulasikan selalu berhasil

    const processPayment = async () => {
      try {
        // Simulasikan panggilan webhook dari payment gateway ke backend kita
        await api.post("/payments/notification", {
          order_id: orderId,
          transaction_status: transactionStatus,
        });

        setStatus("success");
        setMessage("Pembayaran berhasil! Pesanan Anda sedang diproses.");

        // Alihkan ke riwayat pesanan setelah beberapa detik
        setTimeout(() => {
          navigate("/orders");
        }, 3000);
      } catch (error) {
        setStatus("failed");
        setMessage("Terjadi kesalahan saat memproses pembayaran.");
      }
    };

    if (orderId) {
      processPayment();
    } else {
      setStatus("failed");
      setMessage("Informasi pesanan tidak valid.");
    }
  }, [location, navigate]);

  return (
    <div className="container mx-auto px-4 py-20 text-center">
      {status === "processing" && <div className="text-2xl">...</div>}
      {status === "success" && (
        <div className="text-2xl text-green-600">✅</div>
      )}
      {status === "failed" && <div className="text-2xl text-red-600">❌</div>}
      <h1 className="text-3xl font-bold mt-4">{message}</h1>
      {status === "success" && (
        <p className="text-gray-600">
          Anda akan dialihkan ke halaman riwayat pesanan.
        </p>
      )}
    </div>
  );
};

export default PaymentStatusPage;
