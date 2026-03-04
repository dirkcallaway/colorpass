# ColorPass

A daily Mastermind-style color code game. Crack the secret 5-color code in 8 tries. A new puzzle is available every day, and everyone gets the same puzzle.

## How to Play

- Each day a new secret code of 5 colors is generated (colors can repeat)
- Pick colors from the palette to fill your guess row, then hit **Submit**
- After each guess you receive feedback:
  - **Black peg** — right color, right position
  - **White peg** — right color, wrong position
  - **Empty** — color not in the code at all
- Win by finding the exact code within 8 guesses
- Tap a filled slot on the active row to remove that color and change it
- Use the **💡 Hint** button (3 per day) to reveal the correct color for a slot

## Features

- Daily puzzle seeded by date — same code for all players worldwide
- Persistent game state — refresh mid-game and pick up where you left off
- Lifetime stats tracking — win %, streaks, guess distribution
- Share your result as an emoji grid (with 💡 if hints were used)
- Confetti celebration on a win
- First-time help modal, accessible at any time via the **?** button
- Mobile friendly

## Tech Stack

- [Nuxt 4](https://nuxt.com) — Vue framework with file-based routing and auto-imports
- [Tailwind CSS](https://tailwindcss.com) — utility-first styling
- [Headless UI](https://headlessui.com) — accessible modal components
- [VueUse](https://vueuse.org) — clipboard utility
- [canvas-confetti](https://github.com/catdad/canvas-confetti) — win celebration

## Project Structure

```
app/
├── components/
│   ├── ColorPicker.vue     # 6-color palette buttons
│   ├── FeedbackPegs.vue    # Black/white/empty peg grid
│   ├── GameBoard.vue       # Full 8-row board
│   ├── GuessRow.vue        # Single row with hint ring support
│   ├── HelpModal.vue       # How to play instructions
│   └── StatsModal.vue      # Stats, distribution, share, countdown
├── composables/
│   └── useGameState.ts     # All game logic and localStorage state
├── pages/
│   └── index.vue           # Main game page
└── utils/
    └── colorpass.ts        # Color definitions, scoring, daily code generation
```

## Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deployment

The project is configured for [Vercel](https://vercel.com). Push to GitHub, import the repo in Vercel, and deploy — Nuxt 4 is auto-detected.
