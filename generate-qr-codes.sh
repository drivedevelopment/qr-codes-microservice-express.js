#!/bin/bash

# QR Code Generator Script
# Downloads QR codes from qrserver.com API
# Replace YOUR_DOMAIN with your actual Railway deployment URL

DOMAIN="https://YOUR_DOMAIN.railway.app"  # Update after Railway deployment
SIZE="1000x1000"  # High resolution for print

echo "🎨 Generating QR codes..."
echo "📍 Domain: $DOMAIN"
echo ""

# Create output directory
mkdir -p qr-codes

# Generate QR codes
curl -s "https://api.qrserver.com/v1/create-qr-code/?data=${DOMAIN}/r/fb-home-living&size=${SIZE}" -o qr-codes/fb-home-living.png
echo "✅ fb-home-living.png"

curl -s "https://api.qrserver.com/v1/create-qr-code/?data=${DOMAIN}/r/web-home-living&size=${SIZE}" -o qr-codes/web-home-living.png
echo "✅ web-home-living.png"

curl -s "https://api.qrserver.com/v1/create-qr-code/?data=${DOMAIN}/r/voice-furniture&size=${SIZE}" -o qr-codes/voice-furniture.png
echo "✅ voice-furniture.png"

curl -s "https://api.qrserver.com/v1/create-qr-code/?data=${DOMAIN}/r/reserved-1&size=${SIZE}" -o qr-codes/reserved-1.png
echo "✅ reserved-1.png"

echo ""
echo "🎉 Done! QR codes saved in ./qr-codes/"
echo ""
echo "📋 Next steps:"
echo "1. Test QR codes with your phone"
echo "2. Print or distribute"
echo "3. Update destinations in config.js anytime"

