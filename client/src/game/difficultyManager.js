export class DifficultyManager {
    static getDifficultySettings(difficulty, level = 1) {
        const baseSettings = {
            easy: {
                ballSpeed: 3,
                paddleWidth: 120,
                paddleSpeed: 7,
                meetingRows: 3,
                urgentChance: 0.05,
                endlessChance: 0.1,
                deadlineChance: 0.05,
                bonusChance: 0.25,
                debuffChance: 0.05,
                randomMeetingChance: 0.02,
                ballDamage: 1,
                displayName: 'Легко'
            },
            medium: {
                ballSpeed: 4,
                paddleWidth: 100,
                paddleSpeed: 6,
                meetingRows: 4,
                urgentChance: 0.1,
                endlessChance: 0.15,
                deadlineChance: 0.1,
                bonusChance: 0.18,
                debuffChance: 0.12,
                randomMeetingChance: 0.04,
                ballDamage: 1,
                displayName: 'Средне'
            },
            hard: {
                ballSpeed: 5.5,
                paddleWidth: 80,
                paddleSpeed: 5,
                meetingRows: 5,
                urgentChance: 0.18,
                endlessChance: 0.25,
                deadlineChance: 0.15,
                bonusChance: 0.12,
                debuffChance: 0.18,
                randomMeetingChance: 0.06,
                ballDamage: 1,
                displayName: 'Сложно'
            }
        };
        
        const base = baseSettings[difficulty] || baseSettings.medium;
        
        // Modify by level (progressive difficulty)
        const levelMultiplier = 1 + ((level - 1) * 0.15);
        
        // Friday is especially challenging
        const dayIndex = (level - 1) % 7;
        const isFriday = dayIndex === 4;
        
        if (isFriday) {
            return {
                ...base,
                ballSpeed: base.ballSpeed * 1.4,
                meetingRows: Math.min(8, base.meetingRows + 2),
                urgentChance: Math.min(0.35, base.urgentChance * 2),
                endlessChance: Math.min(0.4, base.endlessChance * 1.6),
                deadlineChance: Math.min(0.3, base.deadlineChance * 2),
                debuffChance: Math.min(0.25, base.debuffChance * 1.5),
                randomMeetingChance: Math.min(0.1, base.randomMeetingChance * 2)
            };
        }
        
        return {
            ...base,
            ballSpeed: base.ballSpeed * levelMultiplier,
            meetingRows: Math.min(7, Math.floor(base.meetingRows * levelMultiplier)),
            urgentChance: Math.min(0.3, base.urgentChance * levelMultiplier),
            endlessChance: Math.min(0.35, base.endlessChance * levelMultiplier),
            deadlineChance: Math.min(0.25, base.deadlineChance * levelMultiplier),
            debuffChance: Math.min(0.2, base.debuffChance * levelMultiplier),
            randomMeetingChance: Math.min(0.08, base.randomMeetingChance * levelMultiplier)
        };
    }
    
    static getBonusTypes() {
        return ['coffee', 'autoresponder', 'motivation', 'refactoring', 'autopilot'];
    }
    
    static getDebuffTypes() {
        return ['jira_trap', 'useless_call', 'manager_distractor'];
    }
    
    static getRandomBonusType() {
        const bonuses = this.getBonusTypes();
        return bonuses[Math.floor(Math.random() * bonuses.length)];
    }
    
    static getRandomDebuffType() {
        const debuffs = this.getDebuffTypes();
        return debuffs[Math.floor(Math.random() * debuffs.length)];
    }
}