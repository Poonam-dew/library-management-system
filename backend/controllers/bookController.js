// controllers/bookController.js
const mongoose = require('mongoose');

const Book = require('../models/Book');
const Category = require('../models/Category');

// Create a new book


exports.createBook = async (req, res) => {
  try {
    const { title, author, category, description, image, availableCopies } = req.body;

    if (!title || !author || !category) {
      return res.status(400).json({ message: 'Title, author, and category are required' });
    }

    // ✅ Step 1: Validate that category is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }

    // ✅ Step 2: Find category by _id, not name
    const categoryDoc = await Category.findById(category);
    if (!categoryDoc) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // ✅ Step 3: Create book using existing category
    const book = new Book({
      title,
      author,
      description,
      image,
      availableCopies,
      category, // already a valid ObjectId
    });

    await book.save();
    res.status(201).json({message:'book created successfully',book});
  } catch (err) {
    console.error('Error creating book:', err);
    res.status(500).json({ message: 'Error creating book', error: err.message });
  }
};


// Get all books
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books', error });
  }
};

// Get books by category
exports.getBooksByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const books = await Book.find({ category });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching category books', error });
  }
};

// Get book by ID
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching book details', error });
  }
};

// Update a book
exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (error) {
    res.status(400).json({ message: 'Error updating book', error });
  }
};

// Delete a book
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting book', error });
  }
};

// Search books by title
exports.searchBooks = async (req, res) => {
  try {
    const { title } = req.query;
    const books = await Book.find({ title: { $regex: title, $options: 'i' } });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Error searching books', error });
  }
};
