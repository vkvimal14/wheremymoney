/* WhereMyMoney — Full Beast Mode JS with Gamification, Urgency & 5% Extension Features */

// ==========================================
// BACKGROUND PARTICLES & EFFECTS
// ==========================================
(function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    
    function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    
    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 0.5,
            speedY: -(Math.random() * 0.3 + 0.1),
            alpha: Math.random() * 0.5 + 0.1,
            drift: (Math.random() - 0.5) * 0.2
        };
    }
    
    function init() {
        resize();
        particles = [];
        const count = Math.min(100, Math.floor((canvas.width * canvas.height) / 12000));
        for (let i = 0; i < count; i++) particles.push(createParticle());
    }
    
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.y += p.speedY;
            p.x += p.drift;
            if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
            ctx.fill();
        });
        requestAnimationFrame(draw);
    }
    
    init(); draw();
    window.addEventListener('resize', init);
})();

// Cursor Glow
(function initCursorGlow() {
    const glow = document.getElementById('cursor-glow');
    if (!glow) return;
    let mx = 0, my = 0;
    let currentX = 0, currentY = 0;
    
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    
    function update() {
        // Smooth lerp follow
        currentX += (mx - currentX) * 0.1;
        currentY += (my - currentY) * 0.1;
        glow.style.left = currentX + 'px';
        glow.style.top = currentY + 'px';
        requestAnimationFrame(update);
    }
    update();
})();

// Live Active Users Ticker (Urgency)
(function initLiveUsers() {
    const counter = document.getElementById('live-counter');
    if (!counter) return;
    let count = 1247;
    setInterval(() => {
        // Randomly go up or down by a small margin
        const shift = Math.floor(Math.random() * 5) - 1; 
        count += shift;
        if(count < 1000) count = 1050; // min floor
        counter.textContent = count.toLocaleString() + ' people';
    }, 4500);
})();

// Typewriter Hero
(function initTypewriter() {
    const roles = ["Money?", "Cash?", "Dough?", "Moolah?", "500 Bucks?"];
    const el = document.getElementById('hero-typewriter');
    if (!el) return;
    let i = 0;
    let charIdx = roles[0].length;
    let isDeleting = true;

    function type() {
        const text = roles[i];
        if (isDeleting) charIdx--;
        else charIdx++;

        el.textContent = text.substring(0, charIdx);

        if (!isDeleting && charIdx === text.length) {
            isDeleting = true;
            setTimeout(type, 2000); // Pause at end of word
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            i = (i + 1) % roles.length;
            setTimeout(type, 500); // Pause before typing next
        } else {
            setTimeout(type, isDeleting ? 50 : 100);
        }
    }
    setTimeout(type, 2000);
})();

// ==========================================
// SOCIAL PROOF TICKER (BOTTOM LEFT)
// ==========================================
let tickerInterval;
const tickerData = [
    { name: "Priya S.", action: "recovered ₹8,500 using", level: "🔥 Furious", icon: "👩🏽" },
    { name: "Alex K.", action: "just created a", level: "☢️ Nuclear", desc: "reminder for $450", icon: "👨🏻‍💻" },
    { name: "Rohit M.", action: "got paid within 12 mins via", level: "😤 Annoyed", icon: "👨🏽" },
    { name: "Sarah L.", action: "used", level: "😇 Gentle", desc: "to collect £50", icon: "👩🏼" },
    { name: "Vedant", action: "just shared a", level: "🔥 Furious", desc: "reminder on WhatsApp", icon: "😎" },
    { name: "Anonymous", action: "recovered a debt from 2021!", level: "☢️ Nuclear", icon: "🕵️" },
];

function showNextTicker() {
    const ticker = document.getElementById('social-ticker');
    if(!ticker) return;
    
    // Pick random target
    const target = tickerData[Math.floor(Math.random() * tickerData.length)];
    
    document.getElementById('ticker-avatar').textContent = target.icon;
    document.getElementById('ticker-name').textContent = target.name;
    
    let textHTML = `${target.action} <span style="font-weight:700; color:var(--text-primary);">${target.level}</span>`;
    if(target.desc) textHTML += ` ${target.desc}`;
    document.getElementById('ticker-text').innerHTML = textHTML;
    
    // Ensure display 
    ticker.style.display = 'block';
    
    // Animate resetting
    ticker.style.animation = 'none';
    ticker.offsetHeight; /* trigger reflow */
    ticker.style.animation = null; 

    // Hide after 6 seconds
    setTimeout(() => {
        ticker.style.display = 'none';
    }, 6000);
}

