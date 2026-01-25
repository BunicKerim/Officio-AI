/* ==================================================
   I18N – STEP 1: TRANSLATIONS (SINGLE SOURCE)
================================================== */

const translations = {
    de: {
        "start.title": "DU BENÖTIGST HILFE BEI ARBEITSPROZESSEN?",
        "start.subtitle": "WÄHLE EIN TOOL UND STARTE DIREKT.",
        "tool.summary": "Zusammenfassen",
        "tool.email": "E-Mail Antwort",
        "summary.title": "Text zusammenfassen",
        "email.title": "E-Mail Antwort erstellen"
    },
    en: {
        "start.title": "DO YOU NEED HELP WITH WORK PROCESSES?",
        "start.subtitle": "CHOOSE A TOOL AND GET STARTED.",
        "tool.summary": "Summarize",
        "tool.email": "Email Reply",
        "summary.title": "Summarize text",
        "email.title": "Create email reply"
    },
    fr: {
        "start.title": "AVEZ-VOUS BESOIN D’AIDE POUR VOS PROCESSUS DE TRAVAIL ?",
        "start.subtitle": "CHOISISSEZ UN OUTIL ET COMMENCEZ.",
        "tool.summary": "Résumé",
        "tool.email": "Réponse e-mail",
        "summary.title": "Résumer un texte",
        "email.title": "Créer une réponse e-mail"
    }
};

/* ==================================================
   I18N – STEP 2: APPLY TRANSLATIONS
================================================== */

let currentLang = "de";

function applyTranslations() {
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.dataset.i18n;
        if (translations[currentLang]?.[key]) {
            el.textContent = translations[currentLang][key];
        }
    });
}

/* ==================================================
   MAIN APP LOGIC (UNTOUCHED)
================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ---------- APPLY I18N ON LOAD ---------- */
    applyTranslations();

    /* ---------- DARK MODE ---------- */

    const themeToggle = document.getElementById("themeToggle");

    function updateThemeButton() {
        themeToggle.textContent =
            document.body.classList.contains("dark")
                ? "Dark Mode: ON"
                : "Dark Mode: OFF";
    }

    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark");
        updateThemeButton();
    });

    updateThemeButton();

    /* ---------- NAVIGATION ---------- */

    const featureCards = document.querySelectorAll(".feature-card");
    const toolSections = document.querySelectorAll(".tool-section");
    const backButtons = document.querySelectorAll(".back-to-start");

    function openTool(id) {
        document.body.classList.add("tool-active");
        toolSections.forEach(s =>
            s.classList.toggle("active", s.id === id)
        );
    }

    function goToStart() {
        document.body.classList.add("returning-to-start");

        setTimeout(() => {
            document.body.classList.remove("tool-active");
            document.body.classList.remove("returning-to-start");

            toolSections.forEach(s => s.classList.remove("active"));
        }, 250);
    }

    featureCards.forEach(card =>
        card.addEventListener("click", () => openTool(card.dataset.tool))
    );

    backButtons.forEach(btn =>
        btn.addEventListener("click", goToStart)
    );

    /* ---------- SUMMARY ---------- */

    document.getElementById("summarizeBtn").addEventListener("click", async () => {
        const input = document.getElementById("inputText").value.trim();
        const focus = document.getElementById("summaryFocus").value.trim();

        if (!input) return;

        const output = document.getElementById("output");
        output.textContent = "Zusammenfassung wird erstellt …";

        try {
            const res = await fetch("https://officio-ai-lybv.onrender.com/summarize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: input, focus })
            });

            const data = await res.json();
            output.textContent = data.result ?? "Keine Antwort erhalten.";
        } catch (err) {
            output.textContent = "Fehler bei der Verarbeitung.";
            console.error(err);
        }
    });

    /* ---------- EMAIL ---------- */

    document.getElementById("emailGenerateBtn").addEventListener("click", async () => {
        const output = document.getElementById("emailOutput");
        output.textContent = "Antwort wird erstellt…";

        try {
            const res = await fetch("https://officio-ai-lybv.onrender.com/email-reply", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    original_email: document.getElementById("emailOriginal").value,
                    keywords: document.getElementById("emailKeywords").value,
                    style: document.getElementById("emailStyle").value
                })
            });

            const data = await res.json();
            output.textContent = data.result ?? "Keine Antwort erhalten.";
        } catch (err) {
            output.textContent = "Fehler bei der Verarbeitung.";
            console.error(err);
        }
    });

    /* ---------- HERO CANVAS ---------- */

    const canvas = document.getElementById("heroCanvas");
    const header = document.querySelector(".app-header");
    const ctx = canvas.getContext("2d");

    function resize() {
        canvas.width = header.offsetWidth;
        canvas.height = header.offsetHeight;
    }

    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: 80 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4
    }));

    function colors() {
        return document.body.classList.contains("dark")
            ? { p: "rgba(180,210,255,0.95)", l: "rgba(180,210,255,0.35)" }
            : { p: "rgba(230,235,255,0.95)", l: "rgba(230,235,255,0.35)" };
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const c = colors();

        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
            ctx.fillStyle = c.p;
            ctx.fill();
        });

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                if (Math.hypot(
                    particles[i].x - particles[j].x,
                    particles[i].y - particles[j].y
                ) < 120) {
                    ctx.strokeStyle = c.l;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    animate();
});

