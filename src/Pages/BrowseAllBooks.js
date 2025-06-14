import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/BrowseAllBooks.css';
import bookcover from '../assets/no_cover_available.png'
const BrowseAllBooks = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
const [successBookId, setSuccessBookId] = useState(null);
const [requestMsg, setRequestMsg] = useState(null);
const [searchError, setSearchError] = useState('');

const [searchResults, setSearchResults] = useState([]);


  useEffect(() => {
    fetchCategories();
  }, []);
  useEffect(() => {
  if (searchQuery === '') setSearchResults([]);
}, [searchQuery]);


  const fetchCategories = async () => {
    try {
      const res = await axios.get('/api/books/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Error fetching categories', err);
    }
  };

  const handleCategoryClick = async (categoryId) => {
    setSelectedCategoryId(categoryId);
    try {
      const res = await axios.get(`/api/books/category/${categoryId}`);
      setBooks(res.data);
      
    } catch (err) {
      console.error('Error fetching books', err);
    }
  };

const handleSearch = async () => {
  if (!searchQuery.trim()) return;

  try {
    const res = await axios.get(`/api/books/search?title=${searchQuery}`);
    const results = res.data;

    if (results.length === 0) {
      setSearchResults([]);
      setSearchError('No books found for your search.');
    } else {
      setSearchResults(results);
      setSearchError('');
    }

    setSelectedCategoryId(null); // deselect category
  } catch (err) {
    console.error('Error searching books', err);
    setSearchError('Something went wrong. Please try again.');
    setSearchResults([]);
  }
};


  const handleRequestIssue = async (bookId) => {
  const token = localStorage.getItem('token');

  if (!token) {
    window.location.href = '/login';
    return;
  }

  try {
    const res = await axios.post(
      '/api/issues/request1',
      { bookId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setSuccessBookId(bookId);
    setRequestMsg(res.data.message || 'Request sent successfully');
  } catch (err) {
    setSuccessBookId(bookId);
    setRequestMsg(err.response?.data?.message || 'Request failed');
  }

  setTimeout(() => {
    setSuccessBookId(null);
    setRequestMsg(null);
  }, 4000);
};


  return (
    <div className="browse-container">
      <h2 className="browse-title">Browse All Books</h2>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {searchError && (
  <div className="search-error">
    {searchError}
  </div>
)}

    {searchResults.length > 0 && (
  <div className="books-section">
    <h3 className="books-section-title">Search Results</h3>
    <div className="book-card-grid">
      {searchResults.map((book) => (
        <div key={book._id} className="book-card">
          <img src={book.image || bookcover} alt={book.title} className="book-image" />
          <div className="book-info">
            <h4>{book.title}</h4>
            <p><strong>Author:</strong> {book.author?.name || book.author || 'Unknown'}</p>
            <p><strong>Category:</strong> {book.category?.name || book.category || 'N/A'}</p>
            <p><strong>Available:</strong> {book.availableCopies}</p>
            <button
              disabled={book.availableCopies === 0}
              // onClick={() => handleRequestIssue(book._id)}
              className="issue-btn"
            >
              {book.availableCopies === 0 ? 'Not Available' : 'Login to Issue'}
            </button>
            {successBookId === book._id && requestMsg && (
              <div className={`issue-msg ${requestMsg.includes('success') ? 'success' : 'error'}`}>
                {requestMsg}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
)}

        <h1 className='browse-title1'>Select Category</h1>
      <div className="category-grid">
      
        {categories.map((cat) => (
          <div
            key={cat._id}
            className={`category-card ${selectedCategoryId === cat._id ? 'active' : ''}`}
            onClick={() => handleCategoryClick(cat._id)}
          >
            {cat.name}
          </div>
        ))}
      </div>

     {selectedCategoryId && books.length > 0 && (
  <div className="books-section">
    <h3 className="books-section-title">Books in Selected Category</h3>
    <div className="book-card-grid">
      {books.map((book) => (
        <div key={book._id} className="book-card">
          <img src={book.image || bookcover} alt={book.title} className="book-image" />
          <div className="book-info">
            <h4>{book.title}</h4>
            <p><strong>Author:</strong> {book.author?.name || book.author || 'Unknown'}</p>
            <p><strong>Category:</strong> {book.category?.name || book.category || 'N/A'}</p>
            <p><strong>Available:</strong> {book.availableCopies}</p>
            <button
              disabled={book.availableCopies === 0}
              // onClick={() => handleRequestIssue(book._id)}
              className="issue-btn"
            >
              {book.availableCopies === 0 ? 'Not Available' : 'Login to Issue'}
            </button>
            {successBookId === book._id && requestMsg && (
              <div className={`issue-msg ${requestMsg.includes('success') ? 'success' : 'error'}`}>
                {requestMsg}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
)}

    </div>
  );
};

export default BrowseAllBooks;
