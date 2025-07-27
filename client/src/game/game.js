import { Ball } from './ball.js';
import { Paddle } from './paddle.js';
import { Meeting } from './meeting.js';
import { PowerUp } from './powerup.js';
import { SoundManager } from './soundManager.js';
import { InputManager } from './inputManager.js';
import { GameStates } from './gameStates.js';

export class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Game state
        this.state = 'menu'; // menu, playing, paused, gameOver
        this.score = 0;
        this.level = 1;
        this.lives = 3;
        this.difficulty = 'office'; // office, remote, freelance
        
        // Game objects
        this.ball = null;
        this.paddle = null;
        this.meetings = [];
        this.powerUps = [];
        this.particles = [];
        
        // Active effects
        this.activeEffects = new Map();
        
        // Timing
        this.lastTime = 0;
        this.gameStartTime = 0;
        
        // Initialize managers
        this.soundManager = new SoundManager();
        this.inputManager = new InputManager(this);
        this.gameStates = new GameStates(this);
        
        this.init();
    }
    
    init() {
        this.setupCanvas();
        this.setupEventListeners();
        this.gameStates.showMenu();
        this.gameLoop();
    }
    
    setupCanvas() {
        // Set canvas size based on screen
        const maxWidth = Math.min(window.innerWidth * 0.9, 800);
        const maxHeight = Math.min(window.innerHeight * 0.9, 600);
        
        this.canvas.width = maxWidth;
        this.canvas.height = maxHeight;
        
        // Store canvas dimensions for game objects
        this.width = this.canvas.width;
        this.height = this.canvas.height;
    }
    
    setupEventListeners() {
        // UI button handlers are set up in GameStates
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && this.state === 'playing') {
                e.preventDefault();
                this.pause();
            }
            if (e.code === 'Escape') {
                e.preventDefault();
                if (this.state === 'playing') {
                    this.pause();
                } else if (this.state === 'paused') {
                    this.resume();
                }
            }
        });
    }
    
    startGame(difficulty = 'office') {
        this.difficulty = difficulty;
        this.state = 'playing';
        this.score = 0;
        this.level = 1;
        this.lives = 3;
        this.gameStartTime = Date.now();
        
        this.initGameObjects();
        this.generateMeetings();
        this.updateUI();
        this.soundManager.playBackgroundMusic();
        
        console.log(`Game started with difficulty: ${difficulty}`);
    }
    
    initGameObjects() {
        // Create ball
        this.ball = new Ball(
            this.width / 2,
            this.height - 100,
            5,
            this.getDifficultySettings().ballSpeed
        );
        
        // Create paddle
        this.paddle = new Paddle(
            this.width / 2 - 50,
            this.height - 30,
            100,
            15
        );
        
        // Clear arrays
        this.meetings = [];
        this.powerUps = [];
        this.particles = [];
        this.activeEffects.clear();
    }
    
    getDifficultySettings() {
        const settings = {
            office: {
                ballSpeed: 4,
                paddleSpeed: 6,
                meetingRows: 4,
                urgentChance: 0.1,
                endlessChance: 0.15,
                deadlineChance: 0.1
            },
            remote: {
                ballSpeed: 5,
                paddleSpeed: 4,
                meetingRows: 5,
                urgentChance: 0.15,
                endlessChance: 0.2,
                deadlineChance: 0.08
            },
            freelance: {
                ballSpeed: 3,
                paddleSpeed: 7,
                meetingRows: 3,
                urgentChance: 0.05,
                endlessChance: 0.1,
                deadlineChance: 0.2
            }
        };
        
        return settings[this.difficulty] || settings.office;
    }
    
    generateMeetings() {
        const settings = this.getDifficultySettings();
        const rows = settings.meetingRows + Math.floor(this.level / 3);
        const cols = 8;
        const blockWidth = 90;
        const blockHeight = 25;
        const padding = 5;
        const startX = (this.width - (cols * (blockWidth + padding) - padding)) / 2;
        const startY = 50;
        
        this.meetings = [];
        
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const x = startX + col * (blockWidth + padding);
                const y = startY + row * (blockHeight + padding);
                
                // Determine meeting type based on difficulty and randomness
                let type = 'normal';
                const rand = Math.random();
                
                if (rand < settings.urgentChance) {
                    type = 'urgent';
                } else if (rand < settings.urgentChance + settings.endlessChance) {
                    type = 'endless';
                } else if (rand < settings.urgentChance + settings.endlessChance + settings.deadlineChance) {
                    type = 'deadline';
                }
                
                this.meetings.push(new Meeting(x, y, blockWidth, blockHeight, type));
            }
        }
        
        console.log(`Generated ${this.meetings.length} meetings for level ${this.level}`);
    }
    
    update(deltaTime) {
        if (this.state !== 'playing') return;
        
        // Update game objects
        this.ball.update(deltaTime);
        this.paddle.update(deltaTime);
        
        // Update meetings (for urgent ones that expire)
        this.meetings.forEach(meeting => meeting.update(deltaTime));
        this.meetings = this.meetings.filter(meeting => !meeting.shouldRemove);
        
        // Update power-ups
        this.powerUps.forEach(powerUp => powerUp.update(deltaTime));
        this.powerUps = this.powerUps.filter(powerUp => !powerUp.shouldRemove);
        
        // Update particles
        this.particles.forEach(particle => particle.update(deltaTime));
        this.particles = this.particles.filter(particle => particle.life > 0);
        
        // Update active effects
        this.updateActiveEffects(deltaTime);
        
        // Handle collisions
        this.handleCollisions();
        
        // Check win/lose conditions
        this.checkGameConditions();
        
        // Handle input
        this.inputManager.update();
    }
    
    updateActiveEffects(deltaTime) {
        for (const [effectType, effect] of this.activeEffects) {
            effect.duration -= deltaTime;
            
            if (effect.duration <= 0) {
                this.removeEffect(effectType);
            }
        }
    }
    
    handleCollisions() {
        // Ball vs walls
        if (this.ball.x <= this.ball.radius || this.ball.x >= this.width - this.ball.radius) {
            this.ball.vx = -this.ball.vx;
            this.soundManager.playHit();
        }
        
        if (this.ball.y <= this.ball.radius) {
            this.ball.vy = -this.ball.vy;
            this.soundManager.playHit();
        }
        
        // Ball vs paddle
        if (this.ball.y + this.ball.radius >= this.paddle.y &&
            this.ball.x >= this.paddle.x &&
            this.ball.x <= this.paddle.x + this.paddle.width &&
            this.ball.vy > 0) {
            
            // Calculate bounce angle based on hit position
            const hitPos = (this.ball.x - this.paddle.x) / this.paddle.width;
            const bounceAngle = (hitPos - 0.5) * Math.PI / 3; // Max 60 degrees
            
            const speed = Math.sqrt(this.ball.vx * this.ball.vx + this.ball.vy * this.ball.vy);
            this.ball.vx = Math.sin(bounceAngle) * speed;
            this.ball.vy = -Math.abs(Math.cos(bounceAngle) * speed);
            
            this.soundManager.playHit();
        }
        
        // Ball vs meetings - always bounce back toward paddle
        this.meetings.forEach((meeting, index) => {
            if (this.ball.x + this.ball.radius >= meeting.x &&
                this.ball.x - this.ball.radius <= meeting.x + meeting.width &&
                this.ball.y + this.ball.radius >= meeting.y &&
                this.ball.y - this.ball.radius <= meeting.y + meeting.height) {
                
                // Always bounce ball back toward paddle (downward)
                const speed = Math.sqrt(this.ball.vx * this.ball.vx + this.ball.vy * this.ball.vy);
                
                // Calculate angle based on where ball hit the meeting horizontally
                const hitX = this.ball.x - (meeting.x + meeting.width / 2);
                const normalizedHitX = hitX / (meeting.width / 2); // -1 to 1
                const bounceAngle = normalizedHitX * Math.PI / 6; // Max 30 degrees
                
                // Set new velocity toward paddle
                this.ball.vx = Math.sin(bounceAngle) * speed * 0.8;
                this.ball.vy = Math.abs(Math.cos(bounceAngle) * speed); // Always positive (downward)
                
                // Hit the meeting
                this.hitMeeting(meeting, index);
            }
        });
        
        // Paddle vs power-ups
        this.powerUps.forEach((powerUp, index) => {
            if (powerUp.x + powerUp.width >= this.paddle.x &&
                powerUp.x <= this.paddle.x + this.paddle.width &&
                powerUp.y + powerUp.height >= this.paddle.y &&
                powerUp.y <= this.paddle.y + this.paddle.height) {
                
                this.collectPowerUp(powerUp);
                this.powerUps.splice(index, 1);
            }
        });
        
        // Ball falls below paddle
        if (this.ball.y > this.height + 50) {
            this.loseLife();
        }
    }
    
    hitMeeting(meeting, index) {
        meeting.hit();
        this.soundManager.playHit();
        
        // Create particles
        this.createParticles(meeting.x + meeting.width / 2, meeting.y + meeting.height / 2, meeting.getColor());
        
        if (meeting.shouldRemove) {
            // Award points
            const points = this.getMeetingPoints(meeting.type);
            this.score += points;
            
            // Show floating score
            this.showFloatingScore(meeting.x + meeting.width / 2, meeting.y, points);
            
            // Chance to drop power-up
            if (Math.random() < 0.15) {
                this.dropPowerUp(meeting.x + meeting.width / 2, meeting.y + meeting.height);
            }
            
            // Remove meeting
            this.meetings.splice(index, 1);
            
            this.soundManager.playSuccess();
        }
        
        this.updateUI();
    }
    
    getMeetingPoints(type) {
        const basePoints = 100;
        const multipliers = {
            normal: 1,
            urgent: 1.5,
            endless: 2,
            deadline: 3
        };
        
        return Math.floor(basePoints * (multipliers[type] || 1) * this.level);
    }
    
    dropPowerUp(x, y) {
        const powerUpTypes = ['coffee', 'autoresponder', 'error', 'meetingroom'];
        const type = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
        
        this.powerUps.push(new PowerUp(x - 15, y, 30, 30, type));
    }
    
    collectPowerUp(powerUp) {
        this.applyEffect(powerUp.type);
        this.soundManager.playSuccess();
        
        // Show message
        this.showMessage(this.getPowerUpMessage(powerUp.type));
    }
    
    applyEffect(type) {
        const effects = {
            coffee: () => {
                this.ball.speedMultiplier = 1.5;
                this.activeEffects.set('coffee', { duration: 10000, type: 'coffee' });
                this.updatePowerUpDisplay();
            },
            autoresponder: () => {
                this.paddle.widthMultiplier = 1.5;
                this.activeEffects.set('autoresponder', { duration: 15000, type: 'autoresponder' });
                this.updatePowerUpDisplay();
            },
            error: () => {
                this.ball.speedMultiplier = 0.7;
                this.activeEffects.set('error', { duration: 8000, type: 'error' });
                this.updatePowerUpDisplay();
            },
            meetingroom: () => {
                this.ball.vx = -this.ball.vx;
                this.ball.vy = -this.ball.vy;
                // No duration effect, just instant direction change
            }
        };
        
        if (effects[type]) {
            effects[type]();
        }
    }
    
    removeEffect(type) {
        switch (type) {
            case 'coffee':
                this.ball.speedMultiplier = 1;
                break;
            case 'autoresponder':
                this.paddle.widthMultiplier = 1;
                break;
            case 'error':
                this.ball.speedMultiplier = 1;
                break;
        }
        
        this.activeEffects.delete(type);
        this.updatePowerUpDisplay();
    }
    
    getPowerUpMessage(type) {
        const messages = {
            coffee: 'Coffee boost! ☕',
            autoresponder: 'Auto-responder active! 📞',
            error: 'Critical error! ⚠️',
            meetingroom: 'Meeting room confusion! 🏢'
        };
        
        return messages[type] || 'Power-up collected!';
    }
    
    loseLife() {
        this.lives--;
        this.updateUI();
        
        if (this.lives <= 0) {
            this.gameOver();
        } else {
            // Reset ball position
            this.ball.reset(this.width / 2, this.height - 100);
            this.showMessage(`Lives remaining: ${this.lives}`);
        }
    }
    
    checkGameConditions() {
        // Check if all meetings are destroyed
        if (this.meetings.length === 0) {
            this.nextLevel();
        }
    }
    
    nextLevel() {
        this.level++;
        this.showMessage(`Level ${this.level}!`);
        this.generateMeetings();
        this.ball.reset(this.width / 2, this.height - 100);
        this.updateUI();
        
        // Bonus points for completing level
        this.score += 1000 * this.level;
    }
    
    gameOver() {
        this.state = 'gameOver';
        this.soundManager.stopBackgroundMusic();
        this.gameStates.showGameOver();
    }
    
    pause() {
        if (this.state === 'playing') {
            this.state = 'paused';
            this.gameStates.showPause();
        }
    }
    
    resume() {
        if (this.state === 'paused') {
            this.state = 'playing';
            this.gameStates.hidePause();
        }
    }
    
    restart() {
        this.startGame(this.difficulty);
        this.gameStates.hideAll();
    }
    
    showMenu() {
        this.state = 'menu';
        this.soundManager.stopBackgroundMusic();
        this.gameStates.showMenu();
    }
    
    createParticles(x, y, color) {
        for (let i = 0; i < 8; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 200,
                vy: (Math.random() - 0.5) * 200,
                life: 1,
                maxLife: 1,
                color: color,
                size: Math.random() * 4 + 2,
                update: function(deltaTime) {
                    this.x += this.vx * deltaTime;
                    this.y += this.vy * deltaTime;
                    this.vy += 300 * deltaTime; // gravity
                    this.life -= deltaTime * 2;
                }
            });
        }
    }
    
    showFloatingScore(x, y, points) {
        this.particles.push({
            x: x,
            y: y,
            vx: 0,
            vy: -50,
            life: 2,
            maxLife: 2,
            text: `+${points}`,
            color: '#4CAF50',
            size: 16,
            update: function(deltaTime) {
                this.y += this.vy * deltaTime;
                this.life -= deltaTime;
            }
        });
    }
    
    showMessage(text) {
        // Could be implemented as a toast notification
        console.log('Game message:', text);
    }
    
    updatePowerUpDisplay() {
        const display = document.getElementById('powerupsDisplay');
        display.innerHTML = '';
        
        for (const [type, effect] of this.activeEffects) {
            const indicator = document.createElement('div');
            indicator.className = 'powerup-indicator';
            
            const icons = {
                coffee: '☕',
                autoresponder: '📞',
                error: '⚠️'
            };
            
            const names = {
                coffee: 'Coffee Boost',
                autoresponder: 'Auto-responder',
                error: 'Critical Error'
            };
            
            indicator.innerHTML = `
                ${icons[type] || '⭐'} ${names[type] || type}
                <span style="opacity: 0.7; font-size: 12px;">
                    ${Math.ceil(effect.duration / 1000)}s
                </span>
            `;
            
            display.appendChild(indicator);
        }
    }
    
    updateUI() {
        document.getElementById('scoreValue').textContent = this.score;
        document.getElementById('levelValue').textContent = this.level;
        document.getElementById('livesValue').textContent = this.lives;
    }
    
    resize() {
        this.setupCanvas();
        
        // Adjust game object positions if needed
        if (this.paddle) {
            this.paddle.x = Math.min(this.paddle.x, this.width - this.paddle.width);
            this.paddle.y = this.height - 30;
        }
    }
    
    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Draw Google Calendar-style background grid
        this.drawCalendarGrid();
        
        if (this.state === 'playing' || this.state === 'paused') {
            // Draw game objects
            if (this.ball) this.ball.render(this.ctx);
            if (this.paddle) this.paddle.render(this.ctx);
            
            // Draw meetings
            this.meetings.forEach(meeting => meeting.render(this.ctx));
            
            // Draw power-ups
            this.powerUps.forEach(powerUp => powerUp.render(this.ctx));
            
            // Draw particles
            this.particles.forEach(particle => {
                if (particle.text) {
                    // Floating score text
                    this.ctx.save();
                    this.ctx.globalAlpha = particle.life / particle.maxLife;
                    this.ctx.font = `bold ${particle.size}px Inter`;
                    this.ctx.fillStyle = particle.color;
                    this.ctx.textAlign = 'center';
                    this.ctx.fillText(particle.text, particle.x, particle.y);
                    this.ctx.restore();
                } else {
                    // Regular particle
                    this.ctx.save();
                    this.ctx.globalAlpha = particle.life / particle.maxLife;
                    this.ctx.fillStyle = particle.color;
                    this.ctx.fillRect(particle.x - particle.size/2, particle.y - particle.size/2, 
                                    particle.size, particle.size);
                    this.ctx.restore();
                }
            });
            
            // Draw pause overlay
            if (this.state === 'paused') {
                this.ctx.save();
                this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                this.ctx.fillRect(0, 0, this.width, this.height);
                this.ctx.fillStyle = 'white';
                this.ctx.font = 'bold 36px Inter';
                this.ctx.textAlign = 'center';
                this.ctx.fillText('PAUSED', this.width / 2, this.height / 2);
                this.ctx.restore();
            }
        }
    }
    
    gameLoop(currentTime = 0) {
        const deltaTime = Math.min((currentTime - this.lastTime) / 1000, 1/30); // Cap at 30 FPS minimum
        this.lastTime = currentTime;
        
        this.update(deltaTime);
        this.render();
        
        requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    drawCalendarGrid() {
        this.ctx.save();
        
        // Draw time slots background (like Google Calendar)
        const timeSlotHeight = 30;
        const hours = ['9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM'];
        
        this.ctx.strokeStyle = '#e8eaed';
        this.ctx.lineWidth = 1;
        this.ctx.font = '10px Google Sans, Roboto, Arial';
        this.ctx.fillStyle = '#5f6368';
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'middle';
        
        // Draw horizontal grid lines and time labels
        for (let i = 0; i <= hours.length; i++) {
            const y = 40 + i * timeSlotHeight;
            if (y < this.height - 60) {
                // Grid line
                this.ctx.beginPath();
                this.ctx.moveTo(0, y);
                this.ctx.lineTo(this.width, y);
                this.ctx.stroke();
                
                // Time label
                if (i < hours.length) {
                    this.ctx.fillText(hours[i], 5, y + timeSlotHeight / 2);
                }
            }
        }
        
        // Draw vertical lines for days
        const dayWidth = this.width / 7;
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        
        this.ctx.textAlign = 'center';
        this.ctx.font = 'bold 12px Google Sans, Roboto, Arial';
        this.ctx.fillStyle = '#3c4043';
        
        for (let i = 0; i <= 7; i++) {
            const x = i * dayWidth;
            
            // Vertical grid line
            this.ctx.beginPath();
            this.ctx.moveTo(x, 20);
            this.ctx.lineTo(x, this.height - 40);
            this.ctx.stroke();
            
            // Day label
            if (i < days.length) {
                this.ctx.fillText(days[i], x + dayWidth / 2, 15);
            }
        }
        
        // Header background
        this.ctx.fillStyle = 'rgba(248, 249, 250, 0.9)';
        this.ctx.fillRect(0, 0, this.width, 25);
        
        // Left time column background
        this.ctx.fillStyle = 'rgba(248, 249, 250, 0.7)';
        this.ctx.fillRect(0, 25, 50, this.height - 65);
        
        this.ctx.restore();
    }
}