/* ---------- DARK MODE DEFAULT ---------- */

document.addEventListener("DOMContentLoaded", () => {
    document.body.classList.add("dark");

    const toggle = document.getElementById("themeToggle");
    if (toggle) toggle.textContent = "Dark Mode: ON";
});
/* ---------- LANGUAGE SWITCHER ---------- */

const langButtons = document.querySelectorAll(".lang-btn");

langButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        currentLang = btn.dataset.lang;
        localStorage.setItem("officio-lang", currentLang);

        langButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        applyTranslations();
    });
});

/* Restore language on load */
const savedLang = localStorage.getItem("officio-lang");
if (savedLang && translations[savedLang]) {
    currentLang = savedLang;
    applyTranslations();

    langButtons.forEach(b =>
        b.classList.toggle("active", b.dataset.lang === savedLang)
    );
}
/* ==================================================
   LANGUAGE SYSTEM (append-only)
================================================== */

document.addEventListener("DOMContentLoaded", () => {
    const languageSelect = document.getElementById("languageSelect");

    if (!languageSelect) return;

    const translations = {
        de: {
            "header.subtitle": "DEIN BESTER FREUND, WENN ES UM VEREINFACHUNG VON ARBEITSPROZESSEN GEHT",
            "hero.title": "DU BENÖTIGST HILFE BEI ARBEITSPROZESSEN?",
            "hero.subtitle": "WÄHLE EIN TOOL UND STARTE DIREKT. KEINE ANMELDUNG NOTWENDIG, DIREKT STARTEN!",
            "info.title": "Wofür Officio AI entwickelt wurde",
            "info.text": "Officio AI wurde entwickelt, um tägliche Büroarbeit schneller, klarer und effizienter zu machen.",
            "info.list.summary": "📝 Klare Textzusammenfassungen",
            "info.list.email": "✉️ Professionelle E-Mail-Antworten",
            "info.list.effort": "⚡ Weniger manueller Aufwand",
            "info.list.assistant": "🧠 Digitale Büroassistenz",
            "info.focus": "Fokus: Zeitersparnis & Klarheit",
            "tool.summary": "📝 Zusammenfassen",
            "tool.summary.desc": "Fasst lange Texte oder Dateien so zusammen, wie du es dir wünschst.",
            "tool.email": "✉️ E-Mail Antwort",
            "tool.email.desc": "Automatisch passende Antworten erstellen.",
            "summary.title": "Text zusammenfassen",
            "summary.button": "Zusammenfassen",
            "summary.loading": "Zusammenfassung wird erstellt…",
            "email.title": "E-Mail Antwort erstellen",
            "email.button": "Antwort generieren",
            "nav.back": "← Zur Startseite"
        },

        en: {
            "header.subtitle": "YOUR BEST FRIEND FOR SIMPLIFYING WORK PROCESSES",
            "hero.title": "NEED HELP WITH WORK PROCESSES?",
            "hero.subtitle": "CHOOSE A TOOL AND GET STARTED. NO SIGN-UP REQUIRED.",
            "info.title": "What Officio AI was built for",
            "info.text": "Officio AI helps you complete daily office work faster and more efficiently.",
            "info.list.summary": "📝 Clear text summaries",
            "info.list.email": "✉️ Professional email replies",
            "info.list.effort": "⚡ Less manual effort",
            "info.list.assistant": "🧠 Digital office assistant",
            "info.focus": "Focus: Time saving & clarity",
            "tool.summary": "📝 Summarize",
            "tool.summary.desc": "Summarizes long texts the way you want.",
            "tool.email": "✉️ Email reply",
            "tool.email.desc": "Automatically generate tailored email responses.",
            "summary.title": "Summarize text",
            "summary.button": "Summarize",
            "summary.loading": "Creating summary…",
            "email.title": "Create email reply",
            "email.button": "Generate reply",
            "nav.back": "← Back to start"
        },

        fr: {
            "header.subtitle": "VOTRE MEILLEUR ALLIÉ POUR SIMPLIFIER LE TRAVAIL",
            "hero.title": "BESOIN D’AIDE POUR VOS PROCESSUS DE TRAVAIL ?",
            "hero.subtitle": "CHOISISSEZ UN OUTIL ET COMMENCEZ IMMÉDIATEMENT.",
            "info.title": "Pourquoi Officio AI a été créé",
            "info.text": "Officio AI vous aide à accomplir vos tâches de bureau plus rapidement.",
            "info.list.summary": "📝 Résumés clairs",
            "info.list.email": "✉️ Réponses e-mail professionnelles",
            "info.list.effort": "⚡ Moins de travail manuel",
            "info.list.assistant": "🧠 Assistant de bureau numérique",
            "info.focus": "Objectif : gain de temps et clarté",
            "tool.summary": "📝 Résumer",
            "tool.summary.desc": "Résume les textes comme vous le souhaitez.",
            "tool.email": "✉️ Réponse e-mail",
            "tool.email.desc": "Générer automatiquement des réponses adaptées.",
            "summary.title": "Résumer un texte",
            "summary.button": "Résumer",
            "summary.loading": "Création du résumé…",
            "email.title": "Créer une réponse e-mail",
            "email.button": "Générer la réponse",
            "nav.back": "← Retour à l’accueil"
        }
    };

    function applyLanguage(lang) {
        document.querySelectorAll("[data-i18n]").forEach(el => {
            const key = el.getAttribute("data-i18n");
            if (translations[lang]?.[key]) {
                el.textContent = translations[lang][key];
            }
        });

        document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
            const key = el.getAttribute("data-i18n-placeholder");
            if (translations[lang]?.[key]) {
                el.placeholder = translations[lang][key];
            }
        });
    }

    applyLanguage(languageSelect.value);

    languageSelect.addEventListener("change", () => {
        applyLanguage(languageSelect.value);
    });
});
/* ---------- TOOL LANGUAGE TRANSLATIONS ---------- */

