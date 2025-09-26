import React, { useEffect, useState, useRef } from "react";
import Header from "../components/Header";
import Slide from "../components/Slide";
import NewsSection from "../components/NewsSection";
import Footer from "../components/Footer";
import Dots from "../components/Dots";
import ScrollIndicator from "../components/ScrollIndicator";
import "../index.css";
import myArt from "../assets/image1.jpg";
import image2 from "../assets/image2.jpg";

function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollContainerRef = useRef(null);
  const slidesRef = useRef([]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    const slides = slidesRef.current;

    const updateDots = (index) => setCurrentSlide(index);

    const goToSlide = (index) => {
      if (index < 0 || index >= slides.length) return;
      scrollContainer.scrollTo({
        top: slides[index].offsetTop,
        behavior: "smooth",
      });
      updateDots(index);
    };

    const handleWheel = (e) => {
      if (Math.abs(e.deltaY) > 50) {
        e.preventDefault();
        if (e.deltaY > 0 && currentSlide < slides.length - 1) {
          goToSlide(currentSlide + 1);
        } else if (e.deltaY < 0 && currentSlide > 0) {
          goToSlide(currentSlide - 1);
        }
      }
    };

    const handleKey = (e) => {
      if (e.key === "ArrowDown" && currentSlide < slides.length - 1) {
        e.preventDefault();
        goToSlide(currentSlide + 1);
      } else if (e.key === "ArrowUp" && currentSlide > 0) {
        e.preventDefault();
        goToSlide(currentSlide - 1);
      }
    };

    const handleScroll = () => {
      const scrollPos = scrollContainer.scrollTop;
      for (let i = 0; i < slides.length; i++) {
        if (scrollPos < slides[i].offsetTop + slides[i].offsetHeight / 2) {
          if (currentSlide !== i) updateDots(i);
          break;
        }
      }
    };

    scrollContainer.addEventListener("wheel", handleWheel, { passive: false });
    document.addEventListener("keydown", handleKey);
    scrollContainer.addEventListener("scroll", handleScroll);

    return () => {
      scrollContainer.removeEventListener("wheel", handleWheel);
      document.removeEventListener("keydown", handleKey);
      scrollContainer.removeEventListener("scroll", handleScroll);
    };
  }, [currentSlide]);

  return (
    <>
      <Header />

      <div
        className="h-screen overflow-y-scroll scroll-snap-y-mandatory scroll-smooth pt-20"
        ref={scrollContainerRef}
      >
        <div ref={(el) => (slidesRef.current[0] = el)}>
          <Slide
            title="MOUNTAIN IS MOUNTAIN 02"
            subtitle="14.5 × 17 cm · Mixed Media on Paper · 2025 · [ Now Showcasing ]"
            background={myArt}
            containerClass="h-screen flex items-end justify-start p-10 bg-cover bg-center scroll-snap-start"
            titleClass="text-white text-4xl font-semibold uppercase tracking-widest mb-2"
            subtitleClass="text-gray-200 text-lg font-light tracking-wide"
          />
        </div>

        <div ref={(el) => (slidesRef.current[1] = el)}>
          <Slide
            title="Please Don’t Let Big Die"
            subtitle="The struggle of Ceylon’s giants against human encroachment · Pigment Pen on Paper · 2025 · [ Now Showcasing ]"
            background={image2}
            containerClass="h-screen flex items-end justify-start p-10 bg-cover bg-center scroll-snap-start"
            titleClass="text-white text-4xl font-semibold uppercase tracking-widest mb-2"
            subtitleClass="text-gray-200 text-lg font-light tracking-wide"
          />
        </div>

        <div ref={(el) => (slidesRef.current[2] = el)}>
          <NewsSection containerClass="scroll-snap-start bg-white p-12 sm:p-6" />
        </div>

        <div ref={(el) => (slidesRef.current[3] = el)}>
          <Footer containerClass="min-h-[30vh] scroll-snap-start bg-white flex flex-col justify-center items-center p-8 text-center" />
        </div>
      </div>

      <Dots
        current={currentSlide}
        setSlide={(i) => {
          const slides = slidesRef.current;
          const scrollContainer = scrollContainerRef.current;
          scrollContainer.scrollTo({
            top: slides[i].offsetTop,
            behavior: "smooth",
          });
          setCurrentSlide(i);
        }}
      />

      <ScrollIndicator />
    </>
  );
}

export default HomePage;
