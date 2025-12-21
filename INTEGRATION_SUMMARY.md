# Homepage-Database Integration & Cloudinary Setup

## Overview

Successfully integrated the homepage projects section with the case study project database and implemented Cloudinary for cloud-based image storage.

## Changes Summary

### 1. HomePage Model Updates ✅

**File**: `src/models/HomePage.ts`

- Changed from embedded project data to project references
- Old structure: `IProjectItem` with full project details (title, description, imageUrl, etc.)
- New structure: `IProjectReference` with minimal data (projectId, order, isVisible)
- Benefits:
  - Single source of truth for project data
  - No data duplication between homepage and case studies
  - Automatic sync when updating projects

```typescript
// Old
interface IProjectItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  projectUrl: string;
  technologies: string[];
  isVisible: boolean;
}

// New
interface IProjectReference {
  projectId: string; // References Project._id
  order: number;
  isVisible: boolean;
}
```

### 2. Cloudinary Integration ✅

**New File**: `src/lib/cloudinary.ts`

- Configured Cloudinary SDK with environment variables
- Created utility functions:
  - `uploadToCloudinary(buffer, folder)` - Upload with automatic optimization
  - `deleteFromCloudinary(publicId)` - Delete images from Cloudinary
- Transformations applied:
  - Max dimensions: 2000x2000px (maintains aspect ratio)
  - Quality: Auto-optimized (`quality: "auto:good"`)
  - Format: Auto-converted to best format (`fetch_format: "auto"`)

**Updated File**: `src/app/api/projects/upload-image/route.ts`

- Switched from local filesystem to Cloudinary storage
- POST endpoint now returns `{ url, publicId }`
- DELETE endpoint now uses `publicId` instead of filename
- Increased max file size from 5MB to 10MB
- No more local `public/uploads/` directory needed

### 3. Homepage API Updates ✅

**File**: `src/app/api/homepage/route.ts`

- Added `.populate()` to fetch full project details from references
- GET endpoint populates `featuredProjects.projectId` with project data
- PUT endpoint also populates after saving
- Filters projects by `status: 'published'` automatically
- Returns project details: title, slug, status, heroSection.thumbnail, technologies

### 4. Admin Dashboard Updates ✅

**New Component**: `src/components/admin/ProjectSelector.tsx`

- Visual project selector for homepage dashboard
- Features:
  - Fetch all published projects from database
  - Select projects to feature on homepage
  - Drag-to-reorder functionality (up/down buttons)
  - Toggle visibility per project
  - Remove projects from featured list
  - Shows project thumbnails and titles
  - Prevents selecting same project twice

**Updated File**: `src/app/admin/dashboard/page.tsx`

- Replaced manual project entry with ProjectSelector component
- Updated interface from `ProjectItem[]` to `ProjectReference[]`
- Changed field name from `projects` to `featuredProjects`
- Removed old functions: `addProject`, `updateProject`, `removeProject`, `toggleProjectVisibility`
- Simplified projects tab to just render ProjectSelector
- Much cleaner and more intuitive UX

### 5. Frontend Updates ✅

**File**: `src/components/ProjectsSection.tsx`

- Updated to fetch projects from new data structure
- Changed types to work with populated project references
- Updated fallback projects to match new schema
- Projects now link to `/projects/[slug]` case study pages
- Filters visible projects and sorts by order
- Displays project thumbnail, title, tagline, and technologies
- Smooth GSAP scroll animations preserved

## Architecture Improvements

### Before
```
Homepage (dashboard) → Manual project entry
  ├─ Duplicate project data
  └─ No connection to case studies

Case Studies → Separate system
  └─ No featured projects
```

### After
```
Homepage (dashboard) → ProjectSelector
  ├─ References Project IDs
  └─ Fetches from Projects collection

Projects API (populated)
  ├─ Returns full project details
  └─ Filters by published status

Frontend → Displays referenced projects
  └─ Links to case study pages
```

## Benefits

### 1. Data Normalization
- Single source of truth for projects
- Update project once, reflects everywhere
- No sync issues between homepage and case studies

### 2. Cloud Storage (Cloudinary)
- No local filesystem dependency
- Works seamlessly on Railway/Vercel
- Automatic image optimization (WebP, AVIF, quality)
- CDN delivery for fast loading
- 25GB free storage + 25GB bandwidth/month

### 3. Better UX
- Visual project selector vs. manual entry
- See project thumbnails while selecting
- Easy reordering and visibility controls
- Clear feedback on featured projects

### 4. Scalability
- Easy to add/remove featured projects
- Projects managed centrally in case study system
- Automatic filtering by published status
- Sorting and visibility controls

## Environment Variables

Added to `.env.local.example`:
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

## Setup Required

1. **Cloudinary Account**
   - Sign up at cloudinary.com
   - Get credentials from dashboard
   - Add to `.env.local`
   - See `CLOUDINARY_SETUP.md` for detailed guide

2. **Database Migration**
   - Existing homepage data needs manual migration
   - Go to dashboard → Projects tab
   - Use ProjectSelector to select featured projects
   - Save changes

## Testing Checklist

- [ ] Projects tab in dashboard loads ProjectSelector
- [ ] Can select published projects from list
- [ ] Can reorder selected projects
- [ ] Can toggle project visibility
- [ ] Can remove projects from featured list
- [ ] Homepage displays selected projects
- [ ] Projects link to correct case study pages
- [ ] Image uploads use Cloudinary
- [ ] Images display correctly on frontend
- [ ] Fallback projects show if database empty

## Files Changed

1. `src/models/HomePage.ts` - Updated schema
2. `src/lib/cloudinary.ts` - NEW Cloudinary utils
3. `src/app/api/projects/upload-image/route.ts` - Cloudinary integration
4. `src/app/api/homepage/route.ts` - Populate references
5. `src/components/admin/ProjectSelector.tsx` - NEW selector component
6. `src/app/admin/dashboard/page.tsx` - Use ProjectSelector
7. `src/components/ProjectsSection.tsx` - Display referenced projects
8. `.env.local.example` - Added Cloudinary vars
9. `CLOUDINARY_SETUP.md` - NEW setup guide

## Next Steps

1. **Add Cloudinary credentials** to `.env.local`
2. **Test image uploads** in project editor
3. **Select featured projects** in dashboard
4. **Verify homepage** displays projects correctly
5. **Deploy to Railway** with Cloudinary env vars

## Notes

- Fallback projects still work if database is empty
- Old project data in database won't break anything (ignored)
- Cloudinary free tier is more than sufficient
- Can migrate existing local images to Cloudinary manually if needed
