import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";

function SignIn() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ gmail: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/login",
        form
      );

      // Save user to localStorage
      localStorage.setItem("user", JSON.stringify(res.data));

      // Redirect based on role
      if (res.data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex flex-col items-center justify-center flex-grow px-6 py-24">
        <div className="w-full max-w-md bg-white border border-gray-200 shadow-md p-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 uppercase mb-6">
            Rejoin the Gallery
          </h2>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="email"
              name="gmail"
              placeholder="Email Address"
              value={form.gmail}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-black text-white font-semibold transition hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <p className="text-sm text-gray-600 text-center mt-4">
            Don’t have an account?{" "}
            <a
              href="/signup"
              className="text-black font-semibold hover:underline"
            >
              Sign Up
            </a>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default SignIn;
