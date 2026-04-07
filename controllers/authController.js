const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, {
  expiresIn: process.env.JWT_EXPIRES_IN || '7d'
});

const setAuthCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
};

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ status: 'error', message: 'Email or username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword });
    const token = signToken(user._id);
    setAuthCookie(res, token);

    res.status(201).json({
      status: 'success',
      token,
      data: { user: { id: user._id, username: user.username, email: user.email, role: user.role } }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
    }

    const token = signToken(user._id);
    setAuthCookie(res, token);
    res.status(200).json({
      status: 'success',
      token,
      data: { user: { id: user._id, username: user.username, email: user.email, role: user.role } }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
