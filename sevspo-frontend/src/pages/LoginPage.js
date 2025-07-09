import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username, password);
      navigate("/");
    } catch (err) {
      // PERBAIKAN: Mengambil pesan error yang spesifik dari backend
      const errorMessage =
        (err.response && err.response.data && err.response.data.message) ||
        "Login gagal. Periksa kembali username dan password Anda.";
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-center text-sevspo-dark">
        Login
      </h2>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="px-2 block w-full h-10 rounded-md border-gray-300  shadow-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-2 block w-full h-10 rounded-md border-gray-300  shadow-md"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-600 text-white py-2 rounded-lg disabled:bg-gray-400 hover:bg-orange-700 transition"
        >
          {loading ? "Memproses..." : "Login"}
        </button>
      </form>
      <p className="text-center mt-4 text-sm">
        Belum punya akun?{" "}
        <Link to="/register" className="text-orange-600 hover:underline">
          Daftar di sini
        </Link>
      </p>
    </div>
  );
}
