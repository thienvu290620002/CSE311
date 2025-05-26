import React, { useState } from "react";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

const AboutUS = () => {
  const [showModal, setShowModal] = useState(false);

  const handlePlayClick = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div>
      <main>
        <section className="relative">
          <img src="./images/img_product_list_banner.webp" alt="" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <h2 className="text-4xl font-semibold">About Us</h2>
            <ul className="flex items-center gap-3 justify-center mt-2">
              <li>
                <Link to="/">Home / </Link>
              </li>
              <li>
                <Link to="#">About Us</Link>
              </li>
            </ul>
          </div>
        </section>

        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-screen-xl mx-auto flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-1/2">
              <img
                src="./images/about-1.jpg"
                alt="About Us"
                className="w-full h-auto object-cover rounded-lg shadow-lg transition-transform duration-500 hover:scale-105"
              />
            </div>
            <div className="w-full lg:w-1/2 flex flex-col justify-center text-center lg:text-left">
              <h3 className="text-4xl font-bold text-gray-800 mb-4 leading-snug">
                Comfort and Style:
              </h3>
              <h3 className="text-4xl font-bold text-gray-800 mb-4 leading-snug">
                The Art of Interior Decor
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Familiar furniture unexpectedly accumulates dust in the house.
                Choosing and using suitable furniture is of great significance
                in reducing the amount of dust accumulated, creating a clean and
                comfortable living space. Our collection is curated to offer the
                perfect balance between aesthetics and function.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                Whether you're looking to enhance your home with elegant designs
                or to add a cozy touch to your living room, we have a wide range
                of styles that cater to different tastes and preferences.
                Discover the art of interior decoration with us and create a
                space that reflects your unique style.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-white">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">
            Our Team
          </h2>
          <div className="max-w-screen-xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="flex flex-col items-center text-center">
              <div className="w-75 h-70 mb-4 overflow-hidden rounded-lg shadow-lg transition-transform duration-500 hover:scale-105">
                <img
                  src="./images/ourteam-1.jpg"
                  alt="Team Member 1"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">John Doe</h3>
              <p className="text-gray-600">CEO</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-75 h-70 mb-4 overflow-hidden rounded-lg shadow-lg transition-transform duration-500 hover:scale-105">
                <img
                  src="./images/ourteam-2.jpg"
                  alt="Team Member 2"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                Jane Smith
              </h3>
              <p className="text-gray-600">Lead Designer</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-75 h-70 mb-4 overflow-hidden rounded-lg shadow-lg transition-transform duration-500 hover:scale-105">
                <img
                  src="./images/ourteam-3.jpg"
                  alt="Team Member 3"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                David Brown
              </h3>
              <p className="text-gray-600">Marketing Director</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-75 h-70 mb-4 overflow-hidden rounded-lg shadow-lg transition-transform duration-500 hover:scale-105">
                <img
                  src="./images/ourteam-4.jpg"
                  alt="Team Member 4"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                Emily White
              </h3>
              <p className="text-gray-600">Product Manager</p>
            </div>
          </div>
        </section>
        <section className="py-16 px-4 bg-white">
          <div className="video-container relative">
            <div className="video-thumbnail relative">
              <img
                src="/images/bg-1.jpg" // Lưu ý rằng đây là đường dẫn bắt đầu từ thư mục public/
                alt="Video Thumbnail"
                className="img-responsive w-full h-auto object-cover rounded-lg"
              />
              <button
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
             w-20 h-20 rounded-full border-4 border-white
             flex items-center justify-center
             bg-black bg-opacity-50 text-white text-4xl
             hover:bg-white hover:text-black hover:scale-110
             transition-all duration-300 ease-in-out shadow-lg"
                onClick={handlePlayClick}
              >
                <span className="ml-1">&#9654;</span>
              </button>
            </div>
            {showModal && (
              <div className="video-modal fixed top-10 left-0 w-full h-full bg-black bg-opacity-80 flex justify-center items-center z-50">
                <div className="modal-dialog relative w-[60vw] bg-transparent">
                  <button
                    className="absolute -top-4 -right-4 z-10 bg-white text-gray-800 text-2xl rounded-full w-10 h-10 flex items-center justify-center shadow-lg 
        transition-all duration-300 ease-in-out hover:bg-black hover:text-white hover:scale-110"
                    onClick={closeModal}
                  >
                    &times;
                  </button>
                  <iframe
                    width="100%"
                    height="500px"
                    src="https://www.youtube.com/embed/UELVSZC06BE?autoplay=0"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Video"
                    className="rounded-lg"
                  />
                </div>
              </div>
            )}
          </div>
        </section>

        <section id="about-us" className="py-16 bg-black text-white">
          <div className="container mx-auto px-8">
            <Slider {...settings}>
              <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
                <p className="text-lg italic">
                  "The furniture selection here is exceptional!"
                </p>
                <p className="mt-4 text-sm text-gray-400">
                  - Linda, Designer | 12th March, 2024
                </p>
              </div>
              <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
                <p className="text-lg italic">
                  "I found exactly what I needed for my home renovation."
                </p>
                <p className="mt-4 text-sm text-gray-400">
                  - Robert S, Jakata | 15th March, 2024
                </p>
              </div>
              <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
                <p className="text-lg italic">
                  "The quality and design surpassed my expectations."
                </p>
                <p className="mt-4 text-sm text-gray-400">
                  - Linda Maria, Designer | 20th March, 2024
                </p>
              </div>
            </Slider>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AboutUS;
