import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/CategoryBooks.css';

const CategoryBooks = () => {
  const { id } = useParams(); // category id
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, [id]);

  const fetchBooks = async () => {
    try {
      const res = await axios.get(`/api/books/category/${id}`);
      setBooks(res.data);
    } catch (err) {
      console.error('Error fetching category books', err);
    }
  };

  return (
    <div className="category-books-container">
      <h2>Books in This Category</h2>
      {books.length === 0 ? (
        <p>No books found in this category.</p>
      ) : (
        books.map((book) => (
          <div className="book-card" key={book._id}>
            <h4>{book.title}</h4>
            <p><strong>Author:</strong> {book.author}</p>
            <p>{book.description}</p>
            <p><strong>Available:</strong> {book.availableCopies}</p>
            <button onClick={() => {
              const token = localStorage.getItem('token');
              if (!token) return navigate('/login');
              navigate(`/book-details/${book._id}`);
            }}>
              Request to Issue
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default CategoryBooks;
