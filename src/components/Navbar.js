import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Current date for newspaper header
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-top">
        <span className="header-date">{today}</span>
        <span className="header-tagline">Truth · Clarity · Depth</span>
      </div>
      <div className="header-main">
        <Link to="/" className="site-title">The Daily Post</Link>
      </div>
      <div className="header-rule-wrap">
        <div className="header-rule-thin" />
        <div className="header-rule-thick" />
        <div className="header-rule-thin" />
      </div>
      <nav className="header-nav">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Home
        </NavLink>
        <NavLink to="/posts" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          All Posts
        </NavLink>
      </nav>
    </header>
  );
}

export default Navbar;
