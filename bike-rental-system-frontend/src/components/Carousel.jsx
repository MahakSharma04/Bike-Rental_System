import React, { useState, useEffect } from "react";
import bike1 from "../assets/sports2.jpg"
import bike2 from "../assets/retro.jpeg"
import bike3 from "../assets/crucier.png"

const slides = [
  {
    image: bike1,
    title: "Sports Bike",
    description: "Designed for speed and performance, sports bikes are perfect for thrill-seekers who crave agility and power. Ideal for short, adrenaline-packed rides on smooth roads."
  },
  {
    image: bike2,
    title: "Retro Bike",
    description: "A blend of classic style and modern comfort, retro bikes bring vintage vibes to your ride. Perfect for cruising around town in style and turning heads wherever you go."
  },
  {
    image: bike3,
    title: "Cruiser Bike",
    description: "Built for relaxed rides and maximum comfort, cruiser bikes are ideal for laid-back city exploring or beachside cruising. With wide seats and smooth handling, they’re all about chill vibes."
  }
];

const Carousel = () => {
  const [current, setCurrent] = useState(0);
  const length = slides.length;

  const nextSlide = () => {
    setCurrent((prev) => (prev === length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? length - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setCurrent(index);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000); // auto-slide every 5s
    return () => clearInterval(timer);
  }, [current]);

  return (
    <div className="relative h-[calc(100vh-64px)]">
      {/* Main carousel container */}
      <div className="h-full relative overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-700 ease-in-out ${
              index === current ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* Image container */}
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            
            {/* Text overlay */}
            <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center">
              <h2 className="text-white text-5xl font-bold mb-4 animate-fade-in-down">
                {slide.title}
              </h2>
              <p className="text-white text-xl p-14 animate-fade-in-up">
                {slide.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/30 hover:bg-white/50 rounded-full p-2"
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/30 hover:bg-white/50 rounded-full p-2"
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === current ? "bg-white" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
