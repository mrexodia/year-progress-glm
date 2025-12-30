# Technical Documentation

## Project Overview

**Year Progress** is a Progressive Web App (PWA) that visualizes the year as a grid of dots, allowing users to mark days with colors, emojis, and notes.

## Technology Stack

- **Frontend**: Pure HTML, CSS, JavaScript (no framework dependencies)
- **Storage**: localStorage for data persistence
- **PWA Features**: Service Worker for offline capability, Web App Manifest
- **Styling**: CSS Variables for theming, mobile-first responsive design
- **Icons**: SVG source, converted to PNG for PWA compatibility

## File Structure

```
/
├── index.html          # Main application HTML
├── styles.css          # All styles and theme definitions
├── app.js              # Application logic
├── sw.js               # Service Worker for offline support
├── manifest.json       # PWA manifest
├── icons/              # App icons in various sizes
│   ├── icon.svg        # Source SVG icon
│   ├── icon-72x72.png
│   ├── icon-96x96.png
│   ├── icon-128x128.png
│   ├── icon-144x144.png
│   ├── icon-152x152.png
│   ├── icon-192x192.png
│   ├── icon-384x384.png
│   ├── icon-512x512.png
│   └── favicon.png
├── VISION.md           # Design vision and aesthetic guidelines
├── PLAN.md             # Implementation plan
├── TECHNICAL.md        # This file
└── AGENTS.md           # Agent workflow guidelines
```

## Data Schema

### localStorage Structure

```javascript
{
  year: 2026,
  marks: {
    "2026-01-15": {
      color: "#FFB7C5",
      emoji: "❤️",
      note: "Great day!"
    },
    "2026-01-16": {
      color: "#98E4C9"
    }
    // ... more dates
  },
  theme: "sakura",
  lastUpdated: "2026-01-15T10:30:00Z"
}
```

### Backup File Format

```json
{
  "version": "1.0",
  "year": 2026,
  "marks": { /* same as above */ },
  "theme": "sakura",
  "exportedAt": "2026-01-15T10:30:00Z"
}
```

## Core Functions

### Date Calculations

- **isLeapYear(year)**: Determines if a year has 366 days
- **getDayOfYear(date)**: Returns the day number (1-365/366)
- **formatDate(dayOfYear)**: Converts day number to readable date
- **getDateKey(dayOfYear)**: Returns ISO date string for storage

### Grid Rendering

The grid displays days in 53 columns (approximately 7 rows per week for 52 weeks):
- Each dot represents one day
- Columns: 53 (full weeks + overflow)
- Rows: Auto-generated based on days in year
- Touch targets: 10px minimum, with hover state

### Theme System

Themes are implemented using CSS custom properties:

```css
:root {
  --bg-color: #FFF8F0;
  --primary-color: #FFB7C5;
  --text-color: #5C5555;
  /* ... more variables */
}

[data-theme="mint"] {
  --bg-color: #F0FFF4;
  --primary-color: #98E4C9;
  /* ... overrides */
}
```

### Service Worker Strategy

- **Cache-first**: Serve from cache, fall back to network
- **Cache versioning**: Use `CACHE_NAME` to manage updates
- **Asset caching**: All core files cached on install
- **Update strategy**: New version on next visit after update

## Performance Considerations

1. **Minimal dependencies**: No external libraries or frameworks
2. **CSS animations**: Hardware-accelerated transforms
3. **Reduced motion support**: Respects `prefers-reduced-motion`
4. **Efficient rendering**: Single render pass for grid
5. **LocalStorage**: Fast, synchronous data access

## Browser Compatibility

### Minimum Requirements
- Modern browser with ES6 support
- localStorage capability
- Service Worker support (for PWA features)

### Tested Platforms
- iOS Safari 12+ (Add to Home Screen)
- Chrome/Edge (Android & Desktop)
- Firefox (Desktop)

### Known Limitations
- Service Workers not supported on iOS < 11.3
- localStorage limited to ~5-10MB
- No sync across devices (by design)

## Security & Privacy

- **No tracking**: No analytics or third-party services
- **Local-only**: All data stored on device
- **No server**: No backend dependencies
- **Backup files**: User-controlled export/import

## Deployment

### Static Hosting Options

The app can be deployed to any static hosting service:

1. **Netlify**: Drag and drop the folder
2. **GitHub Pages**: Push to gh-pages branch
3. **Vercel**: Connect git repository
4. **Any web server**: Copy files to web root

### Build Process

No build step required. The app is ready to deploy as-is.

For production:
1. Ensure all files are in the web root
2. Test manifest.json is accessible
3. Verify service worker registers
4. Test on target devices

## Testing Checklist

- [ ] Grid displays correctly for current year
- [ ] Tap on day opens popup
- [ ] Color selection works
- [ ] Emoji selection works
- [ ] Notes save and display
- [ ] Data persists after refresh
- [ ] Export creates valid JSON
- [ ] Import restores data correctly
- [ ] Theme switching works
- [ ] Service Worker caches assets
- [ ] App works offline
- [ ] Installable on iOS (Add to Home Screen)
- [ ] Installable on Android

## Future Enhancements

Possible additions for future versions:

1. **Multiple years**: Track previous years
2. **Year rollover**: Automatic archive on Jan 1
3. **Haptic feedback**: On supported devices
4. **Widget support**: Home screen widget
5. **More themes**: Community themes
6. **Custom colors**: User-defined palettes
7. **Search/filter**: Find marked days
8. **Statistics**: Summary of year

## Maintenance

### Regular Tasks
- Update year display automatically on Jan 1
- Refresh icons if design changes
- Test on new OS versions

### Updates
To update the app:
1. Modify files
2. Update `CACHE_NAME` in sw.js
3. Deploy new version
4. Service Worker will update on next visit

## Support

For issues or questions:
- Check browser console for errors
- Verify localStorage is enabled
- Test in incognito/private mode
- Check Service Worker registration

---

*Built with care for a beautiful year ahead.* ✨
