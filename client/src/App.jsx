import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { HomePage } from './pages/HomePage';
import { ProfilePage } from './pages/ProfilePage';
import { Login, UserRegistrationForm } from '@/features/user';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/directory/:dirid" element={<HomePage />} />
        <Route path="/register" element={<UserRegistrationForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user-profile" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
