const fs = require('fs'); 
const html = fs.readFileSync('index.html', 'utf8'); 
const scripts = html.match(/<script[\s\S]*?>([\s\S]*?)<\/script>/gi); 
scripts.forEach((s, i) => { 
    const code = s.match(/<script[\s\S]*?>([\s\S]*?)<\/script>/i)[1]; 
    try { 
        require('vm').createScript(code); 
        console.log('Script ' + i + ' is OK');
    } catch(e) { 
        console.log('Error in script ' + i + ': ' + e.message); 
        const lines = code.split('\n');
        console.log('Last few lines context:');
        const match = e.stack.match(/evalmachine\.<anonymous>:(\d+)/);
        if (match) {
            const lineNum = parseInt(match[1], 10);
            for(let j = Math.max(0, lineNum - 5); j < Math.min(lines.length, lineNum + 5); j++) {
                console.log(j + 1 + ': ' + lines[j]);
            }
        } else {
            console.log(e.stack.split('\n').slice(0, 5).join('\n'));
        }
    } 
});
