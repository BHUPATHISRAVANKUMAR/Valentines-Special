// DOM Elements
const heartsContainer = document.getElementById('heartsContainer');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const celebrationOverlay = document.getElementById('celebrationOverlay');
const restartBtn = document.getElementById('restartBtn');
const musicBtn = document.getElementById('musicBtn');
const backgroundMusic = document.getElementById('backgroundMusic');
const celebrationSound = document.getElementById('celebrationSound');
const buttonsContainer = document.getElementById('buttonsContainer');

// Configuration
const FLIRT_MESSAGES = [
    "Wrong choice 😏", "Heart says YES", "No button is shy", 
    "Try YES instead", "System rejects NO", "Nice try cutie",
    "Are you sure?", "My heart says YES", "You're too beautiful to say no"
];

const RAIN_MESSAGES = [
    "I love you", "Forever mine", "My heart is yours", 
    "You complete me", "Soulmate found", "Perfect match",
    "Love unlocked", "Happiness overload", "Dreams come true",
    "You're my world", "Best decision ever", "My everything",
    "Always and forever", "Made for each other", "Endless love",
    "You're perfect", "My queen", "My king", "My universe",
    "Together forever", "Eternal love", "Unbreakable bond"
];

const ACHIEVEMENT_MESSAGES = [
    "LOVE WINS ❤️",
    "PERFECT MATCH 💞",
    "SOULMATES 💖",
    "FOREVER STARTS NOW 💍",
    "HEART UNLOCKED 🔓❤️"
   ];
   


// Settings
const ESCAPE_DISTANCE = 140;
const MAX_ESCAPE_ATTEMPTS = 15;

// State
let escapeAttempts = 0;
let isMusicPlaying = true;
let isCelebrationActive = false;
let activeAnimations = [];
let lastMoveTime = 0;
const MOVE_COOLDOWN = 300;
let rainLoopInterval = null;


// Initialize background music
function initMusic() {
    try {
        backgroundMusic.volume = 1.0;
        backgroundMusic.currentTime = 0;
        backgroundMusic.play().then(() => {
            isMusicPlaying = true;
            const icon = musicBtn.querySelector('i');
            icon.classList.remove('fa-volume-mute');
            icon.classList.add('fa-volume-up');
        }).catch(e => {
            console.log("Autoplay prevented.");
            isMusicPlaying = false;
        });
    } catch (e) {
        console.log("Music init error:", e);
    }
}

// Stop all audio
function stopAllAudio() {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    
    if (celebrationSound) {
        celebrationSound.pause();
        celebrationSound.currentTime = 0;
    }
    
    isMusicPlaying = false;
    const icon = musicBtn.querySelector('i');
    icon.classList.remove('fa-volume-up');
    icon.classList.add('fa-volume-mute');
}

// Create floating hearts background
function createHearts() {
    heartsContainer.innerHTML = '';
    const heartCount = window.innerWidth < 768 ? 20 : 40;
    
    for (let i = 0; i < heartCount; i++) {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.innerHTML = '❤️';
        
        const size = Math.random() * 30 + 20;
        const left = Math.random() * 100;
        const duration = Math.random() * 20 + 20;
        const delay = Math.random() * 15;
        
        heart.style.left = `${left}%`;
        heart.style.fontSize = `${size}px`;
        heart.style.animationDuration = `${duration}s`;
        heart.style.animationDelay = `${delay}s`;
        heart.style.opacity = Math.random() * 0.5 + 0.3;
        
        heartsContainer.appendChild(heart);
    }
}


// Reset NO button to initial position
function resetNoButton() {
    const containerRect = buttonsContainer.getBoundingClientRect();
    noBtn.style.left = `${containerRect.width * 0.7}px`;
    noBtn.style.top = `${containerRect.height * 0.5}px`;
    noBtn.style.transform = 'translate(-50%, -50%)';
    noBtn.style.opacity = '1';
    noBtn.style.filter = 'none';
    noBtn.style.transition = 'all 0.5s ease';
    
    escapeAttempts = 0;
}