function closeTicker() {
    document.getElementById('social-ticker').style.display = 'none';
}

function startTicker() {
    if(tickerInterval) clearInterval(tickerInterval);
    setTimeout(showNextTicker, 3000); // Show first quickly
    tickerInterval = setInterval(showNextTicker, 15000); // Then every 15s
}


// ==========================================
// NAVBAR & SCROLL REVEAL
// ==========================================
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
});

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

function initScrollReveal() {
    document.querySelectorAll('.animate-in').forEach(el => {
        el.classList.remove('visible');
        revealObserver.observe(el);
    });
}

function animateCounters() {
    document.querySelectorAll('.stat-num[data-count]').forEach(el => {
        const target = parseInt(el.dataset.count);
        const duration = 2500;
        const start = performance.now();
        
        function tick(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            el.textContent = Math.floor(target * eased).toLocaleString();
            if (progress < 1) requestAnimationFrame(tick);
            else el.textContent = target.toLocaleString();
        }
        requestAnimationFrame(tick);
    });
}

// ==========================================
// NAVIGATION SYSTEM
// ==========================================
function showSection(id, scrollToTop = true) {
    const targetSection = document.getElementById(id + '-section');
    if (!targetSection) return;

    if (targetSection.classList.contains('hidden')) {
        document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
        targetSection.classList.remove('hidden');
    }
    
    if (scrollToTop) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // View behavior rules
    if (id === 'landing') {
        setTimeout(() => { initScrollReveal(); animateCounters(); }, 100);
        startTicker();
    } else {
        clearInterval(tickerInterval); // kill ticker outside landing
        if(document.getElementById('social-ticker')) document.getElementById('social-ticker').style.display='none';
    }
}

// App Initialization
document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('v-date');
    if (dateInput) {
        // Default to a week ago to guilt trip them instantly
        const d = new Date(); d.setDate(d.getDate() - 7);
        dateInput.value = d.toISOString().split('T')[0];
    }
    checkHash();
});

window.addEventListener('hashchange', checkHash);

function checkHash() {
    const hash = window.location.hash;
    if (hash.startsWith('#r=')) {
        try {
            const data = JSON.parse(decodeURIComponent(atob(hash.substring(3))));
            if (data && data.a) {
                // If debtor visits the link, directly show reminder
                document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
                document.getElementById('reminder-section').classList.remove('hidden');
                
                // Hide main global CTA's to keep them focused on paying
                if(document.getElementById('navbar')) document.getElementById('navbar').style.display = 'none';
                if(document.getElementById('mobile-sticky-cta')) document.getElementById('mobile-sticky-cta').style.display = 'none';

                renderReminder(data);
                return;
            }
        } catch (e) { console.error('Decode error:', e); }
    } else if (hash === '#how' || hash === '#testimonials' || hash === '#shame') {
        if (document.getElementById('landing-section').classList.contains('hidden')) {
            showSection('landing', false);
        }
        return;
    }
    
    // Fallback to landing
    if(document.getElementById('navbar')) document.getElementById('navbar').style.display = 'flex';
    showSection('landing');
}

