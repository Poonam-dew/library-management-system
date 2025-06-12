const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { verifyLibrarian  } = require('../middleware/auth');
const Category = require('../models/Category');
const Book = require('../models/Book');

// Create a new book (protected route)
router.post('/',  bookController.createBook);

// Get all books
router.get('/', bookController.getAllBooks);

// Get all categories
router.get('/categories', async (req, res) => {
  try {
    
    const categories = await Category.find({});
    
    res.json(categories);
  } catch (err) {
   
    res.status(500).json({ message: 'Server error while fetching categories' });
  }
});

// Get recently added books (e.g., latest 5)
router.get('/recent', async (req, res) => {
  try {
    const books = await Book.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('category'); // optional
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch recent books', error: err });
  }
});
// Search books by title
router.get('/search', bookController.searchBooks);

// Get books by category
router.get('/category/:category', bookController.getBooksByCategory);

// Get book by ID
router.get('/:id', bookController.getBookById);

// Update a book (protected route)
router.put('/:id', verifyLibrarian, bookController.updateBook);

// Delete a book (protected route)
router.delete('/:id', verifyLibrarian, bookController.deleteBook);












// Add new category
router.post('/categories', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Category name is required' });

    const existing = await Category.findOne({ name });
    if (existing) return res.status(400).json({ message: 'Category already exists' });

    const category = new Category({ name });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Add new book
router.post('/', async (req, res) => {
  try {
    const { title, author, category, description, image, availableCopies } = req.body;
    if (!title || !author || !category) {
      return res.status(400).json({ message: 'Title, author, and category are required' });
    }

    const book = new Book({ title, author, category, description, image, availableCopies });
    await book.save();

    res.status(201).json(book);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
