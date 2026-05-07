import { supabase } from './supabase.js';

// Global state for Login vs Signup
window.mode = "login"; 

/**
 * Main Auth Handler
 */
window.handleAuth = async () => {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const mainButton = document.getElementById('main-button');
    const loader = document.getElementById('loader');

    if (!username || !password) {
        alert("Oops! Don't forget your username and password! ✨");
        return;
    }

    // Validation for Signup
    if (window.mode === "signup") {
        if (password.includes(" ") || username.includes(" ")) {
            alert("No spaces allowed in usernames or passwords! 🫧");
            return;
        }
        if (password.length < 6) {
            alert("Your password is too short! (At least 6 characters). 🛡️");
            return;
        }
    }

    // UI Loading State
    loader.style.display = 'block';
    mainButton.style.opacity = '0.5'; 
    mainButton.disabled = true;

    if (window.mode === "signup") {
        mainButton.innerText = "CREATING PLAYER...";

        // 1. Create the Profile first to get a unique ID
        const { data: newUser, error: profileError } = await supabase
            .from('profiles')
            .insert([{ username: username }])
            .select('id')
            .single();

        if (profileError) {
            alert("That username is already taken! 🫧");
            resetButton(mainButton, loader, "Create Account!");
            return;
        }

        // 2. Use that ID to create a "Ghost Email" for Supabase Auth
        const ghostEmail = `${newUser.id}@bubblegames.com`;
        const { error: authError } = await supabase.auth.signUp({
            email: ghostEmail,
            password: password,
        });

        if (authError) {
            alert("Auth Error: " + authError.message);
            resetButton(mainButton, loader, "Create Account!");
        } else {
            showHub(username);
        }

    } else {
        mainButton.innerText = "LOADING PROFILE...";
        
        // 1. Find the ID for the given username
        const { data: profile, error: searchError } = await supabase
            .from('profiles')
            .select('id')
            .eq('username', username)
            .single();

        if (profile) {
            // 2. Sign in using the Ghost Email
            const { error: loginError } = await supabase.auth.signInWithPassword({
                email: `${profile.id}@bubblegames.com`,
                password: password,
            });

            if (!loginError) {
                showHub(username);
            } else {
                alert("Wrong password! 🔑");
                resetButton(mainButton, loader, "Let's Play!");
            }
        } else {
            alert("We couldn't find that player! ✨");
            resetButton(mainButton, loader, "Let's Play!");
        }
    }
};

/**
 * Transition from Login Screen to the Hub
 */
function showHub(user) {
    // Hide the entire Auth Wrapper
    const authSection = document.getElementById('auth-section');
    const hubSection = document.getElementById('hub-section');

    if (authSection) authSection.style.display = 'none';
    if (hubSection) hubSection.style.display = 'flex';
    
    // Update any UI elements that show the username
    const displayUser = document.getElementById('display-username');
    if (displayUser) displayUser.innerText = user;

    console.log(`Access Granted: ${user}`);
    
    // If hub.js has a render function, trigger it
    if (window.renderGameList) window.renderGameList();
}

function resetButton(btn, loader, text) {
    loader.style.display = 'none';
    btn.style.opacity = '1';
    btn.disabled = false;
    btn.innerText = text;
}

/**
 * Session Check (Auto-login)
 */
const checkSession = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
        const playerID = user.email.split('@')[0];
        const { data: profile } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', playerID)
            .single();

        if (profile) {
            showHub(profile.username);
        }
    }
};

checkSession();

// Logout Logic
document.getElementById('logout-trigger')?.addEventListener('click', async () => {
    await supabase.auth.signOut();
    window.location.reload(); 
});
