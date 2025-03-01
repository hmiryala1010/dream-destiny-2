const router = require("express").Router();
const Booking = require("../models/Booking");
const User = require("../models/User");
const Listing = require("../models/Listing");

/* GET TRIP LIST */
router.get("/:userId/trips", async (req, res) => {
  try {
    const { userId } = req.params;
    const trips = await Booking.find({ customerId: userId }).populate("customerId hostId listingId");

    if (!trips.length) {
      return res.status(404).json({ message: "No trips found!" });
    }

    res.status(200).json(trips);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to retrieve trips!", error: err.message });
  }
});

/* ADD/REMOVE LISTING FROM WISHLIST */
router.patch("/:userId/:listingId", async (req, res) => {
  try {
    const { userId, listingId } = req.params;
    const user = await User.findById(userId);
    const listing = await Listing.findById(listingId);

    if (!user || !listing) {
      return res.status(404).json({ message: "User or Listing not found!" });
    }

    const index = user.wishList.findIndex((item) => item.toString() === listingId);

    if (index !== -1) {
      user.wishList.splice(index, 1);
      await user.save();
      return res.status(200).json({ message: "Listing removed from wishlist", wishList: user.wishList });
    }

    user.wishList.push(listing._id);
    await user.save();
    res.status(200).json({ message: "Listing added to wishlist", wishList: user.wishList });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update wishlist!", error: err.message });
  }
});

/* GET PROPERTY LIST */
router.get("/:userId/properties", async (req, res) => {
  try {
    const { userId } = req.params;
    const properties = await Listing.find({ creator: userId }).populate("creator");

    if (!properties.length) {
      return res.status(404).json({ message: "No properties found!" });
    }

    res.status(200).json(properties);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to retrieve properties!", error: err.message });
  }
});

/* GET RESERVATION LIST */
router.get("/:userId/reservations", async (req, res) => {
  try {
    const { userId } = req.params;
    const reservations = await Booking.find({ hostId: userId }).populate("customerId hostId listingId");

    if (!reservations.length) {
      return res.status(404).json({ message: "No reservations found!" });
    }

    res.status(200).json(reservations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to retrieve reservations!", error: err.message });
  }
});

module.exports = router;
