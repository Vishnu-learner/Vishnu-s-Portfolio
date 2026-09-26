/**
 * Main Application Logic for Vishnu's Portfolio
 * Component rendering, navigation, theme switching, filtering, and interactions
 */

class PortfolioApp {
    constructor() {
        this.currentSkillFilter = "all";
        this.init();
    }

    init() {
        this.renderAll();
        this.bindEvents();
        this.initTheme();
        this.initNavigation();
    }

    renderAll() {
        const data = window.portfolioStore.data;
        this.renderHero(data);
        this.renderAbout(data);
        this.renderSkills(data);
        this.renderProjects(data);
        this.renderBlogs(data);
        this.renderTestimonials(data);
        this.renderContact(data);
        this.renderFooter(data);

        // Notify parallax engine and tilt handler
        window.dispatchEvent(new CustomEvent("portfolioDataRendered"));
    }

    bindEvents() {
        // Re-render when data updates in CMS
        window.addEventListener("portfolioDataChanged", () => {
            this.renderAll();
        });

        // Contact Form Submission
        const contactForm = document.getElementById("portfolio-contact-form");
        if (contactForm) {
            contactForm.onsubmit = (e) => this.handleContactSubmit(e);
        }

        // Quick Copy Email Button
        const copyEmailBtn = document.getElementById("btn-copy-email");
        if (copyEmailBtn) {
            copyEmailBtn.onclick = () => this.copyEmailToClipboard();
        }

        // Resume Modal triggers
        const resumeBtns = document.querySelectorAll(".btn-open-resume");
        resumeBtns.forEach(btn => {
            btn.onclick = (e) => {
                e.preventDefault();
                this.showResumeModal();
            };
        });

        // Admin Trigger button in header
        const adminLockBtn = document.getElementById("nav-admin-login-btn");
        if (adminLockBtn) {
            adminLockBtn.onclick = (e) => {
                e.preventDefault();
                window.dispatchEvent(new CustomEvent("openAdminLogin"));
            };
        }
    }

    renderHero(data) {
        const heroName = document.getElementById("hero-name");
        const heroTagline = document.getElementById("hero-tagline");
        const heroLocation = document.getElementById("hero-location-text");
        const heroStatus = document.getElementById("hero-status-pill");
        const heroAvatar = document.getElementById("hero-avatar-img");

        if (heroName) heroName.textContent = data.profile.name;
        if (heroTagline) heroTagline.textContent = data.profile.tagline;
        if (heroLocation) heroLocation.textContent = data.profile.location;
        if (heroStatus) heroStatus.innerHTML = `<span class="pulse-dot"></span> ${data.profile.status}`;
        if (heroAvatar && data.profile.avatar) {
            heroAvatar.src = data.profile.avatar;
            heroAvatar.alt = `${data.profile.name} - Cyber Avatar`;
        }
    }

    renderAbout(data) {
        const aboutBio = document.getElementById("about-bio-text");
        const aboutLocation = document.getElementById("about-location");
        const aboutTitle = document.getElementById("about-title-role");

        if (aboutBio) {
            aboutBio.innerHTML = `
                <p class="lead-bio">${data.profile.bio}</p>
                <div class="about-highlights-grid">
                    <div class="highlight-item">
                        <i class="fas fa-microchip"></i>
                        <div>
                            <h4>Foundations First</h4>
                            <span>Mastering C, C#, and systems logic before high-level abstraction.</span>
                        </div>
                    </div>
                    <div class="highlight-item">
                        <i class="fas fa-layer-group"></i>
                        <div>
                            <h4>Modern Speed</h4>
                            <span>Building lightweight asynchronous APIs with FastAPI & Python.</span>
                        </div>
                    </div>
                    <div class="highlight-item">
                        <i class="fas fa-heart-pulse"></i>
                        <div>
                            <h4>Purpose-Driven</h4>
                            <span>Developing software that addresses genuine regional & civic problems.</span>
                        </div>
                    </div>
                </div>
            `;
        }
        if (aboutLocation) aboutLocation.textContent = data.profile.location;
        if (aboutTitle) aboutTitle.textContent = data.profile.title;
    }

