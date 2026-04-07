const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({ status: 'success', results: users.length, data: users });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }
    res.status(200).json({ status: 'success', data: user });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.role !== 'super-admin' && req.user._id.toString() !== id) {
      return res.status(403).json({ status: 'error', message: 'Not allowed to update this user' });
    }

    const updateData = { ...req.body };
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const user = await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).select('-password');
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }
    res.status(200).json({ status: 'success', data: user });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.role !== 'super-admin' && req.user._id.toString() !== id) {
      return res.status(403).json({ status: 'error', message: 'Not allowed to delete this user' });
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }
    res.status(200).json({ status: 'success', message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
