import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { redirectConfig } from './config.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'QR Redirect Microservice',
    status: 'operational',
    version: '1.0.0',
    routes: Object.keys(redirectConfig).map(slug => `/r/${slug}`),
    documentation: 'See README.md for configuration'
  });
});

// Analytics/logging helper
const logRedirect = (slug, targetUrl, req) => {
  const timestamp = new Date().toISOString();
  const userAgent = req.get('user-agent') || 'unknown';
  const ip = req.ip || req.connection.remoteAddress;
  
  console.log(JSON.stringify({
    timestamp,
    event: 'redirect',
    slug,
    targetUrl,
    userAgent,
    ip: ip.replace('::ffff:', ''), // Clean IPv6 prefix
    referrer: req.get('referer') || 'none'
  }));
};

// Dynamic redirect route handler
app.get('/r/:slug', (req, res) => {
  const { slug } = req.params;
  
  // Check if slug exists in config
  const targetUrl = redirectConfig[slug];
  
  if (!targetUrl) {
    console.error(`404: Slug "${slug}" not found in config`);
    return res.status(404).json({
      error: 'Redirect not found',
      slug,
      availableRoutes: Object.keys(redirectConfig)
    });
  }
  
  // Log the redirect for analytics
  logRedirect(slug, targetUrl, req);
  
  // Perform 302 temporary redirect (allows future changes)
  res.redirect(302, targetUrl);
});

// Catch-all for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    availableRoutes: [
      '/',
      ...Object.keys(redirectConfig).map(slug => `/r/${slug}`)
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 QR Redirect Service running on port ${PORT}`);
  console.log(`📍 Available routes:`);
  Object.entries(redirectConfig).forEach(([slug, url]) => {
    console.log(`   /r/${slug} → ${url}`);
  });
  console.log(`\n💡 Update destinations in config.js and redeploy`);
});

