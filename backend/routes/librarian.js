const express = require('express');
const router = express.Router();
const { getPendingStudents, approveStudent ,disableUserLogin , enableUserLogin ,getUsers, getAllUsers} = require('../controllers/librarianController');
const { verifyLibrarian } = require('../middleware/auth');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

router.get('/pending-students', verifyLibrarian, getPendingStudents);
router.patch('/approve-student/:id', verifyLibrarian, approveStudent);
router.get('/users', verifyLibrarian, getUsers);
router.patch('/users/enable/:userId', verifyLibrarian, enableUserLogin);
router.patch('/users/disable/:userId', verifyLibrarian,disableUserLogin);
router.get('/all-users', verifyLibrarian, getAllUsers);
// POST /api/librarians/add
router.post('/add', verifyLibrarian, async (req, res) => {
  try {
    const { firstName, lastName, email, contact, password ,collegeYear,enrollmentNo,branch} = req.body;

    if (!firstName || !lastName || !email || !contact || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const librarian = new User({
      firstName,
      lastName,
      email,
      contact,
      collegeYear,
      branch,
      enrollmentNo,
      password: hashedPassword,
      role: 'librarian'
    });

    await librarian.save();
    res.json({ message: 'New librarian added successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add librarian', error: err.message });
   
  }
});



module.exports = router;
