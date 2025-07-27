export class Bonus {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.width = 35;
        this.height = 35;
        this.type = type;
        this.vy = 80; // Fall speed
        this.shouldRemove = false;
        this.createdAt = Date.now();
        this.rotationSpeed = 0.03;
        this.floatOffset = 0;
        this.pulseOffset = Math.random() * Math.PI * 2;
    }
    
    update(deltaTime) {
        // Fall down
        this.y += this.vy * deltaTime;
        
        // Floating and rotation animation
        this.floatOffset += deltaTime * 4;
        
        // Remove if falls off screen
        if (this.y > window.innerHeight + 100) {
            this.shouldRemove = true;
        }
    }
    
    getBonusData() {
        const bonuses = {
            // Бонусы
            coffee: {
                icon: '☕',
                name: 'Кофе',
                description: 'Ускоряет шарик',
                color: '#D2691E',
                glowColor: '#FFB347',
                isDebuff: false
            },
            autoresponder: {
                icon: '📨',
                name: 'Автоответчик',
                description: 'Расширяет платформу',
                color: '#4CAF50',
                glowColor: '#90EE90',
                isDebuff: false
            },
            motivation: {
                icon: '🔥',
                name: 'Мотивация',
                description: 'Усиливает урон',
                color: '#FF6B35',
                glowColor: '#FF8C69',
                isDebuff: false
            },
            refactoring: {
                icon: '🧹',
                name: 'Рефакторинг',
                description: 'Удаляет ряд встреч',
                color: '#9C27B0',
                glowColor: '#DDA0DD',
                isDebuff: false
            },
            autopilot: {
                icon: '🕹',
                name: 'Автопилот',
                description: 'Магнитный эффект',
                color: '#2196F3',
                glowColor: '#87CEEB',
                isDebuff: false
            },
            
            // Дебафы
            jira_trap: {
                icon: '🧱',
                name: 'Ловушка Jira',
                description: 'Добавляет встречи',
                color: '#8B0000',
                glowColor: '#CD5C5C',
                isDebuff: true
            },
            useless_call: {
                icon: '🐢',
                name: 'Бессмысленный созвон',
                description: 'Замедляет шарик',
                color: '#556B2F',
                glowColor: '#9ACD32',
                isDebuff: true
            },
            manager_distractor: {
                icon: '👀',
                name: 'Менеджер-отвлекатор',
                description: 'Меняет направление',
                color: '#800080',
                glowColor: '#DA70D6',
                isDebuff: true
            }
        };
        
        return bonuses[this.type] || bonuses.coffee;
    }
    
    render(ctx) {
        ctx.save();
        
        const data = this.getBonusData();
        
        // Floating animation
        const floatY = this.y + Math.sin(this.floatOffset) * 3;
        
        // Pulse effect
        const pulseScale = 1 + Math.sin(Date.now() * 0.005 + this.pulseOffset) * 0.1;
        
        // Rotation
        const centerX = this.x + this.width / 2;
        const centerY = floatY + this.height / 2;
        
        ctx.translate(centerX, centerY);
        ctx.rotate(Date.now() * this.rotationSpeed * 0.001);
        ctx.scale(pulseScale, pulseScale);
        
        // Glow effect
        const glowSize = this.width / 2 + 8;
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, glowSize);
        gradient.addColorStop(0, data.glowColor + '80');
        gradient.addColorStop(0.5, data.glowColor + '40');
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(-glowSize, -glowSize, glowSize * 2, glowSize * 2);
        
        // Main background
        const bgGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.width / 2);
        if (data.isDebuff) {
            bgGradient.addColorStop(0, data.color);
            bgGradient.addColorStop(1, '#660000');
        } else {
            bgGradient.addColorStop(0, data.color);
            bgGradient.addColorStop(1, data.color + 'CC');
        }
        
        ctx.fillStyle = bgGradient;
        ctx.beginPath();
        ctx.roundRect(-this.width / 2, -this.height / 2, this.width, this.height, 12);
        ctx.fill();
        
        // Border
        ctx.strokeStyle = data.isDebuff ? '#FF4444' : '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(-this.width / 2, -this.height / 2, this.width, this.height, 12);
        ctx.stroke();
        
        // Icon
        ctx.fillStyle = 'white';
        ctx.font = 'bold 18px Inter, Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(data.icon, 0, 2);
        
        // Sparkle effect for bonuses
        if (!data.isDebuff) {
            const sparkleCount = 4;
            const time = Date.now() * 0.004;
            for (let i = 0; i < sparkleCount; i++) {
                const angle = (i / sparkleCount) * Math.PI * 2 + time;
                const distance = this.width / 2 + 12 + Math.sin(time * 3 + i) * 6;
                const sparkleX = Math.cos(angle) * distance;
                const sparkleY = Math.sin(angle) * distance;
                
                ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                ctx.beginPath();
                ctx.arc(sparkleX, sparkleY, 1.5, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        // Warning effect for debuffs
        if (data.isDebuff) {
            const warningAlpha = (Math.sin(Date.now() * 0.01) + 1) / 2 * 0.3;
            ctx.fillStyle = `rgba(255, 0, 0, ${warningAlpha})`;
            ctx.beginPath();
            ctx.roundRect(-this.width / 2 - 2, -this.height / 2 - 2, this.width + 4, this.height + 4, 14);
            ctx.fill();
        }
        
        ctx.restore();
    }
}