// ===== Year Progress App =====

(function() {
    'use strict';

    // ===== State =====
    const state = {
        year: new Date().getFullYear(),
        daysInYear: 0,
        today: 0,
        marks: {},
        theme: 'sakura',
        currentDay: null
    };

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
    let elements = {};

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
        return date.toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric',
            year: 'numeric'
        });
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
                marks: state.marks,
                theme: state.theme,
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
                // Use saved marks and theme, but always use current year
                state.marks = data.marks || {};
                state.theme = data.theme || 'sakura';
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
        
        // Update meta theme color
        const themeColors = {
            sakura: '#FFF8F0',
            mint: '#F0FFF4',
            lavender: '#F8F4FF',
            honey: '#FFFBF0'
        };
        document.querySelector('meta[name="theme-color"]').setAttribute('content', themeColors[themeName]);
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

        const now = new Date();
        state.year = now.getFullYear();
        state.daysInYear = isLeapYear(state.year) ? 366 : 365;
        state.today = getDayOfYear(now);

        elements.yearTitle.textContent = state.year;
        updateProgress();

        let currentMonth = -1;
        let dayOfWeek = 0; // 0 = Sunday, 6 = Saturday

        for (let day = 1; day <= state.daysInYear; day++) {
            const date = new Date(state.year, 0, day);
            const month = date.getMonth();
            dayOfWeek = date.getDay();

            // Add month label and divider at the start of each month
            if (month !== currentMonth) {
                if (currentMonth !== -1) {
                    // Add a subtle divider before new month (except first month)
                    const divider = document.createElement('div');
                    divider.className = 'month-break';
                    grid.appendChild(divider);
                }

                // Add month label
                const monthLabel = document.createElement('div');
                monthLabel.className = 'month-label-inline';
                monthLabel.textContent = date.toLocaleDateString('en-US', { month: 'long' });
                grid.appendChild(monthLabel);

                currentMonth = month;
            }

            // Create day dot
            const dot = document.createElement('div');
            dot.className = 'day-dot';
            dot.dataset.day = day;

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
            grid.appendChild(dot);
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

    // ===== Popup Functions =====
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

        // Show popup
        elements.popupOverlay.classList.add('active');
        elements.popup.classList.add('active');
        document.body.classList.add('no-scroll');
    }

    function closeDayPopup() {
        elements.popupOverlay.classList.remove('active');
        elements.popup.classList.remove('active');
        document.body.classList.remove('no-scroll');
        state.currentDay = null;
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
                container.querySelectorAll('.color-option').forEach(el => el.classList.remove('selected'));
                option.classList.add('selected');
            });
            container.appendChild(option);
        });
    }

    function renderEmojiOptions(selectedEmoji) {
        const container = elements.emojiOptions;
        container.innerHTML = '';

        emojis.forEach(emoji => {
            const option = document.createElement('div');
            option.className = `emoji-option ${selectedEmoji === emoji ? 'selected' : ''}`;
            option.textContent = emoji;
            option.dataset.emoji = emoji;
            option.addEventListener('click', () => {
                container.querySelectorAll('.emoji-option').forEach(el => el.classList.remove('selected'));
                option.classList.add('selected');
            });
            container.appendChild(option);
        });
    }

    function saveMark() {
        if (!state.currentDay) return;

        const dateKey = getDateKey(state.currentDay);
        const selectedColor = elements.colorOptions.querySelector('.color-option.selected');
        const selectedEmoji = elements.emojiOptions.querySelector('.emoji-option.selected');
        const note = elements.noteInput.value.trim();

        const mark = {
            color: selectedColor ? selectedColor.dataset.color : null,
            emoji: selectedEmoji ? selectedEmoji.dataset.emoji : null,
            note: note || null
        };

        // Remove entry if empty
        if (!mark.color && !mark.emoji && !mark.note) {
            delete state.marks[dateKey];
        } else {
            state.marks[dateKey] = mark;
        }

        saveState();
        renderGrid();
        closeDayPopup();
    }

    function clearMark() {
        if (!state.currentDay) return;

        const dateKey = getDateKey(state.currentDay);
        delete state.marks[dateKey];

        saveState();
        renderGrid();
        closeDayPopup();
    }

    // ===== Settings Functions =====
    function openSettings() {
        elements.settingsOverlay.classList.add('active');
        elements.settingsPanel.classList.add('active');
        renderThemeOptions();
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
            saveBtn: document.getElementById('saveBtn'),
            clearBtn: document.getElementById('clearBtn'),
            settingsBtn: document.getElementById('settingsBtn'),
            settingsOverlay: document.getElementById('settingsOverlay'),
            settingsPanel: document.getElementById('settingsPanel'),
            settingsClose: document.getElementById('settingsClose'),
            themeOptions: document.getElementById('themeOptions'),
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
        elements.saveBtn.addEventListener('click', saveMark);
        elements.clearBtn.addEventListener('click', clearMark);

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
