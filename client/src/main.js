// Main entry point for the Meeting Breaker game
import { Game } from './game/game.js';

let game;

function initGame() {
    try {
        game = new Game();
        console.log('Meeting Breaker game initialized successfully');
    } catch (error) {
        console.error('Failed to initialize game:', error);
        showError('Failed to initialize game. Please refresh the page.');
    }
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #dc3545;
        color: white;
        padding: 20px;
        border-radius: 10px;
        text-align: center;
        z-index: 1000;
        font-family: Inter, Arial, sans-serif;
    `;
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
}

// Initialize game when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
} else {
    initGame();
}

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (game) {
        if (document.hidden) {
            game.pause();
        } else {
            // Don't auto-resume, let player choose
        }
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    if (game) {
        game.resize();
    }
});

// Prevent context menu on right click
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// Export for debugging
window.game = game;
