# Railway Deployment Fix — Backend Service

## What Was Fixed
✅ **Created `backend/railway.json`** — Tells Railway to build from the `backend/` directory
✅ **Fixed TypeScript build** — Added `@types/cors` and fixed type annotation
✅ **Compiled successfully** — `backend/dist/index.js` is ready

## Next Steps in Railway Dashboard

### Option 1: Redeploy Current Service
1. Go to https://railway.app/dashboard
2. Click on your project → Backend/API service
3. In the service settings, verify:
   - **Name:** "backend" or "api" or similar
   - **Start Command:** `npm start`
   - **Build Command:** (should auto-detect from package.json)
4. Trigger a **Manual Redeploy**:
   - Go to **Deployments** tab
   - Click "Redeploy" button or trigger from GitHub push

### Option 2: Check if Service Exists
If you don't see a backend service:
1. Go to **Services** in your Railway project
2. Click **+ New Service**
3. Choose **GitHub Repo**
4. Select your repo and **Specify root directory as `backend/`**

### Verify Deployment Success
Once deployed, check the logs:
1. Go to **Logs** tab in the service
2. You should see:
   ```
   Database initialized
   Server running on http://localhost:3000
   ```

### Test the API
After successful deployment:
```bash
# Replace YOUR_RAILWAY_URL with your actual Railway deployment URL
curl https://YOUR_RAILWAY_URL/api/health
# Should return: {"status":"ok"}
```

### Find Your Railway URL
1. Go to **Settings** tab in the backend service
2. Under **Environment**, copy the **Public URL** or **Custom Domain**
3. That's your `API_URL` to use in frontend

## Troubleshooting
- **Still seeing "Cannot find module"?** → Railway may need a clean rebuild. Try deleting `dist/` and redeploying.
- **Port issues?** → Railway sets `PORT` env var automatically; code uses `process.env.PORT || 3000`
- **Logs not showing?** → Check **Deployment** tab → **Build Logs** for compilation errors

## Next: Connect Frontend
Once backend is live, update `assets/api-adapter.js`:
```javascript
const API_URL = 'https://YOUR_RAILWAY_URL/api';  // Production
```

Test a few endpoints from your browser console:
```javascript
api.getHealth().then(console.log)
api.getProducts().then(console.log)
```
