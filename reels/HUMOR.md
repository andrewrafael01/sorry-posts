# Humor engine (what-if / brainrot reels)

Sources are thin (blogs, not theory), so these are working rules, tested by the linter in `src/humor.py`, not gospel.
Research notes: brainrot works as anti-humor against predictable jokes, as in-group signal, and as release through randomness
(capcut.com/resource/brainrot-meme, dazeddigital.com brainrot article). Sketch craft: game of the scene, heighten, rule of three,
misdirection, specificity (comedipedia / writingworkshops / Ken Levine "rule of 3s").

## The engine
1. **FUT** (first unusual thing) in the first line. One premise, one rule ("every scroll costs 1 IQ"). Never explain it twice.
2. **Play the game, don't change it.** Every beat is the same rule at a bigger number. Cut any beat that doesn't heighten.
3. **Specific beats vague.** Named person (Greg, Mrs. Davis, Kevin), a number, a brand/place (Starbucks, Ohio, Tinder). "A guy" is dead.
4. **Deadpan.** Narrator states absurd facts flat, like a weather report. No "lol", no exclamation points, no "crazy".
5. **Misdirect, then turn.** Build the expected line (a reasonable consequence), then swerve in the last 3 words.
6. **Rule of three with a break.** Two normal, third wrong. Or 1-2-3 escalation where #3 is a different kind of wrong.
7. **Short lines.** Punch word last. 8-18 words. The funniest word is the final word of the line.
8. **Callback in the last beat.** Return to something from beat 1 or 2 (Kevin, the goat, the eagle). Callbacks beat new jokes.
9. **Escalation shape.** Personal -> social -> institutional -> cosmic -> back to petty (the petty tag is the button).
10. **Brainrot texture, used sparingly:** one or two slang drops per script, said by the wrong person (a priest, a teacher, a goat). Slang from the narrator is cringe; slang from an absurd character is funny.
11. **Visual gag must match the line at the same second.** Pop-up text is the punch word, not a summary.
12. **No AI tells:** no "Not only... but also", no "In a world where", no "Imagine", no moral that explains the joke, no triple adjectives, no "delve/tapestry". The sign-off is a petty fact, not a lesson.

## Banned phrasing (linter fails these)
"imagine", "in a world", "it's like", "ultimately", "journey", "game-changer", "buckle up", "get ready", "you won't believe", "let's dive",
"fun fact", "spoiler", "plot twist", "literally", "basically", "crazy" (as filler), exclamation marks, rhetorical "right?" tags.

## Workflow
`python3 src/humor.py <timeline.json>` scores each beat and the whole script. Under 70 = rewrite the flagged lines, regenerate the timeline, re-render.
