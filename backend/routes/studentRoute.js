// Updated backend route: routes/student.js
const express = require('express');
const router = express.Router();
const { verifyStudent } = require('../middleware/auth');
const Book = require('../models/Book');
const IssueRequest = require('../models/IssueRequest');

router.get('/profile', verifyStudent, async (req, res) => {
  try {
    const student = req.user; // From JWT middleware

    const totalBooks = await Book.countDocuments({ availableCopies: { $gt: 0 } });

    const issuedBooks = await IssueRequest.find({
      student: student._id,
      status: 'approved',
      returnDate: null,
    }).populate('book');

    const pendingRequestsCount = await IssueRequest.countDocuments({
      student: student._id,
      status: 'pending',
    });

    const overdueBooks = issuedBooks.filter((req) =>
      req.dueDate && new Date(req.dueDate) < new Date()
    );
    console.log(req.user)

    res.json({
       name: `${student.firstName} ${student.lastName}`,
      firstName: student.firstName,
      lastName:student.lastName,
      email: student.email,
      enrollmentNo: student.enrollmentNo,
      contact: student.contact,
      collegeYear: student.collegeYear,
      branch: student.branch,
      stats: {
        totalBooks,
        issuedBooksCount: issuedBooks.length,
        pendingRequestsCount,
        overdueBooksCount: overdueBooks.length,
      },
      issuedBooks: issuedBooks.map((req) => ({
        title: req.book?.title,
        author: req.book?.author,
        dueDate: req.dueDate,
        issuedOn: req.createdAt,
      })),
      overdueBooks: overdueBooks.map((req) => ({
        title: req.book?.title,
        author: req.book?.author,
        dueDate: req.dueDate,
      })),
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch student profile', error: err.message });
    console.log(err);
  }
});

module.exports = router;
