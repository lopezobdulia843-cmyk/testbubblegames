/**
 * Tab Switching Logic
 */
function switchTab(tabName) {
    closePanel();
    // Hide all views
    ['view-home', 'view-create', 'view-settings'].forEach(id => {
        document.getElementById(id).style.display = 'none';
    });
    // Remove active class from icons
    ['nav-home', 'nav-create', 'nav-settings'].forEach(id => {
        document.getElementById(id).classList.remove('active');
    });
    
    // Show selected
    document.getElementById('view-' + tabName).style.display = 'flex';
    document.getElementById('nav-' + tabName).classList.add('active');
}

/**
 * Slide Panel Logic
 */
function openPanel(name, icon, isOwned) {
    document.getElementById('panelTitle').innerText = name;
    document.getElementById('panelIcon').innerText = icon;
    document.getElementById('actionPanel').classList.add('open');
}

function closePanel() {
    document.getElementById('actionPanel').classList.remove('open');
}

/**
 * Theme Logic
 */
function toggleDarkMode() {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('bubbleTheme', isDark ? 'dark' : 'light');
}

// Load Theme on Start
if (localStorage.getItem('bubbleTheme') === 'dark') {
    document.body.classList.add('dark-theme');
    const toggle = document.getElementById('darkToggle');
    if(toggle) toggle.checked = true;
}
