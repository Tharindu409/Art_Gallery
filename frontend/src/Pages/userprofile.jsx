import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";

function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteAgreed, setDeleteAgreed] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        const res = await axios.get(
          `http://localhost:5000/api/users/profile/${user._id}`
        );
        setProfileData(res.data);

        // Only set editData if it's empty (initial load)
        setEditData((prev) => ({
          name: prev.name || res.data.name || "",
          gmail: prev.gmail || res.data.gmail || "",
          phone: prev.phone || res.data.phone || "",
          password: "",
        }));
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleEditToggle = async () => {
    if (isEditing) {
      // Save changes
      try {
        const updatePayload = {
          name: editData.name,
          gmail: editData.gmail,
          phone: editData.phone,
        };
        if (editData.password) updatePayload.password = editData.password;

        const res = await axios.put(
          `http://localhost:5000/api/users/profile/${user._id}`,
          updatePayload
        );

        setProfileData(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
        alert("Profile updated successfully!");
      } catch (err) {
        console.error(err);
        alert("Failed to update profile.");
      }
    } else {
      // Toggle to editing mode; no need to reset editData here
    }
    setIsEditing(!isEditing);
  };

  const handleCancelEdit = () => {
    setEditData({
      name: profileData.name || "",
      gmail: profileData.gmail || "",
      phone: profileData.phone || "",
      password: "",
    });
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditData({ ...editData, [field]: value });
  };

  const handleDeleteAccount = async () => {
    if (!deleteAgreed) return;
    try {
      await axios.delete(`http://localhost:5000/api/users/profile/${user._id}`);
      alert("Account deleted successfully!");
      localStorage.removeItem("user");
      window.location.href = "/signin";
    } catch (err) {
      console.error(err);
      alert("Failed to delete account.");
    }
  };

  if (loading) return <p className="text-center mt-20">Loading profile...</p>;
  if (!profileData)
    return <p className="text-center mt-20">No profile data found.</p>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-grow flex items-center justify-center px-6 py-24">
        <div className="w-full max-w-md bg-white border border-gray-200 shadow-md p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 uppercase tracking-wide">
              My Profile
            </h2>
            <button
              onClick={handleEditToggle}
              className="text-sm uppercase tracking-wide font-medium text-black hover:underline"
            >
              {isEditing ? "Save" : "Edit"}
            </button>
          </div>

          <div className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              ) : (
                <p className="w-full px-4 py-2 border border-gray-200 bg-gray-50 text-sm text-gray-900">
                  {profileData.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={editData.gmail || ""}
                  onChange={(e) => handleInputChange("gmail", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              ) : (
                <p className="w-full px-4 py-2 border border-gray-200 bg-gray-50 text-sm text-gray-900">
                  {profileData.gmail}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.phone || ""}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              ) : (
                <p className="w-full px-4 py-2 border border-gray-200 bg-gray-50 text-sm text-gray-900">
                  {profileData.phone || "-"}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              {isEditing ? (
                <input
                  type="password"
                  placeholder="Enter new password"
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              ) : (
                <p className="w-full px-4 py-2 border border-gray-200 bg-gray-50 text-sm text-gray-900">
                  {profileData.password ? "••••••••" : ""}
                </p>
              )}
            </div>

            {/* Join Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Member Since
              </label>
              <p className="w-full px-4 py-2 border border-gray-200 bg-gray-100 text-sm text-gray-600">
                {new Date(profileData.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-3 pt-4">
              {isEditing && (
                <button
                  onClick={handleCancelEdit}
                  className="w-full py-2.5 font-medium uppercase tracking-wide text-black border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              )}

              <button
                onClick={() => setShowDeleteModal(true)}
                className="w-full py-2.5 font-medium uppercase tracking-wide text-white bg-red-600 hover:bg-red-700 transition-colors"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 max-w-sm w-full border border-gray-200 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 uppercase tracking-wide">
              Delete Account
            </h3>

            <p className="text-sm text-gray-700 mb-6">
              Are you sure you want to permanently delete your account? This
              action cannot be undone.
            </p>

            <div className="flex items-start space-x-2 mb-6">
              <input
                type="checkbox"
                id="deleteAgreement"
                checked={deleteAgreed}
                onChange={() => setDeleteAgreed(!deleteAgreed)}
                className="w-4 h-4 mt-1 accent-red-600"
              />
              <label
                htmlFor="deleteAgreement"
                className="text-sm text-gray-700"
              >
                I understand that deleting my account will permanently remove
                all my data, including purchase history, active bids, and
                membership benefits.
              </label>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2.5 font-medium uppercase tracking-wide text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={!deleteAgreed}
                className={`flex-1 py-2.5 font-medium uppercase tracking-wide text-white transition-colors ${
                  deleteAgreed
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;