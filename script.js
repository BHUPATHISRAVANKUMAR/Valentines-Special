// ========================================
// GLOBAL VARIABLES
// ========================================
let escapeCount = 0;
let musicPlaying = false;
let lovePercentage = 0;
const bgMusic = document.getElementById('bgMusic');

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initFloatingHearts();
    initLoveMeter();
    initButtons();
    initMusicToggle();
    init3DEffects();
    initScrollAnimations();
});

// ========================================
// 3D PARTICLES SYSTEM
// ========================================
function initParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = window.innerWidth < 768 ? 30 : 50;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle(particlesContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.style.position = 'absolute';
    particle.style.width = Math.random() * 4 + 2 + 'px';
    particle.style.height = particle.style.width;
    particle.style.background = getRandomColor();
    particle.style.borderRadius = '50%';
    particle.style.boxShadow = `0 0 10px ${getRandomColor()}`;
    
    const startX = Math.random() * 100;
    const startY = Math.random() * 100;
    const endX = Math.random() * 100;
    const endY = Math.random() * 100;
    const duration = Math.random() * 10 + 10;
    const delay = Math.random() * 5;
    
    particle.style.left = startX + '%';
    particle.style.top = startY + '%';
    
    particle.animate([
        { 
            left: startX + '%', 
            top: startY + '%',
            opacity: 0
        },
        { 
            opacity: 0.8,
            offset: 0.1
        },
        { 
            left: endX + '%', 
            top: endY + '%',
            opacity: 0
        }
    ], {
        duration: duration * 1000,
        delay: delay * 1000,
        iterations: Infinity,
        easing: 'ease-in-out'
    });
    
    container.appendChild(particle);
}

function getRandomColor() {
    const colors = [
        'rgba(255, 10, 120, 0.6)',
        'rgba(139, 92, 246, 0.6)',
        'rgba(236, 72, 153, 0.6)',
        'rgba(255, 255, 255, 0.6)'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

// ========================================
// FLOATING HEARTS
// ========================================
function initFloatingHearts() {
    const container = document.getElementById('floatingHearts');
    
    setInterval(() => {
        if (document.querySelectorAll('.heart-float').length < 15) {
            createFloatingHeart(container);
        }
    }, 2000);
}

function createFloatingHeart(container) {
    const heart = document.createElement('div');
    heart.className = 'heart-float';
    heart.textContent = ['❤️', '💕', '💖', '💗', '💝'][Math.floor(Math.random() * 5)];
    heart.style.left = Math.random() * 100 + '%';
    heart.style.fontSize = (Math.random() * 2 + 1) + 'rem';
    
    container.appendChild(heart);
    
    setTimeout(() => {
        heart.remove();
    }, 4000);
}

// ========================================
// LOVE METER ANIMATION
// ========================================
function initLoveMeter() {
    const meterFill = document.getElementById('meterFill');
    const lovePercentageEl = document.getElementById('lovePercentage');
    
    // Animate to 100% over 3 seconds
    setTimeout(() => {
        meterFill.style.width = '100%';
        
        const interval = setInterval(() => {
            if (lovePercentage < 100) {
                lovePercentage++;
                lovePercentageEl.textContent = lovePercentage;
            } else {
                // Continue to infinity symbol
                setTimeout(() => {
                    lovePercentageEl.textContent = '∞';
                }, 500);
                clearInterval(interval);
            }
        }, 300);
    }, 500);
}

// ========================================
// INTERACTIVE BUTTONS
// ========================================
function initButtons() {
    const yesBtn = document.getElementById('yesBtn');
    const noBtn = document.getElementById('noBtn');
    const buttonPlayground = document.getElementById('buttonPlayground');
    const escapeCountEl = document.getElementById('escapeCount');
    
    // YES Button Click
    yesBtn.addEventListener('click', () => {
        triggerCelebration();
    });
    
    // NO Button Hover - Make it run away
    noBtn.addEventListener('mouseenter', (e) => {
        escapeCount++;
        escapeCountEl.textContent = escapeCount;
        moveNoButton(noBtn, buttonPlayground);
        
        // Make YES button bigger each time
        const currentScale = 1 + (escapeCount * 0.1);
        yesBtn.style.transform = `scale(${currentScale})`;
        
        // Change NO button text based on attempts
        updateNoButtonText(noBtn, escapeCount);
    });
    
    // NO Button Click - Still runs away
    noBtn.addEventListener('click', (e) => {
        e.preventDefault();
        escapeCount++;
        escapeCountEl.textContent = escapeCount;
        moveNoButton(noBtn, buttonPlayground);
        
        // Make YES button bigger
        const currentScale = 1 + (escapeCount * 0.1);
        yesBtn.style.transform = `scale(${currentScale})`;
        
        // Add shake animation to NO button
        noBtn.style.animation = 'shake 0.5s';
        setTimeout(() => {
            noBtn.style.animation = '';
        }, 500);
        
        updateNoButtonText(noBtn, escapeCount);
    });
    
    // Touch support for mobile
    noBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        escapeCount++;
        escapeCountEl.textContent = escapeCount;
        moveNoButton(noBtn, buttonPlayground);
        
        const currentScale = 1 + (escapeCount * 0.1);
        yesBtn.style.transform = `scale(${currentScale})`;
        
        updateNoButtonText(noBtn, escapeCount);
    });
}

