export class InputManager {
    constructor(game) {
        this.game = game;
        this.keys = {};
        this.mouse = { x: 0, y: 0 };
        this.touch = { x: 0, y: 0, active: false };
        this.isMobile = this.detectMobile();
        
        this.init();
    }
    
    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
               || window.innerWidth < 768;
    }
    
    init() {
        // Keyboard events
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            
            // Prevent arrow keys from scrolling
            if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Space'].includes(e.code)) {
                e.preventDefault();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        
        // Mouse events
        const canvas = this.game.canvas;
        
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            this.mouse.x = (e.clientX - rect.left) * (canvas.width / rect.width);
            this.mouse.y = (e.clientY - rect.top) * (canvas.height / rect.height);
        });
        
        // Touch events for mobile
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handleTouch(e);
        });
        
        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.handleTouch(e);
        });
        
        canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.touch.active = false;
        });
        
        // Prevent scrolling and zooming on mobile
        document.addEventListener('touchmove', (e) => {
            if (e.target === canvas) {
                e.preventDefault();
            }
        }, { passive: false });
        
        document.addEventListener('gesturestart', (e) => {
            e.preventDefault();
        });
        
        document.addEventListener('gesturechange', (e) => {
            e.preventDefault();
        });
        
        document.addEventListener('gestureend', (e) => {
            e.preventDefault();
        });
        
        console.log(`Input manager initialized for ${this.isMobile ? 'mobile' : 'desktop'}`);
    }
    
    handleTouch(e) {
        if (e.touches.length > 0) {
            const touch = e.touches[0];
            const rect = this.game.canvas.getBoundingClientRect();
            
            this.touch.x = (touch.clientX - rect.left) * (this.game.canvas.width / rect.width);
            this.touch.y = (touch.clientY - rect.top) * (this.game.canvas.height / rect.height);
            this.touch.active = true;
        }
    }
    
    update() {
        if (this.game.state !== 'playing' || !this.game.paddle) return;
        
        const deltaTime = 1/60; // Normalized for 60 FPS
        
        if (this.isMobile) {
            // Touch controls
            if (this.touch.active) {
                this.game.paddle.setTargetX(this.touch.x);
            }
        } else {
            // Keyboard controls
            if (this.keys['ArrowLeft'] || this.keys['KeyA']) {
                this.game.paddle.moveLeft(deltaTime);
            }
            if (this.keys['ArrowRight'] || this.keys['KeyD']) {
                this.game.paddle.moveRight(deltaTime, this.game.width);
            }
            
            // Mouse controls (always active on desktop)
            this.game.paddle.setTargetX(this.mouse.x);
        }
    }
    
    isKeyPressed(key) {
        return this.keys[key] || false;
    }
    
    getMousePosition() {
        return { ...this.mouse };
    }
    
    getTouchPosition() {
        return { ...this.touch };
    }
}
