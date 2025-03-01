const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const User = require("../models/User");

/* Multer Configuration for File Upload */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage });

/* USER REGISTER */
router.post("/register", upload.single("profileImage"), async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const profileImage = req.file?.path;

    if (!profileImage) return res.status(400).json({ message: "No file uploaded" });

    if (await User.findOne({ email }))
      return res.status(409).json({ message: "User already exists!" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      profileImagePath: profileImage,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully!", user: newUser });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed!", error: err.message });
  }
});

/* USER LOGIN */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User doesn't exist!" });

    if (!(await bcrypt.compare(password, user.password)))
      return res.status(400).json({ message: "Invalid Credentials!" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ token, user });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed!", error: err.message });
  }
});

module.exports = router;
