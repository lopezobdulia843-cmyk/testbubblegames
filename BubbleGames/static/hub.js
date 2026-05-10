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
        loadUserGames(); // Added this so "My Games" shows the message
    }
});

// --- 2. LOAD GAMES ---
async function loadGlobalGames() {
    const globalGrid = document.getElementById('global-game-grid');
    if (!globalGrid) return;

    // Change this to [] to test the "No games" message
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
    const userGrid = document.getElementById('owned-game-grid'); // Make sure this ID exists in your HTML
    if (!userGrid) return;
    
    // For now, this is empty so it shows your message
    const userGames = []; 

    if (userGames.length === 0) {
        userGrid.innerHTML = `<p class="no-games">You haven't created any games yet. Start creating! 🚀</p>`;
    }
}

// --- 3. LOGOUT (FIXED) ---
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
    const v = ['view-home', 'view-create', 'view-settings'];
    v.forEach(id => { if(document.getElementById(id)) document.getElementById(id).style.display = 'none'; });
    if(document.getElementById(`view-${t}`)) document.getElementById(`view-${t}`).style.display = 'flex';
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
