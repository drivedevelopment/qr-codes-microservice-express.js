# 🔗 QR Redirect Microservice

Ultra-lightweight Express.js service for dynamic QR code redirects. No database, no UI, just config-driven HTTP 302 redirects.

## 🎯 Problem Solved

**Problem:** Printed QR codes can't be changed once distributed.

**Solution:** QR codes encode a URL to THIS service, which redirects to configurable destinations. Change the destination anytime by updating config and redeploying.

## 🏗️ Architecture

```
┌─────────────┐
│  QR Code    │  Encodes: yourdomain.com/r/fb-home-living
│  (Printed)  │  ← This never changes
└──────┬──────┘
       │ User scans
       ↓
┌─────────────┐
│ This Service│  Reads config → performs 302 redirect
└──────┬──────┘
       │ HTTP 302
       ↓
┌─────────────┐
│ Target URL  │  https://app.aiprlassist.com/...
│ (Changeable)│  ← Update in config.js anytime
└─────────────┘
```

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Run locally
npm run dev

# Test
curl http://localhost:3000/r/fb-home-living
```

### Deploy to Railway

1. **Push to GitHub** (already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit: QR redirect microservice"
   git remote add origin https://github.com/drivedevelopment/qr-codes-microservice-express.js.git
   git branch -M main
   git push -u origin main
   ```

2. **Deploy on Railway**:
   - Go to [railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select `qr-codes-microservice-express.js`
   - Railway auto-detects Node.js and deploys
   - Get your URL: `https://your-service.railway.app`

3. **Configure Custom Domain** (optional):
   - Railway Settings → Domains → Add custom domain
   - Recommended: `qr.aiprlassist.com` or `go.aiprlassist.com`
   - Add CNAME record in your DNS

## 📝 Configuration

### Update Redirect Destinations

**Method 1: Edit config.js** (recommended for permanent changes)

```javascript
export const redirectConfig = {
  'fb-home-living': 'https://new-destination.com',
  // ... other routes
};
```

Then: `git commit -am "Update FB redirect" && git push` (auto-deploys)

**Method 2: Environment Variables** (for staging/prod differences)

In Railway dashboard → Variables:
```
REDIRECT_FB_HOME_LIVING=https://staging.example.com
```

Env vars override config.js values.

### Add New Routes

1. Add to `config.js`:
   ```javascript
   'new-campaign': 'https://target-url.com'
   ```

2. Generate QR code for: `https://yourdomain.com/r/new-campaign`

3. Commit and push

## 🎨 Generate QR Codes

### Option 1: qrserver.com API (Quick & Dirty)

```bash
# Generate 500x500 PNG
https://api.qrserver.com/v1/create-qr-code/?data=https://qr.aiprlassist.com/r/fb-home-living&size=500x500

# Download all 4
curl "https://api.qrserver.com/v1/create-qr-code/?data=https://qr.aiprlassist.com/r/fb-home-living&size=1000x1000" -o fb-home-living.png
curl "https://api.qrserver.com/v1/create-qr-code/?data=https://qr.aiprlassist.com/r/web-home-living&size=1000x1000" -o web-home-living.png
curl "https://api.qrserver.com/v1/create-qr-code/?data=https://qr.aiprlassist.com/r/voice-furniture&size=1000x1000" -o voice-furniture.png
curl "https://api.qrserver.com/v1/create-qr-code/?data=https://qr.aiprlassist.com/r/reserved-1&size=1000x1000" -o reserved-1.png
```

### Option 2: Node.js Script (Local Generation)

```bash
npm install -g qrcode-terminal
qrcode "https://qr.aiprlassist.com/r/fb-home-living" -o fb-home-living.png
```

### Option 3: Online Tools
- [QR Code Generator](https://www.qr-code-generator.com/)
- [QRCode Monkey](https://www.qrcode-monkey.com/) (free, customizable)

## 📊 Analytics

Redirect events are logged to stdout in JSON format:

```json
{
  "timestamp": "2025-10-23T10:30:00.000Z",
  "event": "redirect",
  "slug": "fb-home-living",
  "targetUrl": "https://app.aiprlassist.com/...",
  "userAgent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0...)",
  "ip": "203.0.113.42",
  "referrer": "none"
}
```

View in Railway:
- Dashboard → Deployments → Logs

## 🛠️ API Endpoints

### `GET /`
Health check and service info

**Response:**
```json
{
  "service": "QR Redirect Microservice",
  "status": "operational",
  "version": "1.0.0",
  "routes": ["/r/fb-home-living", "/r/web-home-living", ...]
}
```

### `GET /r/:slug`
Redirect endpoint

**Example:** `GET /r/fb-home-living`

**Response:** HTTP 302 redirect to configured target URL

**404 if slug not found**

## 🔧 Maintenance

### Update a Destination
```bash
# Edit config.js
vim config.js

# Commit and push (triggers auto-deploy)
git add config.js
git commit -m "Update voice-furniture destination"
git push
```

Railway auto-deploys in ~30 seconds.

### Monitor Service
```bash
# Check if running
curl https://your-service.railway.app/

# Test redirect (should return 302)
curl -I https://your-service.railway.app/r/fb-home-living
```

### Rollback
```bash
# Railway dashboard → Deployments → Rollback to previous
# Or via git:
git revert HEAD
git push
```

## 🔒 Security Notes

- ✅ No database = no data breach risk
- ✅ No authentication needed (redirects are intentionally public)
- ✅ CORS enabled for flexibility
- ⚠️ Consider rate limiting if abuse occurs (add `express-rate-limit`)
- ⚠️ Monitor logs for suspicious traffic

## 📦 Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** Express.js (minimal, fast)
- **Dependencies:** 3 (express, dotenv, cors)
- **Size:** <1MB total
- **Memory:** ~50MB RAM
- **Response Time:** <100ms

## 💰 Cost Estimate

**Railway Free Tier:**
- $5 credit/month
- This service uses ~$0.50-1/month
- Plenty of room for other services

**Paid:** $5/month for stable uptime

## 🐛 Troubleshooting

**QR code not redirecting:**
1. Check service is running: `curl https://your-service.railway.app/`
2. Verify slug exists in config.js
3. Check Railway logs for errors

**Redirect goes to wrong URL:**
1. Check config.js for typos
2. Verify environment variables in Railway dashboard
3. Check recent commits (`git log`)

**Slow redirects:**
1. Check Railway region (should be close to users)
2. Monitor response times in logs
3. Consider upgrading Railway plan

## 📄 License

MIT

---

**Built for AiPRL Marketing Operations**  
Dynamic QR redirects without the bloat 🚀

