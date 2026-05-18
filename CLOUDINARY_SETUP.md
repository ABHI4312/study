# 🎵 Song Upload with Cloudinary Setup

## Step 1: Install Required Packages

```bash
cd backend
npm install cloudinary multer multer-storage-cloudinary
```

## Step 2: Create Cloudinary Account

1. Go to: https://cloudinary.com/
2. Sign up for FREE account
3. After login, go to Dashboard
4. Copy these details:
   - Cloud Name
   - API Key
   - API Secret

## Step 3: Add to .env File

Open `backend/.env` and add:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

## Step 4: Restart Backend

```bash
cd backend
npm run dev
```

## Step 5: Test Upload

1. Go to: http://localhost:5173/choose-music
2. Scroll to "Upload New Song" section
3. Fill form and upload MP3
4. Song will be uploaded to Cloudinary
5. Appears automatically in "My Songs"!

---

## Features:

✅ **Cloud Storage**: Files stored on Cloudinary (not local)
✅ **Automatic**: Upload from website, no code needed
✅ **Free Tier**: 25GB storage, 25GB bandwidth/month
✅ **Fast**: CDN delivery worldwide
✅ **Secure**: Files are private and secure
✅ **Easy Delete**: Remove songs from website

---

## Free Tier Limits:

- Storage: 25 GB
- Bandwidth: 25 GB/month
- Transformations: 25,000/month
- Perfect for personal use!

---

## Alternative: Without Cloudinary

If you don't want to use Cloudinary, songs will be stored locally in:
```
frontend/public/music/
```

But you'll need to manually copy files and edit songs.json.

---

Made with 💕
