import React, { useState, useEffect, useCallback } from "react";
import api from "../services/api";

const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/orders/admin");
      setOrders(response.data);
    } catch (err) {
      setError("Gagal memuat pesanan.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/admin/${orderId}/status`, { status: newStatus });
      fetchOrders();
    } catch (error) {
      alert("Gagal memperbarui status pesanan.");
    }
  };

  const orderStatuses = [
    "PENDING",
    "PAID",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ];

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Manajemen Pesanan</h2>
      {loading && <p>Memuat pesanan...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3">Order ID</th>
              <th className="text-left p-3">Pengguna</th>
              <th className="text-left p-3">Total</th>
              <th className="text-left p-3">Tanggal</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t hover:bg-gray-50">
                <td className="p-3">#{order.id}</td>
                <td className="p-3">{order.user.username}</td>
                <td className="p-3">
                  Rp{new Intl.NumberFormat("id-ID").format(order.totalAmount)}
                </td>
                <td className="p-3">
                  {new Date(order.orderDate).toLocaleDateString("id-ID")}
                </td>
                <td className="p-3">{order.status}</td>
                <td className="p-3">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value)
                    }
                    className="p-1 border rounded"
                  >
                    {orderStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManager;
