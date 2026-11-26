 // Matrix Background
        const canvas = document.getElementById('matrix-bg');
        const ctx = canvas.getContext('2d');

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
        const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const nums = '0123456789';
        const alphabet = katakana + latin + nums;

        const fontSize = 16;
        const columns = canvas.width / fontSize;

        const rainDrops = [];

        for (let x = 0; x < columns; x++) {
            rainDrops[x] = 1;
        }

        const draw = () => {
            ctx.fillStyle = 'rgba(10, 25, 47, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#64ffda';
            ctx.font = fontSize + 'px monospace';

            for (let i = 0; i < rainDrops.length; i++) {
                const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
                ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

                if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    rainDrops[i] = 0;
                }
                rainDrops[i]++;
            }
        };

        setInterval(draw, 30);

        // Typing Effect
       

        // Scroll Indicator
        const scrollIndicator = document.querySelector('.scroll-indicator');

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollIndicator.classList.add('active');
            } else {
                scrollIndicator.classList.remove('active');
            }
        });

        scrollIndicator.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Mobile Menu
        const menuBtn = document.querySelector('.menu-btn');
        const navLinks = document.querySelector('.nav-links');

        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Smooth Scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();

                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });

                navLinks.classList.remove('active');
            });
        });

        // Animation on Scroll
        const fadeElements = document.querySelectorAll('.fade-in');

        const fadeInOnScroll = () => {
            fadeElements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;

                if (elementTop < windowHeight - 100) {
                    element.style.opacity = 1;
                    element.style.transform = 'translateY(0)';
                }
            });
        };

        window.addEventListener('scroll', fadeInOnScroll);
        window.addEventListener('load', fadeInOnScroll);
        // Studies: git branch graph
        const gitGraph = document.getElementById('git-graph');

        const drawGitGraph = () => {
            if (!gitGraph) return;
            const svg = gitGraph.querySelector('.git-lines');
            const commits = [...gitGraph.querySelectorAll('.commit')];
            const pos = {};
            const color = c => getComputedStyle(c).getPropertyValue('--node-color').trim() || '#64ffda';

            commits.forEach(c => {
                const node = c.querySelector('.commit-node');
                // offsetTop/offsetLeft ignore the fade-in transform
                pos[c.dataset.id] = {
                    x: node.offsetLeft + node.offsetWidth / 2,
                    y: c.offsetTop + node.offsetTop + node.offsetHeight / 2,
                    lane: +c.dataset.lane,
                    color: color(c)
                };
            });

            const r = 18;
            const lines = [];
            const forks = [];
            const path = (d, stroke, cls = '') => `<path d="${d}" stroke="${stroke}" class="${cls}"/>`;
            const add = (d, stroke, cls) => lines.push(path(d, stroke, cls));
            // fork curves get a navy halo so they visibly pass over lanes they cross
            const addFork = (d, stroke) => forks.push(path(d, '', 'halo') + path(d, stroke));
            const topY = Math.min(...Object.values(pos).map(p => p.y));

            commits.forEach(c => {
                const child = pos[c.dataset.id];
                c.dataset.parents.split(' ').filter(Boolean).forEach(pid => {
                    const p = pos[pid];
                    if (p.lane === child.lane) {
                        add(`M${p.x} ${p.y} L${child.x} ${child.y}`, child.color);
                    } else if (child.lane > p.lane) {
                        // branch off: from the parent commit, or from the parent's line just below the child
                        const y = c.dataset.fork === 'below' ? child.y + 4 * r : p.y;
                        addFork(`M${p.x} ${y} C${p.x} ${y - r} ${child.x} ${y - r} ${child.x} ${y - 2 * r} L${child.x} ${child.y}`, child.color);
                    } else {
                        // merge: go straight up, then curve back into the target lane
                        add(`M${p.x} ${p.y} L${p.x} ${child.y + 2 * r} C${p.x} ${child.y + r} ${child.x} ${child.y + r} ${child.x} ${child.y}`, p.color);
                    }
                });
                // branches still in progress: solid up to the newest commit, dashed beyond it
                if (c.hasAttribute('data-open')) {
                    add(`M${child.x} ${child.y} L${child.x} ${topY}`, child.color);
                    add(`M${child.x} ${topY} L${child.x} 0`, child.color, 'open');
                }
            });

            // main keeps going above the last merge
            const mains = commits.filter(c => c.dataset.lane === '0');
            if (mains.length) {
                const top = pos[mains[0].dataset.id];
                add(`M${top.x} ${top.y} L${top.x} 0`, top.color, 'open');
            }

            const paths = [...lines, ...forks];
            svg.innerHTML = paths.join('');
        };

        window.addEventListener('load', drawGitGraph);
        window.addEventListener('resize', drawGitGraph);
        if (document.fonts) document.fonts.ready.then(drawGitGraph);
        drawGitGraph();

        // Contact form: delivered by Web3Forms (https://web3forms.com).
        // The access key is meant to be public; it only lets this form email the inbox it was created for.
        const WEB3FORMS_ACCESS_KEY = 'eccdeef6-f886-4d9c-b414-a0e6e0627fec';
        const contactForm = document.getElementById('contact-form');

        if (contactForm) {
            const status = document.getElementById('form-status');
            const button = contactForm.querySelector('.submit-btn');
            const setStatus = (text, type = '') => {
                status.textContent = text;
                status.className = 'form-status ' + type;
            };

            contactForm.addEventListener('submit', async (e) => {
                e.preventDefault();

                if (!contactForm.checkValidity()) {
                    const invalid = contactForm.querySelector(':invalid');
                    setStatus(invalid.type === 'email' && invalid.value
                        ? '> Please enter a valid email address.'
                        : '> Please fill in your name, email and message.', 'error');
                    invalid.focus();
                    return;
                }

                const data = Object.fromEntries(new FormData(contactForm));
                const payload = {
                    access_key: WEB3FORMS_ACCESS_KEY,
                    from_name: 'daavid.dev contact form',
                    name: data.name,
                    email: data.email,
                    subject: data.subject ? `daavid.dev: ${data.subject}` : `daavid.dev: message from ${data.name}`,
                    message: data.message,
                    botcheck: !!data.botcheck
                };

                button.disabled = true;
                button.textContent = 'Sending...';
                setStatus('');

                try {
                    const res = await fetch('https://api.web3forms.com/submit', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                        body: JSON.stringify(payload)
                    });
                    const result = await res.json().catch(() => ({}));
                    if (!res.ok || !result.success) throw new Error(result.message || res.statusText);

                    contactForm.reset();
                    setStatus("> Message sent. I'll get back to you soon!", 'success');
                } catch (err) {
                    console.error('Contact form failed:', err);
                    setStatus('> Something went wrong. Please email me directly at david@daavid.dev.', 'error');
                } finally {
                    button.disabled = false;
                    button.textContent = 'Send Message';
                }
            });
        }

        // Skills: "type in" the editor when it scrolls into view, click a line to move the cursor
        const editor = document.getElementById('skills-editor');

        if (editor) {
            const cursor = document.getElementById('editor-cursor');
            const lines = [...editor.querySelectorAll('.code-line')];

            new IntersectionObserver((entries, obs) => {
                if (entries[0].isIntersecting) {
                    editor.classList.add('typed');
                    obs.disconnect();
                }
            }, { threshold: 0.25 }).observe(editor);

            lines.forEach((line, i) => {
                line.addEventListener('click', () => {
                    lines.forEach(l => l.classList.remove('active'));
                    line.classList.add('active');
                    const sel = window.getSelection();
                    const col = sel && sel.anchorNode && line.contains(sel.anchorNode) ? sel.anchorOffset + 1 : 1;
                    cursor.textContent = `Ln ${i + 1}, Col ${col}`;
                });
            });
            lines[0].classList.add('active');
        }
