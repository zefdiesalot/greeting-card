/* =========================================================
   CONFIG — edit everything in this block, leave the rest alone
   ========================================================= */
const CONFIG = {

  // 3–5 multiple choice questions. correctIndex is 0-based.
  quiz: [
    {
      question: "What is your favorite color?",
      options: ["Orange", "Purple", "Green", "Valorant"],
      correctIndex: 1
    },
    {
      question: "What do you call me?",
      options: ["tiger", "bee", "demon"],
      correctIndex: 0
    },
    {
      question: "What am I to you?",
      options: ["rando weirdo get away", "cat+fish", "personal flosser","baba"],
      correctIndex: 3
    },
	 {
      question: "What is your favorite princess?",
      options: ["cindarella","belle", "me(obviously)","ariel"],
      correctIndex: 1
    },
	{
      question: "what song did i promise to perform on our special day?",
      options: ["Can't Take My Eyes Off You", "Never Gonna Give You Up", "thriller", "Violin Concerto in B-Flat Major, Op. 8 No.10 RV 362 La Caccia: I. Allegro", "please don't go" ],
      correctIndex: 0
    },
  ],

  // List every page image you want, in order. Drop the actual files into
  // assets/pages/ using these exact names. Until a file exists, that slot
  // shows a placeholder card with the page number — totally safe to test
  // the whole flow before you have your PNGs ready.
  pages: [
    "assets/pages/page-1.png",
    "assets/pages/page-2.png",
    "assets/pages/page-3.png",
    "assets/pages/page-4.png",
    "assets/pages/page-5.png",
    "assets/pages/page-6.png"
  ],

  // Put your audio file at this path (mp3 or m4a both work in browsers).
  songSrc: "assets/audio/bdaytiff.mp3",
  songTitle: "our song"
};

/* =========================================================
   STATE
   ========================================================= */
let currentQuestion = 0;
let correctCount = 0;
let currentPage = 0;

/* =========================================================
   ELEMENT REFS
   ========================================================= */
const qIndexEl   = document.getElementById('q-index');
const qTotalEl   = document.getElementById('q-total');
const qTextEl    = document.getElementById('q-text');
const qOptionsEl = document.getElementById('q-options');
const qFeedback  = document.getElementById('q-feedback');
const dotsEl     = document.getElementById('progress-dots');
const sealEl     = document.getElementById('seal');
const sealCrack  = document.getElementById('seal-crack');
const quizScene  = document.getElementById('quiz-scene');
const bookScene  = document.getElementById('book-scene');
const bookEl     = document.getElementById('book');
const prevBtn    = document.getElementById('prev-btn');
const nextBtn    = document.getElementById('next-btn');
const pageCurEl  = document.getElementById('page-current');
const pageTotEl  = document.getElementById('page-total');
const songTitleEl= document.getElementById('song-title');
const audioEl    = document.getElementById('song');
const muteBtn    = document.getElementById('mute-btn');
const splashScene = document.getElementById('splash-scene');
const introEl    = document.getElementById('intro-song');

/* =========================================================
   BUTTERFLY CURSOR
   ========================================================= */
const cursorEl = document.getElementById('cursor-butterfly');
document.addEventListener('mousemove', e => {
  cursorEl.style.left = e.clientX + 'px';
  cursorEl.style.top  = e.clientY + 'px';
});
document.addEventListener('mouseleave', () => { cursorEl.style.opacity = '0'; });
document.addEventListener('mouseenter', () => { cursorEl.style.opacity = '1'; });

/* =========================================================
   SPLASH + BALLOONS
   ========================================================= */
const BALLOON_COLORS = ['#E8758A','#A78BFA','#FBBF24','#34D399','#F87171','#60A5FA','#FB923C'];
const BALLOON_SLOTS  = [
  // bottom row
  { left:  '3%', bottom: '14%' },
  { left: '14%', bottom: '20%' },
  { left: '25%', bottom: '13%' },
  { left: '36%', bottom: '21%' },
  { left: '48%', bottom: '15%' },
  { left: '59%', bottom: '20%' },
  { left: '70%', bottom: '13%' },
  { left: '81%', bottom: '19%' },
  { left: '91%', bottom: '14%' },
  // middle row
  { left:  '7%', bottom: '33%' },
  { left: '19%', bottom: '39%' },
  { left: '30%', bottom: '30%' },
  { left: '42%', bottom: '37%' },
  { left: '54%', bottom: '31%' },
  { left: '65%', bottom: '41%' },
  { left: '76%', bottom: '29%' },
  { left: '87%', bottom: '36%' },
  // upper row
  { left: '11%', bottom: '51%' },
  { left: '26%', bottom: '47%' },
  { left: '42%', bottom: '53%' },
  { left: '58%', bottom: '48%' },
  { left: '74%', bottom: '54%' },
  { left: '34%', bottom: '60%' },
  { left: '64%', bottom: '62%' },
];

