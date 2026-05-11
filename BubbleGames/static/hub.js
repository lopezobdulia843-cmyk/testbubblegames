<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bubble Games | Hub</title>
    <link rel="stylesheet" href="style.css"> <style>
        /* QUICK BUBBLE THEME COLORS */
        :root {
            --bg: #f0f4f8;
            --card: #ffffff;
            --text: #333;
            --accent: #00a8ff;
        }
        body.dark-theme {
            --bg: #1a1a2e;
            --card: #16213e;
            --text: #e94560;
            --accent: #0f3460;
        }
        body { background: var(--bg); color: var(--text); font-family: 'Segoe UI', sans-serif; margin: 0; display: flex; flex-direction: column; height: 100vh; overflow: hidden; }
        
        /* HEADER */
        header { padding: 20px; text-align: center; background: var(--card); box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
        
        /* NAVIGATION */
        nav { display: flex; justify-content: center; gap: 20px; padding: 15px; background: var(--card); border-top: 1px solid #ddd; }
        .nav-btn { cursor: pointer; font-size: 1.2rem; padding: 10px 20px; border-radius: 20px; transition: 0.3s; }
        .nav-btn.active { background: var(--accent); color: white; }

        /* CONTENT AREAS */
        .view { display: none; flex-direction: column; align-items: center; padding: 20px; overflow-y: auto; flex: 1; }
        #view-home { display: flex; } /* Show home by default */

        /* GAME GRIDS */
        .game-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 15px; width: 100%; max-width: 800px; }
        .market-card { background: var(--card); padding: 20px; border-radius: 15px; text-align: center; cursor: pointer; transition: transform 0.2s; box-shadow: 0 5px 10px rgba(0,0,0,0.1); }
        .market-card:hover { transform: translateY(-5px); }
        .market-icon { font-size: 3rem; display: block; margin-bottom: 10px; }

        /* ACTION PANEL (The Slide-Out Menu) */
        #actionPanel { position: fixed; bottom: -100%; left: 0; width: 100%; background: var(--card); padding: 30px; transition: 0.5s; border-radius: 30px 30px 0 0; box-shadow: 0 -10px 20px rgba(0,0,0,0.2); text-align: center; }
        #actionPanel.open { bottom: 0; }
        .close-btn { position: absolute; top: 15px; right: 20px; font-size: 1.5rem; cursor: pointer; }
    </style>
</head>
<body>

    <header>
        <h1 id="welcome-text">Loading the Hub... ✨</h1>
    </header>

    <main style="flex: 1; display: flex; flex-direction: column;">
        <section id="view-home" class="view">
            <h2>Global Games 🌍</h2>
            <div id="global-game-grid" class="game-grid">
                </div>
            
            <hr style="width: 80%; margin: 30px 0; opacity: 0.2;">
            
            <h2>Your Games 💎</h2>
            <div id="owned-game-grid" class="game-grid">
                </div>
        </section>

        <section id="view-create" class="view">
            <h2>Create Something New! 🚀</h2>
            <p>The game engine is warming up...</p>
        </section>

        <section id="view-settings" class="view">
            <h2>Settings ⚙️</h2>
            <div style="background: var(--card); padding: 20px; border-radius: 15px;">
                <label>
                    <input type="checkbox" id="darkToggle" onchange="toggleDarkMode()"> Dark Mode
                </label>
                <br><br>
                <button onclick="handleLogout()" style="background: #ff4757; color: white; border: none; padding: 10px 20px; border-radius: 10px; cursor: pointer;">Logout</button>
            </div>
        </section>
    </main>

    <nav>
        <div id="nav-home" class="nav-btn active" onclick="switchTab('home')">🏠</div>
        <div id="nav-create" class="nav-btn" onclick="switchTab('create')">➕</div>
        <div id="nav-settings" class="nav-btn" onclick="switchTab('settings')">⚙️</div>
    </nav>

    <div id="actionPanel">
        <span class="close-btn" onclick="closePanel()">✖</span>
        <span id="panelIcon" style="font-size: 4rem;"></span>
        <h2 id="panelTitle">Game Name</h2>
        <p id="panelDesc">Game Description goes here.</p>
        <button style="background: var(--accent); color: white; border: none; padding: 15px 40px; border-radius: 25px; font-size: 1.2rem; cursor: pointer;">PLAY NOW</button>
    </div>

    <script type="module" src="hub.js"></script>
</body>
</html>
