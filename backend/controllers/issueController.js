// controllers/issueController.js
const IssueRequest = require('../models/IssueRequest');

exports.getAllRequests = async (req, res) => {
  try {
    const requests = await IssueRequest.find()
      .populate('book', 'title author')
      .populate('student', 'firstName lastName email');
    res.json(requests);
    
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch issue requests', error: err });
  }
};
exports.rejectIssue = async (req, res) => {
  try {
    const issue = await IssueRequest.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    issue.status = 'rejected';
    await issue.save();

    res.json({ message: 'Book issue rejected successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to reject issue', error: error.message });
    console.log(error)
  }
};
// PATCH /api/issues/:id/return - Librarian marks book as returned
exports.markReturned = async (req, res) => {
  try {
    const issue = await IssueRequest.findById(req.params.id).populate('book');
    if (!issue) return res.status(404).json({ message: 'Issue not found' });

    if (issue.status !== 'approved') {
      return res.status(400).json({ message: 'Only approved issues can be returned' });
    }

    issue.returnDate = new Date();
    await issue.save();

    // Increase availableCopies
    issue.book.availableCopies += 1;
    await issue.book.save();

    res.json({ message: 'Book marked as returned', issue });
  } catch (err) {
    res.status(500).json({ message: 'Failed to mark as returned', error: err.message });
    
  }
};

