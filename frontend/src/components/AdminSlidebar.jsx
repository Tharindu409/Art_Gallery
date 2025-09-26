// src/components/AdminSidebar.jsx
import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

function AdminSidebar({ onLogout }) {
  const items = [
    { label: "Art Management", to: "/admin/art-management" },
    { label: "Order & Tracking Management", to: "/admin/order-management" },
    { label: "User Management", to: "/admin/user-management" },
    { label: "Exhibition Management", to: "/admin/exhibition-management" },
    { label: "Bidding Management", to: "/admin/bidding-management" },
  ];

  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [animate, setAnimate] = useState(false); // Smooth animation
  const [closing, setClosing] = useState(false); // For smooth closing

  const storedUser = JSON.parse(localStorage.getItem("user")) || {
    name: "Admin User",
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    if (onLogout) onLogout();
    setClosing(true); // trigger closing animation
    setTimeout(() => {
      setShowConfirm(false);
      navigate("/signin");
    }, 300); // match animation duration
  };

  // Trigger animation when modal opens
  useEffect(() => {
    if (showConfirm && !closing) {
      const timer = setTimeout(() => setAnimate(true), 10); // trigger opening transition
      return () => clearTimeout(timer);
    } else {
      setAnimate(false);
    }
  }, [showConfirm, closing]);

  const base = "block px-4 py-2 rounded transition-colors duration-200 text-sm";

  return (
    <>
      <aside className="w-64 bg-gray-100 min-h-screen p-6">
        {/* Admin Header */}
        <div className="flex flex-col items-center mb-6 pb-4 border-b border-gray-300">
          <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-3">
            <span className="text-white font-bold text-xl">A</span>
          </div>
          <h2 className="text-lg font-bold text-gray-800">{storedUser.name}</h2>
          <p className="text-sm text-gray-600">Administrator</p>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {items.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                isActive
                  ? `${base} bg-black text-white`
                  : `${base} text-gray-800 hover:bg-gray-200`
              }
              end
            >
              {label}
            </NavLink>
          ))}

          {/* Logout */}
          <button
            type="button"
            onClick={() => { setShowConfirm(true); setClosing(false); }}
            className={`${base} text-red-700 hover:bg-red-50 w-full text-left mt-4 border-t border-gray-300 pt-4 cursor-pointer`}
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 transition-opacity duration-300 ${
            animate && !closing ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className={`bg-white p-6 rounded-lg shadow-lg w-96 transform transition-all duration-300 ${
              animate && !closing ? "scale-100 opacity-100" : "scale-90 opacity-0"
            }`}
          >
            <h2 className="text-lg font-bold mb-4">Confirm Logout</h2>
            <p className="mb-4">Are you sure you want to logout?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setClosing(true) & setTimeout(() => setShowConfirm(false), 300)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminSidebar;
