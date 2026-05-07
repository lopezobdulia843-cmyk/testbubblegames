/**
 * Bubble Physics & Interaction
 */
function createBubble() {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';

    // 1. Random Size
    const sizeValue = Math.random() * 60 + 20;
    const size = sizeValue + "px";
    bubble.style.width = size;
    bubble.style.height = size;

    // 2. Random Start Position
    bubble.style.left = Math.random() * 100 + "vw";

    // 3. COLOR PICKER (Pink, Blue, or Purple)
    const colors = ['#ec4899', '#4f46e5', '#a855f7'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    bubble.style.border = `3px solid ${randomColor}`; 
    bubble.style.boxShadow = `0 0 15px ${randomColor}44`; 

    // 4. Random Speed
    const duration = Math.random() * 4 + 6 + "s";
    bubble.style.animation = `floatUp ${duration} linear forwards`;

    // 5. Interaction: Pop on Click!
    bubble.addEventListener('mousedown', () => {
        // Pop Effect
        bubble.style.transform = 'scale(1.8)';
        bubble.style.opacity = '0';
        bubble.style.transition = '0.15s';
        
        // Optional: Play pop sound here
        // new Audio('pop.mp3').play();

        setTimeout(() => bubble.remove(), 150);
    });

    document.body.appendChild(bubble);

    // Clean up after it leaves the screen
    setTimeout(() => {
        if(bubble.parentNode) bubble.remove();
    }, 11000);
}

// Spawn rate
setInterval(createBubble, 450);

// Global Animation Logic
const bubbleStyle = document.createElement('style');
bubbleStyle.innerHTML = `
    @keyframes floatUp {
        from { transform: translateY(0) rotate(0deg); }
        to { transform: translateY(-130vh) rotate(360deg); }
    }
`;
document.head.appendChild(bubbleStyle);
