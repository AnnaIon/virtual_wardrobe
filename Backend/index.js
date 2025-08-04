const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { connectDB } = require("./database/database.js");

// Load environment variables
dotenv.config({ path: "./config.env" });

const virtualWardrobeRoutes = require("./routes/virtualWardrobeRoutes.js");
const app = express();

// ✅ Middleware
app.use(express.json());
const corsOptions = {
  origin: "http://localhost:5174", // Allow only frontend
  methods: "GET, POST, PUT, PATCH, DELETE",
  credentials: true,
};

app.use(cors(corsOptions));

// ✅ Connect to MongoDB when server starts
connectDB()
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ API Routes for Virtual Wardrobe (MongoDB)
app.use(virtualWardrobeRoutes);

// ✅ Load and Serve Image URLs from JSON File
// Use absolute path
const imageUrlsPath = path.join(__dirname, "imageUrls.json");

let imageUrls = [];

try {
    if (fs.existsSync(imageUrlsPath)) {
        imageUrls = JSON.parse(fs.readFileSync(imageUrlsPath, "utf-8"));
        console.log(`✅ Loaded image URLs: ${imageUrls.length} entries found!`);
    } else {
        console.log(`⚠️ WARNING: imageUrls.json file not found at ${imageUrlsPath}`);
    }
} catch (error) {
    console.error("❌ Error loading imageUrls.json:", error);
}
// ✅ API Route to Serve Image URLs
app.get("/api/images", (req, res) => {
  if (imageUrls.length > 0) {
    res.json(imageUrls);
  } else {
    res.status(404).json({ message: "No image URLs available." });
  }
});

// ✅ Catch-All Route for 404 Errors
app.all("*", (req, res) => {
  res.status(404).json({
    status: "failed",
    message: "Page not found",
  });
});

// ✅ Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
