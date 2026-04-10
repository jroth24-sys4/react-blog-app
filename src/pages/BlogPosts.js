import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './BlogPosts.css';

function BlogPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch posts');
        return response.json();
      })
      .then(data => {
        setPosts(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching posts:', error);
        setError('We couldn\'t load the posts. Please try again later.');
        setLoading(false);
      });
  }, []);

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.body.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="spinner-wrap">
        <div className="spinner" />
        <p>Typesetting the morning edition…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-box">
          <h3>Press Stop</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-posts-page">
      <div className="posts-header">
        <div className="posts-header-inner">
          <p className="posts-eyebrow">Archive</p>
          <h1 className="posts-title">All Dispatches</h1>
          <p className="posts-count">{posts.length} stories in the archive</p>
        </div>
        <div className="posts-search-wrap">
          <input
            type="text"
            placeholder="Search stories…"
            className="posts-search"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="posts-container">
        {filteredPosts.length === 0 ? (
          <p className="no-results">No stories match your search.</p>
        ) : (
          <div className="posts-grid">
            {filteredPosts.map((post, index) => (
              <article key={post.id} className={`post-card ${index === 0 && !searchTerm ? 'post-card--featured' : ''}`}>
                <div className="post-card-meta">
                  <span className="post-card-number">#{post.id}</span>
                  <span className="post-card-author">User {post.userId}</span>
                </div>
                <h2 className="post-card-title">
                  <Link to={`/posts/${post.id}`}>
                    {post.title}
                  </Link>
                </h2>
                <p className="post-card-excerpt">
                  {post.body.substring(0, 120)}…
                </p>
                <Link to={`/posts/${post.id}`} className="post-card-read-more">
                  Continue Reading →
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BlogPosts;
