require('dotenv').config();
const mongoose = require('mongoose');

const User = require('../models/User');
const Group = require('../models/Group');
const Post = require('../models/Post');

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const superAdmin = await User.findOne({ email: 'superadmin@example.com' });
    const john = await User.findOne({ email: 'john@example.com' });
    const sarah = await User.findOne({ email: 'sarah@example.com' });
    const group = await Group.findOne({ name: 'Node Learners' });

    if (!superAdmin || !john || !sarah) {
      throw new Error('Seed users first before seeding posts');
    }

    const postsData = [
      {
        title: 'Welcome to the Blog',
        content: 'This is a global post visible to everyone.',
        images: ['https://placehold.co/600x400?text=Global+Post+1'],
        author: superAdmin._id,
        group: null
      },
      {
        title: 'Group Update',
        content: 'This post is for Node Learners group members.',
        images: ['https://placehold.co/600x400?text=Group+Post+1'],
        author: john._id,
        group: group ? group._id : null
      },
      {
        title: 'Another Global Post',
        content: 'Simple seeded data for testing.',
        images: ['https://placehold.co/600x400?text=Global+Post+2'],
        author: sarah._id,
        group: null
      }
    ];

    for (const item of postsData) {
      const exists = await Post.findOne({ title: item.title });
      if (exists) {
        console.log(`Post already exists: ${item.title}`);
        continue;
      }

      await Post.create(item);
      console.log(`Created post: ${item.title}`);
    }

    console.log('Post seeding completed');
  } catch (error) {
    console.error('Post seed failed:', error.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

run();
