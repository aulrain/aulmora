const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf-8');

html = html.replace(`                    plyrPlayer.source = {
                        type: 'video',
                        sources: [{ src: src, type: 'video/mp4' }]
                    };`,
`                    plyrPlayer.src = src;
                    plyrPlayer.load();`);

html = html.replace(`                    const togglePromise = plyrPlayer.togglePlay();
                    if (togglePromise !== undefined) {
                        togglePromise.catch(error => {
                            // Autoplay was prevented
                        });
                    }`,
`                    if (plyrPlayer.paused) {
                        const playPromise = plyrPlayer.play();
                        if (playPromise !== undefined) {
                            playPromise.catch(error => {});
                        }
                    } else {
                        plyrPlayer.pause();
                    }`);

fs.writeFileSync('index.html', html);
