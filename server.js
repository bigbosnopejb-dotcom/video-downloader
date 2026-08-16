const express = require('express');
const cors = require('cors');
const path = require('path');
const { execSync } = require('child_process');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Detect platform
function detectPlatform(url) {
  if (url.includes('tiktok.com') || url.includes('vm.tiktok.com')) return 'tiktok';
  if (url.includes('instagram.com') || url.includes('instagr.am')) return 'instagram';
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
  if (url.includes('facebook.com') || url.includes('fb.watch')) return 'facebook';
  return 'unknown';
}

// API Routes
app.post('/api/download', (req, res) => {
  try {
    const { url, removeWatermark, quality } = req.body;

    if (!url) {
      return res.status(400).json({ success: false, message: 'URL diperlukan' });
    }

    const platform = detectPlatform(url);
    if (platform === 'unknown') {
      return res.status(400).json({ 
        success: false, 
        message: 'Platform tidak didukung' 
      });
    }

    console.log(`[↓] Download: ${platform} | ${url}`);

    // Build yt-dlp command
    let cmd = `yt-dlp -f best "${url}" -o "%(title)s.%(ext)s" --no-warnings -q`;
    
    if (removeWatermark && (platform === 'tiktok' || platform === 'instagram')) {
      cmd += ` --sub-langs all`;
    }

    try {
      execSync(cmd, { timeout: 60000, stdio: 'pipe' });
    } catch (e) {
      // yt-dlp mungkin sudah download, abaikan error tertentu
    }

    res.json({
      success: true,
      message: `Video ${platform} berhasil diunduh`,
      platform,
      removeWatermark: removeWatermark || false,
      quality: quality || 'best'
    });

  } catch (error) {
    console.error('[!] Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Gagal mengunduh video',
      error: error.message
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`[✓] Server berjalan di http://localhost:${PORT}`);
});
