import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { redirectConfig } from './config.js';
import { analyzeScanContext, sanitizeForStorage } from './analytics.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory analytics store (replace with database for production)
const analyticsStore = {
  scans: [],
  summary: {}
};

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'QR Redirect Microservice',
    status: 'operational',
    version: '2.0.0',
    features: ['dynamic-redirects', 'advanced-analytics', 'neuromarketing-metrics'],
    routes: Object.keys(redirectConfig).map(slug => `/r/${slug}`),
    analytics: `/analytics`,
    documentation: 'See README.md for configuration'
  });
});

// Analytics dashboard endpoint
app.get('/analytics', (req, res) => {
  const { slug } = req.query;
  
  let scans = analyticsStore.scans;
  
  // Filter by slug if provided
  if (slug && redirectConfig[slug]) {
    scans = scans.filter(s => s.slug === slug);
  }
  
  // Calculate aggregate metrics
  const totalScans = scans.length;
  const uniqueUsers = new Set(scans.map(s => s.fingerprint)).size;
  const avgQualityScore = scans.length > 0 
    ? (scans.reduce((sum, s) => sum + s.qualityScore, 0) / scans.length).toFixed(2)
    : 0;
  
  // Device breakdown
  const deviceBreakdown = scans.reduce((acc, s) => {
    const key = `${s.device.type}_${s.device.os}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  
  // Engagement breakdown
  const engagementBreakdown = scans.reduce((acc, s) => {
    acc[s.engagement.level] = (acc[s.engagement.level] || 0) + 1;
    return acc;
  }, {});
  
  // Hourly distribution
  const hourlyDistribution = scans.reduce((acc, s) => {
    const hour = new Date(s.timestamp).getHours();
    acc[hour] = (acc[hour] || 0) + 1;
    return acc;
  }, {});
  
  res.json({
    summary: {
      totalScans,
      uniqueUsers,
      repeatScanRate: totalScans > 0 ? ((1 - uniqueUsers / totalScans) * 100).toFixed(2) + '%' : '0%',
      avgQualityScore
    },
    breakdown: {
      devices: deviceBreakdown,
      engagement: engagementBreakdown,
      hourly: hourlyDistribution
    },
    recentScans: scans.slice(-20).reverse(), // Last 20 scans
    campaigns: Object.keys(redirectConfig).map(slug => ({
      slug,
      scans: analyticsStore.scans.filter(s => s.slug === slug).length,
      targetUrl: redirectConfig[slug]
    }))
  });
});

// Export analytics data (CSV-like JSON for Excel/BI tools)
app.get('/analytics/export', (req, res) => {
  const { slug, format = 'json' } = req.query;
  
  let scans = analyticsStore.scans;
  if (slug) scans = scans.filter(s => s.slug === slug);
  
  if (format === 'csv') {
    // Convert to CSV
    const headers = ['timestamp', 'slug', 'device_type', 'device_os', 'browser', 'engagement_level', 'quality_score', 'fingerprint'];
    const csv = [
      headers.join(','),
      ...scans.map(s => [
        s.timestamp,
        s.slug,
        s.device.type,
        s.device.os,
        s.browser,
        s.engagement.level,
        s.qualityScore,
        s.fingerprint
      ].join(','))
    ].join('\n');
    
    res.header('Content-Type', 'text/csv');
    res.header('Content-Disposition', `attachment; filename="qr-analytics-${Date.now()}.csv"`);
    return res.send(csv);
  }
  
  res.json({
    exported: new Date().toISOString(),
    recordCount: scans.length,
    data: scans
  });
});

// Dynamic redirect route handler with advanced analytics
app.get('/r/:slug', (req, res) => {
  const startTime = Date.now();
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
  
  // Analyze scan context (neuromarketing metrics)
  const scanContext = analyzeScanContext(req);
  const latency = Date.now() - startTime;
  
  // Build complete analytics event
  const analyticsEvent = {
    timestamp: new Date().toISOString(),
    slug,
    targetUrl,
    ...scanContext,
    latency
  };
  
  // Sanitize and store (GDPR-compliant)
  const sanitizedData = sanitizeForStorage(analyticsEvent);
  analyticsStore.scans.push(sanitizedData);
  
  // Log to stdout (for Railway logs)
  console.log(JSON.stringify({
    event: 'redirect',
    ...sanitizedData,
    message: `QR scan: ${slug} → ${targetUrl} [Quality: ${scanContext.qualityScore}] [${scanContext.device.type}/${scanContext.device.os}]`
  }));
  
  // Update summary stats
  if (!analyticsStore.summary[slug]) {
    analyticsStore.summary[slug] = { 
      totalScans: 0, 
      uniqueUsers: new Set(),
      firstScan: new Date(),
      lastScan: null
    };
  }
  analyticsStore.summary[slug].totalScans++;
  analyticsStore.summary[slug].uniqueUsers.add(scanContext.fingerprint);
  analyticsStore.summary[slug].lastScan = new Date();
  
  // Perform 302 temporary redirect (allows future changes)
  res.redirect(302, targetUrl);
});

// Catch-all for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    availableRoutes: [
      '/',
      '/analytics',
      '/analytics/export',
      ...Object.keys(redirectConfig).map(slug => `/r/${slug}`)
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 QR Redirect Service v2.0.0 running on port ${PORT}`);
  console.log(`📍 Available routes:`);
  Object.entries(redirectConfig).forEach(([slug, url]) => {
    console.log(`   /r/${slug} → ${url}`);
  });
  console.log(`\n📊 Analytics: GET /analytics`);
  console.log(`📈 Export: GET /analytics/export?format=csv`);
  console.log(`\n💡 Update destinations in config.js and redeploy`);
  console.log(`🧠 Advanced neuromarketing analytics enabled`);
});
