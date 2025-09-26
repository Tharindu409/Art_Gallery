import React, { useState, useEffect } from "react";
import AdminSidebar from "../components/AdminSlidebar";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null); // for modal
  const [modalOpen, setModalOpen] = useState(false);


  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users/all");
      const sortedUsers = response.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setUsers(sortedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:5000/api/users/admin/${id}`);
        alert("User deleted successfully!");
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user.");
      }
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  const handleModalChange = (e) => {
    setEditingUser({ ...editingUser, [e.target.name]: e.target.value });
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/users/admin/${editingUser._id}`,
        editingUser
      );
      alert("User updated successfully!");
      setModalOpen(false);
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user.");
    }
  };

  const filteredUsers = users.filter((user) =>
    Object.values(user)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

    //pdf generation parts


  const generatePDF = () => {
    const doc = new jsPDF();
    const now = new Date();

    doc.setFontSize(18);
    doc.text("Gallery User Report", 14, 20);

    doc.setFontSize(10);
    doc.text(
      `Generated: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`,
      14,
      28
    );


    const tableColumn = ["#", "Name", "Email", "Country", "Phone"];
    const sortedUsersForPDF = [...filteredUsers].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );
    const tableRows = sortedUsersForPDF.map((u, index) => [
      index + 1,
      u.name || "N/A",
      u.gmail || "N/A",
      u.country || "N/A",
      u.phone || "N/A",
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 36,
      styles: { fontSize: 10, cellPadding: 4 },
      headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [240, 240, 240] },
    });

    doc.save("user_report.pdf");
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar active="User Management" />

      <main className="flex-grow p-6 bg-gray-50">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">User Management</h1>
          <button
            onClick={generatePDF}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
          >
            Generate PDF
          </button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-4/5 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {loading ? (
          <p className="text-center">Loading users...</p>
        ) : (
          <div className="overflow-x-auto bg-white shadow-md rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-300 border-collapse">
              <thead className="bg-gray-100 border-b border-gray-300">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium border-r">#</th>
                  <th className="px-4 py-2 text-left text-sm font-medium border-r">Name</th>
                  <th className="px-4 py-2 text-left text-sm font-medium border-r">Email</th>
                  <th className="px-4 py-2 text-left text-sm font-medium border-r">Country</th>
                  <th className="px-4 py-2 text-left text-sm font-medium border-r">Phone Number</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user, index) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-2 border-r">{users.length - index}</td>
                    <td className="px-4 py-2 border-r">{user.name}</td>
                    <td className="px-4 py-2 border-r">{user.gmail}</td>
                    <td className="px-4 py-2 border-r">{user.country}</td>
                    <td className="px-4 py-2 border-r">{user.phone}</td>
                    <td className="px-4 py-2 flex space-x-2">

                      <button
                        onClick={() => handleEdit(user)}
                        className="px-3 py-1 bg-black text-white rounded"
                      >
                        Edit
                      </button>
                      
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="px-3 py-1 bg-red-600 text-white rounded"
                      >
                        Delete
                      </button>

                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-gray-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal */}
        {modalOpen && editingUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Edit User</h2>
              <form onSubmit={handleModalSubmit} className="space-y-4">
                <div>
                  <label className="block mb-1 font-medium">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editingUser.name}
                    onChange={handleModalChange}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Email</label>
                  <input
                    type="email"
                    name="gmail"
                    value={editingUser.gmail}
                    onChange={handleModalChange}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={editingUser.phone}
                    onChange={handleModalChange}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={editingUser.country}
                    onChange={handleModalChange}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Role</label>
                  <select
                    name="role"
                    value={editingUser.role}
                    onChange={handleModalChange}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded border"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-black text-white rounded"
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default UserManagement;
