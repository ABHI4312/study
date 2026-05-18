# 🎵 How to Add Songs

## Quick Steps:

### 1. Copy MP3 File
Copy your MP3 file to this folder:
```
frontend/public/music/your-song.mp3
```

### 2. Edit songs.json
Open `songs.json` in this folder and add your song:

```json
{
  "id": 3,
  "title": "Your Song Name",
  "artist": "Artist Name",
  "description": "Song Description",
  "filename": "your-song.mp3",
  "emoji": "🎶",
  "color": "from-blue-500 to-green-500"
}
```

### 3. Refresh Page
Refresh the website (Ctrl + Shift + R) and your song will appear automatically!

---

## Field Explanations:

- **id**: Unique number (increment from last song)
- **title**: Song name (displayed on card)
- **artist**: Artist/composer name
- **description**: Short description (1-3 words)
- **filename**: Exact MP3 filename (case-sensitive!)
- **emoji**: Any emoji (🎵 🎶 🎼 💕 🌅 ⭐ etc.)
- **color**: Tailwind gradient colors

---

## Available Colors:

```
from-romantic-500 to-purple-500  (Pink to Purple)
from-purple-500 to-pink-500      (Purple to Pink)
from-blue-500 to-green-500       (Blue to Green)
from-red-500 to-orange-500       (Red to Orange)
from-yellow-500 to-red-500       (Yellow to Red)
from-green-500 to-blue-500       (Green to Blue)
from-indigo-500 to-purple-500    (Indigo to Purple)
from-pink-500 to-rose-500        (Pink to Rose)
```

---

## Example songs.json:

```json
[
  {
    "id": 1,
    "title": "Teri Khamoshi",
    "artist": "Rahul Sapkal",
    "description": "Emotional Romantic Song",
    "filename": "teri-khamoshi.mp3",
    "emoji": "💕",
    "color": "from-romantic-500 to-purple-500"
  },
  {
    "id": 2,
    "title": "Sun Breathe",
    "artist": "Romantic Melody",
    "description": "Peaceful & Soothing",
    "filename": "Sun_breathe.mp3",
    "emoji": "🌅",
    "color": "from-purple-500 to-pink-500"
  },
  {
    "id": 3,
    "title": "My New Song",
    "artist": "New Artist",
    "description": "Amazing Track",
    "filename": "my-new-song.mp3",
    "emoji": "🎼",
    "color": "from-blue-500 to-green-500"
  }
]
```

---

## Tips:

✅ **DO:**
- Use simple filenames (no spaces, use hyphens)
- Keep descriptions short (2-3 words)
- Use any emoji you like
- Test song plays before adding

❌ **DON'T:**
- Don't use spaces in filenames
- Don't forget commas between song objects
- Don't use same ID twice
- Don't forget to save songs.json

---

## Troubleshooting:

**Song not appearing?**
1. Check filename matches exactly (case-sensitive)
2. Check songs.json syntax (valid JSON)
3. Refresh page (Ctrl + Shift + R)
4. Check browser console for errors (F12)

**Song not playing?**
1. Check MP3 file is valid
2. Check file path is correct
3. Check browser audio is not muted
4. Try different browser

---

Made with 💕 for easy song management!
