export class SoundManager {
    constructor() {
        this.isMuted = false;
        this.backgroundMusic = null;
        this.hitSound = null;
        this.successSound = null;
        
        this.init();
    }
    
    init() {
        try {
            // Get audio elements
            this.backgroundMusic = document.getElementById('backgroundMusic');
            this.hitSound = document.getElementById('hitSound');
            this.successSound = document.getElementById('successSound');
            
            // Set volumes
            if (this.backgroundMusic) {
                this.backgroundMusic.volume = 0.3;
            }
            if (this.hitSound) {
                this.hitSound.volume = 0.4;
            }
            if (this.successSound) {
                this.successSound.volume = 0.5;
            }
            
            // Setup mute button
            const muteButton = document.getElementById('muteButton');
            if (muteButton) {
                muteButton.addEventListener('click', () => {
                    this.toggleMute();
                });
            }
            
            console.log('Sound manager initialized');
        } catch (error) {
            console.warn('Sound initialization failed:', error);
        }
    }
    
    toggleMute() {
        this.isMuted = !this.isMuted;
        
        const muteButton = document.getElementById('muteButton');
        if (muteButton) {
            muteButton.textContent = this.isMuted ? '🔇' : '🔊';
        }
        
        // Stop background music if muted
        if (this.isMuted && this.backgroundMusic) {
            this.backgroundMusic.pause();
        }
        
        console.log(`Sound ${this.isMuted ? 'muted' : 'unmuted'}`);
    }
    
    playBackgroundMusic() {
        if (this.isMuted || !this.backgroundMusic) return;
        
        this.backgroundMusic.currentTime = 0;
        this.backgroundMusic.play().catch(error => {
            console.log('Background music play prevented:', error);
        });
    }
    
    stopBackgroundMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
            this.backgroundMusic.currentTime = 0;
        }
    }
    
    playHit() {
        if (this.isMuted || !this.hitSound) return;
        
        // Clone the sound to allow overlapping playback
        const soundClone = this.hitSound.cloneNode();
        soundClone.volume = this.hitSound.volume;
        soundClone.play().catch(error => {
            console.log('Hit sound play prevented:', error);
        });
    }
    
    playSuccess() {
        if (this.isMuted || !this.successSound) return;
        
        this.successSound.currentTime = 0;
        this.successSound.play().catch(error => {
            console.log('Success sound play prevented:', error);
        });
    }
    
    playPowerUp() {
        // Use success sound for power-ups
        this.playSuccess();
    }
}
