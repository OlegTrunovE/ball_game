export class UpgradeManager {
    constructor(game) {
        this.game = game;
        this.upgrades = {
            widerPaddle: 0,      // Увеличение ширины платформы
            moreBonuses: 0,      // Повышение шанса бонусов
            slowerBall: 0,       // Замедление шарика
            strongerDamage: 0    // Усиление урона
        };
    }
    
    getAvailableUpgrades() {
        return [
            {
                id: 'widerPaddle',
                name: 'Широкая платформа',
                description: '+20% к ширине платформы',
                icon: '📏',
                maxLevel: 3,
                currentLevel: this.upgrades.widerPaddle
            },
            {
                id: 'moreBonuses',
                name: 'Больше бонусов',
                description: '+25% шанс выпадения бонусов',
                icon: '🎁',
                maxLevel: 3,
                currentLevel: this.upgrades.moreBonuses
            },
            {
                id: 'slowerBall',
                name: 'Контроль темпа',
                description: '-15% скорость шарика',
                icon: '🐌',
                maxLevel: 2,
                currentLevel: this.upgrades.slowerBall
            },
            {
                id: 'strongerDamage',
                name: 'Усиленный урон',
                description: 'Шанс уничтожить блок с одного удара',
                icon: '💥',
                maxLevel: 2,
                currentLevel: this.upgrades.strongerDamage
            }
        ];
    }
    
    applyUpgrade(upgradeId) {
        if (this.upgrades.hasOwnProperty(upgradeId)) {
            const maxLevels = {
                widerPaddle: 3,
                moreBonuses: 3,
                slowerBall: 2,
                strongerDamage: 2
            };
            
            if (this.upgrades[upgradeId] < maxLevels[upgradeId]) {
                this.upgrades[upgradeId]++;
                this.updateGameStats();
                return true;
            }
        }
        return false;
    }
    
    updateGameStats() {
        // Apply paddle width upgrade
        if (this.game.paddle) {
            const widthBonus = this.upgrades.widerPaddle * 0.2;
            this.game.paddle.baseWidth = this.game.paddle.originalWidth * (1 + widthBonus);
        }
        
        // Apply ball speed upgrade
        if (this.game.ball) {
            const speedReduction = this.upgrades.slowerBall * 0.15;
            this.game.ball.baseSpeed = this.game.ball.originalSpeed * (1 - speedReduction);
        }
    }
    
    getBonusChanceMultiplier() {
        return 1 + (this.upgrades.moreBonuses * 0.25);
    }
    
    getDamageMultiplier() {
        // Chance for critical hit that destroys any block in one hit
        const critChance = this.upgrades.strongerDamage * 0.15;
        return Math.random() < critChance ? 999 : 1; // 999 = instakill
    }
    
    showUpgradeScreen() {
        this.hideUpgradeScreen(); // Remove any existing screen
        
        const upgradeScreen = document.createElement('div');
        upgradeScreen.id = 'upgradeScreen';
        upgradeScreen.className = 'screen';
        upgradeScreen.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 150;
            animation: fadeIn 0.3s ease-out;
        `;
        
        const content = document.createElement('div');
        content.className = 'screen-content';
        content.style.cssText = `
            background: white;
            padding: 40px;
            border-radius: 15px;
            text-align: center;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        `;
        
        content.innerHTML = `
            <h2 style="color: #333; margin-bottom: 20px;">📈 Прокачка после дня</h2>
            <p style="color: #666; margin-bottom: 30px;">Выберите одно улучшение для следующего дня:</p>
            <div id="upgradeOptions" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;"></div>
            <button id="skipUpgrade" style="background: #666; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer;">Пропустить прокачку</button>
        `;
        
        const optionsContainer = content.querySelector('#upgradeOptions');
        const availableUpgrades = this.getAvailableUpgrades().filter(u => u.currentLevel < u.maxLevel);
        
        // Show 2-3 random upgrades
        const shuffled = availableUpgrades.sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, Math.min(3, shuffled.length));
        
        selected.forEach(upgrade => {
            const button = document.createElement('button');
            button.style.cssText = `
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                padding: 20px;
                border-radius: 12px;
                cursor: pointer;
                transition: transform 0.2s ease;
                text-align: left;
            `;
            
            button.innerHTML = `
                <div style="font-size: 24px; margin-bottom: 8px;">${upgrade.icon}</div>
                <div style="font-weight: bold; margin-bottom: 4px;">${upgrade.name}</div>
                <div style="font-size: 14px; opacity: 0.9;">${upgrade.description}</div>
                <div style="font-size: 12px; margin-top: 8px; opacity: 0.7;">Уровень: ${upgrade.currentLevel}/${upgrade.maxLevel}</div>
            `;
            
            button.addEventListener('click', () => {
                this.applyUpgrade(upgrade.id);
                this.hideUpgradeScreen();
                this.game.continueToNextLevel();
            });
            
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-2px)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0)';
            });
            
            optionsContainer.appendChild(button);
        });
        
        // Skip button
        content.querySelector('#skipUpgrade').addEventListener('click', () => {
            this.hideUpgradeScreen();
            this.game.continueToNextLevel();
        });
        
        upgradeScreen.appendChild(content);
        document.body.appendChild(upgradeScreen);
    }
    
    hideUpgradeScreen() {
        const upgradeScreen = document.getElementById('upgradeScreen');
        if (upgradeScreen) {
            document.body.removeChild(upgradeScreen);
        }
    }
}