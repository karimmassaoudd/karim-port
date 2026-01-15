const mongoose = require('mongoose');

// MongoDB connection URI
const MONGODB_URI = 'mongodb://mongo:VzMnZHQXujpdhUNmdKtjqShDIHleQzHG@mainline.proxy.rlwy.net:13061';

// User schema
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  createdAt: Date,
  updatedAt: Date,
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function updateUserName() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully!');

    // Find the user and update the name
    const result = await User.updateMany(
      {}, // Update all users (or you can filter by email if needed)
      { $set: { name: 'Karim Massaoud' } }
    );

    console.log('Update result:', result);
    console.log(`Updated ${result.modifiedCount} user(s)`);

    // Display updated users
    const users = await User.find({});
    console.log('\nCurrent users:');
    users.forEach(user => {
      console.log(`- Name: ${user.name}, Email: ${user.email}`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

updateUserName();
