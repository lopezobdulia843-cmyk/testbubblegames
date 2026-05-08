/**
 * 1. THE GAME DATABASE
 * This is where you add new games. No HTML needed—just add an object!
 */
const gameDatabase = [
    {
        id: "lostination-001",
        name: "Lostination",
        icon: "🌑",
        description: "A 3D browser-based horror experience. Can you survive the dark?",
        category: "discover",
        tags: ["Horror", "3D", "Multiplayer"]
    },
    {
        id: "bubble-craft-001",
        name: "Bubble Craft",
        icon: "⛏️",
        description: "Your custom Minecraft server! Survival and building with the crew.",
        category: "my-games",
        tags: ["Survival", "Building"]
    },
    {
        id: "neon-runner-001",
        name: "Neon Runner",
        icon: "🏃",
        description: "High-speed physics-based rage game. Don't fall off!",
        category: "discover",
        tags: ["Physics", "Rage"]
    }
];

/**
 * 2. THE CARD GENERATOR
 * This function loops through the database and builds the HTML cards.
 */
window.renderGameList = () => {
    const discoverGrid = document.getElementById('global-game-list');
    const myGamesGrid = document.getElementById('my-game-list');

    // Clear current grids to avoid duplicates
    if (discoverGrid) discoverGrid.innerHTML = '';
    if (myGamesGrid) myGamesGrid.innerHTML = '';

    gameDatabase.forEach(game => {
        // Create the card element
        const card = document.createElement('div');
        card.className = 'market-card';
        card.onclick = () => openPanel(game.name, game.icon, game.description);

        card.innerHTML = `
            <div class="game-icon">${game.icon}</div>
            <div class="card-info">
                <h3>${game.name}</h3>
                <p>${game.description}</p>
                <div class="tag-row">
                    ${game.tags.map(tag => `<span class="game-tag">${tag}</span>`).join('')}
                </div>
            </div>
        `;

        // Sort into the correct grid based on category
        if (game.category === 'discover' && discoverGrid) {
            discoverGrid.appendChild(card);
        } else if (game.category === 'my-games' && myGamesGrid) {
            myGamesGrid.appendChild(card);
        }
    });
};

/**
 * 3. TAB CONTROLLER
 * Switches between Home, Create, and Settings views.
 */
window.switchTab = (tabName) => {
    // Hide all view containers
    const views = document.querySelectorAll('.main-content');
    views.forEach(v => v.style.display = 'none');

    // Remove 'active' state from all sidebar icons
    const icons = document.querySelectorAll('.side-icon');
    icons.forEach(i => i.classList.remove('active'));

    // Show the selected view
    const activeView = document.getElementById(`view-${tabName}`);
    const activeIcon = document.getElementById(`nav-${tabName}`);

    if (activeView) activeView.style.display = 'flex';
    if (activeIcon) activeIcon.classList.add('active');

    // Close the slide panel if it's open during a tab switch
    closePanel();
};

/**
 * 4. SLIDE PANEL LOGIC
 * Opens the side panel to show game details when a card is clicked.
 */
window.openPanel = (name, icon, desc) => {
    const panel = document.getElementById('actionPanel');
    document.getElementById('panelTitle').innerText = name;
    document.getElementById('panelIcon').innerText = icon;
    document.getElementById('panelContent').innerHTML = `
        <p style="font-size: 18px; line-height: 1.5; color: var(--text-sub);">${desc}</p>
        <button class="play-btn" style="margin-top: 30px;">PLAY NOW</button>
    `;
    panel.classList.add('open');
};

window.closePanel = () => {
    document.getElementById('actionPanel').classList.remove('open');
};
