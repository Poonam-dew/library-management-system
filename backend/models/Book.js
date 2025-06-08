// models/Book.js
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type:String, ref: 'Author', required: true },
  category: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Category',
  required: true
}
,
  description: String,
  image: String, // optional image URL or path
  availableCopies: { type: Number, default: 1 },
},{ timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
