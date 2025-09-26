const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    artCode: { type: String, required: true },
    artTitle: { type: String, required: true },
    sellType: { type: String, enum: ["Direct", "Bid"], default: "Bid" },
    fullName: { type: String, required: true },
    deliveryAddress: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    paymentReceipt: { type: String, default: "" }, // base64 or URL
    status: {
      type: String,
      enum: [
        "Payment Pending",
        "Payment Verifying",
        "Payment Confirmed",
        "Processing",
        "Ready for Pickup",
        "Out for Delivery",
        "Delivered",
        "Picked Up",
        "Cancelled",
      ],
      default: "Payment Pending",
    },
    orderDate: { type: Date, default: Date.now },
    totalAmount: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
