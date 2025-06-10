const express = require('express');
const router = express.Router();
// const Issue = require('../models/Issue');
const IssueRequest=require('../models/IssueRequest')
const Book = require('../models/Book');
const { verifyStudent ,verifyLibrarian} = require('../middleware/auth');  // Middleware to verify student role
const issueController = require('../controllers/issueController');
// GET /api/issues/my - get issues for logged-in student
// GET /api/issues/my
router.post('/request', verifyStudent, async (req, res) => {
  const { bookId } = req.body;

  if (!bookId) {
    return res.status(400).json({ message: 'Book ID is required' });
  }

  try {
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.availableCopies < 1) return res.status(400).json({ message: 'No available copies' });

    // Check if already requested or issued
    const existingRequest = await IssueRequest.findOne({
      book: bookId,
      student: req.user._id,
      status: { $in: ['pending', 'approved'] },
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'You have already requested or issued this book' });
    }

    // Create issue request
    const issue = new IssueRequest({
      book: bookId,
      student: req.user._id,
      status: 'pending',
      message: 'Please visit the library within 1 day. Otherwise, the request will be auto-cancelled.',
    });

    await issue.save();

    // Decrease available copies by 1
    book.availableCopies -= 1;
    await book.save();

    res.json({ message: 'Book issue requested successfully', issue });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to request issue', error: err.message });
  }
});

router.get('/my',verifyStudent, async (req, res) => {
  try {
    const requests = await IssueRequest.find({ student: req.user._id })
      .populate('book', 'title author')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch requests' });
    console.log(err)
  }
});
// PATCH /api/issues/:id/approve
router.patch('/:id/approve', verifyLibrarian, async (req, res) => {
  const { dueDate } = req.body;

  try {
    const issue = await IssueRequest.findById(req.params.id).populate('book');
    if (!issue) return res.status(404).json({ message: 'Issue request not found' });

    if (issue.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending requests can be approved' });
    }

    issue.status = 'approved';
    issue.issueDate = new Date();
    issue.dueDate = dueDate ? new Date(dueDate) : null;

    await issue.save();

    // Decrease availableCopies
    issue.book.availableCopies -= 1;
    await issue.book.save();

    res.json({ message: 'Book request approved successfully', issue });
  } catch (error) {
    console.error('Approve request error:', error);
    res.status(500).json({ message: 'Failed to approve request', error });
  }
});


router.get('/all', issueController.getAllRequests);
router.put('/reject/:id', verifyLibrarian, issueController.rejectIssue);

// POST /api/issues/request - request to issue a book
// POST /api/issues/request - request to issue a book


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
