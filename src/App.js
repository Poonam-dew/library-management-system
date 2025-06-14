// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './Pages/Register';
import Login from './Pages/Login';
import LibrarianDashboard from './Pages/LibrarianDashboard';
import PendingApprovals from './Components/PendingApprovals';
import ManageUsers from './Components/ManageUsers';
import ViewAllUsers from './Components/ViewAllUsers';
import BookManagementPage from './Components/BookManagementPage';
import StudentDashboard from './Pages/StudentDashboard';
import StudentStats from './Components/StudentStats';
import BrowseBooks from './Components/BrowseBooks';
import ViewAllRequests from './Components/ViewAllRequests';
import MyRequests from './Components/MyRequests';
import MyIssuedBooks from './Components/MyIssuedBooks';
import StudentProfile from './Components/StudentProfile';
import AddLibrarianForm from './Components/AddLibrarianForm';
import LibrarianProfile from './Components/LibrarianProfile';
import Footer from './Components/Footer';
import Home from './Pages/Home';

// Inside your routes config:


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-dashboard" element={<div>Welcome Admin</div>} />
        <Route path="/student-dashboard" element={<StudentDashboard/>} />
        <Route path="/librarian-dashboard" element={<LibrarianDashboard />} />
        <Route path="/librarian/pending" element={<PendingApprovals />} />
        <Route path="/librarian/manage-users" element={<ManageUsers />} />
        <Route path="/librarian/view-all-users" element={<ViewAllUsers/>} />
        <Route path="/librarian/manage-books" element={<BookManagementPage/>} />
        <Route path="/student/stats" element={<StudentStats/>} />
        <Route path="/student/books" element={<BrowseBooks/>} />
        <Route path="/librarian/view-all-requests" element={<ViewAllRequests/>} />
        <Route path="/student/request" element={<MyRequests/>} />
         <Route path="/student/issued" element={<MyIssuedBooks/>} />
         <Route path="/student-profile" element={<StudentProfile/>} />
          <Route path="/librarian/add-librarian" element={<AddLibrarianForm/>} />
           <Route path="/librarian/profile" element={<LibrarianProfile/>} />
        <Route path="/" element={<Home/>} />

      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;
