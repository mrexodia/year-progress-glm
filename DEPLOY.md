# Deployment Guide

## Quick Deploy Options

### Option 1: Netlify (Easiest)
1. Go to [netlify.com](https://netlify.com)
2. Drag and drop this entire folder onto the page
3. Your app will be live in seconds!

### Option 2: GitHub Pages
1. Push to your GitHub repository
2. Go to Settings → Pages
3. Select "master" branch
4. Your app will be at `yourusername.github.io/repo-name`

### Option 3: Vercel
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Vercel will detect it's a static site
4. Deploy!

### Option 4: Any Web Server
Upload all files to any web server. That's it!

## Pre-Deployment Checklist

- [ ] All files are in the web root folder
- [ ] manifest.json is accessible
- [ ] sw.js is in the root
- [ ] Icons folder is uploaded
- [ ] Test on mobile browser
- [ ] Test "Add to Home Screen"

## Testing Your Deployed App

1. **Open on phone**: Navigate to your URL
2. **Test PWA installation**:
   - iOS: Tap Share → Add to Home Screen
   - Android: Wait for install banner or tap menu → Install
3. **Test offline**: Turn off wifi/data, reload app
4. **Test features**: Mark a day, add a note, export data

## URLs for Family

Share these instructions with family:

### iPhone/iPad
1. Open Safari and go to: [YOUR URL]
2. Tap the Share button (square with arrow)
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add" in top right
5. Look for the "Year" icon on your home screen!

### Android
1. Open Chrome and go to: [YOUR URL]
2. You'll see a popup "Add to Home Screen" - tap "Add"
3. Or tap the menu (three dots) → "Install app" or "Add to Home Screen"
4. Look for the "Year" icon on your home screen!

### Desktop
Just visit the URL in any browser. The app works there too!

## Updates

To update the app:
1. Make changes to files
2. Upload/deploy new version
3. Users get the update on their next visit

The service worker will automatically cache the new version.

## Customization

Want to customize for yourself?
- Edit colors in `styles.css` under `:root`
- Change emojis in `app.js` `emojis` array
- Modify themes in `app.js` `themes` object

---

That's it! Your beautiful Year Progress app is ready to share. 🎉
