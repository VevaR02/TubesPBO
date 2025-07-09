import React from "react";
import Slider from "react-slick";

const Carousel = ({ items }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    arrows: true,
  };

  if (!items || items.length === 0) {
    return (
      <div className="w-full h-80 bg-gray-200 flex items-center justify-center rounded-lg">
        <p className="text-gray-500">Memuat Carousel...</p>
      </div>
    );
  }

  return (
    
    <div className="w-full h-80 rounded-lg shadow-md relative">
      <Slider {...settings}>
        {items.map((item) => (
          <div key={item.id} className="relative w-full h-80">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white p-4">
              <h2 className="text-4xl font-bold mb-2">{item.title}</h2>
              <p className="text-xl">{item.subtitle}</p>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Carousel;
