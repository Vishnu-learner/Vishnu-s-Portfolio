/**

 * Advanced Parallax & Cybernetic Visual Engine

 * - Holographic Avatar Particle Matrix Assembly & Disassembly

 * - Multi-layer 3D Card Tilt with real Z-axis depth popouts & Specular Glare

 * - Interactive Cyber Circuit Canvas with click shockwaves, data packets, and cursor magnetism

 * - Dynamic Cursor Spotlight illuminating glassmorphic cards

 * - Magnetic pull on interactive cyber buttons

 * - Multi-speed scroll parallax floating tech glyphs & horizon grid

 */



class AvatarParticleMatrix {
    constructor() {
        this.card = document.getElementById("hero-avatar-card");
        this.container = document.getElementById("avatar-image-container");
        this.img = document.getElementById("hero-avatar-img");
        this.canvas = document.getElementById("avatar-particle-canvas");
        this.scanBeam = document.getElementById("avatar-scan-beam");
        this.statusText = document.getElementById("hud-status-text");
        this.statusPct = document.getElementById("hud-status-pct");
        this.rescanBtn = document.getElementById("btn-rescan-avatar");
        this.btnLabel = document.getElementById("btn-toggle-avatar-text");

        if (!this.canvas || !this.img || !this.container) return;

        this.ctx = this.canvas.getContext("2d");
        this.dpr = Math.min(window.devicePixelRatio || 1, 2);

        this.realSrc = window.portfolioStore?.data?.profile?.avatar || "assets/avatar.jpg";
        this.avatar3dSrc = window.portfolioStore?.data?.profile?.avatar3d || "assets/avatar_3d.jpg";
        this.currentMode = "real"; // "real" | "3d"
        this.isTransitioning = false;

        this.particles = [];
        this.width = 0;
        this.height = 0;
        this.animId = null;

        this.preloadImages();
        this.init();
    }

    preloadImages() {
        const p1 = new Image();
        p1.src = this.realSrc;
        const p2 = new Image();
        p2.src = this.avatar3dSrc;
    }

    init() {
        this.setupDimensions();

        // Ensure real IT photo is active and crystal-clear on initial load
        this.img.src = this.realSrc;
        this.img.classList.remove("disassembled");
        this.ctx.clearRect(0, 0, this.width, this.height);

        this.updateUI();
        this.bindEvents();
    }

    setupDimensions() {
        const rect = this.container.getBoundingClientRect();
        this.width = rect.width || 348;
        this.height = rect.height || 448;

        this.canvas.width = this.width * this.dpr;
        this.canvas.height = this.height * this.dpr;
        this.canvas.style.width = `${this.width}px`;
        this.canvas.style.height = `${this.height}px`;

        this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    }

