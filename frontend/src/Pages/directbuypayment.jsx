import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import Header from "../components/Header";
import Footer from "../components/Footer";

// Initialize Supabase client
const supabase = createClient(
  "https://cejlwbqbvfvrtcgghfbt.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlamx3YnFidmZ2cnRjZ2doZmJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4MjY3MTQsImV4cCI6MjA3MjQwMjcxNH0.WFpD0Ke6j980I6SEAMtvpm-PZFTNUbxTZoqu6j1OToc"
);

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const artData = location.state?.art;

  const [paymentSubmitted, setPaymentSubmitted] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptUrl, setReceiptUrl] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [deliveryOption, setDeliveryOption] = useState("delivery");
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    address: "",
    phone: "",
    pickupDate: "",
    pickupTime: "",
  });
  const [copiedField, setCopiedField] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // If no art data is provided
  if (!artData) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <div className="flex-grow flex items-center justify-center px-6 py-24">
          <div className="text-center">
            <p className="text-xl text-gray-900 mb-4">No artwork selected.</p>
            <p className="text-sm text-gray-600 mb-6">
              Please select an artwork to proceed with the payment.
            </p>
            <button
              onClick={() => navigate("/")}
              className="py-2.5 px-6 font-medium uppercase tracking-wide text-white bg-black hover:bg-gray-800 transition-colors"
            >
              Return to Gallery
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const bankDetails = {
    bankName: "Bank of Ceylon",
    accountName: "Ceylon Galleria",
    accountNumber: "7234567890",
    branch: "Colombo Main Branch",
    swiftCode: "BCEYLKLX",
  };

  const galleryDetails = {
    name: "Ceylon Galleria",
    address: "No. 45, Galle Road, Colombo 03, Sri Lanka",
    phone: "+94 11 234 5678",
    email: "info@ceylongalleria.lk",
    hours: "Tuesday to Sunday: 9:00 AM - 6:00 PM",
    closed: "Closed on Mondays and Public Holidays",
    parkingInfo: "Free parking available for customers",
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      const time = `${hour.toString().padStart(2, "0")}:00`;
      const displayTime = `${hour > 12 ? hour - 12 : hour}:00 ${
        hour >= 12 ? "PM" : "AM"
      }`;
      slots.push({ value: time, display: displayTime });
    }
    return slots;
  };
  const timeSlots = generateTimeSlots();

  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    let currentDate = new Date(today);
    currentDate.setDate(currentDate.getDate() + 1);

    while (dates.length < 14) {
      if (currentDate.getDay() !== 1) {
        const dateStr = currentDate.toISOString().split("T")[0];
        const displayDate = currentDate.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        dates.push({ value: dateStr, display: displayDate });
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };
  const availableDates = generateAvailableDates();

  const handleFileUpload = async (event) => {
    const url = event.target.value;
    setReceiptUrl(url);
    setError(null);

    // ✅ Keep: validate receipt URL format only
    try {
      new URL(url); // throws if invalid
      setReceiptUrl(url);
    } catch {
      setError(
        "Please enter a valid URL (e.g., https://example.com/receipt.jpg)"
      );
    }

    /*
    // File upload logic (kept commented as in your version)
    */
  };

  const handleCustomerInfoChange = (field, value) => {
    setCustomerInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // put this helper above handleSubmit (or outside the component)
  function getNumericPrice(price) {
    if (price == null) return NaN;
    if (typeof price === "number") return price;
    if (typeof price === "string") {
      // remove currency, spaces, commas
      const cleaned = price.replace(/[^\d.]/g, "");
      // if there are multiple dots (e.g., "45.000.00"), keep the first
      const firstDot = cleaned.indexOf(".");
      const normalized =
        firstDot === -1
          ? cleaned
          : cleaned.slice(0, firstDot + 1) +
            cleaned.slice(firstDot + 1).replace(/\./g, "");
      const n = Number(normalized);
      return Number.isFinite(n) ? n : NaN;
    }
    return NaN;
  }

  const copyToClipboard = async (text, fieldName) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(""), 2000);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(""), 2000);
    }
  };

  /* ❌ Commented: phone validation and test logs
  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^07\d{8}$/; // 07 + 8 digits
    return phoneRegex.test(phone);
  };

  console.log(validatePhoneNumber("0771234567")); // ✅ true
  console.log(validatePhoneNumber("071234567")); // ❌ false (only 9 digits)
  console.log(validatePhoneNumber("+94771234567")); // ❌ false (has +94)
  */

  const handleSubmit = async () => {
    setError(null);
    setIsLoading(true);

    // ✅ only require a valid receipt URL per your request
    if (!receiptUrl) {
      setError("Please provide a valid payment receipt URL.");
      setIsLoading(false);
      return;
    }

    // ✅ robust price parsing
    const totalAmount = getNumericPrice(artData?.price);
    if (!Number.isFinite(totalAmount) || totalAmount <= 0) {
      setError("Invalid price format. Please contact support.");
      setIsLoading(false);
      return;
    }

    const orderData = {
      artCode: artData?.id || `ART${Math.floor(Math.random() * 1000)}`,
      artTitle: artData?.title ?? "Untitled",
      sellType: "Direct",
      fullName: (customerInfo.name || "").trim(),
      deliveryAddress:
        deliveryOption === "delivery"
          ? (customerInfo.address || "").trim()
          : galleryDetails.address,
      phoneNumber: customerInfo.phone || "",
      paymentReceipt: receiptUrl,
      status: "Payment Pending",
      // send as a number (or use String(totalAmount) if your API expects a string)
      totalAmount,
    };

    try {
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error ${response.status}`);
      }

      setPaymentSubmitted(true);
      setShowSuccessModal(true);
      setError(null);
    } catch (err) {
      setError(`Failed to submit order: ${err.message}`);
      console.error("Submission Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    navigate("/");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-grow flex items-start justify-center px-6 py-24">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Art Details Section */}
          <section className="bg-white border border-gray-200 shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 uppercase tracking-wide">
              Purchase Details
            </h2>

            <div className="space-y-4">
              <img
                src={artData.image}
                alt={artData.title}
                className="w-full h-64 object-cover border border-gray-200"
              />

              <div className="space-y-2">
                <h3 className="text-xl font-medium text-gray-900">
                  {artData.title}
                </h3>
                <p className="text-sm text-gray-600">
                  by {artData.artist || "Unknown Artist"}
                </p>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    <span className="font-medium">Medium:</span>{" "}
                    {artData.medium}
                  </p>
                  <p>
                    <span className="font-medium">Dimensions:</span>{" "}
                    {artData.size || artData.dimensions || "Not specified"}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span>{" "}
                    {artData.status || "Available"}
                  </p>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <p className="text-2xl font-bold text-black">
                    {artData.price}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Payment Section */}
          <section className="bg-white border border-gray-200 shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 uppercase tracking-wide">
              Payment Information
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-sm text-red-800">
                {error}
              </div>
            )}

            {!paymentSubmitted ? (
              <div className="space-y-6">
                {/* Bank Transfer Details */}
                <div className="bg-gray-50 p-4 border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-3 uppercase tracking-wide">
                    Bank Transfer Details
                  </h3>

                  <div className="space-y-3 text-sm">
                    {[
                      ["Bank:", bankDetails.bankName, "bank"],
                      ["Account Name:", bankDetails.accountName, "accountName"],
                      [
                        "Account Number:",
                        bankDetails.accountNumber,
                        "accountNumber",
                      ],
                      ["Branch:", bankDetails.branch, "branch"],
                      ["SWIFT Code:", bankDetails.swiftCode, "swiftCode"],
                    ].map(([label, value, key]) => (
                      <div
                        className="flex justify-between items-center"
                        key={key}
                      >
                        <div>
                          <span className="font-medium">{label}</span> {value}
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(value, key)}
                          className="text-xs text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                        >
                          {copiedField === key ? (
                            <>
                              <svg
                                className="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <svg
                                className="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                />
                              </svg>
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200">
                    <p className="text-xs text-yellow-800">
                      <strong>Important:</strong> Please include your name and
                      artwork title "{artData.title}" in the transfer reference.
                    </p>
                  </div>
                </div>

                {/* Delivery/Pickup Option */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3 uppercase tracking-wide">
                    Delivery Option
                  </h3>
                  <div className="grid grid-cols-1 gap-4 mb-4">
                    <label className="flex items-center space-x-3 p-4 border border-gray-300 cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="deliveryOption"
                        value="delivery"
                        checked={deliveryOption === "delivery"}
                        onChange={(e) => setDeliveryOption(e.target.value)}
                        className="w-4 h-4 accent-black"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          Home Delivery
                        </div>
                        <div className="text-sm text-gray-600">
                          We'll deliver the artwork to your address. Delivery
                          charges apply based on location.
                        </div>
                      </div>
                    </label>

                    <label className="flex items-center space-x-3 p-4 border border-gray-300 cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="deliveryOption"
                        value="pickup"
                        checked={deliveryOption === "pickup"}
                        onChange={(e) => setDeliveryOption(e.target.value)}
                        className="w-4 h-4 accent-black"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          Gallery Pickup
                        </div>
                        <div className="text-sm text-gray-600">
                          Collect the artwork directly from our gallery. No
                          delivery charges.
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Gallery info for pickup */}
                {deliveryOption === "pickup" && (
                  <div className="bg-blue-50 p-4 border border-blue-200">
                    <h4 className="text-lg font-medium text-blue-900 mb-3 uppercase tracking-wide">
                      Gallery Location & Hours
                    </h4>
                    <div className="space-y-2 text-sm text-blue-800">
                      <div>
                        <span className="font-medium">Gallery:</span>{" "}
                        {galleryDetails.name}
                      </div>
                      <div>
                        <span className="font-medium">Address:</span>{" "}
                        {galleryDetails.address}
                      </div>
                      <div>
                        <span className="font-medium">Phone:</span>{" "}
                        {galleryDetails.phone}
                      </div>
                      <div>
                        <span className="font-medium">Email:</span>{" "}
                        {galleryDetails.email}
                      </div>
                      <div>
                        <span className="font-medium">Operating Hours:</span>{" "}
                        {galleryDetails.hours}
                      </div>
                      <div>
                        <span className="font-medium">Note:</span>{" "}
                        {galleryDetails.closed}
                      </div>
                      <div>
                        <span className="font-medium">Parking:</span>{" "}
                        {galleryDetails.parkingInfo}
                      </div>
                    </div>
                  </div>
                )}

                {/* Customer Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3 uppercase tracking-wide">
                    {deliveryOption === "delivery"
                      ? "Delivery Information"
                      : "Pickup Information"}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={customerInfo.name}
                        onChange={(e) =>
                          handleCustomerInfoChange("name", e.target.value)
                        }
                        placeholder="Enter your full name"
                        className="w-full px-4 py-2 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>

                    {deliveryOption === "delivery" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Delivery Address *
                        </label>
                        <textarea
                          value={customerInfo.address}
                          onChange={(e) =>
                            handleCustomerInfoChange("address", e.target.value)
                          }
                          placeholder="Enter complete delivery address with postal code"
                          rows="3"
                          className="w-full px-4 py-2 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
                        />
                      </div>
                    )}

                    {deliveryOption === "pickup" && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Preferred Pickup Date *
                          </label>
                          <select
                            value={customerInfo.pickupDate}
                            onChange={(e) =>
                              handleCustomerInfoChange(
                                "pickupDate",
                                e.target.value
                              )
                            }
                            className="w-full px-4 py-2 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                          >
                            <option value="">Select a pickup date</option>
                            {availableDates.map((date) => (
                              <option key={date.value} value={date.value}>
                                {date.display}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Preferred Pickup Time *
                          </label>
                          <select
                            value={customerInfo.pickupTime}
                            onChange={(e) =>
                              handleCustomerInfoChange(
                                "pickupTime",
                                e.target.value
                              )
                            }
                            className="w-full px-4 py-2 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                            disabled={!customerInfo.pickupDate}
                          >
                            <option value="">Select a pickup time</option>
                            {timeSlots.map((slot) => (
                              <option key={slot.value} value={slot.value}>
                                {slot.display}
                              </option>
                            ))}
                          </select>
                          {!customerInfo.pickupDate && (
                            <p className="text-xs text-gray-500 mt-1">
                              Please select a pickup date first
                            </p>
                          )}
                        </div>
                      </>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={customerInfo.phone}
                        onChange={(e) =>
                          handleCustomerInfoChange("phone", e.target.value)
                        }
                        placeholder="Enter your phone number (e.g., 0771234567)"
                        className="w-full px-4 py-2 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>
                  </div>
                </div>

                {/* Receipt URL Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Receipt URL *
                  </label>
                  <input
                    type="url"
                    value={receiptUrl}
                    onChange={handleFileUpload}
                    placeholder="Enter receipt URL (e.g., https://example.com/receipt.jpg)"
                    className="w-full px-4 py-2 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    disabled={isLoading}
                  />
                  {receiptUrl && !error && (
                    <p className="mt-2 text-sm text-green-600">
                      ✓ Receipt URL provided
                    </p>
                  )}
                </div>

                {/* Disclaimer and Agreement */}
                <div className="bg-red-50 p-4 border border-red-200">
                  <h4 className="text-sm font-medium text-red-900 mb-2">
                    IMPORTANT DISCLAIMER
                  </h4>
                  <div className="text-xs text-red-800 space-y-1">
                    <div>• All sales are final. No refunds or exchanges.</div>
                    {deliveryOption === "delivery" ? (
                      <>
                        <div>
                          • Artwork delivery will be arranged within 7 days of
                          payment confirmation.
                        </div>
                        <div>
                          • Delivery charges will be calculated based on
                          location and communicated via email.
                        </div>
                        <div>
                          • Customer is responsible for artwork insurance during
                          delivery.
                        </div>
                        <div>
                          • Any damage during delivery will be resolved through
                          our insurance coverage.
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          • Artwork will be ready for pickup within 3 days of
                          payment confirmation.
                        </div>
                        <div>
                          • Please bring a valid ID and your pickup confirmation
                          email.
                        </div>
                        <div>
                          • Artwork must be collected within 30 days of
                          confirmation or storage fees may apply.
                        </div>
                        <div>
                          • Gallery staff will assist with safe packaging for
                          transport.
                        </div>
                      </>
                    )}
                    <div>
                      • Gallery team will verify payment within 24-48 hours.
                    </div>
                    <div>
                      • Confirmation email will be sent upon payment
                      verification.
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id="agreement"
                    checked={agreed}
                    onChange={() => setAgreed(!agreed)}
                    className="w-4 h-4 mt-1 accent-black"
                    disabled={isLoading}
                  />
                  <label htmlFor="agreement" className="text-sm text-gray-700">
                    I have read and agree to the above terms and conditions. I
                    understand that this is a direct purchase and I have
                    completed the bank transfer for the full amount of{" "}
                    <strong>{artData.price}</strong>. I acknowledge that the
                    gallery team will verify my payment and contact me via email
                    for{" "}
                    {deliveryOption === "delivery"
                      ? "artwork delivery coordination"
                      : "pickup confirmation and instructions"}
                    .
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="button"
                  onClick={handleSubmit}
                  // ✅ Only gate on loading and receipt URL presence
                  disabled={isLoading || !receiptUrl}
                  className={`w-full py-3 font-medium uppercase tracking-wide text-white transition-colors ${
                    isLoading || !receiptUrl
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-black hover:bg-gray-800"
                  }`}
                >
                  {isLoading ? "Submitting..." : "Submit Payment Receipt"}
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="mb-4">
                  <svg
                    className="w-16 h-16 text-green-600 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Payment Receipt Submitted!
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Thank you for your submission. Our gallery team will verify
                  your payment and contact you via email within 24-48 hours to{" "}
                  {deliveryOption === "delivery"
                    ? "arrange artwork delivery"
                    : "confirm your pickup appointment"}
                  .
                </p>
                <p className="text-xs text-gray-500">
                  You will receive a confirmation email once your payment is
                  verified and{" "}
                  {deliveryOption === "delivery"
                    ? "delivery details will be coordinated with you"
                    : "pickup instructions will be provided"}
                  .
                </p>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 max-w-md w-full border border-gray-200 shadow-lg text-center">
            <div className="mb-4">
              <svg
                className="w-16 h-16 text-green-600 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 uppercase tracking-wide">
              Payment Receipt Received!
            </h3>

            <p className="text-sm text-gray-700 mb-6">
              Thank you for your purchase! Your payment receipt has been
              successfully submitted to our gallery team. We will verify your
              payment and send you a confirmation email within 24-48 hours to{" "}
              {deliveryOption === "delivery"
                ? "arrange artwork delivery"
                : "confirm your pickup appointment"}
              .
            </p>

            <p className="text-xs text-gray-600 mb-6 italic">
              "Art is the most beautiful of all lies." - Thank you for
              supporting Ceylon's artistic heritage.
            </p>

            <button
              type="button"
              onClick={closeSuccessModal}
              className="w-full py-2.5 font-medium uppercase tracking-wide text-white bg-black hover:bg-gray-800 transition-colors"
            >
              Close & Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Payment;
