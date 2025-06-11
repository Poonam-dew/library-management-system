const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
require('dotenv').config();

exports.registerUser = async (req, res) => {
  try {
    const {
      firstName, lastName, email, contact,enrollmentNo, address,
      password, collegeYear, branch, role
    } = req.body;

    console.log("Received data:", req.body); // 👈 Add this

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists...Go to Login' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      contact,
      enrollmentNo,
      address,
      password: hashedPassword,
      collegeYear,
      branch,
      role: role || 'student',
    });

    await user.save();
    res.status(201).json({ message: 'Registration successful... Await librarian approval.' });
  } catch (err) {
    console.error("Registration error:", err); // 👈 Add this
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

      if (user.role === 'student' && !user.isApproved) {
      return res.status(403).json({ message: 'Account not yet approved by librarian.' });
    }

     if (!user.isActive) {
      return res.status(403).json({ message: 'Your account is disabled. Please contact librarian.' });
    }
    
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.status(200).json({token,
      message: "Login successful",
      user: {
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role,
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

