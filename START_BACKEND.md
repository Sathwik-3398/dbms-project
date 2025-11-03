# Start Backend Server

## Quick Setup (2 minutes)

### Step 1: Create .env file

```bash
cd backend
cat > .env << 'EOF'
NODE_ENV=development
PORT=5000

# Database - Use one of these options:
MONGODB_URI=mongodb://localhost:27017/book-marketplace

# JWT Secrets (required)
JWT_SECRET=supersecretkey123456789
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=refreshsecretkey987654321
JWT_REFRESH_EXPIRE=30d

# Cloudinary (optional for now)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe (optional for now)
STRIPE_SECRET_KEY=sk_test_your_stripe_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Email (optional for now)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
FROM_EMAIL=noreply@bookmarketplace.com
FROM_NAME=Book Marketplace

# Frontend URL
CLIENT_URL=http://localhost:3000

# Platform Fee
PLATFORM_FEE_PERCENTAGE=10
EOF
```

### Step 2: Start MongoDB (Choose one option)

**Option A: Local MongoDB (if installed)**
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

**Option B: Use MongoDB Atlas (Recommended - Free)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free
3. Create a cluster (free tier)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace the MONGODB_URI in .env with your connection string

Example:
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/book-marketplace?retryWrites=true&w=majority
```

### Step 3: Start Backend Server

```bash
npm run dev
```

You should see:
```
✅ MongoDB Connected Successfully
🚀 Server running on port 5000 in development mode
```

## ✅ Backend is Ready!

Now you can:
1. Register a new user at http://localhost:3000/register
2. Login with your credentials
3. Test all features

## 🔧 Troubleshooting

### "MongoDB connection error"
- **Local MongoDB**: Make sure MongoDB is installed and running
- **Atlas**: Check your connection string and network access settings

### "Port 5000 already in use"
```bash
# Find and kill the process
lsof -ti:5000 | xargs kill -9
```

### "Module not found"
```bash
cd backend
rm -rf node_modules
npm install
```

## 🎯 Test Backend is Working

Open a new terminal and run:
```bash
curl http://localhost:5000/health
```

Should return:
```json
{"success":true,"message":"Server is running","timestamp":"..."}
```

## 📝 Quick MongoDB Atlas Setup (5 minutes)

1. Visit https://www.mongodb.com/cloud/atlas/register
2. Sign up with Google/GitHub
3. Choose "Free" tier
4. Create cluster (takes 3-5 minutes)
5. Click "Database Access" → Add user (username/password)
6. Click "Network Access" → Add IP Address → "Allow from anywhere" (0.0.0.0/0)
7. Click "Connect" → "Connect your application"
8. Copy connection string
9. Replace `<password>` with your database user password
10. Paste into backend/.env as MONGODB_URI

Done! 🎉
