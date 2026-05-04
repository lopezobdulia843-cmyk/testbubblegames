/**
 * BUBBLE GAMES HUB ENGINE
 * Controls: Tabs, Slide Panel, and Theme Memory
 */

// 1. LOGOUT LOGIC
window.fakeLogout = function() {
    if(confirm("Are you sure you want to log out of Bubble Games?")) {
        alert("You have been logged out! (Not really, this is just a demo).");
        // In the future, you can redirect back to index.html here
    }
};

// 2. TAB SYSTEM
window.switchTab = function(tabName) {
    // Safety check: close the panel whenever we switch tabs
    if (typeof window.closePanel === 'function') {
        window.closePanel();
    }

    // Hide all main view sections
    const views = ['view-home', 'view-create', 'view-settings'];
    views.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });

    // Remove 'active' glow from all nav icons
    const navs = ['nav-home', 'nav-create', 'nav-settings'];
    navs.forEach(id => {
        const navItem = document.getElementById(id);
        if (navItem) navItem.classList.remove('active');
    });

    // Show the selected view and light up the icon
    const targetView = document.getElementById('view-' + tabName);
    const targetNav = document.getElementById('nav-' + tabName);

    if (targetView) targetView.style.display = 'flex';
    if (targetNav) targetNav.classList.add('active');
};

// 3. SLIDE PANEL LOGIC
window.openPanel = function(name, icon, isOwned) {
    const titleEl = document.getElementById('panelTitle');
    const iconEl = document.getElementById('panelIcon');
    const panel = document.getElementById('actionPanel');

    if (titleEl) titleEl.innerText = name;
    if (iconEl) iconEl.innerText = icon;
    
    const ownedControls = document.getElementById('ownedControls');
    const visitorStats = document.getElementById('visitorStats');
    const editNameInput = document.getElementById('editName');

    if (isOwned) {
        if (ownedControls) ownedControls.style.display = 'block';
        if (visitorStats) visitorStats.style.display = 'none';
        if (editNameInput) editNameInput.value = name;
    } else {
        if (ownedControls) ownedControls.style.display = 'none';
        if (visitorStats) visitorStats.style.display = 'block';
    }

    if (panel) panel.classList.add('open');
};

window.closePanel = function() {
    const panel = document.getElementById('actionPanel');
    if (panel) panel.classList.remove('open');
};

// 4. DARK MODE ENGINE
window.toggleDarkMode = function() {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('bubbleTheme', isDark ? 'dark' : 'light');
};

// 5. INITIALIZATION (Runs when the page loads)
window.addEventListener('DOMContentLoaded', () => {
    // Check saved theme preference
    if (localStorage.getItem('bubbleTheme') === 'dark') {
        document.body.classList.add('dark-theme');
        const darkToggle = document.getElementById('darkToggle');
        if (darkToggle) {
            darkToggle.checked = true;
        }
    }
});
