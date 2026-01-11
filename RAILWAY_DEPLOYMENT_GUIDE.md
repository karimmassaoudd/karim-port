# 🚀 Railway Deployment Guide

## Production Ready Checklist ✅

Your project is now configured for production deployment on Railway!

### Pre-Deployment Steps Completed

- ✅ Production build configuration optimized
- ✅ pnpm package manager configured
- ✅ Environment variables template created (.env.example)
- ✅ TypeScript errors resolved
- ✅ Deployment files configured (railway.json, nixpacks.toml)
- ✅ Image optimization enabled
- ✅ Security headers configured
- ✅ Console logs removed in production (except errors/warnings)

---

## 📋 Deployment Steps

### 1. Prepare Environment Variables

Before deploying, gather these required values:

#### MongoDB
- `MONGODB_URI` - Your MongoDB connection string
  - Format: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`
  - Get from: MongoDB Atlas → Connect → Connect your application

#### NextAuth
- `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`
- `NEXTAUTH_URL` - Will be your Railway domain (e.g., `https://your-app.up.railway.app`)

#### Cloudinary (for image uploads)
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- Get from: Cloudinary Dashboard → Settings → Access Keys

#### Optional
- `NEXT_PUBLIC_LOADER_TEXT` - Custom loader text (default: "KARIM MASSAOUD")
- `NEXT_PUBLIC_LOADER_TEXT_COLOR` - Loader color (default: "#155B86")
- `NODE_ENV` - Set to `production`
- `NEXT_TELEMETRY_DISABLED` - Set to `1`

---

### 2. Deploy to Railway

#### Option A: Deploy via Railway Dashboard

1. **Go to Railway**: https://railway.app
2. **New Project** → "Deploy from GitHub repo"
3. **Select Repository**: Choose `karim-port`
4. **Add Environment Variables**:
   - Click on your service
   - Go to "Variables" tab
   - Add all the variables from step 1
5. **Deploy**: Railway will automatically build and deploy

#### Option B: Deploy via Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Link to project (or create new)
railway link

# Add environment variables
railway variables set MONGODB_URI="your-mongodb-uri"
railway variables set NEXTAUTH_SECRET="your-secret"
railway variables set NEXTAUTH_URL="https://your-app.up.railway.app"
railway variables set CLOUDINARY_CLOUD_NAME="your-cloud-name"
railway variables set CLOUDINARY_API_KEY="your-api-key"
railway variables set CLOUDINARY_API_SECRET="your-api-secret"
railway variables set NODE_ENV="production"

# Deploy
railway up
```

---

### 3. Post-Deployment

#### Update NEXTAUTH_URL
1. After first deployment, Railway gives you a URL (e.g., `https://karim-port-production.up.railway.app`)
2. Update the `NEXTAUTH_URL` variable to match this URL
3. Redeploy if needed

#### Custom Domain (Optional)
1. In Railway dashboard → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXTAUTH_URL` to your custom domain

---

## 🔍 Monitoring & Troubleshooting

### View Logs
```bash
# Via CLI
railway logs

# Or in Railway Dashboard
# Service → Deployments → Click deployment → View Logs
```

### Common Issues

#### Build Fails
- Check build logs in Railway dashboard
- Verify all dependencies are in package.json
- Ensure pnpm-lock.yaml is committed

#### Database Connection Fails
- Verify MONGODB_URI is correct
- Check MongoDB Atlas network access (allow 0.0.0.0/0 for Railway)
- Ensure database user has correct permissions

#### Images Not Uploading
- Verify Cloudinary credentials
- Check API limits on Cloudinary free tier
- Review server logs for upload errors

#### Authentication Issues
- Verify NEXTAUTH_SECRET is set
- Ensure NEXTAUTH_URL matches your deployment URL
- Check for CORS issues in browser console

---

## ⚡ Performance Tips

### Database
- Create indexes for frequently queried fields
- Use MongoDB aggregation for complex queries
- Monitor query performance in MongoDB Atlas

### Images
- Images are already optimized via Next.js Image component
- Cloudinary provides automatic optimization
- Consider using CDN for static assets

### Caching
- API routes have cache headers configured
- Static assets cached automatically by Next.js
- Consider Redis for session storage (advanced)

---

## 🔒 Security Checklist

- ✅ Environment variables not committed to git
- ✅ NEXTAUTH_SECRET is strong and random
- ✅ MongoDB connection uses authentication
- ✅ Security headers configured in next.config.ts
- ✅ Powered-by header disabled
- ⚠️ Review CORS settings if using external APIs
- ⚠️ Set up rate limiting for API routes (recommended)
- ⚠️ Enable MongoDB IP whitelist (recommended)

---

## 📊 Build Information

### Build Command
```bash
pnpm run build
```

### Start Command
```bash
pnpm start
```

### Node Version
- Required: Node.js >= 20.0.0
- Required: pnpm >= 9.0.0

---

## 🆘 Support Resources

- **Railway Docs**: https://docs.railway.app
- **Next.js Docs**: https://nextjs.org/docs
- **MongoDB Atlas**: https://docs.atlas.mongodb.com
- **Cloudinary**: https://cloudinary.com/documentation

---

## 🎉 Success!

Once deployed successfully:

1. Visit your Railway URL
2. Test all pages and functionality
3. Try authentication (signup/signin)
4. Upload images in admin panel
5. Monitor Railway dashboard for any issues

### First Admin User

To create your first admin user:

1. Sign up via the `/auth/signup` page
2. Go to your MongoDB database
3. Find the user document
4. Manually set `role: "admin"` in the document
5. Or use the `/api/setup` endpoint if configured

---

## 📝 Additional Notes

- Railway provides automatic SSL certificates
- Deployments are triggered on git push to main branch
- You can pause/restart services in Railway dashboard
- Monitor resource usage to stay within free tier limits
- Consider upgrading plan for production traffic

---

**Last Updated**: January 11, 2026
**Deployment Status**: ✅ Production Ready
