const User = require('../models/User');

exports.getPendingStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student', isApproved: false });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching students' });
  }
};

exports.approveStudent = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { isApproved: true });
    res.json({ message: 'Student approved' });
  } catch (err) {
    res.status(500).json({ message: 'Approval failed' });
  }
};
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'student' }); // or all roles except librarian maybe
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.enableUserLogin = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.userId, { isActive: true }, { new: true });
    res.json({ message: 'User login enabled', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.disableUserLogin = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.userId, { isActive: false }, { new: true });
    res.json({ message: 'User login disabled', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // exclude passwords
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};