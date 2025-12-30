# PLAN.md

> Detailed implementation plan for Year Progress PWA. Follow this step-by-step.

---

## Overview

**What we're building:** A beautiful PWA that visualizes the year as a grid of dots, where users can mark days with colors, emojis, and notes.

**Timeline:** Must be complete before January 1, 2026

**Approach:** Build incrementally, showing working demos at each milestone.

---

## Phase 1: Foundation
**Goal:** A working PWA shell with the year grid displaying correctly

### Task 1.1: Project Setup
- [ ] Create basic HTML file with proper meta tags for mobile
- [ ] Set up viewport and prevent zoom issues on mobile
- [ ] Add manifest.json for PWA installation
- [ ] Create service worker for offline functionality
- [ ] Add apple-touch-icon and favicon

**Files to create:**
```
index.html
manifest.json
sw.js (service worker)
styles.css
app.js
icons/ (folder with app icons in multiple sizes)
```

### Task 1.2: Basic Year Grid
- [ ] Calculate days in current year (handle leap years)
- [ ] Determine what day of the year today is
- [ ] Render 365/366 dots in a grid layout
- [ ] 7 columns (one week per row)
- [ ] Style dots: filled for past, empty for future
- [ ] Highlight current day

**Visual milestone:** User sees a grid of dots showing year progress

### Task 1.3: Progress Display
- [ ] Show year at top (e.g., "2025" or "2026")
- [ ] Calculate and display days remaining
- [ ] Calculate and display percentage complete
- [ ] Style with chosen typography

**Visual milestone:** User sees "X days left · Y%" below the grid

### Task 1.4: Basic Styling (Default Theme)
- [ ] Implement Sakura theme as default
- [ ] Soft cream background
- [ ] Pink filled dots
- [ ] Light pink empty dots
- [ ] Gentle glow on current day
- [ ] Rounded, friendly typography
- [ ] Mobile-optimized spacing

**Visual milestone:** App looks cute and on-brand (not developer-ugly)

---

## Phase 2: Interaction
**Goal:** Users can tap days and mark them with colors or emojis

### Task 2.1: Day Tap Detection
- [ ] Make each dot tappable with appropriate touch target size
- [ ] Detect which day was tapped
- [ ] Show visual feedback on tap (subtle bounce/highlight)

### Task 2.2: Marking Popup
- [ ] Create a small, cute popup that appears when day is tapped
- [ ] Show the date in friendly format ("January 15" not "2026-01-15")
- [ ] Display color palette options (6-8 curated colors that match theme)
- [ ] Display emoji options (10-15 relevant emojis: ❤️ 😊 ⭐ 🎉 😢 🌟 💪 🌸 ☀️ 🌙 etc.)
- [ ] "Clear" option to remove marking
- [ ] Close popup when tapping outside

**Visual milestone:** Tapping a dot opens a cute popup with options

### Task 2.3: Apply Markings
- [ ] When user selects color: fill that dot with chosen color
- [ ] When user selects emoji: show emoji on/near that dot
- [ ] Visual transition should feel satisfying
- [ ] Close popup after selection

**Visual milestone:** Days can be marked and the marks persist visually

### Task 2.4: Add Notes
- [ ] Add small "note" icon or "+" in the popup
- [ ] Tapping opens a text input overlay
- [ ] Simple, clean note input with character limit (280 chars?)
- [ ] Save and close buttons
- [ ] Days with notes get a subtle indicator (small dot or corner mark)

**Visual milestone:** Users can add notes to days

### Task 2.5: View Existing Marks
- [ ] Tapping an already-marked day shows existing color/emoji selected
- [ ] If day has a note, show it in the popup
- [ ] Allow editing/changing the mark
- [ ] Allow deleting the mark

**Visual milestone:** Users can review and edit their marked days

---

## Phase 3: Data Persistence
**Goal:** All data survives closing the app

### Task 3.1: Local Storage
- [ ] Define data structure for storing day marks
```javascript
{
  year: 2026,
  days: {
    "2026-01-15": { color: "#FFB7C5", emoji: "❤️", note: "Great day!" },
    "2026-01-16": { color: "#98E4C9" },
    // ...
  },
  theme: "sakura",
  lastUpdated: "2026-01-15T10:30:00Z"
}
```
- [ ] Save to localStorage on every change
- [ ] Load from localStorage on app open
- [ ] Handle gracefully if localStorage is unavailable

### Task 3.2: Export/Backup
- [ ] Add settings/menu icon (subtle, corner of screen)
- [ ] "Download Backup" option
- [ ] Export as JSON file with friendly filename (year-progress-backup-2026.json)
- [ ] Include all day marks, notes, and settings

### Task 3.3: Import/Restore
- [ ] "Restore from Backup" option
- [ ] File picker to select JSON backup
- [ ] Validate file before importing
- [ ] Confirm before overwriting existing data
- [ ] Success/error feedback

**Visual milestone:** Users can backup and restore their data

---

## Phase 4: Themes
**Goal:** Multiple theme options that users can switch between

