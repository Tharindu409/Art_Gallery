import React from "react";

function Dots({ current, setSlide }) {
  const dots = [0, 1, 2, 3]; // Matches 4 sections: 2 slides, News, Footer

  return (
    <div className="fixed right-8 top-1/2 transform -translate-y-1/2 flex flex-col z-40">
      {dots.map((dot, i) => (
        <button
          key={i}
          onClick={() => setSlide(i)}
          aria-label={`Go to section ${i + 1}`}
          className={`w-3 h-3 rounded-full mb-2 border border-white/30 transition-all duration-300 ${
            current === i ? "bg-white scale-125" : "bg-white/40"
          }`}
        />
      ))}
    </div>
  );
}

export default Dots;
