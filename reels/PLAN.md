# Premium plan: nothing posts under 85

Rule from the account owner: nothing is posted unless its virality score is above 85, and nothing is built if it will score below that.
Score = 10 x (.20 hook + .20 button + .25 send + .15 originality + .20 reach) - 4, each factor 0-10, graded hard
(9 = rare, 10 = almost never). To reach 85 a reel needs about 9 on nearly every factor. These are my estimates, not measured data.

The 141 template reels (b40-b53: counters, bars, text) are paused as drafts. They are accurate but visually cheap, and most grade 75-83.

## Candidates, graded before building

| # | concept | hook | button | send | orig | reach | score | build? |
|---|---|---|---|---|---|---|---|---|
| 1 | You'll see about 990 full moons in your life (scarcity, parents, a moon jar that empties) | 10 | 9 | 10 | 8 | 9 | 89 | yes |
| 2 | You will spend 10 years of your life on your phone (lifeline bar that the phone eats) | 10 | 9 | 10 | 7 | 10 | 89.5 | yes |
| 3 | Sleep deprivation as drunk goggles (the picture blurs, doubles and lags as the hours pile up) | 10 | 9 | 10 | 7 | 10 | 89.5 | yes |
| 4 | 117 billion people have lived: the living are 7% (a galaxy of lights, the living glow) | 9 | 10 | 9 | 8 | 9 | 88 | yes |
| 5 | Cleopatra is closer to the Moon landing than to the pyramids (illustrated scroll timeline) | 10 | 10 | 9 | 7 | 9 | 87 | yes |
| 6 | One domino can knock over the Moon: 63 dominoes, each 1.5x bigger | 10 | 10 | 9 | 8 | 8 | 86.5 | yes |
| 7 | $300 a month from 25 vs from 35 (two towers growing, side by side) | 9 | 10 | 10 | 6 | 9 | 86 | yes |
| 8 | Your subscriptions are a drain: the same money invested (coins into a drain vs a growing tree) | 9 | 9 | 10 | 6 | 10 | 86 | yes |
| 9 | Drive straight up at 100 km/h: space in 1 hour, the Moon in 160 days (vertical highway to space) | 10 | 9 | 9 | 7 | 9 | 85 | yes |
| 10 | All the water on Earth in one ball | 9 | 9 | 8 | 7 | 9 | 80.5 | no, under 85 |
| 11 | All 8 billion humans fit in one cube | 10 | 9 | 8 | 8 | 9 | 84 | no |
| 12 | Pendulum waves, fibonacci seeds, hearing test | 9 | 8 | 7 | 6-7 | 8 | under 80 | no |
| 13 | Cola sugar, birthday paradox, felix jump | 9-10 | 9 | 9 | 5-6 | 9 | 81-84 | no |

## Visual bar for every built reel
- A custom animated scene per beat (a drawn world, not text on a card): camera moves, parallax, particles, physics, glow.
- Numbers appear inside the scene as part of the action, never as a stat card.
- Narration by the in-house voice, word-timed. Hook in the first second, payoff at the end, loop-friendly last frame.
- 50-59 seconds. Layout QA for overlap. Every frame set checked by eye before it is queued.

## Status (updated)
Gate: `python3 src/preflight.py <module> <reel>` predicts length, layout overlap, physics validity and the graded score BEFORE any render. Score = 10 x (.20 hook + .20 button + .25 send + .15 orig + .20 reach) - 4, minus 15 if hook < 8 and minus 10 if send < 8. Grades live in `src/grades.json` with a one-line reason. Under 85 does not render or queue. Length is a judgment call (25-70 s sanity range), tight beats padded.

Queued today (best first): 407 heartbeats 89.0, 411 dog days 89.0, 409 parents' days 87.5, 405 sleep goggles 86.5, 402 full moons 85.5, 408 117 billion 85.2, 406 phone years 85.0.
In build: 412 life as one day (86.5).
Held under 85: 401 domino-to-the-Moon 82 (strong visual, send is only 8), 400/403/404 ball sims 60.5 (send 6, hook 8: the format is proven but copycat; physics is validated, 0 wall leaks), 410 ancestors (visual not good enough yet).
What passes: reels that make the viewer feel something about their own life and give them a specific person to send it to, with a visual that is new (paw of days, galaxy of the dead, a sky that runs a day, a counter that ticks on the soundtrack).
