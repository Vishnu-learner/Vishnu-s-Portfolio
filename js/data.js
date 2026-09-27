/**

 * Data Store & State Management for Vishnu's Portfolio

 * Supports live localStorage persistence, dynamic CMS updates, and data export/import

 */



const DEFAULT_PORTFOLIO_DATA = {

    profile: {

        name: "Vishnu",

        title: "Aspiring IT Professional",

        tagline: "Aspiring IT Professional | Building Tech for Impact",

        location: "Salem, Tamil Nadu, India",

        avatar: "assets/avatar.jpg",
        avatar3d: "assets/avatar_3d.jpg",

        bio: "I’m an aspiring IT professional from Salem, Tamil Nadu, currently building my foundation in programming and system setup. I experiment with creative project ideas that merge technology with real‑world impact.",

        status: "Open to Internships & Collaborative Tech Projects",

        resumeUrl: "resume.html"

    },

    auth: {
        adminId: "shurasura",
        adminEmail: "vishnuattur078@gmail.com",
        adminPass: "madara uchiha",
        ownerName: "Vishnu"
    },

    socials: {

        email: "vishnuattur078@gmail.com",

        devfolio: "https://devfolio.co/@vishnu",

        linkedin: "https://www.linkedin.com/in/vishnu-s-972a29382",

        locationText: "Salem, Tamil Nadu, India"

    },

    skills: [

        { id: "s1", name: "C", level: "Basic", category: "Languages", icon: "fas fa-code", color: "#00f0ff", description: "Memory layout, pointers, system basics & algorithmic logic" },

        { id: "s2", name: "C#", level: "Beginner", category: "Languages", icon: "fas fa-cubes", color: "#a855f7", description: "Object-oriented structures, .NET foundations, type safety" },

        { id: "s4", name: "Python", level: "Learning", category: "Languages", icon: "fab fa-python", color: "#3b82f6", description: "Scripting, NLP data handling, automation, backend logic" },

        { id: "s5", name: "Java", level: "Learning", category: "Languages", icon: "fab fa-java", color: "#f59e0b", description: "OOP principles, Android app logic, JVM fundamentals, structured design" },

        { id: "s6", name: "HTML5", level: "Proficient", category: "Frontend", icon: "fab fa-html5", color: "#f97316", description: "Semantic markup, accessibility, modern web architectures" },

        { id: "s7", name: "CSS3", level: "Proficient", category: "Frontend", icon: "fab fa-css3-alt", color: "#06b6d4", description: "Glassmorphism, responsive grids, custom properties, animations" },

        { id: "s8", name: "JavaScript", level: "Active", category: "Frontend", icon: "fab fa-js-square", color: "#eab308", description: "ES6+, DOM manipulation, asynchronous fetch APIs, event loops" },

        { id: "s9", name: "Linux & System Setup", level: "Practicing", category: "Tools", icon: "fab fa-linux", color: "#ec4899", description: "Shell commands, system administration, developer environment config" }

    ],

    projects: [

        {

            id: "p_counselling_ai",

            title: "MindSpace: Bilingual Counselling AI Chatbot",

            description: "An empathetic mental wellness and counselling conversational AI engineered with real-time emotion detection (sentiment analysis), distress check-ins, and bilingual language support (English & Tamil). Built as a full-stack Progressive Web App with an Android APK companion app to bring accessible, stigma-free guidance to students and communities.",

            image: "assets/counselling-ai.jpg",

            category: "AI & Full Stack",

            featured: true,

            tech: ["Python", "NLP Engine", "Java (Android)", "JavaScript", "HTML5/CSS3", "PWA"],

            github: "https://github.com/vishnu-dev/mindspace-counselling-ai",

            devfolio: "https://devfolio.co/projects/mindspace-counselling-ai",

            demo: "https://mindspace-ai-demo.example.com"

        }

    ],

    blogs: [

        {

            id: "b1",

            title: "Engineering MindSpace: Designing an Empathetic Bilingual Counselling AI",

            date: "September 2026",

            readTime: "5 min read",

            tags: ["AI", "Python", "Mental Health", "Tamil"],

            excerpt: "How we architected a sentiment-aware conversational agent supporting both English and Tamil to deliver accessible mental health support.",

            content: `Creating **MindSpace** was inspired by a pressing real-world need: making mental health assistance accessible, stigma-free, and culturally responsive.



In many regional communities across Tamil Nadu, finding immediate, judgment-free listening is difficult due to language barriers and social hesitations. By building a bilingual conversational engine that recognizes emotional states (like sadness, stress, and anxiety) in both **English and Tamil**, we bridged that gap.



The technical architecture combines a lightweight Python NLP sentiment pipeline with an interactive glassmorphic chat interface deployed as a Progressive Web App (PWA) and an Android APK companion. 



This project embodies my core mission as an aspiring IT professional: **technology built with genuine empathy and real-world impact**.`

        },

        {

            id: "b2",

            title: "Building for Real-World Impact: Tech Solutions for Salem & Beyond",

            date: "August 2026",

            readTime: "4 min read",

            tags: ["Impact", "Civic Tech", "Local Innovation"],

            excerpt: "Technology becomes transformative when applied to genuine local challenges: health awareness, civic coordination, and grassroots education.",

            content: `Coming from Salem, Tamil Nadu, I've observed firsthand how technology often stays concentrated in tier-1 metro hubs while grassroots communities remain underserved.



True innovation does not always require massive data centers or complex neural networks. Often, the highest-impact software is an intuitive, fast, mobile-friendly interface backed by clean APIs that local people can rely on every single day.



That philosophy drives every project I craft: build clean, keep it accessible, and solve real human problems.`

        },

        {

            id: "b3",

            title: "Navigating Java & C# Simultaneously: An Aspiring Engineer’s Blueprint",

            date: "July 2026",

            readTime: "3 min read",

            tags: ["Java", "C#", "OOP"],

            excerpt: "Comparing memory management, static typing, and class architectures across the JVM and .NET ecosystems.",

            content: `Diving into both Java and C# while building out my computer science foundations has been an eye-opening exercise in programming language design.



Both languages share deep roots in structured object-oriented programming, yet their modern idioms showcase fascinating divergence: LINQ and properties in C# versus stream pipelines and robust concurrency models in the Java ecosystem.



Comparing both side-by-side reinforces core engineering discipline: design for maintainability, enforce strong typing, and build software that scales cleanly.`

        }

    ],

    testimonials: [

        {

            id: "t1",

            quote: "Vishnu's work on the MindSpace Counselling AI demonstrated remarkable empathy and technical maturity. His dedication to creating bilingual solutions for regional communities is inspiring.",

            author: "Engineering Mentor",

            role: "Tech Advisor & Educator"

        },

        {

            id: "t2",

            quote: "A dependable teammate with high curiosity. Whenever our team tackles a problem, Vishnu focuses on system reliability, clean execution, and purposeful outcomes.",

            author: "Hackathon Collaborator",

            role: "Full-Stack Developer"

        }

    ],

    sync: {
        githubRepo: "Vishnu-learner/Vishnu-s-Portfolio",
        githubBranch: "main",
        cloudEndpoint: ""
    }

};



