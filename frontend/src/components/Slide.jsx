import React from "react";

function Slide({
  title,
  subtitle,
  background,
  containerClass,
  titleClass,
  subtitleClass,
}) {
  return (
    <div
      className={
        containerClass ||
        "h-screen snap-start flex items-end justify-start p-10 relative bg-cover bg-center"
      }
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${background})`,
      }}
    >
      <div className="text-left text-white max-w-xl">
        <h2
          className={
            titleClass ||
            "text-4xl md:text-5xl font-semibold mb-2 uppercase tracking-wider"
          }
        >
          {title}
        </h2>
        <p
          className={
            subtitleClass ||
            "text-lg md:text-xl font-light tracking-wide"
          }
        >
          {subtitle}
        </p>
      </div>
    </div>
  );
}

export default Slide;
