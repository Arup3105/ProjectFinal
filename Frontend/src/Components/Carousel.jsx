import React, { useState, useRef, useEffect } from 'react';
import '../Components/Carousel.css';

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragStart, setDragStart] = useState(0);
  const [dragging, setDragging] = useState(false);
  const carouselRef = useRef(null);

  // Array of locally stored image URLs
  const images = [
    '/more.png',
    '/tcs.webp',
    '/Del.png',
    '/fed.png',
    '/wipro.png'
  ];

  // Function to go to the next slide
  const nextSlide = () => {
    const lastIndex = images.length - 1;
    const index = currentIndex === lastIndex ? 0 : currentIndex + 1;
    setCurrentIndex(index);
  };

  // Function to go to the previous slide
  const prevSlide = () => {
    const lastIndex = images.length - 1;
    const index = currentIndex === 0 ? lastIndex : currentIndex - 1;
    setCurrentIndex(index);
  };

  // Function to handle dot click
  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  // Function to handle drag start
  const handleDragStart = (e) => {
    setDragging(true);
    setDragStart(e.clientX || e.touches[0].clientX);
  };

  // Function to handle drag end
  const handleDragEnd = () => {
    setDragging(false);
  };

  // Function to handle drag move
  const handleDragMove = (e) => {
    if (dragging) {
      const delta = (e.clientX || e.touches[0].clientX) - dragStart;
      if (delta > 50) {
        prevSlide();
        setDragStart(e.clientX || e.touches[0].clientX);
      } else if (delta < -50) {
        nextSlide();
        setDragStart(e.clientX || e.touches[0].clientX);
      }
    }
  };

  // Automatic scrolling interval
  useEffect(() => {
    const intervalId = setInterval(() => {
      nextSlide();
    }, 3000);

    return () => clearInterval(intervalId);
  }, [currentIndex]);

  return (
    <div
      className="carousel-container"
      onMouseDown={handleDragStart}
      onMouseUp={handleDragEnd}
      onMouseMove={handleDragMove}
      onTouchStart={handleDragStart}
      onTouchEnd={handleDragEnd}
      onTouchMove={handleDragMove}
    >
      <div className="carousel" ref={carouselRef}>
        <div className="slides" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
          {images.map((image, index) => (
            <img key={index} src={image} alt={`Slide ${index + 1}`} className="slide" style={{ width: '10%', height: '330px', objectFit: 'cover' }} />
          ))}
        </div>
      </div>
      <button className="prev" onClick={prevSlide}>&#10094;</button>
      <button className="next" onClick={nextSlide}>&#10095;</button>
      <div className="pagination-container">
        <div className="pagination">
          {images.map((_, index) => (
            <span
              key={index}
              className={index === currentIndex ? 'dot active' : 'dot'}
              onClick={() => handleDotClick(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
