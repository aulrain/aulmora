const fs = require('fs');

const path = '/index.html';
let html = fs.readFileSync(path, 'utf-8');

// 1. Google Fonts reduction
html = html.replace(
    '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Outfit:wght@300;400;600;700&family=Playfair+Display:ital,wght@1,400;1,600&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">',
    '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400&family=Outfit:wght@300;400;600;700&family=Playfair+Display:ital,wght@1,400&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">'
);

// 2. Remove CSS for Loader
const cssTarget = "        /* Loader */\n" +
"        .loader {\n" +
"            position: fixed;\n" +
"            top: 0;\n" +
"            left: 0;\n" +
"            width: 100%;\n" +
"            height: 100vh;\n" +
"            background-color: #0A0A0A;\n" +
"            z-index: 9999;\n" +
"            display: flex;\n" +
"            justify-content: center;\n" +
"            align-items: center;\n" +
"            overflow: hidden;\n" +
"        }\n" +
"\n" +
"        .loader-particles {\n" +
"            position: absolute;\n" +
"            top: 0;\n" +
"            left: 0;\n" +
"            width: 100%;\n" +
"            height: 100%;\n" +
"            pointer-events: none;\n" +
"        }\n" +
"\n" +
"        .particle {\n" +
"            position: absolute;\n" +
"            background-color: #C9A84C;\n" +
"            border-radius: 50%;\n" +
"        }\n" +
"\n" +
"        .loader-text {\n" +
"            font-family: var(--font-heading);\n" +
"            font-size: clamp(3rem, 8vw, 6rem);\n" +
"            color: var(--warm-white);\n" +
"            letter-spacing: 0.1em;\n" +
"            text-transform: uppercase;\n" +
"            font-weight: 300;\n" +
"            opacity: 0;\n" +
"            position: relative;\n" +
"            z-index: 2;\n" +
"            text-shadow: 0 0 0px rgba(201, 168, 76, 0);\n" +
"            transition: color 1s ease, text-shadow 1s ease;\n" +
"        }\n" +
"        \n" +
"        .loader-text.glow {\n" +
"            color: #C9A84C;\n" +
"            text-shadow: 0 0 30px rgba(201, 168, 76, 0.8), 0 0 60px rgba(201, 168, 76, 0.5);\n" +
"        }\n" +
"\n" +
"        @keyframes textPulse {\n" +
"            0%, 100% { text-shadow: 0 0 10px rgba(201, 168, 76, 0.2); }\n" +
"            50% { text-shadow: 0 0 30px rgba(201, 168, 76, 0.8), 0 0 50px rgba(201, 168, 76, 0.5); }\n" +
"        }\n";

if(html.includes(cssTarget)) {
    html = html.replace(cssTarget, "");
    console.log("Replaced Loader CSS");
} else {
    console.log("Could not find Loader CSS to replace.");
}

// 3. Remove HTML for loader
const htmlLoaderTarget = "    <div class=\"loader\" id=\"loader\">\n" +
"        <div class=\"loader-particles\" id=\"loader-particles\"></div>\n" +
"        <div class=\"loader-text\" id=\"loader-text\">aulmora</div>\n" +
"    </div>\n";
if(html.includes(htmlLoaderTarget)) {
    html = html.replace(htmlLoaderTarget, "");
    console.log("Replaced Loader HTML");
} else {
    console.log("Could not find Loader HTML to replace.");
}

// 4. Replace JS
const jsTargetStart = html.indexOf("        // Loader Animation");
const jsTargetEnd = html.indexOf("        // Character Parallax and Fade");

if(jsTargetStart !== -1 && jsTargetEnd !== -1) {
    const oldJs = html.slice(jsTargetStart, jsTargetEnd);
    const newJs = `        // Intro Reveal Animation
        function playHeroAnimations() {
            const tlLoader = gsap.timeline();
            tlLoader.to('.hero-character-container', {
                opacity: 1,
                duration: 0.8,
                ease: "power2.inOut"
            })
            .to('.welcome-italic', {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "power2.out"
            }, "-=0.6")
            .to('.aulmora-text', {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "expo.out"
            }, "-=0.4");
        }

        gsap.to('.page-reveal-overlay', {
            opacity: 0,
            duration: 1.2,
            ease: "power2.inOut",
            onComplete: () => {
                document.querySelector('.page-reveal-overlay').style.display = 'none';
            }
        });
        playHeroAnimations();

`;
    html = html.substring(0, jsTargetStart) + newJs + html.substring(jsTargetEnd);
    console.log("Replaced JS Loader block");
} else {
    console.log("Could not find JS target start or end.");
}

fs.writeFileSync(path, html);
console.log("Done");
