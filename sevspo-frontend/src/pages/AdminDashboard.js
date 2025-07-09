import React, { useState, useEffect, useRef, useCallback } from "react";
import api from "../services/api";
import { useSearchParams } from "react-router-dom";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import OrderManager from "../components/OrderManager";

function getCroppedImg(image, crop, fileName) {
  const canvas = document.createElement("canvas");
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext("2d");

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          return;
        }
        blob.name = fileName;
        resolve(new File([blob], fileName, { type: "image/jpeg" }));
      },
      "image/jpeg",
      0.95
    );
  });
}

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");

  const fetchCategories = useCallback(async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Gagal memuat kategori:", error);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!categoryName) return;
    try {
      await api.post("/categories", { name: categoryName });
      setCategoryName("");
      fetchCategories();
    } catch (error) {
      alert("Gagal menambah kategori. Mungkin nama sudah ada.");
    }
  };

  const handleDeleteCategory = async (id) => {
    if (
      window.confirm(
        "Menghapus kategori akan melepaskan produk dari kategori ini. Lanjutkan?"
      )
    ) {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Manajemen Kategori</h2>
      <form onSubmit={handleAddCategory} className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Nama Kategori Baru"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-sevspo-dark text-white px-6 py-2 rounded-md"
        >
          Tambah
        </button>
      </form>
      <ul>
        {categories.map((cat) => (
          <li
            key={cat.id}
            className="flex justify-between items-center p-2 border-b"
          >
            <span>{cat.name}</span>
            <button
              onClick={() => handleDeleteCategory(cat.id)}
              className="text-red-600 hover:underline"
            >
              Hapus
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    id: null,
    name: "",
    description: "",
    price: "",
    stock: "",
    category: null,
    imageUrl: "",
  });
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [upImg, setUpImg] = useState(null);
  const imgRef = useRef(null);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const [croppedFile, setCroppedFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  
  const fetchProducts = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("keyword", searchTerm);
      if (selectedCategory) params.append("categoryId", selectedCategory);

      const response = await api.get(`/products?${params.toString()}`);
      setProducts(response.data);
    } catch (error) {
      console.error("Gagal memuat produk:", error);
    }
  }, [searchTerm, selectedCategory]);

  const fetchCategories = useCallback(async () => {
    try {
      const catResponse = await api.get("/categories");
      setCategories(catResponse.data);
    } catch (error) {
      console.error("Gagal memuat kategori:", error);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        setUpImg(reader.result?.toString() || "")
      );
      reader.readAsDataURL(e.target.files[0]);
      setIsCropperOpen(true);
      setCrop({ unit: "%", width: 50, aspect: 1 });
    }
  };

  const handleCropAndSave = async () => {
    if (completedCrop?.width && completedCrop?.height && imgRef.current) {
      const croppedImageFile = await getCroppedImg(
        imgRef.current,
        completedCrop,
        "cropped-product.jpg"
      );
      setCroppedFile(croppedImageFile);
      setIsCropperOpen(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!isEditing && !croppedFile) {
      alert("Silakan pilih dan potong gambar untuk produk baru.");
      return;
    }
    const formData = new FormData();
    const { id, ...productData } = currentProduct;
    const dataToSend = isEditing ? currentProduct : productData;
    formData.append("product", JSON.stringify(dataToSend));
    if (croppedFile) {
      formData.append("file", croppedFile);
    }
    try {
      if (isEditing) {
        await api.put(`/products/${currentProduct.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/products", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error("Gagal menyimpan produk:", error);
      alert("Gagal menyimpan produk.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Anda yakin ingin menghapus produk ini?")) {
      await api.delete(`/products/${id}`);
      fetchProducts();
    }
  };

  const handleEditClick = (product) => {
    setIsEditing(true);
    setCurrentProduct(product);
    window.scrollTo(0, 0);
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentProduct({
      id: null,
      name: "",
      description: "",
      price: "",
      stock: "",
      category: null,
      imageUrl: "",
    });
    setCroppedFile(null);
    setUpImg(null);
    if (document.getElementById("product-file-input")) {
      document.getElementById("product-file-input").value = "";
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name === "category") {
      setCurrentProduct((prev) => ({
        ...prev,
        category: value ? JSON.parse(value) : null,
      }));
    } else {
      setCurrentProduct((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <>
      {isCropperOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-4 rounded-lg max-w-2xl w-full">
            <h3 className="text-lg font-bold mb-2">
              Potong Gambar Produk (1:1)
            </h3>
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={1}
            >
              <img
                ref={imgRef}
                src={upImg}
                alt="Crop preview"
                style={{ maxHeight: "70vh" }}
              />
            </ReactCrop>
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={() => setIsCropperOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Batal
              </button>
              <button
                onClick={handleCropAndSave}
                className="bg-sevspo-dark text-white px-4 py-2 rounded"
              >
                Potong & Simpan
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="bg-white p-8 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4">Manajemen Produk</h2>
        <form onSubmit={handleFormSubmit} className="space-y-4 mb-8">
          <h3 className="text-xl font-medium">
            {isEditing ? "Edit Produk" : "Tambah Produk Baru"}
          </h3>
          <input
            type="text"
            name="name"
            placeholder="Nama Produk"
            value={currentProduct.name}
            onChange={handleFormChange}
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            name="description"
            placeholder="Deskripsi"
            value={currentProduct.description}
            onChange={handleFormChange}
            className="w-full p-2 border rounded"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              step="0.01"
              name="price"
              placeholder="Harga"
              value={currentProduct.price}
              onChange={handleFormChange}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="number"
              name="stock"
              placeholder="Stok"
              value={currentProduct.stock}
              onChange={handleFormChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Kategori
            </label>
            <select
              name="category"
              value={
                currentProduct.category
                  ? JSON.stringify(currentProduct.category)
                  : ""
              }
              onChange={handleFormChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Pilih Kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={JSON.stringify(cat)}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Gambar Produk
            </label>
            <input
              id="product-file-input"
              type="file"
              onChange={onSelectFile}
              className="w-full p-2 border rounded"
              accept="image/*"
            />
            {croppedFile && (
              <p className="text-sm text-green-600 mt-2">
                Gambar baru siap diupload: {croppedFile.name}
              </p>
            )}
            {isEditing && !croppedFile && currentProduct.imageUrl && (
              <img
                src={currentProduct.imageUrl}
                alt="Preview"
                className="mt-2 h-24 w-24 object-cover rounded"
              />
            )}
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              className="w-full bg-sevspo-dark text-white py-2 rounded-md hover:bg-gray-800"
            >
              {isEditing ? "Update Produk" : "Simpan Produk"}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="w-full bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600"
              >
                Batal
              </button>
            )}
          </div>
        </form>
        <h3 className="text-xl font-medium mt-8 mb-4">Daftar Produk</h3>
        {/* PERBAIKAN: Tambahkan filter dan pencarian di sini */}
        <div className="mb-4 flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Cari nama produk..."
            className="w-full sm:w-1/2 p-2 border rounded"
            value={searchTerm}
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
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3">Nama</th>
                <th className="text-left p-3">Kategori</th>
                <th className="text-left p-3">Harga</th>
                <th className="text-left p-3">Stok</th>
                <th className="text-left p-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{p.name}</td>
                  <td className="p-3">
                    {p.category ? p.category.name : "N/A"}
                  </td>
                  <td className="p-3">
                    Rp{new Intl.NumberFormat("id-ID").format(p.price)}
                  </td>
                  <td className="p-3">{p.stock}</td>
                  <td className="p-3 flex gap-4">
                    <button
                      onClick={() => handleEditClick(p)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-red-600 hover:underline"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

const CarouselManager = () => {
  const [items, setItems] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState({
    id: null,
    title: "",
    subtitle: "",
    imageUrl: "",
    isActive: true,
  });
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [upImg, setUpImg] = useState(null);
  const imgRef = useRef(null);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const [croppedFile, setCroppedFile] = useState(null);

  const fetchItems = useCallback(async () => {
    try {
      const response = await api.get("/carousel-items/all");
      setItems(response.data);
    } catch (error) {
      console.error("Gagal memuat item carousel:", error);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        setUpImg(reader.result?.toString() || "")
      );
      reader.readAsDataURL(e.target.files[0]);
      setIsCropperOpen(true);
      setCrop({ unit: "%", width: 50, aspect: 21 / 9 });
    }
  };

  const handleCropAndSave = async () => {
    if (completedCrop?.width && completedCrop?.height && imgRef.current) {
      const croppedImageFile = await getCroppedImg(
        imgRef.current,
        completedCrop,
        "cropped-carousel.jpg"
      );
      setCroppedFile(croppedImageFile);
      setIsCropperOpen(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!isEditing && !croppedFile) {
      alert("Silakan pilih dan potong gambar untuk item carousel baru.");
      return;
    }
    const formData = new FormData();
    const { id, ...itemData } = currentItem;
    const dataToSend = isEditing ? currentItem : itemData;
    formData.append("item", JSON.stringify(dataToSend));
    if (croppedFile) {
      formData.append("file", croppedFile);
    }
    try {
      if (isEditing) {
        await api.put(`/carousel-items/${currentItem.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/carousel-items", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      resetForm();
      fetchItems();
    } catch (error) {
      console.error("Gagal menyimpan item carousel:", error);
      alert("Gagal menyimpan item carousel.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Anda yakin ingin menghapus item carousel ini?")) {
      await api.delete(`/carousel-items/${id}`);
      fetchItems();
    }
  };

  const handleEditClick = (item) => {
    setIsEditing(true);
    setCurrentItem(item);
    window.scrollTo(0, document.body.scrollHeight);
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentItem({
      id: null,
      title: "",
      subtitle: "",
      imageUrl: "",
      isActive: true,
    });
    setCroppedFile(null);
    setUpImg(null);
    if (document.getElementById("carousel-file-input")) {
      document.getElementById("carousel-file-input").value = "";
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentItem((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <>
      {isCropperOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-4 rounded-lg max-w-4xl w-full">
            <h3 className="text-lg font-bold mb-2">
              Potong Gambar Carousel (21:9)
            </h3>
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={21 / 9}
            >
              <img
                ref={imgRef}
                src={upImg}
                alt="Crop preview"
                style={{ maxHeight: "70vh" }}
              />
            </ReactCrop>
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={() => setIsCropperOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Batal
              </button>
              <button
                onClick={handleCropAndSave}
                className="bg-sevspo-dark text-white px-4 py-2 rounded"
              >
                Potong & Simpan
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Manajemen Carousel</h2>
        <form onSubmit={handleFormSubmit} className="space-y-4 mb-8">
          <h3 className="text-xl font-medium">
            {isEditing ? "Edit Item Carousel" : "Tambah Item Carousel Baru"}
          </h3>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Gambar Carousel (21:9)
            </label>
            <input
              id="carousel-file-input"
              type="file"
              onChange={onSelectFile}
              className="w-full p-2 border rounded"
              accept="image/*"
            />
            {croppedFile && (
              <p className="text-sm text-green-600 mt-2">
                Gambar baru siap diupload: {croppedFile.name}
              </p>
            )}
            {isEditing && !croppedFile && currentItem.imageUrl && (
              <img
                src={currentItem.imageUrl}
                alt="Preview"
                className="mt-2 h-24 object-contain"
              />
            )}
          </div>
          <input
            type="text"
            name="title"
            placeholder="Judul Teks"
            value={currentItem.title}
            onChange={handleFormChange}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="subtitle"
            placeholder="Sub-judul Teks"
            value={currentItem.subtitle}
            onChange={handleFormChange}
            className="w-full p-2 border rounded"
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isActive"
              checked={currentItem.active}
              onChange={handleFormChange}
            />{" "}
            Aktifkan
          </label>
          <div className="flex gap-4">
            <button
              type="submit"
              className="w-full bg-sevspo-dark text-white py-2 rounded-md hover:bg-gray-800"
            >
              {isEditing ? "Update Item" : "Simpan Item"}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="w-full bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600"
              >
                Batal
              </button>
            )}
          </div>
        </form>

        <h3 className="text-xl font-medium mt-8 mb-4">Daftar Item Carousel</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3">Judul</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{item.title}</td>
                  <td className="p-3">
                    {item.isActive ? "Aktif" : "Non-Aktif"}
                  </td>
                  <td className="p-3 flex gap-4">
                    <button
                      onClick={() => handleEditClick(item)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:underline"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

const GalleryManager = () => {
  const [images, setImages] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentImage, setCurrentImage] = useState({ id: null, caption: "" });
  const [newImageFile, setNewImageFile] = useState(null);
  const [newImageCaption, setNewImageCaption] = useState("");

  const fetchImages = useCallback(async () => {
    try {
      const response = await api.get("/gallery-images");
      setImages(response.data);
    } catch (error) {
      console.error("Gagal memuat gambar galeri:", error);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setNewImageFile(e.target.files[0]);
    }
  };

  const handleAddImage = async (e) => {
    e.preventDefault();
    if (!newImageFile || !newImageCaption) {
      alert("Silakan pilih file gambar dan isi caption.");
      return;
    }
    const formData = new FormData();
    formData.append("file", newImageFile);
    formData.append("caption", newImageCaption);

    try {
      await api.post("/gallery-images", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setNewImageFile(null);
      setNewImageCaption("");
      document.getElementById("gallery-file-input").value = ""; 
      fetchImages();
    } catch (error) {
      console.error("Gagal menambah gambar:", error);
      alert("Gagal menambah gambar baru.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Anda yakin ingin menghapus gambar ini dari galeri?")) {
      try {
        await api.delete(`/gallery-images/${id}`);
        fetchImages();
      } catch (error) {
        console.error("Gagal menghapus gambar:", error);
        alert("Gagal menghapus gambar.");
      }
    }
  };

  const handleEditClick = (image) => {
    setIsEditing(true);
    setCurrentImage({ id: image.id, caption: image.caption });
  };

  const handleUpdateCaption = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/gallery-images/${currentImage.id}`, {
        caption: currentImage.caption,
      });
      setIsEditing(false);
      setCurrentImage({ id: null, caption: "" });
      fetchImages();
    } catch (error) {
      console.error("Gagal mengupdate caption:", error);
      alert("Gagal mengupdate caption.");
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Manajemen Galeri</h2>

      
      <form onSubmit={handleAddImage} className="space-y-4 mb-8 border-b pb-8">
        <h3 className="text-xl font-medium">Tambah Gambar ke Galeri</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            File Gambar
          </label>
          <input
            id="gallery-file-input"
            type="file"
            onChange={handleFileChange}
            className="w-full p-2 border rounded"
            accept="image/*"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Caption
          </label>
          <input
            type="text"
            placeholder="Caption untuk gambar"
            value={newImageCaption}
            onChange={(e) => setNewImageCaption(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-sevspo-dark text-white py-2 rounded-md hover:bg-gray-800"
        >
          Upload Gambar
        </button>
      </form>

     
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <form
            onSubmit={handleUpdateCaption}
            className="bg-white p-6 rounded-lg shadow-xl w-1/3"
          >
            <h3 className="text-lg font-bold mb-4">Edit Caption</h3>
            <input
              type="text"
              value={currentImage.caption}
              onChange={(e) =>
                setCurrentImage({ ...currentImage, caption: e.target.value })
              }
              className="w-full p-2 border rounded mb-4"
            />
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Batal
              </button>
              <button
                type="submit"
                className="bg-sevspo-dark text-white px-4 py-2 rounded"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      )}

     
      <h3 className="text-xl font-medium mt-8 mb-4">Daftar Gambar</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((img) => (
          <div
            key={img.id}
            className="relative group border rounded-lg overflow-hidden"
          >
            <img
              src={img.imageUrl}
              alt={img.caption}
              className="w-full h-auto"
            />
            <div className="p-2">
              <p className="text-sm truncate">{img.caption}</p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleEditClick(img)}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(img.id)}
                  className="text-xs text-red-600 hover:underline"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  
  const [searchParams] = useSearchParams();
 
  const activeView = searchParams.get("view") || "pesanan";
  const renderActiveView = () => {
    switch (activeView) {
      case "kategori":
        return <CategoryManager />;
      case "produk":
        return <ProductManager />;
      case "carousel":
        return <CarouselManager />;
      case "galeri":
        return <GalleryManager />;
      case "pesanan":
      default:
        return <OrderManager />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="space-y-8">{renderActiveView()}</div>
      {}
    </div>
  );
}
