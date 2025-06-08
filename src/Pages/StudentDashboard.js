import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/StudentDashboard.css';
import StudentNavbar from '../Components/StudentNavbar';
import StudentDashboardPage from '../Components/StudentDashboardPage';

export default function StudentDashboard({ token }) {
  const [myIssues, setMyIssues] = useState([]);
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loadingIssues, setLoadingIssues] = useState(false);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [error, setError] = useState(null);
  const [requestingBookId, setRequestingBookId] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Fetch student's issue requests
  const fetchMyIssues = async () => {
    setLoadingIssues(true);
    try {
      const res = await axios.get('/api/issues/my', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyIssues(res.data);
      setLoadingIssues(false);
    } catch (err) {
      setError('Failed to load your issue requests');
      setLoadingIssues(false);
    }
  };

  // Search books by title
  const searchBooks = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    setLoadingBooks(true);
    try {
      // Assuming you have an endpoint for searching books, else filter client side
      const res = await axios.get(`/api/books?search=${encodeURIComponent(searchQuery)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSearchResults(res.data);
      setLoadingBooks(false);
    } catch (err) {
      setError('Failed to search books');
      setLoadingBooks(false);
    }
  };

  // Request to issue a book
  const requestIssue = async (bookId) => {
    setRequestingBookId(bookId);
    try {
      await axios.post(
        '/api/issues/request',
        { bookId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccessMsg('Issue request sent successfully!');
      fetchMyIssues();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to request book issue');
    }
    setRequestingBookId(null);
  };

  useEffect(() => {
    fetchMyIssues();
  }, []);

  return (
    <div className="student-dashboard">
        <StudentNavbar/>
        <StudentDashboardPage/>
     
     
    </div>
  );
}
