const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf-8');

// 1. Array replacement
const oldArray = `                videos: [
                    'xQtYyLK7IFM',
                    'Jly1p6fMkWk',
                    'LQaqOy6b3Uw',
                    '5aUNc85vsrI',
                    'ez5-oXoXNSs',
                    'Q2CbwqjSMis',
                    '0vP2s1xO8IU',
                    'SpXmJ6uO25A',
                    'E66CwZ7lWc8',
                    '3uPizMacVlc'
                ]`;
const newArray = `                videos: [
                    '/videos/video1.mp4',
                    '/videos/video2.mp4',
                    '/videos/video3.mp4',
                    '/videos/video4.mp4',
                    '/videos/video5.mp4',
                    '/videos/video6.mp4',
                    '/videos/video7.mp4',
                    '/videos/video8.mp4',
                    '/videos/video9.mp4',
                    '/videos/video10.mp4',
                    '/videos/video11.mp4',
                    '/videos/video12.mp4',
                    '/videos/video13.mp4',
                    '/videos/video14.mp4',
                    '/videos/video15.mp4'
                ]`;
html = html.replace(oldArray, newArray);


// 2. Observer and DOM logic Replacement
const oldJSLogicStart = html.indexOf('                seamlessVideos.forEach((videoId, index) => {');
const oldJSLogicEnd = html.indexOf('                // Disconnect previous observer if necessary by re-attaching');
if (oldJSLogicStart !== -1 && oldJSLogicEnd !== -1) {
    const newJSLogic = `                let isMobileInit = window.innerWidth <= 768;
                let userInteracted = !isMobileInit;
                const trackDOM = document.getElementById('video-track');
                
                const appendRemainingNodes = () => {
                    userInteracted = true;
                    // Injecting 15 to 30 if they were omitted initially
                    trackDOM.querySelectorAll('.video-item.deferred').forEach(item => {
                        item.classList.remove('deferred');
                        window.marqueeObserver.observe(item);
                    });
                    document.removeEventListener('touchstart', appendRemainingNodes);
                    document.removeEventListener('scroll', appendRemainingNodes);
                    document.removeEventListener('click', appendRemainingNodes);
                };
                
                if (isMobileInit) {
                    document.addEventListener('touchstart', appendRemainingNodes, {once:true, passive:true});
                    document.addEventListener('scroll', appendRemainingNodes, {once:true, passive:true});
                    document.addEventListener('click', appendRemainingNodes, {once:true, passive:true});
                }

                seamlessVideos.forEach((src, index) => {
                    const isDeferred = isMobileInit && index >= 6;
                    videoHtml += \`
                        <div class="video-item \${isDeferred ? 'deferred' : ''}" data-video-index="\${index}">
                            <video data-src="\${src}"
                                muted 
                                autoplay 
                                loop 
                                playsinline 
                                preload="none"
                                style="width: 100%; height: 100%; object-fit: cover; pointer-events: none;">
                            </video>
                        </div>
                    \`;
                });
                track.innerHTML = videoHtml;

                // IntersectionObserver for lazy loading and playback optimization
                const videoWrapper = document.querySelector('.video-marquee-wrapper');
                
                // Track horizontal and vertical visibility for individual videos
                const observerOptions = {
                    root: null,
                    rootMargin: '0px 200px 0px 200px',
                    threshold: 0
                };

                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        const v = entry.target.querySelector('video');
                        if (entry.isIntersecting) {
                            entry.target.dataset.intersecting = "true";
                            if (!v.getAttribute('src') || v.getAttribute('src') === '') {
                                v.setAttribute('src', v.getAttribute('data-src'));
                                v.load();
                            }
                            const p = v.play();
                            if (p !== undefined) {
                                p.catch(e => {});
                            }
                        } else {
                            entry.target.dataset.intersecting = "false";
                            if (!v.paused) {
                                v.pause();
                            }
                        }
                    });

                    // Memory management logic - modified for max 4 loaded videos instead of distance 3
                    const videoItemsArray = Array.from(track.querySelectorAll('.video-item'));
                    let activeLoadedVideos = [];
                    
                    videoItemsArray.forEach((item, index) => {
                        const v = item.querySelector('video');
                        if (v.getAttribute('src')) {
                            activeLoadedVideos.push({ item, index, v });
                        }
                    });

                    // We want to limit the active loaded to 4 at most based on distance
                    if (activeLoadedVideos.length > 4) {
                        videoItemsArray.forEach((item, index) => {
                            if (item.dataset.intersecting === "false") {
                                const v = item.querySelector('video');
                                if (v.getAttribute('src')) {
                                    let minDistance = Infinity;
                                    videoItemsArray.forEach((innerItem, innerIndex) => {
                                        if (innerItem.dataset.intersecting === "true") {
                                            const dist = Math.abs(innerIndex - index);
                                            if (dist < minDistance) minDistance = dist;
                                        }
                                    });
                                    // if minDistance > 2 means it's far enough, purge
                                    if (minDistance > 2 || activeLoadedVideos.length > 4) {
                                        v.removeAttribute('src');
                                        v.load();
                                        activeLoadedVideos = activeLoadedVideos.filter(loaded => loaded.index !== index);
                                    }
                                }
                            }
                        });
                    }
                }, observerOptions);

`;
    html = html.substring(0, oldJSLogicStart) + newJSLogic + html.substring(oldJSLogicEnd);
} else {
    console.log("Could not find observer logic chunk bounds");
}

fs.writeFileSync('index.html', html);
console.log("Replaced DOM injection & intersection logic");
