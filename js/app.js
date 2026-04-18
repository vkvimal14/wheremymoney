/* WhereMyMoney — Premium App Logic */

// ==========================================
// PARTICLES BACKGROUND (Elegant Float)
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
            size: Math.random() * 1.5 + 0.3,
            speedY: -(Math.random() * 0.2 + 0.05),
            alpha: Math.random() * 0.3 + 0.1,
            drift: (Math.random() - 0.5) * 0.1
        };
    }
    
    function init() {
        resize();
        particles = [];
        const count = Math.min(70, Math.floor((canvas.width * canvas.height) / 18000));
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

// ==========================================
// CURSOR GLOW
// ==========================================
(function initCursorGlow() {
    const glow = document.getElementById('cursor-glow');
    if (!glow) return;
    let mx = 0, my = 0;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    function update() {
        glow.style.left = mx + 'px';
        glow.style.top = my + 'px';
        requestAnimationFrame(update);
    }
    update();
})();

// ==========================================
// NAVBAR SCROLL
// ==========================================
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ==========================================
// SCROLL REVEAL
// ==========================================
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

// ==========================================
// STAT COUNTERS
// ==========================================
function animateCounters() {
    document.querySelectorAll('.stat-num[data-count]').forEach(el => {
        const target = parseInt(el.dataset.count);
        const duration = 2000;
        const start = performance.now();
        
        function tick(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            el.textContent = Math.floor(target * eased).toLocaleString();
            if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    });
}

// ==========================================
// NAVIGATION
// ==========================================
function showSection(id) {
    document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
    const section = document.getElementById(id + '-section');
    if (section) section.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    if (id === 'landing') {
        setTimeout(() => { initScrollReveal(); animateCounters(); }, 100);
    }
}

// ==========================================
// INIT
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('v-date');
    if (dateInput) {
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
                // Hide all, show reminder only (clean view for debtors)
                document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
                document.getElementById('reminder-section').classList.remove('hidden');
                renderReminder(data);
                return;
            }
        } catch (e) { console.error('Decode error:', e); }
    }
    showSection('landing');
}

// ==========================================
// FORM HANDLING
// ==========================================
function goStep(num) {
    // Validate before advancing
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
    
    // Update progress bar
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
    void el.offsetWidth;
    el.classList.add('form-error');
    el.focus();
}

// ==========================================
// GENERATE
// ==========================================
let generatedData = null;

async function generate() {
    const btn = document.querySelector('button[onclick="generate()"]');
    if (btn) {
        btn.textContent = '⏳ Compiling...';
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
        s: parseInt(document.querySelector('input[name="vsass"]:checked').value)
    };
    
    const encoded = btoa(encodeURIComponent(JSON.stringify(generatedData)));
    const cacheBust = "?v=" + new Date().getTime().toString(36);
    const longLink = window.location.origin + window.location.pathname + cacheBust + '#r=' + encoded;
    
    let finalLink = longLink;
    try {
        const response = await fetch("https://tinyurl.com/api-create.php?url=" + encodeURIComponent(longLink));
        if (response.ok) {
            finalLink = await response.text();
        }
    } catch(e) {
        console.error("Shortener failed, using long link", e);
    }
    
    document.getElementById('res-link').value = finalLink;
    document.getElementById('res-t').textContent = generatedData.t;
    
    if (btn) {
        btn.textContent = '🚀 Generate Link';
        btn.disabled = false;
    }
    
    showSection('result');
    launchConfetti();
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
        renderReminder(generatedData);
        showSection('reminder');
    }
}

function demo() {
    generatedData = {
        f: "The Management", t: "Jordan", c: "$", a: 500,
        w: "Outstanding sushi dinner split", d: "2026-03-01", p: "", s: 5
    };
    preview();
}

// ==========================================
// SHARE FUNCTIONS (Viral-Optimized Messages)
// ==========================================
function shareWhatsApp() {
    const link = document.getElementById('res-link').value;
    const sassLevel = generatedData.s;
    let text = '';
    
    if (sassLevel <= 2) {
        text = `Hey ${generatedData.t}! 😊\n\nJust a friendly little reminder about that ${generatedData.c}${generatedData.a} for the ${generatedData.w}.\n\nI made you a special page 👇\n${link}\n\nNo rush! ...okay maybe a little rush 😅`;
    } else if (sassLevel <= 3) {
        text = `${generatedData.t}... we need to talk. 😤\n\n${generatedData.c}${generatedData.a} for ${generatedData.w}.\n\nI've created an official reminder page for you 👇\n${link}\n\nThe guilt-meter is watching. ⏰`;
    } else if (sassLevel === 4) {
        text = `🔥 ATTENTION: ${generatedData.t.toUpperCase()} 🔥\n\n📋 DEBT COLLECTION NOTICE\n💰 Amount: ${generatedData.c}${generatedData.a}\n📝 For: ${generatedData.w}\n⚠️ Status: OVERDUE\n\nYour official reminder page 👇\n${link}\n\nPay now before this goes to the group chat. 😤`;
    } else {
        text = `⚠️ FINAL NOTICE ⚠️\n\nTo: ${generatedData.t.toUpperCase()}\nFrom: The Office of ${generatedData.f}\n\n📋 CASE FILE #${Math.floor(Math.random() * 9000) + 1000}\n💰 Outstanding: ${generatedData.c}${generatedData.a}\n📝 Subject: ${generatedData.w}\n⏰ Status: CRITICAL — LEGAL ESCALATION PENDING\n\n👇 YOUR DEDICATED COLLECTION PAGE:\n${link}\n\nScreenshots have been archived. Group chats have been notified. There is no escape. ☢️`;
    }
    
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
}

