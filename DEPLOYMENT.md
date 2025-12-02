# 🚀 Deployment Guide - Vercel

This guide will help you deploy your portfolio to Vercel using GitHub.

## 📋 Prerequisites

1. **GitHub Account** - Your code should be in a GitHub repository
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com) (free)
3. **Environment Variables** - Prepare your environment variables (see below)

## 🔧 Step 1: Prepare Your Repository

### 1.1 Ensure All Files Are Committed

```bash
# Check git status
git status

# Add all files
git add .

# Commit changes
git commit -m "Prepare for Vercel deployment"

# Push to GitHub
git push origin main
```

### 1.2 Verify Project Structure

Your project should have:

- ✅ `vercel.json` in the root directory
- ✅ `frontend/` directory with your React app
- ✅ `frontend/package.json` with build scripts
- ✅ `.gitignore` to exclude unnecessary files

## 🌐 Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**

   - Visit [vercel.com](https://vercel.com)
   - Click "Add New Project"

2. **Import Your Repository**

   - Connect your GitHub account if not already connected
   - Select your portfolio repository
   - Click "Import"

3. **Configure Project Settings**

   - **Framework Preset:** Vite (or auto-detect)
   - **Root Directory:** Leave empty (Vercel will use `vercel.json`)
   - **Build Command:** `cd frontend && npm run build` (auto-detected from vercel.json)
   - **Output Directory:** `frontend/dist` (auto-detected from vercel.json)
   - **Install Command:** `cd frontend && npm install` (auto-detected from vercel.json)

4. **Add Environment Variables**

   - Click "Environment Variables"
   - Add the following variables (see `.env.example` for reference):

   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_API_URL=your_api_url
   VITE_API_KEY=your_firebase_api_key
   VITE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_PROJECT_ID=your_firebase_project_id
   VITE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_APP_ID=your_firebase_app_id
   VITE_MEASUREMENT_ID=your_firebase_measurement_id
   ```

   **Note:** If you don't have Supabase/API configured, the app will automatically use mock data.

5. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete
   - Your site will be live at `your-project.vercel.app`

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Navigate to project root
cd /path/to/portfolio

# Login to Vercel
vercel login

# Deploy (follow prompts)
vercel

# For production deployment
vercel --prod
```

## 🔄 Step 3: Automatic Deployments

Vercel automatically deploys:

- **Production:** Every push to `main` branch
- **Preview:** Every push to other branches (creates preview URLs)

## 📝 Step 4: Environment Variables in Vercel

### Adding Environment Variables:

1. Go to your project in Vercel Dashboard
2. Click **Settings** → **Environment Variables**
3. Add each variable:
   - **Key:** `VITE_SUPABASE_URL`
   - **Value:** Your actual Supabase URL
   - **Environment:** Production, Preview, Development (select all)
4. Click **Save**
5. **Redeploy** your project for changes to take effect

### Required vs Optional Variables:

**Optional (App works with mock data if not provided):**

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_API_URL`

**Required (For authentication to work):**

- `VITE_API_KEY`
- `VITE_AUTH_DOMAIN`
- `VITE_PROJECT_ID`
- `VITE_STORAGE_BUCKET`
- `VITE_MESSAGING_SENDER_ID`
- `VITE_APP_ID`
- `VITE_MEASUREMENT_ID`

## 🎯 Step 5: Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Vercel will automatically configure SSL

## 🐛 Troubleshooting

### Build Fails

1. **Check Build Logs:**

   - Go to your project → **Deployments** → Click on failed deployment
   - Review the build logs for errors

2. **Common Issues:**
   - **Missing dependencies:** Ensure `package.json` has all required packages
   - **Build command error:** Check `vercel.json` configuration
   - **Environment variables:** Ensure all required variables are set

### App Not Loading

1. **Check Browser Console:**

   - Open browser DevTools
   - Look for errors in Console tab

2. **Verify Routes:**
   - Ensure `vercel.json` has proper rewrite rules
   - All routes should redirect to `index.html` for SPA routing

### Images Not Loading

1. **Check Image Paths:**

   - Ensure images are in `frontend/public/images/`
   - Paths should start with `/images/` (e.g., `/images/portfolio-image.jpg`)

2. **Verify Build Output:**
   - Check if images are copied to `frontend/dist/images/` after build

## 📊 Monitoring

- **Analytics:** Vercel provides built-in analytics
- **Logs:** View real-time logs in Vercel Dashboard
- **Performance:** Check Core Web Vitals in Analytics tab

## 🔐 Security Notes

1. **Never commit `.env` files** - They're in `.gitignore`
2. **Use Vercel Environment Variables** - Secure way to store secrets
3. **Enable Vercel Protection** - Protect your deployment from abuse

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [React Router Deployment](https://reactrouter.com/en/main/start/overview#deploying)

## ✅ Deployment Checklist

Before deploying, ensure:

- [ ] All code is committed and pushed to GitHub
- [ ] `vercel.json` is in the root directory
- [ ] `.gitignore` excludes `node_modules`, `.env`, and `dist`
- [ ] Environment variables are prepared
- [ ] Build command works locally (`cd frontend && npm run build`)
- [ ] All images are in `frontend/public/images/`
- [ ] All CV files are in `frontend/public/cv/`

## 🎉 Success!

Once deployed, your portfolio will be live at:

- **Production:** `https://your-project.vercel.app`
- **Preview:** `https://your-project-git-branch.vercel.app`

---

**Need Help?** Check the [Vercel Support](https://vercel.com/support) or open an issue in your repository.