function moveNoButton(noBtn, container) {
    const containerRect = container.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();
    
    // Calculate max positions to keep button in container
    const maxX = containerRect.width - btnRect.width;
    const maxY = containerRect.height - btnRect.height;
    
    // Random position
    const newX = Math.random() * maxX;
    const newY = Math.random() * maxY;
    
    // Apply new position
    noBtn.style.left = newX + 'px';
    noBtn.style.top = newY + 'px';
    
    // Add rotation animation
    const randomRotation = (Math.random() - 0.5) * 30;
    noBtn.style.transform = `translate(-50%, -50%) rotate(${randomRotation}deg)`;
    
    // Create heart burst effect at old position
    createHeartBurst(btnRect.left + btnRect.width / 2, btnRect.top + btnRect.height / 2);
}

function updateNoButtonText(noBtn, count) {
    const messages = [
        'No 😢',
        'No 😢',
        'No 😢',
        'No 😢',
        'Are you sure? 🥺',
        'No 😢',
        'No 😢',
        'Really? 😭',
        'Are you sure? 🥺',
        'Think again! 💔',
        'Please? 🙏',
        'One more try? 🥹',
        'Come on! 😊',
        'You know you want to... 😏',
        'Just say YES! 💕',
        'I believe in us! ✨',
        'No 😢'
    ];
    
    const textSpan = noBtn.querySelector('.btn-text');
    if (count < messages.length) {
        textSpan.textContent = messages[count];
    } else {
        textSpan.textContent = messages[messages.length - 1];
    }
}

function createHeartBurst(x, y) {
    for (let i = 0; i < 5; i++) {
        const heart = document.createElement('div');
        heart.textContent = '💕';
        heart.style.position = 'fixed';
        heart.style.left = x + 'px';
        heart.style.top = y + 'px';
        heart.style.fontSize = '1.5rem';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '9999';
        
        document.body.appendChild(heart);
        
        const angle = (Math.PI * 2 * i) / 5;
        const distance = 50 + Math.random() * 50;
        const endX = x + Math.cos(angle) * distance;
        const endY = y + Math.sin(angle) * distance;
        
        heart.animate([
            { 
                left: x + 'px', 
                top: y + 'px',
                opacity: 1,
                transform: 'scale(0)'
            },
            { 
                left: endX + 'px', 
                top: endY + 'px',
                opacity: 0,
                transform: 'scale(1.5) rotate(360deg)'
            }
        ], {
            duration: 1000,
            easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        });
        
        setTimeout(() => heart.remove(), 1000);
    }
}

// ========================================
// CELEBRATION
// ========================================
function triggerCelebration() {
    const overlay = document.getElementById('celebrationOverlay');
    const confettiContainer = document.getElementById('confetti');
    
    // Show overlay
    overlay.classList.add('active');
    
    // Play celebration music
    if (bgMusic) {
        bgMusic.currentTime = 0;
        bgMusic.play();
    }
    
    // Create confetti
    createConfetti(confettiContainer, 100);
    
    // Create heart explosion
    createMassiveHeartExplosion();
    
    // Continuous confetti for celebration
    const confettiInterval = setInterval(() => {
        createConfetti(confettiContainer, 20);
    }, 500);
    
    // Stop after 10 seconds
    setTimeout(() => {
        clearInterval(confettiInterval);
    }, 10000);
    
    // Restart button
    const restartBtn = document.getElementById('restartBtn');
    restartBtn.addEventListener('click', () => {
        overlay.classList.remove('active');
        resetProposal();
    });
    
    // Share button
    const shareBtn = document.getElementById('shareBtn');
    shareBtn.addEventListener('click', () => {
        takeScreenshot();
    });
}

function createConfetti(container, count) {
    const colors = ['#ff0a78', '#ff6fb5', '#8b5cf6', '#ec4899', '#ffd700'];
    const shapes = ['circle', 'square', 'triangle'];
    
    for (let i = 0; i < count; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.background = color;
        confetti.style.width = (Math.random() * 10 + 5) + 'px';
        confetti.style.height = confetti.style.width;
        
        if (shape === 'triangle') {
            confetti.style.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
        } else if (shape === 'circle') {
            confetti.style.borderRadius = '50%';
        }
        
        confetti.style.animationDelay = Math.random() * 2 + 's';
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
        
        container.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 5000);
    }
}

function createMassiveHeartExplosion() {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            createHeartBurst(centerX, centerY);
        }, i * 100);
    }
}

