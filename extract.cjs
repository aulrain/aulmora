const fs = require('fs'); 
const html = fs.readFileSync('index.html', 'utf8'); 
const scripts = html.match(/<script[\s\S]*?>([\s\S]*?)<\/script>/gi); 
const s3 = scripts[3].match(/<script[\s\S]*?>([\s\S]*?)<\/script>/i)[1];
fs.writeFileSync('script3.js', s3);
