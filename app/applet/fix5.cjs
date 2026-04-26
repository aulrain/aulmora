const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf-8');

// 1. Remove cursor system
html = html.replace(/<div class="cursor-dot"><\/div>\s*<div class="cursor-ring"><\/div>/g, '');
const cursorCssMatch = html.match(/\/\* Custom Cursor \*\/\s*\* {\s*cursor: none !important;\s*}\s*\.cursor-dot[\s\S]*?(?=\/\* Brush Splashes \*\/)/);
if(cursorCssMatch) html = html.replace(cursorCssMatch[0], '');

// also remove custom cursor full screen fixes
html = html.replace(/body\.is-fullscreen \*(.|\n)*?display: none !important;\s*}/g, '');
html = html.replace(/@media \(max-width: 768px\), \(hover: none\) {\s*body {\s*cursor: auto !important;\s*}\s*\.cursor-dot, \.cursor-ring {\s*display: none !important;\s*}\s*}/g, '');

const cursorJsMatch = html.match(/\/\/ Custom Cursor\s*const cursorDot = [\s\S]*?(?=\/\/ Loader)/);
if(cursorJsMatch) html = html.replace(cursorJsMatch[0], '');


// 2. Remove Global Grain overlay
html = html.replace(/<div class="global-grain"><\/div>/g, '');
html = html.replace(/\.global-grain[\s\S]*?z-index: 9999;\s*}/g, '');
// there's also an SVG defining the grain probably
html = html.replace(/<svg width="0" height="0">\s*<filter id="noiseFilter">[\s\S]*?<\/svg>/g, '');


// 3. Remove Plyr
html = html.replace(/<link rel="stylesheet" href="https:\/\/cdn\.plyr\.io\/[\s\S]*?plyr\.css" \/>/g, '');
html = html.replace(/<script src="https:\/\/cdn\.plyr\.io\/[\s\S]*?plyr\.polyfilled\.js"><\/script>/g, '');
// replace plyr code
// we might have: const plyrPlayer = new Plyr('#single-video-player', ...
html = html.replace(/const plyrPlayer = new Plyr\('#single-video-player'[\s\S]*?\);/g, 'const plyrPlayer = document.getElementById("single-video-player");');
// let's just make plyrPlayer refer to the HTMLMediaElement if needed, Plymouth uses play(), pause() same as HTML5 video
html = html.replace(/plyrPlayer\.source = \{\s*type: 'video',\s*sources: \[\s*\{\s*src: videoSrc,\s*provider: 'html5',\s*\}\s*\]\s*\};/g, "plyrPlayer.src = videoSrc; plyrPlayer.load(); plyrPlayer.play();");
html = html.replace(/plyrPlayer\.on\('enterfullscreen'[\s\S]*?\);/g, '');
html = html.replace(/plyrPlayer\.on\('exitfullscreen'[\s\S]*?\);/g, '');


// 6. Ethereal Shadow on mobile
// add media query for body background
const etherealShadowCss = `
        @media (max-width: 768px) {
            .hero::before, .hero::after {
                display: none !important;
            }
            body {
                background: radial-gradient(ellipse at 60% 40%, rgba(180, 155, 70, 0.06) 0%, transparent 60%), #0A0A0A !important;
            }
        }`;
// let's insert it before closing style
html = html.replace('</style>', etherealShadowCss + '\n    </style>');


// 10. Add resource hints to head
const hints = `    <link rel="dns-prefetch" href="https://res.cloudinary.com">
    <link rel="preconnect" href="https://res.cloudinary.com" crossorigin>
    <link rel="dns-prefetch" href="https://cdnjs.cloudflare.com">`;
html = html.replace('<meta charset="UTF-8">', '<meta charset="UTF-8">\n' + hints);

// 11. Defer scripts
html = html.replace(/<script src="https:\/\/cdnjs.cloudflare.com\/ajax\/libs\/gsap\/\d+\.\d+\.\d+\/gsap\.min\.js"><\/script>/, '<script defer src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>');
html = html.replace(/<script src="https:\/\/cdnjs.cloudflare.com\/ajax\/libs\/gsap\/\d+\.\d+\.\d+\/ScrollTrigger\.min\.js"><\/script>/, '<script defer src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>');
html = html.replace(/<script src="https:\/\/cdnjs.cloudflare.com\/ajax\/libs\/gsap\/\d+\.\d+\.\d+\/ScrollToPlugin\.min\.js"><\/script>/, '<script defer src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollToPlugin.min.js"></script>');

fs.writeFileSync('index.html', html);
