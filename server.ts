import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import bodyParser from "body-parser";
import cors from "cors";

const __dirname = path.resolve();
const DATA_FILE = path.join(__dirname, "data.json");

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(bodyParser.json());

  // API Routes
  app.get("/api/services", (req, res) => {
    try {
      const data = fs.readFileSync(DATA_FILE, "utf-8");
      res.json(JSON.parse(data));
    } catch (error) {
      res.status(500).json({ error: "Failed to read data" });
    }
  });

  app.post("/api/services", (req, res) => {
    const { password, data } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD || "Mr_Mpbs0000";

    if (password !== adminPassword) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
      res.json({ message: "Data updated successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to write data" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
