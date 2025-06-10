import { useState, useEffect } from "react";
import {
  HiOutlineArrowNarrowRight,
  HiOutlineArrowNarrowLeft,
} from "react-icons/hi";
import { FaArrowDown } from "react-icons/fa";
import { videoData } from "../data/videosContent";
import closerLogo from "../assets/Images/closer.svg";

export default function VideoSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % videoData.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const goNext = () => setCurrent((prev) => (prev + 1) % videoData.length);
  const goPrev = () =>
    setCurrent((prev) => (prev - 1 + videoData.length) % videoData.length);

  const scrollToContent = () => {
    const contentSection = document.getElementById("content-section");
    contentSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {videoData.map((item, index) => (
        <video
          key={item.id}
          src={item.videoSrc}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-700 ${
            index === current ? "opacity-100 z-10" : "opacity-0"
          }`}
          autoPlay
          muted
          loop
        ></video>
      ))}

      <div className="absolute top-1/2 left-1/2 z-20 transform -translate-x-1/2 -translate-y-1/2">
        <img
          src={closerLogo}
          alt="Closer Logo"
          className="w-[120px] sm:w-[180px] md:w-[220px] lg:w-[300px] xl:w-[400px] 2xl:w-[500px] object-contain mx-auto"
        />
      </div>

      <div
        onClick={scrollToContent}
        className="absolute bottom-[7%] left-1/2 transform -translate-x-1/2 z-30 cursor-pointer"
      >
        <FaArrowDown className="text-white text-2xl sm:text-3xl animate-bounce" />
      </div>

      <div className="absolute bottom-10 left-6 sm:left-8 z-20 text-white">
        <h1 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">
          {videoData[current].title}
        </h1>
        <a
          href={videoData[current].watchLink}
          className="underline text-base sm:text-lg mt-2 inline-block"
        >
          Watch Now
        </a>
      </div>

      <div className="absolute right-5 bottom-10 z-20 flex gap-4 text-white text-lg">
        <button onClick={goPrev} className="hover:text-gray-300">
          <HiOutlineArrowNarrowLeft />
        </button>
        <button onClick={goNext} className="hover:text-gray-300">
          <HiOutlineArrowNarrowRight />
        </button>
      </div>
    </div>
  );
}