const STORAGE_KEY = "vishnu_portfolio_v3";
const CLOUD_URL_KEY = "vishnu_portfolio_cloud_url";
const GITHUB_TOKEN_KEY = "vishnu_portfolio_gh_token";

class PortfolioStore {
    constructor() {
        this.cloudEndpoint = localStorage.getItem(CLOUD_URL_KEY) || "";
        this.githubToken = localStorage.getItem(GITHUB_TOKEN_KEY) || "";
        this.data = this.loadData();

        if (this.data.sync && this.data.sync.cloudEndpoint && !this.cloudEndpoint) {
            this.cloudEndpoint = this.data.sync.cloudEndpoint;
        }

        // Perform background cloud sync across all devices if configured
        if (this.cloudEndpoint) {
            this.syncFromCloud();
        }
    }

    loadData() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed.socials) {
                    if (parsed.socials.email === "vishnu.impact@gmail.com" || !parsed.socials.email) {
                        parsed.socials.email = "vishnuattur078@gmail.com";
                    }
                    delete parsed.socials.github;
                    delete parsed.socials.twitter;
                }
                return this.mergeWithDefaults(parsed);
            }
        } catch (e) {
            console.error("Failed to load stored portfolio data, using defaults:", e);
        }
        return JSON.parse(JSON.stringify(DEFAULT_PORTFOLIO_DATA));
    }

    mergeWithDefaults(parsed) {
        return {
            ...DEFAULT_PORTFOLIO_DATA,
            ...parsed,
            profile: { ...DEFAULT_PORTFOLIO_DATA.profile, ...(parsed.profile || {}) },
            auth: { ...DEFAULT_PORTFOLIO_DATA.auth, ...(parsed.auth || {}) },
            socials: { ...DEFAULT_PORTFOLIO_DATA.socials, ...(parsed.socials || {}) },
            sync: { ...DEFAULT_PORTFOLIO_DATA.sync, ...(parsed.sync || {}) }
        };
    }

    async saveData(newData) {
        this.data = newData;
        let localSuccess = false;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
            window.dispatchEvent(new CustomEvent("portfolioDataChanged", { detail: this.data }));
            localSuccess = true;
        } catch (e) {
            console.error("Failed to persist portfolio data locally:", e);
        }

        // Push to cloud endpoint if active for multi-device sync
        if (this.cloudEndpoint) {
            try {
                const res = await fetch(this.cloudEndpoint, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(this.data)
                });
                if (res.ok) {
                    return { success: true, cloudSynced: true };
                } else {
                    return { success: localSuccess, cloudSynced: false, cloudError: `HTTP ${res.status}` };
                }
            } catch (err) {
                console.warn("Cloud sync save warning:", err);
                return { success: localSuccess, cloudSynced: false, cloudError: err.message };
            }
        }
        return { success: localSuccess, cloudSynced: false };
    }

    setCloudEndpoint(url) {
        this.cloudEndpoint = (url || "").trim();
        if (this.cloudEndpoint) {
            localStorage.setItem(CLOUD_URL_KEY, this.cloudEndpoint);
            return this.syncFromCloud();
        } else {
            localStorage.removeItem(CLOUD_URL_KEY);
            return Promise.resolve({ success: true, cleared: true });
        }
    }

    async syncFromCloud() {
        if (!this.cloudEndpoint) return { success: false, reason: "No cloud endpoint configured" };
        try {
            const res = await fetch(this.cloudEndpoint);
            if (res.ok) {
                const cloudJson = await res.json();
                if (cloudJson && (cloudJson.profile || cloudJson.skills)) {
                    this.data = this.mergeWithDefaults(cloudJson);
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
                    window.dispatchEvent(new CustomEvent("portfolioDataChanged", { detail: this.data }));
                    return { success: true, data: this.data };
                }
            }
            return { success: false, reason: `HTTP ${res.status}` };
        } catch (err) {
            console.warn("Failed to fetch from cloud sync endpoint:", err);
            return { success: false, error: err.message };
        }
    }

    async pushToCloud() {
        if (!this.cloudEndpoint) {
            return { success: false, reason: "No cloud endpoint configured" };
        }
        try {
            const res = await fetch(this.cloudEndpoint, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(this.data)
            });
            return { success: res.ok, status: res.status };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }

    resetToDefaults() {
        this.data = JSON.parse(JSON.stringify(DEFAULT_PORTFOLIO_DATA));
        localStorage.removeItem(STORAGE_KEY);
        window.dispatchEvent(new CustomEvent("portfolioDataChanged", { detail: this.data }));
        if (this.cloudEndpoint) {
            this.pushToCloud().catch(e => console.warn(e));
        }
        return this.data;
    }

    exportJSON() {
        const jsonStr = JSON.stringify(this.data, null, 2);
        const blob = new Blob([jsonStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `vishnu-portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    importJSON(jsonString) {
        try {
            const parsed = JSON.parse(jsonString);
            if (!parsed.profile || !parsed.skills) {
                throw new Error("Invalid portfolio data structure.");
            }
            this.saveData(parsed);
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }

    // Test connection to GitHub repository
    async testGitHubConnection(token, repo = "Vishnu-learner/Vishnu-s-Portfolio", branch = "main") {
        if (!token) throw new Error("Please enter a GitHub Personal Access Token.");
        const cleanRepo = repo.trim();
        const cleanBranch = branch.trim();
        const apiUrl = `https://api.github.com/repos/${cleanRepo}/contents/js/data.js?ref=${cleanBranch}`;
        const res = await fetch(apiUrl, {
            headers: {
                "Authorization": `Bearer ${token.trim()}`,
                "Accept": "application/vnd.github.v3+json"
            }
        });
        if (!res.ok) {
            if (res.status === 401) throw new Error("Invalid Personal Access Token. Verify token and try again.");
            if (res.status === 403) throw new Error("Access forbidden. Ensure token has 'repo' or 'Contents: Read and write' permissions.");
            if (res.status === 404) throw new Error(`Repository '${cleanRepo}' or file 'js/data.js' not found on branch '${cleanBranch}'.`);
            throw new Error(`GitHub check failed (HTTP ${res.status}: ${res.statusText})`);
        }
        const data = await res.json();
        return { success: true, sha: data.sha, repo: cleanRepo, branch: cleanBranch };
    }

    // Direct GitHub deployment integration
    async publishToGitHub(token, repo = "Vishnu-learner/Vishnu-s-Portfolio", branch = "main") {
        if (!token) throw new Error("GitHub Personal Access Token is required.");
        const cleanRepo = repo.trim();
        const cleanBranch = branch.trim();
        const filePath = "js/data.js";
        const apiUrl = `https://api.github.com/repos/${cleanRepo}/contents/${filePath}?ref=${cleanBranch}`;

        // 1. Get current file sha and text
        const getRes = await fetch(apiUrl, {
            headers: {
                "Authorization": `Bearer ${token.trim()}`,
                "Accept": "application/vnd.github.v3+json"
            }
        });

        if (!getRes.ok) {
            if (getRes.status === 401) throw new Error("Invalid GitHub Token. Check your token and try again.");
            if (getRes.status === 403) throw new Error("Permission Denied: Token lacks 'repo' or 'Contents: Read and write' scope.");
            if (getRes.status === 404) throw new Error(`File '${filePath}' not found in ${cleanRepo} (${cleanBranch}).`);
            throw new Error(`Failed to fetch from GitHub: ${getRes.status} ${getRes.statusText}`);
        }

        const getData = await getRes.json();
        const sha = getData.sha;
        const cleanBase64 = (getData.content || "").replace(/\s/g, "");
        let existingText = "";
        try {
            existingText = decodeURIComponent(escape(atob(cleanBase64)));
        } catch (e) {
            existingText = atob(cleanBase64);
        }

        // 2. Generate updated data.js code
        const newCode = this.generateDataJsContent(existingText);
        const base64Content = btoa(unescape(encodeURIComponent(newCode)));

        // 3. Commit updated content
        const putRes = await fetch(apiUrl, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token.trim()}`,
                "Accept": "application/vnd.github.v3+json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: `Update portfolio content via Admin CMS [${new Date().toISOString().slice(0, 10)}]`,
                content: base64Content,
                sha: sha,
                branch: cleanBranch
            })
        });

        if (!putRes.ok) {
            const errData = await putRes.json().catch(() => ({}));
            throw new Error(errData.message || `GitHub commit failed with HTTP ${putRes.status}`);
        }

        // Persist token for future 1-click publishing
        localStorage.setItem(GITHUB_TOKEN_KEY, token.trim());
        this.githubToken = token.trim();

        return await putRes.json();
    }

    generateDataJsContent(existingContent = "") {
        const cleanData = JSON.parse(JSON.stringify(this.data));
        const jsonStr = JSON.stringify(cleanData, null, 4);

        if (existingContent && existingContent.includes("const DEFAULT_PORTFOLIO_DATA")) {
            const regex = /const DEFAULT_PORTFOLIO_DATA =[\s\S]*?;\s*(?=(const STORAGE_KEY|class PortfolioStore))/m;
            if (regex.test(existingContent)) {
                return existingContent.replace(regex, `const DEFAULT_PORTFOLIO_DATA = ${jsonStr};\n\n`);
            }
            const altRegex = /const DEFAULT_PORTFOLIO_DATA =[\s\S]*?\n\};\n/m;
            if (altRegex.test(existingContent)) {
                return existingContent.replace(altRegex, `const DEFAULT_PORTFOLIO_DATA = ${jsonStr};\n`);
            }
        }

        // Fallback: If no template provided, construct complete valid data.js file
        return `/**\n * Data Store & State Management for Vishnu's Portfolio\n * Updated: ${new Date().toISOString()}\n */\n\nconst DEFAULT_PORTFOLIO_DATA = ${jsonStr};\n\n` + this.getStoreCodeSource();
    }

    getStoreCodeSource() {
        return `const STORAGE_KEY = "vishnu_portfolio_v3";
const CLOUD_URL_KEY = "vishnu_portfolio_cloud_url";
const GITHUB_TOKEN_KEY = "vishnu_portfolio_gh_token";

` + PortfolioStore.toString() + `\n\n// Global singleton instance\nwindow.portfolioStore = new PortfolioStore();\n`;
    }

    // Export standalone updated data.js file for local Git deployment
    async exportDataJsFile() {
        let template = "";
        try {
            const res = await fetch("js/data.js");
            if (res.ok) {
                template = await res.text();
            }
        } catch (e) {
            console.warn("Could not read local js/data.js template:", e);
        }
        const fullContent = this.generateDataJsContent(template);
        const blob = new Blob([fullContent], { type: "application/javascript" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "data.js";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Global singleton instance
window.portfolioStore = new PortfolioStore();
