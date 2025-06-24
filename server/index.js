const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Storage for uploads
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Simple JSON DB for playlists/screens
const dbPath = path.join(__dirname, 'db.json');
function readDB() {
  if (!fs.existsSync(dbPath)) return { playlists: [], screens: [] };
  return JSON.parse(fs.readFileSync(dbPath));
}
function writeDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// Upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({ url: `/uploads/${req.file.filename}` });
});

// Serve uploaded files
app.use('/uploads', express.static(uploadDir));

// Serve frontend static files
const clientBuildPath = path.join(__dirname, '../dist');
if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));
  app.get('*', (req, res) => {
    // Only serve index.html for non-API, non-upload routes
    if (!req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
      res.sendFile(path.join(clientBuildPath, 'index.html'));
    } else {
      res.status(404).send('Not found');
    }
  });
}

// Playlist endpoints
app.get('/api/playlists', (req, res) => {
  const db = readDB();
  res.json(db.playlists);
});
app.post('/api/playlists', (req, res) => {
  const db = readDB();
  const playlist = { ...req.body, id: Date.now().toString() };
  db.playlists.push(playlist);
  writeDB(db);
  res.json(playlist);
});

// Screen endpoints
app.get('/api/screens', (req, res) => {
  const db = readDB();
  res.json(db.screens);
});
app.post('/api/screens', (req, res) => {
  const db = readDB();
  const screen = { ...req.body, id: Date.now().toString() };
  db.screens.push(screen);
  writeDB(db);
  res.json(screen);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
