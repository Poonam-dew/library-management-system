const express = require('express');
const router = express.Router();
const Issue = require('../models/Issue');
const IssueRequest=require('../models/IssueRequest')
const Book = require('../models/Book');
const { verifyStudent } = require('../middleware/auth');  // Middleware to verify student role

// GET /api/issues/my - get issues for logged-in student
router.get('/my', verifyStudent, async (req, res) => {
  try {
    const issues = await Issue.find({ student: req.user._id }).populate('book');
    res.json(issues);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get issues', error: err.message });
  }
});

// POST /api/issues/request - request to issue a book
router.post('/request', verifyStudent, async (req, res) => {
  const { bookId } = req.body;

  if (!bookId) {
    return res.status(400).json({ message: 'Book ID is required' });
  }

  try {
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.availableCopies < 1) return res.status(400).json({ message: 'No available copies' });

    // Check if student already requested or issued this book and not returned
    const existingRequest = await Issue.findOne({
      book: bookId,
      student: req.user._id,
      status: { $in: ['pending', 'approved'] }
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'You have already requested or issued this book' });
    }

    const issue = new Issue({
      book: bookId,
      student: req.user._id,
    });

    await issue.save();

    res.json({ message: 'Book issue requested successfully', issue });
  } catch (err) {
    res.status(500).json({ message: 'Failed to request issue', error: err.message });
  }
});

// models/IssueRequest.js
// Fields: student (ref), book (ref), status ('pending', 'approved', 'rejected'), issueDate, dueDate, returnDate

// In student routes file or controller
router.get('/stats', verifyStudent, async (req, res) => {
  try {
    const studentId = req.user._id;

    const totalBooks = await Book.countDocuments({ availableCopies: { $gt: 0 } });

    const issuedBooksCount = await IssueRequest.countDocuments({
      student: studentId,
      status: 'approved',
      returnDate: null,
    });

    const pendingRequestsCount = await IssueRequest.countDocuments({
      student: studentId,
      status: 'pending',
    });

    const overdueBooksCount = await IssueRequest.countDocuments({
      student: studentId,
      status: 'approved',
      returnDate: null,
      dueDate: { $lt: new Date() },
    });

    res.json({
      totalBooks,
      issuedBooksCount,
      pendingRequestsCount,
      overdueBooksCount,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch stats', error: err.message });
    console.log(err.message)
  }
});


module.exports = router;
