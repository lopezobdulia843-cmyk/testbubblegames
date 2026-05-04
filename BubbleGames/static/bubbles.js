/**
 * BUBBLE GAMES - INTERACTIVE BACKGROUND
 * Floating, popping, and colorful bubbles!
 */

function createBubble() {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';

    // 1. Random Size (20px to 80px)
    const sizeValue = Math.random() * 60 + 20;
    bubble.style.width = sizeValue + "px";
    bubble.style.height = sizeValue + "px";

    // 2. Random Start Position (Across the screen)
    bubble.style.left = Math.random() * 100 + "vw";
    bubble.style.bottom = "-100px"; // Start below the screen
    bubble.style.position = "absolute";

    // 3. COLOR PICKER (Pink, Blue, or Purple)
    const colors = ['#ec4899', '#4f46e5', '#a855f7'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Applying colors to the bubble "rim" and glow
    bubble.style.border = `2px solid ${randomColor}`; 
    bubble.style.background = `radial-gradient(circle at 30% 30%, white, ${randomColor}22)`;
    bubble.style.boxShadow = `0 0 15px ${randomColor}44`; 
    bubble.style.zIndex = "1"; // Keep them behind the login card

    // 4. Random Speed and Sway
    const duration = Math.random() * 4 + 6; // 6 to 10 seconds
    const delay = Math.random() * 5; // Random start delay
    bubble.style.animation = `floatUp ${duration}s linear ${delay}s forwards`;

    // 5. Interaction: Pop on Click!
    bubble.addEventListener('mousedown', () => {
        bubble.style.transform = 'scale(2)';
        bubble.style.opacity = '0';
        bubble.style.pointerEvents = 'none'; // Prevent double clicking
        setTimeout(() => bubble.remove(), 150);
    });

    document.body.appendChild(bubble);

    // Clean up after it floats away
    setTimeout(() => {
        if (bubble.parentElement) {
            bubble.remove();
        }
    }, (duration + delay) * 1000);
}

// Spawn bubbles (Adjust timing: 400ms is high density, 800ms is chill)
setInterval(createBubble, 600);

// 6. Injection of the Animation Keyframes
const styleSheet = document.createElement('style');
styleSheet.innerHTML = `
    @keyframes floatUp {
        0% { 
            transform: translateY(0) translateX(0) rotate(0deg); 
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        50% {
            transform: translateY(-50vh) translateX(20px) rotate(180deg);
        }
        100% { 
            transform: translateY(-130vh) translateX(-20px) rotate(360deg); 
            opacity: 0;
        }
    }

    .bubble {
        pointer-events: auto;
        border-radius: 50%;
        transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.2s;
    }
`;
document.head.appendChild(styleSheet);
