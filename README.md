# Best Kebabs BCN 🥙

Web application to discover, map, and rate the best kebabs in Barcelona.

## 📋 Table of Contents
- [Architecture](#-architecture)
- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [Project Structure](#-project-structure)
- [Testing](#-testing)
- [API Endpoints](#-api-endpoints)
- [Development Data](#-development-data)
- [Troubleshooting](#-troubleshooting)

---

## 🏗️ Architecture

**Full-Stack Monorepo:**
- **Frontend:** Next.js 14 + TypeScript + TailwindCSS + Leaflet + next-intl
- **Backend:** Express + TypeScript + MongoDB + JWT Auth + Winston
- **Database:** MongoDB 7.0
- **DevOps:** Docker + Docker Compose

### Design Principles
- ✅ Clean Architecture (routes → controllers → services → models)
- ✅ Single Responsibility Principle
- ✅ Reusable and testable code
- ✅ Internationalization from day one (ca/es/en)
- ✅ Structured logging in English

---

## 🚀 Quick Start

### Option 1: Docker (Recommended) 🐳

```bash
# Start all services
docker-compose up

# In another terminal, populate the database
docker exec -it kebabs-backend npm run seed
```

**URLs:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/health

### Option 2: Local Development

**Prerequisites:**
- Node.js 18+
- MongoDB running (local or Docker)

```bash
# 1. Install dependencies
npm install
cd frontend && npm install
cd ../backend && npm install

# 2. Backend (terminal 1)
cd backend
npm run seed    # Populate test data
npm run dev     # Port 5000

# 3. Frontend (terminal 2)
cd frontend
npm run dev     # Port 3000
```

---

## 📦 Complete Installation

### 1. Clone and install dependencies

```bash
# Install root
npm install

# Install frontend
cd frontend
npm install

# Install backend
cd backend
npm install
```

### 2. Configure environment variables

**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**Backend** (`backend/.env`):
```env
MONGODB_URI=mongodb://localhost:27017/best-kebabs-bcn
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
```

### 3. Start MongoDB

**Option A - Docker:**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:7.0
```

**Option B - Homebrew (macOS):**
```bash
brew services start mongodb-community
```

### 4. Populate database

```bash
cd backend
npm run seed
```

---

## 📁 Project Structure

```
best-kebabs-bcn/
├── frontend/                    # Next.js Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── [locale]/       # i18n routes (ca/es/en)
│   │   │   │   ├── layout.tsx  # Layout with NextIntlProvider
│   │   │   │   ├── page.tsx    # Home: List + Map
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   └── globals.css     # Tailwind + Leaflet CSS
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   ├── KebabList.tsx
│   │   │   └── KebabMap.tsx
│   │   ├── lib/
│   │   │   ├── api.ts          # Axios instance
│   │   │   ├── authService.ts
│   │   │   └── kebabService.ts
│   │   └── types/
│   │       └── index.ts        # TypeScript types
│   ├── messages/               # Translations (ca/es/en)
│   ├── __tests__/
│   └── Dockerfile
│
├── backend/                     # Express API
│   ├── src/
│   │   ├── models/             # Mongoose schemas
│   │   │   ├── User.ts         # username, email, role
│   │   │   ├── Kebab.ts        # name, address, lat/lng, avgRating
│   │   │   └── Rating.ts       # userId, kebabId, score, comment
│   │   ├── services/           # Business logic
│   │   │   ├── authService.ts
│   │   │   ├── kebabService.ts
│   │   │   └── ratingService.ts
│   │   ├── controllers/        # Request handlers
│   │   ├── routes/             # API routes
│   │   ├── middleware/
│   │   │   ├── auth.ts         # JWT authentication
│   │   │   └── errorHandler.ts
│   │   ├── config/
│   │   │   ├── index.ts
│   │   │   └── database.ts
│   │   ├── utils/
│   │   │   └── logger.ts       # Winston logger
│   │   ├── server.ts
│   │   └── seed.ts             # Test data
│   ├── tests/
│   └── Dockerfile
│
├── docker-compose.yml
├── package.json
└── .gitignore
```

---

## 🧪 Testing

### Frontend (Jest + React Testing Library)
```bash
cd frontend
npm test        # Watch mode
npm run test:ci # CI with coverage
```

### Backend (Jest + Supertest)
```bash
cd backend
npm test        # Watch mode
npm run test:ci # CI with coverage
```

### All tests
```bash
npm test  # From root
```

---

## 🌐 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register user | No |
| POST | `/api/auth/login` | Login | No |
| GET | `/api/auth/me` | Current user | Yes |

### Kebabs
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/kebabs` | List all | No |
| GET | `/api/kebabs/:id` | Get by ID | No |
| POST | `/api/kebabs` | Create kebab | Admin |

### Ratings
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/ratings` | Create/update | Yes |
| GET | `/api/ratings/:kebabId` | List by kebab | No |

---

## 🌍 Internationalization

### Supported languages
- 🇪🇸 **Català** (default) - http://localhost:3000
- 🇪🇸 **Español** - http://localhost:3000/es
- 🇬🇧 **English** - http://localhost:3000/en

### Change language
Use the CA/ES/EN buttons in the navbar or navigate directly to the URL with the locale.

---

## 📦 Development Data

### Admin User
After running `npm run seed`:
- **Email:** `admin@kebabs.bcn`
- **Password:** `admin123`
- **Role:** Admin (can create kebabs)

### Test Kebabs
Seed includes 5 kebabs in Barcelona:
1. **Kebab Istanbul** - Carrer de la Marina 123 (Halal, 24h)
2. **El Mejor Kebab** - Carrer de Balmes 45 (Halal, Chicken, Beef)
3. **Kebab House** - Passeig de Gràcia 78 (Halal, Chicken)
4. **Istanbul Doner Kebab** - Carrer del Consell de Cent 234 (Halal, 24h, Beef)
5. **King Kebab** - La Rambla 56 (24h, Chicken)

---

## 🐳 Docker

### Useful commands

```bash
# Start services
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Full rebuild
docker-compose build --no-cache
docker-compose up

# Run seed
docker exec -it kebabs-backend npm run seed

# Enter backend container
docker exec -it kebabs-backend sh

# Reset database (removes volumes)
docker-compose down -v
```

---

## 🔧 Troubleshooting

### Port already in use
```bash
# Check what's using the port
lsof -i :3000  # or :5000 or :27017

# Change frontend port
# Edit frontend/package.json:
"dev": "next dev -p 3001"

# Change backend port
# Edit backend/.env:
PORT=5001
```

### Reset MongoDB
```bash
# With Docker
docker-compose down -v
docker-compose up

# Manually
docker exec -it kebabs-mongodb mongosh
> use best-kebabs-bcn
> db.dropDatabase()
```

### Clean node_modules
```bash
# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install

# Backend
cd backend
rm -rf node_modules package-lock.json
npm install
```

### TypeScript errors
```bash
# Make sure dependencies are installed
npm install

# If persists, clean and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 🔥 Implemented Features

- ✅ Interactive map with Leaflet (markers, popups, zoom)
- ✅ Rating system with automatic recalculation
- ✅ JWT authentication with roles (user/admin)
- ✅ List and map side by side
- ✅ Multi-language (ca/es/en) with next-intl
- ✅ Responsive design with TailwindCSS
- ✅ Clean Architecture in backend
- ✅ Structured logging with Winston
- ✅ Testing (Jest + RTL + Supertest)
- ✅ Docker Compose for development

---

## 🔮 Future Improvements

- [ ] Advanced search and filters
- [ ] User favorites
- [ ] Admin dashboard
- [ ] Moderation system
- [ ] Image upload
- [ ] SEO optimization
- [ ] Overpass API integration (real OSM data)
- [ ] Redis caching
- [ ] PWA with service workers

---

## 📚 Available Scripts

### Root
```bash
npm run dev              # Frontend + Backend
npm run dev:frontend     # Frontend only
npm run dev:backend      # Backend only
npm test                 # All tests
npm run build            # Complete build
npm run docker:up        # docker-compose up
npm run docker:down      # docker-compose down
```

### Frontend
```bash
npm run dev              # Dev server (port 3000)
npm run build            # Production build
npm run start            # Start production
npm test                 # Tests watch mode
npm run test:ci          # Tests CI
npm run lint             # ESLint
```

### Backend
```bash
npm run dev              # Dev server with nodemon (port 5000)
npm run build            # Compile TypeScript
npm run start            # Start production
npm run seed             # Populate database
npm test                 # Tests watch mode
npm run test:ci          # Tests CI with coverage
```

---

## 📝 Technical Notes

### Rating System
- **Rule:** One rating per user per kebab
- **Algorithm:** Find existing → Create/Update → Recalculate avgRating
- **Denormalization:** avgRating and ratingsCount stored in Kebab for better performance

### Authentication
- **JWT:** Tokens with 7-day expiration
- **Storage:** localStorage in frontend
- **Header:** `Authorization: Bearer <token>`
- **Roles:** user (default), admin (can create kebabs)

### Logging
- **Winston** with structured JSON format
- All logs in English
- No `console.log` in production
- Errors include stack trace and context

---

## 📄 License

MIT

---

**Created:** February 7, 2026  
**Version:** 1.0.0