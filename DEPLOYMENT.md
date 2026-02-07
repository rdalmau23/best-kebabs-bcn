# Multi-Environment Deployment Guide

## Environment Strategy

### 1. **Local** (Docker)
- **Branch**: any
- **Database**: MongoDB in Docker (port 27017)
- **Backend**: http://localhost:5001
- **Frontend**: http://localhost:3000
- **Use**: Local development with hot reload

```bash
docker-compose up -d
```

### 2. **Development/Staging**
- **Branch**: `dev`
- **Database**: MongoDB Atlas (dev cluster)
- **Backend**: Railway/Render (https://api-kebabs-dev.railway.app)
- **Frontend**: Vercel (https://kebabs-dev.vercel.app)
- **Use**: Testing before production, with test data

```bash
# Use alternative docker-compose
docker-compose -f docker-compose.dev.yml up -d

# Or deploy to cloud
npm run deploy:dev
```

### 3. **Production**
- **Branch**: `master`
- **Database**: MongoDB Atlas (prod cluster)
- **Backend**: Railway/AWS/GCP
- **Frontend**: Vercel Pro
- **Use**: Real application with real data

```bash
npm run deploy:prod
```

---

## Environment Configuration

### Local
1. Copy example files:
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

2. Start services:
```bash
docker-compose up -d
```

3. Seed test data:
```bash
docker exec -it kebabs-backend npm run seed
```

### Development/Staging

#### Backend (Railway/Render)
1. Create account on [Railway](https://railway.app) or [Render](https://render.com)
2. Create new project from GitHub
3. Configure environment variables from `.env.development`
4. Connect to MongoDB Atlas (free tier)
5. Auto-deploy from `dev` branch

#### Frontend (Vercel)
1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Link project:
```bash
cd frontend
vercel link
```

3. Configure environment in Vercel Dashboard:
   - Project Settings → Environment Variables
   - Add variables from `.env.development`
   - Link to `dev` branch

4. Deploy:
```bash
vercel --prod # for preview
git push origin dev # auto-deploy
```

### Production

#### MongoDB Atlas
1. Create production cluster (M10+ tier recommended)
2. Configure Network Access (whitelist IPs)
3. Create user with `readWrite` role
4. Get connection string

#### Backend Production
1. Configure service (Railway/AWS/Heroku)
2. Environment variables from `.env.production`
3. Configure custom domain
4. Enable SSL/TLS
5. Configure CI/CD from `master` branch

#### Frontend Production
1. Configure domain in Vercel
2. Production variables in Vercel Dashboard
3. Link to `master` branch
4. Enable auto-deploy

---

## Workflow

```
Local (any branch)
  ↓ commit & push
Dev Branch
  ↓ PR review
  ↓ auto-deploy to staging
Development/Staging
  ↓ testing OK
  ↓ PR to master
Master Branch
  ↓ auto-deploy
Production
```

### Git Commands
```bash
# Local development
git checkout dev
git add .
git commit -m "feat: new feature"
git push origin dev

# Deploy to staging (automatic on push)

# Promote to production
git checkout master
git merge dev
git push origin master

# Deploy to prod (automatic)
```

---

## Critical Environment Variables

### Backend
| Variable | Local | Dev | Prod |
|----------|-------|-----|------|
| `MONGODB_URI` | `mongodb://localhost:27017/...` | MongoDB Atlas Dev | MongoDB Atlas Prod |
| `JWT_SECRET` | any | strong | **very strong** |
| `FRONTEND_URL` | `localhost:3000` | Vercel dev URL | production URL |
| `NODE_ENV` | `development` | `development` | `production` |

### Frontend
| Variable | Local | Dev | Prod |
|----------|-------|-----|------|
| `NEXT_PUBLIC_API_URL` | `localhost:5001` | Railway/Render URL | API prod URL |

---

## Hosting Options

### Backend
- **Railway** (recommended to start): Free tier, easy setup
- **Render**: Free tier, similar to Heroku
- **Fly.io**: Edge computing, good free tier
- **AWS ECS**: Scalable, more complex
- **Google Cloud Run**: Serverless, good for APIs

### Frontend
- **Vercel** (recommended): Optimized for Next.js, generous free tier
- **Netlify**: Solid alternative
- **Cloudflare Pages**: Fast, global CDN

### Database
- **MongoDB Atlas** (recommended): Free tier M0 (512MB), backups, monitoring
- **MongoDB Cloud Manager**: More control
- **Self-hosted**: On VPS if you need more control

---

## Pre-Deploy Checklist

### Development
- [ ] Environment variables configured
- [ ] MongoDB Atlas cluster created
- [ ] Network access configured
- [ ] Backend deployed and working
- [ ] Frontend connected to backend
- [ ] CORS configured correctly
- [ ] Seed executed with test data

### Production
- [ ] Unique and strong JWT secrets
- [ ] DNS domain configured
- [ ] SSL/TLS enabled
- [ ] DB backups scheduled
- [ ] Monitoring configured (Sentry, LogRocket)
- [ ] Rate limiting enabled
- [ ] Environment variables verified
- [ ] Complete testing on staging
- [ ] Rollback plan defined

---

## Useful Commands

```bash
# Start local environment
npm run dev

# Start dev environment (Docker)
docker-compose -f docker-compose.dev.yml up -d

# View backend logs
docker logs -f kebabs-backend

# View frontend logs
docker logs -f kebabs-frontend

# Connect to MongoDB
docker exec -it kebabs-mongodb mongosh

# Generate strong JWT secret
openssl rand -base64 32

# Build for production
npm run build

# Seed data
npm run seed
```

---

## Troubleshooting

### CORS Errors
Verify `FRONTEND_URL` in backend and `NEXT_PUBLIC_API_URL` in frontend

### JWT Invalid
Verify that `JWT_SECRET` is the same in backend and matches between deploys

### MongoDB Connection Failed
- Verify connection string
- Check Network Access in Atlas (IP whitelisting)
- Confirm correct user/password

### Frontend can't reach Backend
- Verify backend URL in environment variables
- Confirm backend is running
- Check CORS configuration
