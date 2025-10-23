/**
 * Advanced Analytics Engine
 * Neuromarketing-optimized tracking for QR code campaigns
 */

import { createHash } from 'crypto';

/**
 * Device Type Detection (User Agent Parsing)
 */
export const detectDevice = (userAgent) => {
  const ua = userAgent.toLowerCase();
  
  if (/mobile|android|iphone|ipod|blackberry|windows phone/i.test(ua)) {
    if (/iphone|ipad|ipod/i.test(ua)) return { type: 'mobile', os: 'iOS', platform: 'Apple' };
    if (/android/i.test(ua)) return { type: 'mobile', os: 'Android', platform: 'Google' };
    return { type: 'mobile', os: 'other', platform: 'unknown' };
  }
  
  if (/tablet|ipad/i.test(ua)) {
    return { type: 'tablet', os: 'unknown', platform: 'unknown' };
  }
  
  if (/windows/i.test(ua)) return { type: 'desktop', os: 'Windows', platform: 'Microsoft' };
  if (/mac/i.test(ua)) return { type: 'desktop', os: 'macOS', platform: 'Apple' };
  if (/linux/i.test(ua)) return { type: 'desktop', os: 'Linux', platform: 'Open' };
  
  return { type: 'unknown', os: 'unknown', platform: 'unknown' };
};

/**
 * Browser Detection
 */
export const detectBrowser = (userAgent) => {
  const ua = userAgent.toLowerCase();
  
  if (ua.includes('edg')) return 'Edge';
  if (ua.includes('chrome')) return 'Chrome';
  if (ua.includes('safari') && !ua.includes('chrome')) return 'Safari';
  if (ua.includes('firefox')) return 'Firefox';
  if (ua.includes('opera') || ua.includes('opr')) return 'Opera';
  
  return 'Other';
};

/**
 * Anonymous User Fingerprint (GDPR-compliant)
 * Creates non-reversible hash from IP + User Agent
 * Used for unique vs repeat scanner detection
 */
export const createFingerprint = (ip, userAgent) => {
  const data = `${ip}:${userAgent}`;
  return createHash('sha256').update(data).digest('hex').substring(0, 16);
};

/**
 * Scan Quality Score (0-100)
 * Measures likelihood of conversion based on neuromarketing factors
 */
export const calculateQualityScore = (metrics) => {
  let score = 50; // Base score
  
  // Device bonus (mobile QR scans = higher intent)
  if (metrics.device.type === 'mobile') score += 20;
  if (metrics.device.type === 'tablet') score += 10;
  
  // Browser bonus (modern browsers = tech-savvy users)
  if (['Chrome', 'Safari', 'Edge'].includes(metrics.browser)) score += 10;
  
  // Referrer bonus (direct scan = high intent, no digital intermediary)
  if (metrics.referrer === 'none' || metrics.referrer === 'direct') score += 15;
  
  // Response time penalty (slow load = cognitive friction)
  if (metrics.latency && metrics.latency < 100) score += 5;
  if (metrics.latency && metrics.latency > 500) score -= 10;
  
  return Math.max(0, Math.min(100, score));
};

/**
 * Engagement Level Classification
 * Based on temporal patterns (circadian neuromarketing)
 */
export const classifyEngagement = (timestamp) => {
  const hour = new Date(timestamp).getHours();
  
  // High-engagement hours (decision-making peaks)
  if ((hour >= 9 && hour <= 11) || (hour >= 14 && hour <= 16)) {
    return { level: 'high', reason: 'Peak cognitive performance hours' };
  }
  
  // Medium-engagement hours
  if ((hour >= 7 && hour < 9) || (hour >= 11 && hour < 14) || (hour >= 16 && hour < 20)) {
    return { level: 'medium', reason: 'Normal activity hours' };
  }
  
  // Low-engagement hours (off-peak)
  return { level: 'low', reason: 'Off-peak hours' };
};

/**
 * Scan Context Analysis
 * Infers psychological context from metadata
 */
export const analyzeScanContext = (req) => {
  const userAgent = req.get('user-agent') || 'unknown';
  const referrer = req.get('referer') || 'none';
  const ip = (req.ip || req.connection.remoteAddress || '').replace('::ffff:', '');
  
  const device = detectDevice(userAgent);
  const browser = detectBrowser(userAgent);
  const fingerprint = createFingerprint(ip, userAgent);
  const engagement = classifyEngagement(new Date());
  
  const metrics = {
    device,
    browser,
    referrer: referrer === 'none' ? 'direct' : referrer,
    fingerprint,
    engagement
  };
  
  const qualityScore = calculateQualityScore(metrics);
  
  return {
    ...metrics,
    qualityScore,
    ip, // Include for optional geo-lookup
    userAgent: userAgent.substring(0, 200) // Truncate for storage
  };
};

/**
 * Session Window Detection
 * Groups scans within temporal proximity (viral moment detection)
 */
export const detectSessionWindow = (timestamps, windowMinutes = 15) => {
  if (timestamps.length === 0) return [];
  
  const windows = [];
  let currentWindow = [timestamps[0]];
  
  for (let i = 1; i < timestamps.length; i++) {
    const timeDiff = (timestamps[i] - timestamps[i - 1]) / 1000 / 60; // minutes
    
    if (timeDiff <= windowMinutes) {
      currentWindow.push(timestamps[i]);
    } else {
      windows.push(currentWindow);
      currentWindow = [timestamps[i]];
    }
  }
  
  windows.push(currentWindow);
  return windows.map(w => ({
    start: w[0],
    end: w[w.length - 1],
    scanCount: w.length,
    intensity: w.length / windowMinutes // scans per minute
  }));
};

/**
 * Geographic Inference (from IP - requires external API)
 * Placeholder for future implementation with ipapi.co or similar
 */
export const inferGeography = async (ip) => {
  // Future: Call IP geolocation API
  // For now, return placeholder
  return {
    country: 'Unknown',
    region: 'Unknown',
    city: 'Unknown',
    timezone: 'Unknown'
  };
};

/**
 * Calculate Campaign Velocity
 * Rate of scan acceleration (viral coefficient indicator)
 */
export const calculateVelocity = (scanTimestamps) => {
  if (scanTimestamps.length < 2) return 0;
  
  const recentWindow = scanTimestamps.slice(-10); // Last 10 scans
  const timeSpan = (recentWindow[recentWindow.length - 1] - recentWindow[0]) / 1000 / 60; // minutes
  
  return timeSpan > 0 ? (recentWindow.length / timeSpan) : 0; // scans per minute
};

/**
 * Privacy-Compliant Data Sanitization
 * Removes PII while preserving analytical value
 */
export const sanitizeForStorage = (analyticsData) => {
  return {
    timestamp: analyticsData.timestamp || new Date().toISOString(),
    slug: analyticsData.slug,
    device: analyticsData.device,
    browser: analyticsData.browser,
    engagement: analyticsData.engagement,
    qualityScore: analyticsData.qualityScore,
    fingerprint: analyticsData.fingerprint, // Already hashed
    // IP removed for GDPR compliance (optional: store only country-level geo)
    // UserAgent truncated to prevent fingerprinting
    referrerType: analyticsData.referrer === 'direct' ? 'direct' : 'referral'
  };
};

