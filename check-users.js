const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

async function checkUsers() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const usersCollection = mongoose.connection.collection('users');
        const users = await usersCollection.find({}, { projection: { email: 1, name: 1, role: 1 } }).toArray();
        console.log(JSON.stringify(users, null, 2));
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

checkUsers();
