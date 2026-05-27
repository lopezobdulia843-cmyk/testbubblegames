import { auth, db } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc, collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, limitToLast, getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// --- 1. ONLY SHOW DATA (NO KICKING) ---
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const welcomeText = document.getElementById('welcome-text');
        const emailPrefix = user.email ? user.email.split('@')[0] : "Player";
        if (welcomeText) welcomeText.innerText = `Welcome back, ${emailPrefix}! ✨`;

        const getUsername = async (uid, attempts = 0) => {
            try {
                const docRef = doc(db, "profiles", uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) return docSnap.data().username;
                else if (attempts < 3) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    return getUsername(uid, attempts + 1);
                }
            } catch (err) { console.error("Firestore lookup failed:", err); }
            return emailPrefix; 
        };

        const displayName = await getUsername(user.uid);
        if (welcomeText) welcomeText.innerText = `Welcome back, ${displayName}! ✨`;
        window.currentUsername = displayName;
        
        loadGlobalGames();
        loadUserGames(); 

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
    const games = [];
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
    } catch (error) { console.error("Logout failed", error); }
};

// --- 4. TABS & PANELS ---
window.switchTab = (tabName) => {
    document.getElementById('view-home').style.display = 'none';
    document.getElementById('view-create').style.display = 'none';
    document.getElementById('view-settings').style.display = 'none';
    document.getElementById('view-chat').style.display = 'none'; 

    document.getElementById('nav-home').classList.remove('active');
    document.getElementById('nav-create').classList.remove('active');
    document.getElementById('nav-settings').classList.remove('active');
    document.getElementById('nav-chat').classList.remove('active'); 

    document.getElementById('view-' + tabName).style.display = 'flex';
    document.getElementById('nav-' + tabName).classList.add('active');
    window.closePanel();
};

window.toggleDarkMode = () => {
    const isDark = document.body.classList.toggle('dark-theme');
    localStorage.setItem('bubbleTheme', isDark ? 'dark' : 'light');
};

// --- 5. CHAT ROOM LOGIC WITH GOOMBER AI BOT ---
const chatCollection = collection(db, "global-chat");
let toxicityModel = null;
let isBotReady = false;

async function initGoomberBot() {
    // Safety check: wait until the toxicity library is actually loaded
    if (typeof toxicity === 'undefined') {
        setTimeout(initGoomberBot, 500);
        return;
    }

    const chatInput = document.getElementById('chat-input');
    if (chatInput) chatInput.disabled = true;
    
    try {
        toxicityModel = await toxicity.load(0.85);
        isBotReady = true;
        if (chatInput) chatInput.disabled = false;
        console.log("Goomber AI Bot is online! 🫧");
    } catch (err) {
        console.error("Goomber failed to wake up:", err);
    }
}
initGoomberBot();

window.sendMessage = async () => {
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    if (text === "") return;

    if (text.length > 100) {
        alert("Whoa! Goomber says: Keep it under 100 characters! 🫧");
        return;
    }

    if (!isBotReady) {
        alert("Goomber is still waking up... hold on a second! 🫧");
        return;
    }

    const predictions = await toxicityModel.classify(text);
    const isToxic = predictions.some(p => p.results[0].match === true);
    
    if (isToxic) {
        alert("Goomber says: That message doesn't fit our community guidelines! ✨");
        return;
    }

    await addDoc(chatCollection, {
        text: text,
        username: window.currentUsername || "Player",
        createdAt: serverTimestamp()
    });
    input.value = "";

    const cleanupQuery = query(chatCollection, orderBy("createdAt", "asc"));
    const snapshot = await getDocs(cleanupQuery);
    if (snapshot.size > 21) {
        const excess = snapshot.size - 21;
        for (let i = 0; i < excess; i++) {
            await deleteDoc(snapshot.docs[i].ref);
        }
    }
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