function handleNavClick(e, targetSectionId, anchorId) {
    e.preventDefault();
    if (document.getElementById(targetSectionId + '-section').classList.contains('hidden')) {
        showSection(targetSectionId, false);
    }
    
    setTimeout(() => {
        const el = document.getElementById(anchorId);
        if (el) {
            const yOffset = -80; // fixed navbar offset
            const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
        window.history.pushState(null, null, '#' + anchorId);
    }, 50);
}

function goHome() {
    if(document.getElementById('navbar')) document.getElementById('navbar').style.display = 'flex';
    if (window.location.hash !== '') {
        window.history.pushState("", document.title, window.location.pathname + window.location.search);
    }
    showSection('landing');
}

// ==========================================
// MULTI-STEP FORM VALIDATION
// ==========================================
function goStep(num) {
    if (num === 2) {
        const from = document.getElementById('v-from');
        const to = document.getElementById('v-to');
        if (!from.value.trim()) { shake(from); return; }
        if (!to.value.trim()) { shake(to); return; }
    }
    if (num === 3) {
        const amt = document.getElementById('v-amt');
        const reason = document.getElementById('v-reason');
        if (!amt.value || parseFloat(amt.value) <= 0) { shake(amt); return; }
        if (!reason.value.trim()) { shake(reason); return; }
    }
    
    document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
    document.getElementById('step-' + num).classList.add('active');
    
    updateProgress(num);
}

function updateProgress(step) {
    for (let i = 1; i <= 3; i++) {
        const el = document.getElementById('prog-' + i);
        el.classList.remove('active', 'done');
        if (i < step) el.classList.add('done');
        if (i === step) el.classList.add('active');
    }
    const fill1 = document.getElementById('prog-fill');
    const fill2 = document.getElementById('prog-fill-2');
    fill1.style.width = step >= 2 ? '100%' : '0%';
    fill2.style.width = step >= 3 ? '100%' : '0%';
}

function shake(el) {
    el.classList.remove('form-error');
    void el.offsetWidth; // reflow
    el.classList.add('form-error');
    el.focus();
}

// ==========================================
// GENERATOR ENGINE
// ==========================================
let generatedData = null;

async function generate() {
    const btn = document.getElementById('generate-btn');
    if (btn) {
        btn.innerHTML = '⏳ Processing Debt Data...';
        btn.disabled = true;
    }

    generatedData = {
        f: document.getElementById('v-from').value.trim(),
        t: document.getElementById('v-to').value.trim(),
        c: document.getElementById('v-cur').value,
        a: parseFloat(document.getElementById('v-amt').value),
        w: document.getElementById('v-reason').value.trim(),
        d: document.getElementById('v-date').value,
        p: document.getElementById('v-pay').value.trim(),
        s: parseInt(document.querySelector('input[name="vsass"]:checked').value),
        l: document.getElementById('v-lang') ? document.getElementById('v-lang').value : 'en'
    };
    
    const encoded = btoa(encodeURIComponent(JSON.stringify(generatedData)));
    const cacheBust = "?v=" + new Date().getTime().toString(36);
    // Base URL setup
    let baseURL = window.location.href.split('?')[0].split('#')[0];
    if(!baseURL.endsWith('/')) {
        const parts = baseURL.split('/');
        if(parts[parts.length-1].includes('.')) {
            parts.pop(); // remove index.html
            baseURL = parts.join('/') + '/';
        }
    }
    
    const longLink = baseURL + cacheBust + '#r=' + encoded;
    
    // Local fallback 
    document.getElementById('res-link').value = longLink;
    document.getElementById('res-t').textContent = generatedData.t;

    // Advanced Shortener fallback using is.gd
    const shortenBackground = async () => {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3500); 

            const response = await fetch("https://is.gd/create.php?format=simple&url=" + encodeURIComponent(longLink), {
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (response.ok) {
                const short = await response.text();
                if (short.startsWith('http')) {
                    document.getElementById('res-link').value = short;
                }
            }
        } catch(e) {
            console.warn("Shortener failed/timed out, using long link.");
        }
    };
    
    // Don't wait for shortener
    shortenBackground();
    
    setTimeout(() => {
        if (btn) {
            btn.innerHTML = '🚀 Generate Link';
            btn.disabled = false;
        }
        showSection('result');
        launchConfetti();
    }, 800); // Add a small fake delay to make it look like a heavyweight compilation process
}

function copyLink() {
    const input = document.getElementById('res-link');
    const btn = document.getElementById('copy-btn');
    navigator.clipboard.writeText(input.value).then(() => {
        btn.textContent = '✓ Copied!';
        setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
    }).catch(() => {
        input.select();
        document.execCommand('copy');
        btn.textContent = '✓ Copied!';
        setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
    });
}

function preview() {
    if (generatedData) {
        if(document.getElementById('navbar')) document.getElementById('navbar').style.display = 'none';
        renderReminder(generatedData);
        showSection('reminder');
    }
}

function demo() {
    generatedData = {
        f: "Management", t: "Your Name", c: "₹", a: 5000,
        w: "Goa trip flights + accommodation", d: "2026-02-01", p: "", s: 5, l: 'en'
    };
    
    const origHash = window.location.hash;
    preview();
    
    // If they were on demo, allow back
    const footer = document.querySelector('.reminder-footer');
    if(!document.getElementById('demo-back-btn') && footer) {
        const backBtn = document.createElement('button');
        backBtn.id = 'demo-back-btn';
        backBtn.className = 'btn btn-ghost';
        backBtn.style.marginTop = '12px';
        backBtn.textContent = '← Exit Demo';
        backBtn.onclick = () => {
            if(document.getElementById('navbar')) document.getElementById('navbar').style.display = 'flex';
            showSection('landing');
        };
        footer.appendChild(backBtn);
    }
}

// ==========================================
// VIRAL SHARE TEXTS
// ==========================================
function shareWhatsApp() {
    const link = document.getElementById('res-link').value;
    const s = generatedData.s;
    let text = '';
    
    if (s <= 2) {
        text = `Hey ${generatedData.t}! 😊\n\nJust a tiny little reminder about that ${generatedData.c}${generatedData.a} for the ${generatedData.w}.\n\nYour official invoice is here 👇\n${link}\n\nNo rush! ...but maybe a little rush 😅💸`;
    } else if (s <= 3) {
        text = `${generatedData.t}... we need to have a chat. 😤\n\n${generatedData.c}${generatedData.a} for ${generatedData.w}.\n\nYour personalized debt collection page is live 👇\n${link}\n\nThe guilt-o-meter is watching you. ⏰`;
    } else if (s === 4) {
        text = `🔥 ATTENTION: ${generatedData.t.toUpperCase()} 🔥\n\n📋 DEBT COLLECTION NOTICE\n💰 Amount: ${generatedData.c}${generatedData.a}\n📝 For: ${generatedData.w}\n⚠️ Status: OVERDUE\n\nClear your dues here 👇\n${link}\n\nPay now before I escalate this to the family group chat. 😤`;
    } else {
        text = `☢️ FINAL WARNING ☢️\n\nTo: ${generatedData.t.toUpperCase()}\nFrom: The Office of ${generatedData.f}\n\n📋 CASE NO #${Math.floor(Math.random()*9000)+1000}\n💰 Outstanding: ${generatedData.c}${generatedData.a}\n📝 Subject: ${generatedData.w}\n⏰ Status: CRITICAL\n\n👇 YOUR COLLECTION PAGE:\n${link}\n\nYour lack of response has been noted. Screenshots are archived. There is no escape. 😈`;
    }
    
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
}

function shareTwitter() {
    const link = document.getElementById('res-link').value;
    const texts = [
        `Someone owes me ${generatedData.c}${generatedData.a} so I built them a passive-aggressive website. Drama level: ${['Gentle','Passive','Annoyed','FURIOUS','☢️ NUCLEAR'][generatedData.s - 1]}. 😤💸 ${link}`,
        `POV: Your friend is dodging repayment, so you send them a "FINAL NOTICE" page with a guilt-meter and countdown clock 💀😤 ${link}`,
        `I will physically not rest until I recover my ${generatedData.c}${generatedData.a}. Consider this an official warning. 🔥 ${link}`
    ];
    const text = texts[Math.floor(Math.random() * texts.length)];
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
}

function shareEmail() {
    const link = document.getElementById('res-link').value;
    const subject = `⚠️ URGENT: Outstanding Balance of ${generatedData.c}${generatedData.a} — Action Required`;
    const body = `Dear ${generatedData.t},\n\nConsider this email a formal reminder regarding your outstanding balance of ${generatedData.c}${generatedData.a} (re: ${generatedData.w}).\n\nAn official debt collection portal has been generated for you to review and clear your dues:\n${link}\n\nPlease address this immediately to prevent further (passive-aggressive) escalation.\n\nWarm regards,\n${generatedData.f}\nDebt Recovery Department`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
}

function shareTelegram() {
    const link = document.getElementById('res-link').value;
    const text = `⚠️ DEBT NOTICE for ${generatedData.t}: ${generatedData.c}${generatedData.a} for ${generatedData.w}. Your official collection page has been dispatched 👇`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(text)}`, '_blank');
}

// ==========================================
// CONFETTI
// ==========================================
function launchConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const pieces = [];
    const colors = ['#f5c518', '#ff453a', '#bf5af2', '#64d2ff', '#30d158', '#fff'];
    
    for (let i = 0; i < 150; i++) {
        pieces.push({
            x: canvas.width / 2 + (Math.random() - 0.5) * 300,
            y: canvas.height / 2 + 50,
            size: Math.random() * 8 + 6,
            color: colors[Math.floor(Math.random() * colors.length)],
            vx: (Math.random() - 0.5) * 20,
            vy: -(Math.random() * 20 + 8),
            gravity: 0.5,
            rotation: Math.random() * 360,
            rotSpeed: (Math.random() - 0.5) * 15,
            alpha: 1
        });
    }
    
    let frame = 0;
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let alive = false;
        
        pieces.forEach(p => {
            p.vy += p.gravity;
            p.x += p.vx;
            p.y += p.vy;
            p.rotation += p.rotSpeed;
            p.alpha -= 0.007; // scale down
            
            if (p.alpha > 0) {
                alive = true;
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation * Math.PI / 180);
                ctx.globalAlpha = Math.max(0, p.alpha);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
                ctx.restore();
            }
        });
        
        if (alive && frame < 200) {
            frame++;
            requestAnimationFrame(draw);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
    draw();
}

// ==========================================
// GUILT ENHANCER (What you could've bought)
// ==========================================
const purchasableItems = [
    { min: 0, max: 10, emoji: '☕', text: 'coffees' },
    { min: 0, max: 15, emoji: '🌮', text: 'tacos' },
    { min: 5, max: 30, emoji: '🍕', text: 'pizza slices' },
    { min: 5, max: 25, emoji: '🎵', text: 'months of Spotify' },
    { min: 10, max: 50, emoji: '📚', text: 'books' },
    { min: 10, max: 50, emoji: '🎬', text: 'movie tickets' },
    { min: 20, max: 80, emoji: '🎮', text: 'game passes' },
    { min: 30, max: 100, emoji: '🧸', text: 'teddy bears' },
    { min: 50, max: 200, emoji: '👟', text: 'cool sneakers' },
    { min: 100, max: 500, emoji: '✈️', text: 'budget flights' },
    { min: 200, max: 1000, emoji: '📱', text: 'gadgets' },
    { min: 500, max: 5000, emoji: '💻', text: 'laptops' },
    { min: 1000, max: 10000, emoji: '🏖️', text: 'goa trips' },
    { min: 5000, max: 100000, emoji: '🚗', text: 'used cars' },
];

function getCouldHaveBought(amount) {
    return purchasableItems
        .filter(item => amount >= item.min && amount <= item.max * 6)
        .sort(() => Math.random() - 0.5)
        .slice(0, 4)
        .map(item => {
            const count = Math.max(1, Math.floor(amount / ((item.min + item.max) / 2)));
            return { emoji: item.emoji, text: `${count}× ${item.text}` };
        });
}

// ==========================================
// PAYMENT LINK GENERATOR
// ==========================================
function getSmartPaymentLink(payString, amount, payeeName) {
    if(!payString) return "#";
    let l = payString.trim();
    
    // Smart detect bare UPI ID (has @, no slashes, not an email link)
    if (l.includes('@') && !l.includes('/') && !l.startsWith('mailto:')) {
        return `upi://pay?pa=${l}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR`;
    } else if (!l.startsWith('http') && !l.startsWith('upi://')) {
        return 'https://' + l;
    }
    return l;
}

