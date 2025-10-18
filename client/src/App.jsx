import React from 'react';
import { FileList } from './components/DirectoryView';
import './App.css';
import { HomePage } from './pages/HomePage';
import {UserRegistrationForm} from "./components/Register"
import { BrowserRouter, Routes,Route } from 'react-router-dom';
import { LoginForm } from './components/Login';

function App() {
  
  return (<>
<BrowserRouter>
<Routes>
  <Route path="/" element={<HomePage/>}/>
  <Route path='register' element={<UserRegistrationForm/>}/>
  <Route path='login' element={<LoginForm/>}/>
  <Route path="/directory/:dirid" element={<HomePage/>}/>
</Routes>
</BrowserRouter>
  </>
  )
}

export default App;
