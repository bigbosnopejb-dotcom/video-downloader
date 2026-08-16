# 🎥 Video Downloader

Website untuk download video dari **TikTok**, **Instagram**, **YouTube**, dan **Facebook** dengan fitur **remove watermark**.

## ✨ Fitur Utama

✅ Download video dari 4 platform (TikTok, Instagram, YouTube, Facebook)  
✅ Pilih berbagai kualitas video (Best, 720p, 480p, 360p)  
✅ Extract audio ke MP3  
✅ Remove watermark untuk TikTok & Instagram  
✅ Interface modern & responsif  
✅ Mudah di-deploy ke server gratis  

## 🚀 Deploy Gratis - Pilih 1:

### Option 1: Render.com (Recommended)
1. Buka https://render.com
2. Sign up dengan GitHub
3. New Web Service → Connect `video-downloader`
4. Build: `npm install` | Start: `npm start`
5. Deploy ✓

### Option 2: Railway.app
1. Buka https://railway.app
2. New Project → Deploy from GitHub
3. Select repo `video-downloader`
4. Deploy ✓

## 🛠️ Tech Stack
- Frontend: HTML5, CSS3, JavaScript
- Backend: Node.js + Express
- Download: yt-dlp
- Hosting: Render/Railway (Gratis)

## 📝 API Endpoints

**POST** `/api/download`
```json
{
  "url": "https://tiktok.com/...",
  "quality": "best",
  "removeWatermark": true
}
```

**GET** `/api/health` - Check server status

## ⚠️ Legal
Download hanya konten yang Anda miliki atau dengan izin pemilik.

---

**Author**: bigbosnopejb-dotcom
