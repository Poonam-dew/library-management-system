// models/Issue.js
const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'returned'],
    default: 'pending',
  },
  requestedAt: { type: Date, default: Date.now },
  returnedAt: { type: Date }
});

module.exports = mongoose.model('Issue', issueSchema);
