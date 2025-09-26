const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

router.get("/", orderController.getOrders); // Fetch all orders
router.post("/", orderController.createOrder); // Create order
router.patch("/:id/status", orderController.updateOrderStatus); // Update status
router.delete("/:id", orderController.deleteOrder); // Delete order

module.exports = router;
