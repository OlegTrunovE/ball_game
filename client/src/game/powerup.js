export class PowerUp {
    constructor(x, y, width, height, type) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type;
        this.vy = 100; // Fall speed
        this.shouldRemove = false;
        this.createdAt = Date.now();
        this.rotationSpeed = 0.02;
        this.floatOffset = 0;
    }
    
    update(deltaTime) {
        // Fall down
        this.y += this.vy * deltaTime;
        
        // Floating animation
        this.floatOffset += deltaTime * 3;
        
        // Remove if falls off screen
        if (this.y > window.innerHeight + 50) {
            this.shouldRemove = true;
        }
    }
    
    getIcon() {
        const icons = {
            coffee: '☕',
            autoresponder: '📞',
            error: '⚠️',
            meetingroom: '🏢'
        };
        return icons[this.type] || '⭐';
    }
    
    getColor() {
        const colors = {
            coffee: '#D2691E',
            autoresponder: '#4CAF50',
            error: '#FF5722',
            meetingroom: '#9C27B0'
        };
        return colors[this.type] || '#FFC107';
    }
    
    getName() {
        const names = {
            coffee: 'Coffee',
            autoresponder: 'Auto-responder',
            error: 'Error',
            meetingroom: 'Meeting Room'
        };
        return names[this.type] || 'Power-up';
    }
    
    render(ctx) {
        ctx.save();
        
        // Floating animation
        const floatY = this.y + Math.sin(this.floatOffset) * 3;
        
        // Rotation
        const centerX = this.x + this.width / 2;
        const centerY = floatY + this.height / 2;
        
        ctx.translate(centerX, centerY);
        ctx.rotate(Date.now() * this.rotationSpeed * 0.001);
        
        // Glow effect
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.width / 2 + 5);
        gradient.addColorStop(0, this.getColor());
        gradient.addColorStop(0.7, this.getColor() + '80');
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(-this.width / 2 - 5, -this.height / 2 - 5, this.width + 10, this.height + 10);
        
        // Main power-up background
        ctx.fillStyle = this.getColor();
        ctx.beginPath();
        ctx.roundRect(-this.width / 2, -this.height / 2, this.width, this.height, 8);
        ctx.fill();
        
        // Border
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(-this.width / 2, -this.height / 2, this.width, this.height, 8);
        ctx.stroke();
        
        // Icon
        ctx.fillStyle = 'white';
        ctx.font = 'bold 16px Inter';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.getIcon(), 0, 0);
        
        // Sparkle effect
        const sparkleCount = 3;
        const time = Date.now() * 0.003;
        for (let i = 0; i < sparkleCount; i++) {
            const angle = (i / sparkleCount) * Math.PI * 2 + time;
            const distance = this.width / 2 + 10 + Math.sin(time * 2 + i) * 5;
            const sparkleX = Math.cos(angle) * distance;
            const sparkleY = Math.sin(angle) * distance;
            
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.beginPath();
            ctx.arc(sparkleX, sparkleY, 2, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }
}
