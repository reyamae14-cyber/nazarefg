# Zetflix - Serverless Deployment Guide

This project has been converted to a fully serverless architecture for deployment on Vercel.

## 🚀 Architecture Overview

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **Deployment**: Vercel (Static Site)

### Backend (Serverless Functions)
- **Runtime**: Node.js 18.x
- **Database**: MongoDB Atlas
- **Authentication**: JWT with HTTP-only cookies
- **API**: Vercel Serverless Functions

## 📁 Project Structure

```
client/
├── api/                    # Serverless API functions
│   ├── auth/              # Authentication endpoints
│   │   ├── login.js       # POST /api/auth/login
│   │   ├── signup.js      # POST /api/auth/signup
│   │   ├── logout.js      # POST /api/auth/logout
│   │   └── verify.js      # GET /api/auth/verify
│   ├── users/             # User management
│   │   ├── index.js       # GET /api/users
│   │   ├── [id].js        # PATCH/DELETE /api/users/:id
│   │   └── [id]/subprofiles.js # Profile management
│   ├── movies/            # Movie browsing
│   │   └── browse.js      # POST /api/movies/browse
│   └── profiles/          # Profile icons
│       └── icons.js       # GET /api/profiles/icons
├── lib/                   # Shared utilities
│   ├── mongodb.js         # Database connection
│   ├── models/            # Mongoose models
│   └── middleware/        # Authentication middleware
├── src/                   # React frontend
└── data/                  # Static data files
```

## 🔧 Environment Variables

Create a `.env.local` file in the client directory with:

```env
# Database Configuration
DATABASE=mongodb+srv://<username>:<password>@cluster0.c6tlcfz.mongodb.net/zetflixtv?retryWrites=true&w=majority&appName=Cluster0
USER=zeticuz
DATABASE_PASSWORD=PbSAmyQAr4hd4ehJ

# JWT Secret
JWT_SECRET=B9B62B9867464625369927B83DF9B34229D6237B6553D1D1D1897A9C35

# TMDB API Configuration
TMDB_URL=https://api.themoviedb.org/3
TMDB_AUTH=eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzOWU1ZDQ4NzRjMTAyYjBhOWI2MTYzOWM4MWI5YmRhMSIsIm5iZiI6MTc1MDYyMjYxNi44MTIsInN1YiI6IjY4NTg2MTk4MjgxYTRlODhmNWQwZmE2NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.9F1obj-HBrs4V5CsMoki4hxQ3mCctKH_YJ7UbPY07MY

# Node Environment
NODE_ENV=production
```

## 🚀 Deployment Steps

### 1. GitHub Setup

1. **Initialize Git Repository**:
   ```bash
   cd client
   git init
   git add .
   git commit -m "Initial serverless conversion"
   ```

2. **Create GitHub Repository**:
   - Go to GitHub and create a new repository
   - Push your code:
   ```bash
   git remote add origin https://github.com/yourusername/zetflix-serverless.git
   git branch -M main
   git push -u origin main
   ```

### 2. Vercel Deployment

1. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Build Settings**:
   - **Framework Preset**: Vite
   - **Root Directory**: `client` (if deploying from monorepo)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

3. **Environment Variables**:
   Add all environment variables from `.env.local` to Vercel:
   - Go to Project Settings → Environment Variables
   - Add each variable individually

4. **Deploy**:
   - Click "Deploy"
   - Vercel will automatically build and deploy your application

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/verify` - Verify JWT token

### User Management
- `GET /api/users` - Get all users
- `PATCH /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Profile Management
- `GET /api/users/:id/subprofiles` - Get user profiles
- `POST /api/users/:id/subprofiles` - Create new profile

### Movies
- `POST /api/movies/browse` - Browse movies by region

### Profile Icons
- `GET /api/profiles/icons` - Get available profile icons

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **HTTP-only Cookies**: Prevents XSS attacks
- **Environment Variables**: Sensitive data stored securely
- **CORS Protection**: Configured for production domains
- **Input Validation**: Mongoose schema validation

## 🚀 Performance Optimizations

- **Connection Pooling**: Optimized MongoDB connections for serverless
- **Cold Start Mitigation**: Cached database connections
- **Static Assets**: Served via Vercel's CDN
- **Code Splitting**: Automatic with Vite

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Timeout**:
   - Ensure MongoDB Atlas allows connections from `0.0.0.0/0`
   - Check environment variables are correctly set

2. **CORS Errors**:
   - Verify domain is added to CORS configuration
   - Check cookie settings for cross-origin requests

3. **Build Failures**:
   - Ensure all dependencies are in `package.json`
   - Check Node.js version compatibility

### Logs and Monitoring

- **Vercel Functions**: View logs in Vercel dashboard
- **Database**: Monitor connections in MongoDB Atlas
- **Performance**: Use Vercel Analytics

## 📈 Scaling Considerations

- **Database**: MongoDB Atlas auto-scaling
- **Functions**: Vercel automatically scales serverless functions
- **CDN**: Global edge network for static assets
- **Monitoring**: Set up alerts for function errors and database performance

## 🔄 Migration from Traditional Server

This project was successfully migrated from:
- Express.js server → Vercel Serverless Functions
- Traditional hosting → Serverless architecture
- Persistent connections → Optimized serverless connections

## 📞 Support

For deployment issues:
1. Check Vercel function logs
2. Verify environment variables
3. Test API endpoints individually
4. Monitor database connections