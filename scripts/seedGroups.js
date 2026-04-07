require('dotenv').config();
const mongoose = require('mongoose');

const User = require('../models/User');
const Group = require('../models/Group');

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const superAdmin = await User.findOne({ email: 'superadmin@example.com' });
    const admin = await User.findOne({ email: 'admin1@example.com' });
    const john = await User.findOne({ email: 'john@example.com' });
    const sarah = await User.findOne({ email: 'sarah@example.com' });

    if (!superAdmin || !admin || !john || !sarah) {
      throw new Error('Seed users first before seeding groups');
    }

    const groupName = 'Node Learners';
    const existingGroup = await Group.findOne({ name: groupName });

    if (existingGroup) {
      console.log(`Group already exists: ${groupName}`);
      return;
    }

    const group = await Group.create({
      name: groupName,
      admins: [superAdmin._id, admin._id],
      members: [superAdmin._id, admin._id, john._id, sarah._id],
      permissions: {
        canPost: [superAdmin._id, admin._id, john._id]
      }
    });

    console.log(`Created group: ${group.name}`);
    console.log('Group seeding completed');
  } catch (error) {
    console.error('Group seed failed:', error.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

run();
