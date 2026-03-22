import express from 'express';
import path from 'path';
import fs from 'fs';
import bodyParser from 'body-parser';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(process.cwd(), 'data.json');
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

app.use(cors());
app.use(bodyParser.json());

// API to get services
app.get('/api/services', (req, res) => {
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read data' });
    }
    res.json(JSON.parse(data));
  });
});

// API to update services
app.post('/api/services', (req, res) => {
  const { password, services } = req.body;

  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  fs.writeFile(DATA_FILE, JSON.stringify(services, null, 2), (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to save data' });
    }
    res.json({ message: 'Data saved successfully' });
  });
});

// API for login
app.post('/api/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, error: 'Invalid password' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
