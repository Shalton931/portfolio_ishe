'use strict';
const express = require('express');
const { pool } = require('./db');

const router = express.Router();

// Wrap async handlers so rejected promises reach the error handler.
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// All queries are static strings; the only user input (slug) is validated and parameterised.
const SLUG_RE = /^[a-z0-9-]{1,80}$/;
const PROJECT_COLS = 'slug, title, subtitle, description, role, technologies, repo_url, live_url';

router.get('/health', wrap(async (_req, res) => {
  await pool.query('SELECT 1');
  res.json({ status: 'ok' });
}));

router.get('/profile', wrap(async (_req, res) => {
  const { rows } = await pool.query(
    'SELECT full_name, headline, summary, location, email FROM profile WHERE id = 1'
  );
  if (!rows[0]) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
}));

router.get('/projects', wrap(async (_req, res) => {
  const { rows } = await pool.query(
    `SELECT ${PROJECT_COLS} FROM projects WHERE is_published ORDER BY sort_order, id`
  );
  res.json(rows);
}));

router.get('/projects/:slug', wrap(async (req, res) => {
  if (!SLUG_RE.test(req.params.slug)) return res.status(400).json({ error: 'Invalid project id' });
  const { rows } = await pool.query(
    `SELECT ${PROJECT_COLS} FROM projects WHERE is_published AND slug = $1`,
    [req.params.slug]
  );
  if (!rows[0]) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
}));

router.get('/skills', wrap(async (_req, res) => {
  const { rows } = await pool.query(
    'SELECT category, name FROM skills ORDER BY category_order, sort_order, id'
  );
  const groups = [];
  for (const r of rows) {
    let g = groups[groups.length - 1];
    if (!g || g.category !== r.category) {
      g = { category: r.category, items: [] };
      groups.push(g);
    }
    g.items.push(r.name);
  }
  res.json(groups);
}));

router.get('/education', wrap(async (_req, res) => {
  const { rows } = await pool.query(
    'SELECT institution, qualification, period, details FROM education ORDER BY sort_order, id'
  );
  res.json(rows);
}));

router.get('/achievements', wrap(async (_req, res) => {
  const { rows } = await pool.query('SELECT title FROM achievements ORDER BY sort_order, id');
  res.json(rows.map((r) => r.title));
}));

module.exports = router;
