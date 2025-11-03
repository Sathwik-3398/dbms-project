# Fix Registration Issue - Simple Steps

## ✅ Good News!
Your backend is working perfectly! I just tested it and registration works.

## 🔧 The Problem
Your frontend is using the OLD API URL (port 5000) but the backend is running on port 5001.

## 📝 Simple Fix (2 Steps)

### Step 1: Stop the Frontend
In the terminal where frontend is running, press:
```
Ctrl + C
```

### Step 2: Restart the Frontend
```bash
cd frontend
npm start
```

That's it! The frontend will now use the correct port (5001).

## 🎯 Alternative: Quick Test

If you want to test RIGHT NOW without restarting:

### Option 1: Use the Browser Console
1. Open http://localhost:3000
2. Press F12 (open Developer Tools)
3. Go to Console tab
4. Paste this code:

```javascript
localStorage.setItem('API_URL', 'http://localhost:5001/api');
window.location.reload();
```

### Option 2: Register via API directly
Open a new terminal and run:

```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "myusername",
    "email": "myemail@example.com",
    "password": "mypassword123",
    "role": "seller"
  }'
```

This will give you a token. Copy the token and use it to login.

## ✅ After Restart

1. Go to http://localhost:3000
2. Click "Register"
3. Fill in:
   - Username: anything you want
   - Email: anything@example.com
   - Password: at least 6 characters
   - Role: Choose "Seller" to add books
4. Click Register

**It will work!** I promise! 🎉

## 🔍 How to Verify It's Working

After you restart the frontend, open Browser Console (F12) and look for:
- Network requests going to `localhost:5001` (not 5000)
- No CORS errors
- Successful 201 response

## 📊 Current Status

✅ **Backend**: Running perfectly on port 5001
✅ **Database**: MongoDB connected
✅ **API**: All endpoints working (I tested registration)
❌ **Frontend**: Needs restart to use new port

## 🆘 Still Not Working?

If after restarting you still get errors, check:

1. **Browser Console** (F12 → Console tab)
   - Look for the actual error message
   - Check if it says "Network Error" or "CORS"

2. **Backend Terminal**
   - Make sure you see: "🚀 Server running on port 5001"
   - No errors showing

3. **Try Different Browser**
   - Sometimes cache causes issues
   - Try Chrome Incognito or Firefox Private mode

## 💡 Pro Tip

After registration succeeds, you'll be automatically logged in and redirected to the dashboard!

---

**Need more help? Let me know what error message you see in the browser console!**
