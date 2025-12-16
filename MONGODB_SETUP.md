# Environment Variables Setup

## MongoDB Connection

To use the dashboard and database functionality, you need to set up a MongoDB connection.

### Steps:

1. Create a `.env.local` file in the root of your project (if it doesn't exist)

2. Add the following environment variable:

```env
MONGODB_URI=your_mongodb_connection_string_here
```

### Getting a MongoDB Connection String:

#### Option 1: MongoDB Atlas (Free Cloud Database)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new cluster (choose the free tier)
4. Click "Connect" on your cluster
5. Choose "Connect your application"
6. Copy the connection string (it will look like: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`)
7. Replace `<password>` with your actual password
8. Replace `database` with your preferred database name (e.g., `karim-portfolio`)

#### Option 2: Local MongoDB

If you have MongoDB installed locally:

```env
MONGODB_URI=mongodb://localhost:27017/karim-portfolio
```

### Example .env.local file:

```env
MONGODB_URI=mongodb+srv://karimmassaoud:mypassword@cluster0.xxxxx.mongodb.net/karim-portfolio?retryWrites=true&w=majority
```

### Important Notes:

- Never commit `.env.local` to version control (it's already in `.gitignore`)
- The database will be automatically initialized with default content on first access
- Restart your development server after adding the environment variable

### Testing the Connection:

1. Start your development server: `npm run dev`
2. Visit `http://localhost:3000/api/homepage` - you should see JSON data
3. Visit `http://localhost:3000/admin/dashboard` - you should see the dashboard
