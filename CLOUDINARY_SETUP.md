# Cloudinary Setup Guide

This project uses Cloudinary for cloud-based image storage with automatic optimization and CDN delivery.

## Why Cloudinary?

- **Cloud Storage**: No local filesystem dependency, works seamlessly on platforms like Railway
- **Automatic Optimization**: Auto format conversion (WebP, AVIF), quality adjustment, and resizing
- **CDN Delivery**: Fast global image delivery through Cloudinary's CDN
- **Transformations**: On-the-fly image transformations via URL parameters

## Setup Steps

### 1. Create a Cloudinary Account

1. Go to [https://cloudinary.com/users/register/free](https://cloudinary.com/users/register/free)
2. Sign up for a free account (generous free tier included)
3. Verify your email address

### 2. Get Your Credentials

1. Log in to your Cloudinary dashboard
2. Go to the **Dashboard** (home page after login)
3. You'll see your **Account Details** section with:
   - **Cloud Name**
   - **API Key**
   - **API Secret** (click the eye icon to reveal)

### 3. Add Credentials to Environment Variables

1. Copy the `.env.local.example` file to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Open `.env.local` and add your Cloudinary credentials:
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name_here
   CLOUDINARY_API_KEY=your_api_key_here
   CLOUDINARY_API_SECRET=your_api_secret_here
   ```

3. Replace the placeholder values with your actual Cloudinary credentials

### 4. For Production (Railway)

Add the same environment variables to your Railway project:

1. Go to your Railway project dashboard
2. Click on **Variables** tab
3. Add these variables:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`

## Image Upload Features

### Automatic Optimizations

The upload configuration includes:
- **Max Dimensions**: 2000x2000px (maintains aspect ratio)
- **Quality**: Auto-optimized for best balance of quality/size
- **Format**: Auto-converted to most efficient format (WebP, AVIF)
- **Lazy Loading**: Images are optimized for lazy loading

### Folder Structure

Images are organized by type:
- `portfolio/projects/` - Project case study images
- `portfolio/homepage/` - Homepage assets
- `portfolio/avatars/` - Profile and avatar images

### Upload Limits

- **File Size**: Max 10MB per image
- **Formats**: JPEG, PNG, GIF, WebP, AVIF
- **Storage**: Free tier includes 25GB storage and 25GB monthly bandwidth

## Usage in Code

### Upload an Image

```typescript
import { uploadToCloudinary } from '@/lib/cloudinary';

const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch('/api/projects/upload-image', {
  method: 'POST',
  body: formData,
});

const data = await response.json();
// data.url - Full image URL
// data.publicId - Cloudinary public ID for deletion
```

### Delete an Image

```typescript
const response = await fetch('/api/projects/upload-image', {
  method: 'DELETE',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ publicId: 'portfolio/projects/abc123' }),
});
```

## Troubleshooting

### Error: "Missing Cloudinary credentials"

- Ensure all three environment variables are set in `.env.local`
- Restart your development server after adding variables
- Check for typos in variable names

### Upload Failed

- Verify file is under 10MB
- Check file format is supported (JPEG, PNG, GIF, WebP)
- Ensure your Cloudinary account is active

### Images Not Loading

- Check the image URL is correct
- Verify your cloud name in the URL matches your account
- Check Cloudinary dashboard for storage limits

## Resources

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Next.js Image Optimization](https://cloudinary.com/documentation/nextjs_integration)
- [Upload API Reference](https://cloudinary.com/documentation/image_upload_api_reference)

## Free Tier Limits

Cloudinary's free tier includes:
- 25 GB storage
- 25 GB monthly bandwidth
- 25,000 total transformations/month
- All image formats and transformations

This is more than enough for a personal portfolio!