function shareTwitter() {
    const link = document.getElementById('res-link').value;
    const texts = [
        `Someone owes me ${generatedData.c}${generatedData.a} so I built them an entire website about it. The drama level is set to ${['Gentle','Passive','Annoyed','FURIOUS','☢️ NUCLEAR'][generatedData.s - 1]}. 😤💸`,
        `POV: Your friend won't pay you back so you create an entire passive-aggressive landing page with a guilt-o-meter and countdown timer 💀😤`,
        `I just sent my friend a "FINAL NOTICE: LEGAL ESCALATION PENDING" page because they owe me ${generatedData.c}${generatedData.a}. This is what happens when you don't pay up 🔥`
    ];
    const text = texts[Math.floor(Math.random() * texts.length)];
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(link)}`, '_blank');
}

function shareEmail() {
    const link = document.getElementById('res-link').value;
    const subject = `⚠️ Outstanding Balance: ${generatedData.c}${generatedData.a} — Action Required`;
    const body = `Dear ${generatedData.t},\n\nThis email serves as a formal reminder regarding the outstanding balance of ${generatedData.c}${generatedData.a} for ${generatedData.w}.\n\nA dedicated collection page has been prepared for your review:\n${link}\n\nPlease resolve this matter at your earliest convenience.\n\nRegards,\n${generatedData.f}\nDebt Recovery Department`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
}

function shareTelegram() {
    const link = document.getElementById('res-link').value;
    const text = `⚠️ DEBT NOTICE for ${generatedData.t}: ${generatedData.c}${generatedData.a} for ${generatedData.w}. Your collection page is ready 👇`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(text)}`, '_blank');
}

