import { auth, db } from './firebase-config.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, setDoc, getDoc, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 1. SET DEFAULT MODE
window.mode = "login"; 

// 2. TOGGLE BETWEEN SIGNUP AND LOGIN
window.switchMode = () => {
    const title = document.getElementById('page-title');
    const btn = document.getElementById('main-button');
    const toggleContainer = document.getElementById('toggle-container');
    const forgotPass = document.getElementById('forgot-pass');

    if (!title || !btn) return; // Safety check

    if (window.mode === "login") {
        window.mode = "signup";
        title.innerText = "Join the Club! ✨";
        btn.innerText = "🫧 Let's Play! 🫧";
        if (forgotPass) forgotPass.style.display = 'none';
        toggleContainer.innerHTML = `Already a Member? <a href="#" class="signup-link" onclick="switchMode()">Log In!</a>`;
    } else {
        window.mode = "login";
        title.innerText = "Getting Started";
        btn.innerText = "🫧 Let's Play! 🫧";
        if (forgotPass) forgotPass.style.display = 'inline';
        toggleContainer.innerHTML = `New here? <a href="#" class="signup-link" onclick="switchMode()">Sign Up!</a>`;
    }
};

// 3. HANDLE AUTHENTICATION
window.handleAuth = async () => {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const mainButton = document.getElementById('main-button');
    const loader = document.getElementById('loader');

    if (!username || !password) {
        alert("Oops! Don't forget your username and password! ✨");
        return;
    }

    loader.style.display = 'block';
    mainButton.style.opacity = '0.5'; 
    mainButton.disabled = true;

    const userEmail = `${username}@bubblegames.com`;

    if (window.mode === "signup") {
        try {
            const q = query(collection(db, "profiles"), where("username", "==", username));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                alert("That username is already taken! 🫧");
                resetButton(mainButton, loader);
                return;
            }
            const userCredential = await createUserWithEmailAndPassword(auth, userEmail, password);
            await setDoc(doc(db, "profiles", userCredential.user.uid), {
                username: username,
                createdAt: new Date()
            });
            // Don't manually redirect here, let the Auth listener (below) do it safely
        } catch (error) {
            alert("Error: " + error.message);
            resetButton(mainButton, loader);
        }
    } else {
        try {
            await signInWithEmailAndPassword(auth, userEmail, password);
        } catch (error) {
            alert("Wrong password or player not found! 🔑");
            resetButton(mainButton, loader);
        }
    }
};

function resetButton(btn, ldr) {
    if (ldr) ldr.style.display = 'none';
    if (btn) {
        btn.style.opacity = '1';
        btn.disabled = false;
        btn.innerText = "Let's Play! 🫧"; 
    }
}

// 4. THE BOUNCER (The Fix for the Kicking)
onAuthStateChanged(auth, (user) => {
    const isLoginPage = window.location.pathname.includes('index.html') || window.location.pathname === '/';
    const isHubPage = window.location.pathname.includes('hub.html');

    if (user) {
        // We found a player! Only send them to the hub if they are stuck on the login page
        if (isLoginPage) {
            window.location.replace('hub.html'); 
        }
    } else {
        // No player found. Only kick them to login if they are trying to stay on the hub
        if (isHubPage) {
            window.location.replace('index.html');
        }
    }
});

window.handleLogout = async () => {
    await signOut(auth);
    window.location.replace('index.html'); 
};
