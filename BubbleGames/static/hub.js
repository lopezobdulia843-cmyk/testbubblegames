import { auth, db } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// --- 1. ONLY SHOW DATA (NO KICKING) ---
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const docRef = doc(db, "profiles", user.uid);
        const docSnap = await getDoc(docRef);
        let displayName = docSnap.exists() ? docSnap.data().username : "Player";

        const welcomeText = document.getElementById('welcome-text');
        if (welcomeText) welcomeText.innerText = `Welcome back, ${displayName}! ✨`;
        
        loadGlobalGames();
        loadUserGames(); 

        // Apply saved theme on login
        if (localStorage.getItem('bubbleTheme') === 'dark') {
            document.body.classList.add('dark-theme');
            const toggle = document.getElementById('darkToggle');
            if (toggle) toggle.checked = true;
        }
    }
});

// --- 2. LOAD GAMES ---
async function loadGlobalGames() {
    const globalGrid = document.getElementById('global-game-grid');
    if (!globalGrid) return;

    const games = [
        { name: 'Lostination', icon: '👻', desc: 'Survival.' },
        { name: 'Bubble Craft', icon: '💎', desc: 'Building.' },
        { name: 'Geometry Dash', icon: '🟦', desc: 'Rhythm.' }
    ];

    if (games.length === 0) {
        globalGrid.innerHTML = `<p class="no-games">No games here! Time to start creating? 🫧</p>`;
        return;
    }

    globalGrid.innerHTML = games.map(g => `
        <div class="market-card" onclick="openPanel('${g.name}', '${g.icon}', '${g.desc}')">
            <span class="market-icon">${g.icon}</span>
            <h3>${g.name}</h3>
        </div>
    `).join('');
}

async function loadUserGames() {
    const userGrid = document.getElementById('owned-game-grid'); 
    if (!userGrid) return;
    
    const userGames = []; 

    if (userGames.length === 0) {
        userGrid.innerHTML = `<p class="no-games">You haven't created any games yet. Start creating! 🚀</p>`;
    }
}

// --- 3. LOGOUT ---
window.handleLogout = async () => {
    try {
        await signOut(auth);
        window.location.replace('index.html');
    } catch (error) {
        console.error("Logout failed", error);
    }
};

// --- 4. TABS & PANELS ---
window.switchTab = (t) => {
    // Switch views
    const v = ['view-home', 'view-create', 'view-settings'];
    v.forEach(id => { if(document.getElementById(id)) document.getElementById(id).style.display = 'none'; });
    if(document.getElementById(`view-${t}`)) document.getElementById(`view-${t}`).style.display = 'flex';

    // Update Sidebar Blue Glow
    const icons = ['nav-home', 'nav-create', 'nav-settings'];
    icons.forEach(id => { if(document.getElementById(id)) document.getElementById(id).classList.remove('active'); });
    if(document.getElementById(`nav-${t}`)) document.getElementById(`nav-${t}`).classList.add('active');

    window.closePanel();
};

window.toggleDarkMode = () => {
    const isDark = document.body.classList.toggle('dark-theme');
    localStorage.setItem('bubbleTheme', isDark ? 'dark' : 'light');
};

window.openPanel = (n, i, d) => {
    document.getElementById('panelTitle').innerText = n;
    document.getElementById('panelIcon').innerText = i;
    document.getElementById('panelDesc').innerText = d;
    document.getElementById('actionPanel').classList.add('open');
};

window.closePanel = () => {
    const panel = document.getElementById('actionPanel');
    if (panel) panel.classList.remove('open');
};
