# Our Little Universe - Backend API ❤️

RESTful API for the Our Little Universe application.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
```

## 📝 Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/our-little-universe
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

## 🗄️ Database Models

### Memory
- title (String, required)
- description (String, required)
- date (Date, required)
- category (Enum: first-time, special-moment, adventure, milestone, other)
- imageUrl (String)
- tags (Array of Strings)
- isFavorite (Boolean)

### OpenWhen
- title (String, required)
- message (String, required)
- condition (String, required)
- isOpened (Boolean)
- openedAt (Date)

### SecretMessage
- message (String, required)
- isRevealed (Boolean)
- revealedAt (Date)

## 🛣️ API Routes

All routes are prefixed with `/api`

### Health Check
- `GET /` - API status check

### Memories
- `GET /memories` - Get all memories
- `GET /memories/:id` - Get single memory
- `POST /memories` - Create memory
- `PUT /memories/:id` - Update memory
- `DELETE /memories/:id` - Delete memory

### Open When Letters
- `GET /openwhen` - Get all letters
- `GET /openwhen/:id` - Get single letter
- `POST /openwhen` - Create letter
- `PUT /openwhen/:id/open` - Mark as opened
- `DELETE /openwhen/:id` - Delete letter

### Secret Messages
- `GET /secrets` - Get all secrets
- `GET /secrets/:id` - Get single secret
- `POST /secrets` - Create secret
- `PUT /secrets/:id/reveal` - Reveal secret
- `DELETE /secrets/:id` - Delete secret

## 📦 Dependencies

- express - Web framework
- mongoose - MongoDB ODM
- cors - CORS middleware
- dotenv - Environment variables
- nodemon - Development auto-reload

## 🔧 Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
