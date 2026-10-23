# Cross-posting to YouTube Shorts and TikTok

Edge functions (Supabase project `ig-poster`): `post-cross` runs every 5 min (pg_cron job `cross-poster-tick`) and uploads each reel Instagram has posted since `ig_config.crosspost_since` to every connected platform, one per platform per run. `oauth` does the one-time sign-in. Tables: `platform_tokens`, `cross_posts` (a failed row is not retried; update or remove it to retry).

## One-time setup (the owner does this; I cannot create developer apps or log in)
Supabase dashboard -> Edge Functions -> Secrets:
- `YT_CLIENT_ID`, `YT_CLIENT_SECRET`  (Google Cloud: enable YouTube Data API v3, OAuth consent screen, "Web application" client, redirect URI `https://dekdzameqfbwgffhceog.supabase.co/functions/v1/oauth`)
- `TIKTOK_CLIENT_KEY`, `TIKTOK_CLIENT_SECRET`  (developers.tiktok.com app with Login Kit + Content Posting API, same redirect URI)

Then open once in a browser: `.../functions/v1/oauth?platform=youtube&key=<cron_token>` and `...platform=tiktok&key=<cron_token>` (cron_token is in `ig_config`).

## Limits
- YouTube: uploads from a new Google Cloud project are locked private until Google's API audit. About 6 uploads/day of quota.
- TikTok: until the app passes TikTok's audit every post is private (SELF_ONLY); the function uses PUBLIC_TO_EVERYONE automatically once TikTok allows it.