let balloonsLeft  = BALLOON_SLOTS.length;
let introStarted  = false;
const balloonsWrap = document.getElementById('balloons');

function startIntro() {
  if (introStarted) return;
  introStarted = true;
  introEl.src = 'assets/audio/intro music.mp3';
  introEl.volume = 0.45;
  introEl.play().catch(() => {});
}

function fadeOutIntro() {
  if (introEl.paused) return;
  const tick = setInterval(() => {
    if (introEl.volume > 0.06) {
      introEl.volume = Math.max(0, introEl.volume - 0.06);
    } else {
      introEl.volume = 0;
      introEl.pause();
      clearInterval(tick);
    }
  }, 60);
}

function initSplash() {
  // Animate "happy birthday" letter by letter along the arch
  const archTextPath = document.querySelector('.splash-arch textPath');
  const hbStr = archTextPath.textContent;
  archTextPath.textContent = '';
  [...hbStr].forEach((ch, i) => {
    const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
    tspan.textContent = ch === ' ' ? ' ' : ch;
    if (ch !== ' ') {
      tspan.classList.add('hb-letter');
      tspan.style.animationDelay = `${i * 0.07}s`;
    }
    archTextPath.appendChild(tspan);
  });

  // Animate "my butterfly" letter by letter
  const subEl = document.getElementById('splash-sub');
  const text = subEl.textContent;
  subEl.textContent = '';
  [...text].forEach((ch, i) => {
    const span = document.createElement('span');
    span.className = ch === ' ' ? '' : 'letter';
    span.textContent = ch;
    if (ch !== ' ') span.style.animationDelay = `${2.6 + i * 0.07}s`;
    subEl.appendChild(span);
  });

  BALLOON_SLOTS.forEach((slot, i) => {
    createBalloon(slot, BALLOON_COLORS[i % BALLOON_COLORS.length], i);
  });
}

function createBalloon(slot, color, index) {
  const el = document.createElement('div');
  el.className = 'balloon';
  el.style.left   = slot.left;
  el.style.bottom = slot.bottom;
  el.style.setProperty('--color', color);

  const bobber = document.createElement('div');
  bobber.className = 'balloon-bobber';
  bobber.style.setProperty('--appear-delay', `${(index * 0.14).toFixed(2)}s`);
  bobber.style.setProperty('--bob-dur', `${(2.3 + Math.random() * 1.4).toFixed(1)}s`);

  const body = document.createElement('div');
  body.className = 'balloon-body';

  const string = document.createElement('div');
  string.className = 'balloon-string';

  bobber.appendChild(body);
  bobber.appendChild(string);
  el.appendChild(bobber);

  el.addEventListener('click', e => {
    e.stopPropagation();
    startIntro();
    if (el.dataset.popped) return;
    el.dataset.popped = '1';
    const r = body.getBoundingClientRect();
    popBalloon(el, bobber, body, color, r.left + r.width / 2, r.top + r.height / 2);
  });

  balloonsWrap.appendChild(el);
}

function popBalloon(el, bobber, body, color, cx, cy) {
  bobber.style.animation = 'none';
  body.style.animation   = 'balloon-pop .22s ease-out forwards';
  el.querySelector('.balloon-string').style.opacity = '0';
  spawnConfetti(cx, cy, color);
  setTimeout(() => el.remove(), 280);
  balloonsLeft--;
  if (balloonsLeft === 0) setTimeout(transitionToQuiz, 420);
}

function spawnConfetti(cx, cy, color) {
  for (let i = 0; i < 9; i++) {
    const dot   = document.createElement('div');
    dot.className = 'confetti-dot';
    const angle = (i / 9) * Math.PI * 2;
    const dist  = 36 + Math.random() * 28;
    dot.style.cssText = `left:${cx}px;top:${cy}px;background:${color};--dx:${(Math.cos(angle)*dist).toFixed(1)}px;--dy:${(Math.sin(angle)*dist).toFixed(1)}px`;
    document.body.appendChild(dot);
    dot.addEventListener('animationend', () => dot.remove(), { once: true });
  }
}

