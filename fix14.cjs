const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf-8');
html = html.replace(/\.plyr--fullscreen-active video \{[\s\S]*?\}/, '');
fs.writeFileSync('index.html', html);
