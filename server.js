const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());

// ✅ Images folder serve
app.use("/images", express.static("reginimgs"));

// ✅ Dynamic base URL (important for deploy)
const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://your-app-name.onrender.com" // 👈 yaha apna render URL daalna
    : "http://localhost:5000";

// API
app.get("/api/products", (req, res) => {
  const files = fs.readdirSync("./reginimgs");

  const products = files.map((file, index) => ({
    id: index + 1,
    name: `Resin Art ${index + 1}`,
    img: `${BASE_URL}/images/${file}`, // ✅ dynamic URL
  }));

  res.json(products);
});

// root
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// ✅ Render ke liye port fix
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
