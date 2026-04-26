const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf-8');

// 1. Menu links
html = html.replace(/menuLinks\.forEach\(link => \{\s*link\.addEventListener\('click', \(\) => \{/g,
    `document.addEventListener('click', (e) => {
            const link = e.target.closest('.menu-link');
            if (link) {`);

let oldCloseBrace = `            });
        });`;
// that's dangerous. Let's do it using exact replacements.
