# Our Little Universe - Frontend ❤️

Beautiful React frontend for capturing and cherishing special moments.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📝 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5000/api
```

## 🎨 Tech Stack

- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Router DOM** - Routing
- **Axios** - HTTP client

## 📁 Project Structure

```
src/
├── components/       # Reusable components
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── MemoryCard.jsx
│   └── Loading.jsx
├── pages/           # Page components
│   ├── Landing.jsx
│   ├── MemoryTimeline.jsx
│   ├── OpenWhen.jsx
│   ├── SecretMessage.jsx
│   └── AddMemory.jsx
├── services/        # API services
│   └── api.js
├── context/         # React context
├── hooks/           # Custom hooks
├── assets/          # Static assets
├── App.jsx          # Main app
├── main.jsx         # Entry point
└── index.css        # Global styles
```

## 🎨 Tailwind Configuration

Custom theme includes:
- Romantic color palette (pink gradients)
- Dark theme colors
- Custom animations (fade-in, slide-up, float)
- Romantic font family (Playfair Display)

## 🧩 Components

### Navbar
Responsive navigation with smooth transitions

### Footer
Animated footer with floating emojis

### MemoryCard
Card component for displaying memories

### Loading
Animated loading indicator

## 📄 Pages

### Landing
Hero section with features showcase

### MemoryTimeline
Grid view of all memories with filtering

### OpenWhen
Collection of letters for different occasions

### SecretMessage
Hidden messages with reveal animation

### AddMemory
Form to create new memories

## 🎭 Animations

Using Framer Motion for:
- Page transitions
- Card hover effects
- Modal animations
- Floating elements
- Loading states

## 🔧 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
