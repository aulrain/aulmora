
        // Ensure page always starts at the top on reload
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
        window.addEventListener('beforeunload', () => {
            window.scrollTo(0, 0);
        });
        window.addEventListener('load', () => {
            setTimeout(() => {
                window.scrollTo(0, 0);
            }, 10);
        });

        // Register Plugins
        gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

        
        const isMobile = window.innerWidth <= 768;
        const isTouchDevice = window.matchMedia('(hover: none)').matches || 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        // Intro Reveal Animation
        function playHeroAnimations() {
            const tlLoader = gsap.timeline();
            tlLoader.to('.hero-character-container', {
                opacity: 1,
                duration: 0.8,
                ease: "power2.inOut"
            })
            .to('.welcome-italic', {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "power2.out"
            }, "-=0.6")
            .to('.aulmora-text', {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "expo.out"
            }, "-=0.4");
        }

        gsap.to('.page-reveal-overlay', {
            opacity: 0,
            duration: 1.2,
            ease: "power2.inOut",
            onComplete: () => {
                document.querySelector('.page-reveal-overlay').style.display = 'none';
            }
        });
        playHeroAnimations();

        // Character Parallax and Fade
        const charTl = gsap.timeline(isMobile ? {
            paused: true,
            scrollTrigger: {
                trigger: ".hero",
                start: "top -10%",
                onEnter: () => charTl.play()
            }
        } : {
            scrollTrigger: {
                trigger: ".hero",
                start: "top top",
                end: "bottom top",
                scrub: isTouchDevice ? 2 : 1
            }
        });
        
        charTl.to("#hero-character", {
            yPercent: isTouchDevice ? 0 : -30,
            duration: isMobile ? 0.8 : 0.5,
            ease: "none"
        }, 0)
        .to(".hero-character-container", {
            opacity: 0,
            duration: isMobile ? 0.8 : 0.5,
            ease: "none"
        }, 0);

        // Hamburger Menu Logic
        const menuToggle = document.querySelector('.menu-toggle');
        const fullMenu = document.querySelector('.full-menu');
        const menuLinks = document.querySelectorAll('.full-menu-link');
        let isMenuOpen = false;

        // Split menu links into spans for wave animation
        menuLinks.forEach(link => {
            const text = link.innerText;
            link.innerHTML = '';
            text.split('').forEach((char, i) => {
                const span = document.createElement('span');
                span.innerText = char === ' ' ? '\u00A0' : char;
                span.className = 'wave-char';
                link.appendChild(span);
            });

            // GSAP Hover Animation
            let chars = link.querySelectorAll('.wave-char');
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
        });

        menuToggle.addEventListener('click', () => {
            isMenuOpen = !isMenuOpen;
            menuToggle.classList.toggle('active');
            fullMenu.classList.toggle('active');
            
            // Prevent scrolling when menu is open
            document.body.style.overflow = isMenuOpen ? 'hidden' : '';

            if (isMenuOpen) {
                gsap.to(menuLinks, {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    stagger: 0.1,
                    delay: 0.3,
                    ease: "power2.out"
                });
            } else {
                gsap.to(menuLinks, {
                    opacity: 0,
                    y: 30,
                    duration: 0.3,
                    ease: "power2.in"
                });
            }
        });

        const brandLogo = document.querySelector('.brand');
        brandLogo.addEventListener('click', (e) => {
            if (isMenuOpen) {
                isMenuOpen = false;
                menuToggle.classList.remove('active');
                fullMenu.classList.remove('active');
                document.body.style.overflow = '';
                gsap.to(menuLinks, { opacity: 0, y: 30, duration: 0.3 });
            }
            // Smooth scroll to top
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        document.addEventListener('click', (e) => {
            if (e.target.closest('.menu-link')) {
                isMenuOpen = false;
                menuToggle.classList.remove('active');
                fullMenu.classList.remove('active');
                document.body.style.overflow = '';
                gsap.to(menuLinks, { opacity: 0, y: 30, duration: 0.3 });
            }
        });

        // Hero Parallax
        const vintageTl = gsap.to('.vintage-bg', {
            yPercent: isTouchDevice ? 0 : 10,
            ease: isMobile ? "power2.out" : "none",
            duration: isMobile ? 0.8 : 0.5,
            paused: isMobile,
            scrollTrigger: isMobile ? {
                trigger: ".vintage-wrapper",
                start: "top -10%",
                onEnter: () => vintageTl.play()
            } : {
                trigger: ".vintage-wrapper",
                start: "top top",
                end: "bottom top",
                scrub: isTouchDevice ? 2 : 1
            }
        });

        // Manifesto Text Reveal
        const manifestoText = document.querySelector('.manifesto-text');
        const htmlContent = manifestoText.innerHTML.trim();
        manifestoText.innerHTML = '';
        
        const tokens = htmlContent.split(/(<br\s*\/?>|\s+)/);
        
        tokens.forEach(token => {
            if (token.match(/<br\s*\/?>/i)) {
                manifestoText.appendChild(document.createElement('br'));
            } else if (token.trim().length > 0) {
                const span = document.createElement('span');
                span.innerHTML = token + ' ';
                span.className = 'manifesto-word';
                manifestoText.appendChild(span);
            }
        });

        const manifestoTl = gsap.to('.manifesto-word', {
            opacity: 1,
            color: '#C9A84C',
            stagger: 0.1,
            duration: isMobile ? 0.8 : 0.5,
            paused: isMobile,
            scrollTrigger: isMobile ? {
                trigger: ".manifesto",
                start: "top 80%",
                onEnter: () => manifestoTl.play()
            } : {
                trigger: ".manifesto",
                start: "top 60%",
                end: "bottom 60%",
                scrub: isTouchDevice ? 2 : 1
            }
        });

        // Works Parallax
        const workItems = document.querySelectorAll('.work-item');
        workItems.forEach(item => {
            gsap.fromTo(item, 
                { y: isTouchDevice ? 0 : 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: item,
                        start: "top bottom",
                    }
                }
            );
        });

        // More Services Reveal
        gsap.to('.more-services-block', {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            scrollTrigger: {
                trigger: ".more-services-block",
                start: "top 85%",
            }
        });

        // Process Steps Reveal
        const steps = document.querySelectorAll('.step');
        steps.forEach((step, index) => {
            gsap.from(step, {
                opacity: 0,
                y: isTouchDevice ? 0 : 30,
                duration: 0.6,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: step,
                    start: "top 85%",
                }
            });
        });

        // Process Arrows Reveal
        const arrows = document.querySelectorAll('.process-arrow-container');
        arrows.forEach((arrow, index) => {
            gsap.to(arrow, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                delay: 0.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: arrow,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            });
        });

        // Services Reveal
        const serviceItems = document.querySelectorAll('.service-item');
        serviceItems.forEach((item, index) => {
            gsap.from(item, {
                opacity: 0,
                x: isTouchDevice ? 0 : -30,
                duration: 0.6,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: item,
                    start: "top 85%",
                }
            });
        });

        // Expertise Reveal
        gsap.from('#expertise .section-header', {
            opacity: 0,
            y: isTouchDevice ? 0 : 30,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: {
                trigger: "#expertise",
                start: "top 80%",
            }
        });

        const expertiseCards = document.querySelectorAll('.expertise-card');
        expertiseCards.forEach((card, index) => {
            gsap.from(card, {
                opacity: 0,
                y: 30,
                duration: 0.6,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: card,
                    start: "top 85%",
                }
            });
        });

        // Booking Reveal
        gsap.from('#booking .section-header', {
            opacity: 0,
            y: 30,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: {
                trigger: "#booking",
                start: "top 80%",
            }
        });

        gsap.from('#contactForm', {
            opacity: 0,
            y: 30,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: {
                trigger: "#booking",
                start: "top 70%",
            }
        });

        // Footer Parallax
        gsap.from('.footer-content', {
            y: 50,
            opacity: 0,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: {
                trigger: "footer",
                start: "top bottom",
            }
        });

        // Navigation State
        let currentPhotoIndex = -1;
        let currentVideoIndex = -1;
        let currentVideoArray = [];

        // Portfolio Data
        const portfolioData = {
            'ai-videos': {
                title: 'AI Video Projects',
                tags: ['Nano Banana Pro', 'Kling AI', 'Veo', 'Seedance 2.0'],
                description: 'It begins with visionary storytelling, evolves through precise AI execution, and culminates in a perfectly rendered reality. We push the boundaries of synthetic media to deliver results that are as flawless as they are captivating.',
                videos: [
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
                ]
            }
        };

        // Initialize Plyr
        const plyrPlayer = document.getElementById("single-video-player");

        // Open Overlay
        document.addEventListener('click', function(e) {
            const item = e.target.closest('.work-item[data-project-id="ai-videos"]');
            if (item) {
                const projectId = item.getAttribute('data-project-id');
                const data = portfolioData[projectId];
                if(!data) return;

                // Populate data
                document.querySelector('.overlay-title').innerText = data.title;
                document.querySelector('.overlay-desc').innerText = data.description;
                
                const tagsHtml = data.tags.map(tag => `<span>${tag}</span>`).join('');
                document.querySelector('.overlay-tags').innerHTML = tagsHtml;

                // Populate videos
                currentVideoArray = data.videos;
                const track = document.getElementById('video-track');
                let videoHtml = '';
                
                // Duplicate array for seamless infinite scroll
                const seamlessVideos = [...data.videos, ...data.videos];
                
                let isMobileInit = window.innerWidth <= 768;
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
                    videoHtml += `
                        <div class="video-item ${isDeferred ? 'deferred' : ''}" data-video-index="${index}">
                            <video data-src="${src}"
                                muted 
                                autoplay 
                                loop 
                                playsinline 
                                preload="none"
                                style="width: 100%; height: 100%; object-fit: cover; pointer-events: none;">
                            </video>
                        </div>
                    `;
                });
                track.innerHTML = videoHtml;

                // IntersectionObserver for lazy loading and playback optimization
                const videoWrapper = document.querySelector('.video-marquee-wrapper');
                
                // Track horizontal and vertical visibility for individual videos
                const observerOptions = {
                    root: null,
                    rootMargin: window.innerWidth <= 768 ? '0px 50px 0px 50px' : '0px 100px 0px 100px',
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

                // Disconnect previous observer if necessary by re-attaching
                if (window.marqueeObserver) {
                    window.marqueeObserver.disconnect();
                }
                window.marqueeObserver = observer;
                
                const videoItems = track.querySelectorAll('.video-item:not(.deferred)');
                videoItems.forEach(item => observer.observe(item));

                // Animate in
                gsap.to('.project-overlay', {
                    y: "0%",
                    duration: 0.4,
                    ease: "expo.inOut"
                });
                
                gsap.fromTo('.overlay-content-inner > *', 
                    { opacity: 0, y: 10 },
                    { opacity: 1, y: 0, duration: 0.3, stagger: 0.05, delay: 0.2 }
                );
                gsap.fromTo('.video-marquee-track',
                    { opacity: 0 },
                    { opacity: 1, duration: 0.6, ease: "power2.out", delay: 0.2 }
                );
                document.body.style.overflow = 'hidden'; // prevent bg scroll
                document.documentElement.style.overflow = 'hidden';
            }
        });

        // Close Project Overlay
        document.querySelector('.overlay-close').addEventListener('click', () => {
            if (window.marqueeObserver) {
                window.marqueeObserver.disconnect();
            }
            gsap.to('.project-overlay', {
                y: "100%",
                duration: 0.4,
                ease: "expo.inOut",
                onComplete: () => {
                    document.getElementById('video-track').innerHTML = ''; // clear videos
                    document.body.style.overflow = '';
                    document.documentElement.style.overflow = '';
                    gsap.set('.overlay-content-inner > *', { opacity: 0 });
                }
            });
        });

        // Photo Gallery Setup
        const photoGallery = document.getElementById('photo-gallery');
        
        // REPLACE THESE URLS WITH YOUR OWN IMAGE LINKS
        const myPhotoUrls = [
            'https://res.cloudinary.com/dtxyscbco/image/upload/q_auto,f_auto,w_1200/v1776378081/hf_20260409_161711_6b4e607a-9178-40ae-9e74-ac62cdb241ab_1_1_ftpjz4.jpg',
            'https://res.cloudinary.com/dtxyscbco/image/upload/q_auto,f_auto,w_1200/v1776378078/hf_20260409_130912_3b7f77d7-b631-4fd1-8860-dfa7ff498978_1_1_iu3zm8.jpg',
            'https://res.cloudinary.com/dtxyscbco/image/upload/q_auto,f_auto,w_1200/v1776378078/hf_20260410_094730_fe4cac96-23cc-4928-b9f6-cf8a44c6ba76_1_yidcck.jpg',
            'https://res.cloudinary.com/dtxyscbco/image/upload/q_auto,f_auto,w_1200/v1776378074/hf_20260410_100035_c784a816-b15c-4f2d-82b4-0ddda0e82f44_uwtkj8.jpg',
            'https://res.cloudinary.com/dtxyscbco/image/upload/q_auto,f_auto,w_1200/v1776378074/hf_20260410_113409_ee68e1ba-78b5-4c17-8c0a-949fc589472e_xehdfs.jpg',
            'https://res.cloudinary.com/dtxyscbco/image/upload/q_auto,f_auto,w_1200/v1776378071/hf_20260410_120729_b45a7511-db11-4e34-81b2-f0fc9795d4be_1_vgkrxp.jpg',
            'https://res.cloudinary.com/dtxyscbco/image/upload/q_auto,f_auto,w_1200/v1776378069/hf_20260410_121344_d9d8d1b6-82e1-4c14-887b-b179c3a509a2_tsr7pv.jpg',
            'https://res.cloudinary.com/dtxyscbco/image/upload/q_auto,f_auto,w_1200/v1776378068/hf_20260410_122004_fb64ba67-467e-4b3e-90b5-4d4c3696252b_r5zukp.jpg',
            'https://res.cloudinary.com/dtxyscbco/image/upload/q_auto,f_auto,w_1200/v1776378067/hf_20260410_122820_8f1203ec-2f02-4cda-9173-76392c35cffa_iozt46.jpg',
            'https://res.cloudinary.com/dtxyscbco/image/upload/q_auto,f_auto,w_1200/v1776378065/hf_20260410_124132_b8691a34-6dc7-4722-b47c-cd3d85e388c5_hxo2q9.jpg',
            'https://res.cloudinary.com/dtxyscbco/image/upload/q_auto,f_auto,w_1200/v1776378062/hf_20260410_125200_fe28ba8b-6858-4a73-8295-e98798c1b163_frqjld.jpg',
            'https://res.cloudinary.com/dtxyscbco/image/upload/q_auto,f_auto,w_1200/v1776378061/hf_20260410_215901_5cb29eee-68f8-4863-aade-46c2f67cdc58_uigqzj.jpg',
            'https://res.cloudinary.com/dtxyscbco/image/upload/q_auto,f_auto,w_1200/v1776378059/hf_20260416_072116_39dfa374-02ca-40b2-a714-936d93a1f7c8_1_rnim0s.jpg',
            'https://res.cloudinary.com/dtxyscbco/image/upload/q_auto,f_auto,w_1200/v1776378058/hf_20260416_072751_a981f2b6-93e9-493e-b184-32bde1fa21df_pd5hb9.jpg',
            'https://res.cloudinary.com/dtxyscbco/image/upload/q_auto,f_auto,w_1200/v1776378056/hf_20260416_073108_5e641672-8f3b-4a10-b74e-ed49c8c63db0_mu3pa4.jpg',
            'https://res.cloudinary.com/dtxyscbco/image/upload/q_auto,f_auto,w_1200/v1776378055/hf_20260416_073703_69a356f7-0725-43a4-a930-720d23794f91_uoefd1.jpg',
            'https://res.cloudinary.com/dtxyscbco/image/upload/q_auto,f_auto,w_1200/v1776512985/hf_20260416_074004_abfb6732-1897-4f91-be98-9a3345579439_zioiko.jpg',
            'https://res.cloudinary.com/dtxyscbco/image/upload/q_auto,f_auto,w_1200/v1776512985/hf_20260416_074757_fc98931e-a056-403f-af07-c888b8bc4a90_xke9h6.jpg',
            'https://res.cloudinary.com/dtxyscbco/image/upload/q_auto,f_auto,w_1200/v1776512985/hf_20260416_075111_1a5d6eac-6072-4a02-9e8c-093127bb4707_d2ls5f.jpg',
            'https://res.cloudinary.com/dtxyscbco/image/upload/q_auto,f_auto,w_1200/v1776512985/hf_20260416_075300_396e45a0-908f-418a-8b68-f126d5db937b_1_wd9t8x.jpg',
            'https://res.cloudinary.com/dtxyscbco/image/upload/q_auto,f_auto,w_1200/v1776462561/photo-6_bhmxuq.jpg',
            'https://res.cloudinary.com/dtxyscbco/image/upload/q_auto,f_auto,w_1200/v1776462555/photo-9_tljpzl.jpg'
        ];

        myPhotoUrls.forEach((imgSrc, index) => {
            const num = (index + 1).toString().padStart(2, '0');
            const ratio = '3/4';
            
            const item = document.createElement('div');
            item.className = 'photo-item';
            item.style.aspectRatio = ratio;
            item.style.background = 'linear-gradient(45deg, #111, #222)';
            item.style.display = 'flex';
            item.style.alignItems = 'center';
            item.style.justifyContent = 'center';
            item.style.color = 'rgba(255,255,255,0.1)';
            item.style.fontSize = '3rem';
            item.style.fontFamily = 'var(--font-mono)';
            
            item.innerHTML = `
                <img src="${imgSrc}" alt="Photo ${num}" style="width: 100%; height: 100%; object-fit: cover;" loading="lazy" decoding="async" />
                <div class="photo-caption">
                    <div class="photo-caption-title">Aulmora Series ${num}</div>
                    <div class="photo-caption-meta">Photography • 2026</div>
                </div>
            `;
            item.addEventListener('click', () => {
                currentPhotoIndex = index;
                const photoOverlay = document.querySelector('.single-photo-overlay');
                document.getElementById('single-photo-img').src = imgSrc;
                photoOverlay.classList.add('active');
            });
            photoGallery.appendChild(item);
        });

        const photoGalleryContainer = document.getElementById('photo-gallery-container');

        // Open Photo Overlay
        document.querySelector('.work-item[data-project-id="ai-photos"]').addEventListener('click', () => {
            gsap.to('.photo-overlay', {
                y: "0%",
                duration: 0.4,
                ease: "expo.inOut"
            });
            
            gsap.fromTo('.photo-header-content > *', 
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.3, stagger: 0.05, delay: 0.2 }
            );

            gsap.fromTo('.photo-item',
                { opacity: 0, y: 15, scale: 0.98 },
                { opacity: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.03, ease: "cubic-bezier(0.25, 0.46, 0.45, 0.94)", delay: 0.2, clearProps: "transform" }
            );
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
        });

        // Close Photo Overlay
        document.querySelector('.photo-overlay-close').addEventListener('click', () => {
            gsap.to('.photo-overlay', {
                y: "100%",
                duration: 0.4,
                ease: "expo.inOut",
                onComplete: () => {
                    document.body.style.overflow = '';
                    document.documentElement.style.overflow = '';
                    gsap.set('.photo-header-content > *', { opacity: 0 });
                    gsap.set('.photo-item', { opacity: 0 });
                }
            });
        });

        // Close Single Video Overlay
        document.querySelector('.single-video-close').addEventListener('click', () => {
            const playerOverlay = document.querySelector('.single-video-overlay');
            
            playerOverlay.classList.remove('active');
            setTimeout(() => {
                plyrPlayer.pause();
                // Resume background videos - now managed by observer automatically
            }, 400); // wait for fade out transition
        });
        
        document.querySelector('.single-video-overlay').addEventListener('click', (e) => {
            if (e.target.classList.contains('single-video-overlay')) {
                document.querySelector('.single-video-close').click();
            }
        });

        // Close Single Photo Overlay
        document.querySelector('.single-photo-close').addEventListener('click', () => {
            document.querySelector('.single-photo-overlay').classList.remove('active');
        });

        document.querySelector('.single-photo-overlay').addEventListener('click', (e) => {
            if (e.target.classList.contains('single-photo-overlay') || e.target.classList.contains('single-photo-container')) {
                document.querySelector('.single-photo-close').click();
            }
        });

        // Keyboard Navigation
        document.addEventListener('keydown', (e) => {
            const photoOverlay = document.querySelector('.single-photo-overlay');
            const videoOverlay = document.querySelector('.single-video-overlay');
            
            if (photoOverlay.classList.contains('active')) {
                if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    currentPhotoIndex = (currentPhotoIndex + 1) % myPhotoUrls.length;
                    transitionPhoto(myPhotoUrls[currentPhotoIndex], 'right');
                } else if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    currentPhotoIndex = (currentPhotoIndex - 1 + myPhotoUrls.length) % myPhotoUrls.length;
                    transitionPhoto(myPhotoUrls[currentPhotoIndex], 'left');
                } else if (e.key === 'Escape') {
                    e.preventDefault();
                    document.querySelector('.single-photo-close').click();
                }
            } else if (videoOverlay.classList.contains('active')) {
                if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    currentVideoIndex = (currentVideoIndex + 1) % currentVideoArray.length;
                    transitionVideo(currentVideoArray[currentVideoIndex], 'right');
                } else if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    currentVideoIndex = (currentVideoIndex - 1 + currentVideoArray.length) % currentVideoArray.length;
                    transitionVideo(currentVideoArray[currentVideoIndex], 'left');
                } else if (e.key === 'Escape') {
                    e.preventDefault();
                    document.querySelector('.single-video-close').click();
                } else if (e.key === ' ' || e.code === 'Space') {
                    e.preventDefault();
                    const togglePromise = plyrPlayer.togglePlay();
                    if (togglePromise !== undefined) {
                        togglePromise.catch(e => {});
                    }
                }
            }
        });

        function transitionPhoto(src, direction) {
            const img = document.getElementById('single-photo-img');
            gsap.to(img, {
                opacity: 0,
                x: direction === 'right' ? -30 : 30,
                duration: 0.2,
                ease: "power2.in",
                onComplete: () => {
                    img.src = src;
                    gsap.fromTo(img, 
                        { opacity: 0, x: direction === 'right' ? 30 : -30 },
                        { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" }
                    );
                }
            });
        }

        function transitionVideo(src, direction) {
            const container = document.querySelector('.single-video-container');
            gsap.to(container, {
                opacity: 0,
                x: direction === 'right' ? -30 : 30,
                scale: 0.95,
                duration: 0.2,
                ease: "power2.in",
                onComplete: () => {
                    plyrPlayer.src = src;
                    plyrPlayer.load();
                    const playPromise = plyrPlayer.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(error => {});
                    }
                    gsap.fromTo(container, 
                        { opacity: 0, x: direction === 'right' ? 30 : -30, scale: 0.95 },
                        { opacity: 1, x: 0, scale: 1, duration: 0.4, ease: "power2.out" }
                    );
                }
            });
        }

        // Form Submission Logic
        const contactForm = document.getElementById('contactForm');

        if (contactForm) {
            contactForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const submitBtn = contactForm.querySelector('[data-fs-submit-btn]');
                const successMsg = contactForm.querySelector('[data-fs-success]');
                const btnText = submitBtn.querySelector('.btn-text');
                
                // Set loading state
                submitBtn.classList.add('loading');
                btnText.textContent = 'Sending...';
                successMsg.style.display = 'none';

                const formData = new FormData(contactForm);
                
                try {
                    const response = await fetch(contactForm.action, {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'Accept': 'application/json'
                        }
                    });

                    if (response.ok) {
                        submitBtn.classList.remove('loading');
                        submitBtn.classList.add('success');
                        submitBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> <span class="btn-text">Sent</span>';
                        successMsg.style.display = 'block';
                        contactForm.reset();
                        
                        // Reset button after 5 seconds
                        setTimeout(() => {
                            submitBtn.classList.remove('success');
                            submitBtn.innerHTML = '<span class="btn-text">Send</span>';
                            successMsg.style.display = 'none';
                        }, 5000);
                    } else {
                        throw new Error('Form submission failed');
                    }
                } catch (error) {
                    submitBtn.classList.remove('loading');
                    btnText.textContent = 'Error. Try again.';
                    setTimeout(() => {
                        btnText.textContent = 'Send';
                    }, 3000);
                }
            });
        }

        // Smooth Scroll for "Start a conversation" button
        const moreServicesLink = document.querySelector('.more-services-link');
        if (moreServicesLink) {
            moreServicesLink.addEventListener('click', (e) => {
                e.preventDefault();
                gsap.to(window, {
                    duration: 1.5,
                    scrollTo: { y: "#booking", offsetY: 50 },
                    ease: "power3.inOut"
                });
            });
        }
    