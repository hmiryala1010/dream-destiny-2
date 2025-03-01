const router = require("express").Router();
const multer = require("multer");
const Listing = require("../models/Listing");

/* Multer Configuration for File Upload */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage });

/* CREATE LISTING */
router.post("/create", upload.array("listingPhotos"), async (req, res) => {
  try {
    const {
      creator,
      category,
      type,
      streetAddress,
      aptSuite,
      city,
      province,
      country,
      guestCount,
      bedroomCount,
      bedCount,
      bathroomCount,
      amenities,
      title,
      description,
      highlight,
      highlightDesc,
      price,
    } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded." });
    }

    const listingPhotoPaths = req.files.map((file) => file.path);

    const newListing = new Listing({
      creator,
      category,
      type,
      streetAddress,
      aptSuite,
      city,
      province,
      country,
      guestCount,
      bedroomCount,
      bedCount,
      bathroomCount,
      amenities,
      listingPhotoPaths,
      title,
      description,
      highlight,
      highlightDesc,
      price,
    });

    await newListing.save();
    res.status(201).json({ message: "Listing created successfully!", listing: newListing });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create listing", error: err.message });
  }
});

/* GET LISTINGS BY CATEGORY */
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;
    const listings = category
      ? await Listing.find({ category }).populate("creator")
      : await Listing.find().populate("creator");

    res.status(200).json(listings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch listings", error: err.message });
  }
});

/* GET LISTINGS BY SEARCH */
router.get("/search/:search", async (req, res) => {
  try {
    const { search } = req.params;
    const query = search === "all"
      ? {}
      : { $or: [{ category: new RegExp(search, "i") }, { title: new RegExp(search, "i") }] };

    const listings = await Listing.find(query).populate("creator");
    res.status(200).json(listings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch listings", error: err.message });
  }
});

/* GET LISTING DETAILS */
router.get("/:listingId", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.listingId).populate("creator");
    if (!listing) {
      return res.status(404).json({ message: "Listing not found!" });
    }
    res.status(200).json(listing);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch listing", error: err.message });
  }
});

module.exports = router;
