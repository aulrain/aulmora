const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf-8');


html = html.replace(
`        document.querySelectorAll('.work-item[data-project-id="ai-videos"]').forEach(item => {
            item.addEventListener('click', function() {
                const projectId = this.getAttribute('data-project-id');`,

`        document.addEventListener('click', function(e) {
            const item = e.target.closest('.work-item[data-project-id="ai-videos"]');
            if (item) {
                const projectId = item.getAttribute('data-project-id');`);

html = html.replace(
`                document.body.style.overflow = 'hidden';
            });
        });`,

`                document.body.style.overflow = 'hidden';
            }
        });`);


html = html.replace(
`        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                isMenuOpen = false;
                menuToggle.classList.remove('active');
                fullMenu.classList.remove('active');
                document.body.style.overflow = '';
                gsap.to(menuLinks, { opacity: 0, y: 30, duration: 0.3 });
            });
        });`,

`        document.addEventListener('click', (e) => {
            if (e.target.closest('.menu-link')) {
                isMenuOpen = false;
                menuToggle.classList.remove('active');
                fullMenu.classList.remove('active');
                document.body.style.overflow = '';
                gsap.to(menuLinks, { opacity: 0, y: 30, duration: 0.3 });
            }
        });`);


html = html.replace(
`        myPhotoUrls.forEach((imgSrc, index) => {
            const item = document.createElement('div');
            item.className = 'photo-item';
            
            const num = (index + 1).toString().padStart(2, '0');
            item.style.backgroundColor = '#1A1A1A';
            item.style.color = 'var(--rich-gold)';
            item.style.display = 'flex';
            item.style.alignItems = 'center';
            item.style.justifyContent = 'center';
            item.style.fontSize = '3rem';
            item.style.fontFamily = 'var(--font-mono)';
            
            item.innerHTML = \`
                <img src="\${imgSrc}" alt="Photo \${num}" style="width: 100%; height: 100%; object-fit: cover;" loading="lazy" decoding="async" />
                <div class="photo-caption">
                    <div class="photo-caption-title">Aulmora Series \${num}</div>
                    <div class="photo-caption-meta">Photography • 2026</div>
                </div>
            \`;
            item.addEventListener('click', () => {
                currentPhotoIndex = index;
                const photoOverlay = document.querySelector('.single-photo-overlay');
                document.getElementById('single-photo-img').src = imgSrc;
                photoOverlay.classList.add('active');
            });
            photoGallery.appendChild(item);
        });`,

`        myPhotoUrls.forEach((imgSrc, index) => {
            const item = document.createElement('div');
            item.className = 'photo-item';
            // store photo index as dataset for delegation
            item.dataset.index = index;
            item.dataset.src = imgSrc;
            
            const num = (index + 1).toString().padStart(2, '0');
            item.style.backgroundColor = '#1A1A1A';
            item.style.color = 'var(--rich-gold)';
            item.style.display = 'flex';
            item.style.alignItems = 'center';
            item.style.justifyContent = 'center';
            item.style.fontSize = '3rem';
            item.style.fontFamily = 'var(--font-mono)';
            
            item.innerHTML = \`
                <img src="\${imgSrc}" alt="Photo \${num}" style="width: 100%; height: 100%; object-fit: cover;" loading="lazy" decoding="async" />
                <div class="photo-caption">
                    <div class="photo-caption-title">Aulmora Series \${num}</div>
                    <div class="photo-caption-meta">Photography • 2026</div>
                </div>
            \`;
            photoGallery.appendChild(item);
        });

        // Delegate listener
        photoGallery.addEventListener('click', (e) => {
            const item = e.target.closest('.photo-item');
            if (item) {
                currentPhotoIndex = parseInt(item.dataset.index);
                const imgSrc = item.dataset.src;
                const photoOverlay = document.querySelector('.single-photo-overlay');
                document.getElementById('single-photo-img').src = imgSrc;
                photoOverlay.classList.add('active');
            }
        });`);

fs.writeFileSync('index.html', html);
