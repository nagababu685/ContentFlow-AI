# ContentFlow AI

A full-stack social media dashboard that helps creators generate, manage, and schedule content across multiple platforms. Built with Node.js, Express, Next.js, and MongoDB.

## What it does

You type a prompt describing what you want to post, pick a platform (Twitter, Instagram, LinkedIn, Facebook, or TikTok), and the AI engine generates platform-optimized content with the right tone, hashtags, and character limits. You can save posts as drafts, schedule them, or publish directly.

## Tech Stack

**Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT authentication  
**Frontend:** Next.js 14 (App Router), Tailwind CSS, Axios  
**Auth:** JWT stored in httpOnly cookies (not localStorage — more secure against XSS)

## Project Structure

```
├── server/                    # Express API
│   ├── config/db.js           # MongoDB connection
│   ├── controllers/           # Auth, Posts, AI Generation logic
│   ├── middleware/             # JWT auth, validation, error handling
│   ├── models/                # User and Post schemas
│   ├── routes/                # API route definitions
│   └── server.js              # Entry point
│
├── client/                    # Next.js frontend
│   └── src/
│       ├── app/               # Pages and layouts
│       ├── context/           # Auth state management
│       └── services/          # API calls (Axios)
```

## API Endpoints

**Auth**
- `POST /api/auth/register` — Create account
- `POST /api/auth/login` — Login
- `POST /api/auth/logout` — Logout
- `GET /api/auth/me` — Get current user (protected)
- `PUT /api/auth/profile` — Update profile (protected)

**Posts**
- `GET /api/posts` — List posts (supports `?platform=twitter&status=draft&page=1`)
- `POST /api/posts` — Create post
- `GET /api/posts/:id` — Get single post
- `PUT /api/posts/:id` — Update post
- `DELETE /api/posts/:id` — Delete post
- `GET /api/posts/stats` — Dashboard stats (aggregated)

**AI Generation**
- `POST /api/generate` — Generate content from prompt + platform

## Setup

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### Backend
```bash
cd server
npm install
```

Create `server/.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/contentflow
JWT_SECRET=your_secret_here
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

### Frontend
```bash
cd client
npm install
```

Create `client/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Run
```bash
# Terminal 1
cd server && npm run dev

# Terminal 2
cd client && npm run dev
```

Frontend runs on `http://localhost:3000`, API on `http://localhost:5000`.

## How the AI generation works

The content engine uses platform-specific templates with keyword extraction from the user's prompt. It simulates async processing (500-1500ms) to match real API behavior. The architecture is designed so you can swap in OpenAI or Gemini by replacing one function — the rest of the flow stays the same.

## License

MIT
