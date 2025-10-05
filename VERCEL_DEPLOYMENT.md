# Vercel Deployment Guide for PhoneMax

## 🚀 Quick Fix Steps

### 1. **Disable Vercel Authentication Protection**

Your deployment currently has Vercel's authentication protection enabled. To disable it:

1. Go to your Vercel project dashboard: https://vercel.com/shivamurthy-p-ms-projects/website-mqrxpvyto
2. Click on **Settings** → **Deployment Protection**
3. Set protection to **"None"** or configure it to allow public access
4. Save changes

### 2. **Set Up Database for Production**

Since SQLite doesn't work on Vercel's serverless platform, you need to set up a proper database:

#### Option A: Use Vercel Postgres (Recommended)

1. Go to your project on Vercel
2. Click on **Storage** tab
3. Click **Create Database** → **Postgres**
4. Follow the setup wizard
5. Vercel will automatically add `DATABASE_URL` environment variable

#### Option B: Use External Database (Alternative)

Use one of these services:
- **Supabase** (PostgreSQL): https://supabase.com
- **PlanetScale** (MySQL): https://planetscale.com
- **Neon** (PostgreSQL): https://neon.tech

Then add the `DATABASE_URL` to your environment variables in Vercel.

### 3. **Configure Environment Variables in Vercel**

1. Go to **Settings** → **Environment Variables**
2. Add these variables:

```
NEXTAUTH_SECRET=KIVvNc3GCqc0uwARg9AYrr5vN8VqvF1IX0lzSGXzJZQ=
NEXTAUTH_URL=https://website-mqrxpvyto-shivamurthy-p-ms-projects.vercel.app
NODE_ENV=production
DATABASE_URL=(automatically added if using Vercel Postgres)
```

### 4. **Deploy Changes**

After making the above changes, commit and push your code:

```bash
git add .
git commit -m "Fix Vercel deployment: remove auth protection and add production config"
git push origin main
```

Vercel will automatically redeploy your site.

## 🔧 What Was Fixed

1. **Changed `vercel.json`**:
   - Set `"public": true` to disable authentication requirement
   - Removed hardcoded environment variables (these should be set in Vercel dashboard)

2. **Created `.env.production`**:
   - Production environment configuration
   - Proper NEXTAUTH_URL pointing to your Vercel deployment

3. **Created `.vercelignore`**:
   - Excludes SQLite database files from deployment
   - Prevents build errors from file-based database

## 📋 Post-Deployment Checklist

After deploying, verify these work:

- [ ] Homepage loads without authentication prompt
- [ ] Consumer pages work (products, cart, checkout)
- [ ] Admin dashboard accessible (with proper admin login)
- [ ] Database operations work (if you set up a database)
- [ ] Images load correctly
- [ ] API routes respond properly

## 🐛 Common Issues & Solutions

### Issue: Site still requires authentication
**Solution**: Make sure you disabled Deployment Protection in Vercel dashboard settings.

### Issue: Database connection errors
**Solution**: Verify DATABASE_URL is set correctly in Vercel environment variables.

### Issue: Admin pages show 403 errors
**Solution**: This is expected - admin pages require authentication. Make sure you can login with admin credentials.

### Issue: 404 errors on some pages
**Solution**: Redeploy to ensure all routes are properly built.

## 📞 Need Help?

If you encounter issues:
1. Check Vercel deployment logs in your dashboard
2. Verify all environment variables are set correctly
3. Ensure database connection is working
4. Check that the latest code is pushed to GitHub

---

**Current Deployment URL**: https://website-mqrxpvyto-shivamurthy-p-ms-projects.vercel.app
