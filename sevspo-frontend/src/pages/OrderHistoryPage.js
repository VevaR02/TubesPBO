import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const response = await api.get("/orders");
        setOrders(response.data);
      } catch (err) {
        setError("Gagal memuat riwayat pesanan.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  const getStatusClass = (status) => {
    switch (status) {
      case "PAID":
      case "PROCESSING":
        return "bg-blue-100 text-blue-800";
      case "SHIPPED":
        return "bg-yellow-100 text-yellow-800";
      case "DELIVERED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default: // PENDING
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading)
    return <div className="text-center py-20">Memuat riwayat pesanan...</div>;
  if (error)
    return <div className="text-center py-20 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">
        Riwayat Pesanan Saya
      </h1>
      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-semibold">Order #{order.id}</h2>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                Tanggal: {new Date(order.orderDate).toLocaleDateString("id-ID")}
              </p>
              <p className="text-lg font-bold mt-2">
                Total: Rp
                {new Intl.NumberFormat("id-ID").format(order.totalAmount)}
              </p>
              <div className="mt-2 border-t pt-2">
                <h3 className="font-semibold text-sm">Produk:</h3>
                <ul className="list-disc list-inside text-sm text-gray-600">
                  {order.items.map((item) => (
                    <li key={item.id}>
                      {item.product.name} (x{item.quantity})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">
          Anda belum memiliki riwayat pesanan.
        </p>
      )}
    </div>
  );
};

export default OrderHistoryPage;
