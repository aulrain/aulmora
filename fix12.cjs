const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf-8');

const regex = /menuLinks\.forEach\(link => \{[\s\S]*?link\.addEventListener\('mouseenter',[\s\S]*?\}\);/g;

// I'll be safer using `.replace` with exact string

let oldCode = `        menuLinks.forEach(link => {
            const text = link.innerText;
            link.innerHTML = '';
            const chars = [];
            
            // Setup characters
            text.split('').forEach((char, i) => {
                const span = document.createElement('span');
                span.innerText = char === ' ' ? '\\u00A0' : char;
                span.style.display = 'inline-block';
                link.appendChild(span);
                chars.push(span);
            });

            // Store tweens inside link DOM element properties?
            let tweens = [];
            chars.forEach((char, i) => {
                tweens.push(gsap.to(char, {
                    y: -12,
                    color: "var(--rich-gold)",
                    duration: 0.8,
                    ease: "sine.inOut",
                    yoyo: true,
                    repeat: -1,
                    delay: i * 0.05,
                    paused: true
                }));
            });

            link.addEventListener('mouseenter', () => {
                tweens.forEach(t => t.play());
            });

            link.addEventListener('mouseleave', () => {
                chars.forEach((char, i) => {
                    gsap.killTweensOf(char);
                    gsap.to(char, { y: 0, color: "var(--warm-white)", duration: 0.5, ease: "power2.out" });
                    tweens[i] = gsap.to(char, {
                        y: -12,
                        color: "var(--rich-gold)",
                        duration: 0.8,
                        ease: "sine.inOut",
                        yoyo: true,
                        repeat: -1,
                        delay: i * 0.05,
                        paused: true
                    });
                });
            });
        });`;

let newCode = `        // Delegated menuLinks logic
        const menuTwData = new Map();
        
        menuLinks.forEach(link => {
            const text = link.innerText;
            link.innerHTML = '';
            const chars = [];
            text.split('').forEach((char, i) => {
                const span = document.createElement('span');
                span.innerText = char === ' ' ? '\\u00A0' : char;
                span.style.display = 'inline-block';
                link.appendChild(span);
                chars.push(span);
            });

            const tweens = [];
            chars.forEach((char, i) => {
                tweens.push(gsap.to(char, {
                    y: -12,
                    color: "var(--rich-gold)",
                    duration: 0.8,
                    ease: "sine.inOut",
                    yoyo: true,
                    repeat: -1,
                    delay: i * 0.05,
                    paused: true
                }));
            });
            
            menuTwData.set(link, { chars, tweens });
        });

        document.addEventListener('mouseover', (e) => {
            const link = e.target.closest('.menu-link');
            if (link && menuTwData.has(link)) {
                menuTwData.get(link).tweens.forEach(t => t.play());
            }
        });

        document.addEventListener('mouseout', (e) => {
            const link = e.target.closest('.menu-link');
            if (link && menuTwData.has(link)) {
                const data = menuTwData.get(link);
                data.chars.forEach((char, i) => {
                    gsap.killTweensOf(char);
                    gsap.to(char, { y: 0, color: "var(--warm-white)", duration: 0.5, ease: "power2.out" });
                    data.tweens[i] = gsap.to(char, {
                        y: -12,
                        color: "var(--rich-gold)",
                        duration: 0.8,
                        ease: "sine.inOut",
                        yoyo: true,
                        repeat: -1,
                        delay: i * 0.05,
                        paused: true
                    });
                });
            }
        });`;

if (html.includes('menuLinks.forEach(link => {')) {
    html = html.replace(oldCode, newCode);
}
fs.writeFileSync('index.html', html);
