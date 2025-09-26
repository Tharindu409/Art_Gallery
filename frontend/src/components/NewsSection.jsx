import React from "react";

// Import local images
import ex1 from "../assets/ex1.jpg";
import ex2 from "../assets/ex2.jpg";
import ex3 from "../assets/ex3.jpg";

function NewsSection({ containerClass }) {
  const exhibitions = [
    {
      title: "Remember to Breathe",
      artist: "Shaanea Mendis",
      date: "29 Aug - 2 Oct 2025",
      location: "Saskia Fernando Gallery, Colombo",
      description:
        "A meditative solo presentation exploring renewal and intricate watercolour patterns.",
      image: ex1,
    },
    {
      title: "Adrift",
      artist: "Anushiya Sundaralingam",
      date: "12 Sep - 13 Oct 2025",
      location: "Saskia Fernando Gallery, Colombo",
      description:
        "A contemplative series on migration and estrangement through collage, photography, and painting.",
      image: ex2,
    },
    {
      title: "AUTOMATA",
      artist: "Muvindu Binoy",
      date: "19 Dec 2025 - 9 Jan 2026",
      location: "Saskia Fernando Gallery, Colombo",
      description:
        "A surrealist exploration of perception and technology with layered visuals and cultural fragments.",
      image: ex3,
    },
  ];

  return (
    <section
      className={
        containerClass ||
        "min-h-screen scroll-snap-start bg-white pt-24 px-10"
      }
    >
      <div className="max-w-[1200px] mx-auto">
        {/* Clickable Title */}
        <h2 className="text-2xl md:text-3xl font-semibold uppercase tracking-wide border-b border-gray-800 pb-4 mb-10 text-black cursor-pointer hover:text-gray-700 transition-colors">
          <a href="/exhibitions">CURRENT EXHIBITIONS &gt;</a>
        </h2>

        {/* Exhibition Cards */}
        <div className="flex gap-8 overflow-x-auto pb-4 scrollbar-hide">
          {exhibitions.map((exhibit, index) => (
            <article
              key={index}
              className="min-w-[350px] bg-gray-100 border border-gray-300 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer transition-transform duration-300 hover:-translate-y-1"
            >
              <img
                src={exhibit.image}
                alt={exhibit.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-5">
                <h3 className="text-lg font-semibold mb-1 uppercase tracking-wide text-black">
                  {exhibit.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2 font-light">
                  {exhibit.artist} | {exhibit.date} · at {exhibit.location}
                </p>
                <p className="text-sm text-gray-700 font-light">
                  {exhibit.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default NewsSection;
