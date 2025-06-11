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
      message: 'You have Issued book successfully.Please come to library and take it.And Return before due date.',
    });

    await issue.save();

    // Decrease available copies by 1
    
    await book.save();

    res.json({ message: 'Book issue requested successfully', issue });
  } catch (err) {
    // console.error(err);
    res.status(500).json({ message: 'Failed to request issue', error: err.message });
  }
});
router.get('/all', verifyLibrarian, issueController.getAllRequests);
router.get('/my',verifyStudent, async (req, res) => {
  try {
    const requests = await IssueRequest.find({ student: req.user._id })
      .populate('book', 'title author')
      .sort({ createdAt: -1 });
    res.json(requests);
    // console.log(requests)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch requests' });
    // console.log(err)
  }
});
router.get('/my/req',verifyStudent, async (req, res) => {
  try {
    const requests = await IssueRequest.find({ student: req.user._id })
      .populate('book', 'title author')
      .sort({ createdAt: -1 });
      if(requests.status==="approved"){
         res.json(requests);
      }else{
            res.json({message:"No book issued yet"});
      }
   
    
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch requests' });
    // console.log(err)
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

router.patch('/:id/return', verifyLibrarian, issueController.markReturned);


router.put('/reject/:id', verifyLibrarian, issueController.rejectIssue);

// POST /api/issues/request - request to issue a book
// POST /api/issues/request - request to issue a book


// models/IssueRequest.js
// Fields: student (ref), book (ref), status ('pending', 'approved', 'rejected'), issueDate, dueDate, returnDate

// In student routes file or controller
router.get('/stats', verifyStudent, async (req, res) => {
  try {
    const studentId = req.user._id;

    // Count: Total available books in library
    const totalBooks = await Book.countDocuments({ availableCopies: { $gt: 0 } });

    // Count: Books approved and still with student
    const issuedBooksCount = await IssueRequest.countDocuments({
      student: studentId,
      status: 'approved',
      returnDate: null,
    });

    // Count: Pending issue requests
    const pendingRequestsCount = await IssueRequest.countDocuments({
      student: studentId,
      status: 'pending',
    });

    // Fetch: Overdue books
    const overdueBooks = await IssueRequest.find({
      student: studentId,
      status: 'approved',
      returnDate: null,
      dueDate: { $lt: new Date() },
    }).populate('book'); // So we get title, author, etc.

    const overdueBooksCount = overdueBooks.length;

    // Send response
    res.json({
      totalBooks,
      issuedBooksCount,
      pendingRequestsCount,
      overdueBooksCount,
      overdueBooks: overdueBooks.map(req => ({
        bookTitle: req.book?.title,
        author: req.book?.author,
        dueDate: req.dueDate,
        issueDate: req.issueDate,
        _id: req._id,
      })),
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Failed to fetch stats', error: err.message });
  }
});



module.exports = router;
