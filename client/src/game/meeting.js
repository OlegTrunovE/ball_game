export class Meeting {
    constructor(x, y, width, height, type = 'normal') {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type;
        this.maxHp = this.getMaxHp(type);
        this.hp = this.maxHp;
        this.shouldRemove = false;
        this.createdAt = Date.now();
        this.animationOffset = Math.random() * Math.PI * 2;
        this.pulseSpeed = 2;
        
        // Urgent meetings have a timer
        if (type === 'urgent') {
            this.expirationTime = 10000; // 10 seconds
        }
    }
    
    getMaxHp(type) {
        switch (type) {
            case 'endless': return 3;
            default: return 1;
        }
    }
    
    update(deltaTime) {
        // Handle urgent meeting expiration
        if (this.type === 'urgent') {
            const timeElapsed = Date.now() - this.createdAt;
            if (timeElapsed >= this.expirationTime) {
                this.shouldRemove = true;
            }
        }
    }
    
    hit() {
        this.hp--;
        if (this.hp <= 0) {
            this.shouldRemove = true;
        }
    }
    
    getColor() {
        const colors = {
            normal: '#6c757d',
            urgent: '#dc3545',
            endless: '#007bff',
            deadline: '#6f42c1'
        };
        return colors[this.type] || colors.normal;
    }
    
    getSecondaryColor() {
        const colors = {
            normal: '#5a6268',
            urgent: '#c82333',
            endless: '#0056b3',
            deadline: '#5a1a6b'
        };
        return colors[this.type] || colors.normal;
    }
    
    getMeetingTitle() {
        const titles = {
            normal: ['Daily Standup', 'Team Sync', 'Quick Chat', 'Status Update', 'Weekly Review'],
            urgent: ['URGENT CALL', 'Crisis Meeting', 'Emergency Sync', 'Hot Fix Discussion'],
            endless: ['All Hands', 'Strategy Session', 'Planning Meeting', 'Architecture Review'],
            deadline: ['Project Deadline', 'Release Planning', 'Launch Review', 'Milestone Check']
        };
        
        const typeTitles = titles[this.type] || titles.normal;
        return typeTitles[Math.floor(Math.random() * typeTitles.length)];
    }
    
    render(ctx) {
        ctx.save();
        
        // Pulsing effect for urgent meetings
        let scaleMultiplier = 1;
        if (this.type === 'urgent') {
            const timeElapsed = Date.now() - this.createdAt;
            const timeLeft = Math.max(0, this.expirationTime - timeElapsed);
            const urgencyRatio = 1 - (timeLeft / this.expirationTime);
            
            scaleMultiplier = 1 + Math.sin(Date.now() * 0.01 * (1 + urgencyRatio * 3)) * 0.05;
            
            // Flash red when close to expiration
            if (timeLeft < 3000) {
                const flashIntensity = Math.sin(Date.now() * 0.02) * 0.5 + 0.5;
                ctx.globalAlpha = 0.7 + flashIntensity * 0.3;
            }
        }
        
        // Damage effect
        if (this.hp < this.maxHp) {
            const damageRatio = this.hp / this.maxHp;
            ctx.globalAlpha *= (0.6 + damageRatio * 0.4);
        }
        
        const drawWidth = this.width * scaleMultiplier;
        const drawHeight = this.height * scaleMultiplier;
        const drawX = this.x - (drawWidth - this.width) / 2;
        const drawY = this.y - (drawHeight - this.height) / 2;
        
        // Create gradient
        const gradient = ctx.createLinearGradient(drawX, drawY, drawX, drawY + drawHeight);
        gradient.addColorStop(0, this.getColor());
        gradient.addColorStop(1, this.getSecondaryColor());
        
        // Draw main block
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(drawX, drawY, drawWidth, drawHeight, 4);
        ctx.fill();
        
        // Draw border
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(drawX, drawY, drawWidth, drawHeight, 4);
        ctx.stroke();
        
        // Draw HP indicators for endless meetings
        if (this.type === 'endless' && this.maxHp > 1) {
            const dotSize = 3;
            const dotSpacing = 6;
            const totalWidth = (this.maxHp - 1) * dotSpacing + dotSize;
            const startX = drawX + (drawWidth - totalWidth) / 2;
            const dotY = drawY + 3;
            
            for (let i = 0; i < this.maxHp; i++) {
                ctx.fillStyle = i < this.hp ? '#ffffff' : 'rgba(255, 255, 255, 0.3)';
                ctx.beginPath();
                ctx.arc(startX + i * dotSpacing, dotY, dotSize / 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        // Draw meeting title/icon
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.font = 'bold 10px Inter';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const icons = {
            normal: '📅',
            urgent: '🚨',
            endless: '♾️',
            deadline: '⏰'
        };
        
        const icon = icons[this.type] || icons.normal;
        ctx.fillText(icon, drawX + drawWidth / 2, drawY + drawHeight / 2);
        
        // Draw timer for urgent meetings
        if (this.type === 'urgent') {
            const timeElapsed = Date.now() - this.createdAt;
            const timeLeft = Math.max(0, this.expirationTime - timeElapsed);
            const progress = timeLeft / this.expirationTime;
            
            if (progress > 0) {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.fillRect(drawX + 2, drawY + drawHeight - 4, (drawWidth - 4) * progress, 2);
            }
        }
        
        // Highlight effect
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.beginPath();
        ctx.roundRect(drawX + 2, drawY + 1, drawWidth - 4, drawHeight / 3, 2);
        ctx.fill();
        
        ctx.restore();
    }
}