// NO Button escape logic
function moveNoButton(e) {
    const now = Date.now();
    if (now - lastMoveTime < MOVE_COOLDOWN) return;
    lastMoveTime = now;
    
    const containerRect = buttonsContainer.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();
    
    // Calculate available space
    const maxX = containerRect.width - btnRect.width - 20;
    const maxY = containerRect.height - btnRect.height - 20;
    
    // Generate new random position
    let newX, newY;
    let attempts = 0;
    
    do {
        newX = Math.random() * maxX;
        newY = Math.random() * maxY;
        attempts++;
        
        // Try to move away from cursor
        if (e && attempts < 3) {
            const relativeX = e.clientX - containerRect.left;
            const relativeY = e.clientY - containerRect.top;
            
            // Move to opposite side
            if (relativeX < containerRect.width / 2) {
                newX = Math.random() * (maxX * 0.5) + (maxX * 0.5);
            } else {
                newX = Math.random() * (maxX * 0.5);
            }
            
            if (relativeY < containerRect.height / 2) {
                newY = Math.random() * (maxY * 0.5) + (maxY * 0.5);
            } else {
                newY = Math.random() * (maxY * 0.5);
            }
        }
        
    } while (attempts < 5);
    
    // Apply new position
    noBtn.style.transition = 'left 0.2s ease, top 0.2s ease';
    noBtn.style.left = `${newX}px`;
    noBtn.style.top = `${newY}px`;
    noBtn.style.transform = 'translate(0, 0)';
    
    // Show flirty message
    showFlirtyMessage(newX + btnRect.width/2, newY);
    
    escapeAttempts++;
    
    // Make button easier after many attempts
    if (escapeAttempts > MAX_ESCAPE_ATTEMPTS) {
        noBtn.style.opacity = '0.5';
        noBtn.style.filter = 'blur(2px)';
    }
}

// Show flirty popup message
function showFlirtyMessage(x, y) {
    const message = FLIRT_MESSAGES[Math.floor(Math.random() * FLIRT_MESSAGES.length)];
    const popup = document.createElement('div');
    popup.className = 'enhanced-popup';
    popup.textContent = message;
    
    popup.style.left = `${x}px`;
    popup.style.top = `${y - 90}px`;
    
    buttonsContainer.appendChild(popup);
    
    setTimeout(() => popup.remove(), 1000);
}

// Create rain messages (falling downwards slowly)
function createRainMessages() {
    const rainCount = 40;
    
    for (let i = 0; i < rainCount; i++) {
        setTimeout(() => {
            const rainMsg = document.createElement('div');
            rainMsg.className = 'rain-message';
            
            // Random message
            rainMsg.textContent = RAIN_MESSAGES[Math.floor(Math.random() * RAIN_MESSAGES.length)];
            
            // Random starting position (from top)
            const startLeft = Math.random() * 80 + 10; // 10% to 90%
            rainMsg.style.left = `${startLeft}%`;
            
            // Random animation duration (slow fall)
            const duration = Math.random() * 4 + 6; // 6-10 seconds
            rainMsg.style.animationDuration = `${duration}s`;
            
            // Random size
            const fontSize = Math.random() * 8 + 12; // 12-20px
            rainMsg.style.fontSize = `${fontSize}px`;
            
            // Random opacity
            rainMsg.style.opacity = Math.random() * 0.6 + 0.4;
            
            // Random color (white with slight variations)
            const hue = Math.random() * 30 + 330;
            rainMsg.style.color = `hsl(${hue}, 100%, ${Math.random() * 30 + 70}%)`;
            
            document.body.appendChild(rainMsg);
            activeAnimations.push(rainMsg);
            
            // Auto cleanup
            setTimeout(() => {
                if (rainMsg.parentNode) {
                    rainMsg.parentNode.removeChild(rainMsg);
                    const index = activeAnimations.indexOf(rainMsg);
                    if (index > -1) activeAnimations.splice(index, 1);
                }
            }, duration * 1000 + 100);
            
        }, i * 200); // Staggered start
    }
}

// Create small falling hearts
function createHeartRain() {
    const heartCount = 30;
    
    for (let i = 0; i < heartCount; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'rain-heart';
            heart.innerHTML = '❤️';
            
            // Random starting position
            heart.style.left = `${Math.random() * 100}%`;
            
            // Random animation duration
            const duration = Math.random() * 3 + 4; // 4-7 seconds
            heart.style.animationDuration = `${duration}s`;
            
            // Random size
            const fontSize = Math.random() * 10 + 10; // 10-20px
            heart.style.fontSize = `${fontSize}px`;
            
            document.body.appendChild(heart);
            activeAnimations.push(heart);
            
            // Auto cleanup
            setTimeout(() => {
                if (heart.parentNode) {
                    heart.parentNode.removeChild(heart);
                    const index = activeAnimations.indexOf(heart);
                    if (index > -1) activeAnimations.splice(index, 1);
                }
            }, duration * 1000 + 100);
            
        }, i * 150);
    }
}

