const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); 

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', authRoutes);

const createDefaultLibrarian = async () => {
  try {
    const existing = await User.findOne({ email: 'librarian@library.com' });
    if (existing) return;

    const hashedPassword = await bcrypt.hash('your-password', 10);

    const librarian = new User({
      firstName: 'Test',
      lastName: 'Librarian',
      email: 'librarian@library.com',
      password: hashedPassword,
      role: 'librarian',
      contact: '1234567890',
      address: 'Library HQ',
      branch: 'NA',
      year: 'NA'
    });

    await librarian.save();
    console.log('📘 Default librarian created');
  } catch (err) {
    console.error('Error creating default librarian:', err.message);
  }
};

const createDefaultStudent = async () => {
  const existing = await User.findOne({ email: 'student@library.com' });
  if (!existing) {
    const hashedPassword = await bcrypt.hash('student123', 10);
    await User.create({
      firstName: 'Demo',
      lastName: 'Student',
      email: 'student@library.com',
      password: hashedPassword,
      role: 'student',
      isApproved: true,
      contact: '1234567890',
      address: 'Demo Lane',
      collegeYear: '2nd',
      branch: 'CSE'
    });
    console.log('✅ Default student created');
  }
};


mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
     createDefaultLibrarian(); 
     createDefaultStudent();
    app.listen(process.env.PORT, () => {
      console.log(`Server running on http://localhost:${process.env.PORT}`);
    });
  })
  .catch(err => console.log(err));
