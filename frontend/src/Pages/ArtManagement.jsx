import React, { useState, useEffect } from "react";
import AdminSidebar from "../components/AdminSlidebar";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const STATUS_OPTIONS = ["Direct Sale", "Bid", "Not Listed"];
const COLLECTION_OPTIONS = [
  "Mixed Media",
  "Canvas",
  "Oil",
  "Acrylic",
  "Watercolor",
  "Pen",
  "Abstract",
  "Nature",
  "Urban",
];
const CATEGORY_OPTIONS = [
  "Painting",
  "Sculpture",
  "Photography",
  "Digital",
  "Other",
];

const API_BASE = "http://localhost:5000/api/arts";

function AdminArtManagement() {
  const [artworks, setArtworks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [descriptionModal, setDescriptionModal] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(false);

  const generateArtCode = () => {
    const lastCode =
      artworks.length > 0
        ? Math.max(
            ...artworks.map((art) => parseInt(art.artCode.replace("ART", "")))
          )
        : 0;
    return `ART${String(lastCode + 1).padStart(3, "0")}`;
  };

  useEffect(() => {
    loadArtworks();
  }, []);

  const loadArtworks = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_BASE);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setArtworks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Load artworks error:", error);
      alert("Failed to load artworks: " + error.message);
      setArtworks([]);
    } finally {
      setLoading(false);
    }
  };

  // Validation function
  const validateArtData = (data) => {
    const errors = {};

    // Required fields
    if (!data.artCode?.trim()) errors.artCode = "Art Code is required";
    if (!data.title?.trim()) errors.title = "Title is required";
    if (!data.artist?.trim()) errors.artist = "Artist is required";
    
    // Price validation - must be positive number
    if (data.price !== undefined && data.price !== "") {
      const priceNum = parseFloat(data.price);
      if (isNaN(priceNum) || priceNum < 0) {
        errors.price = "Price must be a valid positive number";
      }
    }

    // Dimensions validation - should follow format like "24x36 inches"
    if (data.dimensions && data.dimensions.trim()) {
      const dimensionPattern = /^\d+(\.\d+)?\s*[x×]\s*\d+(\.\d+)?\s*(inches|cm|mm|feet|in)$/i;
      if (!dimensionPattern.test(data.dimensions.trim())) {
        errors.dimensions = "Dimensions should be in format like '24x36 inches' or '30.5x40.2 cm'";
      }
    }

    // URL validation for image
    if (data.image && data.image.trim()) {
      try {
        new URL(data.image);
      } catch {
        errors.image = "Please enter a valid URL";
      }
    }

    // Status validation
    if (!STATUS_OPTIONS.includes(data.status)) {
      errors.status = "Invalid status";
    }

    // Category validation
    if (!CATEGORY_OPTIONS.includes(data.category)) {
      errors.category = "Invalid category";
    }

    // Bid validation - if status is "Bid", bidEndDate and bidEndTime are required
    if (data.status === "Bid") {
      if (!data.bidEndDate) errors.bidEndDate = "Bid end date is required for bidding items";
      if (!data.bidEndTime) errors.bidEndTime = "Bid end time is required for bidding items";
      
      // Check if bid end date is in the future
      if (data.bidEndDate && data.bidEndTime) {
        const bidEndDateTime = new Date(`${data.bidEndDate}T${data.bidEndTime}`);
        if (bidEndDateTime <= new Date()) {
          errors.bidEndDate = "Bid end date and time must be in the future";
        }
      }
    } else {
      // Clear bid fields if status is not "Bid"
      data.bidEndDate = "";
      data.bidEndTime = "";
    }

    return errors;
  };

  const filteredArts = artworks.filter((art) =>
    Object.values(art).some(
      (val) =>
        val && val.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleDelete = (art) => {
    if (art.status === "Not Listed") setDeleteTarget(art);
    else alert("Cannot delete artwork that is listed for sale or bidding.");
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/${deleteTarget._id}`, { method: "DELETE" });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      setArtworks((prev) => prev.filter((a) => a._id !== deleteTarget._id));
      setDeleteTarget(null);
      alert("Artwork deleted successfully!");
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete artwork: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const cancelDelete = () => setDeleteTarget(null);

  const handleAddClick = () => {
    setEditData({
      artCode: generateArtCode(),
      title: "",
      artist: "",
      medium: "",
      dimensions: "",
      price: "",
      category: "Painting",
      collections: [],
      status: "Not Listed",
      date: new Date().toISOString(),
      image: "",
      description: "",
      bidEndDate: "",
      bidEndTime: "",
    });
    setAddModal(true);
  };

  const handleEditClick = (art) => {
    setEditData({ ...art });
    setEditModal(true);
  };

  const saveAdd = async (data) => {
    try {
      setLoading(true);
      
      // Validate data
      const errors = validateArtData(data);
      if (Object.keys(errors).length > 0) {
        const errorMessages = Object.values(errors).join('\n');
        alert("Please fix the following errors:\n\n" + errorMessages);
        return;
      }

      // Convert price to number if provided
      const processedData = {
        ...data,
        price: data.price ? parseFloat(data.price) : undefined,
        collections: data.collections || []
      };

      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(processedData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }

      const newData = await res.json();
      setArtworks((prev) => [newData, ...prev]);

      // Create bidding session if status is "Bid"
      if (newData.status === "Bid") {
        try {
          const sessionBody = {
            artId: newData._id,
            startingPrice: newData.price || 0,
            bidEndDate: newData.bidEndDate,
            bidEndTime: newData.bidEndTime,
          };
          const biddingRes = await fetch("http://localhost:5000/api/bidding", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(sessionBody),
          });
          
          if (!biddingRes.ok) {
            console.warn("Failed to create bidding session");
          }
        } catch (biddingError) {
          console.warn("Bidding session creation failed:", biddingError);
        }
      }

      setAddModal(false);
      alert("Artwork added successfully!");
    } catch (error) {
      console.error("Add artwork error:", error);
      alert("Failed to add artwork: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const saveEdit = async (data) => {
    try {
      setLoading(true);
      
      // Validate data
      const errors = validateArtData(data);
      if (Object.keys(errors).length > 0) {
        const errorMessages = Object.values(errors).join('\n');
        alert("Please fix the following errors:\n\n" + errorMessages);
        return;
      }

      // Convert price to number if provided
      const processedData = {
        ...data,
        price: data.price ? parseFloat(data.price) : undefined,
        collections: data.collections || []
      };

      console.log("Original data:", data);
      console.log("Processed data being sent:", processedData);

      const res = await fetch(`${API_BASE}/${data._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(processedData),
      });

      console.log("Response status:", res.status);
      console.log("Response ok:", res.ok);

      if (!res.ok) {
        const errorText = await res.text();
        console.log("Error response:", errorText);
        throw new Error(`HTTP error! status: ${res.status}, message: ${errorText}`);
      }

      const updatedData = await res.json();
      console.log("Updated data received from server:", updatedData);

      setArtworks((prev) =>
        prev.map((a) => (a._id === updatedData._id ? updatedData : a))
      );

      if (updatedData.status === "Bid") {
        try {
          const sessionBody = {
            artId: updatedData._id,
            startingPrice: updatedData.price || 0,
            bidEndDate: updatedData.bidEndDate,
            bidEndTime: updatedData.bidEndTime,
          };
          const biddingRes = await fetch("http://localhost:5000/api/bidding", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(sessionBody),
          });
          
          if (!biddingRes.ok) {
            console.warn("Failed to create bidding session");
          }
        } catch (biddingError) {
          console.warn("Bidding session creation failed:", biddingError);
        }
      }

      setEditModal(false);
      alert("Artwork updated successfully!");
      
      // Reload artworks to ensure we have the latest data
      await loadArtworks();
    } catch (error) {
      console.error("Update artwork error:", error);
      alert("Failed to update artwork: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const now = new Date();
    
    // Header
    doc.setFontSize(16);
    doc.text("SFG Gallery - Art Report", 14, 20);
    doc.setFontSize(10);
    doc.text(`Generated: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`, 14, 28);
    
    autoTable(doc, {
      startY: 35,
      head: [
        [
          "Art Code",
          "Title",
          "Artist",
          "Medium",
          "Dimensions",
          "Price (Rs.)",
          "Category",
          "Collections",
          "Status",
          "Date",
          "Description",
        ],
      ],
      body: artworks.map((a) => [
        a.artCode || "-",
        a.title || "-",
        a.artist || "-",
        a.medium || "-",
        a.dimensions || "-",
        a.price || "-",
        a.category || "-",
        (a.collections || []).join(", ") || "-",
        a.status || "-",
        a.date ? new Date(a.date).toLocaleDateString() : "-",
        a.description || "-",
      ]),
      styles: { 
        cellWidth: 'wrap', 
        fontSize: 8, 
        overflow: 'linebreak',
        halign: 'left'
      },
      headStyles: {
        fontSize: 9,
        fillColor: [60, 60, 60],
        textColor: [255, 255, 255]
      },
      columnStyles: {
        0: { cellWidth: 15 },
        1: { cellWidth: 20 },
        2: { cellWidth: 18 },
        3: { cellWidth: 15 },
        4: { cellWidth: 18 },
        5: { cellWidth: 15 },
        6: { cellWidth: 15 },
        7: { cellWidth: 20 },
        8: { cellWidth: 15 },
        9: { cellWidth: 18 },
        10: { cellWidth: 25 }
      }
    });
    
    doc.save("Art_Report.pdf");
  };

  // Enhanced ArtModal with validation
  const ArtModal = ({ isAdd = false, initialData, onSave, onClose }) => {
    const [modalData, setModalData] = useState(() => ({
      artCode: "",
      title: "",
      artist: "",
      medium: "",
      dimensions: "",
      price: "",
      category: "Painting",
      collections: [],
      status: "Not Listed",
      image: "",
      description: "",
      bidEndDate: "",
      bidEndTime: "",
      ...initialData
    }));
    const [errors, setErrors] = useState({});

    const toggleModalCollection = (collection) => {
      setModalData((prev) => ({
        ...prev,
        collections: prev.collections?.includes(collection)
          ? prev.collections.filter((c) => c !== collection)
          : [...(prev.collections || []), collection],
      }));
    };

    const handleSave = () => {
      const validationErrors = validateArtData(modalData);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
      onSave(modalData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[95vh] flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-lg flex-shrink-0">
            <h2 className="text-xl font-bold text-gray-800">
              {isAdd ? "Add New Artwork" : "Edit Artwork"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold transition-colors duration-200"
            >
              ×
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="space-y-4">
              {/* Art Code */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Art Code *
                </label>
                <input
                  type="text"
                  value={modalData.artCode || ""}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
                />
                {errors.artCode && (
                  <p className="text-red-500 text-sm mt-1">{errors.artCode}</p>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={modalData.title || ""}
                  onChange={(e) => {
                    setModalData(prev => ({ ...prev, title: e.target.value }));
                    if (errors.title) setErrors(prev => ({ ...prev, title: "" }));
                  }}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-black focus:border-black ${
                    errors.title ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter artwork title"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                )}
              </div>

              {/* Artist */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Artist *
                </label>
                <input
                  type="text"
                  value={modalData.artist || ""}
                  onChange={(e) => {
                    setModalData(prev => ({ ...prev, artist: e.target.value }));
                    if (errors.artist) setErrors(prev => ({ ...prev, artist: "" }));
                  }}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-black focus:border-black ${
                    errors.artist ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter artist name"
                />
                {errors.artist && (
                  <p className="text-red-500 text-sm mt-1">{errors.artist}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Medium */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Medium
                  </label>
                  <input
                    type="text"
                    value={modalData.medium || ""}
                    onChange={(e) => {
                      setModalData(prev => ({ ...prev, medium: e.target.value }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black"
                    placeholder="e.g., Oil on Canvas"
                  />
                </div>

                {/* Dimensions */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Dimensions
                  </label>
                  <input
                    type="text"
                    value={modalData.dimensions || ""}
                    onChange={(e) => {
                      setModalData(prev => ({ ...prev, dimensions: e.target.value }));
                      if (errors.dimensions) setErrors(prev => ({ ...prev, dimensions: "" }));
                    }}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-black focus:border-black ${
                      errors.dimensions ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="e.g., 24x36 inches"
                  />
                  {errors.dimensions && (
                    <p className="text-red-500 text-sm mt-1">{errors.dimensions}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Price */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Price (Rs.)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={modalData.price || ""}
                    onChange={(e) => {
                      setModalData(prev => ({ ...prev, price: e.target.value }));
                      if (errors.price) setErrors(prev => ({ ...prev, price: "" }));
                    }}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-black focus:border-black ${
                      errors.price ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter price (numbers only)"
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={modalData.category || "Painting"}
                    onChange={(e) => {
                      setModalData(prev => ({ ...prev, category: e.target.value }));
                      if (errors.category) setErrors(prev => ({ ...prev, category: "" }));
                    }}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-black focus:border-black ${
                      errors.category ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                  )}
                </div>
              </div>

              {/* Collections */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Collections
                </label>
                <div className="grid grid-cols-3 gap-2 p-3 border border-gray-300 rounded-md bg-gray-50">
                  {COLLECTION_OPTIONS.map((col) => (
                    <label
                      key={col}
                      className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors duration-200"
                    >
                      <input
                        type="checkbox"
                        checked={modalData.collections?.includes(col) || false}
                        onChange={() => toggleModalCollection(col)}
                        className="form-checkbox h-4 w-4 text-black border-gray-300 rounded focus:ring-black"
                      />
                      <span className="text-sm text-gray-700">{col}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status * (Current: {modalData.status})
                </label>
                <select
                  key={`status-${modalData._id || 'new'}`}
                  value={modalData.status || "Not Listed"}
                  onChange={(e) => {
                    const newStatus = e.target.value;
                    console.log("Status changing from", modalData.status, "to", newStatus);
                    
                    // Direct state update
                    setModalData(prev => {
                      const updated = { ...prev, status: newStatus };
                      if (newStatus !== "Bid") {
                        updated.bidEndDate = "";
                        updated.bidEndTime = "";
                      }
                      console.log("Modal data updated with new status:", updated.status);
                      return updated;
                    });
                    
                    // Clear errors
                    setErrors(prev => ({
                      ...prev,
                      status: "",
                      ...(newStatus !== "Bid" && { bidEndDate: "", bidEndTime: "" })
                    }));
                  }}
                  disabled={loading}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-black focus:border-black cursor-pointer ${
                    errors.status ? "border-red-500" : "border-gray-300"
                  } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Available options: {STATUS_OPTIONS.join(", ")}
                </p>
                {errors.status && (
                  <p className="text-red-500 text-sm mt-1">{errors.status}</p>
                )}
              </div>

              {/* Bid End Date/Time - Only show if status is "Bid" */}
              {modalData.status === "Bid" && (
                <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                  <h4 className="text-sm font-semibold text-blue-800 mb-3">
                    Bidding Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Bid End Date *
                      </label>
                      <input
                        type="date"
                        value={
                          modalData.bidEndDate
                            ? new Date(modalData.bidEndDate).toISOString().split("T")[0]
                            : ""
                        }
                        onChange={(e) => {
                          setModalData(prev => ({ ...prev, bidEndDate: e.target.value }));
                          if (errors.bidEndDate) setErrors(prev => ({ ...prev, bidEndDate: "" }));
                        }}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-black focus:border-black ${
                          errors.bidEndDate ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors.bidEndDate && (
                        <p className="text-red-500 text-sm mt-1">{errors.bidEndDate}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Bid End Time *
                      </label>
                      <input
                        type="time"
                        value={modalData.bidEndTime ? modalData.bidEndTime.slice(0, 5) : ""}
                        onChange={(e) => {
                          setModalData(prev => ({ ...prev, bidEndTime: e.target.value }));
                          if (errors.bidEndTime) setErrors(prev => ({ ...prev, bidEndTime: "" }));
                        }}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-black focus:border-black ${
                          errors.bidEndTime ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors.bidEndTime && (
                        <p className="text-red-500 text-sm mt-1">{errors.bidEndTime}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Image URL */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={modalData.image || ""}
                  onChange={(e) => {
                    setModalData(prev => ({ ...prev, image: e.target.value }));
                    if (errors.image) setErrors(prev => ({ ...prev, image: "" }));
                  }}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-black focus:border-black ${
                    errors.image ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="https://example.com/image.jpg"
                />
                {errors.image && (
                  <p className="text-red-500 text-sm mt-1">{errors.image}</p>
                )}
                {modalData.image && (
                  <div className="mt-3">
                    <img
                      src={modalData.image}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-md border border-gray-300 shadow-sm"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={modalData.description || ""}
                  onChange={(e) => {
                    setModalData(prev => ({ ...prev, description: e.target.value }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black"
                  rows={4}
                  placeholder="Enter artwork description..."
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg flex justify-end gap-3 flex-shrink-0">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors duration-200 font-medium"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar active="Art Management" />
      <main className="flex-grow p-6 bg-gray-50">
        {/* Header & buttons */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Art Management</h1>
          <div className="space-x-2">
            <button
              onClick={handleAddClick}
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
            >
              Add Art
            </button>
            <button
              onClick={generatePDF}
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
            >
              Generate PDF
            </button>
          </div>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by any column..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-1/2 mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
        />

        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            <span className="ml-3 text-gray-600">Loading...</span>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto bg-white shadow-md rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-100 border-b border-gray-300">
              <tr>
                <th className="px-4 py-2 text-left">Image</th>
                <th className="px-4 py-2 text-left">Art Code</th>
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-left">Artist</th>
                <th className="px-4 py-2 text-left">Medium</th>
                <th className="px-4 py-2 text-left">Dimensions</th>
                <th className="px-4 py-2 text-left">Price(Rs.)</th>
                <th className="px-4 py-2 text-left">Category</th>
                <th className="px-4 py-2 text-left">Collections</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredArts.map((art) => (
                <tr key={art._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">
                    <img
                      src={art.image || "https://via.placeholder.com/150"}
                      alt={art.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="px-4 py-2">{art.artCode}</td>
                  <td className="px-4 py-2">{art.title}</td>
                  <td className="px-4 py-2">{art.artist}</td>
                  <td className="px-4 py-2">{art.medium}</td>
                  <td className="px-4 py-2">{art.dimensions}</td>
                  <td className="px-4 py-2">{art.price}</td>
                  <td className="px-4 py-2">{art.category}</td>
                  <td className="px-4 py-2">
                    {(art.collections || []).join(", ")}
                  </td>
                  <td className="px-4 py-2">
                    {art.status}
                    {art.status === "Bid" && art.bidEndDate && (
                      <div className="text-xs text-gray-500">
                        Ends: {new Date(art.bidEndDate).toLocaleDateString()} {art.bidEndTime}
                      </div>
                    )}
                  </td>
                  <td
                    className="px-4 py-2 cursor-pointer underline text-black"
                    onClick={() => setDescriptionModal(art.description)}
                  >
                    {art.description && art.description.length > 30
                      ? art.description.slice(0, 30) + "..."
                      : art.description || "No description"}
                  </td>
                  <td className="px-4 py-2 flex justify-center gap-2">
                    <button
                      onClick={() => handleEditClick(art)}
                      className="px-2 py-1 bg-black text-white rounded hover:bg-gray-800 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(art)}
                      className={`px-2 py-1 text-white rounded transition ${
                        art.status === "Not Listed"
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredArts.length === 0 && !loading && (
                <tr>
                  <td colSpan={12} className="px-4 py-8 text-center text-gray-500">
                    No artworks found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Delete Confirmation Modal */}
        {deleteTarget && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
              <p className="mb-4">
                Are you sure you want to delete{" "}
                <span className="font-semibold">"{deleteTarget.title}"</span>?
                <br />
                <span className="text-sm text-red-600">This action cannot be undone.</span>
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Description Modal */}
        {descriptionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <h2 className="text-lg font-bold mb-4">Description</h2>
              <p className="mb-4 whitespace-pre-wrap leading-relaxed">
                {descriptionModal || "No description available."}
              </p>
              <button
                onClick={() => setDescriptionModal(null)}
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Add/Edit Modals */}
        {addModal && (
          <ArtModal
            isAdd
            initialData={editData}
            onSave={saveAdd}
            onClose={() => setAddModal(false)}
          />
        )}
        {editModal && (
          <ArtModal
            initialData={editData}
            onSave={saveEdit}
            onClose={() => setEditModal(false)}
          />
        )}
      </main>
    </div>
  );
}

export default AdminArtManagement;