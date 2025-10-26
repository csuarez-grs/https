const express = require('express');
const router = express.Router();

// Example in-memory posts data
const posts = [
  { id: 1, title: 'First Post', content: 'Hello world!', public: true },
  { id: 2, title: 'Second Post', content: 'Another post', public: true },
  { id: 3, title: 'Private Post', content: 'Sensitive info', public: false },
  { id: 4, title: 'Third Post', content: 'More content', public: true },
  { id: 5, title: 'Fourth Post', content: 'Even more content', public: false }
];

/**
 * GET /posts: Returns all public posts
 * Cache-Control: public, max-age=300, stale-while-revalidate=300
 * Security: Only non-sensitive (public) data is cached
 */
router.get('/', (req, res) => {
  res.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=300');
  res.json(posts.filter(post => post.public));
});

/**
 * GET /posts/:id: Fetches a post by its ID
 * Cache-Control: public, max-age=300 (if public)
 * Security: Role-based access for sensitive posts
 */
router.get('/:id', (req, res) => {
  const post = posts.find(p => p.id === parseInt(req.params.id));
  if (!post) return res.status(404).json({ error: 'Post not found' });
  if (post.public) {
    res.set('Cache-Control', 'public, max-age=300');
  }
  if (!post.public) {
    // Example role check (replace with real auth logic)
    if (req.headers['x-role'] !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
  }
  res.json(post);
});


module.exports = router;
