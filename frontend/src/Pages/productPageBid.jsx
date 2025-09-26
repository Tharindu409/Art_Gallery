import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const bidRules = [
  {
    title: "Confidentiality",
    description:
      "Your bid is strictly confidential and only visible to the gallery team.",
  },
  {
    title: "Binding Agreement",
    description:
      "If your bid is selected, you are required to complete payment within 24 hours.",
  },
  {
    title: "Contact Procedure",
    description:
      "The gallery team will contact you via the provided contact details if your bid is successful.",
  },
  {
    title: "Fair Bidding",
    description:
      "Attempting to game the bidding system may result in disqualification and legal action.",
  },
  {
    title: "Finality",
    description:
      "All bids are final; there is no negotiation after submission.",
  },
];

function BidProductPage() {
  const { id } = useParams(); // art ID
  const navigate = useNavigate();

  const [art, setArt] = useState(null);
  const [sessionID, setSessionID] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    offerPrice: "",
    name: "",
    note: "",
    contact: "",
  });
  const [checkedRules, setCheckedRules] = useState(
    new Array(bidRules.length).fill(false)
  );

  const allChecked = checkedRules.every(Boolean);

  // Fetch art by ID
  useEffect(() => {
    const fetchArtById = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/arts/${id}`);
        if (!response.ok) throw new Error("Failed to fetch artwork");
        const data = await response.json();

        // Check if artwork status allows bidding
        if (data.status === "Not Listed") {
          navigate("/artshow"); // redirect if not available for bidding
          return;
        }

        setArt(data);
      } catch (error) {
        console.error("Error fetching art:", error);
        navigate("/artshow");
      }
    };

    fetchArtById();
  }, [id, navigate]);

  // Fetch session ID for this art
  useEffect(() => {
    const fetchSession = async () => {
      if (!art) return;

      try {
        const response = await fetch(`http://localhost:5000/api/bidding`);
        const sessions = await response.json();

        // Find session where art._id matches
        const session = sessions.find((s) => s.art._id === art._id);

        if (session) {
          setSessionID(session._id);
        } else {
          console.warn("No bidding session found for this art.");
        }
      } catch (error) {
        console.error("Error fetching bidding sessions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [art]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const toggleRule = (idx) => {
    const updated = [...checkedRules];
    updated[idx] = !updated[idx];
    setCheckedRules(updated);
  };

  const handleSubmit = async () => {
    if (!allChecked || !sessionID) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/bidding/${sessionID}/bids`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            offerPrice: Number(form.offerPrice),
            contact: form.contact,
            note: form.note,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to submit bid");

      const result = await response.json();
      console.log("Bid submitted:", result);
      alert("Bid submitted successfully!");

      setForm({ offerPrice: "", name: "", note: "", contact: "" });
      setCheckedRules(new Array(bidRules.length).fill(false));
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error submitting bid:", error);
      alert("Failed to submit bid. Please try again.");
    }
  };

  if (loading) return <p className="text-center mt-20">Loading artwork...</p>;

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
      <main className="flex-grow max-w-[1200px] mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Artwork Image */}
          <img
            src={art.image || "https://via.placeholder.com/500"}
            alt={art.title}
            className="w-full h-[500px] object-cover shadow-lg"
          />

          {/* Artwork Details */}
          <div className="flex flex-col justify-between bg-white p-6 border border-gray-200 shadow-md">
            <div>
              <h1 className="text-3xl font-bold mb-2">{art.title}</h1>
              <p className="text-gray-700 mb-1">
                By {art.artist || "Unknown Artist"}
              </p>

              {art.medium && (
                <p className="text-gray-700 mb-1">
                  <span className="font-semibold">Medium:</span> {art.medium}
                </p>
              )}

              {art.dimensions && (
                <p className="text-gray-700 mb-1">
                  <span className="font-semibold">Dimensions:</span>{" "}
                  {art.dimensions}
                </p>
              )}

              {art.category && (
                <p className="text-gray-700 mb-1">
                  <span className="font-semibold">Category:</span>{" "}
                  {art.category}
                </p>
              )}

              <p className="text-xl font-bold mb-4">
                Starting Price: LKR {art.price?.toLocaleString()}
              </p>

              {/* Bidding Information */}
              {art.bidEndDate && art.bidEndTime && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-sm font-semibold text-blue-800">
                    Bidding Ends:
                  </p>
                  <p className="text-sm text-blue-700">
                    {new Date(art.bidEndDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}{" "}
                    at {art.bidEndTime}
                  </p>
                </div>
              )}

              {art.description && (
                <div className="mb-4">
                  <h3 className="font-semibold mb-1">
                    Story Behind the Artwork
                  </h3>
                  <p className="text-gray-700 text-sm">{art.description}</p>
                </div>
              )}

              {art.date && (
                <p className="text-gray-500 text-sm">
                  Year Created: {new Date(art.date).getFullYear()}
                </p>
              )}

              {art.collections && art.collections.length > 0 && (
                <div className="mt-2 flex gap-2 flex-wrap">
                  {art.collections.map((col) => (
                    <span
                      key={col}
                      className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded"
                    >
                      {col}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Only show bid button for Bid status artworks */}
            {art.status === "Bid" && (
              <button
                onClick={() => setIsModalOpen(!isModalOpen)}
                className="mt-4 w-full py-3 bg-black text-white font-semibold hover:bg-gray-800 transition"
              >
                {isModalOpen ? "Close Bid Form" : "Make Your Bid"}
              </button>
            )}
          </div>
        </div>

        {/* Inline Bid Form (not modal) */}
        {isModalOpen && (
          <div className="mt-6 bg-white border border-gray-300 shadow-lg flex flex-col md:flex-row gap-6 p-6">
            {/* Left: Form */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-4 text-center md:text-left">
                Submit Your Confidential Bid
              </h2>
              <p className="text-gray-700 mb-4 text-center md:text-left">
                Starting Price:{" "}
                <strong>LKR {art.price?.toLocaleString()}</strong>
                <br />
                {art.bidEndDate && art.bidEndTime && (
                  <>
                    Bid Ends:{" "}
                    <strong>
                      {new Date(art.bidEndDate).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}{" "}
                      at {art.bidEndTime}
                    </strong>
                  </>
                )}
              </p>

              <form onSubmit={(e) => e.preventDefault()} className="space-y-3">
                <input
                  type="number"
                  min={art.price}
                  step="1000"
                  name="offerPrice"
                  placeholder="Your Offer Price (LKR)"
                  value={form.offerPrice}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-black outline-none"
                  required
                />
                <input
                  type="text"
                  name="name"
                  placeholder="Your Full Name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-black outline-none"
                  required
                />
                <textarea
                  name="note"
                  placeholder="Note (optional)"
                  value={form.note}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-black outline-none"
                />
                <input
                  type="text"
                  name="contact"
                  placeholder="Contact Details (Phone / Email)"
                  value={form.contact}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-black outline-none"
                  required
                />

                {/* Buttons inside the tab */}
                <div className="flex gap-4 mt-4">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2 border border-gray-400 text-gray-700 hover:bg-gray-200 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!allChecked}
                    className={`px-6 py-2 bg-black text-white font-semibold hover:bg-gray-800 transition ${
                      !allChecked ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    Submit Bid
                  </button>
                </div>
              </form>
            </div>

            {/* Right: Rules */}
            <div className="flex-1 bg-gray-50 p-4 border border-gray-300 overflow-y-auto max-h-[500px]">
              <h3 className="text-xl font-bold mb-3">
                Bid Rules & Regulations
              </h3>
              {bidRules.map((rule, idx) => (
                <div
                  key={idx}
                  className="flex flex-col border-b border-gray-200 last:border-b-0 p-2 mb-2"
                >
                  <label className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      checked={checkedRules[idx]}
                      onChange={() => toggleRule(idx)}
                      className="mt-1 accent-black"
                    />
                    <span className="font-semibold">{rule.title}</span>
                  </label>
                  <span className="text-gray-600 text-sm ml-7 mt-1">
                    {rule.description}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default BidProductPage;