(function () {
    const translations = {
        de: {
            summaryTitle: "Texte oder Dateien zusammenfassen",
            summaryBtn: "Zusammenfassen",
            summaryPlaceholder: "Text oder Datei hier einfügen...",
            summaryFocus: "Stichwörter / Vorgaben (z. B. kurz, Bulletpoints, max. 3 Sätze, Management)",

            emailTitle: "E-Mail Antwort erstellen",
            emailOriginal: "Original-E-Mail",
            emailKeywords: "Stichworte",
            emailStyle: "Stil",
            emailBtn: "Antwort generieren",

            back: "← Zur Startseite"
        },
        en: {
            summaryTitle: "Summarize text",
            summaryBtn: "Summarize",
            summaryPlaceholder: "Paste your text here...",
            summaryFocus: "Keywords / instructions (e.g. short, bullet points, max. 3 sentences)",

            emailTitle: "Create email reply",
            emailOriginal: "Original email",
            emailKeywords: "Keywords",
            emailStyle: "Style",
            emailBtn: "Generate reply",

            back: "← Back to start"
        },
        fr: {
            summaryTitle: "Résumer un texte",
            summaryBtn: "Résumer",
            summaryPlaceholder: "Collez votre texte ici...",
            summaryFocus: "Mots-clés / consignes (ex. court, points, max. 3 phrases)",

            emailTitle: "Créer une réponse e-mail",
            emailOriginal: "E-mail original",
            emailKeywords: "Mots-clés",
            emailStyle: "Style",
            emailBtn: "Générer la réponse",

            back: "← Retour à l’accueil"
        }
    };

    function applyToolLanguage(lang) {
        const t = translations[lang];
        if (!t) return;

        // SUMMARY TOOL
        const summarySection = document.getElementById("tool-summary");
        if (summarySection) {
            summarySection.querySelector("h2").textContent = t.summaryTitle;
            document.getElementById("summarizeBtn").textContent = t.summaryBtn;
            document.getElementById("inputText").placeholder = t.summaryPlaceholder;
            document.getElementById("summaryFocus").placeholder = t.summaryFocus;
        }

        // EMAIL TOOL
        const emailSection = document.getElementById("tool-email");
        if (emailSection) {
            emailSection.querySelector("h2").textContent = t.emailTitle;

            const labels = emailSection.querySelectorAll("label");
            if (labels.length >= 3) {
                labels[0].textContent = t.emailOriginal;
                labels[1].textContent = t.emailKeywords;
                labels[2].textContent = t.emailStyle;
            }

            document.getElementById("emailGenerateBtn").textContent = t.emailBtn;
        }

        // BACK BUTTONS
        document.querySelectorAll(".back-to-start").forEach(btn => {
            btn.textContent = t.back;
        });
    }

    // Reagiere auf Sprachwechsel
    const languageSelect = document.getElementById("languageSelect");
    if (languageSelect) {
        applyToolLanguage(languageSelect.value);

        languageSelect.addEventListener("change", () => {
            const lang = languageSelect.value;
            localStorage.setItem("language", lang);
            applyToolLanguage(lang);
        });
    }

    // Sprache beim Laden wiederherstellen
    const savedLang = localStorage.getItem("language");
    if (savedLang && languageSelect) {
        languageSelect.value = savedLang;
        applyToolLanguage(savedLang);
    }
})();
/* =========================
   CLEAN DRAG & DROP (FINAL)
========================= */

