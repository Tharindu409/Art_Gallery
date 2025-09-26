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
      <main className="flex-grow max-w-[1200px] mx-auto px-6 py-4">
        <div className="grid grid-cols-1 md:grid-2 gap-6">
          {filteredArtworks.map((art) => (
            <div
              key={art.id}
              className="relative group overflow-hidden shadow-lg"
            >
              {art.image ? (
                <img
                  src={art.image}
                  alt={art.title}
                  className="w-full h-[350px] object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-[350px] bg-gray-200 flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}

              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4">
                <h3 className="text-lg font-semibold">{art.title}</h3>
                <p className="text-sm">{art.medium}</p>
                <p className="text-sm">{art.size}</p>
                <p className="text-sm font-bold">{art.price}</p>
                <button
                  type="button"
                  onClick={() => handleMoreClick(art)}
                  className={`mt-2 px-3 py-1 text-xs transition ${
                    art.status === "Bid" || art.status === "Direct Sale"
                      ? "bg-black text-white hover:bg-gray-800 cursor-pointer"
                      : "bg-gray-400 text-gray-200 cursor-not-allowed"
                  }`}
                  disabled={art.status === "Not Listed"}
                >
                  MORE
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No artworks message */}
        {filteredArtworks.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No artworks found matching your filters.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Artshow;