/**
 * Advanced Parallax & Cybernetic Visual Engine
 * - Multi-layer 3D Card Tilt with real Z-axis depth popouts
 * - Interactive Cyber Circuit Canvas with click shockwaves and cursor magnetism
 * - Dynamic Cursor Spotlight illuminating glassmorphism cards
 * - Magnetic pull on interactive cyber buttons
 * - Multi-speed scroll parallax floating tech glyphs
 */

class AdvancedParallaxEngine {
    constructor() {
        this.canvas = document.getElementById("cyber-canvas");
        this.ctx = this.canvas ? this.canvas.getContext("2d") : null;
        this.nodes = [];
        this.pulses = [];
        this.shockwaves = [];
        this.sparks = [];
        this.mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000, active: false };
        this.scrollVelocity = 0;
        this.lastScrollY = window.pageYOffset;
        
        this.init();
    }

    init() {
        if (this.canvas && this.ctx) {
            this.setupCanvas();
            this.createNodes();
            this.bindCanvasEvents();
            this.render();
        }

        this.initCursorSpotlight();
        this.initCustomCursor();
        this.init3DMultiLayerTilt();
        this.initMagneticButtons();
        this.initScrollParallaxLayers();
        this.initScrollReveals();
    }

    setupCanvas() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width * dpr;
        this.canvas.height = this.height * dpr;
        this.canvas.style.width = `${this.width}px`;
        this.canvas.style.height = `${this.height}px`;
        this.ctx.scale(dpr, dpr);
    }

    createNodes() {
        this.nodes = [];
        this.pulses = [];
        const count = Math.max(45, Math.min(Math.floor((this.width * this.height) / 14000), 100));

        for (let i = 0; i < count; i++) {
            this.nodes.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2.2 + 1.2,
                baseRadius: Math.random() * 2.2 + 1.2,
                color: Math.random() > 0.45 ? "rgba(0, 240, 255, " : "rgba(168, 85, 247, ",
                alpha: Math.random() * 0.5 + 0.25,
                pulseOffset: Math.random() * Math.PI * 2
            });
        }
    }

    bindCanvasEvents() {
        window.addEventListener("resize", () => {
            this.setupCanvas();
            this.createNodes();
        }, { passive: true });

        window.addEventListener("mousemove", (e) => {
            this.mouse.targetX = e.clientX;
            this.mouse.targetY = e.clientY;
            this.mouse.active = true;
        }, { passive: true });

        window.addEventListener("mouseleave", () => {
            this.mouse.active = false;
        });

        // Click Shockwave effect
        window.addEventListener("click", (e) => {
            this.createShockwave(e.clientX, e.clientY);
        });

        // Track scroll velocity for dynamic parallax distortion
        window.addEventListener("scroll", () => {
            const currentY = window.pageYOffset;
            this.scrollVelocity = currentY - this.lastScrollY;
            this.lastScrollY = currentY;
        }, { passive: true });
    }

    createShockwave(x, y) {
        this.shockwaves.push({
            x,
            y,
            radius: 5,
            maxRadius: 220,
            opacity: 0.9,
            speed: 5.5,
            color: Math.random() > 0.5 ? "rgba(0, 240, 255," : "rgba(168, 85, 247,"
        });

        // Burst sparks
        for (let i = 0; i < 16; i++) {
            const angle = (Math.PI * 2 / 16) * i + Math.random() * 0.2;
            const speed = Math.random() * 3 + 2;
            this.sparks.push({
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                radius: Math.random() * 2 + 1,
                alpha: 1,
                decay: 0.02 + Math.random() * 0.02,
                color: Math.random() > 0.5 ? "#00f0ff" : "#a855f7"
            });
        }
    }

    spawnPulse(sourceNode) {
        const neighbors = this.nodes.filter(n => n !== sourceNode && Math.hypot(n.x - sourceNode.x, n.y - sourceNode.y) < 180);
        if (neighbors.length > 0) {
            const target = neighbors[Math.floor(Math.random() * neighbors.length)];
            this.pulses.push({
                x1: sourceNode.x,
                y1: sourceNode.y,
                x2: target.x,
                y2: target.y,
                progress: 0,
                speed: 0.025 + Math.random() * 0.02,
                color: Math.random() > 0.5 ? "#00f0ff" : "#a855f7"
            });
        }
    }

    render() {
        this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.1;
        this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.1;

        this.ctx.clearRect(0, 0, this.width, this.height);

        // Spawn periodic pulses along circuits
        if (Math.random() < 0.05 && this.nodes.length > 5) {
            const randomNode = this.nodes[Math.floor(Math.random() * this.nodes.length)];
            this.spawnPulse(randomNode);
        }

        const maxDist = 145;
        const time = performance.now() * 0.002;

        // Render nodes and circuit interconnects
        for (let i = 0; i < this.nodes.length; i++) {
            const n1 = this.nodes[i];

            n1.x += n1.vx;
            n1.y += n1.vy;

            if (n1.x <= 0 || n1.x >= this.width) n1.vx *= -1;
            if (n1.y <= 0 || n1.y >= this.height) n1.vy *= -1;

            // Interactive cursor repulsion / connection
            if (this.mouse.active) {
                const dx = this.mouse.x - n1.x;
                const dy = this.mouse.y - n1.y;
                const dist = Math.hypot(dx, dy);

                if (dist < 190) {
                    const angle = Math.atan2(dy, dx);
                    const force = (190 - dist) / 190;
                    n1.x -= Math.cos(angle) * force * 1.8;
                    n1.y -= Math.sin(angle) * force * 1.8;

                    // Draw glowing wire from cursor to nearby nodes
                    if (dist < 130) {
                        this.ctx.beginPath();
                        this.ctx.moveTo(this.mouse.x, this.mouse.y);
                        this.ctx.lineTo(n1.x, n1.y);
                        this.ctx.strokeStyle = `rgba(0, 240, 255, ${(1 - dist / 130) * 0.45})`;
                        this.ctx.lineWidth = 1;
                        this.ctx.stroke();
                    }
                }
            }

            // Circuit tracks
            for (let j = i + 1; j < this.nodes.length; j++) {
                const n2 = this.nodes[j];
                const dist = Math.hypot(n2.x - n1.x, n2.y - n1.y);

                if (dist < maxDist) {
                    const lineAlpha = (1 - dist / maxDist) * 0.25;
                    this.ctx.beginPath();
                    this.ctx.moveTo(n1.x, n1.y);
                    this.ctx.lineTo(n2.x, n2.y);
                    this.ctx.strokeStyle = `rgba(0, 240, 255, ${lineAlpha})`;
                    this.ctx.lineWidth = 0.8;
                    this.ctx.stroke();
                }
            }
        }

        // Render pulses
        for (let i = this.pulses.length - 1; i >= 0; i--) {
            const p = this.pulses[i];
            p.progress += p.speed;

            if (p.progress >= 1) {
                this.pulses.splice(i, 1);
                continue;
            }

            const currentX = p.x1 + (p.x2 - p.x1) * p.progress;
            const currentY = p.y1 + (p.y2 - p.y1) * p.progress;

            this.ctx.beginPath();
            this.ctx.arc(currentX, currentY, 3, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.shadowColor = p.color;
            this.ctx.shadowBlur = 12;
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
        }

        // Render nodes
        for (const n of this.nodes) {
            const pulsation = Math.sin(time + n.pulseOffset) * 0.7;
            const r = Math.max(1, n.radius + pulsation);

            this.ctx.beginPath();
            this.ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
            this.ctx.fillStyle = `${n.color}${n.alpha})`;
            this.ctx.fill();
        }

        // Render Shockwaves
        for (let i = this.shockwaves.length - 1; i >= 0; i--) {
            const sw = this.shockwaves[i];
            sw.radius += sw.speed;
            sw.opacity = (1 - sw.radius / sw.maxRadius) * 0.8;

            if (sw.radius >= sw.maxRadius || sw.opacity <= 0) {
                this.shockwaves.splice(i, 1);
                continue;
            }

            this.ctx.beginPath();
            this.ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
            this.ctx.strokeStyle = `${sw.color} ${sw.opacity})`;
            this.ctx.lineWidth = 2.5;
            this.ctx.shadowColor = "#00f0ff";
            this.ctx.shadowBlur = 15;
            this.ctx.stroke();
            this.ctx.shadowBlur = 0;
        }

        // Render Sparks
        for (let i = this.sparks.length - 1; i >= 0; i--) {
            const sp = this.sparks[i];
            sp.x += sp.vx;
            sp.y += sp.vy;
            sp.alpha -= sp.decay;

            if (sp.alpha <= 0) {
                this.sparks.splice(i, 1);
                continue;
            }

            this.ctx.beginPath();
            this.ctx.arc(sp.x, sp.y, sp.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = sp.color;
            this.ctx.globalAlpha = sp.alpha;
            this.ctx.fill();
            this.ctx.globalAlpha = 1.0;
        }

        requestAnimationFrame(() => this.render());
    }

    /**
     * Interactive Cursor Spotlight that illuminates the entire screen and cards
     */
    initCursorSpotlight() {
        let spotlight = document.getElementById("cyber-cursor-spotlight");
        if (!spotlight) {
            spotlight = document.createElement("div");
            spotlight.id = "cyber-cursor-spotlight";
            spotlight.className = "cursor-spotlight-layer";
            document.body.prepend(spotlight);
        }

        window.addEventListener("mousemove", (e) => {
            spotlight.style.setProperty("--cursor-x", `${e.clientX}px`);
            spotlight.style.setProperty("--cursor-y", `${e.clientY}px`);
        }, { passive: true });
    }

    /**
     * Multi-Layer 3D Tilt Card Parallax with Layered Z-axis Popouts
     */
    init3DMultiLayerTilt() {
        const bindCard = (card) => {
            if (card._tilt3dBound) return;
            card._tilt3dBound = true;

            const handleMove = (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((y - centerY) / centerY) * -14;
                const rotateY = ((x - centerX) / centerX) * 14;

                card.style.transform = `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(10px)`;

                // Internal parallax layer shifts
                const popImg = card.querySelector(".project-image-box, .hero-avatar-img");
                const popBadge = card.querySelector(".project-category-badge, .floating-cyber-chip");
                const popTech = card.querySelector(".project-tech-stack");

                if (popImg) popImg.style.transform = `translateZ(30px) scale(1.04)`;
                if (popBadge) popBadge.style.transform = `translateZ(55px)`;
                if (popTech) popTech.style.transform = `translateZ(40px)`;

                // Specular Glare position
                const glareX = (x / rect.width) * 100;
                const glareY = (y / rect.height) * 100;
                card.style.setProperty("--glare-x", `${glareX}%`);
                card.style.setProperty("--glare-y", `${glareY}%`);
            };

            const handleLeave = () => {
                card.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0px)";
                const popImg = card.querySelector(".project-image-box, .hero-avatar-img");
                const popBadge = card.querySelector(".project-category-badge, .floating-cyber-chip");
                const popTech = card.querySelector(".project-tech-stack");

                if (popImg) popImg.style.transform = "translateZ(0) scale(1)";
                if (popBadge) popBadge.style.transform = "translateZ(0)";
                if (popTech) popTech.style.transform = "translateZ(0)";
            };

            card.addEventListener("mousemove", handleMove, { passive: true });
            card.addEventListener("mouseleave", handleLeave);
        };

        const setupAllTiltCards = () => {
            document.querySelectorAll(".parallax-tilt, .project-card, .skill-card, .about-card, .hero-avatar-card, .blog-card").forEach(bindCard);
        };

        setupAllTiltCards();
        window.addEventListener("portfolioDataRendered", setupAllTiltCards);
    }

    /**
     * Magnetic Button Pull Effect
     */
    initMagneticButtons() {
        const magneticBtns = document.querySelectorAll(".cyber-btn, .icon-circle-btn");
        magneticBtns.forEach(btn => {
            btn.addEventListener("mousemove", (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.28}px, ${y * 0.28}px)`;
            });

            btn.addEventListener("mouseleave", () => {
                btn.style.transform = "translate(0px, 0px)";
            });
        });
    }

    /**
     * Customized Cyber Cursor System
     * Dual-element (laser point + fluid trailing cyber ring with hover expansion)
     */
    initCustomCursor() {
        // Only initialize on devices that support hover (non-touch)
        if (window.matchMedia("(hover: none)").matches) return;

        let dot = document.getElementById("cyber-cursor-dot");
        let ring = document.getElementById("cyber-cursor-ring");

        if (!dot) {
            dot = document.createElement("div");
            dot.id = "cyber-cursor-dot";
            dot.className = "custom-cursor-dot";
            document.body.appendChild(dot);
        }

        if (!ring) {
            ring = document.createElement("div");
            ring.id = "cyber-cursor-ring";
            ring.className = "custom-cursor-ring";
            document.body.appendChild(ring);
        }

        let mouseX = -100, mouseY = -100;
        let ringX = -100, ringY = -100;
        let isHovered = false;
        let isClicking = false;
        let isVisible = false;

        window.addEventListener("mousemove", (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;

            if (!isVisible) {
                isVisible = true;
                dot.style.opacity = "1";
                ring.style.opacity = "1";
            }
        }, { passive: true });

        window.addEventListener("mouseleave", () => {
            isVisible = false;
            dot.style.opacity = "0";
            ring.style.opacity = "0";
        });

        window.addEventListener("mousedown", () => {
            isClicking = true;
            ring.classList.add("clicking");
            dot.classList.add("clicking");
        });

        window.addEventListener("mouseup", () => {
            isClicking = false;
            ring.classList.remove("clicking");
            dot.classList.remove("clicking");
        });

        // Smooth Lerp animation loop for the trailing ring
        const updateRing = () => {
            ringX += (mouseX - ringX) * 0.18;
            ringY += (mouseY - ringY) * 0.18;
            ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
            requestAnimationFrame(updateRing);
        };
        requestAnimationFrame(updateRing);

        // Bind hover effects on all interactive elements
        const bindInteractiveHover = () => {
            const targets = document.querySelectorAll("a, button, input, textarea, select, .project-card, .skill-card, .blog-card, .testimonial-card, .modal-close, [role='button']");
            targets.forEach(el => {
                if (el._cursorBound) return;
                el._cursorBound = true;

                el.addEventListener("mouseenter", () => {
                    ring.classList.add("hovering");
                    dot.classList.add("hovering");
                });

                el.addEventListener("mouseleave", () => {
                    ring.classList.remove("hovering");
                    dot.classList.remove("hovering");
                });
            });
        };

        bindInteractiveHover();
        window.addEventListener("portfolioDataRendered", bindInteractiveHover);
    }

    /**
     * Multi-layer Scroll Parallax for background orbs & hero banner
     */
    initScrollParallaxLayers() {
        const layers = document.querySelectorAll("[data-parallax-speed]");
        window.addEventListener("scroll", () => {
            const scrollY = window.pageYOffset;
            layers.forEach(el => {
                const speed = parseFloat(el.getAttribute("data-parallax-speed")) || 0.1;
                el.style.transform = `translate3d(0, ${(scrollY * speed).toFixed(1)}px, 0)`;
            });
        }, { passive: true });
    }

    /**
     * Smooth Intersection Observer for Scroll Entrance
     */
    initScrollReveals() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("revealed");
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        });

        const observeElements = () => {
            document.querySelectorAll(".reveal-up, .reveal-fade").forEach(el => observer.observe(el));
        };

        observeElements();
        window.addEventListener("portfolioDataRendered", observeElements);
    }
}

// Initialize on DOM Ready
document.addEventListener("DOMContentLoaded", () => {
    window.parallaxEngine = new AdvancedParallaxEngine();
});
