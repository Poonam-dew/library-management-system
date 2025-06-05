// src/pages/Register.js
import React from 'react';
import RegisterForm from '../Components/RegisterForm';
import "../styles/Register.css"
const Register = () => {
  return (
    <div className='register-page'>
      <h1>Weclome to MyLibrary</h1>
      <RegisterForm role="student" />
    </div>
  );
};

export default Register;
