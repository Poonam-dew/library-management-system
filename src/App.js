// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './Pages/Register';
import Login from './Pages/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-dashboard" element={<div>Welcome Admin</div>} />
        <Route path="/student-dashboard" element={<div>Welcome Student</div>} />
      </Routes>
    </Router>
  );
}

export default App;