document.addEventListener("DOMContentLoaded", () => {
    const dropzone = document.getElementById("summaryDropzone");
    const textarea = document.getElementById("inputText");
    const fileInput = document.getElementById("summaryFile");
    const fileStatus = document.getElementById("fileStatus");

    if (!dropzone || !fileInput) return;

    // Browser-Default blockieren
    ["dragenter", "dragover", "dragleave", "drop"].forEach(evt => {
        dropzone.addEventListener(evt, e => e.preventDefault());
    });

    // Drag visuell
    dropzone.addEventListener("dragover", () => {
        dropzone.classList.add("dragover");
    });

    dropzone.addEventListener("dragleave", () => {
        dropzone.classList.remove("dragover");
    });

    // DROP
    dropzone.addEventListener("drop", (e) => {
        dropzone.classList.remove("dragover");

        const file = e.dataTransfer.files[0];
        if (!file) return;

        fileInput.files = e.dataTransfer.files;

        textarea.value = "";
        textarea.disabled = true;

        fileStatus.textContent = `📄 Datei geladen: ${file.name}`;
        fileStatus.classList.remove("hidden");
    });



    fileInput.addEventListener("change", () => {
        if (!fileInput.files.length) return;

        const file = fileInput.files[0];
        textarea.value = "";
        textarea.disabled = true;

        fileStatus.textContent = `📄 Datei geladen: ${file.name}`;
        fileStatus.classList.remove("hidden");
    });

    // Tippen → Datei verwerfen
    textarea.addEventListener("input", () => {
        if (textarea.value.trim().length > 0) {
            fileInput.value = "";
            textarea.disabled = false;
            fileStatus.classList.add("hidden");
        }
    });
});
/* ==================================================
   CLEAN SUMMARY INPUT LOGIC (FINAL)
================================================== */

(() => {
    const textInput = document.getElementById("inputText");
    const focusInput = document.getElementById("summaryFocus");
    const fileInput = document.getElementById("summaryFile");
    const pickBtn = document.getElementById("pickFileBtn");
    const status = document.getElementById("fileStatus");

    if (!textInput || !fileInput || !pickBtn) return;

    /* ---------- 1️⃣ KEINE LEERZEILEN ---------- */

    [textInput, focusInput].forEach(el => {
        if (!el) return;

        // beim Laden
        el.value = el.value.trim();

        // beim Tippen
        el.addEventListener("input", () => {
            if (el.value.startsWith("\n")) {
                el.value = el.value.replace(/^\n+/, "");
            }
        });

        // beim Paste
        el.addEventListener("paste", () => {
            setTimeout(() => {
                el.value = el.value.trimStart();
            }, 0);
        });
    });



    /* ---------- 3️⃣ DATEI SETZEN ---------- */

    fileInput.addEventListener("change", () => {
        if (!fileInput.files.length) return;

        const file = fileInput.files[0];

        // Text deaktivieren
        textInput.value = "";
        textInput.disabled = true;

        if (status) {
            status.textContent = `📄 Datei geladen: ${file.name}`;
            status.classList.remove("hidden");
        }
    });

    /* ---------- 4️⃣ TEXT ÜBERSCHREIBT DATEI ---------- */

    textInput.addEventListener("input", () => {
        if (!textInput.disabled) return;

        fileInput.value = "";
        textInput.disabled = false;

        if (status) {
            status.textContent = "";
            status.classList.add("hidden");
        }
    });

})();
/* ==================================================
   HARD FIX: NO FILE PICKER ON TEXTAREA CLICK
================================================== */

