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
                    <button type="button" class="cyber-btn sm glow-cyan" id="btn-bar-publish" style="padding: 7px 14px; font-size: 0.82rem;">
                        <i class="fas fa-globe"></i> Publish Live
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
        document.getElementById("btn-bar-publish").onclick = () => this.showCMSModal("publish");
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

        // STRICT OWNER EMAIL RESTRICTION
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

        // Dispatch real email to vishnuattur078@gmail.com
        this.dispatchRecoveryCode(email, code);

        // Switch to Step 2 WITHOUT showing the code on screen
        document.getElementById("recovery-step-1").style.display = "none";
        const step2 = document.getElementById("recovery-step-2");
        step2.style.display = "block";

        const dispatchBox = document.getElementById("recovery-dispatch-box");
        dispatchBox.innerHTML = `
            <div class="recovery-status-card">
                <div class="status-card-header">
                    <i class="fas fa-paper-plane"></i>
                    <span>Verification Code Dispatched</span>
                </div>
                <p>A secret 6-digit authorization code has been dispatched to <strong>${email}</strong>.</p>
                <div class="status-card-meta">
                    <i class="fas fa-shield-alt"></i> For security, the verification code is never shown on screen. Please check your Gmail inbox (and Spam/Junk folder) and enter the code below.
                </div>
            </div>
        `;

        this.showToast(`Authorization code dispatched to ${email}`, "success");
        setTimeout(() => {
            const codeInput = document.getElementById("recovery-code-input");
            if (codeInput) codeInput.focus();
        }, 200);
    }

    async dispatchRecoveryCode(email, code) {
        const subject = `Your Admin Security Key Reset Code: ${code}`;
        const messageBody = `Hello Vishnu,

Your 6-digit verification code to reset your Portfolio Admin Security Key is:

${code}

This code is valid for 15 minutes. Enter this code on your portfolio owner verification screen to choose a new password.

If you did not request this code, your account remains secure and you can disregard this email.`;

        // 1. Dispatch via FormSubmit AJAX (direct forwarding to vishnuattur078@gmail.com)
        try {
            fetch(`https://formsubmit.co/ajax/${encodeURIComponent(email)}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    _subject: subject,
                    "Verification Code": code,
                    "Recipient Email": email,
                    "Notice": `Your secret 6-digit code to reset your security key is: ${code}. Valid for 15 minutes.`,
                    "_template": "table",
                    "_captcha": "false"
                })
            }).catch(() => {});
        } catch (e) {
            console.warn("FormSubmit dispatch attempt:", e);
        }

        // 2. Dispatch via Web3Forms if an access key is configured
        const web3Key = (window.portfolioStore && window.portfolioStore.data.auth.web3formsKey) || localStorage.getItem("vishnu_web3forms_key") || "";
        if (web3Key) {
            try {
                fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({
                        access_key: web3Key,
                        subject: subject,
                        from_name: "Vishnu Portfolio Security",
                        email: email,
                        message: messageBody
                    })
                }).catch(() => {});
            } catch (e) {
                console.warn("Web3Forms dispatch attempt:", e);
            }
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
                        <button type="button" class="admin-btn secondary" id="cms-save-all-btn">
                            <i class="fas fa-save"></i> Save Device
                        </button>
                        <button type="button" class="cyber-btn sm glow-cyan" id="cms-publish-live-btn">
                            <i class="fas fa-globe"></i> Publish to All Devices
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
                        <button class="cms-tab-btn ${this.activeTab === 'publish' ? 'active' : ''}" data-tab="publish">
                            <i class="fas fa-globe-americas"></i> Publish & Cloud Sync
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
        document.getElementById("cms-publish-live-btn").onclick = () => this.switchTab("publish");

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

            case "publish":
                const syncData = data.sync || {};
                const currentGhToken = localStorage.getItem("vishnu_portfolio_gh_token") || store.githubToken || "";
                const currentCloudUrl = localStorage.getItem("vishnu_portfolio_cloud_url") || store.cloudEndpoint || syncData.cloudEndpoint || "";
                const currentRepo = syncData.githubRepo || "Vishnu-learner/Vishnu-s-Portfolio";
                const currentBranch = syncData.githubBranch || "main";

                panel.innerHTML = `
                    <div class="cms-panel-header flex-between">
                        <div>
                            <h3>Global Publishing & Multi-Device Sync</h3>
                            <p>Make your changes visible worldwide so anyone clicking your link sees the latest portfolio immediately.</p>
                        </div>
                        <div>
                            <span class="publish-pill-badge ${currentGhToken ? 'live' : 'local'}">
                                <i class="fas ${currentGhToken ? 'fa-check-circle' : 'fa-laptop'}"></i>
                                ${currentGhToken ? 'GitHub Sync Ready' : 'Saved to Device Only'}
                            </span>
                        </div>
                    </div>

                    <div class="auth-notice-box" style="margin-bottom: 24px;">
                        <i class="fas fa-info-circle" style="color: var(--neon-cyan); font-size: 1.5rem; flex-shrink: 0;"></i>
                        <div>
                            <strong>Why did changes only save on this device?</strong>
                            <p style="margin: 4px 0 0 0; font-size: 0.85rem; color: var(--text-secondary); line-height: 1.55;">
                                This portfolio is hosted online as a static site on <strong>GitHub Pages</strong>. When you edit in your browser, changes are stored only in this browser's local memory (<em>LocalStorage</em>). To make your edits live for all recruiters and visitors globally, use <strong>1-Click GitHub Publish</strong> or <strong>Cloud Sync</strong> below.
                            </p>
                        </div>
                    </div>

                    <div class="sync-grid">
                        <!-- Method 1: GitHub 1-Click Publish (Recommended) -->
                        <div class="sync-card" style="border-color: rgba(0, 240, 255, 0.4); background: rgba(0, 240, 255, 0.03);">
                            <div>
                                <div class="sync-card-header">
                                    <div class="sync-card-icon" style="background: rgba(0, 240, 255, 0.15);">
                                        <i class="fab fa-github"></i>
                                    </div>
                                    <div>
                                        <div style="display:flex; align-items:center; gap:8px;">
                                            <h4 style="margin:0;">1-Click Publish to GitHub</h4>
                                            <span class="chip-badge" style="background: var(--neon-cyan); color: #06070d; font-weight:700;">Recommended</span>
                                        </div>
                                        <p>Directly commits updated data to your repository. GitHub Pages will automatically build & deploy live to your public link in ~30 seconds.</p>
                                    </div>
                                </div>

                                <div class="form-grid-sub" style="margin-top: 16px;">
                                    <div class="form-group span-8">
                                        <label><i class="fab fa-github"></i> Repository</label>
                                        <input type="text" class="cyber-input sm" id="sync-gh-repo" value="${currentRepo}">
                                    </div>
                                    <div class="form-group span-4">
                                        <label><i class="fas fa-code-branch"></i> Branch</label>
                                        <input type="text" class="cyber-input sm" id="sync-gh-branch" value="${currentBranch}">
                                    </div>
                                    <div class="form-group span-12">
                                        <div class="form-label-row">
                                            <label><i class="fas fa-key"></i> GitHub Personal Access Token (PAT)</label>
                                            <a href="https://github.com/settings/tokens/new?scopes=repo&description=Vishnu+Portfolio+CMS" target="_blank" rel="noopener" class="btn-forgot-pass-link">Create token on GitHub &rarr;</a>
                                        </div>
                                        <div class="password-wrapper">
                                            <input type="password" class="cyber-input sm" id="sync-gh-token" placeholder="ghp_xxxxxxxxxxxx..." value="${currentGhToken}">
                                            <button type="button" class="btn-toggle-eye" id="toggle-gh-token-visibility">
                                                <i class="fas fa-eye"></i>
                                            </button>
                                        </div>
                                        <div class="token-help-card">
                                            <strong>Quick 3-Step Setup (1-time only):</strong>
                                            <ol>
                                                <li>Click <a href="https://github.com/settings/tokens/new?scopes=repo&description=Vishnu+Portfolio+CMS" target="_blank" rel="noopener">Create Token</a> (log into GitHub).</li>
                                                <li>Select <strong>repo</strong> scope (or Fine-grained token with <em>Contents: Read and write</em> for <code>Vishnu-s-Portfolio</code>).</li>
                                                <li>Click <em>Generate token</em> at the bottom, copy and paste it into the box above. It stays saved securely in your browser!</li>
                                            </ol>
                                        </div>
                                    </div>
                                </div>

                                <div id="gh-publish-status-box" class="sync-status-box" style="display: none;"></div>
                            </div>

                            <div class="sync-action-buttons">
                                <button type="button" class="cyber-btn sm glow-cyan" id="btn-publish-to-github">
                                    <i class="fas fa-rocket"></i> Publish Live to GitHub
                                </button>
                                <button type="button" class="admin-btn secondary" id="btn-test-gh-connection">
                                    <i class="fas fa-plug"></i> Test Connection
                                </button>
                            </div>
                        </div>

                        <!-- Method 2: Cloud Sync (Instant Multi-Device Sync) -->
                        <div class="sync-card">
                            <div>
                                <div class="sync-card-header">
                                    <div class="sync-card-icon" style="color: #a855f7; background: rgba(168, 85, 247, 0.15);">
                                        <i class="fas fa-cloud"></i>
                                    </div>
                                    <div>
                                        <h4>Real-Time Cloud Endpoint</h4>
                                        <p>Sync with a free JSONBin or custom cloud store. Any visitor's device will fetch the latest updates live without redeploying.</p>
                                    </div>
                                </div>

                                <div class="form-grid-sub" style="margin-top: 16px;">
                                    <div class="form-group span-12">
                                        <label><i class="fas fa-link"></i> Cloud Sync Endpoint URL (Optional)</label>
                                        <input type="url" class="cyber-input sm" id="sync-cloud-url" placeholder="https://api.jsonbin.io/v3/b/<BIN_ID>" value="${currentCloudUrl}">
                                        <span style="font-size: 0.78rem; color: var(--text-muted); margin-top: 4px; display:block;">
                                            Supports public JSON bins (e.g., JSONBin.io, npoint.io). Visitors will read from this URL on page load.
                                        </span>
                                    </div>
                                </div>

                                <div id="cloud-sync-status-box" class="sync-status-box" style="display: none;"></div>
                            </div>

                            <div class="sync-action-buttons">
                                <button type="button" class="cyber-btn sm glow-purple" id="btn-save-cloud-sync">
                                    <i class="fas fa-cloud-upload-alt"></i> Save & Sync to Cloud
                                </button>
                                <button type="button" class="admin-btn secondary" id="btn-pull-cloud-sync">
                                    <i class="fas fa-cloud-download-alt"></i> Pull from Cloud
                                </button>
                            </div>
                        </div>

                        <!-- Method 3: Manual Git Update (Download data.js) -->
                        <div class="sync-card span-12">
                            <div>
                                <div class="sync-card-header">
                                    <div class="sync-card-icon" style="color: #10b981; background: rgba(168, 85, 247, 0.15);">
                                        <i class="fas fa-file-code"></i>
                                    </div>
                                    <div>
                                        <h4>Manual Git Deployment (Offline / No Token)</h4>
                                        <p>Download the updated <code>data.js</code> file directly with your latest edits already baked into the defaults. Replace <code>js/data.js</code> in your folder and push via Git:</p>
                                        <code style="display:block; margin-top:6px; padding:6px 10px; background:rgba(0,0,0,0.4); border-radius:6px; font-family:var(--font-mono); color:var(--neon-emerald); font-size:0.8rem;">
                                            git commit -am "Update portfolio content" &amp;&amp; git push
                                        </code>
                                    </div>
                                </div>
                            </div>
                            <div class="sync-action-buttons">
                                <button type="button" class="admin-btn secondary" id="btn-download-datajs">
                                    <i class="fas fa-download"></i> Download updated data.js
                                </button>
                                <button type="button" class="admin-btn secondary" id="btn-export-backup-json">
                                    <i class="fas fa-file-export"></i> Export JSON Backup
                                </button>
                            </div>
                        </div>
                    </div>
                `;

                // Bind Publish Tab Events
                const tokEye = document.getElementById("toggle-gh-token-visibility");
                const tokInput = document.getElementById("sync-gh-token");
                if (tokEye && tokInput) {
                    tokEye.onclick = () => {
                        const isPass = tokInput.type === "password";
                        tokInput.type = isPass ? "text" : "password";
                        tokEye.innerHTML = isPass ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
                    };
                }

                document.getElementById("btn-test-gh-connection").onclick = () => this.handleGitHubTest();
                document.getElementById("btn-publish-to-github").onclick = () => this.handleGitHubPublish();
                document.getElementById("btn-save-cloud-sync").onclick = () => this.handleSaveCloudSync();
                document.getElementById("btn-pull-cloud-sync").onclick = () => this.handlePullCloudSync();
                document.getElementById("btn-download-datajs").onclick = () => {
                    window.portfolioStore.exportDataJsFile();
                    this.showToast("data.js downloaded! Replace js/data.js and git push.", "success");
                };
                document.getElementById("btn-export-backup-json").onclick = () => {
                    window.portfolioStore.exportJSON();
                    this.showToast("JSON backup exported!", "success");
                };
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
                            <i class="fas fa-file-code"></i>
                            <h4>Download data.js</h4>
                            <p>Download the pre-formatted data.js file with your changes baked in to commit to Git.</p>
                            <button type="button" class="cyber-btn sm glow-cyan" id="btn-backup-download-datajs"><i class="fas fa-download"></i> Download data.js</button>
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
                document.getElementById("btn-backup-download-datajs").onclick = () => {
                    window.portfolioStore.exportDataJsFile();
                    this.showToast("data.js downloaded!", "success");
                };
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

    switchTab(tabName) {
        this.activeTab = tabName;
        const modal = document.getElementById("admin-cms-modal");
        if (modal) {
            const tabButtons = modal.querySelectorAll(".cms-tab-btn");
            tabButtons.forEach(btn => {
                if (btn.getAttribute("data-tab") === tabName) {
                    btn.classList.add("active");
                } else {
                    btn.classList.remove("active");
                }
            });
            this.renderCMSPanel();
        }
    }

    gatherCurrentTabFields() {
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

        // If on publish tab, gather sync fields
        const syncRepo = document.getElementById("sync-gh-repo");
        if (syncRepo) {
            data.sync = data.sync || {};
            data.sync.githubRepo = syncRepo.value.trim();
            data.sync.githubBranch = (document.getElementById("sync-gh-branch")?.value || "main").trim();
            const cloudUrl = document.getElementById("sync-cloud-url");
            if (cloudUrl) {
                data.sync.cloudEndpoint = cloudUrl.value.trim();
            }
        }
    }

    async saveCMSChanges() {
        this.gatherCurrentTabFields();
        const store = window.portfolioStore;
        const res = await store.saveData(store.data);
        this.renderAdminBar();

        if (res.cloudSynced) {
            this.showToast("⚡ Saved locally & synced live to cloud!", "success");
        } else {
            this.showToast("💾 Saved to this device! Click 'Publish to All Devices' to deploy live.", "success");
        }
    }

    async handleGitHubTest() {
        const tokenInput = document.getElementById("sync-gh-token");
        const token = tokenInput ? tokenInput.value.trim() : "";
        const repo = (document.getElementById("sync-gh-repo")?.value || "Vishnu-learner/Vishnu-s-Portfolio").trim();
        const branch = (document.getElementById("sync-gh-branch")?.value || "main").trim();
        const statusBox = document.getElementById("gh-publish-status-box");

        if (!token) {
            statusBox.style.display = "flex";
            statusBox.className = "sync-status-box error";
            statusBox.innerHTML = `<i class="fas fa-exclamation-triangle"></i><span>Please enter your GitHub Personal Access Token to test connection.</span>`;
            return;
        }

        statusBox.style.display = "flex";
        statusBox.className = "sync-status-box info";
        statusBox.innerHTML = `<i class="fas fa-circle-notch fa-spin"></i><span>Connecting to GitHub API for ${repo} (${branch})...</span>`;

        try {
            const res = await window.portfolioStore.testGitHubConnection(token, repo, branch);
            statusBox.className = "sync-status-box success";
            statusBox.innerHTML = `
                <i class="fas fa-check-circle" style="color:var(--neon-emerald);"></i>
                <div>
                    <strong>Connection Verified!</strong>
                    <div>Successfully accessed <code>${res.repo}</code> on branch <code>${res.branch}</code> (sha: ${res.sha.slice(0, 7)}). You can now publish with 1 click!</div>
                </div>
            `;
            this.showToast("GitHub connection successful!", "success");
        } catch (err) {
            statusBox.className = "sync-status-box error";
            statusBox.innerHTML = `
                <i class="fas fa-times-circle" style="color:var(--neon-rose);"></i>
                <div>
                    <strong>Connection Failed:</strong> ${err.message}
                </div>
            `;
            this.showToast("GitHub check failed: " + err.message, "error");
        }
    }

    async handleGitHubPublish() {
        const tokenInput = document.getElementById("sync-gh-token");
        const token = tokenInput ? tokenInput.value.trim() : "";
        const repo = (document.getElementById("sync-gh-repo")?.value || "Vishnu-learner/Vishnu-s-Portfolio").trim();
        const branch = (document.getElementById("sync-gh-branch")?.value || "main").trim();
        const statusBox = document.getElementById("gh-publish-status-box");
        const btn = document.getElementById("btn-publish-to-github");

        if (!token) {
            statusBox.style.display = "flex";
            statusBox.className = "sync-status-box error";
            statusBox.innerHTML = `<i class="fas fa-exclamation-triangle"></i><span>Please enter your GitHub Personal Access Token above before publishing.</span>`;
            tokenInput.focus();
            return;
        }

        // First save current form fields into store
        this.gatherCurrentTabFields();
        await window.portfolioStore.saveData(window.portfolioStore.data);

        // Update sync preferences
        window.portfolioStore.data.sync = window.portfolioStore.data.sync || {};
        window.portfolioStore.data.sync.githubRepo = repo;
        window.portfolioStore.data.sync.githubBranch = branch;

        statusBox.style.display = "flex";
        statusBox.className = "sync-status-box info";
        statusBox.innerHTML = `
            <i class="fas fa-circle-notch fa-spin"></i>
            <div>
                <strong>Publishing to GitHub...</strong>
                <div>Pushing updated data.js to ${repo} (${branch})...</div>
            </div>
        `;
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = `<i class="fas fa-circle-notch fa-spin"></i> Publishing...`;
        }

        try {
            const commitRes = await window.portfolioStore.publishToGitHub(token, repo, branch);
            statusBox.className = "sync-status-box success";
            const commitSha = (commitRes.commit && commitRes.commit.sha) ? commitRes.commit.sha.slice(0, 7) : "latest";
            const commitUrl = `https://github.com/${repo}/commit/${commitSha}`;
            statusBox.innerHTML = `
                <i class="fas fa-check-circle" style="color:var(--neon-emerald); font-size:1.3rem;"></i>
                <div>
                    <strong style="color:var(--neon-emerald); font-size:1rem;">🚀 Successfully Published Live!</strong>
                    <div style="margin-top:4px; line-height:1.5;">
                        Commit <a href="${commitUrl}" target="_blank" rel="noopener" style="color:var(--neon-cyan); text-decoration:underline;">#${commitSha}</a> pushed to GitHub <code>${repo}</code>!
                    </div>
                    <div style="margin-top:6px; font-size:0.82rem; color:var(--text-secondary);">
                        GitHub Pages is deploying your updates. Within <strong>30-60 seconds</strong>, any user clicking your portfolio link will view the updated page!
                    </div>
                </div>
            `;
            this.showToast("🚀 Portfolio published live to GitHub!", "success");
        } catch (err) {
            statusBox.className = "sync-status-box error";
            statusBox.innerHTML = `
                <i class="fas fa-times-circle" style="color:var(--neon-rose); font-size:1.3rem;"></i>
                <div>
                    <strong>Publishing Failed:</strong> ${err.message}
                </div>
            `;
            this.showToast("Publishing failed: " + err.message, "error");
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = `<i class="fas fa-rocket"></i> Publish Live to GitHub`;
            }
        }
    }

    async handleSaveCloudSync() {
        const urlInput = document.getElementById("sync-cloud-url");
        const url = urlInput ? urlInput.value.trim() : "";
        const statusBox = document.getElementById("cloud-sync-status-box");

        if (statusBox) {
            statusBox.style.display = "flex";
            statusBox.className = "sync-status-box info";
            statusBox.innerHTML = `<i class="fas fa-circle-notch fa-spin"></i><span>Saving & pushing data to cloud endpoint...</span>`;
        }

        window.portfolioStore.setCloudEndpoint(url);
        window.portfolioStore.data.sync = window.portfolioStore.data.sync || {};
        window.portfolioStore.data.sync.cloudEndpoint = url;
        const res = await window.portfolioStore.saveData(window.portfolioStore.data);

        if (statusBox) {
            if (res.cloudSynced || !url) {
                statusBox.className = "sync-status-box success";
                statusBox.innerHTML = `<i class="fas fa-check-circle"></i><span>${url ? "Cloud endpoint configured and data synced!" : "Cloud endpoint cleared."}</span>`;
                this.showToast(url ? "Cloud sync active!" : "Cloud sync disabled.", "success");
            } else {
                statusBox.className = "sync-status-box error";
                statusBox.innerHTML = `<i class="fas fa-exclamation-triangle"></i><span>Saved locally, but cloud push failed: ${res.cloudError || "Check URL format"}</span>`;
                this.showToast("Cloud sync failed: " + (res.cloudError || "Check endpoint"), "error");
            }
        }
    }

    async handlePullCloudSync() {
        const statusBox = document.getElementById("cloud-sync-status-box");
        if (statusBox) {
            statusBox.style.display = "flex";
            statusBox.className = "sync-status-box info";
            statusBox.innerHTML = `<i class="fas fa-circle-notch fa-spin"></i><span>Fetching latest data from cloud...</span>`;
        }

        const res = await window.portfolioStore.syncFromCloud();
        if (statusBox) {
            if (res.success) {
                statusBox.className = "sync-status-box success";
                statusBox.innerHTML = `<i class="fas fa-check-circle"></i><span>Updated with latest cloud snapshot!</span>`;
                this.showToast("Cloud data pulled successfully!", "success");
                this.renderCMSPanel();
            } else {
                statusBox.className = "sync-status-box error";
                statusBox.innerHTML = `<i class="fas fa-times-circle"></i><span>Pull failed: ${res.reason || res.error || "Unknown error"}</span>`;
                this.showToast("Cloud pull failed: " + (res.reason || res.error), "error");
            }
        }
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
