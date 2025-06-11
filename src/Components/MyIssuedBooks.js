import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/MyIssuedBooks.css';
import bookcover from '../assets/no_cover_available.png'

const MyIssuedBooks = () => {
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIssuedBooks = async () => {
      try {
        const res = await axios.get('/api/issues/my', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        // Filter only approved requests
        const approved = res.data.filter(req => req.status === 'approved');
        setIssuedBooks(approved);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch issued books:', err);
        setLoading(false);
      }
    };

    fetchIssuedBooks();
  }, []);

  const isOverdue = (dueDate, returnDate) => {
    if (returnDate) return false;
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="issued-books-container">
      <h2>📕 My Issued Books</h2>
      {loading ? (
        <p>Loading...</p>
      ) : issuedBooks.length === 0 ? (
        <p>You haven’t issued any books yet.</p>
      ) : (
        <div className="book-cards-grid">
          {issuedBooks.map(book => (
            <div className="book-card" key={book._id}>
              <img
                src={book.book?.image || bookcover}
                alt={book.book?.title}
                className="book-img"
              />
              <h3>{book.book?.title}</h3>
              <p><strong>Author:</strong> {book.book?.author}</p>
              <p><strong>Issue Date:</strong> {new Date(book.issueDate).toLocaleDateString()}</p>
              <p><strong>Due Date:</strong> {new Date(book.dueDate).toLocaleDateString()}</p>

              {book.returnDate ? (
                <p className="returned">✅ Returned on {new Date(book.returnDate).toLocaleDateString()}</p>
              ) : isOverdue(book.dueDate, book.returnDate) ? (
                <p className="overdue">⚠️ Return it! Due date passed</p>
              ) : (
                <p className="pending-return">🔁 Not yet returned</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyIssuedBooks;