function transitionToQuiz() {
  splashScene.classList.add('fading');
  setTimeout(() => {
    splashScene.setAttribute('hidden', '');
    quizScene.removeAttribute('hidden');
    requestAnimationFrame(() => requestAnimationFrame(() => quizScene.classList.add('visible')));
    initQuiz();
  }, 680);
}

/* =========================================================
   QUIZ ENGINE
   ========================================================= */
function initQuiz() {
  qTotalEl.textContent = CONFIG.quiz.length;
  songTitleEl.textContent = CONFIG.songTitle;
  audioEl.src = CONFIG.songSrc;

  dotsEl.innerHTML = CONFIG.quiz.map(() => '<span class="dot"></span>').join('');
  renderQuestion();
}

function renderQuestion() {
  const q = CONFIG.quiz[currentQuestion];
  qIndexEl.textContent = currentQuestion + 1;
  qTextEl.textContent = q.question;
  qFeedback.textContent = '';

  qOptionsEl.innerHTML = '';
  q.options.forEach((label, i) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option';
    btn.type = 'button';
    btn.textContent = label;
    btn.addEventListener('click', () => handleAnswer(i, btn));
    qOptionsEl.appendChild(btn);
  });
}

function handleAnswer(choiceIndex, btnEl) {
  const q = CONFIG.quiz[currentQuestion];
  const allOptionBtns = qOptionsEl.querySelectorAll('.quiz-option');

  if (choiceIndex === q.correctIndex) {
    allOptionBtns.forEach(b => (b.disabled = true));
    btnEl.classList.add('correct');
    correctCount++;

    const dots = dotsEl.querySelectorAll('.dot');
    dots[currentQuestion].classList.add('done');

    const isLastQuestion = currentQuestion === CONFIG.quiz.length - 1;

    if (isLastQuestion) {
      qFeedback.textContent = 'Unlocking…';
      crackSealAndReveal();
    } else {
      qFeedback.textContent = 'Got it.';
      setTimeout(() => {
        currentQuestion++;
        renderQuestion();
      }, 550);
    }
  } else {
    btnEl.classList.add('wrong');
    qFeedback.textContent = 'Not quite — try again.';
    setTimeout(() => btnEl.classList.remove('wrong'), 400);
  }
}

/* =========================================================
   SEAL CRACK + SCENE TRANSITION
   ========================================================= */
function crackSealAndReveal() {
  // jagged crack path drawn across the seal
  sealCrack.setAttribute('d', 'M50 6 L46 30 L58 38 L42 56 L54 70 L48 94');
  sealEl.classList.add('cracking');

  setTimeout(() => {
    sealEl.classList.remove('cracking');
    sealEl.classList.add('broken');
    quizScene.classList.add('solved');
  }, 280);

  setTimeout(() => {
    quizScene.classList.add('fading');
    revealBook();
  }, 1300);
}

function revealBook() {
  quizScene.setAttribute('hidden', '');
  bookScene.removeAttribute('hidden');
  requestAnimationFrame(() => bookScene.classList.add('visible'));

  startSong();
  buildBook();
}

/* =========================================================
   AUDIO
   ========================================================= */
function startSong() {
  if (!CONFIG.songSrc) return;
  fadeOutIntro();
  // This runs inside the click-handler chain from the final answer,
  // so it counts as a user gesture and browsers will allow autoplay.
  audioEl.play().catch(() => {
    // Autoplay was still blocked (rare, depends on browser settings) —
    // show a tappable play affordance instead of failing silently.
    muteBtn.textContent = '▶';
    muteBtn.setAttribute('aria-label', 'Play song');
    muteBtn.onclick = () => { audioEl.play(); muteBtn.onclick = toggleMute; muteBtn.textContent = '🔊'; };
  });
}

function toggleMute() {
  audioEl.muted = !audioEl.muted;
  muteBtn.textContent = audioEl.muted ? '🔈' : '🔊';
  muteBtn.setAttribute('aria-label', audioEl.muted ? 'Unmute song' : 'Mute song');
}
muteBtn.addEventListener('click', toggleMute);

/* =========================================================
   FLIP BOOK
   ========================================================= */
