const router = require("express").Router();
const Booking = require("../models/Booking");

/* CREATE BOOKING */
router.post("/create", async (req, res) => {
  try {
    const { customerId, hostId, listingId, startDate, endDate, totalPrice } = req.body;

    if (!customerId || !hostId || !listingId || !startDate || !endDate || !totalPrice) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const newBooking = new Booking({ customerId, hostId, listingId, startDate, endDate, totalPrice });

    await newBooking.save();
    res.status(201).json({ message: "Booking created successfully!", booking: newBooking });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create a new booking!", error: err.message });
  }
});

module.exports = router;
