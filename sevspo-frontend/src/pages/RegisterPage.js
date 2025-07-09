import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthService from "../services/auth.service";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await AuthService.register(username, email, password);
      setSuccess("Registrasi berhasil! Anda akan dialihkan ke halaman login.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      // PERBAIKAN: Mengambil pesan error yang spesifik dari backend
      const resMessage =
        (err.response && err.response.data) || err.message || err.toString();
      // Jika resMessage masih berupa objek, ambil properti message-nya
      setError(
        typeof resMessage === "object" ? resMessage.message : resMessage
      );
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-center text-sevspo-dark">
        Daftar Akun Baru
      </h2>
      {/* Tampilkan pesan error atau sukses */}
      {error && (
        <div
          className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg"
          role="alert"
        >
          {error}
        </div>
      )}
      {success && (
        <div
          className="p-3 mb-4 text-sm text-green-700 bg-green-100 rounded-lg"
          role="alert"
        >
          {success}
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-6">
        <div>
          {" "}
          <label className="block text-sm font-medium text-gray-700">
            Username
          </label>{" "}
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="px-2 block w-full h-10 rounded-md border-gray-300  shadow-md"
            required
          />{" "}
        </div>
        <div>
          {" "}
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>{" "}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-2 block w-full h-10 rounded-md border-gray-300  shadow-md"
            required
          />{" "}
        </div>
        <div>
          {" "}
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>{" "}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-2 block w-full h-10 rounded-md border-gray-300  shadow-md"
            required
          />{" "}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-600 text-white py-2 rounded-lg disabled:bg-gray-400 hover:bg-orange-700 transition"
        >
          {loading ? "Memproses..." : "Daftar"}
        </button>
      </form>
      <p className="text-center mt-4 text-sm">
        Sudah punya akun?{" "}
        <Link to="/login" className="text-orange-600 hover:underline">
          Login di sini
        </Link>
      </p>
    </div>
  );
}
