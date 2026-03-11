const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

async function setupAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const usersCollection = mongoose.connection.collection('users');

        const email = 'admin@karimmassaoud.com';
        const password = 'Password123!';
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await usersCollection.findOne({ email });

        if (user) {
            await usersCollection.updateOne({ _id: user._id }, { $set: { password: hashedPassword, role: 'admin' } });
            console.log(`Updated user ${email} with new password.`);
        } else {
            await usersCollection.insertOne({
                name: 'Admin User',
                email,
                password: hashedPassword,
                role: 'admin',
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            console.log(`Created new admin user: ${email}`);
        }
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

setupAdmin();