// ==========================================
// RENDER VIEWER LOGIC
// ==========================================
function renderReminder(data) {
    const card = document.getElementById('rem-card');
    if (window.doomInterval) clearInterval(window.doomInterval);
    
    card.className = `reminder-container glass-card theme-${data.s}`;
    
    const borrowDate = new Date(data.d);
    const now = new Date();
    const diffDays = Math.max(0, Math.floor((now - borrowDate) / (1000 * 60 * 60 * 24)));
    
    // Fake interest calc (Gamified)
    const intRate = 0.01 * data.s; 
    let finalAmount = (data.a * Math.pow(1 + intRate, diffDays)).toFixed(2);
    // Overriding the amount logic slightly. If it's over a week old, 
    // we make the red text shake and show "Interest Accruing".
    
    const lang = data.l || 'en';
    const T = (window.i18n && window.i18n[lang]) ? window.i18n[lang] : window.i18n['en'];

    const format = (str) => {
        return str.replace(/{t}/g, data.t.toUpperCase())
                  .replace(/{w}/g, data.w)
                  .replace(/{d}/g, diffDays);
    };

    const s = data.s;
    const stamp = T[`s${s}_stamp`];
    const greeting = format(T[`s${s}_greet`]);
    const warn = T[`s${s}_warn`];
    const guiltText = T[`s${s}_guilt`];

    // Nuclear DOOM clock logic
    if (s === 5) {
        let timeLeft = 24 * 3600; // 24 hours
        // Replace timestamp if exists
        let warnContainer = document.getElementById('r-warn');
        if(!warnContainer.querySelector('#doom-clock')) {
             warnContainer.innerHTML += `<br><div class="countdown-timer" id="doom-clock">24:00:00:00</div>`;
        }
        
        window.doomInterval = setInterval(() => {
            const el = document.getElementById('doom-clock');
            if (!el) return clearInterval(window.doomInterval);
            timeLeft -= 0.05;
            if (timeLeft <= 0) timeLeft = 0;
            const h = Math.floor(timeLeft / 3600);
            const m = Math.floor((timeLeft % 3600) / 60);
            const sec = Math.floor(timeLeft % 60);
            const ms = Math.floor((timeLeft % 1) * 100);
            el.textContent = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}:${ms.toString().padStart(2, '0')}`;
        }, 50);
    } else {
        const doomClock = document.getElementById('doom-clock');
        if(doomClock) doomClock.remove();
    }
    
    document.getElementById('r-stamp').textContent = stamp;
    document.getElementById('r-greet').innerHTML = greeting;
    document.getElementById('r-amt').textContent = `${data.c}${data.a.toLocaleString()}`;
    document.getElementById('r-from').textContent = data.f;
    
    // Store globally for 5% extension calc
    window.currentDebtAmount = data.a;
    window.currentDebtCurrency = data.c;
    window.currentPayee = data.f;
    window.currentPaymentLink = data.p;
    
    // Update Modal Data
    const penaltyAmount = (data.a * 0.05).toFixed(2);
    const modalSpan = document.getElementById('ext-pay-amount');
    if(modalSpan) modalSpan.textContent = `${data.c}${penaltyAmount}`;
    
    // Set payment link for the 5% button if available
    const extPayBtn = document.getElementById('ext-pay-btn');
    if (extPayBtn) {
        if(data.p) {
            extPayBtn.href = getSmartPaymentLink(data.p, penaltyAmount, data.f);
            extPayBtn.style.display = 'flex'; // show
        } else {
            // No payment link? Just use standard WhatsApp or empty
            extPayBtn.href = "#";
            extPayBtn.style.display = 'none'; 
            // Also enable the submission button directly since they can't natively click a payment link
            if(!data.p) {
                enablePromiseButton();
            }
        }
    }

    if (diffDays > 0) {
        document.getElementById('r-int').innerHTML = `${T.int_with} <strong style="text-shadow: 0 0 10px rgba(245, 197, 24, 0.5);">${data.c}${parseFloat(finalAmount).toLocaleString()}</strong>`;
        document.getElementById('r-days').textContent = T.overdue_days.replace('{d}', diffDays);
    } else {
        document.getElementById('r-int').textContent = T.int_clock;
        document.getElementById('r-days').textContent = T.due_today;
        document.getElementById('r-days').classList.remove('status-overdue');
        document.getElementById('r-days').style.color = "var(--accent-green)";
    }
    
    document.getElementById('r-reason').textContent = data.w;
    document.getElementById('r-date').textContent = borrowDate.toLocaleDateString(lang, { year: 'numeric', month: 'long', day: 'numeric' });
    
    // Guilt meter
    const maxDays = 90;
    let guiltPct = Math.min(100, Math.max(10, (diffDays / maxDays) * 100) + (data.s * 7));
    if (guiltPct >= 100) guiltPct = 100;
    
    setTimeout(() => {
        document.getElementById('r-guilt-bar').style.width = `${guiltPct}%`;
    }, 500);
    
    let tickerCount = 0;
    let tickerInterval = setInterval(() => {
        tickerCount += 3;
        if(tickerCount >= guiltPct) {
            tickerCount = guiltPct;
            clearInterval(tickerInterval);
        }
        document.getElementById('r-guilt-pct').textContent = Math.round(tickerCount) + '%';
    }, 30);
    
    document.getElementById('r-guilt-text').textContent = guiltText;
    document.getElementById('r-warn').textContent = warn;

    // Apply translations to static labels (Fallback logic included)
    ['out_bal', 'desc', 'date_inc', 'status', 'creditor', 'could_have', 'sev_index', 'settle_btn'].forEach(k => {
        const el = document.getElementById('lbl-' + k);
        if(el && T[k]) el.textContent = T[k];
    });
    
    // What you could've bought
    const items = getCouldHaveBought(data.a);
    const couldContainer = document.getElementById('r-could-items');
    const couldSection = document.getElementById('r-could-section');
    if (items.length > 0) {
        couldSection.style.display = 'block';
        couldContainer.innerHTML = items.map(item =>
            `<div class="could-item">
                <span class="could-item-emoji">${item.emoji}</span>
                <span class="could-item-text">${item.text}</span>
            </div>`
        ).join('');
    } else {
        couldSection.style.display = 'none';
    }
    
    // Pay button configuration
    const payBtn = document.getElementById('r-pay');
    if (data.p) {
        payBtn.href = getSmartPaymentLink(data.p, data.a, data.f);
        payBtn.style.display = 'inline-flex';
    } else {
        // Hide primary settle bound to a link
        payBtn.style.display = 'none';
    }
    
    // Re-init tilt if script exists
    if (window.VanillaTilt) {
        VanillaTilt.init(document.querySelectorAll(".glass-card"), { 
            max: 5, speed: 400, perspective: 1000, glare: true, "max-glare": 0.2
        });
    }
}

// ==========================================
// 5% EXTENSION PROMISE LOGIC
// ==========================================
let hasClicked5Percent = false;

function enablePromiseButton() {
    hasClicked5Percent = true;
    const btn = document.getElementById('submit-promise-btn');
    if(btn) {
        btn.disabled = false;
        btn.style.opacity = '1';
        btn.style.cursor = 'pointer';
        // Add a flashy effect to show it's enabled
        btn.classList.add('btn-cta-pulse');
        document.getElementById('ext-warning').style.display = 'none';
    }
}

function submitPromise() {
    // If there's a payment link but they haven't paid/clicked 5% yet
    if (window.currentPaymentLink && !hasClicked5Percent) {
        const warn = document.getElementById('ext-warning');
        warn.style.display = 'block';
        shake(warn);
        return;
    }

    const reason = document.getElementById('p-reason').value.trim();
    const date = document.getElementById('p-date').value;
    
    if (!reason || !date) {
        alert("Hold up! You must provide BOTH a valid reason and a date to plead your case.");
        return;
    }
    
    // Calculate the numbers
    const totalAmount = window.currentDebtAmount || 0;
    const currency = window.currentDebtCurrency || '';
    const creditor = window.currentPayee || 'Your Creditor';
    
    const penaltyAmount = (totalAmount * 0.05).toFixed(2);
    const remainingAmount = (totalAmount - penaltyAmount).toFixed(2);
    
    const promiseDate = new Date(date).toLocaleDateString();
    
    let text = `Hey ${creditor}, I just saw your official "WhereMyMoney" debt notice for ${currency}${totalAmount}.\n\n`;
    
    if(window.currentPaymentLink) {
        text += `💸 I have just sent you ${currency}${penaltyAmount} (the 5% penalty) as a gesture of goodwill.\n\n`;
    }
    
    text += `I can't pay the rest right now because: ${reason}. 😔\n\nI solemnly swear to pay the remaining ${currency}${remainingAmount} by ${promiseDate}. Please approve my extension! 🙏`;
    
    document.getElementById('postpone-modal').classList.remove('show');
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
}

// Reset flag when modal opens
document.querySelector('[onclick="document.getElementById(\'postpone-modal\').classList.add(\'show\')"]').addEventListener('click', () => {
    hasClicked5Percent = false;
    const btn = document.getElementById('submit-promise-btn');
    if(btn && window.currentPaymentLink) {
        btn.style.opacity = '0.5';
        btn.style.cursor = 'not-allowed';
        btn.classList.remove('btn-cta-pulse');
    }
});

// ==========================================
// CHAI WIDGET LOGIC
// ==========================================
function toggleChai() {
    document.getElementById('chai-card').classList.toggle('show');
}

function copyUPI(e) {
    if (e) e.stopPropagation();
    const upi = document.getElementById('upi-id').textContent;
    const btn = e.target;
    navigator.clipboard.writeText(upi).then(() => {
        const oldText = btn.textContent;
        btn.textContent = '✓ Copied';
        setTimeout(() => { btn.textContent = oldText; }, 2000);
    });
}

// Close chai card when clicking outside
document.addEventListener('click', (e) => {
    const float = document.querySelector('.chai-float');
    if (float && !float.contains(e.target)) {
        const card = document.getElementById('chai-card');
        if(card) card.classList.remove('show');
    }
});
