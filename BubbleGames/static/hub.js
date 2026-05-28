import { auth, db } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc, collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, limitToLast, getDocs, deleteDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// --- 1. ONLY SHOW DATA ---
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
        
        // Initial manual load
        refreshChat();
    }
});

// --- 2. LOAD GAMES ---
async function loadGlobalGames() {
    const globalGrid = document.getElementById('global-game-grid');
    if (!globalGrid) return;
    globalGrid.innerHTML = `<p class="no-games">No games here! Time to start creating? 🫧</p>`;
}

async function loadUserGames() {
    const userGrid = document.getElementById('owned-game-grid'); 
    if (!userGrid) return;
    userGrid.innerHTML = `<p class="no-games">You haven't created any games yet. Start creating! 🚀</p>`;
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

// --- 5. CHAT ROOM LOGIC (HYBRID BAM TRIGGER) ---
const chatCollection = collection(db, "global-chat");

// Manual fetch for the UI
async function refreshChat() {
    const chatBox = document.getElementById('chat-messages');
    if (!chatBox) return;
    const snapshot = await getDocs(query(chatCollection, orderBy("createdAt", "desc"), limitToLast(20)));
    chatBox.innerHTML = ""; 
    const docs = snapshot.docs.reverse();
    docs.forEach((doc) => {
        const data = doc.data();
        chatBox.innerHTML += `<div><strong>${data.username}:</strong> ${data.text}</div>`;
    });
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Listen ONLY to the tiny trigger document (1 read total for all users)
onSnapshot(doc(db, "chat-metadata", "status"), () => {
    refreshChat();
});

window.sendMessage = async () => {
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    if (text === "" || text.length > 100) return;

    // Add message
    await addDoc(chatCollection, { text, username: window.currentUsername || "Player", createdAt: serverTimestamp() });
    input.value = "";

    // Cleanup
    const snapshot = await getDocs(query(chatCollection, orderBy("createdAt", "asc")));
    if (snapshot.size > 20) await deleteDoc(snapshot.docs[0].ref);

    // BAM! Trigger the update for everyone else
    await setDoc(doc(db, "chat-metadata", "status"), { lastUpdated: serverTimestamp() });
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
