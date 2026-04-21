(function () {
    const data = window.PROJECTS_DATA || {};

    function escapeHtml(input) {
        return input
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function renderMarkdown(markdown) {
        const lines = markdown.split("\n");
        let html = "";
        let inList = false;
        let inCode = false;

        lines.forEach((line) => {
            const safe = escapeHtml(line);

            if (safe.startsWith("```")) {
                if (!inCode) {
                    html += "<pre><code>";
                    inCode = true;
                } else {
                    html += "</code></pre>";
                    inCode = false;
                }
                return;
            }

            if (inCode) {
                html += `${safe}\n`;
                return;
            }

            if (/^###\s+/.test(safe)) {
                if (inList) {
                    html += "</ul>";
                    inList = false;
                }
                html += `<h3>${safe.replace(/^###\s+/, "")}</h3>`;
                return;
            }

            if (/^##\s+/.test(safe)) {
                if (inList) {
                    html += "</ul>";
                    inList = false;
                }
                html += `<h2>${safe.replace(/^##\s+/, "")}</h2>`;
                return;
            }

            if (/^#\s+/.test(safe)) {
                if (inList) {
                    html += "</ul>";
                    inList = false;
                }
                html += `<h1>${safe.replace(/^#\s+/, "")}</h1>`;
                return;
            }

            if (/^-\s+/.test(safe)) {
                if (!inList) {
                    html += "<ul>";
                    inList = true;
                }
                html += `<li>${safe.replace(/^-\s+/, "")}</li>`;
                return;
            }

            if (safe.trim().length === 0) {
                if (inList) {
                    html += "</ul>";
                    inList = false;
                }
                html += "";
                return;
            }

            if (inList) {
                html += "</ul>";
                inList = false;
            }

            html += `<p>${safe}</p>`;
        });

        if (inList) html += "</ul>";
        if (inCode) html += "</code></pre>";

        return html;
    }

    function init() {
        const params = new URLSearchParams(window.location.search);
        const slug = params.get("project");
        const project = slug ? data[slug] : null;

        if (!project) {
            document.getElementById("projectTitle").textContent = "Project Not Found";
            document.getElementById("projectSummary").textContent =
                "The requested project does not exist. Go back and choose a project card.";
            document.getElementById("readmeContent").innerHTML =
                "<p>Please open this page through a project card from the portfolio home page.</p>";
            return;
        }

        document.title = `${project.title} | Hari Reshmi`;
        document.getElementById("projectTitle").textContent = project.title;
        document.getElementById("projectSummary").textContent = project.summary;
        document.getElementById("projectRole").textContent = `${project.role} | ${project.contribution}`;

        const heroImage = document.getElementById("projectImage");
        heroImage.src = project.image;
        heroImage.alt = `${project.title} preview`;

        const stackWrap = document.getElementById("stackWrap");
        stackWrap.innerHTML = "";
        project.stack.forEach((item) => {
            const chip = document.createElement("span");
            chip.className = "chip";
            chip.textContent = item;
            stackWrap.appendChild(chip);
        });

        const liveBtn = document.getElementById("liveBtn");
        const codeBtn = document.getElementById("codeBtn");

        if (!project.liveUrl || project.liveUrl === "#") {
            liveBtn.style.display = "none";
        } else {
            liveBtn.href = project.liveUrl;
        }
        codeBtn.href = project.codeUrl;

        document.getElementById("readmeContent").innerHTML = renderMarkdown(project.readme);
    }

    init();
})();
