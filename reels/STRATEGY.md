# Growth strategy for @holyshitwhatif (written Nov 27 from the account's own data)

## 0. Where we actually are (measured)
- **83 followers, 38 posts on the account** (ig-health, Nov 27). About 145 reels have been marked posted, ~50k total views, ~0.15% of views became followers. **Conversion, not reach, is the broken part.**
- **Nothing posted for 76 hours** (Nov 23 20:00 UTC -> Nov 27). The poster and token were fine; the queue was EMPTY. The bottleneck is content production, not tech. (Fixed below: a queue-floor alarm.)
- Reach is bimodal. Of 44 reels from Nov 6 on: 13 reached 1.5-3.7k views, the other ~30 stalled at 160-650 (reach ~70% of views). Stalled reels got 0-5 likes, winners 20-70. Instagram tests each reel on a small seed audience (~150-250 accounts) and only expands it if early engagement is strong. **A reel is a lottery ticket with a 30% win rate; the job is raising the win rate and making each win turn into followers.**
- Watch time does NOT separate winners from losers (Drake crossing guard 25.7 s average watch -> 640 views; dating bios 25.4 s -> 2,989; charger 17.3 s -> 3,752). What separates them: instant relatable premise in the first sentence + early likes/shares.
- By format (Nov): invention chains avg 1,418 views (median 855); competitions 687; other what-ifs 605; dating 520 (one 2,989 spike, median 215); ball/song sims 334; Drake persona 327; everything else 230.
- Winners share a recipe: "**Your <person/pet> keeps <annoying thing>**", the annoyance has an ACTIVE antagonist (little brother, neighbor's dog, friend, seagull, toddler) who outsmarts every fix, escalating to an absurd image. Charger (126 shares), neighbor dog, fries, keys/raccoon, headphones, God's Plan, spoiler, seagull, toddler. Misses are the same format where the antagonist is passive or the premise is niche (lunch, left on read, always-late, hotline).
- Instagram reach on the same reel is ~6x TikTok reach right now (charger 3,752 vs 596).
- Doing worse: profanity cold-open ("Holy shit. What if..."), celebrity-persona reels (needs the viewer to know the lore), 100-person competitions, dating series (8 of 9 flopped ~200), ball/song sims.

## 1. The three levers (in order of impact)
### Lever A. Win rate per reel (more tickets that hit)
1. **Only two formats from now on**: (a) *Chain*: "Your X keeps Y" with an active antagonist; (b) *Town story*: "In this town, everybody ___ except me" (the ~10M-like reference style, TOWN_STANDARD.md). Everything else stays draft.
2. **First 2 seconds**: the premise sentence is on screen as text AND spoken at frame 0, no cursing, no intro. Cover/first frame = the funniest image of the reel (the antagonist mid-gag), not a title card.
3. **Engineer early likes/shares** (the gate): end every chain on a 1-line punch that begs a tag ("send this to your little brother"), put "tag who does this" as the pinned comment, and reply to every comment within 30 minutes with a comment (comments in the first hour feed the expansion test). Target: 10 likes in the first hour.
4. **Post when the seed audience is awake**: our followers are too few to matter, so seeds come from Explore. Test slots on a rotation (see section 4) instead of guessing; stop using 23:00 UTC (avg 298 views).
5. **Raise craft**: bigger hero in frame, close-ups on punchlines, lip-sync, blinking, expression changes, 3-4 s location changes (TOWN_STANDARD.md). The first town reel (689) is a working draft of this.
### Lever B. Make wins convert to followers
1. **Series identity**: one recurring cast (hero, Kevin, Linda, Grandma, the mayor's pet) and one title format per series so viewers recognise "this account". Episode numbers on screen: "TOWN #3". A viewer who liked one should know there are 30 more.
2. **Profile rebuild** (the single biggest conversion fix): pfp = the hero's face (grin), name "In This Town", bio "tiny stories from a town where everyone is the opposite of you. new episode daily." Pin the 3 best reels (charger, fries, neighbor dog). Highlights: "Town", "Chains". Do NOT change the @handle or any Accounts Center link: both previously invalidated the API token (three outages).
3. **Follow hooks inside the reel**: line before the last beat on 1 of every 3 reels: "Part 2 tomorrow if this hits 1k" / "Next town rule: comment one" (the reference did this). Reply to commenters by making the next reel from their rule and tagging them. That is the cheapest reliable follower engine we have.
4. **Cover grid**: consistent cover style (hero + big 2-word title) so the profile grid looks like a show.
### Lever C. Distribution (same reel, more surfaces)
1. **Instagram**: 3-4 posts/day (07:00-09:00 and 19:00-21:00 local of the US east/west seam; test), never 2 within 90 minutes.
2. **TikTok**: 2/day, hand posted/scheduled (TikTok's API only allows private posts until an audit; use TikTok Studio's scheduler). TikTok data shows bursts kill reach: posts 3+ in 10 min got 2-7 views. Add the "comment a rule" CTA there too.
3. **YouTube Shorts**: upload the same files with title = premise sentence (Shorts are searchable and live for years). Manual or scheduled in YouTube Studio.
4. **Facebook Reels**: Accounts Center auto-share (set up Nov 22; verify it works on the next post).
5. **Reddit/X**: the town stories play like r/Showerthoughts / r/funny / r/tifu-style videos; post best performers as native uploads with a plain-text title, one sub per day. (Manual, high ceiling, zero cost.)
6. **Pay-to-test (optional, your call)**: Instagram's "Boost" on a reel that already won organically ($5-10 for 3 days, target 18-34 US). A winner boosted gets the seed audience that decides everything. Spend only on reels that cleared 2k organic.

## 2. Content plan (next 14 days, 3 posts/day = 42 slots)
- Ratio: 50% Town episodes, 40% Chains, 10% reruns of the two best winners with new hooks.
- **Town episodes** (script rule: premise, 3 neighbors, opposite behavior, big event, "when did you get so good", reversal, pet callback): late (built), cheat, cook, then: sleeps, tells the truth, dances, saves money, is afraid of the dark, shares, gets up early, is nice, is quiet, plays outside, reads. Each: ~85 s.
- **Chains with an active antagonist** (the money format): little sister borrows your hoodie, dog steals the remote, coworker eats your lunch (give the coworker a loud personality), roommate's cat, kid at the arcade, uncle at the BBQ, GPS that argues with you, neighbor's rooster, ex's dog, boss's cat on video calls. Rule: the antagonist is on screen every beat and has a facial expression every beat.
- Retire: Drake persona, competitions, dating, sims, body-shock what-ifs.

## 3. Production system (make it automatic, never idle again)
- Backlog target: **>= 12 finished reels in the queue at all times** (4 days). ig-health (new) checks every 30 min: token valid, queue < 4, no post in 14 h, 2+ recent failures; writes ig_config.health. Read it in 1 query.
- Pipeline per reel: script (30 min) -> voice (3 min) -> builder (45-90 min) -> frame review vs TOWN_STANDARD -> ship -> auto-register. Run 4 builders at once max (account usage limit: 5-hour windows).
- Weekly review job: pull stats, drop any reel format whose median < 400 views over 8 reels, double the top format, write next 14 scripts.
- Keep `followers_history` (ig-health writes daily): the one number that matters.

## 4. Experiments (so we learn instead of guessing)
- E1 hook: same chain, two versions: (a) premise-first as is, (b) cold-open image of the punchline for 1.2 s then premise. Post 2 days apart in the same slot. Keep the winner's pattern.
- E2 length: town story 85 s vs a 45 s cut of the same story.
- E3 time of day: rotate 4 slots (13:00, 17:00, 21:00, 02:00 UTC) over 3 weeks, 3 posts each.
- E4 CTA: pinned-comment question vs on-screen CTA.
- Decision rule: need >= 6 posts per cell; compare MEDIAN views and likes in first 24 h, not averages.

## 5. Risks and guard rails
- Token invalidation (3 outages: username change, Accounts Center link, Facebook link). Never touch account settings; ig-health flags TOKEN_DEAD within 30 min.
- IG detects unoriginal/aggregated content: we are all original, keep it that way. No reposts, no copying the reference's character or lines (only structure).
- Don't buy followers or run follow/unfollow bots: they destroy the seed-audience quality that the whole system depends on.
- The 'mochi' account rows in this database belong to a different bot: do not touch.

## 6. Targets (honest, 30 days)
- Baseline today: ~1.4k average views on chains, 83 followers.
- 30-day goal: 90 posts, win rate from 30% to 50%, followers from 83 to 1,000+ (needs the profile rebuild + series + CTAs; reach alone will not do it), at least one 20k+ reel. A 100k reel is a lottery outcome we can raise the odds of, not promise.
