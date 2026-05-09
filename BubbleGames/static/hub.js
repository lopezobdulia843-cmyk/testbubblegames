import { supabase } from './static/supabase.js';

// --- 1. THE SECURITY GUARD (AUTH CHECK) ---
async function checkUser() {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        // Not logged in? Kick them to the curb!
        window.location.href = 'index.html';
    } else {
        // Logged in! Let's customize the UI
        console.log("Welcome, Player:", user.email);
        const welcomeText = document.getElementById('welcome-text');
        if (welcomeText) welcomeText.innerText = `Welcome back, Player! ✨`;
        
        // Load the games once we know who the user is
        loadGlobalGames();
        loadUserGames(user.id);
    }
}

// --- 2. THE TAB MANAGER ---
window.switchTab = (tabName) => {
    // Close the sliding panel if it's open
    closePanel();

    // Hide all views
    const views = ['view-home', 'view-create', 'view-settings'];
    views.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });

    // Remove active class from all icons
    const icons = ['nav-home', 'nav-create', 'nav-settings'];
    icons.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.remove('active');
    });

    // Show the selected view and highlight icon
    document.getElementById(`view-${tabName}`).style.display = 'flex';
    document.getElementById(`nav-${tabName}`).classList.add('active');
};

// --- 3. THE DATA FETCHERS ---
async function loadGlobalGames() {
    const globalGrid = document.getElementById('global-game-grid');
    
    // For now, we use a list, but later this will be: 
    // await supabase.from('games').select('*')
    const games = [
        { name: 'Lostination', icon: '👻', desc: 'A terrifying 3D survival experience built with Three.js.' },
        { name: 'Bubble Craft', icon: '💎', desc: 'The ultimate block-building adventure.' },
        { name: 'Geometry Dash', icon: '🟦', desc: 'Jump and fly your way through danger!' }
    ];

    globalGrid.innerHTML = games.map(g => createCardHTML(g)).join('');
}

async function loadUserGames(userId) {
    const ownedGrid = document.getElementById('owned-game-grid');
    // This will filter your database for games where creator_id == userId
    ownedGrid.innerHTML = `<p style="color: gray;">You haven't published any games yet. Click "New Game" to start!</p>`;
}

// Helper function to create the HTML for a card
function createCardHTML(game) {
    return `
        <div class="market-card" onclick="openPanel('${game.name}', '${game.icon}', '${game.desc}')">
            <span class="market-icon">${game.icon}</span>
            <h3>${game.name}</h3>
        </div>
    `;
}

// --- 4. THE UI INTERACTION (PANEL & THEME) ---
window.openPanel = (name, icon, desc) => {
    document.getElementById('panelTitle').innerText = name;
    document.getElementById('panelIcon').innerText = icon;
    document.getElementById('panelDesc').innerText = desc;
    document.getElementById('actionPanel').classList.add('open');
};

window.closePanel = () => {
    document.getElementById('actionPanel').classList.remove('open');
};

window.toggleDarkMode = () => {
    const isDark = document.body.classList.toggle('dark-theme');
    localStorage.setItem('bubbleTheme', isDark ? 'dark' : 'light');
};

// --- 5. THE LOGOUT ---
document.getElementById('logoutBtn').onclick = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
        window.location.href = 'index.html';
    } else {
        alert("Error logging out!");
    }
};

// --- INITIALIZE ---
document.addEventListener('DOMContentLoaded', () => {
    // Check theme
    if (localStorage.getItem('bubbleTheme') === 'dark') {
        document.body.classList.add('dark-theme');
        const toggle = document.getElementById('darkToggle');
        if (toggle) toggle.checked = true;
    }
    
    // Run auth check
    checkUser();
});
