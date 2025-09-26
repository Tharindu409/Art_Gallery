import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

function ArtProductDirect() {
  const { id } = useParams(); // get art ID from URL
  const navigate = useNavigate();

  const [art, setArt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchased, setPurchased] = useState(false);

  useEffect(() => {
    const fetchArt = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/arts/${id}`);
        if (!res.ok) throw new Error("Failed to fetch artwork");
        const data = await res.json();
        
        // Check if artwork status allows direct purchase
        if (data.status === "Not Listed") {
          navigate("/artshow"); // redirect if not available for purchase
          return;
        }
        
        setArt(data);
      } catch (error) {
        console.error(error);
        navigate("/artshow"); // redirect if artwork not found
      } finally {
        setLoading(false);
      }
    };

    fetchArt();
  }, [id, navigate]);

  const handlePurchase = () => {
    setPurchased(true);
    navigate("/directbuypayment", { state: { art } });
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <p className="text-center mt-28 text-xl">Loading artwork...</p>
        <Footer />
      </div>
    );
  }

  if (!art) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <p className="text-center mt-28 text-xl">No artwork found.</p>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-6 mt-[100px] mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          {/* Artwork Image */}
          <div className="bg-white border border-gray-300 shadow-md p-4">
            <img
              src={art.image || "https://via.placeholder.com/500"}
              alt={art.title}
              className="w-full object-cover"
              loading="lazy"
            />
          </div>

          {/* Artwork Details */}
          <div className="bg-white border border-gray-300 shadow-md p-6">
            <h1 className="text-3xl font-bold mb-4">{art.title}</h1>
            <p className="text-lg text-gray-600 mb-2">
              By {art.artist || "Unknown Artist"}
            </p>

            {/* Price */}
            <div className="mb-6">
              <p className="text-xl font-semibold text-black">
                LKR {art.price?.toLocaleString()}
              </p>
            </div>

            {/* Metadata */}
            <div className="space-y-2 text-gray-700 text-sm mb-6">
              {art.medium && (
                <p>
                  <span className="font-semibold">Medium:</span> {art.medium}
                </p>
              )}
              {art.dimensions && (
                <p>
                  <span className="font-semibold">Dimensions:</span> {art.dimensions}
                </p>
              )}
              {art.category && (
                <p>
                  <span className="font-semibold">Category:</span> {art.category}
                </p>
              )}
              <p>
                <span className="font-semibold">Status:</span> {art.status}
              </p>
              {art.collections && art.collections.length > 0 && (
                <p>
                  <span className="font-semibold">Collections:</span> {art.collections.join(", ")}
                </p>
              )}
            </div>

            {/* Purchase button - only show for Direct Sale */}
            {art.status === "Direct Sale" && (
              <button
                onClick={handlePurchase}
                className={`w-1/2 py-3 font-semibold uppercase tracking-wide transition ${
                  purchased
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
                disabled={purchased}
              >
                {purchased ? "Purchased" : "Purchase"}
              </button>
            )}
          </div>
        </div>

        {/* Artwork Description */}
        {art.description && (
          <div className="mt-12 bg-white border border-gray-300 shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Artwork Story</h2>
            <p className="text-gray-700 leading-relaxed">{art.description}</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default ArtProductDirect;