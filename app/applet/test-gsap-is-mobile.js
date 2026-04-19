const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf-8');

if(!html.includes('const isMobileWidth = window.innerWidth <= 768;')) {
    html = html.replace(
        "const isTouchDevice = window.matchMedia('(hover: none)').matches || 'ontouchstart' in window || navigator.maxTouchPoints > 0;",
        "const isMobileWidth = window.innerWidth <= 768;\n        const isTouchDevice = window.matchMedia('(hover: none)').matches || 'ontouchstart' in window || navigator.maxTouchPoints > 0;"
    );
}

// 1. Character Parallax
html = html.replace(
    /const charTl = gsap\.timeline\(\{[\s\S]*?scrub: isTouchDevice \? 2 : 1[\s\S]*?\}\);/,
    `const charTl = gsap.timeline(isMobileWidth ? {
            paused: true,
            scrollTrigger: {
                trigger: ".hero",
                start: "top 80%",
                onEnter: () => charTl.play()
            }
        } : {
            scrollTrigger: {
                trigger: ".hero",
                start: "top top",
                end: "bottom top",
                scrub: isTouchDevice ? 2 : 1
            }
        });`
);
html = html.replace(
    /charTl\.to\("#hero-character", \{[\s\S]*?ease: "none"\n\s*\}, 0\)/,
    `charTl.to("#hero-character", {
            yPercent: isTouchDevice ? 0 : -30,
            duration: isMobileWidth ? 0.8 : 0.5,
            ease: "none"
        }, 0)`
);
html = html.replace(
    /\.to\("\.hero-character-container", \{[\s\S]*?ease: "none"\n\s*\}, 0\)/,
    `.to(".hero-character-container", {
            maskPosition: "0% 100%",
            WebkitMaskPosition: "0% 100%",
            duration: isMobileWidth ? 0.8 : 0.5,
            ease: "none"
        }, 0)`
);

// 2. Vintage BG Parallax
html = html.replace(
    /gsap\.to\('\.vintage-bg', \{[\s\S]*?scrub: isTouchDevice \? 2 : true\n\s*\}\n\s*\}\);/,
    `const vintageTl = gsap.to('.vintage-bg', {
            yPercent: isTouchDevice ? 0 : 10,
            ease: "power2.out",
            duration: isMobileWidth ? 0.8 : 0.5,
            paused: isMobileWidth,
            scrollTrigger: isMobileWidth ? {
                trigger: ".vintage-wrapper",
                start: "top 80%",
                onEnter: () => vintageTl.play()
            } : {
                trigger: ".vintage-wrapper",
                start: "top top",
                end: "bottom top",
                scrub: isTouchDevice ? 2 : true
            }
        });`
);

// 3. Manifesto Word Scrub
html = html.replace(
    /gsap\.to\('\.manifesto-word', \{[\s\S]*?scrub: isTouchDevice \? 2 : 1\n\s*\}\n\s*\}\);/,
    `const manifestoTl = gsap.to('.manifesto-word', {
            opacity: 1,
            color: '#C9A84C',
            stagger: 0.1,
            duration: isMobileWidth ? 0.8 : 0.5,
            paused: isMobileWidth,
            scrollTrigger: isMobileWidth ? {
                trigger: ".manifesto",
                start: "top 80%",
                onEnter: () => manifestoTl.play()
            } : {
                trigger: ".manifesto",
                start: "top 60%",
                end: "bottom 60%",
                scrub: isTouchDevice ? 2 : 1
            }
        });`
);

fs.writeFileSync('index.html', html);
console.log("Done GSAP fixes");