(() => {
    const textInput = document.getElementById("inputText");
    const fileInput = document.getElementById("summaryFile");
    const pickBtn = document.getElementById("pickFileBtn");

    if (!textInput || !fileInput || !pickBtn) return;

    // ❌ Textfeld DARF NIE Explorer öffnen
    textInput.addEventListener("click", e => {
        e.stopPropagation();
    });

    textInput.addEventListener("mousedown", e => {
        e.stopPropagation();
    });

})();
/* ==================================================
   SINGLE SOURCE FILE PICKER (FINAL)
================================================== */

(() => {
    const pickBtn = document.getElementById("pickFileBtn");
    const fileInput = document.getElementById("summaryFile");
    const textInput = document.getElementById("inputText");
    const fileStatus = document.getElementById("fileStatus");
    const dropzone = document.getElementById("summaryDropzone");

    if (!pickBtn || !fileInput) return;

    /* ❌ DROPZONE DARF KEINEN EXPLORER ÖFFNEN */
    if (dropzone) {
        ["click", "mousedown", "mouseup"].forEach(evt => {
            dropzone.addEventListener(evt, e => e.stopPropagation(), true);
        });
    }

    /* ❌ TEXTAREA DARF KEINEN EXPLORER ÖFFNEN */
    if (textInput) {
        ["click", "mousedown"].forEach(evt => {
            textInput.addEventListener(evt, e => e.stopPropagation(), true);
        });
    }

    /* ✅ EINZIGER EXPLORER-TRIGGER */
    pickBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        fileInput.value = "";
        fileInput.click();
    };

    /* 📄 DATEI STATUS */
    fileInput.onchange = () => {
        if (!fileInput.files.length) return;

        const file = fileInput.files[0];

        if (fileStatus) {
            fileStatus.textContent = `📄 Datei geladen: ${file.name}`;
            fileStatus.classList.remove("hidden");
        }

        if (textInput) {
            textInput.value = "";
            textInput.disabled = true;
        }
    };
})();
/* ==================================================
   FILE REMOVE + STATE RESET (FINAL)
================================================== */

(() => {
    const fileInput = document.getElementById("summaryFile");
    const textInput = document.getElementById("inputText");
    const fileStatus = document.getElementById("fileStatus");
    const fileName = document.getElementById("fileName");
    const removeBtn = document.getElementById("removeFileBtn");

    if (!fileInput || !removeBtn) return;

    /* 📄 Datei gesetzt */
    fileInput.addEventListener("change", () => {
        if (!fileInput.files.length) return;

        const file = fileInput.files[0];

        fileName.textContent = `📄 ${file.name}`;
        fileStatus.classList.remove("hidden");

        textInput.value = "";
        textInput.disabled = true;
    });

    /* ❌ Datei entfernen */
    removeBtn.addEventListener("click", () => {
        fileInput.value = "";
        fileStatus.classList.add("hidden");

        textInput.disabled = false;
        textInput.focus();
    });
})();
/* ================================
   CLEAN SUMMARY FILE LOGIC (FINAL)
================================ */

