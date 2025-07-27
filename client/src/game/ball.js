export class Ball {
    constructor(x, y, radius, speed) {
        this.startX = x;
        this.startY = y;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.baseSpeed = speed;
        this.vx = speed * 0.7; // Start at angle
        this.vy = -speed;
        this.speedMultiplier = 1;
        this.trail = [];
        this.maxTrailLength = 5;
    }
    
    update(deltaTime) {
        // Apply speed multiplier from power-ups
        const currentSpeed = this.baseSpeed * this.speedMultiplier;
        const speedRatio = currentSpeed / this.baseSpeed;
        
        // Update position
        this.x += this.vx * speedRatio * deltaTime * 60; // 60 FPS normalization
        this.y += this.vy * speedRatio * deltaTime * 60;
        
        // Add to trail
        this.trail.push({ x: this.x, y: this.y, time: Date.now() });
        
        // Remove old trail points
        const now = Date.now();
        this.trail = this.trail.filter(point => now - point.time < 200);
        
        if (this.trail.length > this.maxTrailLength) {
            this.trail.shift();
        }
    }
    
    reset(x, y) {
        this.x = x || this.startX;
        this.y = y || this.startY;
        this.vx = this.baseSpeed * 0.7;
        this.vy = -this.baseSpeed;
        this.trail = [];
    }
    
    render(ctx) {
        // Draw trail
        ctx.save();
        this.trail.forEach((point, index) => {
            const alpha = (index + 1) / this.trail.length * 0.3;
            const size = this.radius * (0.3 + (index / this.trail.length) * 0.7);
            
            ctx.globalAlpha = alpha;
            ctx.fillStyle = '#667eea';
            ctx.beginPath();
            ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.restore();
        
        // Draw main ball with gradient
        const gradient = ctx.createRadialGradient(
            this.x - this.radius * 0.3, this.y - this.radius * 0.3, 0,
            this.x, this.y, this.radius
        );
        
        // Color based on speed
        if (this.speedMultiplier > 1) {
            gradient.addColorStop(0, '#FFD700'); // Gold for coffee boost
            gradient.addColorStop(1, '#FF8C00');
        } else if (this.speedMultiplier < 1) {
            gradient.addColorStop(0, '#FF6B6B'); // Red for error
            gradient.addColorStop(1, '#DC3545');
        } else {
            gradient.addColorStop(0, '#74C0FC'); // Normal blue
            gradient.addColorStop(1, '#339AF0');
        }
        
        ctx.save();
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Add shine effect
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.beginPath();
        ctx.arc(this.x - this.radius * 0.3, this.y - this.radius * 0.3, this.radius * 0.3, 0, Math.PI * 2);
        ctx.fill();
        
        // Add border
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.restore();
    }
}
