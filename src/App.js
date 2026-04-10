import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import BlogPosts from './pages/BlogPosts';
import PostDetail from './pages/PostDetail';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/posts" element={<BlogPosts />} />
            <Route path="/posts/:postId" element={<PostDetail />} />
          </Routes>
        </main>
        <footer className="site-footer">
          <div className="footer-rule" />
          <p>© 2026 The Daily Post · All dispatches via JSONPlaceholder</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
