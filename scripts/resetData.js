require('dotenv').config();
const mongoose = require('mongoose');

const User = require('../models/User');
const Group = require('../models/Group');
const Post = require('../models/Post');

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await Post.deleteMany({});
    await Group.deleteMany({});
    await User.deleteMany({});

    console.log('All collections cleared: users, groups, posts');
  } catch (error) {
    console.error('Reset failed:', error.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

run();
