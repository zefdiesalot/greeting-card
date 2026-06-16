# Your Greeting Card

A locked-card website: solve a short trivia quiz to crack the wax seal, then
flip through your photo pages while a song plays. Pure HTML/CSS/JS — no
build step, no server, free to host.

## 1. Add your content

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

## 2. Test it locally

Just open `index.html` in a browser. (If your browser blocks the
placeholder images or audio from loading due to local file restrictions,
run a tiny local server instead — from this folder: `python3 -m http.server`,
then visit `http://localhost:8000`.)

## 3. Deploy to GitHub Pages (free)

1. Create a new GitHub repo (public).
2. Push everything in this folder to it:
   ```
   git init
   git add .
   git commit -m "greeting card"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages → Build and deployment → Source: Deploy
   from a branch → Branch: main / (root)**. Save.
4. Wait ~1 minute, then your card is live at:
   `https://<your-username>.github.io/<repo-name>/`

## File map
```
index.html        page structure (quiz scene + book scene)
style.css         all visual design — colors/fonts are CSS variables at the top
script.js         CONFIG block (edit this) + quiz/seal/book/audio logic
assets/pages/     your PNG pages go here
assets/audio/     your song file goes here
```

## Notes
- Works on mobile; the book frame resizes for narrow screens.
- Arrow keys (← →) flip pages too, once the book is open.
- Respects "reduce motion" OS settings.