function buildBook() {
  pageTotEl.textContent = CONFIG.pages.length;
  bookEl.innerHTML = '';

  CONFIG.pages.forEach((src, i) => {
    const page = document.createElement('div');
    page.className = 'page';
    page.style.zIndex = CONFIG.pages.length - i;

    const front = document.createElement('div');
    front.className = 'page-front';

    const img = new Image();
    img.alt = `Page ${i + 1}`;
    img.onerror = () => {
      front.innerHTML = '';
      const ph = document.createElement('div');
      ph.className = 'page-placeholder';
      ph.innerHTML = `<span class="ph-num">${i + 1}</span><span class="ph-hint">drop ${src.split('/').pop()} into assets/pages/</span>`;
      front.appendChild(ph);
    };
    img.src = src;
    front.appendChild(img);

    const back = document.createElement('div');
    back.className = 'page-back';

    page.appendChild(front);
    page.appendChild(back);
    bookEl.appendChild(page);
  });

  updatePageUI();
  initDrag();
}

/* =========================================================
   DRAG-TO-FLIP
   ========================================================= */
const drag = { active: false, page: null, direction: null, startX: 0 };

function initDrag() {
  bookEl.addEventListener('mousedown',  dragStart);
  bookEl.addEventListener('touchstart', dragStart, { passive: false });
  window.addEventListener('mousemove',  dragMove);
  window.addEventListener('touchmove',  dragMove, { passive: false });
  window.addEventListener('mouseup',    dragEnd);
  window.addEventListener('touchend',   dragEnd);
}

function dragStart(e) {
  drag.startX    = e.touches ? e.touches[0].clientX : e.clientX;
  drag.active    = true;
  drag.page      = null;
  drag.direction = null;
}

function dragMove(e) {
  if (!drag.active) return;
  const x  = e.touches ? e.touches[0].clientX : e.clientX;
  const dx = x - drag.startX;

  if (!drag.direction && Math.abs(dx) > 8) {
    const pages = bookEl.querySelectorAll('.page');
    if (dx < 0 && currentPage < CONFIG.pages.length - 1) {
      drag.direction = 'forward';
      drag.page = pages[currentPage];
    } else if (dx > 0 && currentPage > 0) {
      drag.direction = 'backward';
      drag.page = pages[currentPage - 1];
      drag.page.style.zIndex = CONFIG.pages.length + 10;
    } else {
      drag.active = false;
      return;
    }
    drag.page.style.willChange = 'transform';
  }

  if (!drag.page) return;
  e.preventDefault();

  const w = bookEl.offsetWidth;
  const angle = drag.direction === 'forward'
    ? Math.max(-180, Math.min(0,   (dx / w) * 180))
    : Math.max(-180, Math.min(0, -180 + (dx / w) * 180));

  drag.page.style.transition = 'none';
  drag.page.style.transform  = `rotateY(${angle}deg)`;
}

function dragEnd(e) {
  if (!drag.active) return;
  drag.active = false;
  if (!drag.page) return;

  const x  = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
  const dx = x - drag.startX;
  const progress = Math.abs(dx) / bookEl.offsetWidth;

  drag.page.style.transition = '';
  drag.page.style.transform  = '';
  drag.page.style.willChange = '';

  if (drag.direction === 'forward'  && progress > 0.3) currentPage++;
  if (drag.direction === 'backward' && progress > 0.3) currentPage--;

  updatePageUI();
  drag.page = null;
  drag.direction = null;
}

function updatePageUI() {
  const pages = bookEl.querySelectorAll('.page');
  pages.forEach((p, i) => {
    p.style.transform  = '';
    p.style.willChange = '';
    if (i < currentPage) {
      p.classList.add('flipped');
      p.style.zIndex = i;
    } else {
      p.classList.remove('flipped');
      p.style.zIndex = CONFIG.pages.length - i;
    }
  });

  pageCurEl.textContent = currentPage + 1;
  prevBtn.disabled = currentPage === 0;
  nextBtn.disabled = currentPage === CONFIG.pages.length - 1;
}

prevBtn.addEventListener('click', () => {
  if (currentPage > 0) {
    currentPage--;
    updatePageUI();
  }
});

nextBtn.addEventListener('click', () => {
  if (currentPage < CONFIG.pages.length - 1) {
    currentPage++;
    updatePageUI();
  }
});

document.addEventListener('keydown', (e) => {
  if (bookScene.hasAttribute('hidden')) return;
  if (e.key === 'ArrowRight') nextBtn.click();
  if (e.key === 'ArrowLeft') prevBtn.click();
});

/* =========================================================
   BOOT
   ========================================================= */
initSplash();
