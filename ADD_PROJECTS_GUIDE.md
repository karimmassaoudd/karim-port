# Adding All Projects to Your Portfolio

This guide will help you add all the projects from your design to your database.

## Method 1: Automated Seeding (Recommended)

### Step 1: Add Project Images

First, add these images to `public/assets/`:

- `Portfolio Website Youssef.png` - Youssef Ragaee portfolio screenshot
- `Karim Portfolio .png` - Your portfolio screenshot  
- `TAW Travel.png` - TAW Travel platform screenshot
- `AYMAN Portfolio.png` - AYMAN portfolio screenshot
- `Wonder Pearl.png` - Wonder Pearl website screenshot

**Note:** Triple Wave and other existing projects already have their images.

### Step 2: Run the Seed Script

```bash
# Make sure you're in the project root directory
cd "c:\Users\karim\Documents\Second Year Fontys\Karimmassaoud_Portfolio\karim-port"

# Run the seed script
node seed-projects.js
```

This will automatically add all 5 new projects to your database.

### What the Seed Script Does:

✅ Creates projects with proper categories:
  - Personal Portfolio Website (3 projects)
  - Full Stack Web Application (1 project)
  - Web Application / Landing Page (1 project)

✅ Sets up thumbnail images for each project

✅ Adds technology tags (React, Node.js, MongoDB, etc.)

✅ Configures hero and overview sections

✅ Sets all projects to "published" status

✅ Checks for duplicates and updates existing projects

---

## Method 2: Manual Creation via Admin Dashboard

If you prefer to add projects manually:

### Step 1: Access Admin

1. Go to `http://localhost:3000/admin/projects`
2. Click "New Project" button

### Step 2: Fill Basic Info

For each project, enter:

**Project 1: Youssef Ragaee Portfolio**
- Title: `Youssef Ragaee Portfolio`
- Slug: `youssef-ragaee-portfolio`
- Short Description: `A fully functional portfolio website for Waer Ayman, featuring powerful GSAP animations, modern UI/UX design, and a complete admin dashboard for content management.`
- Technologies: `React, Tailwind CSS, GSAP, MongoDB, +4`
- Status: Published
- Category: `Personal Portfolio Website`

**Project 2: Karim Massaoud Portfolio**
- Title: `Karim Massaoud Portfolio`
- Slug: `karim-massaoud-portfolio`
- Short Description: `Modern personal portfolio built with Next.js to showcase academic and professional work.`
- Technologies: `React, Next.js, TypeScript, GSAP`
- Status: Published
- Category: `Personal Portfolio Website`

**Project 3: TAW Travel**
- Title: `TAW Travel - Tour & Travel Booking Platform`
- Slug: `taw-travel-platform`
- Short Description: `A full-featured travel booking platform that allows users to explore tours, view destinations, and book trips.`
- Technologies: `React, Node.js, Express.js, MongoDB, +4`
- Status: Published
- Category: `Full Stack Web Application`

**Project 4: AYMAN Portfolio**
- Title: `AYMAN Portfolio`
- Slug: `ayman-portfolio`
- Short Description: `A personal portfolio website showcasing skills as a web developer and designer.`
- Technologies: `HTML, CSS, JavaScript, Netlify`
- Status: Published
- Category: `Personal Portfolio Website`

**Project 5: Wonder Pearl**
- Title: `Wonder Pearl`
- Slug: `wonder-pearl`
- Short Description: `A web project designed to showcase unique features and design elements.`
- Technologies: `HTML, CSS, JavaScript, GSAP Animation, +1`
- Status: Published
- Category: `Web Application / Landing Page`

---

## After Adding Projects

### View Your Projects

1. **Projects List Page:** `http://localhost:3000/projects`
   - All projects will appear with search and category filters
   - Projects are automatically grouped by category

2. **Individual Project Pages:** `http://localhost:3000/projects/[slug]`
   - Example: `http://localhost:3000/projects/youssef-ragaee-portfolio`

### Feature Projects on Homepage

1. Go to `http://localhost:3000/admin/dashboard`
2. Click the "Projects" tab
3. Click "Add Project" and select which projects to feature
4. Drag to reorder them
5. Click "Save Changes"

---

## Troubleshooting

### "Project already exists" error
The seed script automatically updates existing projects. This is safe.

### Missing images
Make sure all image files are in `public/assets/` with exact filenames.

### Categories not showing
Make sure each project's `sections.hero.category` field is set correctly.

### Projects not appearing on /projects page
Check that `status` is set to `"published"` for each project.

---

## Project Categories in Your System

Your projects page automatically creates filter buttons for these categories:

- **All** - Shows all projects
- **Personal Portfolio Website** - Youssef, Karim, AYMAN portfolios
- **Full Stack Web Application** - TAW Travel
- **International Student Guide Website** - Triple Wave
- **Web Application / Landing Page** - Wonder Pearl

The categories are extracted automatically from the `sections.hero.category` field of each project.
