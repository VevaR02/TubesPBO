import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const placeholderImage = `https://placehold.co/600x600/e2e8f0/1a1a1a?text=${encodeURIComponent(
    product.name
  )}`;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden group transition-transform duration-300 ease-in-out hover:-translate-y-2">
      <Link to={`/product/${product.id}`}>
        <div className="w-full h-auto overflow-hidden">
          <img
            src={product.imageUrl || placeholderImage}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-90"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = placeholderImage;
            }}
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-sevspo-dark truncate">
            {product.name}
          </h3>
          <p className="text-gray-500 text-sm mt-1">
            {product.category ? product.category.name : "Uncategorized"}
          </p>
          <p className="text-xl font-bold text-sevspo-dark mt-2">
            Rp{new Intl.NumberFormat("id-ID").format(product.price)}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
