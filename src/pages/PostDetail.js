import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './PostDetail.css';

function PostDetail() {
  const { postId } = useParams();

  const [post, setPost] = useState(null);
  const [author, setAuthor] = useState(null);
  const [comments, setComments] = useState([]);
  const [loadingPost, setLoadingPost] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);
  const [postError, setPostError] = useState(null);
  const [commentsError, setCommentsError] = useState(null);

  // Comment form state
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formBody, setFormBody] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Fetch post + author
  useEffect(() => {
    setLoadingPost(true);
    setPostError(null);

    fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`)
      .then(res => {
        if (!res.ok) throw new Error('Post not found');
        return res.json();
      })
      .then(postData => {
        setPost(postData);
        // Fetch author using userId from post
        return fetch(`https://jsonplaceholder.typicode.com/users/${postData.userId}`);
      })
      .then(res => {
        if (!res.ok) throw new Error('Author not found');
        return res.json();
      })
      .then(userData => {
        setAuthor(userData);
        setLoadingPost(false);
      })
      .catch(err => {
        console.error('Error fetching post or author:', err);
        setPostError('This dispatch could not be loaded. It may have gone to print without us.');
        setLoadingPost(false);
      });
  }, [postId]);

  // Fetch comments
  useEffect(() => {
    setLoadingComments(true);
    setCommentsError(null);

    fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch comments');
        return res.json();
      })
      .then(data => {
        setComments(data);
        setLoadingComments(false);
      })
      .catch(err => {
        console.error('Error fetching comments:', err);
        setCommentsError('Comments could not be loaded at this time.');
        setLoadingComments(false);
      });
  }, [postId]);

  // Validate form
  const validate = () => {
    const errs = {};
    if (!formName.trim()) errs.name = 'Please enter your name.';
    if (!formEmail.trim()) {
      errs.email = 'Please enter your email.';
    } else if (!/\S+@\S+\.\S+/.test(formEmail)) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!formBody.trim()) errs.body = 'Please write a comment.';
    else if (formBody.trim().length < 5) errs.body = 'Comment is too short.';
    return errs;
  };

  // Submit comment
  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    setSubmitting(true);
    setFormErrors({});

    fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        postId: parseInt(postId),
        name: formName,
        email: formEmail,
        body: formBody,
      }),
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to post comment');
        return res.json();
      })
      .then(newComment => {
        // Add new comment to top of list
        setComments(prev => [newComment, ...prev]);
        setFormName('');
        setFormEmail('');
        setFormBody('');
        setSubmitting(false);
        setSubmitSuccess(true);
        setTimeout(() => setSubmitSuccess(false), 4000);
      })
      .catch(err => {
        console.error('Error posting comment:', err);
        setFormErrors({ submit: 'Your comment couldn\'t be sent. Please try again.' });
        setSubmitting(false);
      });
  };

  if (loadingPost) {
    return (
      <div className="spinner-wrap">
        <div className="spinner" />
        <p>Pulling the dispatch from the archive…</p>
      </div>
    );
  }

  if (postError) {
    return (
      <div className="post-detail-page">
        <div className="error-box">
          <h3>Dispatch Not Found</h3>
          <p>{postError}</p>
        </div>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link to="/posts" className="back-link">← Return to Archive</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="post-detail-page">
      <div className="post-detail-container">

        {/* Back link */}
        <Link to="/posts" className="back-link">← All Dispatches</Link>

        {/* Article */}
        <article className="post-article">
          <header className="post-header">
            <div className="post-meta-top">
              <span className="post-tag">Dispatch #{post.id}</span>
              {author && (
                <span className="post-byline">By {author.name}</span>
              )}
            </div>
            <h1 className="post-title">{post.title}</h1>
            <div className="post-rule" />
          </header>

          <div className="post-body">
            {/* Expand single paragraph into multiple for readability */}
            {post.body.split('\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
            {/* Pad with lorem to show styling */}
            <p>
              The nature of public discourse has always been shaped by those willing to commit their
              thoughts to paper — or screen. What follows is a record of one such commitment, offered
              here in full without editorial interference.
            </p>
            <p>
              Readers are encouraged to draw their own conclusions, engage with the text on its own
              terms, and respond in the comments below. The conversation, after all, is half the story.
            </p>
          </div>

          {/* Author card */}
          {author && (
            <aside className="author-card">
              <div className="author-avatar">
                {author.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
              </div>
              <div className="author-info">
                <p className="author-label">About the Correspondent</p>
                <h3 className="author-name">{author.name}</h3>
                <div className="author-details">
                  <span>✉ {author.email}</span>
                  {author.phone && <span>☎ {author.phone}</span>}
                  {author.website && <span>🌐 {author.website}</span>}
                  {author.company && <span>🏢 {author.company.name}</span>}
                </div>
                {author.address && (
                  <p className="author-location">
                    📍 {author.address.city}, {author.address.zipcode}
                  </p>
                )}
              </div>
            </aside>
          )}
        </article>

        {/* Comments section */}
        <section className="comments-section">
          <div className="comments-header">
            <h2 className="comments-title">
              Reader Responses
              {!loadingComments && (
                <span className="comments-count"> ({comments.length})</span>
              )}
            </h2>
            <div className="comments-rule" />
          </div>

          {/* Comment form */}
          <div className="comment-form-wrap">
            <h3 className="comment-form-title">Add Your Response</h3>
            {submitSuccess && (
              <div className="submit-success">
                ✓ Your response has been received. Thank you for writing in.
              </div>
            )}
            {formErrors.submit && (
              <div className="submit-error">{formErrors.submit}</div>
            )}
            <form onSubmit={handleSubmit} className="comment-form" noValidate>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Your Name *</label>
                  <input
                    id="name"
                    type="text"
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    placeholder="Full name"
                    className={formErrors.name ? 'input-error' : ''}
                  />
                  {formErrors.name && <span className="field-error">{formErrors.name}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    id="email"
                    type="email"
                    value={formEmail}
                    onChange={e => setFormEmail(e.target.value)}
                    placeholder="your@email.com"
                    className={formErrors.email ? 'input-error' : ''}
                  />
                  {formErrors.email && <span className="field-error">{formErrors.email}</span>}
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="body">Your Comment *</label>
                <textarea
                  id="body"
                  value={formBody}
                  onChange={e => setFormBody(e.target.value)}
                  placeholder="Share your thoughts on this dispatch…"
                  rows={5}
                  className={formErrors.body ? 'input-error' : ''}
                />
                {formErrors.body && <span className="field-error">{formErrors.body}</span>}
              </div>
              <button type="submit" className="submit-btn" disabled={submitting}>
                {submitting ? 'Sending…' : 'Submit Response →'}
              </button>
            </form>
          </div>

          {/* Comments list */}
          <div className="comments-list">
            {loadingComments ? (
              <div className="spinner-wrap">
                <div className="spinner" />
                <p>Loading reader responses…</p>
              </div>
            ) : commentsError ? (
              <div className="error-box">
                <h3>Could Not Load Comments</h3>
                <p>{commentsError}</p>
              </div>
            ) : comments.length === 0 ? (
              <div className="no-comments">
                <p>No comments yet. Be the first to comment!</p>
              </div>
            ) : (
              comments.map((comment, index) => (
                <div key={comment.id ?? `new-${index}`} className={`comment-card ${index === 0 && comment.id > 500 ? 'comment-card--new' : ''}`}>
                  <div className="comment-header">
                    <div className="comment-avatar">
                      {comment.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="comment-meta">
                      <span className="comment-name">{comment.name}</span>
                      <span className="comment-email">{comment.email}</span>
                    </div>
                    {comment.id > 500 && (
                      <span className="comment-new-badge">New</span>
                    )}
                  </div>
                  <p className="comment-body">{comment.body}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default PostDetail;
