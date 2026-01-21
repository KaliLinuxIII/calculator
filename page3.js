// Display current timestamp when page loads
function displayTimestamp() {
    const timestamp = document.getElementById('timestamp');
    const now = new Date();
    const formattedTime = now.toLocaleString();
    timestamp.textContent = formattedTime;
}

// Morse code sequence tracking
const correctSequence = '- . . . . - . - - - - . - . - . -';
let currentSequence = '';
let holdStartTime = null;
let holdTimeout = null;
let isHolding = false;
let isOnCooldown = false;
let attemptCount = localStorage.getItem('page3Attempts') ? parseInt(localStorage.getItem('page3Attempts')) : 0;

// Flash the screen
function flashScreen(color) {
    const body = document.body;
    const welcomeBox = document.querySelector('.welcome-box');
    body.classList.remove('flash-blue', 'flash-green');
    welcomeBox.classList.remove('flash-border-blue', 'flash-border-green');
    
    // Trigger reflow to restart animation
    void body.offsetWidth;
    
    if (color === 'blue') {
        body.classList.add('flash-blue');
        welcomeBox.classList.add('flash-border-blue');
    } else if (color === 'green') {
        body.classList.add('flash-green');
        welcomeBox.classList.add('flash-border-green');
    }
    
    setTimeout(() => {
        body.classList.remove('flash-blue', 'flash-green');
        welcomeBox.classList.remove('flash-border-blue', 'flash-border-green');
    }, 800);
}

// Update attempts display
function updateAttemptsDisplay() {
    const attemptsDisplay = document.getElementById('attemptsDisplay');
    const codeBtn = document.getElementById('codeBtn');
    if (codeBtn.textContent === 'Input Code') {
        attemptsDisplay.textContent = `Attempts remaining: ${5 - attemptCount}`;
    } else {
        attemptsDisplay.textContent = '';
    }
}

// Update code display
function updateCodeDisplay() {
    const codeDisplay = document.getElementById('codeDisplay');
    codeDisplay.textContent = '';
}

// Logout function to return to calculator
function logout() {
    window.location.href = 'index.html';
}

// Button event listeners
const codeBtn = document.getElementById('codeBtn');

const handleHoldStart = (e) => {
    e.preventDefault();
    holdStartTime = Date.now();
    isHolding = true;
    
    // Don't allow Input Code mode if out of attempts
    if (attemptCount >= 5) {
        return;
    }
    
    // Set timeout for 3 seconds to change button text
    holdTimeout = setTimeout(() => {
        const enterBtn = document.getElementById('enterBtn');
        codeBtn.textContent = 'Input Code';
        enterBtn.style.display = 'block';
        updateAttemptsDisplay();
    }, 3000);
};

const handleHoldEnd = () => {
    if (!isHolding) return;
    
    isHolding = false;
    clearTimeout(holdTimeout);
    
    const holdDuration = Date.now() - holdStartTime;
    const isInInputMode = codeBtn.textContent === 'Input Code';
    const enterBtn = document.getElementById('enterBtn');
    
    // If out of attempts, redirect to homepage on any release
    if (attemptCount >= 5 && !isInInputMode) {
        window.location.href = 'page2.html';
        return;
    }
    
    // Only process input if button says "Input Code"
    if (isInInputMode && holdDuration < 3000) {
        if (holdDuration < 150) {
            // Tap (less than 0.15 second) = dot
            currentSequence += '. ';
            flashScreen('green');
        } else {
            // Hold (0.15 second or more) = dash
            currentSequence += '- ';
            flashScreen('blue');
        }
        updateCodeDisplay();
        
        // Start cooldown
        isOnCooldown = true;
        setTimeout(() => {
            isOnCooldown = false;
        }, 3000);
    } else if (holdDuration >= 3000 && !isInInputMode) {
        // Change to Input Code on first 3+ second hold
        codeBtn.textContent = 'Input Code';
        enterBtn.style.display = 'block';
        updateAttemptsDisplay();
    }
};

const handleHoldCancel = () => {
    clearTimeout(holdTimeout);
    isHolding = false;
};

codeBtn.addEventListener('mousedown', handleHoldStart);
codeBtn.addEventListener('touchstart', handleHoldStart, { passive: false });

codeBtn.addEventListener('mouseup', handleHoldEnd);
codeBtn.addEventListener('touchend', handleHoldEnd);
codeBtn.addEventListener('touchcancel', handleHoldCancel);

codeBtn.addEventListener('mouseleave', handleHoldCancel);

// Click handler for returning to home page
codeBtn.addEventListener('click', (e) => {
    if (codeBtn.textContent === 'Return to Login' && Date.now() - holdStartTime < 600) {
        window.location.href = 'page2.html';
    }
});

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    displayTimestamp();
    updateAttemptsDisplay();
    
    // Enter button click handler - attach immediately
    const enterBtn = document.getElementById('enterBtn');
    console.log('Enter button found:', enterBtn);
    
    enterBtn.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Enter button clicked!');
        console.log('Current sequence:', currentSequence);
        const attemptsDisplay = document.getElementById('attemptsDisplay');
        const codeDisplay = document.getElementById('codeDisplay');
        const symbolCount = currentSequence.trim().split(' ').filter(s => s.length > 0).length;
        console.log('Symbol count:', symbolCount);
        
        if (symbolCount >= 1) {
            console.log('Checking sequence...');
            if (currentSequence.trim() === correctSequence.trim()) {
                currentSequence = '';
                localStorage.setItem('page3Attempts', '0');
                attemptCount = 0;
                window.location.href = 'page4.html';
            } else {
                console.log('Incorrect sequence');
                attemptCount++;
                localStorage.setItem('page3Attempts', attemptCount);
                
                codeDisplay.textContent = 'Access Denied';
                codeDisplay.style.color = '#ff0000';
                currentSequence = '';
                
                if (attemptCount >= 5) {
                    attemptsDisplay.textContent = 'Too many failed attempts. Redirecting...';
                    attemptsDisplay.style.color = '#ff0000';
                    setTimeout(() => {
                        window.location.href = 'page2.html';
                    }, 2000);
                } else {
                    attemptsDisplay.textContent = `Attempts remaining: ${5 - attemptCount}`;
                    attemptsDisplay.style.color = '#ff0000';
                    
                    setTimeout(() => {
                        codeDisplay.textContent = '';
                        codeDisplay.style.color = '#00ffff';
                        attemptsDisplay.textContent = `Attempts remaining: ${5 - attemptCount}`;
                        attemptsDisplay.style.color = '#ffff00';
                    }, 1500);
                }
            }
        } else {
            console.log('No symbols entered');
        }
    };
});
