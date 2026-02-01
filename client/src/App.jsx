import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { HomePage } from './pages/HomePage';
import { ProfilePage } from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import { Toaster } from "sonner"
import RegisterPage from './pages/RegisterPage';
function App() {
  return (
    <BrowserRouter>
    <Toaster richColors position="top-right" />
      <Routes>
          
        <Route path="/" element={<HomePage />} />
        <Route path="/directory/:dirid" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage/>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/user-profile" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
