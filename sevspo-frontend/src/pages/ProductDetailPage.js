import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../context/CartContext";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        setError("Produk tidak ditemukan.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product);
    navigate("/cart");
  };

  if (loading) return <div className="text-center py-20">Memuat...</div>;
  if (error)
    return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!product) return null;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <div>
          <img
            src={
              product.imageUrl ||
              `https://placehold.co/800x800/e2e8f0/1a1a1a?text=${product.name}`
            }
            alt={product.name}
            className="w-full h-auto object-cover rounded-lg shadow-lg"
          />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-sevspo-dark mb-2">
            {product.name}
          </h1>
          <p className="text-gray-500 text-lg mb-4">
            {product.category ? product.category.name : "Uncategorized"}
          </p>
          <p className="text-3xl font-bold text-sevspo-dark mb-6">
            Rp{new Intl.NumberFormat("id-ID").format(product.price)}
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            {product.description}
          </p>
          <p className="text-md text-gray-600 mb-6">Stok: {product.stock}</p>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full bg-orange-600 text-white py-3 px-6 rounded-md hover:bg-orange-700 transition disabled:bg-gray-400"
          >
            {product.stock > 0 ? "Tambah ke Keranjang" : "Stok Habis"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