// ==========================================
// CONFETTI EFFECT
// ==========================================
function launchConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const pieces = [];
    const colors = ['#f5c518', '#ff453a', '#bf5af2', '#64d2ff', '#30d158', '#fff'];
    
    for (let i = 0; i < 120; i++) {
        pieces.push({
            x: canvas.width / 2 + (Math.random() - 0.5) * 200,
            y: canvas.height / 2,
            size: Math.random() * 8 + 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            vx: (Math.random() - 0.5) * 16,
            vy: -(Math.random() * 18 + 4),
            gravity: 0.4,
            rotation: Math.random() * 360,
            rotSpeed: (Math.random() - 0.5) * 10,
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
            p.alpha -= 0.008;
            
            if (p.alpha > 0) {
                alive = true;
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation * Math.PI / 180);
                ctx.globalAlpha = Math.max(0, p.alpha);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
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
// WHAT YOU COULD'VE BOUGHT
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
    { min: 50, max: 200, emoji: '👕', text: 'nice shirts' },
    { min: 100, max: 500, emoji: '✈️', text: 'budget flights' },
    { min: 200, max: 1000, emoji: '📱', text: 'budget phones' },
    { min: 500, max: 5000, emoji: '💻', text: 'laptops' },
    { min: 1000, max: 10000, emoji: '🏖️', text: 'vacation trips' },
    { min: 5000, max: 100000, emoji: '🚗', text: 'used cars' },
];

function getCouldHaveBought(amount) {
    return purchasableItems
        .filter(item => amount >= item.min && amount <= item.max * 5)
        .sort(() => Math.random() - 0.5)
        .slice(0, 4)
        .map(item => {
            const count = Math.max(1, Math.floor(amount / ((item.min + item.max) / 2)));
            return { emoji: item.emoji, text: `${count}× ${item.text}` };
        });
}

// ==========================================
// RENDER REMINDER
// ==========================================
function renderReminder(data) {
    const card = document.getElementById('rem-card');
    if (window.doomInterval) clearInterval(window.doomInterval);
    
    card.className = `reminder-container glass-card theme-${data.s}`;
    
    const borrowDate = new Date(data.d);
    const now = new Date();
    const diffDays = Math.max(0, Math.floor((now - borrowDate) / (1000 * 60 * 60 * 24)));
    const intRate = 0.01 * data.s;
    const finalAmount = (data.a * Math.pow(1 + intRate, diffDays)).toFixed(2);
    
    let greeting = "", stamp = "", guiltText = "", warn = "";
    
    switch (data.s) {
        case 1:
            greeting = `Hello <strong>${data.t}</strong>! 👋 Hope everything is wonderful. Just a gentle, friendly reminder regarding the <em>${data.w}</em>. Totally no rush — whenever you get a chance! 😊`;
            stamp = "FRIENDLY NUDGE";
            warn = "Whenever you have a moment. No rush at all!";
            guiltText = "Vibe check: Positive. Zero guilt applied.";
            break;
        case 2:
            greeting = `Hey <strong>${data.t}</strong>... 😏 I was reviewing my recent expenses and noticed a slight outstanding balance for the <em>${data.w}</em>. I'm <em>sure</em> it simply slipped your mind! ...Right?`;
            stamp = "MILDLY UNPAID";
            warn = "It would be highly appreciated if this could be cleared up soon.";
            guiltText = "A minor blemish on your otherwise pristine reputation.";
            break;
        case 3:
            greeting = `<strong>${data.t}</strong>. 😤 It has been <strong>${diffDays} days</strong>. I've maintained my patience regarding the <em>${data.w}</em>, but we're well past the point of "oh I forgot." It's time to settle up.`;
            stamp = "UNPAID";
            warn = "The patience window is closing. Settle the balance now.";
            guiltText = "Conscience tracker actively pinging your ledger.";
            break;
        case 4:
            greeting = `Are we running a charity here, <strong>${data.t.toUpperCase()}</strong>?! 🔥 This is the <strong>FINAL standard warning</strong> concerning the <em>${data.w}</em> balance. I've been MORE than patient. My saint era is officially OVER.`;
            stamp = "OVERDUE 🔥";
            warn = "IMMEDIATE RESOLUTION REQUIRED to prevent awkward group chat discussions.";
            guiltText = "SEVERITY MAXIMUM. Reputation impairment imminent.";
            break;
        case 5:
            greeting = `⚠️ <strong style="font-size: 1.15rem;">FINAL NOTICE — ESCALATION PENDING</strong> ⚠️<br><br>The outstanding balance for <strong>${data.t.toUpperCase()}</strong> regarding <em>[${data.w}]</em> has been flagged for <strong>IMMEDIATE COLLECTION</strong>.<br><br><div class="countdown-timer" id="doom-clock">24:00:00:00</div><br>Failure to remit payment within the designated timeframe may result in severe social and financial consequences. Screenshots have been archived. Group chats have been warned.`;
            stamp = "FINAL NOTICE";
            warn = "⚠️ DO NOT IGNORE. SETTLE DEBT IMMEDIATELY.";
            guiltText = "YOUR FINANCIAL AND SOCIAL STANDING IS AT CRITICAL RISK.";
            
            let timeLeft = 24 * 3600;
            window.doomInterval = setInterval(() => {
                const el = document.getElementById('doom-clock');
                if (!el) return clearInterval(window.doomInterval);
                timeLeft -= 0.05;
                if (timeLeft <= 0) timeLeft = 0;
                const h = Math.floor(timeLeft / 3600);
                const m = Math.floor((timeLeft % 3600) / 60);
                const s = Math.floor(timeLeft % 60);
                const ms = Math.floor((timeLeft % 1) * 100);
                el.textContent = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}:${ms.toString().padStart(2, '0')}`;
            }, 50);
            break;
    }
    
    document.getElementById('r-stamp').textContent = stamp;
    document.getElementById('r-greet').innerHTML = greeting;
    document.getElementById('r-amt').textContent = `${data.c}${data.a.toLocaleString()}`;
    document.getElementById('r-from').textContent = data.f;
    
    if (diffDays > 0) {
        document.getElementById('r-int').innerHTML = `With emotional interest: <strong>${data.c}${parseFloat(finalAmount).toLocaleString()}</strong>`;
        document.getElementById('r-days').textContent = `Overdue by ${diffDays} days`;
    } else {
        document.getElementById('r-int').textContent = "Clock starts ticking today.";
        document.getElementById('r-days').textContent = "Due Today";
    }
    
    document.getElementById('r-reason').textContent = data.w;
    document.getElementById('r-date').textContent = borrowDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    
    // Guilt meter
    const maxDays = 60;
    let guiltPct = Math.min(100, Math.max(10, (diffDays / maxDays) * 100) + (data.s * 5));
    if (guiltPct > 100) guiltPct = 100;
    
    setTimeout(() => {
        document.getElementById('r-guilt-bar').style.width = `${guiltPct}%`;
    }, 300);
    document.getElementById('r-guilt-pct').textContent = Math.round(guiltPct) + '%';
    document.getElementById('r-guilt-text').textContent = guiltText;
    document.getElementById('r-warn').textContent = warn;
    
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
    
    // Pay button
    const payBtn = document.getElementById('r-pay');
    if (data.p) {
        let l = data.p.trim();
        // Smart detect bare UPI ID (has @, no slashes, not an email link)
        if (l.includes('@') && !l.includes('/') && !l.startsWith('mailto:')) {
            l = `upi://pay?pa=${l}&pn=${encodeURIComponent(data.f)}&am=${data.a}&cu=INR`;
        } else if (!l.startsWith('http') && !l.startsWith('upi://')) {
            l = 'https://' + l;
        }
        payBtn.href = l;
        payBtn.style.display = 'inline-flex';
    } else {
        payBtn.style.display = 'none';
    }
    
    // Re-init tilt
    if (window.VanillaTilt) {
        VanillaTilt.init(card, { max: 3, speed: 400, perspective: 1200 });
    }
}
