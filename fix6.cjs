const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf-8');

// 4. Optimize GSAP ScrollTrigger scrub
html = html.replace(/scrub:\s*isTouchDevice \? \d+ : true/g, 'scrub: isTouchDevice ? 2 : 1');
html = html.replace(/scrub:\s*true/g, 'scrub: 1');

// 5. Add will-change cautiously
const willChangeMap = {
    '.video-marquee-track {': '.video-marquee-track {\n            will-change: transform;',
    '.hero-character-container {': '.hero-character-container {\n            will-change: transform;'
};
for(const [k, v] of Object.entries(willChangeMap)) {
    if(!html.includes(v)) {
        html = html.replace(k, v);
    }
}

// 8. Add {passive: true} to event listeners internally if applicable
html = html.replace(/window\.addEventListener\('wheel',/g, "window.addEventListener('wheel',"); // already there mostly, check if active
html = html.replace(/document\.addEventListener\('touchstart',\s*([a-zA-Z0-9_]+)\)/g, "document.addEventListener('touchstart', $1, {passive: true})");
html = html.replace(/document\.addEventListener\('scroll',\s*([a-zA-Z0-9_]+)\)/g, "document.addEventListener('scroll', $1, {passive: true})");

// For IntersectionObservers
html = html.replace(/rootMargin: '0px 200px 0px 200px'/g, "rootMargin: window.innerWidth <= 768 ? '0px 50px 0px 50px' : '0px 100px 0px 100px'");

fs.writeFileSync('index.html', html);
