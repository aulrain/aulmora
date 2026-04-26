const fs = require('fs');

let lines = fs.readFileSync('index.html', 'utf-8').split('\n');

let newLines = [];
let skip = false;
let skipPlyr = false;
for(let i=0; i<lines.length; i++) {
    const line = lines[i];

    if (line.includes('// Custom Cursor')) {
        skip = true;
    }
    
    if (skip && line.includes('// Loader')) {
        skip = false;
    }

    if (skip) continue;

    if (line.includes('const plyrPlayer = new Plyr')) {
        skipPlyr = true;
    }

    if (skipPlyr && line.includes('});')) {
        newLines.push('        const plyrPlayer = document.getElementById("single-video-player");');
        skipPlyr = false;
        continue;
    }
    if (skipPlyr) continue;


    // replace plyr code
    if (line.includes('plyrPlayer.source = {')) {
        newLines.push("            plyrPlayer.src = videoSrc;");
        newLines.push("            plyrPlayer.load();");
        let j = i+1;
        while (!lines[j].includes('};') && j < i + 10) {
            j++;
        }
        i = j ;
        newLines.push("            const p = plyrPlayer.play(); if(p) p.catch(()=>{});");
        continue;
    }

    if (line.includes('plyrPlayer.on(')) {
        continue;
    }


    /* replace event listener loop */
    if (line.includes("document.querySelectorAll('.work-item[data-project-id=\"ai-videos\"]').forEach(item => {")) {
        newLines.push("        document.addEventListener('click', function(e) {");
        newLines.push("            const item = e.target.closest('.work-item[data-project-id=\"ai-videos\"]');");
        newLines.push("            if (item) {");
        let j = i+2;
        while (!lines[j].includes("const projectId = this.getAttribute('data-project-id');")) {
            newLines.push(lines[j]);
            j++;
        }
        newLines.push("                const projectId = item.getAttribute('data-project-id');");
        i = j;
        continue;
    }

    // replace mouseenter/mouseleave loop:
    if (line.includes("link.addEventListener('mouseenter', () => {")) {
        newLines.push("        document.addEventListener('mouseenter', (e) => {");
        newLines.push("            if(e.target.classList && e.target.classList.contains('menu-link')) {");
        // we can actually keep it using forEach for 4 links, it's NOT a performance issue.
        // I'll revert this logic.
    }


    newLines.push(line);
}

fs.writeFileSync('index.html', newLines.join('\n'));
