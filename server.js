const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const app = express();
app.use(cors());

// ✅ Serve React Build
app.use(express.static(path.join(__dirname, "dist")));

// ✅ Serve Images Folder
app.use("/images", express.static(path.join(__dirname, "reginimgs")));

// 🔥 CUSTOM PRODUCT NAMES
const productNames = ["Varmala preservation in Teakwood frame"];

// ✅ API - Products (FINAL FIXED)
app.get("/api/products", (req, res) => {
  const dirPath = path.join(__dirname, "reginimgs");

  if (!fs.existsSync(dirPath)) {
    return res.status(500).json({ error: "Images folder not found" });
  }

  const files = fs.readdirSync(dirPath);

  const seenHashes = new Set();
  const uniqueFiles = [];

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);

    // ❌ skip non-files
    if (!fs.lstatSync(filePath).isFile()) return;

    // ❌ DELETE files like (1), (2), (3)
    if (file.match(/\(\d+\)/)) {
      fs.unlinkSync(filePath);
      console.log(`🗑️ Deleted (number duplicate): ${file}`);
      return;
    }

    try {
      const fileBuffer = fs.readFileSync(filePath);

      const hash = crypto.createHash("md5").update(fileBuffer).digest("hex");

      if (!seenHashes.has(hash)) {
        seenHashes.add(hash);
        uniqueFiles.push(file);
      } else {
        // ❌ delete same image duplicate
        fs.unlinkSync(filePath);
        console.log(`🗑️ Deleted (same image): ${file}`);
      }
    } catch (err) {
      console.log("Error:", file, err);
    }
  });

  const products = uniqueFiles.map((file, index) => {
    const cleanName = file
      .replace(/\.[^/.]+$/, "")
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

    return {
      id: index + 1,
      name: productNames[index] || cleanName || `Resin Art ${index + 1}`,
      img: `${req.protocol}://${req.get("host")}/images/${file}`,
    };
  });

  res.json(products);
});

// ✅ React fallback
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
