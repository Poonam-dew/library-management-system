import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/BookManagementPage.css';
import bookcover from '../assets/no_cover_available.png';
import { useNavigate } from 'react-router-dom';

export default function BookManagementPage() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [books, setBooks] = useState([]);
  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);
  const [showAddBookForm, setShowAddBookForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const [bookSuccess, setBookSuccess] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryError, setCategoryError] = useState(null);
  const [bookFormData, setBookFormData] = useState({
    title: '',
    author: '',
    description: '',
    image: '',
    availableCopies: 0,
  });
  const [bookError, setBookError] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState('');
  const [deleteError, setDeleteError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    if (bookSuccess) {
      const timer = setTimeout(() => {
        setBookSuccess(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [bookSuccess]);

  useEffect(() => {
    fetchCategories();
    fetchAllBooks();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/api/books/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Failed to fetch categories', err);
    }
  };

  const fetchBooksForCategory = async (category) => {
    setSelectedCategory(category);
    setSelectedCategoryId(category._id);
    setShowAddBookForm(false);
    try {
      const res = await axios.get(`/api/books/category/${category._id}`);
      setBooks(res.data);
    } catch (err) {
      console.error('Failed to fetch books', err);
      setBooks([]);
    }
  };

  const fetchAllBooks = async () => {
    try {
      const res = await axios.get('/api/books');
      setAllBooks(res.data);
    } catch (err) {
      console.error('Failed to fetch all books', err);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      setCategoryError('Category name is required');
      return;
    }
    try {
      await axios.post('/api/books/categories', { name: categoryName.trim() });
      setCategoryName('');
      setCategoryError(null);
      setShowAddCategoryForm(false);
      fetchCategories();
    } catch (err) {
      setCategoryError(err.response?.data?.message || 'Failed to add category');
    }
  };

  const handleBookInputChange = (e) => {
    const { name, value } = e.target;
    setBookFormData((prev) => ({
      ...prev,
      [name]: name === 'availableCopies' ? Number(value) : value,
    }));
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    if (!bookFormData.title.trim() || !bookFormData.author.trim()) {
      setBookError('Title and author are required');
      setBookSuccess(null);
      return;
    }
    if (!selectedCategoryId) {
      setBookError('Please select a category first');
      setBookSuccess(null);
      return;
    }
    try {
      if (editingBook) {
        await axios.put(
          `/api/books/${editingBook._id}`,
          { ...bookFormData, category: selectedCategoryId },
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        setBookSuccess('Book updated successfully');
      } else {
        await axios.post(
          '/api/books',
          { ...bookFormData, category: selectedCategoryId },
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        setBookSuccess('Book added successfully');
      }
      setBookError(null);
      setBookFormData({
        title: '',
        author: '',
        description: '',
        image: '',
        availableCopies: 0,
      });
      setShowAddBookForm(false);
      setEditingBook(null);
      fetchBooksForCategory(selectedCategory);
    } catch (err) {
      setBookError(err.response?.data?.message || 'Failed to save book');
      setBookSuccess(null);
    }
  };

  const handleSearch = () => {
    const filtered = allBooks.filter((book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(filtered);
  };

  const handleEditClick = (book) => {
    setEditingBook(book);
    setBookFormData({
      title: book.title,
      author: book.author,
      description: book.description || '',
      image: book.image || '',
      availableCopies: book.availableCopies,
    });
    setShowAddBookForm(true);
  };

  const handleDeleteBook = async (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await axios.delete(`/api/books/${bookId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setDeleteSuccess('Book deleted successfully!');
        setDeleteError('');
        fetchBooksForCategory(selectedCategory);
        setTimeout(() => setDeleteSuccess(''), 3000);
      } catch (err) {
        setDeleteError('Failed to delete book');
        setDeleteSuccess('');
        console.error('Failed to delete book', err);
      }
    }
  };

  return (
    <div className='lms-book-mngmt'>
      <div className="lms-book-management-container">
        <div className="lms-book-management-nav">
          <button className="lms-back-btn" onClick={() => navigate(-1)}>&#8592; Back</button>
        </div>

        <h1 className="lms-main-heading">Library Book Management</h1>

        <div className="lms-section-wrapper">
          {/* Search Section */}
          <div className="lms-search-wrapper">
            <div className="lms-search-section">
              <input
                type="text"
                placeholder="Search books by title..."
                className="lms-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="lms-search-button" onClick={handleSearch}>🔍 Search</button>
            </div>

            {searchResults.length === 0 && searchQuery === '' ? (
              <p className="lms-no-data">Enter a book title and click search.</p>
            ) : searchResults.length === 0 ? (
              <p className="lms-no-data">No books found.</p>
            ) : (
              <ul className="lms-book-list">
                {searchResults.map((book) => (
                  <div key={book._id} className="lms-list-item">
                    <img className='lms-book-img' src={book.image || bookcover} alt={book.title} />
                    <div className="lms-list-item-content">
                      <h3>{book.title}</h3>
                      <p>Author: {book.author}</p>
                      {book.description && <p>Description: {book.description}</p>}
                      <p className="lms-copies">Available Copies: {book.availableCopies}</p>
                      {book.category?.name && <p className="lms-category">Category: {book.category.name}</p>}
                    </div>
                  </div>
                ))}
              </ul>
            )}
          </div>

          {/* Category Section */}
          <div className="lms-category-card">
            <div className="lms-section-header">
              <h2 className="lms-section-title">Categories</h2>
              <button className="lms-add-button" onClick={() => setShowAddCategoryForm(true)}>+ Add</button>
            </div>

            {showAddCategoryForm && (
              <form onSubmit={handleAddCategory} className="lms-form">
                <input
                  type="text"
                  className="lms-form-input"
                  placeholder="Category name"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  required
                />
                <div className="lms-form-actions">
                  <button type="submit" className="lms-submit-button">Add</button>
                  <button type="button" className="lms-cancel-button" onClick={() => setShowAddCategoryForm(false)}>Cancel</button>
                </div>
                {categoryError && <p className="lms-error-message">{categoryError}</p>}
              </form>
            )}

            {categories.length === 0 ? (
              <p className="lms-no-data">No categories found.</p>
            ) : (
              <ul className="lms-list">
                {categories.map((cat) => (
                  <li key={cat._id} className="lms-list-item">
                    <button
                      className={`lms-list-button ${selectedCategory?._id === cat._id ? 'lms-selected' : ''}`}
                      onClick={() => fetchBooksForCategory(cat)}
                    >
                      {cat.name}
                      <p className='lms-view-button'> view books</p>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Book Section */}
          {selectedCategory && (
            <div className="lms-book-card">
              <div className="lms-section-header">
                <h2 className="lms-section-title">Books in "{selectedCategory.name}"</h2>
                <button className="lms-add-button" onClick={() => setShowAddBookForm(true)}>+ Add</button>
              </div>

              {showAddBookForm && (
                <form onSubmit={handleAddBook} className="lms-form">
                  <input name="title" placeholder="Title" value={bookFormData.title} onChange={handleBookInputChange} className="lms-form-input" required />
                  <input name="author" placeholder="Author" value={bookFormData.author} onChange={handleBookInputChange} className="lms-form-input" required />
                  <textarea name="description" placeholder="Description" value={bookFormData.description} onChange={handleBookInputChange} className="lms-form-input" />
                  <input name="image" placeholder="Image URL" value={bookFormData.image} onChange={handleBookInputChange} className="lms-form-input" />
                  <label htmlFor="availableCopies" className="lms-form-label">Available Copies
                    <input type="number" name="availableCopies" placeholder="Available Copies" value={bookFormData.availableCopies} onChange={handleBookInputChange} className="lms-form-input" min={0} required />
                  </label>
                  <p className="lms-note">Category: <strong>{selectedCategory.name}</strong></p>
                  <div className="lms-form-actions">
                    <button type="submit" className="lms-submit-button">Add Book</button>
                    <button type="button" className="lms-cancel-button" onClick={() => setShowAddBookForm(false)}>Cancel</button>
                  </div>
                  {bookError && <p className="lms-error-message">{bookError}</p>}
                </form>
              )}

              {deleteSuccess && <p className="lms-success-message">{deleteSuccess}</p>}
              {deleteError && <p className="lms-error-message">{deleteError}</p>}
              {bookSuccess && <p className="lms-success-message">{bookSuccess}</p>}

              <ul className="lms-book-list">
                {books.length === 0 ? (
                  <p className="lms-no-data">No books found in this category.</p>
                ) : (
                  books.map((book) => (
                    <div key={book._id} className="lms-list-item">
                      <img className='lms-book-img' src={book.image || bookcover} alt={book.title} />
                      <div className="lms-list-item-content">
                        <h3>{book.title}</h3>
                        <p>Author: {book.author}</p>
                        {book.description && <p>Description: {book.description}</p>}
                        <p className="lms-copies">Available Copies: {book.availableCopies}</p>
                        <p className="lms-category">Category: {book.category?.name}</p>
                        <div className="lms-book-actions">
                          <button onClick={() => handleEditClick(book)} className="lms-edit-button">Edit</button>
                          <button onClick={() => handleDeleteBook(book._id)} className="lms-delete-button">Delete</button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
