# Why Personalities works better in the app

Short version: **the web page wins the first visit, the app wins every visit after.**
Search brings people to a personality once. Following someone is a relationship, and an app is built for relationships.

---

## What favours the app

| # | App advantage | What it unlocks for Personalities | Web can't match because |
|---|---|---|---|
| 1 | **Reliable push** | Alerts by type: *Major decision*, *New ET analysis*, *Contradiction flagged*, *Live now* (keynote, AGM, policy day) | Web push is weak on iOS and most users never opt in |
| 2 | **Signed-in by default** | A **business lens** (sector, company size, holdings) that ranks every item for *you* | Most web readers are anonymous |
| 3 | **Per-user state** | "Since you last opened": a diff of what changed, not a feed of everything | Needs a stable identity and visit history |
| 4 | **Portfolio link** (ET Markets) | "Affects your holdings" tag when Mukesh Ambani's decision moves a stock you own | Holdings live in the app account |
| 5 | **Widgets and live activities** | Lock-screen card during GTC keynote, Reliance AGM, RBI policy day | Not available on the web |
| 6 | **Native gestures** | Story rings, swipe cards, bottom-sheet Ask: faster to skim | Possible on web, but slower and less natural |
| 7 | **Voice and audio** | "Ask anything" by voice; a 60-second audio brief per person | Mic access and background audio are clunky in browsers |
| 8 | **Offline and saved** | Saved briefs for flights and commutes | Service-worker caching is limited and inconsistent |

## What favours the web (keep it)

- **SEO discovery.** "Jensen Huang latest", "Mukesh Ambani net worth" searches land on the web page. This is the acquisition funnel.
- **Sharing.** A link to "Mukesh Ambani: key numbers" must open for anyone.
- **First impression.** A reader should get value before installing anything.

## The split

| Layer | Web (public, indexable) | App (signed-in) |
|---|---|---|
| Job | Acquire | Retain |
| Content | Full page, all modules, no lens | Same modules, ranked by your lens |
| Follow | "Follow in the ET app" button, opens a deep link | One tap. Choose alert types |
| Ask anything | 3 free questions, then sign in | Unlimited, voice, saved threads |
| What's new | Latest 5 updates | Diff since your last visit |

Deep link `/personalities/jensen-huang` opens the app page when installed, the web page otherwise.

## The SME case, solved in the app

A manufacturing SME follows Donald Trump. Trump says something about a sports league today.

- The app knows the user's lens: **SME · Manufacturing · Imports inputs**.
- The item scores **low** for that lens and is folded into "Hidden for your lens (1)". One tap shows it.
- The same day, a tariff change on steel scores **high** and arrives as a push: *"New tariff on steel imports. Affects your input costs."*
- "Not relevant" mutes the **topic** (sports), never the person.

The sample pages demonstrate this. Switch the lens chip at the top of any page to *SME* or *Investor* and watch items fold away or rise.

## Guardrails

- **Notification cap.** At most 1 push per personality per day, except "Live now" and "Major decision".
- **Quiet by default.** New follows start on *Major decisions only*. Users opt up, not down.
- **Sourced or silent.** Push only items with a source and date.

## KPIs to watch

| Metric | Why |
|---|---|
| Follows per active user | Is the follow habit forming? |
| Push opt-in rate on follow | Are alert types useful? |
| Push open rate by alert type | Which alert type earns attention? |
| "Hidden for your lens" expand rate | If high, the lens is hiding things people want |
| "Not relevant" taps per 100 items, by sector | If one sector is high, scoring is wrong for it |
| Web-to-app conversion from Follow button | Is the acquisition bridge working? |
| D7 / D30 retention, followers vs non-followers | Does the feature retain? |
