const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());

// ✅ Serve Images Folder
app.use("/images", express.static(path.join(__dirname, "reginimgs")));

// 🔥 CUSTOM PRODUCT NAMES (EDIT HERE)
const productNames = [
  "Golden Memory Frame ",
  "Couple Resin Keepsake ",
  "Floral Resin Plate ",
  "Luxury Resin Wall Art ",
  "Personalized Photo Frame ",
  "Handcrafted Resin Tray ",
  "Elegant Resin Clock ",
  "Custom Name Plate ",
  "Wedding Memory Frame ",
  "Premium Resin Decor ",
  "Artistic Resin Frame ",
  "Modern Resin Design ",
  "Classic Resin Gift ",
  "Designer Resin Piece ",
];

// ✅ API - Products
app.get("/api/products", (req, res) => {
  const dirPath = path.join(__dirname, "reginimgs");

  if (!fs.existsSync(dirPath)) {
    return res.status(500).json({ error: "Images folder not found" });
  }

  const files = fs.readdirSync(dirPath);

  const products = files.map((file, index) => {
    // 🔥 Name priority:
    // 1. Custom array
    // 2. Filename auto
    // 3. Default fallback

    const cleanName = file
      .replace(/\.[^/.]+$/, "") // remove extension
      .replace(/[-_]/g, " ") // replace - _
      .replace(/\b\w/g, (c) => c.toUpperCase()); // capitalize

    return {
      id: index + 1,
      name: productNames[index] || cleanName || `Resin Art ${index + 1}`,
      img: `${req.protocol}://${req.get("host")}/images/${file}`,
    };
  });

  res.json(products);
});

// ✅ Root Route
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
