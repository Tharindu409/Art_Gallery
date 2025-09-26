// src/pages/ExhibitionManagement.jsx
import React, { useState, useEffect } from "react";
import AdminSidebar from "../components/AdminSlidebar";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const statusColors = {
  upcoming: "bg-blue-500",
  showing: "bg-green-500",
  past: "bg-red-500",
};

const STATUS_OPTIONS = ["upcoming", "showing", "past"];

function ExhibitionManagement() {
  const [exhibitions, setExhibitions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [showDescription, setShowDescription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const API_BASE = "http://localhost:5000/api/exhibitions";

  useEffect(() => {
    loadExhibitions();
  }, []);

  const loadExhibitions = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_BASE);
      let data;
      try {
        data = await res.json();
      } catch (err) {
        console.error("Invalid JSON from API", err);
        data = { exhibitions: [] };
      }
      setExhibitions(Array.isArray(data.exhibitions) ? data.exhibitions : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredExhibitions = (exhibitions || []).filter(
    (ex) =>
      ex &&
      Object.values(ex)
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  const handleDelete = (ex) => setDeleteTarget(ex);

  const confirmDelete = async () => {
    try {
      setLoading(true);
      await fetch(`${API_BASE}/${deleteTarget._id}`, { method: "DELETE" });
      window.location.reload();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const cancelDelete = () => setDeleteTarget(null);

  const handleAddClick = () => {
    setEditData({
      title: "",
      description: "",
      startdate: "",
      enddate: "",
      starttime: "",
      endtime: "",
      venue: "",
      image: "",
      status: "upcoming", // Changed back to "upcoming"
    });
    setErrors({});
    setAddModal(true);
  };

  const handleEditClick = (ex) => {
    setEditData({ ...ex });
    setErrors({});
    setEditModal(true);
  };

  const handleEditChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" })); // Clear error on change
  };

  const validateFields = () => {
    const newErrors = {};
    if (!editData.title) newErrors.title = "Title is required";
    if (!editData.startdate) newErrors.startdate = "Start Date is required";
    if (!editData.enddate) newErrors.enddate = "End Date is required";
    if (!editData.venue) newErrors.venue = "Venue is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveAdd = async () => {
    if (!validateFields()) return;
    try {
      setLoading(true);
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      const data = await res.json();
      setExhibitions((prev) => [data.exhibition || data, ...prev]);
      setAddModal(false);
      setErrors({});
      window.location.reload();
    } catch (err) {
      console.error("Add exhibition error:", err);
    } finally {
      setLoading(false);
    }
  };

  const saveEdit = async () => {
    if (!validateFields()) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/${editData._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      const data = await res.json();
      setExhibitions((prev) =>
        prev.map((ex) => (ex._id === data.exhibition._id ? data.exhibition : ex))
      );
      setEditModal(false);
      setErrors({});
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const now = new Date();
    doc.setFontSize(14);
    doc.text(
      `SFG Gallery - Exhibition Report`,
      14,
      15
    );
    doc.setFontSize(10);
    doc.text(`Generated: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`, 14, 22);

    autoTable(doc, {
      startY: 28,
      head: [["Title", "Start", "End", "Status", "Venue", "Description"]],
      body: exhibitions.map((ex) => [
        ex.title || "-",
        ex.startdate ? new Date(ex.startdate).toLocaleDateString() : "-",
        ex.enddate ? new Date(ex.enddate).toLocaleDateString() : "-",
        ex.status || "-",
        ex.venue || "-",
        ex.description || "-",
      ]),
      styles: { cellWidth: 'wrap', fontSize: 9, overflow: 'linebreak' },
      columnStyles: { 5: { cellWidth: 40 } }, // Shrink description column
    });

    doc.save("Exhibition_Report.pdf");
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar active="Exhibition Management" />
      <main className="flex-grow p-6 bg-gray-50">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Exhibition Management</h1>
          <div className="space-x-2">
            <button onClick={handleAddClick} className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
              Add Exhibition
            </button>
            <button onClick={generatePDF} className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
              Generate PDF
            </button>
          </div>
        </div>

        <input
          type="text"
          placeholder="Search exhibitions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-4/5 px-4 py-2 border rounded mb-4"
        />

        <div className="overflow-x-auto bg-white shadow-md rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-300 border-collapse">
            <thead className="bg-gray-100 border-b border-gray-300">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium border-r">Image</th>
                <th className="px-4 py-2 text-left text-sm font-medium border-r">Title</th>
                <th className="px-4 py-2 text-left text-sm font-medium border-r">Start</th>
                <th className="px-4 py-2 text-left text-sm font-medium border-r">End</th>
                <th className="px-4 py-2 text-left text-sm font-medium border-r">Status</th>
                <th className="px-4 py-2 text-left text-sm font-medium border-r">Venue</th>
                <th className="px-4 py-2 text-left text-sm font-medium border-r">Description</th>
                <th className="px-4 py-2 text-center text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {(filteredExhibitions || []).map((ex) => (
                <tr key={ex._id || Math.random()} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-2 border-r">
                    <img src={ex.image || "https://via.placeholder.com/150"} alt={ex.title || "Exhibition"} className="w-16 h-16 object-cover rounded" />
                  </td>
                  <td className="px-4 py-2 border-r">{ex.title || "-"}</td>
                  <td className="px-4 py-2 border-r">{ex.startdate ? new Date(ex.startdate).toLocaleDateString() : "-"}</td>
                  <td className="px-4 py-2 border-r">{ex.enddate ? new Date(ex.enddate).toLocaleDateString() : "-"}</td>
                  <td className="px-4 py-2 border-r">
                    <span className={`px-2 py-1 rounded text-white text-xs ${statusColors[ex.status] || "bg-gray-400"}`}>
                      {ex.status || "-"}
                    </span>
                  </td>
                  <td className="px-4 py-2 border-r">{ex.venue || "-"}</td>
                  <td className="px-4 py-2 border-r">
                    <button className="text-black underline" onClick={() => setShowDescription(ex)}>View</button>
                  </td>
                  <td className="px-4 py-2 flex justify-center gap-2">
                    <button onClick={() => handleEditClick(ex)} className="px-3 py-1 bg-black text-white rounded hover:bg-gray-800">Edit</button>
                    <button onClick={() => handleDelete(ex)} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
                  </td>
                </tr>
              ))}
              {filteredExhibitions.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-4 text-gray-500">No exhibitions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modals for Delete, Description, Add/Edit */}
        {deleteTarget && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
              <p>Are you sure you want to delete "{deleteTarget.title}"?</p>
              <div className="flex justify-end mt-4 space-x-2">
                <button onClick={cancelDelete} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400" disabled={loading}>Cancel</button>
                <button onClick={confirmDelete} className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700" disabled={loading}>{loading ? "Deleting..." : "Delete"}</button>
              </div>
            </div>
          </div>
        )}

        {showDescription && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[500px] max-h-[70vh] overflow-y-auto">
              <h2 className="text-lg font-bold mb-4">{showDescription.title} - Description</h2>
              <p className="text-gray-700">{showDescription.description}</p>
              <div className="flex justify-end mt-4">
                <button onClick={() => setShowDescription(null)} className="px-4 py-2 rounded bg-black text-white hover:bg-gray-800">Close</button>
              </div>
            </div>
          </div>
        )}

        {(addModal || editModal) && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-11/12 max-h-[90vh] overflow-y-auto">
              <h2 className="text-lg font-bold mb-4">{addModal ? "Add New Exhibition" : "Edit Exhibition"}</h2>
              <div className="space-y-4">
                {/* Image */}
                <div>
                  <label>Image URL</label>
                  <input
                    type="text"
                    value={editData.image || ""}
                    onChange={(e) => handleEditChange("image", e.target.value)}
                    className={`w-full px-3 py-2 border rounded ${errors.image ? "border-red-500" : "border-gray-300"}`}
                    placeholder="https://example.com/image.jpg"
                  />
                  {editData.image && <img src={editData.image} alt="Preview" className="w-32 h-32 object-cover rounded mt-2" />}
                </div>

                {/* Title */}
                <div>
                  <label>Title</label>
                  <input
                    type="text"
                    value={editData.title || ""}
                    onChange={(e) => handleEditChange("title", e.target.value)}
                    className={`w-full px-3 py-2 border rounded ${errors.title ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>

                {/* Dates */}
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label>Start Date</label>
                    <input
                      type="date"
                      value={editData.startdate?.split("T")[0] || ""}
                      onChange={(e) => handleEditChange("startdate", e.target.value)}
                      className={`w-full px-3 py-2 border rounded ${errors.startdate ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.startdate && <p className="text-red-500 text-sm mt-1">{errors.startdate}</p>}
                  </div>
                  <div className="flex-1">
                    <label>End Date</label>
                    <input
                      type="date"
                      value={editData.enddate?.split("T")[0] || ""}
                      onChange={(e) => handleEditChange("enddate", e.target.value)}
                      className={`w-full px-3 py-2 border rounded ${errors.enddate ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.enddate && <p className="text-red-500 text-sm mt-1">{errors.enddate}</p>}
                  </div>
                </div>

                {/* Times */}
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label>Start Time</label>
                    <input type="time" value={editData.starttime || ""} onChange={(e) => handleEditChange("starttime", e.target.value)} className="w-full px-3 py-2 border rounded" />
                  </div>
                  <div className="flex-1">
                    <label>End Time</label>
                    <input type="time" value={editData.endtime || ""} onChange={(e) => handleEditChange("endtime", e.target.value)} className="w-full px-3 py-2 border rounded" />
                  </div>
                </div>

                {/* Venue */}
                <div>
                  <label>Venue</label>
                  <input
                    type="text"
                    value={editData.venue || ""}
                    onChange={(e) => handleEditChange("venue", e.target.value)}
                    className={`w-full px-3 py-2 border rounded ${errors.venue ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.venue && <p className="text-red-500 text-sm mt-1">{errors.venue}</p>}
                </div>

                {/* Status */}
                <div>
                  <label>Status</label>
                  <select value={editData.status || "upcoming"} onChange={(e) => handleEditChange("status", e.target.value)} className="w-full px-3 py-2 border rounded">
                    {STATUS_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label>Description</label>
                  <textarea value={editData.description || ""} onChange={(e) => handleEditChange("description", e.target.value)} className="w-full px-3 py-2 border rounded" rows={4} />
                </div>
              </div>

              <div className="flex justify-end mt-4 space-x-2">
                <button onClick={() => { addModal ? setAddModal(false) : setEditModal(false); setErrors({}); }} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400" disabled={loading}>Cancel</button>
                <button onClick={addModal ? saveAdd : saveEdit} className="px-4 py-2 rounded bg-black text-white hover:bg-gray-800" disabled={loading}>{loading ? "Saving..." : "Save"}</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default ExhibitionManagement;