// Create achievement messages
function createAchievementMessages() {
    const achievementCount = 10;
    
    for (let i = 0; i < achievementCount; i++) {
        setTimeout(() => {
            const msg = document.createElement('div');
            msg.className = 'achievement-message';
            msg.textContent = ACHIEVEMENT_MESSAGES[Math.floor(Math.random() * ACHIEVEMENT_MESSAGES.length)];
            
            msg.style.left = `${Math.random() * 70 + 15}vw`;
            msg.style.top = `${Math.random() * 40 + 10}vh`;
            msg.style.fontSize = `${Math.random() * 15 + 25}px`;
            
            const duration = Math.random() * 2 + 4;
            msg.style.animationDuration = `${duration}s`;
            
            document.body.appendChild(msg);
            activeAnimations.push(msg);
            
            setTimeout(() => {
                if (msg.parentNode) {
                    msg.parentNode.removeChild(msg);
                    const index = activeAnimations.indexOf(msg);
                    if (index > -1) activeAnimations.splice(index, 1);
                }
            }, duration * 1000 + 100);
            
        }, i * 400);
    }
}

// Play celebration audio
function playCelebrationAudio() {
    // Ensure background music is playing at max volume
    backgroundMusic.volume = 1.0;
    if (backgroundMusic.paused) {
        backgroundMusic.play().catch(e => console.log("Music play error:", e));
    }
    
    // Play celebration sound
    if (celebrationSound) {
        celebrationSound.volume = 0.7;
        celebrationSound.currentTime = 0;
        celebrationSound.play().catch(e => console.log("Celebration sound error:", e));
    }
}

// Reset entire celebration
function resetCelebration() {

    // 🛑 STOP MUSIC COMPLETELY
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;

    if (celebrationSound) {
        celebrationSound.pause();
        celebrationSound.currentTime = 0;
    }

    isMusicPlaying = false;

    // remove rain + animations
    activeAnimations.forEach(el => el.remove());
    activeAnimations = [];

    // hide overlay
    celebrationOverlay.classList.remove('active');

    // reset buttons
    resetNoButton();

    isCelebrationActive = false;
    escapeAttempts = 0;

    // recreate hearts background fresh
    createHearts();
}


// Show celebration overlay
function showCelebration() {
    if (isCelebrationActive) return;
    isCelebrationActive = true;

    // 🔊 FORCE PLAY MUSIC ON YES CLICK
    backgroundMusic.volume = 1.0;
    backgroundMusic.currentTime = 0;
    backgroundMusic.play().catch(() => {});
    isMusicPlaying = true;

    const icon = musicBtn.querySelector('i');
    icon.classList.remove('fa-volume-mute');
    icon.classList.add('fa-volume-up');

    // 🎉 effects
    createLoveRain();   // NEW rain system
    createHeartRain();
    createAchievementMessages();

    celebrationOverlay.classList.add('active');

    escapeAttempts = 0;
    noBtn.style.opacity = '1';
    noBtn.style.filter = 'none';
}


// Handle mouse movement
function handleMouseMove(e) {
    if (isCelebrationActive) return;
    
    const containerRect = buttonsContainer.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();
    
    const btnCenterX = btnRect.left - containerRect.left + btnRect.width/2;
    const btnCenterY = btnRect.top - containerRect.top + btnRect.height/2;
    
    const cursorX = e.clientX - containerRect.left;
    const cursorY = e.clientY - containerRect.top;
    
    // Check if cursor is inside container
    if (cursorX < 0 || cursorX > containerRect.width || cursorY < 0 || cursorY > containerRect.height) return;
    
    const distance = Math.sqrt(Math.pow(cursorX - btnCenterX, 2) + Math.pow(cursorY - btnCenterY, 2));
    
    if (distance < ESCAPE_DISTANCE) {
        moveNoButton(e);
    }
}

