/* =========================================================
   CONFIG — edit everything in this block, leave the rest alone
   ========================================================= */
const CONFIG = {

  // 3–5 multiple choice questions. correctIndex is 0-based.
  quiz: [
    {
      question: "Where did we first meet?",
      options: ["valorant", "Overwatch", "Pokemon Go", "League of Legends"],
      correctIndex: 0
    },
    {
      question: "What do you call me?",
      options: ["tiger", "bee", "demon"],
      correctIndex: 1
    },
    {
      question: "Finish the sentence: \"Remember when we...\"",
      options: ["first met", "kissed", "life"],
      correctIndex: 0
    },
	{
      question: "Pick the song that always reminds us of that one day",
      options: ["Replace me", "Replace me", "Replace me", "Replace me"],
      correctIndex: 2
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
}

function updatePageUI() {
  const pages = bookEl.querySelectorAll('.page');
  pages.forEach((p, i) => {
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
initQuiz();
