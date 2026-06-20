# Your Greeting Card

A locked-card website: solve a short trivia quiz to crack the wax seal, then
flip through your photo pages while a song plays. Pure HTML/CSS/JS — no
build step, no server, free to host.


**The quiz** — open `script.js`, edit the `quiz` array at the top:
```js
{
  question: "Where did we first meet?",
  options: ["Coffee shop", "Lab class", "A party", "Online"],
  correctIndex: 0   // index of the right answer, starting at 0
}
```
Use 3–5 questions. A wrong answer just shakes and lets the person try
again — nobody gets locked out on their card.

**The pages** — drop your PNG files into `assets/pages/`, named exactly
`page-1.png`, `page-2.png`, etc. (or change the names in the `pages` array
in `script.js` to match whatever you use). Any page without a matching file
shows a placeholder so you can test the flow before your art is ready.
Recommended image shape: portrait, roughly 3:4 (e.g. 900×1200px) — that's
the proportion the book frame uses.

**The song** — put your audio file at `assets/audio/song.mp3` (mp3 or m4a
both work). It starts automatically the instant the seal cracks, and loops
so it keeps going no matter how long someone lingers on the pages.

