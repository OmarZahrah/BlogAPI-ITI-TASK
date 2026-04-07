const mongoose = require('mongoose');
const Group = require('../models/Group');
const User = require('../models/User');

const isAdminOrSuperAdmin = (group, user) => {
  if (user.role === 'super-admin') return true;
  return group.admins.some((adminId) => adminId.toString() === user._id.toString());
};

exports.createGroup = async (req, res) => {
  try {
    const group = await Group.create({
      name: req.body.name,
      admins: [req.user._id],
      members: [req.user._id],
      permissions: { canPost: [req.user._id] }
    });
    res.status(201).json({ status: 'success', data: group });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.getGroups = async (req, res) => {
  try {
    const groups = await Group.find().populate('admins members permissions.canPost', 'username email role');
    res.status(200).json({ status: 'success', results: groups.length, data: groups });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.getGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id).populate('admins members permissions.canPost', 'username email role');
    if (!group) {
      return res.status(404).json({ status: 'error', message: 'Group not found' });
    }
    res.status(200).json({ status: 'success', data: group });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.addMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ status: 'error', message: 'Invalid user id' });
    }

    const group = await Group.findById(id);
    if (!group) return res.status(404).json({ status: 'error', message: 'Group not found' });
    if (!isAdminOrSuperAdmin(group, req.user)) return res.status(403).json({ status: 'error', message: 'Not allowed' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });

    if (!group.members.some((memberId) => memberId.toString() === userId)) {
      group.members.push(userId);
    }
    await group.save();
    res.status(200).json({ status: 'success', message: 'Member added', data: group });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.removeMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const group = await Group.findById(id);
    if (!group) return res.status(404).json({ status: 'error', message: 'Group not found' });
    if (!isAdminOrSuperAdmin(group, req.user)) return res.status(403).json({ status: 'error', message: 'Not allowed' });

    group.members = group.members.filter((memberId) => memberId.toString() !== userId);
    group.permissions.canPost = group.permissions.canPost.filter((allowedId) => allowedId.toString() !== userId);
    group.admins = group.admins.filter((adminId) => adminId.toString() !== userId);

    await group.save();
    res.status(200).json({ status: 'success', message: 'Member removed', data: group });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.grantPermission = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const group = await Group.findById(id);
    if (!group) return res.status(404).json({ status: 'error', message: 'Group not found' });
    if (!isAdminOrSuperAdmin(group, req.user)) return res.status(403).json({ status: 'error', message: 'Not allowed' });

    const isMember = group.members.some((memberId) => memberId.toString() === userId);
    if (!isMember) {
      return res.status(400).json({ status: 'error', message: 'User must be a member first' });
    }

    if (!group.permissions.canPost.some((allowedId) => allowedId.toString() === userId)) {
      group.permissions.canPost.push(userId);
    }
    await group.save();
    res.status(200).json({ status: 'success', message: 'Permission granted', data: group });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.revokePermission = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const group = await Group.findById(id);
    if (!group) return res.status(404).json({ status: 'error', message: 'Group not found' });
    if (!isAdminOrSuperAdmin(group, req.user)) return res.status(403).json({ status: 'error', message: 'Not allowed' });

    group.permissions.canPost = group.permissions.canPost.filter((allowedId) => allowedId.toString() !== userId);
    await group.save();
    res.status(200).json({ status: 'success', message: 'Permission revoked', data: group });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
