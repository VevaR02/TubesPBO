import React, { useState, useEffect } from "react";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import Carousel from "../components/Carousel";
import Gallery from "../components/Gallery"; 

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [carouselItems, setCarouselItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]); 
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

 
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchTerm) params.append("keyword", searchTerm);
        if (selectedCategory) params.append("categoryId", selectedCategory);

        const response = await api.get(`/products?${params.toString()}`);
        setProducts(response.data);
      } catch (err) {
        setError("Gagal memuat produk.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchTerm, selectedCategory]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
       
        const [carouselResponse, categoriesResponse, galleryResponse] =
          await Promise.all([
            api.get("/carousel-items"),
            api.get("/categories"),
            api.get("/gallery-images"), 
          ]);

        setCarouselItems(carouselResponse.data);
        setCategories(categoriesResponse.data);
        setGalleryImages(galleryResponse.data); 
      } catch (err) {
       
        setError("Gagal memuat data halaman awal.");
        console.error(err); 
      }
    };
    fetchInitialData();
  }, []); 

  const heroData = carouselItems.length > 0 ? carouselItems[0] : {};

  return (
    <div className="container mx-auto px-4">
      <div className="relative text-center mb-16 h-80 flex flex-col justify-center items-center rounded-lg overflow-hidden shadow-lg">
        <Carousel items={carouselItems} />
      </div>

     
      <div className="mb-8 p-4 bg-white rounded-lg shadow-md flex flex-col sm:flex-row gap-4 items-center">
        <input
          type="text"
          placeholder="Cari nama produk..."
          className="w-full sm:w-1/2 p-2 border rounded"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="w-full sm:w-1/2 p-2 border rounded"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Semua Kategori</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-sevspo-dark">Koleksi Produk</h2>
      </div>
      {loading && <div className="text-center py-10">Memuat...</div>}
      {error && <div className="text-center py-10 text-red-500">{error}</div>}
      {!loading && !error && products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        !loading && (
          <div className="text-center py-10 text-gray-500">
            Produk tidak ditemukan.
          </div>
        )
      )}
     
      <div className="mt-16">
        {" "}
       
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-sevspo-dark">
            Galeri Poster Produk
          </h2>
        </div>
        <Gallery images={galleryImages} />
      </div>
    </div>
  );
};

export default HomePage;
