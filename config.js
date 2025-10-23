/**
 * QR Code Redirect Configuration
 * 
 * Add/modify redirect mappings here.
 * After changes, commit and push to trigger Railway auto-deploy.
 * 
 * QR codes should encode: https://yourdomain.com/r/{slug}
 * User scans → hits this service → redirects to target URL
 */

export const redirectConfig = {
  // Facebook Home & Living Campaign
  'fb-home-living': process.env.REDIRECT_FB_HOME_LIVING || 
    'https://app.aiprlassist.com/r/1192437/Facebook%20Home%20And%20Living',
  
  // Website Home & Living Campaign
  'web-home-living': process.env.REDIRECT_WEB_HOME_LIVING || 
    'https://app.aiprlassist.com/r/1192437/Website%20Home%20and%20Living',
  
  // Voice Demo - Furniture Campaign
  'voice-furniture': process.env.REDIRECT_VOICE_FURNITURE || 
    'https://app.aiprlassist.com/r/1192437/AiPRL%20Furniture%20Voice%20Demk',
  
  // Reserved for future campaign
  'reserved-1': process.env.REDIRECT_RESERVED_1 || 
    'https://aiprlassist.com'
};

/**
 * USAGE:
 * 
 * 1. Generate QR codes pointing to:
 *    - https://yourdomain.com/r/fb-home-living
 *    - https://yourdomain.com/r/web-home-living
 *    - https://yourdomain.com/r/voice-furniture
 *    - https://yourdomain.com/r/reserved-1
 * 
 * 2. To update destinations:
 *    - Option A: Edit this file, commit, push (auto-deploys)
 *    - Option B: Set environment variables in Railway dashboard
 * 
 * 3. Environment variables override hardcoded URLs (useful for staging/prod)
 */

