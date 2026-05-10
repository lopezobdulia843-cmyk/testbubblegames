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

    if (window.mode === "login") {
        window.mode = "signup";
        title.innerText = "Join the Club! ✨";
        btn.innerText = "🫧 Let's Play! 🫧";
        if (forgotPass) forgotPass.style.display = 'none';
        toggleContainer.innerHTML = `
            Already a Member? 
            <a href="#" class="signup-link" onclick="switchMode()">Log In!</a>
        `;
    } else {
        window.mode = "login";
        title.innerText = "Getting Started";
        btn.innerText = "🫧 Let's Play! 🫧";
        if (forgotPass) forgotPass.style.display = 'inline';
        toggleContainer.innerHTML = `
            New here? 
            <a href="#" class="signup-link" onclick="switchMode()">Sign Up!</a>
        `;
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

    if (window.mode === "signup") {
        mainButton.innerText = "CREATING PLAYER...";

        try {
            const q = query(collection(db, "profiles"), where("username", "==", username));
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
                alert("That username is already taken! 🫧");
                resetButton(mainButton, loader);
                return;
            }

            const userEmail = `${username}@bubblegames.com`;
            const userCredential = await createUserWithEmailAndPassword(auth, userEmail, password);
            const user = userCredential.user;

            await setDoc(doc(db, "profiles", user.uid), {
                username: username,
                createdAt: new Date()
            });

            showWelcome();

        } catch (error) {
            alert("Error: " + error.message);
            resetButton(mainButton, loader);
        }

    } else {
        mainButton.innerText = "LOADING PROFILE...";
        
        try {
            const userEmail = `${username}@bubblegames.com`;
            await signInWithEmailAndPassword(auth, userEmail, password);
            showWelcome();
        } catch (error) {
            alert("Wrong password or player not found! 🔑");
            resetButton(mainButton, loader);
        }
    }
};

function resetButton(btn, ldr) {
    ldr.style.display = 'none';
    btn.style.opacity = '1';
    btn.disabled = false;
    btn.innerText = "🫧 Let's Play! 🫧"; 
}

// 4. TELEPORT TO THE HUB! 🚀
function showWelcome() {
    // Only redirect if we are NOT already on the hub page
    if (!window.location.href.includes('hub.html')) {
        window.location.href = 'hub.html'; 
    }
}

// 5. AUTO-LOGIN CHECK (FIXED)
onAuthStateChanged(auth, (user) => {
    if (user) {
        // If they are logged in and on the login page, send them to the hub
        if (window.location.href.includes('index.html') || window.location.pathname === '/') {
            showWelcome();
        }
    } else {
        // If they are NOT logged in and trying to see the hub, kick them to login
        if (window.location.href.includes('hub.html')) {
            window.location.href = 'index.html';
        }
    }
});

window.handleLogout = async () => {
    await signOut(auth);
    window.location.href = 'index.html'; 
};
