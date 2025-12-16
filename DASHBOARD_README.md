# Dashboard Setup Guide

## Authentication System

Your portfolio now has a complete authentication system with the following features:

### Features

- ✅ Sign up / Sign in
- ✅ Password change for logged-in users
- ✅ Forgot password with email reset link
- ✅ Route protection (admin routes require authentication)
- ✅ GSAP animations on all auth pages
- ✅ Session management with NextAuth.js

### Pages Created

- `/auth/signin` - Login page
- `/auth/signup` - Registration page
- `/auth/forgot-password` - Request password reset
- `/auth/reset-password` - Reset password with token
- `/admin/dashboard` - Homepage content management
- `/admin/settings` - Change password
- `/admin/messages` - View contact form messages

## Environment Setup

1. **Copy the example environment file:**

   ```bash
   cp .env.local.example .env.local
   ```

2. **Configure the following variables in `.env.local`:**

   ### MongoDB (Already configured)

   ```
   MONGODB_URI=mongodb://mongo:VzMnZHQXujpdhUNmdKtjqShDIHleQzHG@mongodb.railway.internal:27017
   ```

   ### NextAuth

   ```
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-generated-secret-here
   ```

   Generate a secret key:

   ```bash
   openssl rand -base64 32
   ```

   Or use an online generator: https://generate-secret.vercel.app/32

**Note:** Gmail configuration is now done through the dashboard Settings page instead of environment variables.

## Creating Your First Admin User

1. Start the development server:

   ```bash
   npm run dev
   ```

2. Navigate to: http://localhost:3000/auth/signup

3. Create your admin account:

   - Enter your name
   - Enter your email
   - Create a strong password (minimum 6 characters)
   - Confirm password
   - Click "Sign Up"

4. You'll be automatically redirected to the signin page

5. Sign in with your credentials to access the dashboard

## Using the Dashboard

### Homepage Dashboard

Navigate to `/admin/dashboard` to edit:

- **Hero Section**: Main title, subtitle, and call-to-action buttons
- **Bio Section**: Your bio text and word limit
- **About Section**: Contact information and profile card details
- **Experience Section**: Add, edit, and remove experience items

The dashboard features:

- Tab-based navigation with smooth GSAP transitions
- Real-time form updates
- Save all changes with one button
- Dark mode support

### Settings Page

Navigate to `/admin/settings` to:

- View your account information
- Change your password
- Toggle password visibility
- **Configure Gmail for password reset emails**
  - Enter your Gmail address
  - Enter your Gmail App Password
  - Follow the instructions to get an App Password from Google

**How to get Gmail App Password:**

1. Go to your Google Account: https://myaccount.google.com/
2. Navigate to Security → 2-Step Verification (enable if not enabled)
3. Scroll to "App passwords": https://myaccount.google.com/apppasswords
4. Select "Mail" and your device
5. Copy the generated 16-character password
6. Save it in the dashboard settings

### Password Reset Flow

If you forget your password:

1. Go to `/auth/forgot-password`
2. Enter your email address
3. Check your inbox for reset link
4. Click the link (valid for 1 hour)
5. Enter your new password
6. You'll be redirected to signin

## Security Features

- Passwords are hashed using bcrypt (12 salt rounds)
- JWT-based sessions with 30-day expiration
- Password reset tokens expire after 1 hour
- Routes are protected by middleware
- Session validation on all API calls

## Animations

All pages use GSAP for smooth animations:

- Entrance animations (fade in, slide in)
- Form field stagger animations
- Error shake animations
- Go to `/admin/settings` and configure your Gmail credentials
- Make sure you're using an App Password, not your regular Gmail password
- Check spam folder
- Verify the email address is correctimations

## Troubleshooting

### Can't sign in

- Make sure your environment variables are set correctly
- Check that MongoDB is running and accessible
- Verify your credentials are correct

### Password reset email not sending

- Verify `GMAIL_USER` and `GMAIL_APP_PASSWORD` are correct
- Make sure you're using an App Password, not your regular Gmail password
- Check spam folder

### MongoDB connection errors

- Ensure `MONGODB_URI` matches your Railway MongoDB instance
- Check that MongoDB is running on Railway
- Verify network connectivity

## Development Tips

- Use `/admin/dashboard` as the default landing page after signin
- The sidebar in admin layout is collapsible
- All forms have loading states
- Messages auto-dismiss after successful actions
- Dark mode is fully supported

## API Endpoints

- `POST /api/auth/signup` - Create new user
- `POST /api/auth/signin` - Sign in (handled by NextAuth)
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token
- `POST /api/auth/change-password` - Change password (authenticated)
- `GET /api/homepage` - Fetch homepage data
- `PUT /api/homepage` - Update homepage data

## Next Steps

required variables (MongoDB and NextAuth) 2. Create your first admin user via signup 3. **Configure Gmail settings in the dashboard** (`/admin/settings`) 4. Start editing your homepage content 5. Test the password reset flow with your email 5. Customize the admin dashboard layout if needed

Enjoy your new dashboard! 🎉
