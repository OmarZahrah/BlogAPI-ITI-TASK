require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');

const users = [
  { username: 'superadmin', email: 'superadmin@example.com', password: '123456', role: 'super-admin' },
  { username: 'admin1', email: 'admin1@example.com', password: '123456', role: 'admin' },
  { username: 'john', email: 'john@example.com', password: '123456', role: 'user' },
  { username: 'sarah', email: 'sarah@example.com', password: '123456', role: 'user' }
];

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    for (const user of users) {
      const exists = await User.findOne({ email: user.email });
      if (exists) {
        console.log(`User already exists: ${user.email}`);
        continue;
      }

      const hashedPassword = await bcrypt.hash(user.password, 10);
      await User.create({ ...user, password: hashedPassword });
      console.log(`Created user: ${user.email}`);
    }

    console.log('User seeding completed');
  } catch (error) {
    console.error('User seed failed:', error.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

run();