    renderSkills(data) {
        const skillsContainer = document.getElementById("skills-grid-container");
        if (!skillsContainer) return;

        const filtered = this.currentSkillFilter === "all"
            ? data.skills
            : data.skills.filter(s => s.category.toLowerCase() === this.currentSkillFilter.toLowerCase());

        skillsContainer.innerHTML = filtered.map(skill => `
            <div class="skill-card glass-card parallax-tilt reveal-up" style="--skill-color: ${skill.color || '#00f0ff'};">
                <div class="skill-card-inner">
                    <div class="skill-icon-wrap" style="color: ${skill.color};">
                        <i class="${skill.icon || 'fas fa-code'}"></i>
                    </div>
                    <div class="skill-info">
                        <div class="skill-header">
                            <h3 class="skill-name">${skill.name}</h3>
                            <span class="skill-level-chip">${skill.level}</span>
                        </div>
                        <p class="skill-desc">${skill.description || 'Core technology competency'}</p>
                        <div class="skill-category-tag">${skill.category}</div>
                    </div>
                </div>
                <div class="skill-card-glow"></div>
            </div>
        `).join("");

        // Bind filter tabs
        const filterBtns = document.querySelectorAll(".skill-filter-btn");
        filterBtns.forEach(btn => {
            btn.onclick = () => {
                filterBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                this.currentSkillFilter = btn.getAttribute("data-filter");
                this.renderSkills(window.portfolioStore.data);
                window.dispatchEvent(new CustomEvent("portfolioDataRendered"));
            };
        });
    }

    renderProjects(data) {
        const projectsContainer = document.getElementById("projects-grid-container");
        if (!projectsContainer) return;

        const isSingleProject = data.projects.length === 1;
        if (isSingleProject) {
            projectsContainer.classList.add("single-project-view");
        } else {
            projectsContainer.classList.remove("single-project-view");
        }

        projectsContainer.innerHTML = data.projects.map((proj, idx) => `
            <article class="project-card glass-card blended-project-card parallax-tilt reveal-up ${isSingleProject ? 'flagship-blended-card' : ''}" data-category="${proj.category}">
                <div class="project-terminal-header">
                    <div class="terminal-dots">
                        <span class="t-dot red"></span>
                        <span class="t-dot yellow"></span>
                        <span class="t-dot green"></span>
                        <span class="terminal-path"><i class="fas fa-terminal"></i> mindspace_core/nlp_engine.py</span>
                    </div>
                    <div class="terminal-status">
                        <span class="pulse-dot"></span>
                        <span>Bilingual Engine Active</span>
                    </div>
                </div>

                <div class="project-content">
                    <div class="project-meta-top">
                        <div class="project-special-chips">
                            <span class="feature-pill emerald"><i class="fas fa-heart-pulse"></i> Real-time Emotion Detection</span>
                            <span class="feature-pill cyan"><i class="fas fa-language"></i> Bilingual (English + தமிழ்)</span>
                            <span class="feature-pill purple"><i class="fab fa-android"></i> Android APK & PWA</span>
                        </div>
                        <span class="project-category-badge"><i class="fas fa-brain"></i> ${proj.category}</span>
                    </div>

                    <h3 class="project-title">${proj.title}</h3>
                    <p class="project-description">${proj.description}</p>

                    <div class="project-capabilities-grid">
                        <div class="capability-box">
                            <i class="fas fa-smile-beam"></i>
                            <div>
                                <h5>Sentiment Analysis</h5>
                                <span>Classifies emotional states in real-time to provide empathetic, supportive dialogue.</span>
                            </div>
                        </div>
                        <div class="capability-box">
                            <i class="fas fa-globe-asia"></i>
                            <div>
                                <h5>Grassroots Accessibility</h5>
                                <span>Bilingual NLP model connecting English and Tamil speakers without social stigma.</span>
                            </div>
                        </div>
                        <div class="capability-box">
                            <i class="fas fa-mobile-screen-button"></i>
                            <div>
                                <h5>Cross-Platform</h5>
                                <span>Built as an offline-capable Progressive Web App with Android client support.</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="project-tech-stack">
                        ${(proj.tech || []).map(t => `<span class="tech-chip"><i class="fas fa-tag"></i> ${t}</span>`).join("")}
                    </div>
                    
                    <div class="project-footer">
                        <div class="project-action-links">
                            ${proj.demo ? `<a href="${proj.demo}" target="_blank" rel="noopener noreferrer" class="proj-action-btn glow" title="Live Demo / Web Chat"><i class="fas fa-comments"></i> Launch Chatbot</a>` : ''}
                            ${proj.devfolio ? `<a href="${proj.devfolio}" target="_blank" rel="noopener noreferrer" class="proj-action-btn devfolio-badge" title="Devfolio Project"><i class="fas fa-terminal"></i> Devfolio</a>` : ''}
                            ${proj.github ? `<a href="${proj.github}" target="_blank" rel="noopener noreferrer" class="proj-action-btn" title="GitHub Repository"><i class="fab fa-github"></i> Source Code</a>` : ''}
                        </div>
                        <div class="project-footer-right">
                            <span class="devfolio-verified"><i class="fas fa-check-circle"></i> Devfolio Verified</span>
                        </div>
                    </div>
                </div>
                <div class="card-glare"></div>
            </article>
        `).join("");
    }