    bindEvents() {
        window.addEventListener("resize", () => {
            this.setupDimensions();
        }, { passive: true });

        // Clicking the avatar image container triggers disintegration and toggle
        this.container.addEventListener("click", () => {
            this.toggle();
        });

        // Clicking the switcher button triggers disintegration and toggle
        if (this.rescanBtn) {
            this.rescanBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                this.toggle();
            });
        }
    }

    updateUI() {
        if (this.currentMode === "real") {
            if (this.statusText) {
                this.statusText.innerHTML = '<strong style="color:#00f0ff;">REAL IT PROFILE</strong> &bull; CLICK TO DISINTEGRATE';
            }
            if (this.rescanBtn) {
                this.rescanBtn.innerHTML = '<i class="fas fa-cube" style="color:#a855f7;"></i> <span id="btn-toggle-avatar-text">Switch to 3D</span>';
                this.rescanBtn.title = "Click to disintegrate and view 3D Cyber Avatar";
            }
        } else {
            if (this.statusText) {
                this.statusText.innerHTML = '<strong style="color:#a855f7;">3D CYBER AVATAR</strong> &bull; CLICK TO DISINTEGRATE';
            }
            if (this.rescanBtn) {
                this.rescanBtn.innerHTML = '<i class="fas fa-user-tie" style="color:#00f0ff;"></i> <span id="btn-toggle-avatar-text">Switch to Real</span>';
                this.rescanBtn.title = "Click to disintegrate and view Real IT Photo";
            }
        }
    }

    toggle() {
        if (this.isTransitioning) return;
        this.isTransitioning = true;

        const nextMode = (this.currentMode === "real") ? "3d" : "real";
        const nextSrc = (nextMode === "real") ? this.realSrc : this.avatar3dSrc;
        const nextLabel = (nextMode === "real") ? "Real IT Portrait" : "3D Cyber Avatar";

        // Phase 1: Disintegrate active avatar
        this.img.classList.remove("assembling");
        this.img.classList.add("disintegrating");

        if (this.statusText) {
            this.statusText.innerHTML = '<strong style="color:#00f0ff;animation:pulseGlow 0.5s infinite;">DISINTEGRATING QUANTUM VOXELS...</strong>';
        }

        this.spawnDisintegrationParticles();
        this.startParticleLoop();

        // Phase 2: Switch asset and trigger reassembly scanbeam
        setTimeout(() => {
            this.img.src = nextSrc;
            this.img.alt = (nextMode === "real") ? "Vishnu - Professional IT Specialist" : "Vishnu - 3D Cyber Avatar";
            this.currentMode = nextMode;

            this.img.classList.remove("disintegrating");
            this.img.classList.add("assembling");

            if (this.scanBeam) {
                this.scanBeam.classList.remove("scanning");
                void this.scanBeam.offsetWidth;
                this.scanBeam.classList.add("scanning");
            }

            if (this.statusText) {
                this.statusText.innerHTML = `<strong style="color:#a855f7;">MATERIALIZING ${nextLabel.toUpperCase()}...</strong>`;
            }

            this.spawnAssemblyParticles();
        }, 460);

        // Phase 3: Finalize and restore clean, sharp image with no obscuring particles
        setTimeout(() => {
            this.img.classList.remove("assembling");
            this.stopParticleLoop();
            this.ctx.clearRect(0, 0, this.width, this.height);
            this.particles = [];
            this.isTransitioning = false;
            this.updateUI();
        }, 980);
    }

    spawnDisintegrationParticles() {
        this.particles = [];
        const count = 280;
        const cyberColors = [
            "rgba(0, 240, 255, ",   // Neon cyan
            "rgba(168, 85, 247, ",  // Electric purple
            "rgba(45, 212, 191, ",  // Turquoise
            "rgba(251, 191, 36, ",  // Warm amber
            "rgba(255, 255, 255, "  // White sparkle
        ];

        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 8 + 3;
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - (Math.random() * 4 + 2),
                radius: Math.random() * 2.5 + 1.2,
                colorBase: cyberColors[Math.floor(Math.random() * cyberColors.length)],
                alpha: Math.random() * 0.4 + 0.6,
                decay: Math.random() * 0.025 + 0.02
            });
        }
    }

    spawnAssemblyParticles() {
        const count = 180;
        const cyberColors = [
            "rgba(0, 240, 255, ",
            "rgba(168, 85, 247, ",
            "rgba(255, 255, 255, "
        ];

        for (let i = 0; i < count; i++) {
            const edge = Math.random();
            let x, y;
            if (edge < 0.25) { x = Math.random() * this.width; y = 0; }
            else if (edge < 0.5) { x = this.width; y = Math.random() * this.height; }
            else if (edge < 0.75) { x = Math.random() * this.width; y = this.height; }
            else { x = 0; y = Math.random() * this.height; }

            const targetX = this.width * 0.5 + (Math.random() - 0.5) * (this.width * 0.8);
            const targetY = this.height * 0.5 + (Math.random() - 0.5) * (this.height * 0.8);

            this.particles.push({
                x,
                y,
                vx: (targetX - x) * 0.08,
                vy: (targetY - y) * 0.08,
                radius: Math.random() * 2 + 1,
                colorBase: cyberColors[Math.floor(Math.random() * cyberColors.length)],
                alpha: 0.9,
                decay: 0.035
            });
        }
    }

    startParticleLoop() {
        if (this.animId) cancelAnimationFrame(this.animId);
        const loop = () => {
            this.ctx.clearRect(0, 0, this.width, this.height);

            for (let i = this.particles.length - 1; i >= 0; i--) {
                const p = this.particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.vx *= 0.95;
                p.vy *= 0.95;
                p.alpha -= p.decay;

                if (p.alpha <= 0.02) {
                    this.particles.splice(i, 1);
                    continue;
                }

                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                this.ctx.fillStyle = `${p.colorBase}${p.alpha})`;
                this.ctx.shadowBlur = 8;
                this.ctx.shadowColor = "#00f0ff";
                this.ctx.fill();
            }

            if (this.isTransitioning || this.particles.length > 0) {
                this.animId = requestAnimationFrame(loop);
            } else {
                this.ctx.clearRect(0, 0, this.width, this.height);
            }
        };
        this.animId = requestAnimationFrame(loop);
    }

    stopParticleLoop() {
        if (this.animId) {
            cancelAnimationFrame(this.animId);
            this.animId = null;
        }
    }
}



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



        // Initialize Avatar Hologram Particle Matrix

        this.avatarParticleMatrix = new AvatarParticleMatrix();

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



        // Track scroll speed for dynamic warp parallax

        window.addEventListener("scroll", () => {

            const currentScrollY = window.pageYOffset;

            this.scrollVelocity = (currentScrollY - this.lastScrollY) * 0.35;

            this.lastScrollY = currentScrollY;

        }, { passive: true });

    }



    createShockwave(x, y) {

        this.shockwaves.push({

            x,

            y,

            radius: 10,

            maxRadius: 280,

            alpha: 1,

            color: Math.random() > 0.5 ? "rgba(0, 240, 255, " : "rgba(168, 85, 247, "

        });



        for (let i = 0; i < 18; i++) {

            const angle = Math.random() * Math.PI * 2;

            const speed = Math.random() * 6 + 2;

            this.sparks.push({

                x,

                y,

                vx: Math.cos(angle) * speed,

                vy: Math.sin(angle) * speed,

                alpha: 1,

                size: Math.random() * 2.5 + 1,

                color: Math.random() > 0.4 ? "#00f0ff" : "#a855f7"

            });

        }



        // Spawn traveling data pulses on shockwave

        for (let i = 0; i < this.nodes.length; i++) {

            const node = this.nodes[i];

            const dist = Math.hypot(node.x - x, node.y - y);

            if (dist < 150) {

                this.triggerDataPulse(node);

            }

        }

    }



    triggerDataPulse(fromNode) {

        let closest = null;

        let minDist = Infinity;

        for (const n of this.nodes) {

            if (n === fromNode) continue;

            const d = Math.hypot(n.x - fromNode.x, n.y - fromNode.y);

            if (d < 160 && d < minDist) {

                minDist = d;

                closest = n;

            }

        }



        if (closest) {

            this.pulses.push({

                x1: fromNode.x,

                y1: fromNode.y,

                x2: closest.x,

                y2: closest.y,

                progress: 0,

                speed: 0.045 + Math.random() * 0.035,

                color: fromNode.color

            });

        }

    }



    render() {

        this.ctx.clearRect(0, 0, this.width, this.height);



        // Smooth mouse lag

        this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.08;

        this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.08;

        this.scrollVelocity *= 0.92;



        const maxConnectDist = 140;

        const mouseRepelDist = 110;



        // Render nodes and circuit interconnects

        for (let i = 0; i < this.nodes.length; i++) {

            const n1 = this.nodes[i];



            // Velocity update with subtle scroll momentum

            n1.x += n1.vx;

            n1.y += n1.vy - this.scrollVelocity * 0.15;



            // Bounce off edges

            if (n1.x < 0 || n1.x > this.width) n1.vx *= -1;

            if (n1.y < 0) n1.y = this.height;

            if (n1.y > this.height) n1.y = 0;



            // Mouse gravitational interaction

            if (this.mouse.active) {

                const dx = n1.x - this.mouse.x;

                const dy = n1.y - this.mouse.y;

                const dist = Math.hypot(dx, dy);

                if (dist < mouseRepelDist && dist > 0) {

                    const force = (mouseRepelDist - dist) / mouseRepelDist;

                    n1.x += (dx / dist) * force * 2.8;

                    n1.y += (dy / dist) * force * 2.8;

                }

            }



            // Draw circuit lines to nearby nodes

            for (let j = i + 1; j < this.nodes.length; j++) {

                const n2 = this.nodes[j];

                const dx = n1.x - n2.x;

                const dy = n1.y - n2.y;

                const dist = Math.hypot(dx, dy);



                if (dist < maxConnectDist) {

                    const lineAlpha = (1 - dist / maxConnectDist) * 0.22;

                    this.ctx.beginPath();

                    this.ctx.moveTo(n1.x, n1.y);

                    this.ctx.lineTo(n2.x, n2.y);

                    this.ctx.strokeStyle = `rgba(0, 240, 255, ${lineAlpha})`;

                    this.ctx.lineWidth = 1;

                    this.ctx.stroke();



                    // Periodically spawn random data pulse packets

                    if (Math.random() < 0.0006 && this.pulses.length < 25) {

                        this.pulses.push({

                            x1: n1.x,

                            y1: n1.y,

                            x2: n2.x,

                            y2: n2.y,

                            progress: 0,

                            speed: 0.02 + Math.random() * 0.03,

                            color: n1.color

                        });

                    }

                }

            }

        }



        // Render traveling data pulses

        for (let i = this.pulses.length - 1; i >= 0; i--) {

            const p = this.pulses[i];

            p.progress += p.speed;



            if (p.progress >= 1) {

                this.pulses.splice(i, 1);

                continue;

            }



            const currX = p.x1 + (p.x2 - p.x1) * p.progress;

            const currY = p.y1 + (p.y2 - p.y1) * p.progress;



            this.ctx.beginPath();

            this.ctx.arc(currX, currY, 2.8, 0, Math.PI * 2);

            this.ctx.fillStyle = "#00f0ff";

            this.ctx.shadowBlur = 10;

            this.ctx.shadowColor = "#00f0ff";

            this.ctx.fill();

            this.ctx.shadowBlur = 0;

        }



        // Render nodes

        for (const n of this.nodes) {

            this.ctx.beginPath();

            this.ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);

            this.ctx.fillStyle = `${n.color}${n.alpha})`;

            this.ctx.fill();

        }



        // Render Shockwaves

        for (let i = this.shockwaves.length - 1; i >= 0; i--) {

            const sw = this.shockwaves[i];

            sw.radius += 5.5;

            sw.alpha = 1 - (sw.radius / sw.maxRadius);



            if (sw.radius >= sw.maxRadius || sw.alpha <= 0) {

                this.shockwaves.splice(i, 1);

                continue;

            }



            this.ctx.beginPath();

            this.ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);

            this.ctx.strokeStyle = `${sw.color}${sw.alpha * 0.6})`;

            this.ctx.lineWidth = 2.5;

            this.ctx.shadowBlur = 14;

            this.ctx.shadowColor = "#00f0ff";

            this.ctx.stroke();

            this.ctx.shadowBlur = 0;

        }



        // Render Sparks

        for (let i = this.sparks.length - 1; i >= 0; i--) {

            const sp = this.sparks[i];

            sp.x += sp.vx;

            sp.y += sp.vy;

            sp.vx *= 0.94;

            sp.vy *= 0.94;

            sp.alpha -= 0.024;



            if (sp.alpha <= 0) {

                this.sparks.splice(i, 1);

                continue;

            }



            this.ctx.beginPath();

            this.ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);

            this.ctx.fillStyle = sp.color;

            this.ctx.globalAlpha = sp.alpha;

            this.ctx.fill();

            this.ctx.globalAlpha = 1;

        }



        requestAnimationFrame(() => this.render());

    }



    initCursorSpotlight() {

        const spotlight = document.createElement("div");

        spotlight.className = "cursor-spotlight-layer";

        document.body.appendChild(spotlight);



        window.addEventListener("mousemove", (e) => {

            spotlight.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;

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



                const rotateX = ((y - centerY) / centerY) * -15;

                const rotateY = ((x - centerX) / centerX) * 15;



                card.style.transform = `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(12px)`;



                // Internal parallax layer shifts

                const popImg = card.querySelector(".project-image-box, .hero-avatar-img, .avatar-image-container");

                const popBadge = card.querySelector(".project-category-badge, .floating-cyber-chip");

                const popTech = card.querySelector(".project-tech-stack, .avatar-hud-status");

                const popRings = card.querySelector("#hologram-rings-wrapper");

                const popBrackets = card.querySelectorAll(".cyber-bracket");



                if (popImg) popImg.style.transform = `translateZ(30px) scale(1.03)`;

                if (popBadge) popBadge.style.transform = `translateZ(65px)`;

                if (popTech) popTech.style.transform = `translateZ(45px)`;

                if (popRings) {

                    popRings.style.transform = `translate(-50%, -50%) rotateX(${-rotateX * 0.8}deg) rotateY(${-rotateY * 0.8}deg) translateZ(-40px)`;

                }

                popBrackets.forEach(b => b.style.transform = `translateZ(35px)`);



                // Specular Glare position

                const glareX = (x / rect.width) * 100;

                const glareY = (y / rect.height) * 100;

                card.style.setProperty("--glare-x", `${glareX}%`);

                card.style.setProperty("--glare-y", `${glareY}%`);

            };



            const handleLeave = () => {

                card.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0px)";

                const popImg = card.querySelector(".project-image-box, .hero-avatar-img, .avatar-image-container");

                const popBadge = card.querySelector(".project-category-badge, .floating-cyber-chip");

                const popTech = card.querySelector(".project-tech-stack, .avatar-hud-status");

                const popRings = card.querySelector("#hologram-rings-wrapper");

                const popBrackets = card.querySelectorAll(".cyber-bracket");



                if (popImg) popImg.style.transform = "translateZ(0) scale(1)";

                if (popBadge) popBadge.style.transform = "translateZ(0)";

                if (popTech) popTech.style.transform = "translateZ(0)";

                if (popRings) popRings.style.transform = "translate(-50%, -50%) rotateX(0deg) rotateY(0deg) translateZ(0)";

                popBrackets.forEach(b => b.style.transform = "translateZ(0)");

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

        const magneticBtns = document.querySelectorAll(".cyber-btn, .icon-circle-btn, .btn-rescan-avatar");

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

     */

    initCustomCursor() {

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



        const updateRing = () => {

            ringX += (mouseX - ringX) * 0.18;

            ringY += (mouseY - ringY) * 0.18;

            ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;

            requestAnimationFrame(updateRing);

        };

        requestAnimationFrame(updateRing);



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

     * Multi-layer Scroll Parallax for background orbs, grid, & tech glyphs

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