(() => {
    const dropzone = document.getElementById("summaryDropzone");
    const textInput = document.getElementById("inputText");
    const fileInput = document.getElementById("summaryFile");
    const pickBtn = document.getElementById("pickFileBtn");
    const fileBox = document.getElementById("fileBox");
    const fileName = document.getElementById("fileName");
    const removeBtn = document.getElementById("removeFileBtn");

    if (!dropzone || !fileInput) return;

    /* ---------- LEERZEILEN VERHINDERN ---------- */
    [textInput, document.getElementById("summaryFocus")].forEach(el => {
        if (!el) return;
        el.addEventListener("input", () => {
            el.value = el.value.replace(/^\s+/, "");
        });
    });

    /* ---------- DRAG EVENTS ---------- */
    ["dragenter", "dragover", "dragleave", "drop"].forEach(evt => {
        dropzone.addEventListener(evt, e => e.preventDefault());
    });

    dropzone.addEventListener("dragover", () => dropzone.classList.add("dragover"));
    dropzone.addEventListener("dragleave", () => dropzone.classList.remove("dragover"));

    dropzone.addEventListener("drop", e => {
        dropzone.classList.remove("dragover");
        if (!e.dataTransfer.files.length) return;
        setFile(e.dataTransfer.files[0]);
    });

    /* ---------- PICK BUTTON ---------- */
    pickBtn.addEventListener("click", e => {
        e.stopPropagation();
        fileInput.click();
    });

    fileInput.addEventListener("change", () => {
        if (!fileInput.files.length) return;
        setFile(fileInput.files[0]);
    });

    /* ---------- SET FILE ---------- */
    function setFile(file) {
        fileInput.files = createFileList(file);
        fileName.textContent = `📄 ${file.name}`;

        fileBox.classList.remove("hidden");
        dropzone.classList.add("hidden");

        textInput.value = "";
        textInput.disabled = true;
    }

    /* ---------- REMOVE FILE ---------- */
    removeBtn.addEventListener("click", () => {
        fileInput.value = "";
        fileBox.classList.add("hidden");
        dropzone.classList.remove("hidden");
        textInput.disabled = false;
    });

    /* ---------- UTILITY ---------- */
    function createFileList(file) {
        const dt = new DataTransfer();
        dt.items.add(file);
        return dt.files;
    }

})();
/* ==================================================
   FINAL FILE PICKER CONTROLLER (ONE SOURCE OF TRUTH)
   FIX: Explorer öffnet sich NUR 1x
================================================== */

(() => {
    const dropzone = document.getElementById("summaryDropzone");
    const textInput = document.getElementById("inputText");
    const fileInput = document.getElementById("summaryFile");
    const pickBtn   = document.getElementById("pickFileBtn");
    const statusBox = document.getElementById("fileStatus");
    const fileName  = document.getElementById("fileName");
    const removeBtn = document.getElementById("removeFileBtn");

    if (!dropzone || !fileInput || !pickBtn) return;

    /* ===============================
       HARD RESET – ALTE EVENTS BLOCKEN
    =============================== */

    const kill = e => {
        e.preventDefault();
        e.stopImmediatePropagation();
        return false;
    };

    // Dropzone darf NIEMALS Explorer öffnen
    ["click","mousedown","mouseup"].forEach(evt => {
        dropzone.addEventListener(evt, kill, true);
    });

    // Textfeld darf NIEMALS Explorer öffnen
    ["click","mousedown","mouseup"].forEach(evt => {
        textInput.addEventListener(evt, e => e.stopPropagation(), true);
    });

    /* ===============================
       EXPLORER: NUR ÜBER BUTTON
    =============================== */

    let opening = false;

    pickBtn.addEventListener("click", e => {
        e.preventDefault();
        e.stopPropagation();

        if (opening) return;
        opening = true;

        fileInput.value = "";
        fileInput.click();

        setTimeout(() => opening = false, 400);
    });

    /* ===============================
       DRAG & DROP (DATEI)
    =============================== */

    ["dragenter","dragover"].forEach(evt => {
        dropzone.addEventListener(evt, e => {
            e.preventDefault();
            dropzone.classList.add("dragover");
        });
    });

    ["dragleave","drop"].forEach(evt => {
        dropzone.addEventListener(evt, e => {
            e.preventDefault();
            dropzone.classList.remove("dragover");
        });
    });

    dropzone.addEventListener("drop", e => {
        const file = e.dataTransfer.files[0];
        if (!file) return;
        setFile(file);
    });

    /* ===============================
       FILE INPUT CHANGE
    =============================== */

    fileInput.addEventListener("change", () => {
        const file = fileInput.files[0];
        if (!file) return;
        setFile(file);
    });

    /* ===============================
       SET / REMOVE FILE
    =============================== */

    function setFile(file) {
        textInput.value = "";
        textInput.disabled = true;

        fileName.textContent = `📄 ${file.name}`;
        statusBox.classList.remove("hidden");
    }

    function clearFile() {
        fileInput.value = "";
        textInput.disabled = false;
        statusBox.classList.add("hidden");
        fileName.textContent = "";
    }

    removeBtn.addEventListener("click", e => {
        e.preventDefault();
        e.stopPropagation();
        clearFile();
    });

})();
/* ==================================================
   🔥 ABSOLUTE FINAL FIX – FILE PICKER
   Lösung: DOM NODE RESET (killt ALLE alten Listener)
================================================== */

