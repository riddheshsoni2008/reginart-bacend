const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());

// ✅ Images folder serve
app.use("/images", express.static(path.join(__dirname, "reginimgs")));

// ✅ API - Products
app.get("/api/products", (req, res) => {
  const dirPath = path.join(__dirname, "reginimgs");

  // check if folder exists
  if (!fs.existsSync(dirPath)) {
    return res.status(500).json({ error: "Images folder not found" });
  }

  const files = fs.readdirSync(dirPath);

  const products = files.map((file, index) => ({
    id: index + 1,
    name: `Resin Art ${index + 1}`,
    img: `/images/${file}`, // ✅ no BASE_URL needed
  }));

  res.json(products);
});

// ✅ Root route (important)
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// ✅ Port (Railway compatible)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
