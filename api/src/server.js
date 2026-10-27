'use strict';
const path = require('path');
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const routes = require('./routes');
const { pool } = require('./db');

const PORT = Number(process.env.PORT || 3000);
const FORCE_HTTPS = process.env.FORCE_HTTPS === 'true'; // set true behind a TLS-terminating proxy
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

const app = express();
app.disable('x-powered-by');
// Number of reverse proxies in front of the app (0 = none). Needed for correct per-client rate limiting.
app.set('trust proxy', Number(process.env.TRUST_PROXY || 0));

// ---- Security headers -------------------------------------------------------
const csp = {
  defaultSrc: ["'none'"],
  scriptSrc: ["'self'"],
  styleSrc: ["'self'"],
  imgSrc: ["'self'", 'data:'],
  connectSrc: ["'self'"],
  fontSrc: ["'self'"],
  manifestSrc: ["'self'"],
  baseUri: ["'self'"],
  formAction: ["'none'"],
  frameAncestors: ["'none'"],
  objectSrc: ["'none'"],
};
if (FORCE_HTTPS) csp.upgradeInsecureRequests = [];

app.use(
  helmet({
    contentSecurityPolicy: { useDefaults: false, directives: csp },
    strictTransportSecurity: FORCE_HTTPS
      ? { maxAge: 31536000, includeSubDomains: true }
      : false,
    referrerPolicy: { policy: 'no-referrer' },
    crossOriginResourcePolicy: { policy: 'same-origin' },
    crossOriginOpenerPolicy: { policy: 'same-origin' },
  })
);
app.use((_req, res, next) => {
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()'
  );
  next();
});

// ---- Privacy-friendly request log (no IP addresses, no query strings, no headers) ----
app.use((req, res, next) => {
  const start = process.hrtime.bigint();
  res.on('finish', () => {
    const ms = Number(process.hrtime.bigint() - start) / 1e6;
    console.log(`${req.method} ${req.path.slice(0, 120)} ${res.statusCode} ${ms.toFixed(0)}ms`);
  });
  next();
});

// ---- API --------------------------------------------------------------------
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 200,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

app.use('/api', apiLimiter);
// The API is strictly read-only.
app.use('/api', (req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.set('Allow', 'GET, HEAD');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  res.set('Cache-Control', 'public, max-age=60');
  next();
});
app.use('/api', routes);
app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found' }));

// ---- Static front end -------------------------------------------------------
app.use(
  express.static(PUBLIC_DIR, {
    index: 'index.html',
    dotfiles: 'ignore',
    maxAge: '1h',
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.html')) res.setHeader('Cache-Control', 'no-cache');
    },
  })
);
app.use((_req, res) => res.status(404).type('text/plain').send('Not found'));

// ---- Error handler: never leak stack traces or SQL errors -------------------
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('request error:', err.code || err.name || 'unknown');
  res.status(500).json({ error: 'Internal server error' });
});

if (require.main === module) {
  const server = app.listen(PORT, () => console.log(`portfolio listening on :${PORT}`));
  server.requestTimeout = 10_000;
  server.headersTimeout = 10_000;
  server.keepAliveTimeout = 5_000;

  const shutdown = () => {
    server.close(() => pool.end().finally(() => process.exit(0)));
    setTimeout(() => process.exit(1), 8_000).unref();
  };
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

module.exports = app;