(() => {
    const oldPickBtn = document.getElementById("pickFileBtn");
    const oldFileInp = document.getElementById("summaryFile");

    if (!oldPickBtn || !oldFileInp) return;

    /* ===============================
       1️⃣ BUTTON RESET (KLONEN)
    =============================== */

    const pickBtn = oldPickBtn.cloneNode(true);
    oldPickBtn.parentNode.replaceChild(pickBtn, oldPickBtn);

    /* ===============================
       2️⃣ FILE INPUT RESET (KLONEN)
    =============================== */

    const fileInput = oldFileInp.cloneNode(true);
    oldFileInp.parentNode.replaceChild(fileInput, oldFileInp);

    /* ===============================
       3️⃣ STATUS ELEMENTE
    =============================== */

    const textInput = document.getElementById("inputText");
    const statusBox = document.getElementById("fileStatus");
    const fileName  = document.getElementById("fileName");
    const removeBtn = document.getElementById("removeFileBtn");

    /* ===============================
       4️⃣ EXPLORER → NUR 1×
    =============================== */

    pickBtn.addEventListener("click", e => {
        e.preventDefault();
        e.stopPropagation();
        fileInput.value = "";
        fileInput.click();
    });

    /* ===============================
       5️⃣ DATEI GEWÄHLT
    =============================== */

    fileInput.addEventListener("change", () => {
        const file = fileInput.files[0];
        if (!file) return;

        textInput.value = "";
        textInput.disabled = true;

        fileName.textContent = `📄 ${file.name}`;
        statusBox.classList.remove("hidden");
    });

    /* ===============================
       6️⃣ DATEI ENTFERNEN
    =============================== */

    removeBtn.addEventListener("click", e => {
        e.preventDefault();
        e.stopPropagation();

        fileInput.value = "";
        textInput.disabled = false;
        statusBox.classList.add("hidden");
        fileName.textContent = "";
    });

})();
/* ==================================================
   GLOBAL DRAG HIGHLIGHT (PAGE LEVEL)
   Markiert Dropzone sobald Maus/Datei auf Seite ist
================================================== */

(() => {
    const dropzone = document.getElementById("summaryDropzone");
    if (!dropzone) return;

    let dragCounter = 0;

    // Sobald irgendwas in die Seite gezogen wird
    document.addEventListener("dragenter", e => {
        if (e.dataTransfer && e.dataTransfer.types.includes("Files")) {
            dragCounter++;
            dropzone.classList.add("global-drag");
        }
    });

    // Wenn Datei wieder rausgeht
    document.addEventListener("dragleave", e => {
        dragCounter--;
        if (dragCounter <= 0) {
            dropzone.classList.remove("global-drag");
            dragCounter = 0;
        }
    });

    // Nach Drop alles resetten
    document.addEventListener("drop", () => {
        dragCounter = 0;
        dropzone.classList.remove("global-drag");
    });
})();
/* ==================================================
   REMOVE UPLOADED FILE (FINAL)
================================================== */

(() => {
    const fileInput  = document.getElementById("summaryFile");
    const textInput  = document.getElementById("inputText");
    const statusBox  = document.getElementById("fileStatus");
    const fileName   = document.getElementById("fileName");
    const removeBtn  = document.getElementById("removeFileBtn");

    if (!fileInput || !textInput || !removeBtn) return;

    removeBtn.addEventListener("click", e => {
        e.preventDefault();
        e.stopPropagation();

        // Datei komplett entfernen
        fileInput.value = "";

        // Textfeld reaktivieren
        textInput.disabled = false;
        textInput.focus();

        // Status-Box ausblenden
        if (statusBox) statusBox.classList.add("hidden");
        if (fileName) fileName.textContent = "";
    });
})();
/* ==================================================
   TOOL → START TRANSITION HANDLER
================================================== */

(() => {
    const backButtons = document.querySelectorAll(".back-to-start");
    const toolSections = document.querySelectorAll(".tool-section");

    if (!backButtons.length) return;

    backButtons.forEach(btn => {
        btn.addEventListener("click", () => {

            document.body.classList.add("returning-to-start");

            // Nach Animation Tool schließen
            setTimeout(() => {
                document.body.classList.remove("tool-active");
                document.body.classList.remove("returning-to-start");

                toolSections.forEach(s => s.classList.remove("active"));
            }, 280); // muss zu CSS passen
        });
    });
})();
/* ==================================================
   EMAIL TOOL – FILE UPLOAD (MIRROR SUMMARY TOOL)
================================================== */

