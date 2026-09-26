/**
 * Cinematic Sci-Fi Intro Experience for Vishnu's Portfolio
 * - Plays background tech motion video with cyber HUD canvas
 * - Live terminal initialization sequence & progress bar
 * - Web Audio API ambient tech synthesizer & transition effects
 * - Seamless portal warp transition to main portfolio
 */

class PortfolioIntro {
    constructor() {
        this.overlay = document.getElementById("portfolio-intro-overlay");
        this.video = document.getElementById("intro-tech-video");
        this.progressBar = document.getElementById("intro-progress-bar");
        this.percentText = document.getElementById("intro-percent-text");
        this.terminalText = document.getElementById("intro-terminal-log");
        this.enterBtn = document.getElementById("intro-enter-btn");
        this.skipBtn = document.getElementById("intro-skip-btn");
        this.audioToggle = document.getElementById("intro-audio-toggle");
        
        this.audioCtx = null;
        this.soundEnabled = false;
        this.progress = 0;
        this.isExiting = false;

        this.init();
    }

    init() {
        if (!this.overlay) return;

        // Auto-play video safely (muted ensures browser allows it)
        if (this.video) {
            this.video.muted = true;
            this.video.play().catch(e => console.log("Video autoplay handling:", e));
        }

        this.bindEvents();
        this.startSequence();
    }

    bindEvents() {
        if (this.enterBtn) {
            this.enterBtn.addEventListener("click", () => this.exitIntro());
        }

        if (this.skipBtn) {
            this.skipBtn.addEventListener("click", () => this.exitIntro());
        }

        if (this.audioToggle) {
            this.audioToggle.addEventListener("click", () => this.toggleSound());
        }

        // Space or Enter key to enter
        window.addEventListener("keydown", (e) => {
            if (this.overlay && !this.isExiting && (e.key === "Enter" || e.key === " ")) {
                this.exitIntro();
            }
        });
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        if (this.soundEnabled) {
            this.initAudioContext();
            this.playSciFiTone(440, "sine", 0.3);
            if (this.audioToggle) {
                this.audioToggle.innerHTML = '<i class="fas fa-volume-up"></i> Sound On';
                this.audioToggle.classList.add("active");
            }
        } else {
            if (this.audioToggle) {
                this.audioToggle.innerHTML = '<i class="fas fa-volume-mute"></i> Sound Off';
                this.audioToggle.classList.remove("active");
            }
        }
    }

    initAudioContext() {
        if (!this.audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.audioCtx = new AudioContext();
            }
        }
        if (this.audioCtx && this.audioCtx.state === "suspended") {
            this.audioCtx.resume();
        }
    }

    playSciFiTone(freq = 440, type = "sine", duration = 0.25) {
        if (!this.soundEnabled || !this.audioCtx) return;
        try {
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(freq * 1.5, this.audioCtx.currentTime + duration);

            gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);

            osc.connect(gain);
            gain.connect(this.audioCtx.destination);

            osc.start();
            osc.stop(this.audioCtx.currentTime + duration);
        } catch (e) {
            // Audio policy fallback
        }
    }

    playWarpSound() {
        if (!this.soundEnabled || !this.audioCtx) return;
        try {
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            osc.type = "sawtooth";
            osc.frequency.setValueAtTime(180, this.audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(880, this.audioCtx.currentTime + 0.6);

            gain.gain.setValueAtTime(0.12, this.audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.7);

            osc.connect(gain);
            gain.connect(this.audioCtx.destination);

            osc.start();
            osc.stop(this.audioCtx.currentTime + 0.7);
        } catch (e) {}
    }

    startSequence() {
        const logs = [
            "INITIALIZING QUANTUM KERNEL v2.6...",
            "LINKING NEURAL ARCHITECTURE: SALEM, TN...",
            "COMPILING SYSTEMS: C / C# / JAVA / PYTHON...",
            "LOADING FLAGSHIP: MINDSPACE BILINGUAL NLP...",
            "BIOMETRIC SIGNATURE VERIFIED: VISHNU",
            "PORTFOLIO READY. ACCESS GRANTED."
        ];

        let logIdx = 0;
        const totalDuration = 4200; // 4.2 seconds
        const intervalTime = 40;
        const totalSteps = totalDuration / intervalTime;
        let step = 0;

        const timer = setInterval(() => {
            if (this.isExiting) {
                clearInterval(timer);
                return;
            }

            step++;
            this.progress = Math.min(100, Math.floor((step / totalSteps) * 100));

            if (this.progressBar) {
                this.progressBar.style.width = `${this.progress}%`;
            }
            if (this.percentText) {
                this.percentText.textContent = `${this.progress}%`;
            }

            // Update terminal logs at milestones
            const targetLogIdx = Math.min(logs.length - 1, Math.floor((this.progress / 100) * logs.length));
            if (targetLogIdx > logIdx) {
                logIdx = targetLogIdx;
                if (this.terminalText) {
                    this.terminalText.textContent = logs[logIdx];
                }
                this.playSciFiTone(300 + logIdx * 90, "triangle", 0.1);
            }

            if (this.progress >= 100) {
                clearInterval(timer);
                this.onSequenceComplete();
            }
        }, intervalTime);
    }

    onSequenceComplete() {
        if (this.enterBtn) {
            this.enterBtn.classList.add("pulse-glow");
            this.enterBtn.innerHTML = `<span>Enter Portfolio</span> <i class="fas fa-arrow-right"></i>`;
        }

        // Automatically transition into the page after brief pause
        setTimeout(() => {
            if (!this.isExiting) {
                this.exitIntro();
            }
        }, 1600);
    }

    exitIntro() {
        if (this.isExiting || !this.overlay) return;
        this.isExiting = true;

        this.playWarpSound();

        // Cinematic exit animation
        this.overlay.classList.add("exiting");

        setTimeout(() => {
            this.overlay.style.display = "none";
            document.body.classList.add("intro-completed");

            // Dispatch event to trigger initial animations and parallax
            window.dispatchEvent(new CustomEvent("introFinished"));
            window.dispatchEvent(new CustomEvent("portfolioDataRendered"));
        }, 750);
    }

    replay() {
        if (!this.overlay) return;
        this.isExiting = false;
        this.progress = 0;
        this.overlay.classList.remove("exiting");
        this.overlay.style.display = "flex";

        if (this.video) {
            this.video.currentTime = 0;
            this.video.play().catch(() => {});
        }

        this.startSequence();
    }
}

// Global instance
document.addEventListener("DOMContentLoaded", () => {
    window.portfolioIntro = new PortfolioIntro();
    window.replayIntro = () => window.portfolioIntro.replay();
});
