export class GameStates {
    constructor(game) {
        this.game = game;
        this.init();
    }
    
    init() {
        this.setupMenuHandlers();
        this.setupInstructionsHandlers();
        this.setupGameOverHandlers();
        this.setupPauseHandlers();
    }
    
    setupMenuHandlers() {
        const startButton = document.getElementById('startButton');
        const instructionsButton = document.getElementById('instructionsButton');
        const difficultySelect = document.getElementById('difficultySelect');
        
        if (startButton) {
            startButton.addEventListener('click', () => {
                const difficulty = difficultySelect ? difficultySelect.value : 'office';
                this.hideMenu();
                this.game.startGame(difficulty);
            });
        }
        
        if (instructionsButton) {
            instructionsButton.addEventListener('click', () => {
                this.hideMenu();
                this.showInstructions();
            });
        }
    }
    
    setupInstructionsHandlers() {
        const backButton = document.getElementById('backButton');
        
        if (backButton) {
            backButton.addEventListener('click', () => {
                this.hideInstructions();
                this.showMenu();
            });
        }
    }
    
    setupGameOverHandlers() {
        const restartButton = document.getElementById('restartButton');
        const menuButton = document.getElementById('menuButton');
        
        if (restartButton) {
            restartButton.addEventListener('click', () => {
                this.hideGameOver();
                this.game.restart();
            });
        }
        
        if (menuButton) {
            menuButton.addEventListener('click', () => {
                this.hideGameOver();
                this.game.showMenu();
            });
        }
    }
    
    setupPauseHandlers() {
        const resumeButton = document.getElementById('resumeButton');
        const pauseMenuButton = document.getElementById('pauseMenuButton');
        
        if (resumeButton) {
            resumeButton.addEventListener('click', () => {
                this.game.resume();
            });
        }
        
        if (pauseMenuButton) {
            pauseMenuButton.addEventListener('click', () => {
                this.hidePause();
                this.game.showMenu();
            });
        }
    }
    
    showMenu() {
        this.hideAll();
        const menuScreen = document.getElementById('menuScreen');
        if (menuScreen) {
            menuScreen.classList.remove('hidden');
        }
    }
    
    hideMenu() {
        const menuScreen = document.getElementById('menuScreen');
        if (menuScreen) {
            menuScreen.classList.add('hidden');
        }
    }
    
    showInstructions() {
        this.hideAll();
        const instructionsScreen = document.getElementById('instructionsScreen');
        if (instructionsScreen) {
            instructionsScreen.classList.remove('hidden');
        }
    }
    
    hideInstructions() {
        const instructionsScreen = document.getElementById('instructionsScreen');
        if (instructionsScreen) {
            instructionsScreen.classList.add('hidden');
        }
    }
    
    showGameOver() {
        this.hideAll();
        
        // Update game over content
        const gameOverTitle = document.getElementById('gameOverTitle');
        const finalScore = document.getElementById('finalScore');
        const gameOverMessage = document.getElementById('gameOverMessage');
        
        if (gameOverTitle) {
            gameOverTitle.textContent = this.game.level > 5 ? 'Great Job!' : 'Game Over';
        }
        
        if (finalScore) {
            const scoreSpan = finalScore.querySelector('span');
            if (scoreSpan) {
                scoreSpan.textContent = this.game.score.toLocaleString();
            }
        }
        
        if (gameOverMessage) {
            gameOverMessage.textContent = this.getGameOverMessage();
        }
        
        const gameOverScreen = document.getElementById('gameOverScreen');
        if (gameOverScreen) {
            gameOverScreen.classList.remove('hidden');
        }
    }
    
    hideGameOver() {
        const gameOverScreen = document.getElementById('gameOverScreen');
        if (gameOverScreen) {
            gameOverScreen.classList.add('hidden');
        }
    }
    
    showPause() {
        const pauseScreen = document.getElementById('pauseScreen');
        if (pauseScreen) {
            pauseScreen.classList.remove('hidden');
        }
    }
    
    hidePause() {
        const pauseScreen = document.getElementById('pauseScreen');
        if (pauseScreen) {
            pauseScreen.classList.add('hidden');
        }
    }
    
    hideAll() {
        const screens = [
            'menuScreen',
            'instructionsScreen', 
            'gameOverScreen',
            'pauseScreen'
        ];
        
        screens.forEach(screenId => {
            const screen = document.getElementById(screenId);
            if (screen) {
                screen.classList.add('hidden');
            }
        });
    }
    
    getGameOverMessage() {
        const level = this.game.level;
        const score = this.game.score;
        
        if (level === 1 && score < 1000) {
            return "Don't worry, even the best programmers struggle with meetings!";
        } else if (level <= 3) {
            return "Not bad! You're getting the hang of meeting destruction.";
        } else if (level <= 5) {
            return "Impressive! You're a meeting-breaking machine!";
        } else if (level <= 8) {
            return "Amazing! You've mastered the art of calendar clearing!";
        } else {
            return "Legendary! You're the ultimate meeting destroyer!";
        }
    }
    
    showMessage(text, duration = 3000) {
        // Create temporary message overlay
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 20px 30px;
            border-radius: 15px;
            font-size: 18px;
            font-weight: bold;
            z-index: 200;
            text-align: center;
            animation: messageAppear 0.3s ease-out;
        `;
        
        messageDiv.textContent = text;
        document.body.appendChild(messageDiv);
        
        // Add CSS animation
        if (!document.getElementById('messageAnimation')) {
            const style = document.createElement('style');
            style.id = 'messageAnimation';
            style.textContent = `
                @keyframes messageAppear {
                    from {
                        opacity: 0;
                        transform: translate(-50%, -50%) scale(0.8);
                    }
                    to {
                        opacity: 1;
                        transform: translate(-50%, -50%) scale(1);
                    }
                }
                @keyframes messageDisappear {
                    from {
                        opacity: 1;
                        transform: translate(-50%, -50%) scale(1);
                    }
                    to {
                        opacity: 0;
                        transform: translate(-50%, -50%) scale(0.8);
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Remove after duration
        setTimeout(() => {
            messageDiv.style.animation = 'messageDisappear 0.3s ease-out';
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.parentNode.removeChild(messageDiv);
                }
            }, 300);
        }, duration);
    }
}
