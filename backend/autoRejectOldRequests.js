// autoRejectOldRequests.js
const mongoose = require('mongoose');
const IssueRequest = require('./models/IssueRequest');
const Book = require('./models/Book');

const autoRejectOldRequests = async () => {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000); // 1 day ago

  const oldRequests = await IssueRequest.find({
    status: 'pending',
    createdAt: { $lt: oneDayAgo }
  });

  for (const req of oldRequests) {
    // Update book count back
    await Book.findByIdAndUpdate(req.book, { $inc: { availableCopies: 1 } });
    
    // Reject the issue
    req.status = 'rejected';
    req.message = 'Request auto-rejected due to no visit within 1 day.';
    await req.save();
  }

  console.log(`Auto-checked ${oldRequests.length} old requests.`);
};

module.exports = autoRejectOldRequests;
