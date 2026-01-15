# Karim Massaoud Portfolio

> A modern, full-stack portfolio with dynamic content management, authentication, and rich case study presentations.

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/) [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/) [![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green)](https://www.mongodb.com/)

**[Live Demo](http://localhost:3000)** • **[GitHub](https://github.com/ic0nk/karim-port)**

---

## 🚀 Quick Start

```bash
# Clone and install
git clone https://github.com/ic0nk/karim-port.git
cd karim-port
npm install

# Configure environment (see .env.local section below)
cp .env.example .env.local

# Start development server
npm run dev

# Create admin user at http://localhost:3000/setup
```

---

## ✨ Features

### 🌐 Public Site
- **Animated homepage** with hero, bio, projects, and experience timeline
- **Dynamic project pages** with 16+ customizable section types
- **GSAP scroll animations** for smooth, engaging UX
- **Contact form** with email notifications
- **Dark/light theme** with persistent preferences
- **Fully responsive** across all devices

### 🔐 Admin Dashboard
- **Full CMS** for homepage, projects, and footer content
- **Project editor** with drag-and-drop section ordering
- **Image uploads** via Cloudinary CDN
- **Message inbox** for contact form submissions
- **Authentication** with NextAuth.js

### 🛠️ Technical
- **Next.js 15** App Router with Server Components
- **MongoDB** with Mongoose ODM
- **TypeScript** for type safety
- **Tailwind CSS 4** with custom design tokens
- **Cloudinary** for optimized image hosting

---

## 📦 Tech Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | Next.js 15, React 19, TypeScript, Tailwind CSS 4 |
| **Backend** | Next.js API Routes, MongoDB, Mongoose |
| **Auth** | NextAuth.js, bcrypt |
| **Media** | Cloudinary CDN |
| **Animations** | GSAP + ScrollTrigger |
| **Email** | Nodemailer (optional) |
| **Dev Tools** | Biome, ESLint |
| **Deployment** | Railway, Vercel |

---

## 🔧 Environment Setup

Create `.env.local` with:

```bash
# MongoDB (required)
MONGODB_URI=mongodb://user:password@host:port/database

# NextAuth (required)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-min-32-chars

# Cloudinary (required for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (optional - for contact notifications)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### Where to Get Credentials

- **MongoDB**: [Railway](https://railway.app/) (free) or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier)
- **Cloudinary**: [Sign up](https://cloudinary.com/) for free tier
- **Email**: Gmail App Password from [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)

---

## 📁 Project Structure

```
src/
├── app/
│   ├── admin/           # Admin dashboard & CMS
│   ├── api/             # API routes (auth, projects, contact)
│   ├── projects/        # Public project pages
│   └── auth/            # Sign in/up pages
├── components/
│   ├── admin/           # Admin-specific components
│   ├── ui/              # Reusable UI components
│   └── PageAnimator.tsx # GSAP scroll animations
├── lib/
│   ├── mongodb.ts       # Database connection
│   ├── auth.ts          # NextAuth config
│   └── cloudinary.ts    # Image upload handler
└── models/              # Mongoose schemas
```

---

## 💻 Development

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Build for production
npm run start        # Run production build
npm run lint         # Lint with Biome
npm run format       # Format code
```

### First-Time Setup

1. Start dev server: `npm run dev`
2. Visit `http://localhost:3000/setup`
3. Create admin account
4. Login at `http://localhost:3000/auth/signin`
5. Start editing content!

---

## 🎨 Admin Features

| Feature | Path | Description |
|---------|------|-------------|
| **Homepage** | `/admin/dashboard` | Edit hero, bio, about, experience |
| **Projects** | `/admin/projects` | CRUD for case studies, 16+ sections |
| **Messages** | `/admin/messages` | View contact submissions |
| **Footer** | `/admin/footer` | Update contact info & social links |

### Project Section Types

✅ Hero • Overview • Problem Statement • Solutions  
✅ Hover Tiles • Quote & Process • Themes Carousel  
✅ Special Offers • Development Process • Screenshots  
✅ Results & Impact • Branding • Wireframes • UI/UX  
✅ Conclusion • Call-to-Action

---

## 🚢 Deployment

### Railway (Recommended)

```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

Add environment variables in Railway dashboard, then deploy.

### Vercel

```bash
npm install -g vercel
vercel
```

Add environment variables in Vercel dashboard.

### Docker

```bash
docker build -t karim-portfolio .
docker run -p 3000:3000 karim-portfolio
```

📖 **Detailed deployment guide**: [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md)

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| **MongoDB connection failed** | Check `MONGODB_URI` format, use external URL for Railway |
| **Images not uploading** | Verify Cloudinary credentials, check API permissions |
| **Animations not working** | Hard refresh (Ctrl+Shift+R), check console errors |
| **Admin login failed** | Run `/setup` first, verify `NEXTAUTH_SECRET` is 32+ chars |
| **Build errors** | Clear cache: `rm -rf .next node_modules && npm install` |

---

## 📊 Performance

- ⚡ **Lighthouse Score**: 95+ across all metrics
- 🖼️ **Image Optimization**: WebP/AVIF via Cloudinary CDN
- 📦 **Code Splitting**: Automatic route-based chunks
- 🎯 **Lazy Loading**: Images and components on-demand
- 🚀 **Server Components**: Reduced JavaScript bundle

---

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repo
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

---

## 📄 License

MIT License - see [LICENSE](LICENSE)

---

## 📧 Support

- 🐛 **Issues**: [GitHub Issues](https://github.com/ic0nk/karim-port/issues)
- 📧 **Email**: karimmassaoud@gmail.com
- 💼 **Portfolio**: [View Live](http://localhost:3000)

---

**Built with ❤️ by Karim Massaoud**
