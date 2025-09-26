// src/pages/BiddingManagement.jsx
import React, { useState, useEffect } from "react";
import AdminSidebar from "../components/AdminSlidebar";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const STATUS_OPTIONS = ["Open", "Closed", "Completed", "Cancelled"];

// MOCK API
// src/pages/BiddingManagement.jsx
const API_BASE = "http://localhost:5000/api/bidding";

const biddingAPI = {
  fetchBiddingSessions: async () => {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error("Failed to fetch sessions");
    return await res.json();
  },
  fetchBidsForSession: async (sessionId) => {
    const res = await fetch(`${API_BASE}/${sessionId}/bids`);
    if (!res.ok) throw new Error("Failed to fetch bids");
    return await res.json();
  },
  cancelSession: async (id) => {
    const res = await fetch(`${API_BASE}/${id}/cancel`, {
      method: "PUT",
    });
    if (!res.ok) throw new Error("Failed to cancel session");
    return await res.json();
  },
  deleteSession: async (id) => {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete session");
    return await res.json();
  },
};

function BiddingManagement() {
  const [sessions, setSessions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSession, setSelectedSession] = useState(null);
  const [bids, setBids] = useState([]);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    setLoading(true);
    try {
      const data = await biddingAPI.fetchBiddingSessions();
      const mapped = data.map((s) => ({
        id: s._id,
        artId: s.art?._id || "N/A",
        artTitle: s.art?.title || "Untitled",
        startingPrice: s.startingPrice,
        totalBids: s.bids?.length || 0,
        bidEndDate: s.bidEndDate?.split("T")[0] || "",
        bidEndTime: s.bidEndTime || "",
        status: s.status,
        highestBid:
          s.bids?.length > 0 ? Math.max(...s.bids.map((b) => b.offerPrice)) : 0,
      }));
      setSessions(mapped);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSessions = sessions.filter((s) =>
    Object.values(s).join(" ").toLowerCase().includes(searchQuery.toLowerCase())
  );
  const handleViewBids = async (session) => {
    setSelectedSession(session);
    try {
      const bidsData = await biddingAPI.fetchBidsForSession(session.id);
      const mappedBids = bidsData.map((b) => ({
        id: b._id,
        name: b.name,
        offerPrice: b.offerPrice,
        contact: b.contact,
        note: b.note,
        bidTime: new Date(b.bidTime).toLocaleString(),
      }));
      setBids(mappedBids.sort((a, b) => b.offerPrice - a.offerPrice));
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancelClick = (session) => setCancelTarget(session);

  const cancelCancel = () => setCancelTarget(null);

  // --- PDF REPORT GENERATION ---
  const generateReport = async () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Bidding Report", 14, 22);

    sessions.forEach((session, idx) => {
      const sessionBids = mockBids[session.id] || [];
      const startY = (doc.lastAutoTable?.finalY || 26) + (idx === 0 ? 8 : 14);

      doc.setFontSize(14);
      doc.text(`${session.artTitle} (${session.artId})`, 14, startY);

      autoTable(doc, {
        startY: startY + 4,
        head: [["Bidder", "Offer Price", "Contact", "Note", "Bid Time"]],
        body: sessionBids.length
          ? sessionBids.map((b) => [
              b.name,
              b.offerPrice.toLocaleString(),
              b.contact,
              b.note || "-",
              b.bidTime,
            ])
          : [["-", "-", "-", "-", "-"]],
      });
    });

    doc.save("Bidding_Report.pdf");
  };

  const handleDeleteClick = (session) => setDeleteTarget(session);
  const cancelDelete = () => setDeleteTarget(null);

  const confirmDelete = async () => {
    try {
      setLoading(true);
      await biddingAPI.deleteSession(deleteTarget.id);
      setSessions((prev) => prev.filter((s) => s.id !== deleteTarget.id));
      setDeleteTarget(null);
      alert("Bidding session deleted successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to delete session.");
    } finally {
      setLoading(false);
    }
  };

  const confirmCancel = async () => {
    if (!cancelTarget) return;

    try {
      setLoading(true);
      await biddingAPI.cancelSession(cancelTarget.id);

      // Update local state
      setSessions((prev) =>
        prev.map((s) =>
          s.id === cancelTarget.id ? { ...s, status: "Cancelled" } : s
        )
      );

      alert("Bidding session cancelled successfully!");
      setCancelTarget(null);
    } catch (error) {
      console.error(error);
      alert("Failed to cancel session.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar active="Bidding Management" />
      <main className="flex-grow p-6 bg-gray-50">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Bidding Management</h1>
        </div>

        <div className="mb-4 flex gap-2 md:flex-row flex-col">
          <input
            type="text"
            placeholder="Search bidding sessions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-4/5 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
          <button
            onClick={generateReport}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
          >
            Generate Report
          </button>
        </div>

        {loading && <div className="text-center py-4">Loading...</div>}

        <div className="overflow-x-auto bg-white shadow-md rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-300 border-collapse">
            <thead className="bg-gray-100 border-b border-gray-300">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium border-r">
                  Art ID
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium border-r">
                  Art Title
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium border-r">
                  Starting Price
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium border-r">
                  Bids
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium border-r">
                  Bid End
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium border-r">
                  Status
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium border-r">
                  Highest Bid
                </th>
                <th className="px-4 py-2 text-center text-sm font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSessions.map((s) => (
                <tr
                  key={s.id}
                  className={`hover:bg-gray-50 transition ${
                    s.status === "Cancelled" ? "bg-gray-100 text-gray-500" : ""
                  }`}
                >
                  <td className="px-4 py-2 border-r">{s.artId}</td>
                  <td className="px-4 py-2 border-r">{s.artTitle}</td>
                  <td className="px-4 py-2 border-r">
                    LKR {s.startingPrice.toLocaleString()}
                  </td>
                  <td className="px-4 py-2 border-r text-center">
                    {s.totalBids}
                  </td>
                  <td className="px-4 py-2 border-r">
                    {s.bidEndDate} {s.bidEndTime}
                  </td>
                  <td className="px-4 py-2 border-r">{s.status}</td>
                  <td className="px-4 py-2 border-r">
                    LKR {s.highestBid.toLocaleString()}
                  </td>
                  <td className="px-4 py-2 flex justify-center gap-2">
                    <button
                      onClick={() => handleViewBids(s)}
                      className={`px-3 py-1 rounded transition ${
                        s.status === "Cancelled"
                          ? "bg-gray-400 text-white cursor-not-allowed"
                          : "bg-black text-white hover:bg-gray-800"
                      }`}
                      disabled={s.status === "Cancelled"}
                    >
                      View Bids
                    </button>

                    <button
                      onClick={() => handleCancelClick(s)}
                      className={`px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition ${
                        s.status === "Cancelled"
                          ? "cursor-not-allowed opacity-50"
                          : ""
                      }`}
                      disabled={s.status === "Cancelled"}
                    >
                      Cancel
                    </button>

                    <button
                      onClick={() => handleDeleteClick(s)}
                      className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredSessions.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-4 text-gray-500">
                    No bidding sessions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Bids Modal */}
        {selectedSession && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-11/12 max-h-[80vh] overflow-y-auto">
              <h2 className="text-lg font-bold mb-4">
                Bids for {selectedSession.artTitle}
              </h2>
              {bids.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No bids yet</p>
              ) : (
                <div className="space-y-3">
                  {bids.map((b, idx) => (
                    <div key={b.id} className="border p-3 rounded shadow-sm">
                      <p className="font-bold">
                        #{idx + 1} - LKR {b.offerPrice.toLocaleString()}
                      </p>
                      <p className="text-gray-900 font-medium">{b.name}</p>
                      <p className="text-gray-600 text-sm">
                        Contact: {b.contact}
                      </p>
                      {b.note && (
                        <p className="italic text-gray-700 bg-gray-100 p-2 rounded mt-1">
                          Note: {b.note}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        Bid Time: {b.bidTime}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setSelectedSession(null)}
                  className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cancel Confirmation Modal */}
        {cancelTarget && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-lg font-bold mb-4">Confirm Cancel</h2>
              <p className="mb-4">
                Cancelling this bidding session will remove it from Bidding
                Management and set the art status to <strong>Not Listed</strong>
                .
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={cancelCancel}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmCancel}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {deleteTarget && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
              <p className="mb-4">
                Are you sure you want to delete the bidding session for{" "}
                <strong>{deleteTarget.artTitle}</strong>?
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default BiddingManagement;
