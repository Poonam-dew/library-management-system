// controllers/issueController.js
const IssueRequest = require('../models/IssueRequest');

exports.getAllRequests = async (req, res) => {
  try {
    const requests = await IssueRequest.find()
      .populate('book', 'title author')
      .populate('student', 'name email');
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