// Handle touch movement
function handleTouchMove(e) {
    if (isCelebrationActive) return;
    
    e.preventDefault();
    const touch = e.touches[0];
    
    const containerRect = buttonsContainer.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();
    
    const btnCenterX = btnRect.left - containerRect.left + btnRect.width/2;
    const btnCenterY = btnRect.top - containerRect.top + btnRect.height/2;
    
    const touchX = touch.clientX - containerRect.left;
    const touchY = touch.clientY - containerRect.top;
    
    const distance = Math.sqrt(Math.pow(touchX - btnCenterX, 2) + Math.pow(touchY - btnCenterY, 2));
    
    if (distance < ESCAPE_DISTANCE * 1.5) {
        moveNoButton({ clientX: touch.clientX, clientY: touch.clientY });
    }
}

// Music toggle
function toggleMusic() {
    const icon = musicBtn.querySelector('i');
    
    if (isMusicPlaying) {
        backgroundMusic.pause();
        icon.classList.remove('fa-volume-up');
        icon.classList.add('fa-volume-mute');
        isMusicPlaying = false;
    } else {
        backgroundMusic.volume = 1.0;
        backgroundMusic.play().then(() => {
            icon.classList.remove('fa-volume-mute');
            icon.classList.add('fa-volume-up');
            isMusicPlaying = true;
        }).catch(e => {
            console.log("Music play failed:", e);
        });
    }
}

// Initialize everything
function init() {
    createHearts();
    initMusic();
    
    // Initial button positions
    const containerRect = buttonsContainer.getBoundingClientRect();
    yesBtn.style.left = `${containerRect.width * 0.3}px`;
    yesBtn.style.top = `${containerRect.height * 0.5}px`;
    yesBtn.style.transform = 'translate(-50%, -50%)';
    
    resetNoButton();
    
    // Event Listeners
    buttonsContainer.addEventListener('mousemove', (e) => {
        if (!isCelebrationActive) {
            requestAnimationFrame(() => handleMouseMove(e));
        }
    });
    
    buttonsContainer.addEventListener('touchmove', handleTouchMove, { passive: false });
    
    yesBtn.addEventListener('click', showCelebration);
    
    noBtn.addEventListener('click', (e) => {
        if (isCelebrationActive) return;
        
        if (escapeAttempts > MAX_ESCAPE_ATTEMPTS) {
            showCelebration();
        } else {
            moveNoButton(e);
        }
    });
    
    restartBtn.addEventListener('click', resetCelebration);
    
    musicBtn.addEventListener('click', toggleMusic);
    
    // Enable audio on first user interaction
    document.addEventListener('click', function initAudio() {
        if (backgroundMusic.paused && !isMusicPlaying) {
            initMusic();
        }
        document.removeEventListener('click', initAudio);
    }, { once: true });
}

// Initialize on load
document.addEventListener('DOMContentLoaded', init);

// Handle window resize
window.addEventListener('resize', () => {
    createHearts();
    
    // Reset button positions if not in celebration
    if (!isCelebrationActive) {
        const containerRect = buttonsContainer.getBoundingClientRect();
        yesBtn.style.left = `${containerRect.width * 0.3}px`;
        yesBtn.style.top = `${containerRect.height * 0.5}px`;
        yesBtn.style.transform = 'translate(-50%, -50%)';
        
        resetNoButton();
    }
});

function createLoveRain() {

    const drops = 60;

    for (let i = 0; i < drops; i++) {
        setTimeout(() => {

            const msg = document.createElement("div");
            msg.className = "love-rain";

            msg.textContent =
                RAIN_MESSAGES[Math.floor(Math.random() * RAIN_MESSAGES.length)];

            // random horizontal position
            msg.style.left = Math.random() * 100 + "vw";

            // random speed (slow rain)
            const duration = Math.random() * 5 + 7;
            msg.style.animationDuration = duration + "s";

            // random size
            msg.style.fontSize = (Math.random() * 10 + 14) + "px";

            // color variation
            msg.style.color = `hsl(${330 + Math.random()*30},100%,70%)`;

            document.body.appendChild(msg);
            activeAnimations.push(msg);

            setTimeout(() => {
                msg.remove();
            }, duration * 1000);

        }, i * 120);
    }
}
