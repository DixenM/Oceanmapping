# 📱 Testing the App on Your iPhone

Since you're currently on your phone without laptop access, here are **3 easy options** to test the Denmark Tide Map app on your iPhone:

---

## ✅ **Option 1: GitHub Pages (Recommended - Automated)**

I've set up automatic GitHub Pages deployment for you!

### Steps:
1. **On your iPhone**, open Safari and go to: https://github.com/DixenM/Oceanmapping
2. Go to **Settings** → **Pages** (in the left sidebar)
3. Under "Build and deployment":
   - Set **Source** to: "GitHub Actions"
4. Go to **Settings** → **Secrets and variables** → **Actions**
5. Click **"New repository secret"**
   - Name: `VITE_WORLDTIDES_API_KEY`
   - Value: Your WorldTides API key
6. Go to **Actions** tab and click **"Deploy to GitHub Pages"**
7. Click **"Run workflow"** → **"Run workflow"**
8. Wait 2-3 minutes for deployment to complete
9. Your app will be available at: **https://dixenm.github.io/Oceanmapping/**

---

## ✅ **Option 2: Vercel (Also Easy)**

1. **On your iPhone**, go to: https://vercel.com/new
2. Sign in with GitHub
3. Click **"Import"** next to the **Oceanmapping** repository
4. Under **Environment Variables**, add:
   - Name: `VITE_WORLDTIDES_API_KEY`
   - Value: Your WorldTides API key
5. Click **"Deploy"**
6. Wait 1-2 minutes
7. You'll get a URL like: **https://oceanmapping-xyz.vercel.app**

---

## ✅ **Option 3: Netlify (Alternative)**

1. **On your iPhone**, go to: https://app.netlify.com/start
2. Sign in with GitHub
3. Select the **Oceanmapping** repository
4. Set build command: `npm run build`
5. Set publish directory: `dist`
6. Under **Environment variables**, add:
   - Key: `VITE_WORLDTIDES_API_KEY`
   - Value: Your WorldTides API key
7. Click **"Deploy"**
8. You'll get a URL like: **https://oceanmapping-xyz.netlify.app**

---

## 🔑 Important: API Key

The app needs a **WorldTides API key** to show real tide data. You can:
- Get one free at: https://www.worldtides.info/developer
- Or use the app without an API key (it will show demo/mock data)

---

## 📱 What You'll Be Able to Test

Once deployed, you can test on your iPhone:
- ✅ Interactive map with Danish coastal stations
- ✅ Real-time tide information
- ✅ Marine weather data (waves, wind)
- ✅ GPS location finding
- ✅ Search functionality
- ✅ Touch-friendly bottom sheet interface
- ✅ PWA features (installable on home screen)

---

## 🚀 Quick Recommendation

**Easiest for iPhone**: Use **Vercel** (Option 2) - it has the simplest mobile interface and deploys in ~1 minute.

**Most Automated**: Use **GitHub Pages** (Option 1) - it will auto-deploy every time you push to main branch.

Let me know which option you'd like help with! 📱🌊
