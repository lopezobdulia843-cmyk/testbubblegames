import { auth, db } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// --- 1. THE SECURITY GUARD (AUTH CHECK) ---
function checkUser() {
    // Firebase listens for the user automatically
    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            // Not logged in? Kick them to the curb!
            window.location.href = 'index.html';
        } else {
            // Logged in! Let's get their real Username from Firestore
            const docRef = doc(db, "profiles", user.uid);
            const docSnap = await getDoc(docRef);

            let displayName = "Player";
            if (docSnap.exists()) {
                displayName = docSnap.data().username;
            }

            console.log("Welcome, Player:", displayName);
            const welcomeText = document.getElementById('welcome-text');
            if (welcomeText) welcomeText.innerText = `Welcome back, ${displayName}! ✨`;
            
            // Load the games
            loadGlobalGames();
            loadUserGames(user.uid);
        }
    });
}

// --- 2. THE TAB MANAGER (Stays exactly the same!) ---
window.switchTab = (tabName) => {
    closePanel();
    const views = ['view-home', 'view-create', 'view-settings'];
    views.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });

    const icons = ['nav-home', 'nav-create', 'nav-settings'];
    icons.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.remove('active');
    });

    document.getElementById(`view-${tabName}`).style.display = 'flex';
    document.getElementById(`nav-${tabName}`).classList.add('active');
};

// --- 3. THE DATA FETCHERS ---
async function loadGlobalGames() {
    const globalGrid = document.getElementById('global-game-grid');
    
    // Your list of epic games
    const games = [
        { name: 'Lostination', icon: '👻', desc: 'A terrifying 3D survival experience built with Three.js.' },
        { name: 'Bubble Craft', icon: '💎', desc: 'The ultimate block-building adventure.' },
        { name: 'Geometry Dash', icon: '🟦', desc: 'Jump and fly your way through danger!' }
    ];

    globalGrid.innerHTML = games.map(g => createCardHTML(g)).join('');
}

async function loadUserGames(userId) {
    const ownedGrid = document.getElementById('owned-game-grid');
    // For now, a placeholder until we build the "Create" logic
    ownedGrid.innerHTML = `<p style="color: gray;">You haven't published any games yet. Click "New Game" to start!</p>`;
}

function createCardHTML(game) {
    return `
        <div class="market-card" onclick="openPanel('${game.name}', '${game.icon}', '${game.desc}')">
            <span class="market-icon">${game.icon}</span>
            <h3>${game.name}</h3>
        </div>
    `;
}

// --- 4. THE UI INTERACTION ---
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
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.onclick = async () => {
        try {
            await signOut(auth);
            window.location.href = 'index.html';
        } catch (error) {
            alert("Error logging out!");
        }
    };
}

// --- INITIALIZE ---
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('bubbleTheme') === 'dark') {
        document.body.classList.add('dark-theme');
        const toggle = document.getElementById('darkToggle');
        if (toggle) toggle.checked = true;
    }
    checkUser();
});
