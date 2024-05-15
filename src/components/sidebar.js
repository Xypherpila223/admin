import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import '../Sidebars.css'; // Assuming the CSS file is in the same directory

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
      <h2>Dashboard</h2>
      <button className="toggle-sidebar" onClick={toggleSidebar}></button>
      <ul>
       
        {/* Use Link component from React Router */}
        <li><Link to="/home">Student Accounts</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
