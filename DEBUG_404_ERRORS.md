# 🔍 Debug 404 Errors

## How to Find the Exact 404 Error:

### Method 1: Browser Console
1. Press **F12** to open DevTools
2. Go to **Console** tab
3. Look for red errors with "404"
4. Copy the full URL that's failing

### Method 2: Network Tab
1. Press **F12** to open DevTools
2. Go to **Network** tab
3. Refresh the page (Ctrl+R)
4. Look for red items (failed requests)
5. Click on the failed request
6. Check the **Request URL**

## Common 404 Issues:

### 1. Missing API Endpoint
**Error:** `GET https://study-4g3u.onrender.com/api/something 404`

**Solution:**
- Check if the route exists in backend
- Verify the endpoint name is correct
- Check backend logs on Render

### 2. Missing Static Asset
**Error:** `GET https://study-five-indol.vercel.app/assets/something.png 404`

**Solution:**
- Check if the file exists in frontend
- Verify the path is correct
- Rebuild and redeploy frontend

### 3. Wrong API URL
**Error:** `GET http://localhost:5000/api/something 404`

**Solution:**
- Check `.env` file has correct `VITE_API_URL`
- Should be: `VITE_API_URL=https://study-4g3u.onrender.com/api`
- Redeploy frontend on Vercel

### 4. Route Not Found
**Error:** Browser shows "Cannot GET /some-page"

**Solution:**
- Check if route exists in `App.jsx`
- Verify the path is correct
- Check for typos in route names

## Quick Checks:

### Backend Health Check:
Open: https://study-4g3u.onrender.com/
Should show: `{"message":"❤️ Welcome to Our Little Universe API","status":"running"}`

### Test API Endpoints:
```bash
# Test memories
curl https://study-4g3u.onrender.com/api/memories

# Test music settings
curl https://study-4g3u.onrender.com/api/music

# Test counter
curl https://study-4g3u.onrender.com/api/counter

# Test open when
curl https://study-4g3u.onrender.com/api/openwhen
```

### Frontend Environment:
Check Vercel dashboard → Your Project → Settings → Environment Variables
Should have:
```
VITE_API_URL=https://study-4g3u.onrender.com/api
```

## Backend Routes Available:

- ✅ `/api/memories` - GET, POST
- ✅ `/api/memories/:id` - GET, PUT, DELETE
- ✅ `/api/openwhen` - GET, POST
- ✅ `/api/openwhen/:id` - GET, PUT, DELETE
- ✅ `/api/secrets` - GET, POST
- ✅ `/api/goals` - GET, POST
- ✅ `/api/goals/:id` - GET, PUT, DELETE
- ✅ `/api/counter` - GET, PUT
- ✅ `/api/auth/verify` - POST
- ✅ `/api/auth/setup` - POST
- ✅ `/api/surprises` - GET, POST
- ✅ `/api/surprises/:id` - GET, PUT, DELETE
- ✅ `/api/music` - GET, PUT, DELETE
- ✅ `/api/deezer/search` - GET

## If Still Getting 404:

1. **Check Render Logs:**
   - Go to Render Dashboard
   - Click on your service
   - Go to "Logs" tab
   - Look for errors

2. **Check Vercel Logs:**
   - Go to Vercel Dashboard
   - Click on your project
   - Go to "Deployments"
   - Click latest deployment
   - Check "Build Logs" and "Function Logs"

3. **Clear Cache:**
   - Clear browser cache (Ctrl+Shift+Delete)
   - Hard refresh (Ctrl+F5)
   - Try incognito mode

4. **Verify Deployment:**
   - Make sure latest code is pushed to Git
   - Check Render deployed successfully
   - Check Vercel deployed successfully

## Need More Help?

Share these details:
1. Full error message from console
2. The exact URL that's failing
3. Which page you're on
4. Screenshot of the error
5. Render logs (if backend issue)
6. Vercel logs (if frontend issue)
