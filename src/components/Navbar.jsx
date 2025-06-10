import { useState, useEffect } from "react";

const navItems = ["Film", "TV", "Short + Art", "About", "People", "News"];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > window.innerHeight * 0.8);
    };
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsOpen(false);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${
        scrolled ? "bg-[#aafcdc] text-black" : "bg-transparent text-white"
      }`}
    >
      <div className="flex justify-between items-center px-4 sm:px-6 md:px-10 lg:px-16 py-4 sm:py-5 lg:py-6 text-current">
        <div className="hidden lg:flex gap-8 items-center text-lg text-current">
          {navItems.map((item, index) => (
            <div
              key={index}
              className="relative group cursor-pointer font-medium"
            >
              {item}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-current transition-all group-hover:w-full"></span>
            </div>
          ))}
        </div>

        <div
          className="lg:hidden text-lg font-medium cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          Menu
        </div>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="36"
          height="52"
          fill="none"
        >
          <path
            fill="currentColor"
            d="M17.793 51.715 0 25.858 17.793 0l17.792 25.858-17.792 25.857ZM3.004 25.858l14.789 21.375 14.673-21.375L17.793 4.482 3.004 25.858Z"
          />
          <path
            fill="currentColor"
            d="M24.032 32.753c0 .23 0 .23-.231.345-1.156.69-2.889 1.379-5.43 1.379-5.43 0-9.128-3.793-9.128-8.62 0-4.481 3.697-8.619 9.359-8.619 2.541 0 4.159.69 4.968 1.15.115 0 .23.115.23.344.116.805.232 2.184.463 2.759v.344H23.8c-.116 0-.116 0-.231-.23-.231-.574-.578-1.379-.81-1.723-.577-.69-1.732-1.494-4.043-1.494-3.812 0-6.47 3.103-6.47 7.47 0 3.907 2.08 7.47 6.355 7.47 2.195 0 3.466-.69 4.274-1.15.116-.114.347-.23.463-.574l.577-1.724c0-.23.116-.23.231-.23h.347c.116 0 .116 0 .116.23-.232.575-.463 2.183-.578 2.873Z"
          />
        </svg>
      </div>

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white text-black z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-start px-4 py-4 ">
          <span
            className="font-semibold text-lg cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            Close
          </span>
        </div>

        <div className="flex flex-col gap-6 p-6 text-4xl">
          <a href="#home" onClick={() => setIsOpen(false)}>
            Home
          </a>
          {navItems.map((item, index) => (
            <a
              key={index}
              href="#"
              onClick={() => setIsOpen(false)}
              className="hover:underline"
            >
              {item}
            </a>
          ))}
        </div>
      </div>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
        ></div>
      )}
    </nav>
  );
}
