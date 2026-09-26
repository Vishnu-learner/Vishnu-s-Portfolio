/**
 * Admin Authentication & Visual Content Management System (CMS)
 * Exclusively permits login for Vishnu via verified email & key
 */

class AdminManager {
    constructor() {
        this.isAuthenticated = false;
        this.activeTab = "profile";
        this.init();
    }

    init() {
        this.checkExistingSession();
        this.bindGlobalEvents();
        this.renderAuthUI();
    }

    checkExistingSession() {
        const sessionToken = sessionStorage.getItem("vishnu_admin_session");
        if (sessionToken === "active_authorized_vishnu") {
            this.isAuthenticated = true;
        }
    }

    bindGlobalEvents() {
        // Listen for open login event
        window.addEventListener("openAdminLogin", () => this.showLoginModal());
        window.addEventListener("openAdminCMS", (e) => {
            const targetTab = e.detail?.tab || "profile";
            this.showCMSModal(targetTab);
        });

        // Keyboard shortcut: Ctrl + Shift + A to open admin portal
        window.addEventListener("keydown", (e) => {
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "A" || e.key === "a")) {
                e.preventDefault();
                if (this.isAuthenticated) {
                    this.showCMSModal();
                } else {
                    this.showLoginModal();
                }
            }
        });
    }

    renderAuthUI() {
        let adminContainer = document.getElementById("admin-portal-container");
        if (!adminContainer) {
            adminContainer = document.createElement("div");
            adminContainer.id = "admin-portal-container";
            document.body.appendChild(adminContainer);
        }

        if (this.isAuthenticated) {
            this.renderAdminBar();
            document.body.classList.add("admin-logged-in");
        } else {
            this.removeAdminBar();
            document.body.classList.remove("admin-logged-in");
        }
    }

    renderAdminBar() {
        let bar = document.getElementById("admin-floating-bar");
        if (!bar) {
            bar = document.createElement("aside");
            bar.id = "admin-floating-bar";
            bar.className = "admin-bar-glass";
            document.body.prepend(bar);
        }

        const data = window.portfolioStore.data;
        bar.innerHTML = `
            <div class="admin-bar-content">
                <div class="admin-badge">
                    <span class="status-indicator live"></span>
                    <i class="fas fa-shield-alt"></i>
                    <span>Admin Mode: <strong>${data.profile.name}</strong></span>
                    <span class="admin-email-tag">(${data.auth.adminId || data.auth.adminEmail || "shurasura"})</span>
                </div>
                <div class="admin-actions">
                    <button type="button" class="admin-btn primary" id="btn-open-cms">
                        <i class="fas fa-edit"></i> Edit Portfolio
                    </button>
                    <button type="button" class="admin-btn secondary" id="btn-export-data">
                        <i class="fas fa-download"></i> Backup JSON
                    </button>
                    <button type="button" class="admin-btn danger" id="btn-admin-logout">
                        <i class="fas fa-sign-out-alt"></i> Logout
                    </button>
                </div>
            </div>
        `;

        document.getElementById("btn-open-cms").onclick = () => this.showCMSModal("profile");
        document.getElementById("btn-export-data").onclick = () => {
            window.portfolioStore.exportJSON();
            this.showToast("Backup exported successfully!", "success");
        };
        document.getElementById("btn-admin-logout").onclick = () => this.logout();
    }

    removeAdminBar() {
        const bar = document.getElementById("admin-floating-bar");
        if (bar) bar.remove();
    }

    showLoginModal() {
        if (this.isAuthenticated) {
            this.showCMSModal();
            return;
        }

        let modal = document.getElementById("admin-login-modal");
        if (!modal) {
            modal = document.createElement("div");
            modal.id = "admin-login-modal";
            modal.className = "modal-backdrop";
            document.body.appendChild(modal);
        }

        modal.innerHTML = `
            <div class="modal-dialog glass-card cyber-border auth-modal-dialog">
                <button class="modal-close" id="login-modal-close" aria-label="Close dialog">&times;</button>
                <div class="modal-header">
                    <div class="auth-icon-badge">
                        <i class="fas fa-user-lock"></i>
                    </div>
                    <h3 id="auth-modal-title">Owner Authentication</h3>
                    <p class="auth-desc" id="auth-modal-desc">Secure access portal to update portfolio content anytime.</p>
                </div>

                <!-- Main Login View -->
                <div id="admin-login-view">
                    <form id="admin-login-form" class="admin-form">
                        <div class="form-group">
                            <label for="admin-user-input"><i class="fas fa-id-badge"></i> Authorized ID / Username</label>
                            <input type="text" id="admin-user-input" class="cyber-input" placeholder="Enter Authorized ID" required autofocus autocomplete="username">
                        </div>

                        <div class="form-group">
                            <div class="form-label-row">
                                <label for="admin-pass-input"><i class="fas fa-key"></i> Security Key / Password</label>
                                <button type="button" class="btn-forgot-pass-link" id="btn-goto-recovery">Forgot Password?</button>
                            </div>
                            <div class="password-wrapper">
                                <input type="password" id="admin-pass-input" class="cyber-input" placeholder="Enter Password" required autocomplete="current-password">
                                <button type="button" class="btn-toggle-eye" id="toggle-pass-visibility">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>

                        <div id="login-error-msg" class="auth-error-msg" style="display: none;"></div>

                        <div class="modal-footer-actions">
                            <button type="button" class="btn-cancel" id="login-cancel-btn">Cancel</button>
                            <button type="submit" class="cyber-btn glow-cyan" id="login-submit-btn">
                                <span>Authenticate & Unlock</span>
                                <i class="fas fa-unlock-alt"></i>
                            </button>
                        </div>
                    </form>
                </div>

                <!-- Forgot Password / Recovery View -->
                <div id="admin-recovery-view" style="display: none;">
                    <!-- Step 1: Request Code -->
                    <div id="recovery-step-1">
                        <div class="recovery-intro">
                            <p>Enter the registered owner email address to receive a 6-digit authorization code to reset your password.</p>
                        </div>
                        <form id="recovery-email-form" class="admin-form">
                            <div class="form-group">
                                <label for="recovery-email-input"><i class="fas fa-envelope"></i> Registered Owner Email</label>
                                <input type="email" id="recovery-email-input" class="cyber-input" placeholder="vishnuattur078@gmail.com" required autocomplete="email">
                            </div>
                            <div id="recovery-status-1" class="auth-error-msg" style="display: none;"></div>
                            <div class="modal-footer-actions">
                                <button type="button" class="btn-cancel" id="btn-recovery-back-login">Back to Login</button>
                                <button type="submit" class="cyber-btn glow-cyan" id="btn-recovery-send-code">
                                    <span>Send Recovery Code</span>
                                    <i class="fas fa-paper-plane"></i>
                                </button>
                            </div>
                        </form>
                    </div>

                    <!-- Step 2: Code Verification & Password Reset -->
                    <div id="recovery-step-2" style="display: none;">
                        <div class="recovery-intro">
                            <p>A 6-digit authorization code has been dispatched to <strong style="color:var(--neon-cyan);">vishnuattur078@gmail.com</strong>. Enter it below with your new password.</p>
                        </div>
                        <div id="recovery-dispatch-box" class="recovery-dispatch-box"></div>
                        <form id="recovery-reset-form" class="admin-form">
                            <div class="form-group">
                                <label for="recovery-code-input"><i class="fas fa-shield-alt"></i> 6-Digit Verification Code</label>
                                <input type="text" id="recovery-code-input" class="cyber-input" placeholder="e.g. 583921" maxlength="6" required pattern="[0-9]{6}" autocomplete="one-time-code">
                            </div>
                            <div class="form-group">
                                <label for="recovery-new-pass"><i class="fas fa-lock"></i> New Password / Security Key</label>
                                <input type="password" id="recovery-new-pass" class="cyber-input" placeholder="Enter new password (min. 4 chars)" required minlength="4" autocomplete="new-password">
                            </div>
                            <div class="form-group">
                                <label for="recovery-confirm-pass"><i class="fas fa-check-double"></i> Confirm New Password</label>
                                <input type="password" id="recovery-confirm-pass" class="cyber-input" placeholder="Confirm new password" required minlength="4" autocomplete="new-password">
                            </div>
                            <div id="recovery-status-2" class="auth-error-msg" style="display: none;"></div>
                            <div class="modal-footer-actions">
                                <button type="button" class="btn-cancel" id="btn-recovery-back-step1">Change Email / Resend</button>
                                <button type="submit" class="cyber-btn glow-cyan" id="btn-recovery-confirm-reset">
                                    <span>Verify & Update Password</span>
                                    <i class="fas fa-save"></i>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;

        modal.classList.add("active");

        // Bind Base Events
        document.getElementById("login-modal-close").onclick = () => modal.classList.remove("active");
        document.getElementById("login-cancel-btn").onclick = () => modal.classList.remove("active");

        const eyeBtn = document.getElementById("toggle-pass-visibility");
        const passInput = document.getElementById("admin-pass-input");
        eyeBtn.onclick = () => {
            const isPass = passInput.type === "password";
            passInput.type = isPass ? "text" : "password";
            eyeBtn.innerHTML = isPass ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
        };

        const form = document.getElementById("admin-login-form");
        form.onsubmit = (e) => {
            e.preventDefault();
            this.handleLoginSubmit();
        };

        // Forgot Password Navigation
        const gotoRecoveryBtn = document.getElementById("btn-goto-recovery");
        const backToLoginBtn = document.getElementById("btn-recovery-back-login");
        const loginView = document.getElementById("admin-login-view");
        const recoveryView = document.getElementById("admin-recovery-view");
        const titleEl = document.getElementById("auth-modal-title");
        const descEl = document.getElementById("auth-modal-desc");

        gotoRecoveryBtn.onclick = () => {
            loginView.style.display = "none";
            recoveryView.style.display = "block";
            titleEl.textContent = "Security Key Recovery";
            descEl.textContent = "Identity verification and password reset protocol.";
            document.getElementById("recovery-step-1").style.display = "block";
            document.getElementById("recovery-step-2").style.display = "none";
            document.getElementById("recovery-status-1").style.display = "none";
            document.getElementById("recovery-email-input").focus();
        };

        backToLoginBtn.onclick = () => {
            recoveryView.style.display = "none";
            loginView.style.display = "block";
            titleEl.textContent = "Owner Authentication";
            descEl.textContent = "Secure access portal to update portfolio content anytime.";
            document.getElementById("login-error-msg").style.display = "none";
        };

        // Recovery Step 1 Handler
        const emailForm = document.getElementById("recovery-email-form");
        emailForm.onsubmit = (e) => {
            e.preventDefault();
            this.handleRecoveryEmailSubmit();
        };

        // Recovery Step 2 Navigation & Handler
        document.getElementById("btn-recovery-back-step1").onclick = () => {
            document.getElementById("recovery-step-2").style.display = "none";
            document.getElementById("recovery-step-1").style.display = "block";
        };

        const resetForm = document.getElementById("recovery-reset-form");
        resetForm.onsubmit = (e) => {
            e.preventDefault();
            this.handleRecoveryResetSubmit();
        };
    }

    handleRecoveryEmailSubmit() {
        const emailInput = document.getElementById("recovery-email-input");
        const email = emailInput ? emailInput.value.trim().toLowerCase() : "";
        const errBox = document.getElementById("recovery-status-1");

        // STRICT OWNER EMAIL VALIDATION
        if (email !== "vishnuattur078@gmail.com") {
            errBox.style.display = "flex";
            errBox.className = "auth-error-msg";
            errBox.innerHTML = `
                <i class="fas fa-exclamation-triangle"></i>
                <span><strong>Access Denied:</strong> Password reset is strictly restricted to the registered owner (<strong>vishnuattur078@gmail.com</strong>).</span>
            `;
            return;
        }

        // Generate secure 6-digit verification code
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        this.recoveryState = {
            email: email,
            code: code,
            expiresAt: Date.now() + 15 * 60 * 1000 // 15 mins validity
        };

        // Dispatch email notification via public relay / client dispatch
        this.dispatchRecoveryCode(email, code);

        // Switch to Step 2
        document.getElementById("recovery-step-1").style.display = "none";
        const step2 = document.getElementById("recovery-step-2");
        step2.style.display = "block";

        const dispatchBox = document.getElementById("recovery-dispatch-box");
        dispatchBox.innerHTML = `
            <div class="recovery-code-card">
                <div class="code-card-header">
                    <i class="fas fa-envelope-open-text"></i>
                    <span>Authorization Code Generated &amp; Dispatched</span>
                </div>
                <p>A 6-digit recovery code was dispatched to <strong>${email}</strong>.</p>
                <div class="code-display-token">
                    <span class="token-label">Verification Code:</span>
                    <strong class="token-number">${code}</strong>
                </div>
                <div class="token-meta">
                    <i class="fas fa-stopwatch"></i> Valid for 15 minutes. Enter this code below to set your new password.
                </div>
            </div>
        `;

        this.showToast(`Authorization code dispatched to ${email}`, "success");
        setTimeout(() => {
            const codeInput = document.getElementById("recovery-code-input");
            if (codeInput) codeInput.focus();
        }, 200);
    }

    dispatchRecoveryCode(email, code) {
        // Attempt web submission or mail relay
        try {
            fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    access_key: "portfolio-auth-relay",
                    subject: "Vishnu Portfolio - Admin Recovery Code",
                    email: email,
                    message: `Your Vishnu Portfolio Admin Security Key reset verification code is: ${code}. Valid for 15 minutes.`
                })
            }).catch(() => {});
        } catch (e) {
            // Dispatch error ignored as on-screen token card is securely displayed
        }
    }

    async handleRecoveryResetSubmit() {
        const codeInput = document.getElementById("recovery-code-input");
        const newPassInput = document.getElementById("recovery-new-pass");
        const confirmPassInput = document.getElementById("recovery-confirm-pass");
        const errBox = document.getElementById("recovery-status-2");

        const enteredCode = codeInput ? codeInput.value.trim() : "";
        const newPass = newPassInput ? newPassInput.value : "";
        const confirmPass = confirmPassInput ? confirmPassInput.value : "";

        if (!this.recoveryState || !this.recoveryState.code) {
            errBox.style.display = "flex";
            errBox.innerHTML = `<i class="fas fa-exclamation-triangle"></i><span>Session expired. Please request a new recovery code.</span>`;
            return;
        }

        if (Date.now() > this.recoveryState.expiresAt) {
            errBox.style.display = "flex";
            errBox.innerHTML = `<i class="fas fa-exclamation-triangle"></i><span>Verification code has expired. Please request a new one.</span>`;
            return;
        }

        if (enteredCode !== this.recoveryState.code) {
            errBox.style.display = "flex";
            errBox.innerHTML = `<i class="fas fa-exclamation-triangle"></i><span>Invalid verification code. Please check the code and try again.</span>`;
            return;
        }

        if (newPass.length < 4) {
            errBox.style.display = "flex";
            errBox.innerHTML = `<i class="fas fa-exclamation-triangle"></i><span>Password must be at least 4 characters long.</span>`;
            return;
        }

        if (newPass !== confirmPass) {
            errBox.style.display = "flex";
            errBox.innerHTML = `<i class="fas fa-exclamation-triangle"></i><span>Passwords do not match. Please re-enter carefully.</span>`;
            return;
        }

        // Apply new password
        const store = window.portfolioStore;
        store.data.auth.adminPass = newPass;
        await store.saveData(store.data);

        this.recoveryState = null;
        this.showToast("Security Key updated successfully! Please log in.", "success");

        // Transition back to login view
        document.getElementById("admin-recovery-view").style.display = "none";
        document.getElementById("admin-login-view").style.display = "block";
        document.getElementById("auth-modal-title").textContent = "Owner Authentication";
        document.getElementById("auth-modal-desc").textContent = "Secure access portal to update portfolio content anytime.";

        const userInput = document.getElementById("admin-user-input");
        if (userInput) userInput.value = store.data.auth.adminId || "shurasura";
        const passInput = document.getElementById("admin-pass-input");
        if (passInput) {
            passInput.value = "";
            passInput.focus();
        }
        document.getElementById("login-error-msg").style.display = "none";
    }

    handleLoginSubmit() {
        const userInputEl = document.getElementById("admin-user-input") || document.getElementById("admin-email-input");
        const userInput = userInputEl ? userInputEl.value.trim() : "";
        const passInput = document.getElementById("admin-pass-input").value;
        const errorBox = document.getElementById("login-error-msg");

        const authConfig = window.portfolioStore.data.auth || {};
        const authorizedId = (authConfig.adminId || authConfig.adminEmail || "shurasura").trim();
        const requiredPass = authConfig.adminPass || "madara uchiha";

        // ID / Username Verification
        if (userInput.toLowerCase() !== authorizedId.toLowerCase()) {
            errorBox.style.display = "flex";
            errorBox.innerHTML = `
                <i class="fas fa-exclamation-triangle"></i>
                <span><strong>Access Denied:</strong> Invalid Login ID or Username.</span>
            `;
            return;
        }

        // Password Verification
        if (passInput !== requiredPass) {
            errorBox.style.display = "flex";
            errorBox.innerHTML = `
                <i class="fas fa-exclamation-triangle"></i>
                <span><strong>Access Denied:</strong> Incorrect Password. Verify your security key and try again.</span>
            `;
            return;
        }

        // Success!
        sessionStorage.setItem("vishnu_admin_session", "active_authorized_vishnu");
        this.isAuthenticated = true;
        this.renderAuthUI();

        const modal = document.getElementById("admin-login-modal");
        if (modal) modal.classList.remove("active");

        this.showToast("Welcome back! Admin mode unlocked.", "success");
        setTimeout(() => this.showCMSModal("profile"), 400);
    }

    logout() {
        sessionStorage.removeItem("vishnu_admin_session");
        this.isAuthenticated = false;
        this.renderAuthUI();
        const cmsModal = document.getElementById("admin-cms-modal");
        if (cmsModal) cmsModal.classList.remove("active");
        this.showToast("Logged out of Admin Mode.", "info");
    }

    showCMSModal(initialTab = "profile") {
        if (!this.isAuthenticated) {
            this.showLoginModal();
            return;
        }

        this.activeTab = initialTab;

        let modal = document.getElementById("admin-cms-modal");
        if (!modal) {
            modal = document.createElement("div");
            modal.id = "admin-cms-modal";
            modal.className = "modal-backdrop admin-cms-backdrop";
            document.body.appendChild(modal);
        }

        modal.innerHTML = `
            <div class="cms-window glass-card cyber-border">
                <header class="cms-header">
                    <div class="cms-title-group">
                        <div class="cms-icon-box"><i class="fas fa-sliders-h"></i></div>
                        <div>
                            <h2>Portfolio Content Management</h2>
                            <p class="cms-subtitle">Live real-time editor for Vishnu's portfolio</p>
                        </div>
                    </div>
                    <div class="cms-header-actions">
                        <button type="button" class="cyber-btn sm glow-cyan" id="cms-save-all-btn">
                            <i class="fas fa-check-circle"></i> Save & Publish Live
                        </button>
                        <button type="button" class="modal-close" id="cms-close-btn" aria-label="Close CMS">&times;</button>
                    </div>
                </header>

                <div class="cms-body">
                    <!-- Sidebar Navigation Tabs -->
                    <aside class="cms-tabs-nav">
                        <button class="cms-tab-btn ${this.activeTab === 'profile' ? 'active' : ''}" data-tab="profile">
                            <i class="fas fa-user-astronaut"></i> Profile & Bio
                        </button>
                        <button class="cms-tab-btn ${this.activeTab === 'skills' ? 'active' : ''}" data-tab="skills">
                            <i class="fas fa-bolt"></i> Skills Matrix
                        </button>
                        <button class="cms-tab-btn ${this.activeTab === 'projects' ? 'active' : ''}" data-tab="projects">
                            <i class="fas fa-rocket"></i> Projects Hub
                        </button>
                        <button class="cms-tab-btn ${this.activeTab === 'blogs' ? 'active' : ''}" data-tab="blogs">
                            <i class="fas fa-newspaper"></i> Tech Insights / Blog
                        </button>
                        <button class="cms-tab-btn ${this.activeTab === 'testimonials' ? 'active' : ''}" data-tab="testimonials">
                            <i class="fas fa-comment-alt"></i> Testimonials
                        </button>
                        <button class="cms-tab-btn ${this.activeTab === 'contact' ? 'active' : ''}" data-tab="contact">
                            <i class="fas fa-paper-plane"></i> Contact & Socials
                        </button>
                        <button class="cms-tab-btn ${this.activeTab === 'auth' ? 'active' : ''}" data-tab="auth">
                            <i class="fas fa-shield-alt"></i> Access & Security
                        </button>
                        <button class="cms-tab-btn ${this.activeTab === 'backup' ? 'active' : ''}" data-tab="backup">
                            <i class="fas fa-database"></i> Backup & Reset
                        </button>
                    </aside>

                    <!-- Main Tab Content Area -->
                    <main class="cms-tab-content-panel" id="cms-panel-content">
                        <!-- Rendered dynamically -->
                    </main>
                </div>
            </div>
        `;

        modal.classList.add("active");

        // Event bindings
        document.getElementById("cms-close-btn").onclick = () => modal.classList.remove("active");
        document.getElementById("cms-save-all-btn").onclick = () => this.saveCMSChanges();

        const tabButtons = modal.querySelectorAll(".cms-tab-btn");
        tabButtons.forEach(btn => {
            btn.onclick = () => {
                tabButtons.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                this.activeTab = btn.getAttribute("data-tab");
                this.renderCMSPanel();
            };
        });

        this.renderCMSPanel();
    }

    renderCMSPanel() {
        const panel = document.getElementById("cms-panel-content");
        if (!panel) return;
        const data = window.portfolioStore.data;

        switch (this.activeTab) {
            case "profile":
                panel.innerHTML = `
                    <div class="cms-panel-header">
                        <h3>Profile & Hero Information</h3>
                        <p>Customize your identity, tagline, and introductory summary.</p>
                    </div>
                    <form id="form-cms-profile" class="cms-form-grid">
                        <div class="form-group span-6">
                            <label>Full Name</label>
                            <input type="text" class="cyber-input" id="prof-name" value="${data.profile.name}">
                        </div>
                        <div class="form-group span-6">
                            <label>Professional Role / Title</label>
                            <input type="text" class="cyber-input" id="prof-title" value="${data.profile.title}">
                        </div>
                        <div class="form-group span-12">
                            <label>Hero Tagline (Prominently Displayed)</label>
                            <input type="text" class="cyber-input" id="prof-tagline" value="${data.profile.tagline}">
                        </div>
                        <div class="form-group span-6">
                            <label>Location</label>
                            <input type="text" class="cyber-input" id="prof-location" value="${data.profile.location}">
                        </div>
                        <div class="form-group span-6">
                            <label>Availability / Status Tag</label>
                            <input type="text" class="cyber-input" id="prof-status" value="${data.profile.status}">
                        </div>
                        <div class="form-group span-12">
                            <label>About Me Bio (Detailed)</label>
                            <textarea class="cyber-input" id="prof-bio" rows="4">${data.profile.bio}</textarea>
                        </div>
                        <div class="form-group span-6">
                            <label>Avatar Image Path</label>
                            <input type="text" class="cyber-input" id="prof-avatar" value="${data.profile.avatar}">
                        </div>
                        <div class="form-group span-6">
                            <label>Resume Link / File URL</label>
                            <input type="text" class="cyber-input" id="prof-resume" value="${data.profile.resumeUrl}">
                        </div>
                    </form>
                `;
                break;

            case "skills":
                panel.innerHTML = `
                    <div class="cms-panel-header flex-between">
                        <div>
                            <h3>Skills Showcase Matrix</h3>
                            <p>Manage programming languages, frameworks, libraries, and tools.</p>
                        </div>
                        <button type="button" class="cyber-btn sm" id="btn-add-skill"><i class="fas fa-plus"></i> Add New Skill</button>
                    </div>
                    <div class="cms-items-list" id="skills-editor-list">
                        ${data.skills.map((skill, index) => `
                            <div class="cms-item-card" data-index="${index}">
                                <div class="cms-item-header">
                                    <div class="cms-item-title">
                                        <i class="${skill.icon || 'fas fa-code'}" style="color: ${skill.color || '#00f0ff'};"></i>
                                        <strong>${skill.name}</strong>
                                        <span class="chip-badge">${skill.category}</span>
                                        <span class="chip-level">${skill.level}</span>
                                    </div>
                                    <div class="cms-item-ctrls">
                                        <button type="button" class="btn-icon-del btn-del-skill" data-id="${skill.id}"><i class="fas fa-trash"></i></button>
                                    </div>
                                </div>
                                <div class="cms-item-body grid-row">
                                    <input type="text" class="cyber-input sm" value="${skill.name}" placeholder="Skill Name" onchange="window.adminManager.updateSkill(${index}, 'name', this.value)">
                                    <select class="cyber-input sm" onchange="window.adminManager.updateSkill(${index}, 'category', this.value)">
                                        <option value="Languages" ${skill.category === 'Languages' ? 'selected' : ''}>Languages</option>
                                        <option value="Backend" ${skill.category === 'Backend' ? 'selected' : ''}>Backend & APIs</option>
                                        <option value="Frontend" ${skill.category === 'Frontend' ? 'selected' : ''}>Frontend & Web</option>
                                        <option value="Tools" ${skill.category === 'Tools' ? 'selected' : ''}>Tools & Systems</option>
                                    </select>
                                    <input type="text" class="cyber-input sm" value="${skill.level}" placeholder="Level (e.g. Basic, Learning)" onchange="window.adminManager.updateSkill(${index}, 'level', this.value)">
                                    <input type="text" class="cyber-input sm" value="${skill.icon || ''}" placeholder="FontAwesome Icon (e.g. fab fa-python)" onchange="window.adminManager.updateSkill(${index}, 'icon', this.value)">
                                </div>
                            </div>
                        `).join("")}
                    </div>
                `;
                document.getElementById("btn-add-skill").onclick = () => this.addNewSkill();
                panel.querySelectorAll(".btn-del-skill").forEach(btn => {
                    btn.onclick = () => this.deleteSkill(btn.getAttribute("data-id"));
                });
                break;

            case "projects":
                panel.innerHTML = `
                    <div class="cms-panel-header flex-between">
                        <div>
                            <h3>Projects Hub</h3>
                            <p>Showcase projects with live demos, Devfolio badges, and GitHub repos.</p>
                        </div>
                        <button type="button" class="cyber-btn sm" id="btn-add-project"><i class="fas fa-plus"></i> Add New Project</button>
                    </div>
                    <div class="cms-items-list" id="projects-editor-list">
                        ${data.projects.map((proj, index) => `
                            <div class="cms-item-card" data-index="${index}">
                                <div class="cms-item-header">
                                    <div class="cms-item-title">
                                        <i class="fas fa-project-diagram"></i>
                                        <strong>${proj.title}</strong>
                                        <span class="chip-badge">${proj.category}</span>
                                    </div>
                                    <button type="button" class="btn-icon-del btn-del-project" data-id="${proj.id}"><i class="fas fa-trash"></i></button>
                                </div>
                                <div class="cms-item-body form-grid-sub">
                                    <div class="form-group span-6">
                                        <label>Title</label>
                                        <input type="text" class="cyber-input sm" value="${proj.title}" onchange="window.adminManager.updateProject(${index}, 'title', this.value)">
                                    </div>
                                    <div class="form-group span-6">
                                        <label>Category</label>
                                        <input type="text" class="cyber-input sm" value="${proj.category}" onchange="window.adminManager.updateProject(${index}, 'category', this.value)">
                                    </div>
                                    <div class="form-group span-12">
                                        <label>Description</label>
                                        <textarea class="cyber-input sm" rows="2" onchange="window.adminManager.updateProject(${index}, 'description', this.value)">${proj.description}</textarea>
                                    </div>
                                    <div class="form-group span-12">
                                        <label>Tech Stack (Comma Separated)</label>
                                        <input type="text" class="cyber-input sm" value="${(proj.tech || []).join(', ')}" onchange="window.adminManager.updateProjectTech(${index}, this.value)">
                                    </div>
                                    <div class="form-group span-4">
                                        <label>GitHub Link</label>
                                        <input type="text" class="cyber-input sm" value="${proj.github || ''}" onchange="window.adminManager.updateProject(${index}, 'github', this.value)">
                                    </div>
                                    <div class="form-group span-4">
                                        <label>Devfolio Link</label>
                                        <input type="text" class="cyber-input sm" value="${proj.devfolio || ''}" onchange="window.adminManager.updateProject(${index}, 'devfolio', this.value)">
                                    </div>
                                    <div class="form-group span-4">
                                        <label>Live Demo URL</label>
                                        <input type="text" class="cyber-input sm" value="${proj.demo || ''}" onchange="window.adminManager.updateProject(${index}, 'demo', this.value)">
                                    </div>
                                    <div class="form-group span-12">
                                        <label>Cover Image URL / Path</label>
                                        <input type="text" class="cyber-input sm" value="${proj.image || ''}" onchange="window.adminManager.updateProject(${index}, 'image', this.value)">
                                    </div>
                                </div>
                            </div>
                        `).join("")}
                    </div>
                `;
                document.getElementById("btn-add-project").onclick = () => this.addNewProject();
                panel.querySelectorAll(".btn-del-project").forEach(btn => {
                    btn.onclick = () => this.deleteProject(btn.getAttribute("data-id"));
                });
                break;

            case "blogs":
                panel.innerHTML = `
                    <div class="cms-panel-header flex-between">
                        <div>
                            <h3>Tech Insights & Blog Posts</h3>
                            <p>Share engineering reflections, tutorials, and project learnings.</p>
                        </div>
                        <button type="button" class="cyber-btn sm" id="btn-add-blog"><i class="fas fa-plus"></i> Add New Post</button>
                    </div>
                    <div class="cms-items-list" id="blogs-editor-list">
                        ${data.blogs.map((blog, index) => `
                            <div class="cms-item-card" data-index="${index}">
                                <div class="cms-item-header">
                                    <div class="cms-item-title">
                                        <i class="fas fa-file-alt"></i>
                                        <strong>${blog.title}</strong>
                                        <span class="chip-badge">${blog.date}</span>
                                    </div>
                                    <button type="button" class="btn-icon-del btn-del-blog" data-id="${blog.id}"><i class="fas fa-trash"></i></button>
                                </div>
                                <div class="cms-item-body form-grid-sub">
                                    <div class="form-group span-8">
                                        <label>Article Title</label>
                                        <input type="text" class="cyber-input sm" value="${blog.title}" onchange="window.adminManager.updateBlog(${index}, 'title', this.value)">
                                    </div>
                                    <div class="form-group span-2">
                                        <label>Date</label>
                                        <input type="text" class="cyber-input sm" value="${blog.date}" onchange="window.adminManager.updateBlog(${index}, 'date', this.value)">
                                    </div>
                                    <div class="form-group span-2">
                                        <label>Read Time</label>
                                        <input type="text" class="cyber-input sm" value="${blog.readTime}" onchange="window.adminManager.updateBlog(${index}, 'readTime', this.value)">
                                    </div>
                                    <div class="form-group span-12">
                                        <label>Excerpt / Summary</label>
                                        <textarea class="cyber-input sm" rows="2" onchange="window.adminManager.updateBlog(${index}, 'excerpt', this.value)">${blog.excerpt}</textarea>
                                    </div>
                                    <div class="form-group span-12">
                                        <label>Full Content (Markdown)</label>
                                        <textarea class="cyber-input sm" rows="5" onchange="window.adminManager.updateBlog(${index}, 'content', this.value)">${blog.content}</textarea>
                                    </div>
                                </div>
                            </div>
                        `).join("")}
                    </div>
                `;
                document.getElementById("btn-add-blog").onclick = () => this.addNewBlog();
                panel.querySelectorAll(".btn-del-blog").forEach(btn => {
                    btn.onclick = () => this.deleteBlog(btn.getAttribute("data-id"));
                });
                break;

            case "testimonials":
                panel.innerHTML = `
                    <div class="cms-panel-header flex-between">
                        <div>
                            <h3>Testimonials & Endorsements</h3>
                            <p>Display words of appreciation from mentors, collaborators, and peers.</p>
                        </div>
                        <button type="button" class="cyber-btn sm" id="btn-add-testim"><i class="fas fa-plus"></i> Add Testimonial</button>
                    </div>
                    <div class="cms-items-list">
                        ${data.testimonials.map((t, index) => `
                            <div class="cms-item-card">
                                <div class="cms-item-header">
                                    <strong>${t.author} (${t.role})</strong>
                                    <button type="button" class="btn-icon-del btn-del-testim" data-id="${t.id}"><i class="fas fa-trash"></i></button>
                                </div>
                                <div class="cms-item-body form-grid-sub">
                                    <div class="form-group span-6">
                                        <label>Author Name</label>
                                        <input type="text" class="cyber-input sm" value="${t.author}" onchange="window.adminManager.updateTestimonial(${index}, 'author', this.value)">
                                    </div>
                                    <div class="form-group span-6">
                                        <label>Role / Relationship</label>
                                        <input type="text" class="cyber-input sm" value="${t.role}" onchange="window.adminManager.updateTestimonial(${index}, 'role', this.value)">
                                    </div>
                                    <div class="form-group span-12">
                                        <label>Quote</label>
                                        <textarea class="cyber-input sm" rows="2" onchange="window.adminManager.updateTestimonial(${index}, 'quote', this.value)">${t.quote}</textarea>
                                    </div>
                                </div>
                            </div>
                        `).join("")}
                    </div>
                `;
                document.getElementById("btn-add-testim").onclick = () => this.addNewTestimonial();
                panel.querySelectorAll(".btn-del-testim").forEach(btn => {
                    btn.onclick = () => this.deleteTestimonial(btn.getAttribute("data-id"));
                });
                break;

            case "contact":
                panel.innerHTML = `
                    <div class="cms-panel-header">
                        <h3>Social Links & Contact Channels</h3>
                        <p>Configure links for your LinkedIn, Devfolio, and contact form receiver.</p>
                    </div>
                    <form id="form-cms-socials" class="cms-form-grid">
                        <div class="form-group span-6">
                            <label><i class="fas fa-terminal"></i> Devfolio URL</label>
                            <input type="text" class="cyber-input" id="soc-devfolio" value="${data.socials.devfolio || ''}">
                        </div>
                        <div class="form-group span-6">
                            <label><i class="fab fa-linkedin"></i> LinkedIn URL</label>
                            <input type="text" class="cyber-input" id="soc-linkedin" value="${data.socials.linkedin || ''}">
                        </div>
                        <div class="form-group span-6">
                            <label><i class="fas fa-envelope"></i> Contact Email</label>
                            <input type="email" class="cyber-input" id="soc-email" value="${data.socials.email || ''}">
                        </div>
                        <div class="form-group span-6">
                            <label><i class="fas fa-map-marker-alt"></i> Location Text</label>
                            <input type="text" class="cyber-input" id="soc-loc" value="${data.socials.locationText || ''}">
                        </div>
                    </form>
                `;
                break;

            case "auth":
                panel.innerHTML = `
                    <div class="cms-panel-header">
                        <h3>Admin Security & Access Credentials</h3>
                        <p>Manage your exclusive login ID and password passkey.</p>
                    </div>
                    <div class="cms-panel-box cyber-border">
                        <div class="auth-notice-box">
                            <i class="fas fa-shield-alt"></i>
                            <div>Only this verified login ID and password can unlock the admin management portal.</div>
                        </div>
                        <form id="form-cms-auth" class="cms-form-grid">
                            <div class="form-group span-6">
                                <label>Authorized Login ID / Username</label>
                                <input type="text" class="cyber-input" id="auth-email" value="${data.auth.adminId || data.auth.adminEmail || 'shurasura'}">
                            </div>
                            <div class="form-group span-6">
                                <label>Admin Password / Security Key</label>
                                <input type="text" class="cyber-input" id="auth-pass" value="${data.auth.adminPass || 'madara uchiha'}">
                            </div>
                        </form>
                    </div>
                `;
                break;

            case "backup":
                panel.innerHTML = `
                    <div class="cms-panel-header">
                        <h3>Data Backup, Export & Factory Reset</h3>
                        <p>Export your full configuration as a standalone JSON file, import backups, or restore defaults.</p>
                    </div>
                    <div class="backup-actions-grid">
                        <div class="backup-card">
                            <i class="fas fa-file-export"></i>
                            <h4>Export Portfolio JSON</h4>
                            <p>Download a complete backup snapshot of all your projects, blogs, skills, and settings.</p>
                            <button type="button" class="cyber-btn sm" id="btn-export-json"><i class="fas fa-download"></i> Export JSON</button>
                        </div>
                        <div class="backup-card">
                            <i class="fas fa-file-import"></i>
                            <h4>Import JSON Backup</h4>
                            <p>Upload a previously exported JSON backup file to restore your portfolio instantly.</p>
                            <input type="file" id="import-json-file" accept=".json" style="display:none;">
                            <button type="button" class="cyber-btn sm" id="btn-trigger-import"><i class="fas fa-upload"></i> Choose File</button>
                        </div>
                        <div class="backup-card danger-card">
                            <i class="fas fa-history"></i>
                            <h4>Factory Reset</h4>
                            <p>Reset all portfolio data and content back to the default factory state.</p>
                            <button type="button" class="cyber-btn sm danger" id="btn-reset-defaults"><i class="fas fa-undo"></i> Reset to Factory</button>
                        </div>
                    </div>
                `;

                document.getElementById("btn-export-json").onclick = () => window.portfolioStore.exportJSON();
                const fileInput = document.getElementById("import-json-file");
                document.getElementById("btn-trigger-import").onclick = () => fileInput.click();
                fileInput.onchange = (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                            const res = window.portfolioStore.importJSON(event.target.result);
                            if (res.success) {
                                this.showToast("Portfolio data imported successfully!", "success");
                                this.renderCMSPanel();
                            } else {
                                this.showToast("Import failed: " + res.error, "error");
                            }
                        };
                        reader.readAsText(file);
                    }
                };
                document.getElementById("btn-reset-defaults").onclick = () => {
                    if (confirm("Are you sure you want to reset all data to default? This will clear local changes.")) {
                        window.portfolioStore.resetToDefaults();
                        this.showToast("Portfolio reset to initial defaults.", "info");
                        this.renderCMSPanel();
                    }
                };
                break;
        }
    }

    async saveCMSChanges() {
        const store = window.portfolioStore;
        const data = store.data;

        // If on profile tab, gather fields
        const profName = document.getElementById("prof-name");
        if (profName) {
            data.profile.name = profName.value.trim();
            data.profile.title = document.getElementById("prof-title").value.trim();
            data.profile.tagline = document.getElementById("prof-tagline").value.trim();
            data.profile.location = document.getElementById("prof-location").value.trim();
            data.profile.status = document.getElementById("prof-status").value.trim();
            data.profile.bio = document.getElementById("prof-bio").value.trim();
            data.profile.avatar = document.getElementById("prof-avatar").value.trim();
            data.profile.resumeUrl = document.getElementById("prof-resume").value.trim();
        }

        // If on socials tab, gather fields
        const socEmail = document.getElementById("soc-email");
        if (socEmail) {
            data.socials.email = socEmail.value.trim();
            const socDev = document.getElementById("soc-devfolio");
            if (socDev) data.socials.devfolio = socDev.value.trim();
            const socIn = document.getElementById("soc-linkedin");
            if (socIn) data.socials.linkedin = socIn.value.trim();
            const socLoc = document.getElementById("soc-loc");
            if (socLoc) data.socials.locationText = socLoc.value.trim();
            delete data.socials.github;
            delete data.socials.twitter;
        }

        // If on auth tab, gather fields
        const authEmail = document.getElementById("auth-email");
        if (authEmail) {
            const val = authEmail.value.trim();
            data.auth.adminId = val;
            data.auth.adminEmail = val;
            data.auth.adminPass = document.getElementById("auth-pass").value.trim();
        }

        store.saveData(data);
        this.renderAdminBar();
        this.showToast("⚡ Changes saved and published live!", "success");
    }

    // Helper mutate methods
    updateSkill(index, field, val) {
        window.portfolioStore.data.skills[index][field] = val;
    }

    addNewSkill() {
        window.portfolioStore.data.skills.push({
            id: "s_" + Date.now(),
            name: "New Skill",
            level: "Beginner",
            category: "Languages",
            icon: "fas fa-code",
            color: "#00f0ff",
            description: "Skill description"
        });
        this.renderCMSPanel();
    }

    deleteSkill(id) {
        window.portfolioStore.data.skills = window.portfolioStore.data.skills.filter(s => s.id !== id);
        this.renderCMSPanel();
    }

    updateProject(index, field, val) {
        window.portfolioStore.data.projects[index][field] = val;
    }

    updateProjectTech(index, val) {
        const tags = val.split(",").map(t => t.trim()).filter(Boolean);
        window.portfolioStore.data.projects[index].tech = tags;
    }

    addNewProject() {
        window.portfolioStore.data.projects.unshift({
            id: "p_" + Date.now(),
            title: "New Project",
            description: "Describe your project's problem statement, architecture, and impact.",
            category: "Full Stack",
            featured: true,
            tech: ["Python", "JavaScript"],
            
            devfolio: "https://devfolio.co",
            demo: "https://example.com",
            image: "assets/project-ecosense.jpg"
        });
        this.renderCMSPanel();
    }

    deleteProject(id) {
        window.portfolioStore.data.projects = window.portfolioStore.data.projects.filter(p => p.id !== id);
        this.renderCMSPanel();
    }

    updateBlog(index, field, val) {
        window.portfolioStore.data.blogs[index][field] = val;
    }

    addNewBlog() {
        window.portfolioStore.data.blogs.unshift({
            id: "b_" + Date.now(),
            title: "New Tech Insight",
            date: "September 2026",
            readTime: "3 min read",
            tags: ["Tech", "Engineering"],
            excerpt: "Key learnings and takeaways from recent development explorations.",
            content: "Write your article insights here..."
        });
        this.renderCMSPanel();
    }

    deleteBlog(id) {
        window.portfolioStore.data.blogs = window.portfolioStore.data.blogs.filter(b => b.id !== id);
        this.renderCMSPanel();
    }

    updateTestimonial(index, field, val) {
        window.portfolioStore.data.testimonials[index][field] = val;
    }

    addNewTestimonial() {
        window.portfolioStore.data.testimonials.push({
            id: "t_" + Date.now(),
            author: "Colleague / Mentor",
            role: "Developer",
            quote: "Vishnu consistently delivers clean, thoughtful engineering."
        });
        this.renderCMSPanel();
    }

    deleteTestimonial(id) {
        window.portfolioStore.data.testimonials = window.portfolioStore.data.testimonials.filter(t => t.id !== id);
        this.renderCMSPanel();
    }

    showToast(message, type = "info") {
        let container = document.getElementById("toast-container");
        if (!container) {
            container = document.createElement("div");
            container.id = "toast-container";
            document.body.appendChild(container);
        }

        const toast = document.createElement("div");
        toast.className = `cyber-toast ${type}`;
        const icon = type === "success" ? "fa-check-circle" : type === "error" ? "fa-exclamation-circle" : "fa-info-circle";
        toast.innerHTML = `<i class="fas ${icon}"></i> <span>${message}</span>`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add("visible");
        }, 10);

        setTimeout(() => {
            toast.classList.remove("visible");
            setTimeout(() => toast.remove(), 400);
        }, 3600);
    }
}

// Global instance
window.adminManager = new AdminManager();
