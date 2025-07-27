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
        this.magneticEffect = 0; // Timer for magnetic bonus
        this.trail = [];
        this.maxTrailLength = 5;
    }
    
    update(deltaTime, bonuses = []) {
        // Check for magnetic effect on bonuses
        let magneticForce = { x: 0, y: 0 };
        if (this.magneticEffect > 0) {
            const magnetRadius = 120;
            bonuses.forEach(bonus => {
                const dx = (bonus.x + bonus.width / 2) - this.x;
                const dy = (bonus.y + bonus.height / 2) - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Only attract beneficial bonuses
                if (distance < magnetRadius && !bonus.getBonusData().isDebuff) {
                    const force = (magnetRadius - distance) / magnetRadius * 0.8;
                    magneticForce.x += (dx / distance) * force;
                    magneticForce.y += (dy / distance) * force;
                }
            });
        }
        
        // Apply speed multiplier from power-ups
        const currentSpeed = this.baseSpeed * this.speedMultiplier;
        const speedRatio = currentSpeed / this.baseSpeed;
        
        // Update position with magnetic force
        this.x += (this.vx * speedRatio + magneticForce.x) * deltaTime * 60; // 60 FPS normalization
        this.y += (this.vy * speedRatio + magneticForce.y) * deltaTime * 60;
        
        // Decrease magnetic effect timer
        if (this.magneticEffect > 0) {
            this.magneticEffect -= deltaTime * 1000; // Convert to milliseconds
            if (this.magneticEffect <= 0) {
                this.magneticEffect = 0;
            }
        }
        
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
        
        // Color based on speed (Google colors)
        if (this.speedMultiplier > 1) {
            gradient.addColorStop(0, '#fbbc04'); // Google Yellow for coffee boost
            gradient.addColorStop(1, '#f9ab00');
        } else if (this.speedMultiplier < 1) {
            gradient.addColorStop(0, '#ea4335'); // Google Red for error
            gradient.addColorStop(1, '#d33b2c');
        } else {
            gradient.addColorStop(0, '#4285f4'); // Google Blue
            gradient.addColorStop(1, '#1a73e8');
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
