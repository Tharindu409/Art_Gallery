import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const collectionTypes = [
  "Mixed Media",
  "Oil",
  "Watercolor",
  "Pen",
  "Acrylic",
  "Canvas",
  "Abstract",
  "Sculptures",
  "Masterpieces",
];

const statusTypes = ["All", "Bid", "Direct Sale"];

function Artshow() {
  const [artworks, setArtworks] = useState([]);
  const [selectedCollections, setSelectedCollections] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/arts");
        const data = await response.json();

        const mappedArts = data
          .filter((art) => art.status !== "Not Listed") // Filter out "Not Listed" artworks
          .map((art) => ({
            id: art._id,
            title: art.title,
            medium: art.medium,
            size: art.dimensions,
            price: `LKR ${art.price?.toLocaleString()}`,
            image: art.image,
            collections: art.collections || [],
            status: art.status || "Direct Sale", // Default to "Direct Sale" instead of "Not Listed"
          }));

        setArtworks(mappedArts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching artworks:", error);
        setLoading(false);
      }
    };

    fetchArtworks();
  }, []);

  const toggleCollection = (type) => {
    setSelectedCollections((prev) =>
      prev.includes(type) ? prev.filter((c) => c !== type) : [...prev, type]
    );
  };

  const clearCollections = () => setSelectedCollections([]);

  const filteredArtworks = artworks.filter((art) => {
    const collectionMatch =
      selectedCollections.length === 0 ||
      art.collections.some((col) => selectedCollections.includes(col));
    const statusMatch =
      selectedStatus === "All" || art.status === selectedStatus;
    return collectionMatch && statusMatch;
  });

  const handleMoreClick = (art) => {
    // Only allow clicks for valid statuses (exclude "Not Listed")
    if (art.status === "Bid") {
      navigate(`/productPageBid/${art.id}`);
    } else if (art.status === "Direct Sale") {
      navigate(`/productPageDirect/${art.id}`);
    }
    // If status is "Not Listed", do nothing (though these should be filtered out already)
  };

  if (loading) return <p className="text-center mt-20">Loading artworks...</p>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      {/* Heading Section */}
      <section className="mt-28 px-6 max-w-[1200px] mx-auto text-center mb-4">
        <h1 className="text-3xl md:text-4xl font-bold uppercase mb-2 tracking-wide">
          Artist Stockroom
        </h1>
        <p className="text-gray-700 text-base md:text-lg max-w-3xl mx-auto">
          Browse our gallery inventory and discover unique artworks updated
          regularly.
        </p>
      </section>

      {/* Collection Filter */}
      <div className="mb-4 flex justify-center gap-4 flex-wrap">
        {collectionTypes.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => toggleCollection(type)}
            className={`px-4 py-1 uppercase font-semibold tracking-wider transition-all duration-300 ${
              selectedCollections.includes(type)
                ? "bg-black text-white shadow-lg"
                : "bg-white text-black border border-gray-300 hover:bg-gray-100"
            }`}
          >
            {type}
          </button>
        ))}
        {selectedCollections.length > 0 && (
          <button
            type="button"
            onClick={clearCollections}
            className="px-4 py-1 uppercase font-semibold tracking-wider bg-red-600 text-white shadow hover:bg-red-700 transition"
          >
            Clear
          </button>
        )}
      </div>

      {/* Status Filter */}
      <div className="mb-8 flex justify-center gap-4 flex-wrap">
        {statusTypes.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setSelectedStatus(status)}
            className={`px-4 py-1 uppercase font-semibold tracking-wider transition-all duration-300 ${
              selectedStatus === status
                ? "bg-black text-white shadow-lg"
                : "bg-white text-black border border-gray-300 hover:bg-gray-100"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Artworks Grid */}
      {/* Artworks Grid */}
<main className="flex-grow max-w-[1200px] mx-auto px-6 py-6">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-10">
    {filteredArtworks.map((art) => (
      <div
        key={art.id}
        className="group relative bg-white overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500"
      >
        {/* Image Container */}
        <div className="relative w-full h-[420px] overflow-hidden bg-gray-200">
          {art.image ? (
            <img
              src={art.image}
              alt={art.title}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              No Image
            </div>
          )}

          {/* Status Badge */}
          <div className="absolute top-4 left-4">
            <span className="bg-black text-white text-[11px] uppercase tracking-[0.15em] px-3 py-2">
              {art.status}
            </span>
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />

          {/* Bottom Gradient */}
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />
        </div>

        {/* Artwork Information */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="text-xl font-semibold text-black truncate">
                {art.title}
              </h3>

              <p className="mt-1 text-sm text-gray-600">
                {art.medium}
              </p>
            </div>

            <p className="text-sm font-semibold text-black whitespace-nowrap">
              {art.price}
            </p>
          </div>

          {/* Details */}
          <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
            <p className="text-xs uppercase tracking-wider text-gray-500">
              {art.size}
            </p>

            <button
              type="button"
              onClick={() => handleMoreClick(art)}
              className="group/btn inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-black"
            >
              <span>More</span>

              <span className="inline-block transition-transform duration-300 group-hover/btn:translate-x-1">
                →
              </span>
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>

  {/* No artworks message */}
  {filteredArtworks.length === 0 && !loading && (
    <div className="text-center py-20">
      <p className="text-gray-500 text-lg">
        No artworks found matching your filters.
      </p>
    </div>
  )}
</main>

      <Footer />
    </div>
  );
}

export default Artshow;