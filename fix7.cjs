const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf-8');

// The click listener for work-items:
const oldListener = `document.querySelectorAll('.work-item[data-project-id="ai-videos"]').forEach(item => {
            item.addEventListener('click', function() {
                const projectId = this.getAttribute('data-project-id');`;

const newListener = `document.addEventListener('click', function(e) {
            const item = e.target.closest('.work-item[data-project-id="ai-videos"]');
            if (item) {
                const projectId = item.getAttribute('data-project-id');`;

// Let me find the closing brace.
html = html.replace(`document.querySelectorAll('.work-item[data-project-id="ai-videos"]').forEach(item => {
            item.addEventListener('click', function() {`, 
            `document.addEventListener('click', function(e) {
            const _this = e.target.closest('.work-item[data-project-id="ai-videos"]');
            if (!_this) return;
            // function scope mock so "this" references in original code still might work? Wait better yet to replace 'this'
            // let's just make it straightforward since we know how it uses this.
`);

// But wait, it uses \`this.getAttribute\`
html = html.replace(/const projectId = this\.getAttribute\('data-project-id'\);/, "const projectId = _this.getAttribute('data-project-id');");

html = html.replace(`            });
        });

        // Photos Overlay Open`,
`        });

        // Photos Overlay Open`);

// Are there other forEach addEventListeners?
// Photo Open Loop:
// let's find mouseenter/mouseleave too.
fs.writeFileSync('index.html', html);