(() => {
    const dropzone = document.getElementById("emailDropzone");
    const textInput = document.getElementById("emailOriginal");
    const fileInput = document.getElementById("emailFile");
    const pickBtn   = document.getElementById("pickEmailFileBtn");
    const statusBox = document.getElementById("emailFileStatus");
    const fileName  = document.getElementById("emailFileName");
    const removeBtn = document.getElementById("removeEmailFileBtn");

    if (!dropzone || !fileInput || !pickBtn) return;

    /* ---------- Explorer nur über Button ---------- */
    pickBtn.addEventListener("click", e => {
        e.preventDefault();
        e.stopPropagation();
        fileInput.value = "";
        fileInput.click();
    });

    /* ---------- Drag Visual ---------- */
    ["dragenter", "dragover"].forEach(evt => {
        dropzone.addEventListener(evt, e => {
            e.preventDefault();
            dropzone.classList.add("dragover");
        });
    });

    ["dragleave", "drop"].forEach(evt => {
        dropzone.addEventListener(evt, e => {
            e.preventDefault();
            dropzone.classList.remove("dragover");
        });
    });

    /* ---------- Drop ---------- */
    dropzone.addEventListener("drop", e => {
        const file = e.dataTransfer.files[0];
        if (!file) return;
        setFile(file);
    });

    /* ---------- File Picker ---------- */
    fileInput.addEventListener("change", () => {
        const file = fileInput.files[0];
        if (!file) return;
        setFile(file);
    });

    /* ---------- Set / Remove ---------- */
    function setFile(file) {
        textInput.value = "";
        textInput.disabled = true;

        fileName.textContent = `📄 ${file.name}`;
        statusBox.classList.remove("hidden");
    }

    removeBtn.addEventListener("click", e => {
        e.preventDefault();
        e.stopPropagation();

        fileInput.value = "";
        textInput.disabled = false;
        textInput.focus();

        statusBox.classList.add("hidden");
        fileName.textContent = "";
    });

})();
/* ==================================================
   GLOBAL DRAG HIGHLIGHT – SUMMARY + EMAIL
================================================== */

(() => {
    const summaryDropzone = document.getElementById("summaryDropzone");
    const emailDropzone   = document.getElementById("emailDropzone");

    let dragCounter = 0;

    function getActiveDropzone() {
        // Nur das aktuell sichtbare Tool markieren
        if (document.getElementById("tool-summary")?.classList.contains("active")) {
            return summaryDropzone;
        }
        if (document.getElementById("tool-email")?.classList.contains("active")) {
            return emailDropzone;
        }
        return null;
    }

    document.addEventListener("dragenter", e => {
        if (!e.dataTransfer || !e.dataTransfer.types.includes("Files")) return;

        dragCounter++;
        const dz = getActiveDropzone();
        if (dz) dz.classList.add("global-drag");
    });

    document.addEventListener("dragleave", () => {
        dragCounter--;
        if (dragCounter <= 0) {
            const dz = getActiveDropzone();
            if (dz) dz.classList.remove("global-drag");
            dragCounter = 0;
        }
    });

    document.addEventListener("drop", () => {
        dragCounter = 0;
        const dz = getActiveDropzone();
        if (dz) dz.classList.remove("global-drag");
    });
})();
/* ==================================================
   GLOBAL DRAG HIGHLIGHT – SUMMARY + EMAIL
================================================== */

(() => {
    const summaryDropzone = document.getElementById("summaryDropzone");
    const emailDropzone   = document.getElementById("emailDropzone");

    let dragCounter = 0;

    function getActiveDropzone() {
        // Nur das aktuell sichtbare Tool markieren
        if (document.getElementById("tool-summary")?.classList.contains("active")) {
            return summaryDropzone;
        }
        if (document.getElementById("tool-email")?.classList.contains("active")) {
            return emailDropzone;
        }
        return null;
    }

    document.addEventListener("dragenter", e => {
        if (!e.dataTransfer || !e.dataTransfer.types.includes("Files")) return;

        dragCounter++;
        const dz = getActiveDropzone();
        if (dz) dz.classList.add("global-drag");
    });

    document.addEventListener("dragleave", () => {
        dragCounter--;
        if (dragCounter <= 0) {
            const dz = getActiveDropzone();
            if (dz) dz.classList.remove("global-drag");
            dragCounter = 0;
        }
    });

    document.addEventListener("drop", () => {
        dragCounter = 0;
        const dz = getActiveDropzone();
        if (dz) dz.classList.remove("global-drag");
    });
})();
