import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-inner">
          <p className="hero-eyebrow">Welcome to</p>
          <h1 className="hero-headline">The Daily Post</h1>
          <p className="hero-sub">
            Dispatches from the digital frontier — stories, ideas, and reflections
            drawn from the world's collective imagination.
          </p>
          <Link to="/posts" className="hero-cta">
            Read the Latest Posts
          </Link>
        </div>
        <div className="hero-ornament">❧</div>
      </section>

      <section className="home-features">
        <div className="feature-card">
          <div className="feature-icon">✦</div>
          <h3>100 Stories</h3>
          <p>A curated collection of posts spanning every subject under the sun.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">✦</div>
          <h3>Real Authors</h3>
          <p>Each post is tied to a real correspondent with a unique voice and perspective.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">✦</div>
          <h3>Live Comments</h3>
          <p>Join the conversation — read and post comments on every article.</p>
        </div>
      </section>
    </div>
  );
}

export default Home;