    renderBlogs(data) {
        const blogContainer = document.getElementById("blogs-grid-container");
        if (!blogContainer) return;

        blogContainer.innerHTML = data.blogs.map(blog => `
            <article class="blog-card glass-card parallax-tilt reveal-up" onclick="window.portfolioApp.showBlogModal('${blog.id}')">
                <div class="blog-meta-header">
                    <span class="blog-date"><i class="far fa-calendar-alt"></i> ${blog.date}</span>
                    <span class="blog-read-time"><i class="far fa-clock"></i> ${blog.readTime}</span>
                </div>
                <h3 class="blog-title">${blog.title}</h3>
                <p class="blog-excerpt">${blog.excerpt}</p>
                <div class="blog-tags">
                    ${(blog.tags || []).map(tag => `<span class="blog-tag">#${tag}</span>`).join("")}
                </div>
                <div class="blog-footer">
                    <span class="read-more-link">
                        <span>Read Full Insight</span>
                        <i class="fas fa-book-open"></i>
                    </span>
                </div>
            </article>
        `).join("");
    }

    renderTestimonials(data) {
        const testContainer = document.getElementById("testimonials-container");
        if (!testContainer) return;

        testContainer.innerHTML = data.testimonials.map(t => `
            <div class="testimonial-card glass-card reveal-up">
                <div class="testim-quote-mark"><i class="fas fa-quote-left"></i></div>
                <p class="testim-text">${t.quote}</p>
                <div class="testim-author-box">
                    <div class="testim-avatar-icon"><i class="fas fa-user-circle"></i></div>
                    <div>
                        <h4 class="testim-name">${t.author}</h4>
                        <span class="testim-role">${t.role}</span>
                    </div>
                </div>
            </div>
        `).join("");
    }

    renderContact(data) {
        const contactEmailLink = document.getElementById("contact-email-link");
        const contactEmailDisplay = document.getElementById("contact-email-display");
        const contactLoc = document.getElementById("contact-location-display");
        const socialLinksContainer = document.getElementById("contact-socials-list");

        if (contactEmailLink) contactEmailLink.href = `mailto:${data.socials.email}`;
        if (contactEmailDisplay) contactEmailDisplay.textContent = data.socials.email;
        if (contactLoc) contactLoc.textContent = data.socials.locationText;

        if (socialLinksContainer) {
            socialLinksContainer.innerHTML = `
                <a href="${data.socials.github}" target="_blank" rel="noopener noreferrer" class="social-box-btn" title="GitHub Profile">
                    <i class="fab fa-github"></i>
                    <span>GitHub</span>
                </a>
                <a href="${data.socials.devfolio}" target="_blank" rel="noopener noreferrer" class="social-box-btn devfolio" title="Devfolio Profile">
                    <i class="fas fa-terminal"></i>
                    <span>Devfolio</span>
                </a>
                <a href="${data.socials.linkedin}" target="_blank" rel="noopener noreferrer" class="social-box-btn linkedin" title="LinkedIn Profile">
                    <i class="fab fa-linkedin-in"></i>
                    <span>LinkedIn</span>
                </a>
                <a href="${data.socials.twitter || '#'}" target="_blank" rel="noopener noreferrer" class="social-box-btn twitter" title="Twitter / X">
                    <i class="fab fa-x-twitter"></i>
                    <span>Twitter/X</span>
                </a>
            `;
        }
    }

    renderFooter(data) {
        const footerName = document.getElementById("footer-name");
        const footerYear = document.getElementById("footer-year");
        if (footerName) footerName.textContent = data.profile.name;
        if (footerYear) footerYear.textContent = new Date().getFullYear();
    }

    handleContactSubmit(e) {
        e.preventDefault();
        const name = document.getElementById("contact-name").value.trim();
        const email = document.getElementById("contact-email").value.trim();
        const message = document.getElementById("contact-message").value.trim();
        const statusBox = document.getElementById("contact-form-status");

        if (!name || !email || !message) {
            statusBox.className = "form-status-alert error";
            statusBox.innerHTML = '<i class="fas fa-exclamation-circle"></i> Please fill out all fields.';
            statusBox.style.display = "flex";
            return;
        }

        // Simulate transmission and prepare direct email mailto
        statusBox.className = "form-status-alert success";
        statusBox.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Transmitting signal through quantum relay...';
        statusBox.style.display = "flex";

        setTimeout(() => {
            statusBox.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <span>Message received! You can also reach Vishnu directly at <strong>${window.portfolioStore.data.socials.email}</strong>.</span>
            `;
            document.getElementById("portfolio-contact-form").reset();
        }, 900);
    }

    copyEmailToClipboard() {
        const email = window.portfolioStore.data.socials.email;
        navigator.clipboard.writeText(email).then(() => {
            if (window.adminManager) {
                window.adminManager.showToast(`Email copied: ${email}`, "success");
            }
        }).catch(() => {
            alert(`Vishnu's Email: ${email}`);
        });
    }

    showBlogModal(blogId) {
        const blog = window.portfolioStore.data.blogs.find(b => b.id === blogId);
        if (!blog) return;

        let modal = document.getElementById("blog-view-modal");
        if (!modal) {
            modal = document.createElement("div");
            modal.id = "blog-view-modal";
            modal.className = "modal-backdrop";
            document.body.appendChild(modal);
        }

        modal.innerHTML = `
            <div class="modal-dialog blog-modal-dialog glass-card cyber-border">
                <button class="modal-close" id="blog-modal-close" aria-label="Close article">&times;</button>
                <div class="blog-modal-header">
                    <div class="blog-meta-tags">
                        <span class="blog-date"><i class="far fa-calendar-alt"></i> ${blog.date}</span>
                        <span class="blog-read-time"><i class="far fa-clock"></i> ${blog.readTime}</span>
                        <span class="blog-author"><i class="fas fa-user-edit"></i> By ${window.portfolioStore.data.profile.name}</span>
                    </div>
                    <h2>${blog.title}</h2>
                    <div class="blog-tags">
                        ${(blog.tags || []).map(t => `<span class="blog-tag">#${t}</span>`).join("")}
                    </div>
                </div>
                <div class="blog-modal-body">
                    ${this.formatMarkdownToHtml(blog.content)}
                </div>
                <div class="blog-modal-footer">
                    <button type="button" class="cyber-btn sm" id="blog-modal-back-btn">
                        <i class="fas fa-arrow-left"></i> Back to Portfolio
                    </button>
                </div>
            </div>
        `;

        modal.classList.add("active");
        document.getElementById("blog-modal-close").onclick = () => modal.classList.remove("active");
        document.getElementById("blog-modal-back-btn").onclick = () => modal.classList.remove("active");
    }

    formatMarkdownToHtml(text) {
        if (!text) return "";
        let formatted = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>');
        return `<p>${formatted}</p>`;
    }

    showResumeModal() {
        const data = window.portfolioStore.data;
        let modal = document.getElementById("resume-viewer-modal");
        if (!modal) {
            modal = document.createElement("div");
            modal.id = "resume-viewer-modal";
            modal.className = "modal-backdrop";
            document.body.appendChild(modal);
        }

        modal.innerHTML = `
            <div class="modal-dialog resume-modal-dialog glass-card cyber-border">
                <button class="modal-close" id="resume-modal-close" aria-label="Close resume">&times;</button>
                <div class="resume-sheet">
                    <header class="resume-header">
                        <div>
                            <h2 class="res-name">${data.profile.name}</h2>
                            <p class="res-title">${data.profile.tagline}</p>
                            <div class="res-meta-line">
                                <span><i class="fas fa-map-marker-alt"></i> ${data.profile.location}</span>
                                <span><i class="fas fa-envelope"></i> ${data.socials.email}</span>
                                <span><i class="fab fa-github"></i> github.com/vishnu-dev</span>
                            </div>
                        </div>
                        <div class="resume-actions-print">
                            <button type="button" class="cyber-btn sm glow-cyan" onclick="window.print()">
                                <i class="fas fa-print"></i> Print / PDF
                            </button>
                        </div>
                    </header>

                    <section class="resume-sec">
                        <h3><i class="fas fa-user"></i> Professional Profile</h3>
                        <p>${data.profile.bio}</p>
                    </section>

                    <section class="resume-sec">
                        <h3><i class="fas fa-bolt"></i> Technical Competencies</h3>
                        <div class="res-skills-list">
                            ${data.skills.map(s => `
                                <div class="res-skill-pill">
                                    <strong>${s.name}</strong> (${s.level})
                                </div>
                            `).join("")}
                        </div>
                    </section>

                    <section class="resume-sec">
                        <h3><i class="fas fa-rocket"></i> Key Projects</h3>
                        <div class="res-projects-list">
                            ${data.projects.map(p => `
                                <div class="res-proj-item">
                                    <div class="res-proj-top">
                                        <h4>${p.title}</h4>
                                        <span class="res-tag-cat">${p.category}</span>
                                    </div>
                                    <p>${p.description}</p>
                                    <div class="res-proj-tags">
                                        Stack: ${(p.tech || []).join(", ")}
                                    </div>
                                </div>
                            `).join("")}
                        </div>
                    </section>

                    <section class="resume-sec">
                        <h3><i class="fas fa-graduation-cap"></i> Education & Foundation</h3>
                        <div class="res-proj-item">
                            <div class="res-proj-top">
                                <h4>IT & Computer Science Foundations</h4>
                                <span>Salem, Tamil Nadu</span>
                            </div>
                            <p>Focused coursework in C Systems Programming, Object-Oriented Software Engineering (Java / C#), and Modern Asynchronous Web Frameworks (FastAPI).</p>
                        </div>
                    </section>
                </div>
            </div>
        `;

        modal.classList.add("active");
        document.getElementById("resume-modal-close").onclick = () => modal.classList.remove("active");
    }

    initTheme() {
        const themeBtn = document.getElementById("theme-toggle-btn");
        const savedTheme = localStorage.getItem("vishnu_portfolio_theme") || "dark";
        document.documentElement.setAttribute("data-theme", savedTheme);

        if (themeBtn) {
            themeBtn.innerHTML = savedTheme === "light"
                ? '<i class="fas fa-moon"></i>'
                : '<i class="fas fa-sun"></i>';

            themeBtn.onclick = () => {
                const current = document.documentElement.getAttribute("data-theme");
                const next = current === "light" ? "dark" : "light";
                document.documentElement.setAttribute("data-theme", next);
                localStorage.setItem("vishnu_portfolio_theme", next);
                themeBtn.innerHTML = next === "light"
                    ? '<i class="fas fa-moon"></i>'
                    : '<i class="fas fa-sun"></i>';
            };
        }
    }

    initNavigation() {
        const toggleBtn = document.getElementById("nav-mobile-toggle");
        const navMenu = document.getElementById("nav-menu-links");

        if (toggleBtn && navMenu) {
            toggleBtn.onclick = () => {
                navMenu.classList.toggle("open");
                toggleBtn.classList.toggle("active");
            };

            // Close on link click
            navMenu.querySelectorAll("a").forEach(a => {
                a.onclick = () => {
                    navMenu.classList.remove("open");
                    toggleBtn.classList.remove("active");
                };
            });
        }

        // Header glass scroll effect
        const navbar = document.getElementById("main-navbar");
        window.addEventListener("scroll", () => {
            if (window.pageYOffset > 50) {
                navbar.classList.add("scrolled");
            } else {
                navbar.classList.remove("scrolled");
            }
        }, { passive: true });
    }
}

// Initialize on DOM ready
document.addEventListener("DOMContentLoaded", () => {
    window.portfolioApp = new PortfolioApp();
});