function resetProposal() {
    escapeCount = 0;
    document.getElementById('escapeCount').textContent = '0';
    
    const yesBtn = document.getElementById('yesBtn');
    const noBtn = document.getElementById('noBtn');
    
    yesBtn.style.transform = 'scale(1)';
    noBtn.querySelector('.btn-text').textContent = 'No 😢';
    
    // Reset positions
    noBtn.style.left = '70%';
    noBtn.style.top = '50%';
    
    // Clear confetti
    document.getElementById('confetti').innerHTML = '';
}

function takeScreenshot() {
    alert('💕 This beautiful moment is saved in your heart forever! Take a screenshot to keep it forever! 💕');
}

// ========================================
// MUSIC TOGGLE
// ========================================
function initMusicToggle() {
    const musicToggle = document.getElementById('musicToggle');
    const musicStatus = musicToggle.querySelector('.music-status');
    const musicIcon = musicToggle.querySelector('i');
    
    musicToggle.addEventListener('click', () => {
        if (musicPlaying) {
            bgMusic.pause();
            musicPlaying = false;
            musicStatus.textContent = 'Play Romance';
            musicIcon.className = 'fas fa-music';
        } else {
            bgMusic.play();
            musicPlaying = true;
            musicStatus.textContent = 'Playing...';
            musicIcon.className = 'fas fa-volume-up';
        }
    });
}

// ========================================
// 3D TILT EFFECT FOR CARDS
// ========================================
function init3DEffects() {
    const cards = document.querySelectorAll('[data-tilt]');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', handleTilt);
        card.addEventListener('mouseleave', resetTilt);
    });
}

function handleTilt(e) {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
}

function resetTilt(e) {
    const card = e.currentTarget;
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
}

// ========================================
// SCROLL ANIMATIONS
// ========================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe sections
    const sections = document.querySelectorAll('.messages-section, .love-meter-section, .proposal-section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        section.style.transition = 'all 0.8s ease-out';
        observer.observe(section);
    });
}

// ========================================
// SCROLL INDICATOR
// ========================================
const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
        document.querySelector('.messages-section').scrollIntoView({ 
            behavior: 'smooth' 
        });
    });
}

// ========================================
// MOBILE TOUCH OPTIMIZATION
// ========================================
if ('ontouchstart' in window) {
    // Disable hover effects on touch devices for better performance
    document.body.classList.add('touch-device');
    
    // Add touch feedback
    const buttons = document.querySelectorAll('button');
    buttons.forEach(btn => {
        btn.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.95)';
        });
        btn.addEventListener('touchend', function() {
            setTimeout(() => {
                this.style.transform = '';
            }, 100);
        });
    });
}

// ========================================
// PERFORMANCE OPTIMIZATION
// ========================================
// Reduce animations on low-end devices
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--animation-speed', '0');
}

// Pause animations when page is not visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        if (musicPlaying) {
            bgMusic.pause();
        }
    } else {
        if (musicPlaying) {
            bgMusic.play();
        }
    }
});

// ========================================
// EASTER EGGS
// ========================================
let clickCount = 0;
const logo = document.querySelector('.nav-logo');

if (logo) {
    logo.addEventListener('click', () => {
        clickCount++;
        if (clickCount === 5) {
            createMassiveHeartExplosion();
            alert('💕 You found the secret! You really love exploring, don\'t you? Just like how I love you! 💕');
            clickCount = 0;
        }
    });
}

// Konami Code Easter Egg
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join('') === konamiSequence.join('')) {
        triggerCelebration();
        alert('🎉 Konami Code Activated! You\'re a true gamer at heart! 🎮');
    }
});

// ========================================
// RESPONSIVE ADJUSTMENTS
// ========================================
function handleResize() {
    const width = window.innerWidth;
    
    // Adjust particle count based on screen size
    if (width < 768) {
        document.documentElement.style.setProperty('--particle-count', '30');
    } else {
        document.documentElement.style.setProperty('--particle-count', '50');
    }
}

window.addEventListener('resize', debounce(handleResize, 250));

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ========================================
// LOADING ANIMATION
// ========================================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Auto-play music on user interaction (browsers require user gesture)
    const startMusicOnInteraction = () => {
        if (!musicPlaying) {
            bgMusic.play().catch(() => {
                // If autoplay fails, it's fine
            });
            musicPlaying = true;
        }
        document.removeEventListener('click', startMusicOnInteraction);
        document.removeEventListener('touchstart', startMusicOnInteraction);
    };
    
    document.addEventListener('click', startMusicOnInteraction, { once: true });
    document.addEventListener('touchstart', startMusicOnInteraction, { once: true });
});

// Add CSS shake animation
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translate(-50%, -50%) translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translate(-50%, -50%) translateX(-10px); }
        20%, 40%, 60%, 80% { transform: translate(-50%, -50%) translateX(10px); }
    }
    
    .touch-device * {
        -webkit-tap-highlight-color: rgba(255, 10, 120, 0.3);
    }
    
    body.loaded {
        animation: fadeIn 0.5s ease-in;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;
document.head.appendChild(style);

console.log('💕 Website loaded with love! 💕');
console.log('Made with ❤️ for the most amazing person in the universe!');