### Task 4.1: Theme System
- [ ] Create CSS variables for all theme colors
- [ ] Define 4 complete themes (from VISION.md):
  - Sakura (pink/cream) — default
  - Mint Dream (mint/teal)
  - Lavender Haze (purple/pink)
  - Honey Morning (peach/gold)
- [ ] Smooth transition when changing themes

### Task 4.2: Theme Picker
- [ ] Add theme option in settings menu
- [ ] Show visual preview of each theme (small colored circles or mini-grid)
- [ ] Tapping a theme applies it immediately
- [ ] Save theme preference to localStorage

**Visual milestone:** Users can switch between 4 beautiful themes

---

## Phase 5: Polish & Delight
**Goal:** Small touches that make the app feel special

### Task 5.1: Animations
- [ ] Gentle fade-in when app loads
- [ ] Subtle bounce on dot tap
- [ ] Smooth popup appear/disappear
- [ ] Progress bar animation on load
- [ ] Respect "prefers-reduced-motion" setting

### Task 5.2: Current Day Enhancement
- [ ] Gentle pulsing glow on today's dot
- [ ] Or subtle ring/highlight
- [ ] Should draw eye without being distracting

### Task 5.3: Month Indicators
- [ ] Subtle visual separation between months
- [ ] Consider small month labels on the side or light divider lines
- [ ] Keep it minimal — shouldn't clutter the grid

### Task 5.4: Empty State Polish
- [ ] If no days marked yet, show gentle invitation text
- [ ] Start-of-year messaging vs. mid-year messaging
- [ ] End-of-year celebration/reflection prompt

### Task 5.5: Error Handling
- [ ] Friendly error messages (no technical jargon)
- [ ] Graceful handling of storage full
- [ ] Graceful handling of corrupted data (offer to reset)

---

## Phase 6: PWA Finalization
**Goal:** Fully installable and works offline

### Task 6.1: Manifest Polish
- [ ] App name: "Year Progress"
- [ ] Short name: "Year"
- [ ] Description
- [ ] Theme color matching default theme
- [ ] Background color matching default theme
- [ ] Display: standalone
- [ ] Orientation: portrait

### Task 6.2: Icons
- [ ] Create app icon (cute, simple, recognizable)
- [ ] Generate all required sizes (192x192, 512x512, etc.)
- [ ] Apple touch icons
- [ ] Favicon

### Task 6.3: Service Worker
- [ ] Cache all app assets
- [ ] Offline functionality
- [ ] Cache update strategy

### Task 6.4: Install Experience
- [ ] Works on iOS Safari "Add to Home Screen"
- [ ] Works on Android Chrome install prompt
- [ ] App opens full-screen without browser chrome

---

## Phase 7: Testing & Launch
**Goal:** Ready for New Year

### Task 7.1: Device Testing
- [ ] Test on iPhone (various sizes)
- [ ] Test on Android phone
- [ ] Test on iPad/tablet
- [ ] Test adding to home screen on each platform
- [ ] Test offline functionality

### Task 7.2: Scenario Testing
- [ ] New user first open
- [ ] Marking many days quickly
- [ ] Adding long notes
- [ ] Switching themes
- [ ] Exporting data
- [ ] Importing data
- [ ] Year rollover (what happens on Jan 1?)

### Task 7.3: Final Polish
- [ ] Performance check (should feel instant)
- [ ] Visual polish pass
- [ ] Fix any discovered issues

### Task 7.4: Launch
- [ ] Deploy to hosting (Netlify, Vercel, or GitHub Pages)
- [ ] Test production URL
- [ ] Share with family for installation

---

## Milestone Checkpoints

Show the user working demos at these points:

1. **After Phase 1:** "Here's your year as dots! You can see the year's progress."
2. **After Phase 2:** "You can now tap any day and mark it with colors or emoji!"
3. **After Phase 3:** "Your data is saved — and you can download a backup anytime."
4. **After Phase 4:** "Pick your favorite theme! Here are 4 options."
5. **After Phase 5:** "Added some polish — notice the subtle animations!"
6. **After Phase 6:** "Try adding it to your home screen — it works like a real app now!"
7. **After Phase 7:** "All done! Ready for the new year. 🎉"

---

## Technical Notes (for TECHNICAL.md)

Document these decisions as you build:
- Final technology choices
- File structure
- Data schema
- Any third-party dependencies
- Hosting setup
- Browser compatibility notes
- Known limitations

---

## Success Criteria Checklist

Before calling it done:

- [ ] App loads in under 2 seconds
- [ ] Grid displays correctly with year progress
- [ ] Can mark any day with color or emoji
- [ ] Can add notes to days
- [ ] All data persists between sessions
- [ ] Can export backup file
- [ ] Can import backup file
- [ ] 4 themes available and switching works
- [ ] Works offline after first load
- [ ] Installable on iOS home screen
- [ ] Installable on Android home screen
- [ ] Looks beautiful and sparks joy ✨
- [ ] Family can install and use independently

---

*Let's build something beautiful!* 🌸
