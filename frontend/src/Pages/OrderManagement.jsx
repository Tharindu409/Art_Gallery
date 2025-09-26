// src/pages/OrderManagement.jsx
import React, { useState, useEffect } from "react";
import AdminSidebar from "../components/AdminSlidebar";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const API_BASE = "http://localhost:5000/api/orders";

const STATUS_OPTIONS = [
  "Payment Pending",
  "Payment Verifying",
  "Payment Confirmed",
  "Processing",
  "Ready for Pickup",
  "Out for Delivery",
  "Delivered",
  "Picked Up",
  "Cancelled",
];

const SELL_TYPES = ["Direct", "Bid"];

const statusColors = {
  "Payment Pending": "bg-red-500",
  "Payment Verifying": "bg-yellow-500",
  "Payment Confirmed": "bg-blue-500",
  Processing: "bg-purple-500",
  "Ready for Pickup": "bg-indigo-500",
  "Out for Delivery": "bg-orange-500",
  Delivered: "bg-green-500",
  "Picked Up": "bg-green-600",
  Cancelled: "bg-gray-500",
};

function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [statusModal, setStatusModal] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [viewModal, setViewModal] = useState(null);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      // Normalize and sort by orderDate desc
      const normalized = data.map((o) => ({
        ...o,
        orderDate: o.orderDate ? o.orderDate.toString().slice(0, 10) : "",
        totalAmount: o.totalAmount ?? "", // backend stores string
      }));
      const sorted = normalized.sort(
        (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
      );
      setOrders(sorted);
    } catch (err) {
      console.error("Error loading orders:", err);
      alert("Error loading orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) =>
    Object.values(order).some((val) =>
      (val ?? "").toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleStatusChange = (order) => setStatusModal({ ...order });

  const updateStatus = async (newStatus) => {
    try {
      setLoading(true);
      const res = await fetch(
        `${API_BASE}/${statusModal._id || statusModal.id}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.message || `HTTP ${res.status}`);
      }
      const updated = await res.json();
      setOrders((prev) =>
        prev.map((o) =>
          (o._id || o.id) === (updated._id || updated.id)
            ? { ...o, status: updated.status }
            : o
        )
      );
      setStatusModal(null);
      alert("Order status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Error updating status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setEditData({
      artCode: "",
      artTitle: "",
      sellType: "Bid",
      fullName: "",
      deliveryAddress: "",
      phoneNumber: "",
      paymentReceipt: "",
      status: "Payment Confirmed",
      orderDate: new Date().toISOString().split("T")[0],
      totalAmount: "",
    });
    setAddModal(true);
  };

  const handleEditChange = (field, value) =>
    setEditData((prev) => ({ ...prev, [field]: value }));

  const handleReceiptUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) =>
      setEditData((prev) => ({ ...prev, paymentReceipt: event.target.result }));
    reader.readAsDataURL(file);
  };

  const isImageUrl = (url = "") =>
    /\.(png|jpe?g|gif|webp|bmp|svg)(\?.*)?$/i.test(url.trim());

  const saveAdd = async () => {
    try {
      setLoading(true);
      // Ensure totalAmount is a string per schema
      const payload = {
        ...editData,
        totalAmount: String(editData.totalAmount ?? "").trim(),
      };
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.message || `HTTP ${res.status}`);
      }
      const created = await res.json();
      const normalized = {
        ...created,
        orderDate: created.orderDate
          ? created.orderDate.toString().slice(0, 10)
          : "",
      };
      setOrders((prev) => [normalized, ...prev]);
      setAddModal(false);
      alert("Order added successfully");
    } catch (error) {
      console.error("Error adding order:", error);
      alert(error.message || "Error adding order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (order) => setDeleteTarget(order);

  const confirmDelete = async () => {
    try {
      setLoading(true);
      const id = deleteTarget._id || deleteTarget.id;
      const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.message || `HTTP ${res.status}`);
      }
      setOrders((prev) => prev.filter((o) => (o._id || o.id) !== id));
      setDeleteTarget(null);
      alert("Order deleted successfully");
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Error deleting order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("SFG Gallery - Order Report", 14, 22);

    autoTable(doc, {
      startY: 30,
      head: [
        [
          "Order ID",
          "Art Code",
          "Customer",
          "Sell Type",
          "Status",
          "Order Date",
          "Amount",
        ],
      ],
      body: orders.map((o) => [
        o._id || o.id,
        o.artCode,
        o.fullName,
        o.sellType,
        o.status,
        o.orderDate,
        o.totalAmount,
      ]),
    });

    doc.save("Order_Report.pdf");
  };

  const AddOrderModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-11/12 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">
          Add Manual Order (Bid Winner)
        </h2>
        <div className="space-y-4">
          <LabeledInput
            label="Art Code *"
            value={editData.artCode}
            onChange={(v) => handleEditChange("artCode", v)}
            placeholder="e.g. ART001"
          />
          <LabeledInput
            label="Art Title *"
            value={editData.artTitle}
            onChange={(v) => handleEditChange("artTitle", v)}
            placeholder="Artwork Title"
          />
          <LabeledSelect
            label="Sell Type"
            value={editData.sellType}
            onChange={(v) => handleEditChange("sellType", v)}
            options={SELL_TYPES}
          />
          <LabeledInput
            label="Full Name *"
            value={editData.fullName}
            onChange={(v) => handleEditChange("fullName", v)}
            placeholder="Customer Full Name"
          />
          <LabeledTextarea
            label="Delivery Address *"
            value={editData.deliveryAddress}
            onChange={(v) => handleEditChange("deliveryAddress", v)}
            placeholder="Full Delivery Address"
          />
          <LabeledInput
            label="Phone Number *"
            value={editData.phoneNumber}
            onChange={(v) => handleEditChange("phoneNumber", v)}
            placeholder="07XXXXXXXX"
          />
          <LabeledInput
            label="Total Amount *"
            value={editData.totalAmount}
            onChange={(v) => handleEditChange("totalAmount", v)}
            placeholder="LKR 00,000"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Receipt URL
            </label>

            {/* Optional preview if it looks like an image link */}
            {editData.paymentReceipt && isImageUrl(editData.paymentReceipt) && (
              <img
                src={editData.paymentReceipt}
                alt="Receipt Preview"
                className="w-32 h-40 object-cover rounded mb-2"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            )}

            {/* If not an image link, show a visit link */}
            {editData.paymentReceipt &&
              !isImageUrl(editData.paymentReceipt) && (
                <a
                  href={editData.paymentReceipt}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block mb-2 text-blue-600 hover:underline text-sm"
                >
                  Open receipt link
                </a>
              )}

            <input
              type="url"
              value={editData.paymentReceipt}
              onChange={(e) =>
                setEditData((prev) => ({
                  ...prev,
                  paymentReceipt: e.target.value,
                }))
              }
              placeholder="https://example.com/receipt.jpg or .pdf"
              className="w-full px-3 py-2 border rounded"
            />

            <p className="mt-1 text-xs text-gray-500">
              Paste a public link to the receipt (image or PDF). If it is an
              image link, a preview will appear above.
            </p>
          </div>

          <LabeledSelect
            label="Initial Status"
            value={editData.status}
            onChange={(v) => handleEditChange("status", v)}
            options={STATUS_OPTIONS}
          />
        </div>

        <div className="flex justify-end mt-4 space-x-2">
          <button
            onClick={() => setAddModal(false)}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={saveAdd}
            className="px-4 py-2 rounded bg-black text-white hover:bg-gray-800"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Order"}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      <AdminSidebar active="Order & Tracking Management" />
      <main className="flex-grow p-6 bg-gray-50">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Order & Tracking Management</h1>
          <div className="space-x-2">
            <button
              onClick={handleAddClick}
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
              disabled={loading}
            >
              Add Manual Order
            </button>
            <button
              onClick={generatePDF}
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
            >
              Generate PDF
            </button>
          </div>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by art code, customer name, status..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-4/5 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {loading && <div className="text-center py-4">Loading...</div>}

        <div className="overflow-x-auto bg-white shadow-md rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-300 border-collapse">
            <thead className="bg-gray-100 border-b border-gray-300">
              <tr>
                <Th>Order ID</Th>
                <Th>Art Code</Th>
                <Th>Art Title</Th>
                <Th>Sell Type</Th>
                <Th>Customer</Th>
                <Th>Phone</Th>
                <Th>Amount</Th>
                <Th>Status</Th>
                <Th>Order Date</Th>
                <th className="px-4 py-2 text-center text-sm font-medium text-gray-700 w-48">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr
                  key={order._id || order.id}
                  className="hover:bg-gray-50 transition"
                >
                  <Td className="font-medium">{order._id || order.id}</Td>
                  <Td className="font-mono text-blue-600">{order.artCode}</Td>
                  <Td>{order.artTitle}</Td>
                  <Td>
                    <span
                      className={`px-2 py-1 rounded text-white text-xs ${
                        order.sellType === "Direct"
                          ? "bg-green-500"
                          : "bg-purple-500"
                      }`}
                    >
                      {order.sellType}
                    </span>
                  </Td>
                  <Td>{order.fullName}</Td>
                  <Td>{order.phoneNumber}</Td>
                  <Td className="font-medium">{order.totalAmount}</Td>
                  <Td>
                    <span
                      className={`px-2 py-1 rounded text-white text-xs ${
                        statusColors[order.status]
                      }`}
                    >
                      {order.status}
                    </span>
                  </Td>
                  <Td>{order.orderDate}</Td>
                  <td className="px-4 py-2 flex justify-center gap-2">
                    <button
                      onClick={() => setViewModal(order)}
                      className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-xs"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleStatusChange(order)}
                      className="px-2 py-1 bg-black text-white rounded hover:bg-gray-800 transition text-xs"
                      disabled={loading}
                    >
                      Status
                    </button>
                    <button
                      onClick={() => handleDelete(order)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-xs"
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan="10" className="text-center py-4 text-gray-500">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {statusModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-lg font-bold mb-4">Update Order Status</h2>
              <p className="mb-4">
                <strong>Order:</strong> {statusModal.artCode} -{" "}
                {statusModal.fullName}
              </p>
              <p className="mb-4">
                <strong>Current Status:</strong>
                <span
                  className={`ml-2 px-2 py-1 rounded text-white text-xs ${
                    statusColors[statusModal.status]
                  }`}
                >
                  {statusModal.status}
                </span>
              </p>
              <div className="space-y-2">
                {STATUS_OPTIONS.map((status) => (
                  <button
                    key={status}
                    onClick={() => updateStatus(status)}
                    className={`w-full text-left px-3 py-2 rounded transition ${
                      status === statusModal.status
                        ? "bg-black text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                    disabled={loading}
                  >
                    {status}
                  </button>
                ))}
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setStatusModal(null)}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {viewModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-11/12 max-h-[90vh] overflow-y-auto">
              <h2 className="text-lg font-bold mb-4">Order Details</h2>
              <div className="space-y-3">
                <div>
                  <strong>Order ID:</strong> {viewModal._id || viewModal.id}
                </div>
                <div>
                  <strong>Art Code:</strong>{" "}
                  <span className="text-blue-600 font-mono">
                    {viewModal.artCode}
                  </span>
                </div>
                <div>
                  <strong>Art Title:</strong> {viewModal.artTitle}
                </div>
                <div>
                  <strong>Sell Type:</strong> {viewModal.sellType}
                </div>
                <div>
                  <strong>Customer:</strong> {viewModal.fullName}
                </div>
                <div>
                  <strong>Phone:</strong> {viewModal.phoneNumber}
                </div>
                <div>
                  <strong>Address:</strong> {viewModal.deliveryAddress}
                </div>
                <div>
                  <strong>Amount:</strong> {viewModal.totalAmount}
                </div>
                <div>
                  <strong>Status:</strong>
                  <span
                    className={`ml-2 px-2 py-1 rounded text-white text-xs ${
                      statusColors[viewModal.status]
                    }`}
                  >
                    {viewModal.status}
                  </span>
                </div>
                <div>
                  <strong>Order Date:</strong> {viewModal.orderDate}
                </div>
                {viewModal.paymentReceipt && (
                  <div>
                    <strong>Payment Receipt:</strong>
                    <img
                      src={viewModal.paymentReceipt}
                      alt="Payment Receipt"
                      className="mt-2 max-w-full h-auto rounded"
                    />
                  </div>
                )}
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setViewModal(null)}
                  className="px-4 py-2 rounded bg-black text-white hover:bg-gray-800"
                >
                  Close
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
                Are you sure you want to delete order{" "}
                <strong>{deleteTarget.artCode}</strong> for{" "}
                <strong>{deleteTarget.fullName}</strong>?
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
                  disabled={loading}
                >
                  {loading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}

        {addModal && <AddOrderModal />}
      </main>
    </div>
  );
}

/* Small presentational helpers */
const Th = ({ children }) => (
  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-r">
    {children}
  </th>
);
const Td = ({ children, className = "" }) => (
  <td className={`px-4 py-2 border-r ${className}`}>{children}</td>
);

const LabeledInput = ({ label, value, onChange, placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border rounded"
      placeholder={placeholder}
    />
  </div>
);

const LabeledTextarea = ({ label, value, onChange, placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border rounded"
      rows={3}
      placeholder={placeholder}
    />
  </div>
);

const LabeledSelect = ({ label, value, onChange, options }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border rounded"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

export default OrderManagement;
