import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/BrowseBooks.css';
import bookcover from '../assets/no_cover_available.png';

const BrowseBooks = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [requestMsg, setRequestMsg] = useState(null);
  const [successBookId, setSuccessBookId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/books/categories');
      setCategories(res.data);
      setError(null);
    } catch (err) {
      setError('Failed to load categories');
    }
    setLoading(false);
  };

  const fetchBooks = async (category) => {
    setLoading(true);
    setSelectedCategory(category);
    try {
      const res = await axios.get(`/api/books/category/${category._id}`);
      setBooks(res.data);
    } catch (err) {
      console.error('Failed to fetch books', err);
      setBooks([]);
    }
    setLoading(false);
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(`/api/books/search?title=${encodeURIComponent(query)}`);
      setSearchResults(res.data);
      setError(null);
      setSelectedCategory(null);
    } catch (err) {
      setError('Search failed');
      setSearchResults([]);
    }
    setLoading(false);
  };

  const handleRequestIssue = async (bookId) => {
    try {
       
      const res = await axios.post('/api/issues/request', { bookId }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
        setSuccessBookId(bookId);
      setRequestMsg(res.data.message || 'Request sent successfully');
      setTimeout(() => setRequestMsg(null), 4000);
    } catch (err) {
        setSuccessBookId(bookId);
      setRequestMsg(err.response?.data?.message || 'Request failed');
      setTimeout(() => setRequestMsg(null), 4000);
    }
  };

  return (
    <div className="browse-books">
      <h1 className="page-title">Browse Library Books</h1>

      {/* Search */}
      <div className="search-section">
        <input
          type="text"
          placeholder="Search any book by title..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleSearch(searchQuery); }}
        />
        <button onClick={() => handleSearch(searchQuery)}>🔍 Search</button>
      </div>

      {/* Request message */}
      {requestMsg && <p className="request-msg">{requestMsg}</p>}

      {/* Loading and error */}
      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">{error}</p>}

      {/* Search results */}
      {searchQuery && !loading && (
        <div className="search-results">
          <h2>Search Results</h2>
          {searchResults.length === 0 ? (
            <p>No books found for "{searchQuery}"</p>
          ) : (
            <div className="books-grid">
              {searchResults.map(book => (
                <div key={book._id} className="book-card">
                  <img src={book.image || bookcover} alt={book.title} className="book-image" />
                  <h3>{book.title}</h3>
                  <p><strong>Author:</strong> {book.author}</p>
                  <p><strong>Description:</strong> {book.description || 'No description available.'}</p>
                  <p><strong>Available Copies:</strong> {book.availableCopies}</p>
                  <button
                    onClick={() => handleRequestIssue(book._id)}
                    disabled={book.availableCopies === 0}
                    className="issue-btn"
                  >
                    {book.availableCopies === 0 ? 'Not Available' : 'Request to Issue'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Categories list */}
      { !loading && (
        <div className="categories-list">
          <h2>Book Categories</h2>
          <ul>
            {categories.map(cat => (
              <li key={cat._id} onClick={() => fetchBooks(cat)} className="category-card">
                {cat.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Books in selected category */}
      { selectedCategory && !loading && (
        <div className="books-in-category">
          <button onClick={() => setSelectedCategory(null)} className="back-btn">← Back to Categories</button>
          <h2>Books in "{selectedCategory.name}"</h2>
          {books.length === 0 ? (
            <p>No books found in this category.</p>
          ) : (
            <div className="books-grid">
              
              {books.map(book => (
                <div key={book._id} className="book-card">
                  
                  <img src={book.image  || bookcover} alt={book.title} className="book-image" />
                  <h3>{book.title}</h3>
                  <p><strong>Author:</strong> {book.author}</p>
                  <p><strong>Description:</strong> {book.description || 'No description available.'}</p>
                  <p><strong>Available Copies:</strong> {book.availableCopies}</p>
                  <button
                    onClick={() => handleRequestIssue(book._id)}
                    disabled={book.availableCopies === 0}
                    className="issue-btn"
                  >
                    {book.availableCopies === 0 ? 'Not Available' : 'Request to Issue'}
                   
                  </button>
                    {successBookId === book._id && requestMsg && <div className="success-message1">{requestMsg}</div>}
                </div>
                
              ))}
            </div>
            
          )}
        </div>
      )}
    </div>
  );
};

export default BrowseBooks;
