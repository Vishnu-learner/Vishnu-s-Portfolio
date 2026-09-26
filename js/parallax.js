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



        if (!this.canvas || !this.img || !this.container) return;



        this.ctx = this.canvas.getContext("2d");

        this.particles = [];

        this.ambientParticles = [];

        this.width = 0;

        this.height = 0;

        this.dpr = Math.min(window.devicePixelRatio || 1, 2);

        this.state = "dispersed"; // "dispersed" | "integrating" | "assembled"

        this.progress = 0;

        this.hasTriggeredOnce = false;

        this.mouse = { x: -1000, y: -1000, active: false };



        this.init();

    }



    init() {

        this.setupDimensions();

        this.createParticles();

        this.bindEvents();

        this.setupObserver();

        this.render();
        if (this.img && !this.img.complete) {
            this.img.addEventListener(load, () => {
                this.setupDimensions();
                this.createParticles();
            });
        }

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



    sampleImagePixels(cols, rows) {

        try {

            if (!this.img || !this.img.complete || this.img.naturalWidth === 0) return null;

            const off = document.createElement("canvas");

            off.width = cols;

            off.height = rows;

            const octx = off.getContext("2d", { willReadFrequently: true });

            octx.drawImage(this.img, 0, 0, cols, rows);

            return octx.getImageData(0, 0, cols, rows).data;

        } catch (e) {

            return null;

        }

    }



    createParticles() {

        this.particles = [];

        const cols = 36;

        const rows = 48;

        const colW = this.width / cols;

        const rowH = this.height / rows;



        const pixelData = this.sampleImagePixels(cols, rows);



        const cyberColors = [

            "rgba(0, 240, 255, ",   // Neon cyan

            "rgba(168, 85, 247, ",  // Electric purple

            "rgba(45, 212, 191, ",  // Turquoise

            "rgba(251, 191, 36, ",  // Warm amber

            "rgba(255, 255, 255, "  // Specular diamond

        ];



        for (let r = 0; r < rows; r++) {

            for (let c = 0; c < cols; c++) {

                const targetX = (c + 0.5) * colW;

                const targetY = (r + 0.5) * rowH;



                // Scatter in 3D holographic field

                const angle = Math.random() * Math.PI * 2;

                const distance = Math.random() * 280 + 120;

                const originX = targetX + Math.cos(angle) * distance;

                const originY = targetY + Math.sin(angle) * distance - (Math.random() * 120 + 50);



                let colorBase;

                if (pixelData) {

                    const idx = (r * cols + c) * 4;

                    const pr = pixelData[idx];

                    const pg = pixelData[idx + 1];

                    const pb = pixelData[idx + 2];

                    // Mix sampled pixel with cyber tint

                    colorBase = `rgba(${pr}, ${pg}, ${pb}, `;

                } else {

                    colorBase = cyberColors[Math.floor(Math.random() * cyberColors.length)];

                }



                const alpha = Math.random() * 0.4 + 0.6;

                const radius = Math.random() * 1.5 + 1.2;



                this.particles.push({

                    targetX,

                    targetY,

                    x: originX,

                    y: originY,

                    originX,

                    originY,

                    vx: (Math.random() - 0.5) * 4,

                    vy: (Math.random() - 0.5) * 4,

                    radius,

                    baseRadius: radius,

                    colorBase,

                    alpha,

                    // Cascade timing: top activates first, flowing down with scanbeam

                    triggerProgress: (r / rows) * 0.70 + (Math.random() * 0.16),

                    active: false,

                    assembled: false,

                    sparkle: Math.random() * Math.PI * 2

                });

            }

        }



        // Ambient floating embers

        this.ambientParticles = [];

        for (let i = 0; i < 45; i++) {

            this.ambientParticles.push({

                x: Math.random() * this.width,

                y: Math.random() * this.height,

                vx: (Math.random() - 0.5) * 0.6,

                vy: -Math.random() * 0.8 - 0.2,

                radius: Math.random() * 1.5 + 0.8,

                alpha: Math.random() * 0.5 + 0.2,

                colorBase: Math.random() > 0.5 ? "rgba(0, 240, 255, " : "rgba(168, 85, 247, "

            });

        }

    }



    bindEvents() {

        window.addEventListener("resize", () => {

            this.setupDimensions();

            if (this.state === "assembled") {

                this.particles.forEach(p => {

                    p.x = p.targetX;

                    p.y = p.targetY;

                });

            }

        }, { passive: true });



        // Mouse hover interaction inside avatar card

        this.card.addEventListener("mousemove", (e) => {

            const rect = this.container.getBoundingClientRect();

            this.mouse.x = e.clientX - rect.left;

            this.mouse.y = e.clientY - rect.top;

            this.mouse.active = true;

        }, { passive: true });



        this.card.addEventListener("mouseleave", () => {

            this.mouse.active = false;

        });



        // Re-scan trigger button

        if (this.rescanBtn) {

            this.rescanBtn.addEventListener("click", (e) => {

                e.stopPropagation();

                this.rescan();

            });

        }



        // Clicking card re-scans if already assembled

        this.card.addEventListener("click", () => {

            if (this.state === "assembled") {

                this.rescan();

            }

        });

    }



    setupObserver() {

        const observer = new IntersectionObserver((entries) => {

            entries.forEach(entry => {

                if (entry.isIntersecting && !this.hasTriggeredOnce) {

                    this.hasTriggeredOnce = true;

                    setTimeout(() => this.startIntegration(), 300);

                }

            });

        }, { threshold: 0.15 });



        observer.observe(this.card);

    }



    rescan() {

        if (this.state === "integrating") return;

        this.state = "dispersed";

        this.progress = 0;



        // Disperse particles with explosive velocity

        this.particles.forEach(p => {

            const angle = Math.random() * Math.PI * 2;

            const force = Math.random() * 14 + 6;

            p.vx = Math.cos(angle) * force;

            p.vy = Math.sin(angle) * force;

            p.active = false;

            p.assembled = false;

        });



        // Glitch out the image

        this.img.classList.remove("assembled");

        this.img.classList.add("disassembled");



        if (this.statusText) this.statusText.textContent = "DE-DIGITIZING QUANTUM MATRIX...";

        if (this.statusPct) this.statusPct.textContent = "0%";



        setTimeout(() => this.startIntegration(), 380);

    }



    startIntegration() {

        this.state = "integrating";

        this.progress = 0;



        this.img.classList.remove("assembled");

        this.img.classList.add("disassembled");



        // Trigger scan beam animation

        if (this.scanBeam) {

            this.scanBeam.classList.remove("scanning");

            void this.scanBeam.offsetWidth; // trigger reflow

            this.scanBeam.classList.add("scanning");

        }

    }



    render() {

        this.ctx.clearRect(0, 0, this.width, this.height);



        if (this.state === "integrating") {

            this.progress += 0.009; // smooth ~1.9s duration

            const pct = Math.min(Math.round(this.progress * 100), 100);



            if (this.statusPct) this.statusPct.textContent = `${pct}%`;

            if (this.statusText) {

                if (pct < 28) this.statusText.textContent = "STREAMING QUANTUM VOXELS...";

                else if (pct < 65) this.statusText.textContent = "SYNTHESIZING NEURAL MESH...";

                else if (pct < 88) this.statusText.textContent = "LOCKING ATOMIC CO-ORDINATES...";

                else this.statusText.textContent = "HOLOGRAM MATRIX RESOLVED";

            }



            // Reveal solid image when almost assembled

            if (this.progress >= 0.86 && this.img.classList.contains("disassembled")) {

                this.img.classList.remove("disassembled");

                this.img.classList.add("assembled");

            }



            if (this.progress >= 1.0) {

                this.state = "assembled";

                if (this.statusPct) this.statusPct.textContent = "100%";

                if (this.statusText) this.statusText.textContent = "HOLOGRAM MATRIX ONLINE";

            }

        }



        // Render & Update Particles

        const spring = 0.07;

        const friction = 0.84;

        const repulseRadius = 65;



        for (let i = 0; i < this.particles.length; i++) {

            const p = this.particles[i];



            if (this.state === "integrating") {

                if (this.progress >= p.triggerProgress) {

                    p.active = true;

                }



                if (p.active) {

                    // Pull toward target

                    const dx = p.targetX - p.x;

                    const dy = p.targetY - p.y;

                    p.vx += dx * spring;

                    p.vy += dy * spring;

                    p.vx *= friction;

                    p.vy *= friction;

                    p.x += p.vx;

                    p.y += p.vy;



                    if (Math.abs(dx) < 1.5 && Math.abs(dy) < 1.5) {

                        p.assembled = true;

                    }

                } else {

                    // Floating in outer dispersion

                    p.x += p.vx * 0.4;

                    p.y += p.vy * 0.4;

                    p.vx *= 0.95;

                    p.vy *= 0.95;

                }

            } else if (this.state === "assembled") {

                // Home spring

                const dx = p.targetX - p.x;

                const dy = p.targetY - p.y;

                p.vx += dx * 0.08;

                p.vy += dy * 0.08;



                // Interactive mouse repulsion field

                if (this.mouse.active) {

                    const mdx = p.x - this.mouse.x;

                    const mdy = p.y - this.mouse.y;

                    const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

                    if (mdist < repulseRadius && mdist > 0) {

                        const force = (repulseRadius - mdist) / repulseRadius;

                        p.vx += (mdx / mdist) * force * 7;

                        p.vy += (mdy / mdist) * force * 7;

                    }

                }



                p.vx *= friction;

                p.vy *= friction;

                p.x += p.vx;

                p.y += p.vy;

            } else {

                // Dispersed idle motion

                p.x += p.vx * 0.3;

                p.y += p.vy * 0.3;

                p.vx *= 0.96;

                p.vy *= 0.96;

            }



            // Draw particle

            p.sparkle += 0.08;

            const currentAlpha = this.state === "assembled"

                ? (p.assembled ? Math.max(0.08, 0.4 + Math.sin(p.sparkle) * 0.25) : 0)

                : p.alpha;



            if (currentAlpha > 0.02) {

                this.ctx.beginPath();

                this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

                this.ctx.fillStyle = `${p.colorBase}${currentAlpha})`;

                this.ctx.shadowBlur = this.state === "assembled" ? 4 : 8;

                this.ctx.shadowColor = "#00f0ff";

                this.ctx.fill();

            }

        }



        // Draw ambient floating cyber embers

        if (this.state === "assembled") {

            for (let j = 0; j < this.ambientParticles.length; j++) {

                const ep = this.ambientParticles[j];

                ep.x += ep.vx;

                ep.y += ep.vy;



                if (ep.y < -10) {

                    ep.y = this.height + 10;

                    ep.x = Math.random() * this.width;

                }

                if (ep.x < -10 || ep.x > this.width + 10) {

                    ep.x = Math.random() * this.width;

                }



                this.ctx.beginPath();

                this.ctx.arc(ep.x, ep.y, ep.radius, 0, Math.PI * 2);

                this.ctx.fillStyle = `${ep.colorBase}${ep.alpha})`;

                this.ctx.shadowBlur = 6;

                this.ctx.shadowColor = "#a855f7";

                this.ctx.fill();

            }

        }



        requestAnimationFrame(() => this.render());

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

