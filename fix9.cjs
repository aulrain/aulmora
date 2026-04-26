const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf-8');

// The JS block:
let startIndex = html.indexOf('// Custom Cursor');
let endIndex = html.indexOf('// Intro Reveal Animation');
if (startIndex !== -1 && endIndex !== -1) {
    let before = html.substring(0, startIndex);
    let after = html.substring(endIndex);
    // Wait, we need to keep `const isMobile = window.innerWidth <= 768;` 
    // and `const isTouchDevice ...` as they are used later!
    let keepVars = `
        const isMobile = window.innerWidth <= 768;
        const isTouchDevice = window.matchMedia('(hover: none)').matches || 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
`;
    html = before + keepVars + "        " + after;
}

// In HTML markup - where are the cursor elements?
startIndex = html.indexOf('<div class="cursor-dot">');
if (startIndex !== -1) {
    let nextStart = html.indexOf('</div>', startIndex);
    let secondStart = html.indexOf('<div class="cursor-ring">', nextStart);
    if(secondStart !== -1) {
        let secondEnd = html.indexOf('</div>', secondStart) + 6;
        html = html.substring(0, startIndex) + html.substring(secondEnd);
    }
}

fs.writeFileSync('index.html', html);
