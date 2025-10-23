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
  
  // AiPRL Main Website
  'aiprl': process.env.REDIRECT_AIPRL || 
    'https://aiprlassist.com',
  
  // Orbit Games - QR Code Game
  'orbit-games': process.env.REDIRECT_ORBIT_GAMES || 
    'https://app.aiprlassist.com/bots/1453419/176041449991',
  
  // Demo Video
  'demo-video': process.env.REDIRECT_DEMO_VIDEO || 
    'https://aiprlassist.com/demo'
};

/**
 * USAGE:
 * 
 * 1. Generate QR codes pointing to:
 *    - https://qr.aiprlassist.com/r/fb-home-living
 *    - https://qr.aiprlassist.com/r/web-home-living
 *    - https://qr.aiprlassist.com/r/voice-furniture
 *    - https://qr.aiprlassist.com/r/aiprl
 *    - https://qr.aiprlassist.com/r/orbit-games
 *    - https://qr.aiprlassist.com/r/demo-video
 * 
 * 2. To update destinations:
 *    - Option A: Edit this file, commit, push (auto-deploys in ~30 sec)
 *    - Option B: Set environment variables in Railway dashboard (instant)
 * 
 * 3. Environment variables override hardcoded URLs (useful for staging/prod)
 */

