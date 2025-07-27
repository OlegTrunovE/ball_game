export class Meeting {
    constructor(x, y, width, height, type = 'normal', hasBonus = false) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type;
        this.hasBonus = hasBonus;
        this.maxHp = this.getMaxHp(type);
        this.hp = this.maxHp;
        this.shouldRemove = false;
        this.createdAt = Date.now();
        this.animationOffset = Math.random() * Math.PI * 2;
        this.pulseSpeed = 2;
        
        // Urgent meetings have a timer
        if (type === 'urgent') {
            this.expirationTime = 5000; // 5 seconds (as per requirements)
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
            normal: '#1a73e8',      // Google Blue
            urgent: '#ea4335',      // Google Red
            endless: '#34a853',     // Google Green
            deadline: '#9c27b0'     // Purple
        };
        return colors[this.type] || colors.normal;
    }
    
    getSecondaryColor() {
        const colors = {
            normal: '#1557b0',
            urgent: '#d33b2c',
            endless: '#2d8e43',
            deadline: '#7b1fa2'
        };
        return colors[this.type] || colors.normal;
    }
    
    getMeetingTitle() {
        // Fixed titles that don't change during the game
        if (!this.fixedTitle) {
            const allTitles = [
                'Daily',
                'Планирование продукта',
                'Встреча с бизнесом', 
                'Технический комитет',
                'Обед',
                'Проработка требований',
                'Планирование дизайна',
                'Планирование аналитики'
            ];
            
            // Assign a stable title based on position to avoid duplicates
            const titleIndex = (Math.floor(this.x / 10) + Math.floor(this.y / 10)) % allTitles.length;
            this.fixedTitle = allTitles[titleIndex];
        }
        
        return this.fixedTitle;
    }
    
    getTimeText() {
        // Fixed time that doesn't change during the game
        if (!this.fixedTime) {
            const times = [
                '9:00', '10:30', '14:00', '15:30', 
                '11:00', '13:00', '16:00', '9:30'
            ];
            const timeIndex = (Math.floor(this.x / 20) + Math.floor(this.y / 20)) % times.length;
            this.fixedTime = times[timeIndex];
        }
        
        return this.fixedTime;
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
        
        // Google Calendar style meeting block
        ctx.fillStyle = this.getColor();
        ctx.beginPath();
        ctx.roundRect(drawX, drawY, drawWidth, drawHeight, 6);
        ctx.fill();
        
        // Left border accent (Google Calendar style)
        ctx.fillStyle = this.getSecondaryColor();
        ctx.beginPath();
        ctx.roundRect(drawX, drawY, 4, drawHeight, [6, 0, 0, 6]);
        ctx.fill();
        
        // Subtle border
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(drawX, drawY, drawWidth, drawHeight, 6);
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
        
        // Draw meeting text (Google Calendar style)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.font = 'bold 8px Google Sans, Roboto, Arial';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        
        const title = this.getMeetingTitle();
        const maxWidth = drawWidth - 10;
        
        // Truncate text if too long
        let displayText = title;
        if (ctx.measureText(title).width > maxWidth) {
            displayText = title.substring(0, Math.floor(title.length * maxWidth / ctx.measureText(title).width)) + '...';
        }
        
        ctx.fillText(displayText, drawX + 6, drawY + 4);
        
        // Time text (Google Calendar style)
        ctx.font = '7px Google Sans, Roboto, Arial';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        const timeText = this.getTimeText();
        ctx.fillText(timeText, drawX + 6, drawY + drawHeight - 10);
        
        // Draw fire icon for deadline meetings
        if (this.type === 'deadline') {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.font = '12px Google Sans, Roboto, Arial';
            ctx.textAlign = 'right';
            ctx.fillText('🔥', drawX + drawWidth - 6, drawY + 14);
        }
        
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
        
        // Bonus indicator
        if (this.hasBonus) {
            const time = Date.now() * 0.003;
            const glowIntensity = (Math.sin(time) + 1) / 2;
            
            // Glow effect
            ctx.shadowColor = '#FFD700';
            ctx.shadowBlur = 8 + glowIntensity * 4;
            ctx.strokeStyle = `rgba(255, 215, 0, ${0.6 + glowIntensity * 0.4})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(drawX - 1, drawY - 1, drawWidth + 2, drawHeight + 2, 8);
            ctx.stroke();
            
            // Gift icon
            ctx.shadowBlur = 0;
            ctx.fillStyle = 'rgba(255, 215, 0, 0.9)';
            ctx.font = '10px Arial';
            ctx.textAlign = 'right';
            ctx.fillText('🎁', drawX + drawWidth - 4, drawY + 12);
        }
        
        ctx.restore();
    }
}
