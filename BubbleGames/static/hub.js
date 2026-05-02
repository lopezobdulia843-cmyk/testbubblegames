/**
 * BUBBLE GAMES HUB ENGINE
 * Handles: Tabs, Slide Panel, Search, and Theme Memory
 */

// 1. DATA - This is your "Database" for the session
const GAMES_DATA = [
    { id: 1, name: 'Climb It!', icon: '🏔️', owned: false, rating: 4.8, players: '1.2k' },
    { id: 2, name: 'Kingdom Sim', icon: '🏰', owned: false, rating: 4.5, players: '800' },
    { id: 3, name: 'Haunted Hall', icon: '👻', owned: false, rating: 4.9, players: '2.5k' },
    { id: 4, name: 'Bubble Craft', icon: '🫧', owned: true, rating: 5.0, players: 'Admin' },
    { id: 5, name: 'Arti Abe AI', icon: '🤖', owned: true, rating: 5.0, players: 'Admin' }
];

// 2. TAB SYSTEM
window.switchTab = function(tabName) {
    // Close the panel if it's open during a tab switch
    closePanel();

    // Hide all view sections
    const views = ['view-home', 'view-create', 'view-settings'];
    views.forEach(viewId => {
        const element = document.getElementById(viewId);
        if (element) element.style.display = 'none';
    });

    // Remove 'active' status from all nav icons
    const navs = ['nav-home', 'nav-create', 'nav-settings'];
    navs.forEach(navId => {
        const navItem = document.getElementById(navId);
        if (navItem) navItem.classList.remove('active');
    });

    // Show the one we want
    const targetView = document.getElementById('view-' + tabName);
    const targetNav = document.getElementById('nav-' + tabName);

    if (targetView) targetView.style.display = 'block';
    if (targetNav) targetNav.classList.add('active');
};

// 3. SLIDE PANEL LOGIC
window.openPanel = function(name, icon, isOwned) {
    const panel = document.getElementById('actionPanel');
    const titleEl = document.getElementById('panelTitle');
    const iconEl = document.getElementById('panelIcon');
    const ownedControls = document.getElementById('ownedControls');
    const visitorStats = document.getElementById('visitorStats');
    const editInput = document.getElementById('editName');

    // Set Content
    titleEl.innerText = name;
    iconEl.innerText = icon;

    // Show/Hide Owner UI
    if (isOwned) {
        ownedControls.style.display = 'block';
        visitorStats.style.display = 'none';
        if (editInput) editInput.value = name;
    } else {
        ownedControls.style.display = 'none';
        visitorStats.style.display = 'block';
    }

    // Slide it up!
    panel.classList.add('open');
};

window.closePanel = function() {
    const panel = document.getElementById('actionPanel');
    if (panel) panel.classList.remove('open');
};

// 4. THEME & SETTINGS
window.toggleDarkMode = function() {
    const isDark = document.body.classList.toggle('dark-theme');
    localStorage.setItem('bubbleTheme', isDark ? 'dark' : 'light');
};

// 5. SEARCH LOGIC (Simple Filter)
document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.querySelector('.hero-search');
    
    if (searchBar) {
        searchBar.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const cards = document.querySelectorAll('.market-card');
            
            cards.forEach(card => {
                const gameName = card.querySelector('h3').innerText.toLowerCase();
                if (gameName.includes(term)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // Initialize Theme from Memory
    if (localStorage.getItem('bubbleTheme') === 'dark') {
        document.body.classList.add('dark-theme');
        const darkToggle = document.getElementById('darkToggle');
        if (darkToggle) darkToggle.checked = true;
    }
});

// 6. LOGOUT (Link this to your Gateway logic)
window.handleLogout = function() {
    if(confirm("Ready to hop out of the bubble?")) {
        // Clear local session info if needed
        // Then hide Hub and show Login
        document.getElementById('hub-interface').style.display = 'none';
        document.getElementById('user-status').style.display = 'none';
        document.getElementById('gateway-interface').style.display = 'flex';
        
        // Reset to first tab for next login
        switchTab('home');
    }
};
