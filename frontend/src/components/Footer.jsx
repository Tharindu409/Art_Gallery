import React from "react";

function Footer({ containerClass }) {
  return (
    <footer
      className={
        containerClass ||
        "min-h-[40vh] scroll-snap-start bg-white flex flex-col justify-center items-center p-10 text-center border-t border-gray-800"
      }
    >
      <div className="text-black max-w-2xl">
        <div className="text-2xl font-semibold mb-5 tracking-wide">
          CEYLON GALLERIA
        </div>
        <p className="text-sm font-light mb-2">
          Colombo, Sri Lanka | Tuesday-Saturday 10AM-6PM
        </p>
        <p className="text-sm font-light mb-2">
          +94 11 586 7974 | info@ceylongalleria.com
        </p>

        {/* Social Links */}
        <div className="flex justify-center space-x-6 mt-4 mb-6">
          <a
            href="https://www.facebook.com/YourGalleryPage"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-gray-800 hover:text-blue-600 transition-colors"
          >
            Facebook
          </a>
          <a
            href="https://www.instagram.com/YourGalleryPage"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-gray-800 hover:text-pink-500 transition-colors"
          >
            Instagram
          </a>
        </div>

        <p className="text-xs font-light mt-6">
          COPYRIGHT © 2025 CEYLON GALLERIA
        </p>
        <p className="text-xs font-light">SITE BY ARTLOGIC</p>
      </div>
    </footer>
  );
}

export default Footer;
