# PWA Icons TODO

## Required Icons

For full PWA support, you need to create the following icon files:

### Required Files:
- `pwa-192x192.png` - 192x192 pixels
- `pwa-512x512.png` - 512x512 pixels

### Optional but Recommended:
- `apple-touch-icon.png` - 180x180 pixels (for iOS)
- `favicon.ico` - 32x32 pixels

## How to Generate

### Option 1: Use Online Tools
- **RealFaviconGenerator**: https://realfavicongenerator.net/
  - Upload your source image
  - Download the complete package
  
- **PWA Builder**: https://www.pwabuilder.com/imageGenerator
  - Generates all PWA icons at once

### Option 2: Manual Creation
Use any image editing tool (Photoshop, GIMP, Figma, etc.) to:
1. Create a square canvas (recommended: 512x512)
2. Design your app icon with the wave/ocean theme
3. Export multiple sizes:
   - 192x192 → `pwa-192x192.png`
   - 512x512 → `pwa-512x512.png`
   - 180x180 → `apple-touch-icon.png`

## Design Recommendations
- Use the ocean blue color scheme (#0ea5e9)
- Include a wave or tide-related symbol
- Keep it simple and recognizable at small sizes
- Ensure good contrast for visibility
- Use transparent or solid background
- Make it square (1:1 aspect ratio)

## Current Icon Sources
- `wave.svg` - Current app icon (can be used as base)
- Theme color: #0ea5e9 (ocean blue)

## Installation Status
Once icons are created:
- ✅ Manifest configured (`public/manifest.json`)
- ✅ Service worker configured (`vite.config.js`)
- ⏳ Icons need to be created and placed in `public/` folder

After adding icons, test the PWA:
1. Build: `npm run build`
2. Preview: `npm run preview`
3. Open in mobile browser
4. Check "Add to Home Screen" works
