import React, { useState } from "react";

const Gallery = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  if (!images || images.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        Galeri masih kosong.
      </div>
    );
  }

  return (
    <>
      {/* Modal Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage.imageUrl}
            alt={selectedImage.caption}
            className="max-w-full max-h-full rounded-lg"
          />
          <p className="absolute bottom-10 text-white text-lg bg-black bg-opacity-50 px-4 py-2 rounded-md">
            {selectedImage.caption}
          </p>
        </div>
      )}

      {/* Grid Galeri */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((image) => (
          <div
            key={image.id}
            className="group relative cursor-pointer"
            onClick={() => setSelectedImage(image)}
          >
            <img
              src={image.imageUrl}
              alt={image.caption}
              className="w-full h-auto  rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-end p-4 rounded-lg">
              <p className="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {image.caption}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Gallery;
