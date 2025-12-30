// ===== Year Progress App =====

(function() {
    'use strict';

    // ===== State =====
    const state = {
        year: new Date().getFullYear(),
        daysInYear: 0,
        today: 0,
        marks: {},
        theme: 'lavender',
        currentDay: null,
        selectedYear: new Date().getFullYear(),
        customEmojis: '' // User's custom emojis (empty = use defaults)
    };

    // Default emoji set
    const defaultEmojis = '❤️ 😊 ⭐ 🎉 😢 🌟 💪 🌸 ☀️ 🌙 ✨ 🎂 🏖️ ❄️ 🍂';

    // ===== Themes =====
    const themes = {
        sakura: {
            name: 'Sakura',
            preview: ['#FFB7C5', '#E8D5E7', '#FFCCB3']
        },
        mint: {
            name: 'Mint Dream',
            preview: ['#98E4C9', '#C5E8F7', '#A8E6CF']
        },
        lavender: {
            name: 'Lavender Haze',
            preview: ['#C9B1FF', '#FFD6E8', '#D4B5FF']
        },
        honey: {
            name: 'Honey Morning',
            preview: ['#FFCCB3', '#FFF2C9', '#FFD9A0']
        }
    };

    const colors = [
        '#FFB7C5', // Pink
        '#98E4C9', // Mint
        '#C9B1FF', // Lavender
        '#FFCCB3', // Peach
        '#FFD6E8', // Light Pink
        '#C5E8F7', // Sky
        '#FFF2C9', // Yellow
        '#E8D5E7'  // Pale Purple
    ];

    const emojis = ['❤️', '😊', '⭐', '🎉', '😢', '🌟', '💪', '🌸', '☀️', '🌙', '✨', '🎂', '🏖️', '❄️', '🍂'];

    // ===== DOM Elements =====
    let elements = {
        yearSelect: null // Will be cached
    };

    // ===== Utility Functions =====
    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    }

    function getDayOfYear(date) {
        const start = new Date(date.getFullYear(), 0, 0);
        const diff = date - start;
        const oneDay = 1000 * 60 * 60 * 24;
        return Math.floor(diff / oneDay);
    }

    function formatDate(dayOfYear) {
        const date = new Date(state.year, 0, dayOfYear);
        const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
        const dateStr = date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
        return `${weekday}, ${dateStr}`;
    }

    function getDateKey(dayOfYear) {
        const date = new Date(state.year, 0, dayOfYear);
        return date.toISOString().split('T')[0];
    }

    // ===== Storage Functions =====
    function saveState() {
        try {
            const data = {
                year: state.year,
                selectedYear: state.selectedYear,
                marks: state.marks,
                theme: state.theme,
                customEmojis: state.customEmojis,
                lastUpdated: new Date().toISOString()
            };
            localStorage.setItem('yearProgressData', JSON.stringify(data));
        } catch (e) {
            console.error('Failed to save:', e);
        }
    }

    function loadState() {
        try {
            const saved = localStorage.getItem('yearProgressData');
            if (saved) {
                const data = JSON.parse(saved);
                state.marks = data.marks || {};
                state.theme = data.theme || 'lavender';
                state.selectedYear = data.selectedYear || new Date().getFullYear();
                state.customEmojis = data.customEmojis || '';
            }
        } catch (e) {
            console.error('Failed to load:', e);
        }
    }

    function exportData() {
        try {
            const data = {
                version: '1.0',
                year: state.year,
                marks: state.marks,
                theme: state.theme,
                exportedAt: new Date().toISOString()
            };
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `year-progress-backup-${state.year}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (e) {
            console.error('Export failed:', e);
            alert('Failed to export data. Please try again.');
        }
    }

    function importData(file) {
        try {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const data = JSON.parse(e.target.result);
                    
                    // Validate data structure
                    if (!data.marks || typeof data.marks !== 'object') {
                        throw new Error('Invalid backup file');
                    }

                    // Confirm before overwriting
                    const hasMarks = Object.keys(state.marks).length > 0;
                    if (hasMarks && !confirm('This will replace your current data. Continue?')) {
                        return;
                    }

                    state.marks = data.marks || {};
                    if (data.theme) {
                        state.theme = data.theme;
                        applyTheme(state.theme);
                    }
                    
                    saveState();
                    renderGrid();
                    closeSettings();
                    alert('Backup restored successfully!');
                } catch (err) {
                    console.error('Import failed:', err);
                    alert('Failed to restore backup. The file may be corrupted.');
                }
            };
            reader.readAsText(file);
        } catch (e) {
            console.error('Import failed:', e);
            alert('Failed to read file. Please try again.');
        }
    }

    // ===== Theme Functions =====
    function applyTheme(themeName) {
        document.body.setAttribute('data-theme', themeName === 'sakura' ? '' : themeName);
        state.theme = themeName;

        // Update theme picker UI
        document.querySelectorAll('.theme-option').forEach(el => {
            el.classList.toggle('selected', el.dataset.theme === themeName);
        });

        // Update meta theme color for PWA
        const themeColors = {
            sakura: '#FFF8F0',
            mint: '#F0FFF4',
            lavender: '#F8F4FF',
            honey: '#FFFBF0'
        };
        const themeColor = themeColors[themeName];

        // Update all theme color meta tags
        const themeColorMeta = document.querySelector('meta[name="theme-color"]');
        if (themeColorMeta) {
            themeColorMeta.setAttribute('content', themeColor);
        }

        const appleStatusBarMeta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
        if (appleStatusBarMeta) {
            appleStatusBarMeta.setAttribute('content', themeColor);
        }
    }

    function renderThemeOptions() {
        const container = elements.themeOptions;
        container.innerHTML = '';
        
        Object.entries(themes).forEach(([key, theme]) => {
            const option = document.createElement('div');
            option.className = `theme-option ${state.theme === key ? 'selected' : ''}`;
            option.dataset.theme = key;
            option.innerHTML = `
                <div class="theme-name">${theme.name}</div>
                <div class="theme-preview">
                    ${theme.preview.map(color => `<div class="theme-preview-dot" style="background: ${color}"></div>`).join('')}
                </div>
            `;
            option.addEventListener('click', () => {
                applyTheme(key);
                saveState();
            });
            container.appendChild(option);
        });
    }

    // ===== Grid Functions =====
    function renderGrid() {
        const grid = elements.yearGrid;
        grid.innerHTML = '';

        // Use selected year for display
        state.year = state.selectedYear;
        state.daysInYear = isLeapYear(state.year) ? 366 : 365;

        // Calculate today's position relative to selected year
        const now = new Date();
        const currentYear = now.getFullYear();
        const today = getDayOfYear(now);

        // If viewing current year, show actual today. Otherwise, all days are "future"
        if (state.year === currentYear) {
            state.today = today;
        } else if (state.year < currentYear) {
            // Past year - all days are passed
            state.today = state.daysInYear + 1;
        } else {
            // Future year - no days passed yet
            state.today = 0;
        }

        elements.yearTitle.textContent = state.year;
        updateProgress();

        // Scroll to current day after rendering (only for current year)
        if (state.year === currentYear) {
            setTimeout(() => scrollToToday(), 100);
        }

        let currentMonth = -1;
        let monthSection = null;
        let monthGrid = null;

        for (let day = 1; day <= state.daysInYear; day++) {
            const date = new Date(state.year, 0, day);
            const month = date.getMonth();

            // Create new month section
            if (month !== currentMonth) {
                monthSection = document.createElement('div');
                monthSection.className = 'month-section';

                // Create month header
                const monthHeader = document.createElement('div');
                monthHeader.className = 'month-header';

                const monthLabel = document.createElement('div');
                monthLabel.className = 'month-label-inline';
                monthLabel.textContent = date.toLocaleDateString('en-US', { month: 'long' });
                monthHeader.appendChild(monthLabel);

                const monthBreak = document.createElement('div');
                monthBreak.className = 'month-break';
                monthHeader.appendChild(monthBreak);

                monthSection.appendChild(monthHeader);

                // Create month grid
                monthGrid = document.createElement('div');
                monthGrid.className = 'month-grid';
                monthSection.appendChild(monthGrid);

                grid.appendChild(monthSection);
                currentMonth = month;
            }

            // Create day dot
            const dot = document.createElement('div');
            dot.className = 'day-dot';
            dot.dataset.day = day;

            // Add weekend class for Saturday (6) and Sunday (0)
            const dayOfWeek = date.getDay();
            if (dayOfWeek === 0 || dayOfWeek === 6) {
                dot.classList.add('weekend');
            }

            const dateKey = getDateKey(day);

            if (day < state.today) {
                dot.classList.add('past');
            } else if (day === state.today) {
                dot.classList.add('today');
            }

            // Apply marks
            if (state.marks[dateKey]) {
                const mark = state.marks[dateKey];
                dot.classList.add('marked');
                if (mark.color) {
                    dot.style.setProperty('--marked-color', mark.color);
                }
                if (mark.emoji) {
                    dot.style.setProperty('--marked-emoji', `"${mark.emoji}"`);
                }
                if (mark.note) {
                    dot.classList.add('has-note');
                }
            }

            dot.addEventListener('click', () => openDayPopup(day));
            monthGrid.appendChild(dot);
        }

        updateEmptyState();
    }

    function updateProgress() {
        const daysPassed = state.today - 1;
        const daysRemaining = state.daysInYear - state.today + 1;
        const percentage = ((daysPassed / state.daysInYear) * 100).toFixed(1);

        elements.progressText.innerHTML = `<span class="days-highlight">${daysRemaining} days left</span> · ${percentage}%`;
        elements.progressBar.style.width = `${percentage}%`;
    }

    function updateEmptyState() {
        const hasMarks = Object.keys(state.marks).some(key => {
            const mark = state.marks[key];
            return mark && (mark.color || mark.emoji || mark.note);
        });
        elements.emptyState.style.display = hasMarks ? 'none' : 'block';
    }

    function scrollToToday() {
        const todayDot = document.querySelector('.day-dot.today');
        if (todayDot) {
            todayDot.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    // ===== Popup Functions =====
    // Visual Viewport handling for iOS keyboard
    let scrollY = 0;

    function adjustForKeyboard() {
        if (window.visualViewport && elements.popup.classList.contains('active')) {
            const viewportHeight = window.visualViewport.height;
            elements.popup.style.maxHeight = `${viewportHeight * 0.85}px`;

            // Scroll focused input into view if needed
            const activeEl = document.activeElement;
            if (activeEl && (activeEl.tagName === 'TEXTAREA' || activeEl.tagName === 'INPUT')) {
                activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }

    function openDayPopup(day) {
        state.currentDay = day;
        const dateKey = getDateKey(day);
        const mark = state.marks[dateKey] || {};

        elements.popupDate.textContent = formatDate(day);
        elements.noteInput.value = mark.note || '';
        elements.hasNoteIndicator.style.display = mark.note ? 'inline' : 'none';

        // Render color options
        renderColorOptions(mark.color);

        // Render emoji options
        renderEmojiOptions(mark.emoji);

        // Lock body scroll - save position first
        scrollY = window.scrollY;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';
        document.body.style.overflow = 'hidden';

        // Show popup
        elements.popupOverlay.classList.add('active');
        elements.popup.classList.add('active');

        // Adjust for keyboard
        adjustForKeyboard();
    }

    function closeDayPopup() {
        // Hide popup
        elements.popupOverlay.classList.remove('active');
        elements.popup.classList.remove('active');

        // Restore body scroll
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);

        state.currentDay = null;
    }

    function handleViewportResize() {
        adjustForKeyboard();
    }

    function renderColorOptions(selectedColor) {
        const container = elements.colorOptions;
        container.innerHTML = '';

        colors.forEach(color => {
            const option = document.createElement('div');
            option.className = `color-option ${selectedColor === color ? 'selected' : ''}`;
            option.style.background = color;
            option.dataset.color = color;
            option.addEventListener('click', () => {
                // Check if this option is currently selected by looking at the class
                const isCurrentlySelected = option.classList.contains('selected');

                if (isCurrentlySelected) {
                    // Deselect - remove all selections
                    container.querySelectorAll('.color-option').forEach(el => el.classList.remove('selected'));
                } else {
                    // Select this color, deselect others
                    container.querySelectorAll('.color-option').forEach(el => el.classList.remove('selected'));
                    option.classList.add('selected');
                }
                instantSave();
            });
            container.appendChild(option);
        });
    }

    function getEmojis() {
        // Use custom emojis if set, otherwise use defaults
        if (state.customEmojis && state.customEmojis.trim()) {
            return state.customEmojis.trim().split(/\s+/).filter(e => e.length > 0);
        }
        return defaultEmojis.split(/\s+/).filter(e => e.length > 0);
    }

    function renderEmojiOptions(selectedEmoji) {
        const container = elements.emojiOptions;
        container.innerHTML = '';

        const emojiList = getEmojis();

        emojiList.forEach(emoji => {
            const option = document.createElement('div');
            option.className = `emoji-option ${selectedEmoji === emoji ? 'selected' : ''}`;
            option.textContent = emoji;
            option.dataset.emoji = emoji;
            option.addEventListener('click', () => {
                // Check if this option is currently selected by looking at the class
                const isCurrentlySelected = option.classList.contains('selected');

                if (isCurrentlySelected) {
                    // Deselect - remove all selections
                    container.querySelectorAll('.emoji-option').forEach(el => el.classList.remove('selected'));
                } else {
                    // Select this emoji, deselect others
                    container.querySelectorAll('.emoji-option').forEach(el => el.classList.remove('selected'));
                    option.classList.add('selected');
                }
                instantSave();
            });
            container.appendChild(option);
        });
    }

    function instantSave() {
        if (!state.currentDay) return;

        const dateKey = getDateKey(state.currentDay);
        const selectedColor = elements.colorOptions.querySelector('.color-option.selected');
        const selectedEmoji = elements.emojiOptions.querySelector('.emoji-option.selected');
        const noteValue = elements.noteInput.value.trim();

        // Build mark object
        const mark = {};

        if (selectedColor) {
            mark.color = selectedColor.dataset.color;
        }
        if (selectedEmoji) {
            mark.emoji = selectedEmoji.dataset.emoji;
        }
        if (noteValue) {
            mark.note = noteValue;
        }

        // Debug: log what we're saving
        console.log('Saving mark for day', state.currentDay, ':', mark);

        // Remove entry if completely empty
        if (!mark.color && !mark.emoji && !mark.note) {
            delete state.marks[dateKey];
        } else {
            state.marks[dateKey] = mark;
        }

        saveState();
        updateCurrentDayDot();

        // Update note indicator
        elements.hasNoteIndicator.style.display = mark.note ? 'inline' : 'none';
    }

    function updateCurrentDayDot() {
        if (!state.currentDay) return;

        const dateKey = getDateKey(state.currentDay);
        const dot = document.querySelector(`.day-dot[data-day="${state.currentDay}"]`);

        if (!dot) return;

        // Clear existing mark styles
        dot.classList.remove('marked', 'has-note');
        dot.style.removeProperty('--marked-color');
        dot.style.removeProperty('--marked-emoji');

        // Apply new mark
        const mark = state.marks[dateKey];
        if (mark) {
            if (mark.color || mark.emoji || mark.note) {
                dot.classList.add('marked');
                if (mark.color) {
                    dot.style.setProperty('--marked-color', mark.color);
                }
                if (mark.emoji) {
                    dot.style.setProperty('--marked-emoji', `"${mark.emoji}"`);
                }
                if (mark.note) {
                    dot.classList.add('has-note');
                }
            }
        }
    }

    // Note: clearMark is no longer needed since tapping again clears selection
    // Kept for reference but not used
    function clearMark() {
        if (!state.currentDay) return;

        const dateKey = getDateKey(state.currentDay);
        delete state.marks[dateKey];

        saveState();

        // Clear selections
        elements.colorOptions.querySelectorAll('.color-option').forEach(el => el.classList.remove('selected'));
        elements.emojiOptions.querySelectorAll('.emoji-option').forEach(el => el.classList.remove('selected'));
        elements.noteInput.value = '';
        elements.hasNoteIndicator.style.display = 'none';

        updateCurrentDayDot();
    }

    // ===== Settings Functions =====
    function openSettings() {
        elements.settingsOverlay.classList.add('active');
        elements.settingsPanel.classList.add('active');
        renderThemeOptions();
        renderYearButtons();

        // Set custom emoji input value - show defaults if empty
        elements.emojiInput.value = state.customEmojis || defaultEmojis;
    }

    function closeSettings() {
        // If emoji input is empty, reset to defaults
        if (!elements.emojiInput.value.trim()) {
            state.customEmojis = '';
            saveState();
        }

        elements.settingsOverlay.classList.remove('active');
        elements.settingsPanel.classList.remove('active');
    }

    function renderYearButtons() {
        const currentYear = new Date().getFullYear();
        elements.yearButtons.innerHTML = '';

        // Add current year and two past years
        for (let i = 0; i < 3; i++) {
            const year = currentYear - i;
            const button = document.createElement('button');
            button.className = `year-button ${state.selectedYear === year ? 'active' : ''}`;
            button.textContent = year.toString();
            button.dataset.year = year;
            button.addEventListener('click', () => {
                state.selectedYear = year;
                saveState();
                renderGrid();
                renderYearButtons(); // Re-render to update active state
            });
            elements.yearButtons.appendChild(button);
        }
    }

    function closeSettings() {
        elements.settingsOverlay.classList.remove('active');
        elements.settingsPanel.classList.remove('active');
    }

    // ===== Initialize =====
    function init() {
        // Cache DOM elements
        elements = {
            yearTitle: document.getElementById('yearTitle'),
            progressText: document.getElementById('progressText'),
            progressBar: document.getElementById('progressBar'),
            yearGrid: document.getElementById('yearGrid'),
            emptyState: document.getElementById('emptyState'),
            popupOverlay: document.getElementById('popupOverlay'),
            popup: document.getElementById('dayPopup'),
            popupDate: document.getElementById('popupDate'),
            popupClose: document.getElementById('popupClose'),
            colorOptions: document.getElementById('colorOptions'),
            emojiOptions: document.getElementById('emojiOptions'),
            noteInput: document.getElementById('noteInput'),
            hasNoteIndicator: document.getElementById('hasNoteIndicator'),
            settingsBtn: document.getElementById('settingsBtn'),
            settingsOverlay: document.getElementById('settingsOverlay'),
            settingsPanel: document.getElementById('settingsPanel'),
            settingsClose: document.getElementById('settingsClose'),
            themeOptions: document.getElementById('themeOptions'),
            yearButtons: document.getElementById('yearButtons'),
            emojiInput: document.getElementById('emojiInput'),
            exportBtn: document.getElementById('exportBtn'),
            importBtn: document.getElementById('importBtn'),
            importFile: document.getElementById('importFile')
        };

        // Load saved state
        loadState();

        // Apply theme
        applyTheme(state.theme);

        // Render grid
        renderGrid();

        // Event listeners
        elements.popupClose.addEventListener('click', closeDayPopup);
        elements.popupOverlay.addEventListener('click', closeDayPopup);

        // Instant save on note input
        elements.noteInput.addEventListener('input', instantSave);

        elements.settingsBtn.addEventListener('click', openSettings);
        elements.settingsClose.addEventListener('click', closeSettings);
        elements.settingsOverlay.addEventListener('click', closeSettings);

        elements.exportBtn.addEventListener('click', exportData);
        elements.importBtn.addEventListener('click', () => elements.importFile.click());
        elements.importFile.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                importData(e.target.files[0]);
                e.target.value = ''; // Reset
            }
        });

        // Year selector is now handled by button clicks in renderYearButtons

        // Custom emoji input
        elements.emojiInput.addEventListener('input', (e) => {
            state.customEmojis = e.target.value;
            saveState();
        });

        elements.emojiInput.addEventListener('blur', (e) => {
            // Clean up emojis on blur - remove spaces and duplicates
            const value = e.target.value;
            if (value) {
                // Split by spaces/whitespace, filter empty, remove duplicates using Set
                const emojiList = value.split(/\s+/).filter(e => e.trim().length > 0);
                const uniqueEmojis = [...new Set(emojiList)].join(' ');
                state.customEmojis = uniqueEmojis;
                e.target.value = uniqueEmojis;
                saveState();
            }
        });

        // Handle viewport resize (keyboard open/close)
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', handleViewportResize);
            window.visualViewport.addEventListener('scroll', handleViewportResize);
        }
        window.addEventListener('resize', handleViewportResize);
        window.addEventListener('orientationchange', handleViewportResize);

        // Update progress every minute
        setInterval(() => {
            const now = new Date();
            const newToday = getDayOfYear(now);
            if (newToday !== state.today) {
                state.today = newToday;
                updateProgress();
                renderGrid();
            }
        }, 60000);

        // Register service worker
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js')
                .then(reg => console.log('Service Worker registered'))
                .catch(err => console.error('Service Worker registration failed:', err));
        }
    }

    // Start app when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
