import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

function Exhibitions() {
  const [exhibitions, setExhibitions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Badge colors based on status
  const statusColors = {
    upcoming: "bg-blue-500",
    current: "bg-green-500",
    ended: "bg-red-500",
  };

  const fetchExhibitions = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/exhibitions");
      if (!res.ok) throw new Error("Failed to fetch exhibitions");
      const data = await res.json();

      // Extract array from object
      const exhibitionsArray = Array.isArray(data.exhibitions)
        ? data.exhibitions
        : [];

      const mapped = exhibitionsArray.map((ex) => ({
        id: ex._id,
        title: ex.title,
        location: ex.venue,
        date: `${new Date(ex.startdate).toLocaleDateString()} - ${new Date(
          ex.enddate
        ).toLocaleDateString()}`,
        status: ex.status,
        description: ex.description,
        image: ex.image,
      }));

      setExhibitions(mapped);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExhibitions();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-grow px-6 py-24 max-w-7xl mx-auto">
        <h2 className="text-3xl font-semibold text-gray-900 mb-12 text-center">
          Exhibitions
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading exhibitions...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {exhibitions.map((exhibit) => (
              <article
                key={exhibit.id}
                className="relative bg-white shadow-md overflow-hidden border border-gray-200 hover:shadow-xl transition"
              >
                {/* Status Badge */}
                <span
                  className={`absolute top-0 right-0 text-xs font-medium text-white px-3 py-1 shadow-md ${
                    statusColors[exhibit.status] || "bg-gray-400"
                  }`}
                >
                  {exhibit.status.charAt(0).toUpperCase() +
                    exhibit.status.slice(1)}
                </span>

                {/* Image */}
                <img
                  src={exhibit.image}
                  alt={`${exhibit.title} exhibition image`}
                  className="w-full h-56 object-cover"
                  loading="lazy"
                />

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {exhibit.title}
                  </h3>
                  <p className="text-gray-500 text-sm mb-1">
                    📍 {exhibit.location}
                  </p>
                  <p className="text-gray-600 text-sm mb-2">{exhibit.date}</p>
                  <p className="text-gray-700 text-sm">{exhibit.description}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Exhibitions;
