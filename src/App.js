import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/sidebar';
import Home from './components/Home'; // Import your Home component
import AdminLogin from './components/AdminLogin'; // Import your Home component
import './App.css';
import './Views.css';
const App = () => {
  return (
    <Router>
     
      <Routes>
      <Route path="/" element={<AdminLogin />} />
        <Route path="/home" element={<Home />} />
        <Route path="/sidebar" element={<Sidebar />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
};

export default App;
