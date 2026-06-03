# ⚡ ContentFlow AI

> **An automated social media dashboard for creators** — Generate AI-powered content, manage posts, and grow your audience from a single command center.

![ContentFlow AI](https://img.shields.io/badge/ContentFlow-AI-6366F1?style=for-the-badge&logo=sparkles&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

---

## 🎯 What is ContentFlow AI?

ContentFlow AI is a full-stack platform that helps content creators automate their social media workflow. The core flow is simple:

```
Login → Type a prompt → AI generates platform-optimized content → Save → Manage your posts
```

Instead of spending hours crafting posts for Twitter, Instagram, LinkedIn, Facebook, and TikTok — you describe what you want, and ContentFlow AI generates tailored content with the right tone, hashtags, and character limits for each platform.

---

## ✨ Key Features

| Feature | Description |
|:--------|:------------|
| 🤖 **AI Content Generation** | Smart template engine generates platform-specific content from a single prompt |
| 🔐 **Secure Authentication** | JWT tokens stored in httpOnly cookies — immune to XSS attacks |
| 📱 **Multi-Platform Support** | Twitter, Instagram, LinkedIn, Facebook, TikTok — each with unique formatting |
| 📊 **Dashboard Analytics** | At-a-glance stats: total posts, drafts, scheduled, published, engagement |
| 📝 **Full CRUD Operations** | Create, read, update, delete posts with status tracking |
| 🔍 **Smart Filtering** | Filter posts by platform, status, with built-in pagination |
| 🛡️ **Input Validation** | Server-side validation on every endpoint using express-validator |
| 🌙 **Dark Theme** | Premium dark UI with glassmorphism, gradients, and micro-animations |

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|:-----------|:--------|
| **Node.js** | JavaScript runtime |
| **Express.js** | Web framework — RESTful API |
| **MongoDB** | NoSQL database |
| **Mongoose** | ODM — schema validation, middleware hooks |
| **JWT** | Authentication via httpOnly cookies |
| **bcryptjs** | Password hashing (salt rounds: 10) |
| **express-validator** | Request validation & sanitization |
| **cookie-parser** | Parse httpOnly auth cookies |

### Frontend
| Technology | Purpose |
|:-----------|:--------|
| **Next.js 14** | React framework with App Router |
| **Tailwind CSS v4** | Utility-first CSS with CSS-based config |
| **Axios** | HTTP client with interceptors |
| **React Context** | Global auth state management |
| **React Icons** | Icon library |

---

## 🏗️ Architecture

The project follows a **decoupled architecture** — separate frontend and backend with clean separation of concerns.

```
ContentFlow AI/
│
├── server/                          # Express.js Backend (MVC Pattern)
│   ├── config/
│   │   └── db.js                    # MongoDB connection via Mongoose
│   ├── controllers/
│   │   ├── authController.js        # Register, Login, Logout, GetMe, UpdateProfile
│   │   ├── postController.js        # CRUD + Stats aggregation
│   │   └── generateController.js    # AI content generation engine
│   ├── middleware/
│   │   ├── authMiddleware.js        # JWT verification — route protection
│   │   ├── errorHandler.js          # Centralized error handling
│   │   └── validate.js              # express-validator validation chains
│   ├── models/
│   │   ├── User.js                  # User schema with password hashing
│   │   └── Post.js                  # Post schema with embedded metrics
│   ├── routes/
│   │   ├── authRoutes.js            # /api/auth/*
│   │   ├── postRoutes.js            # /api/posts/*
│   │   └── generateRoutes.js        # /api/generate
│   ├── utils/
│   │   └── generateToken.js         # JWT signing + cookie setter
│   └── server.js                    # Entry point — Express app
│
├── client/                          # Next.js Frontend
│   ├── src/
│   │   ├── app/                     # App Router pages & layouts
│   │   │   ├── layout.js            # Root layout (Inter font, AuthProvider)
│   │   │   ├── globals.css          # Design system — CSS variables, animations
│   │   │   └── page.js              # Landing page
│   │   ├── context/
│   │   │   └── AuthContext.js       # Auth state (user, login, register, logout)
│   │   └── services/
│   │       ├── api.js               # Axios instance (withCredentials, interceptors)
│   │       ├── authService.js       # Auth API calls
│   │       └── postService.js       # Post CRUD + AI generate API calls
│   └── package.json
│
└── README.md
```

---

## 🔌 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Access | Description |
|:-------|:---------|:-------|:------------|
| `POST` | `/api/auth/register` | Public | Create account, returns JWT cookie |
| `POST` | `/api/auth/login` | Public | Authenticate, returns JWT cookie |
| `POST` | `/api/auth/logout` | Public | Clear JWT cookie |
| `GET` | `/api/auth/me` | Protected | Get current user profile |
| `PUT` | `/api/auth/profile` | Protected | Update user profile |

### Posts (`/api/posts`)

| Method | Endpoint | Access | Description |
|:-------|:---------|:-------|:------------|
| `GET` | `/api/posts` | Protected | Get all user's posts (with filters & pagination) |
| `GET` | `/api/posts/stats` | Protected | Aggregated dashboard statistics |
| `GET` | `/api/posts/:id` | Protected | Get single post |
| `POST` | `/api/posts` | Protected | Create new post |
| `PUT` | `/api/posts/:id` | Protected | Update post |
| `DELETE` | `/api/posts/:id` | Protected | Delete post |

### AI Generation (`/api/generate`)

| Method | Endpoint | Access | Description |
|:-------|:---------|:-------|:------------|
| `POST` | `/api/generate` | Protected | Generate AI content from prompt + platform |

---

## 🔒 Security Decisions

| Decision | Reasoning |
|:---------|:----------|
| **httpOnly cookies** over localStorage | localStorage is vulnerable to XSS — any injected script can steal the token. httpOnly cookies are invisible to JavaScript. |
| **bcrypt with 10 salt rounds** | Passwords are hashed before storage. Even if the DB is compromised, passwords can't be reversed. |
| **Ownership checks on every CRUD** | Every post operation verifies `post.user === req.user._id` — users can only access their own data. |
| **Server-side validation** | Frontend validation can be bypassed. express-validator sanitizes input before it reaches the database. |
| **Centralized error handler** | Catches Mongoose CastError, duplicate keys, validation errors — returns clean JSON, never leaks stack traces in production. |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+ 
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- **npm** (comes with Node.js)

### 1. Clone the repository
```bash
git clone https://github.com/nagababu685/ContentFlow-AI.git
cd ContentFlow-AI
```

### 2. Setup Backend
```bash
cd server
npm install
```

Create a `.env` file in `/server`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/contentflow
JWT_SECRET=your_jwt_secret_key_here
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

### 3. Setup Frontend
```bash
cd ../client
npm install
```

Create a `.env.local` file in `/client`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 4. Run the Application
```bash
# Terminal 1 — Start backend
cd server
npm run dev

# Terminal 2 — Start frontend
cd client
npm run dev
```

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

---

## 📁 Database Schemas

### User Model
```javascript
{
  name:                String,      // required, max 50 chars
  email:               String,      // required, unique, validated
  password:            String,      // hashed with bcrypt, select: false
  avatar:              String,
  bio:                 String,      // max 200 chars
  connectedPlatforms:  [{ platform: String, handle: String }],
  timestamps:          true         // createdAt, updatedAt
}
```

### Post Model
```javascript
{
  user:          ObjectId,          // ref: User (ownership)
  content:       String,            // required, max 2200 chars
  platform:      String,            // enum: twitter|instagram|linkedin|facebook|tiktok
  status:        String,            // enum: draft|scheduled|published|failed
  mediaUrl:      String,
  hashtags:      [String],
  scheduledAt:   Date,
  publishedAt:   Date,
  metrics: {
    likes:       Number,
    comments:    Number,
    shares:      Number,
    reach:       Number,
    impressions: Number
  },
  timestamps:    true
}
```

---

## 🤖 AI Content Generation

The AI engine uses a **smart template system** with platform-specific content generation:

- **Twitter/X** — Concise, punchy, hashtag-rich (280 char limit)
- **Instagram** — Storytelling, emoji-rich, hashtag blocks (2200 char limit)
- **LinkedIn** — Professional, structured, thought-leadership tone
- **Facebook** — Conversational, community-focused, question-driven
- **TikTok** — Trendy, hook-driven, Gen-Z style

The backend simulates async AI processing (500–1500ms delay) to demonstrate real-world API patterns. The architecture is designed so the template engine can be swapped with a real AI API (OpenAI, Gemini) by replacing a single function.

---

## 🔮 Future Roadmap

- [ ] OpenAI GPT-4 integration for real AI generation
- [ ] Image upload with Cloudinary
- [ ] Real-time notifications via WebSocket
- [ ] Social media API integration (Twitter API, Meta Graph API)
- [ ] Content scheduling with cron jobs
- [ ] Team collaboration with role-based access

---

## 📄 License

MIT License — feel free to use, modify, and distribute.

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/nagababu685"><strong>nagababu685</strong></a>
</p>
