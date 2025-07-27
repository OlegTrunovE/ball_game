export class Paddle {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.baseWidth = width;
        this.width = width;
        this.height = height;
        this.speed = 8;
        this.widthMultiplier = 1;
        this.targetX = x;
        this.smoothing = 0.15;
    }
    
    update(deltaTime) {
        // Apply width multiplier from power-ups
        this.width = this.baseWidth * this.widthMultiplier;
        
        // Smooth movement towards target
        const dx = this.targetX - this.x;
        this.x += dx * this.smoothing;
        
        // Keep paddle within bounds
        this.x = Math.max(0, Math.min(this.x, window.innerWidth - this.width));
    }
    
    setTargetX(x) {
        this.targetX = x - this.width / 2;
    }
    
    moveLeft(deltaTime) {
        this.targetX -= this.speed * deltaTime * 60;
        this.targetX = Math.max(0, this.targetX);
    }
    
    moveRight(deltaTime, canvasWidth) {
        this.targetX += this.speed * deltaTime * 60;
        this.targetX = Math.min(canvasWidth - this.width, this.targetX);
    }
    
    render(ctx) {
        // Create gradient based on width multiplier
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
        
        if (this.widthMultiplier > 1) {
            gradient.addColorStop(0, '#34a853'); // Google Green for auto-responder
            gradient.addColorStop(1, '#2d8e43');
        } else {
            gradient.addColorStop(0, '#5f6368'); // Google Gray
            gradient.addColorStop(1, '#3c4043');
        }
        
        ctx.save();
        
        // Draw main paddle with rounded corners
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(this.x, this.y, this.width, this.height, this.height / 2);
        ctx.fill();
        
        // Add highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.roundRect(this.x + 2, this.y + 1, this.width - 4, this.height / 3, this.height / 4);
        ctx.fill();
        
        // Add border
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(this.x, this.y, this.width, this.height, this.height / 2);
        ctx.stroke();
        
        // Add calendar icon in center (Google Calendar style)
        if (this.width > 50) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.font = '10px Google Sans, Roboto, Arial';
            ctx.textAlign = 'center';
            ctx.fillText('📅', this.x + this.width / 2, this.y + this.height / 2 + 3);
        }
        
        ctx.restore();
    }
}
