const express = require('express');
const router = express.Router();
const { getPendingStudents, approveStudent ,disableUserLogin , enableUserLogin ,getUsers, getAllUsers} = require('../controllers/librarianController');
const { verifyLibrarian } = require('../middleware/auth');

router.get('/pending-students', verifyLibrarian, getPendingStudents);
router.patch('/approve-student/:id', verifyLibrarian, approveStudent);
router.get('/users', verifyLibrarian, getUsers);
router.patch('/users/enable/:userId', verifyLibrarian, enableUserLogin);
router.patch('/users/disable/:userId', verifyLibrarian,disableUserLogin);
router.get('/all-users', verifyLibrarian, getAllUsers);

module.exports = router;
