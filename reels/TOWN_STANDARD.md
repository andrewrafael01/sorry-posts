# The standard every new reel must meet (modeled on the ~10M-like "In this town" reel)

A reel ships only if it clears ALL of these. If it cannot, rewrite the script, do not render.

1. FIRST LINE = premise in one breath, a first-person narrator: "In this town, everybody ___ except me." (or another one-sentence premise a stranger gets instantly).
2. ONE hero, same look every beat, plus 3 NAMED side characters that each keep a signature look and one gag (Kevin, Linda, Grandma are our recurring cast; the Mayor + the Mayor's pet is the plant/payoff animal).
3. PLANT in the first third (an animal/object mentioned in passing). PAY IT OFF in the last line, as the only guest / the final joke.
4. The hero does the OPPOSITE of the town ("But not me. ... Day after day."), a mini montage with a counter or a sound (effort sound, clock, calendar).
5. A BIG TOWN EVENT (talent show, championship, bake-off): everyone laughs at the hero, then he wins by default or by being good.
6. The honest-punchline exchange: "Kevin asked, when did you get so good? I told him the truth. <one honest line>"
7. REVERSAL: next morning the whole town copies the hero, which creates the new problem.
8. Ending twist: the hero is now the odd one out, the planted animal is the final joke ("It's a pretty good dancer/detective/critic.").
9. 75-90 s. A new location, camera move or gag every 3-4 s inside every beat (whip pans, push-ins). No static shot over 3 s.
10. VOICE: kid storyteller (env NARRATOR_VOICE=am_eric KID_STYLE=1), word-by-word captions, an effort-sound or sfx on the montage beat.
11. FACES change every beat (grin, wink, shock, deadpan, sad, smug); close-up on the punchline, then wide.
12. The town is a character: houses, street lights, trees, windows with lights, a stage/court/kitchen for the event.
13. Series branding: end card is not needed; the premise line is the brand ("In this town...").
Never reuse the reference's lines, its hero, its party/basketball/goldfish plot; each reel is an original premise.
Never post anything weaker than this standard; the older short chain reels are only filler until town reels exist.

## Character + world design spec (from frame study of the viral reel; applies to every town reel)
Match the Roblox-avatar look of the reference closely, with OUR OWN hero costume (never its blue star beanie, its 'in this town!' hoodie print, its tagline or its handle):
- Body (R6 avatar proportions): torso a tall rounded box (about 2 x 2 x 1), arms and legs rectangular, ~1:1:2 limb widths, hands/feet no detail. Head a SLIGHTLY TALLER ROUNDED CYLINDER/ROUNDED BOX that is wider than the neck, smooth plastic, soft rounded edges, no hair geometry (hair/hats are separate accessory meshes).
- Face = a flat decal on the front of the head: tiny black dot eyes (or ^ ^ squint-grin), a big open red 'D' mouth with a pink tongue for talk/laugh, small curved smile for neutral, round eyes + small 'o' for shock, flat line for deadpan. Eyes are small relative to the head (smaller than our current big-eyed look).
- Skin and clothes are flat saturated colors with a clearly visible soft clothing print on the chest (our hero: a yellow 'ON TIME' stencil on a green hoodie with white drawstrings and a kangaroo pocket), clothing seams, a tiny star/dot pattern. Hat accessories sit on the head: beanies with a folded cuff and a patch, party cones with pompoms, caps. Our hero wears a ORANGE beanie with a clock patch (not blue/star).
- Side-character looks: each has a different hat + hoodie/shirt color and the same simple face decal.
- World: soft, bright, slightly hazy low-poly town: gentle hills in the back, pastel houses with pitched roofs and dark chimneys, street lamps, curbs and crosswalks, green cars, bunting strings of colored flags, bleachers and a court, a moon/sun disc, evening/night gradient skies (navy, pink), smooth lighting with soft shadows and a mild bloom. Camera mostly at character height, 25-35 mm feel, face close-ups with shallow depth, slow drifts and push-ins.
- Captions: bold white word-by-word with a thick dark outline, centered lower third (already provided by page.html).

## Voice (decided by the user, Nov 27)
Town reels use Kokoro voice `am_puck`, plain (no pitch shifting): run tl3d.py with env NARRATOR_VOICE=am_puck and KID_STYLE unset. The earlier pitch-shifted `am_eric` kid style (KID_STYLE=1) was rejected ('the voice sucks'). Chains keep the default narrator. If a real-voice upgrade is wanted: set ELEVENLABS_API_KEY as an environment variable in the cloud environment settings (voice.py uses it automatically).
