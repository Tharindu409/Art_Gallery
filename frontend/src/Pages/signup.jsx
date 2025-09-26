import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    gmail: "",
    password: "",
    confirmPassword: "",
    phone: "",
    country: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState({});

  // Validation functions
  const validators = {
    name: (val) => /^[A-Za-z ]{2,}$/.test(val) || "Name must be at least 2 letters.",

    gmail: (val) =>
      /^\S+@\S+\.\S+$/.test(val) || "Enter a valid email address.",


    password: (val) =>
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(val) ||
      "Password must be 8+ chars, with uppercase, lowercase, number & special char.",


    confirmPassword: (val) =>
      val === form.password || "Passwords do not match.",

    phone: (val) => /^\d{7,}$/.test(val) || "Phone must be at least 10 digits.",

    country: (val) => /^[A-Za-z ]{2,}$/.test(val) || "Enter a valid country.",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Validate field on change
    if (validators[name]) {
      const valid = validators[name](value);
      setErrors((prev) => ({ ...prev, [name]: valid === true ? "" : valid }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    let valid = true;
    const newErrors = {};
    for (const field in validators) {
      const result = validators[field](form[field]);
      if (result !== true) {
        valid = false;
        newErrors[field] = result;
      }
    }
    setErrors(newErrors);

    if (!valid || !agreed) return;

    try {
      await axios.post("http://localhost:5000/api/users/register", {
        ...form,
        role: "user",
      });
      navigate("/"); // redirect to home page
    } catch (err) {
      alert(err.response?.data?.error || "Registration failed");
    }
  };

  // Check if all fields are valid
  const isFormValid =
    Object.values(errors).every((e) => e === "") &&
    Object.values(form).every((v) => v !== "") &&
    agreed;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow flex items-center justify-center px-6 py-24 transition-all duration-500">
        <div className="w-full max-w-md bg-white border border-gray-200 shadow-md p-8 rounded-lg transition-all duration-500">
          <h2 className="text-2xl font-semibold text-center text-gray-900 mb-6 uppercase tracking-wide">
            Become a Member
          </h2>

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            {/** Name */}
            <div className="relative">
              <input
                name="name"
                type="text"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded transition-all duration-300 focus:outline-none ${
                  errors.name ? "border-red-500" : "border-gray-300 focus:border-black"
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1 transition-opacity duration-300">{errors.name}</p>
              )}
            </div>

            {/** Email */}
            <div className="relative">
              <input
                name="gmail"
                type="email"
                placeholder="Email Address"
                value={form.gmail}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded transition-all duration-300 focus:outline-none ${
                  errors.gmail ? "border-red-500" : "border-gray-300 focus:border-black"
                }`}
              />
              {errors.gmail && (
                <p className="text-red-500 text-sm mt-1 transition-opacity duration-300">{errors.gmail}</p>
              )}
            </div>

            {/** Password */}
            <div className="relative">
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded transition-all duration-300 focus:outline-none ${
                  errors.password ? "border-red-500" : "border-gray-300 focus:border-black"
                }`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1 transition-opacity duration-300">{errors.password}</p>
              )}
            </div>

            {/** Confirm Password */}
            <div className="relative">
              <input
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded transition-all duration-300 focus:outline-none ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300 focus:border-black"
                }`}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1 transition-opacity duration-300">{errors.confirmPassword}</p>
              )}
            </div>

            {/** Phone */}
            <div className="relative">
              <input
                name="phone"
                type="text"
                placeholder="Phone"
                value={form.phone}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded transition-all duration-300 focus:outline-none ${
                  errors.phone ? "border-red-500" : "border-gray-300 focus:border-black"
                }`}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1 transition-opacity duration-300">{errors.phone}</p>
              )}
            </div>

            {/** Country */}
            <div className="relative">
              <input
                name="country"
                type="text"
                placeholder="Country"
                value={form.country}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded transition-all duration-300 focus:outline-none ${
                  errors.country ? "border-red-500" : "border-gray-300 focus:border-black"
                }`}
              />
              {errors.country && (
                <p className="text-red-500 text-sm mt-1 transition-opacity duration-300">{errors.country}</p>
              )}
            </div>

            {/** Agreement */}
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                checked={agreed}
                onChange={() => setAgreed(!agreed)}
                className="w-4 h-4 mt-1"
              />
              <label className="text-sm">
                I agree to the{" "}
                <a
                  href="https://www.nipo.gov.lk/web/index.php?Itemid=144&id=13&lang=en&option=com_content&view=article"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold hover:underline"
                >
                  Terms & Conditions
                </a>
              </label>
            </div>

            <button
              type="submit"
              disabled={!isFormValid}
              className={`w-full py-2.5 font-medium text-white bg-black rounded transition-all duration-300 ${
                isFormValid ? "hover:bg-gray-800 cursor-pointer" : "opacity-50 cursor-not-allowed"
              }`}
            >
              Join the Gallery
            </button>
          </form>

          <p className="text-sm text-gray-600 text-center mt-6">
            Already have an account?{" "}
            <a href="#signin" className="font-semibold hover:underline">
              Sign in
            </a>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Signup;
