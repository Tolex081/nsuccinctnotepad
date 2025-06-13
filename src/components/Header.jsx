// src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FiSun, FiMoon } from 'react-icons/fi';
import logo from '../assets/succinct-logo.png';
import './Header.css';

function Header({ toggleTheme, theme }) {
  return (
    <header className="header">
      <div>
        <Link to="/welcome">
          <img src={logo} alt="Succinct Logo" />
        </Link>
      </div>
      <button className="theme-toggle" onClick={toggleTheme}>
        {theme === 'light' ? <FiMoon /> : <FiSun />}
      </button>
    </header>
  );
}

export default Header;