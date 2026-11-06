# ET App Revamp: Famous Personalities Page. Working Notes

Status: draft v0.1. Concept, shortlist logic, page modules, data model, and three sample pages.
Facts on the sample pages are drafted from memory and are marked **[verify]** until checked against ET's archive and primary sources.

---

## 1. The problem

Users follow personalities, not tickers or sections. Today a personality is a search-results page: a stream of articles that mention the name. That is thin, repetitive, and does not answer "what does this person mean for my business?"

Goal: a **living page per personality** that works as a business-person knowledge graph. It should give a reader the position, the influence, the decisions, the numbers, and ET's own view, and it should update as news arrives.

---

## 2. Shortlist: who gets a page

Filter for personalities that fit ET's audience and have search demand and news velocity.

| Criterion | What it means | How to measure |
|---|---|---|
| ET fit | Business, economy, markets, policy, or tech that moves business | Editorial judgement, reviewed quarterly |
| Fan / follower base | Who searches and follows them | Search volume, social following, app follows |
| SEO demand | Queries like "[name] net worth", "[name] latest", "[name] statement" | Keyword tool (e.g. Ahrefs / Search Console) |
| News velocity | How often the name is in business news | ET archive count per 30 days |
| Monetisable intent | Readers may pay, subscribe, or act | Funnel data from the app once live |

### Starting shortlist

| Personality | ET fit | Why it fits | Notes |
|---|---|---|---|
| Jensen Huang | High | NVIDIA sets the AI compute agenda; drives Indian AI, data centre, and supply-chain stories | Sample page 1 |
| Mukesh Ambani | High | Reliance spans telecom, retail, energy, consumer, and AI; very high Indian readership | Sample page 2 |
| Raghuram Rajan | High (India policy) | Ex-RBI governor; regular commentary on rates, banking, and growth | Sample page 3. Lower SEO volume, higher trust |
| Sam Altman | High | OpenAI leadership sets the tone for enterprise AI adoption | Candidate for page 4 |
| Donald Trump | Mixed | Tariffs, trade, and sanctions move business daily; but much of the news is political | Keep only the business-impact layer. See section 5 |

Other candidates to score: Satya Nadella, Sundar Pichai, Elon Musk, N R Narayana Murthy, Nandan Nilekani, Jerome Powell.

**Sensitive cases.** Personalities with active legal or regulatory proceedings need careful wording: attribute claims, state the stage of the case, and avoid implying guilt. Those pages need a legal review before launch.

---

## 3. Page anatomy (the classic landing page)

Each personality page uses the same modules in the same order. Consistency lets users learn the page once.

1. **Hero**: name, role, one-line "why ET tracks them", and a "Following" button.
2. **What he's saying**: the 5 to 8 positions the person has taken, each with a sourced quote, date, and context. Not a list of articles.
3. **Companies he's influencing**: organisations linked by role (founder, chair, partner, supplier, regulator, customer), with the type of influence.
4. **Major decisions**: dated decisions with impact and status (announced, in progress, reversed, done).
5. **ET analysis**: ET's own view, written by an editor, dated, and updated when facts change.
6. **Timeline**: a horizontal or vertical record of key events, filterable by type.
7. **Contradictions**: statements or actions that pull against each other, shown side by side with dates and sources. Framed as "tensions to track", not gotchas.
8. **Key numbers**: a small set of metrics (company size, revenue, subscribers, rates, and so on), each with a value, date, and source.
9. **Ask anything**: a question box grounded only in this page's sourced entries. Answers cite the entries they used and decline opinions the page does not contain.

Plus: a "What changed since you last visited" strip at the top for returning followers. This is the "living" part.

---

## 4. Data model: the knowledge graph

Every module reads from the same small set of linked entities. Modules are views over the graph, not hand-written prose.

```
Person ──(role, since, until)──► Organisation
Person ──(said)──► Statement ──(on)──► Topic
Person ──(decided)──► Decision ──(affects)──► Organisation / Sector / Market
Person ──(appears in)──► Event ──► Timeline
Statement ◄──(contradicts / qualifies)──► Statement      → Contradictions module
Metric (value, unit, date, source) ──(about)──► Person or Organisation → Key numbers
ETAnalysis (author, date, version) ──(about)──► Decision / Statement / Topic
Every node has: source[], first_seen, last_verified, status
```

Key fields:
- **Statement**: `text`, `date`, `context`, `source_url`, `topic[]`, `sector[]`
- **Decision**: `title`, `date`, `status`, `impact_summary`, `sectors[]`, `sources[]`
- **Metric**: `label`, `value`, `unit`, `as_of`, `source`
- **Source**: every node needs at least one. No source, no publish.

Why a graph and not just tagged articles: it lets us answer "which companies has he influenced in the last year?" and "which of his statements contradict each other?" without an editor rewriting the page each time.

---

## 5. The feed challenge: "I run an SME. Donald said something not relevant to my business."

Decision: **do not hide the news, but do not dump it on the SME reader either.** Use three layers.

1. **Relevance score per item, per user.** Built from the user's sector, company size, and followed topics. Example: a tariff change on steel scores high for a metal-parts SME; a comment on a sports team scores low for everyone.
2. **Show the "why", not just the item.** Each feed card carries a one-line business lens: "Tariff change on imports from [country]. Affects your [sector] inputs." If there is no lens, the item is not in the personalised feed.
3. **Systemic items always pass through, with a lens.** Tariffs, sanctions, rate decisions, and elections can change business for everyone. Show them, but translate them into the user's terms. Only purely personal or political items are filtered out.

Controls the user has:
- "Not relevant to me" mutes the **topic**, not the person. The user still sees the person's business moves.
- A "Show everything about [person]" toggle on the person's page, for readers who want the full picture.
- Low-relevance items go into an "Also today" section, collapsed by default and never more than a few items per day.

Measure: skip rate, "not relevant" rate by sector, and return visits. If a sector mutes more than 40 percent of items in a week, the scoring is wrong, not the reader.

---

## 6. Design principles for the living page

- **Sourced or silent.** Nothing appears without a source and a date. Empty modules say "No entries yet" rather than filling with filler.
- **Dated everything.** Every quote, number, and decision has a date. Readers should see how old a claim is at a glance.
- **Analysis is labelled.** ET's view is always visually separate from what the person said or did.
- **Fair on contradictions.** Show both sides with dates. Do not editorialise in the Contradictions module.
- **Phone first.** Most readers arrive from search on a phone. Modules stack, the nav scrolls horizontally, and the first screen answers "who is this and why does it matter?"

---

## 7. SEO notes

- One page per personality, with a stable URL, e.g. `/personalities/jensen-huang`.
- Title pattern: "[Name]: latest news, statements, and business impact | ET". Keep it under 60 characters.
- Structured data: `Person` schema plus `Timeline` / `Event` for the timeline.
- Each module has its own anchor, so search can link to "Jensen Huang statements" or "Mukesh Ambani key numbers".
- Pages go live only when they have at least 3 sourced statements, 2 decisions, and 1 ET analysis. Thin pages stay noindexed.

---

## 8. Open questions for the team

1. Who owns the ET analysis module: a named editor per personality, or a rotating desk?
2. How often do we refresh the Key numbers module? Suggested: quarterly, or on each results release.
3. Is "Ask anything" in scope for launch, or phase 2? It needs a grounded search over the graph.
4. Legal review for personalities with active proceedings. Who signs off?
5. Do we charge for the personalised feed, or only for alerts?
6. Which two personalities go live first? Suggested: Jensen Huang and Mukesh Ambani, since they have the strongest SEO and the most business-led news.

---

## 9. Sample pages in this folder (v0.2, app design)

Open `index.html` first. It is the "Following" hub and links to every page. For why this belongs in the app, see `APP-CASE.md`.

| File | What it is | Status |
|---|---|---|
| `index.html` | Following hub: today's brief, followed people, suggestions | Prototype |
| `jensen-huang.html` | Jensen Huang | Draft. Facts marked [verify] |
| `mukesh-ambani.html` | Mukesh Ambani | Draft. Facts marked [verify] |
| `raghuram-rajan.html` | Raghuram Rajan (institutions, not companies) | Draft. Facts marked [verify] |
| `donald-trump.html` | Donald Trump, business layer only. The SME showcase | Draft. Facts marked [verify] |
| `assets/app.css`, `assets/app.js` | Shared premium theme (dark and light) and behaviour | Done |
| `scripts/fetch_photos.py` | Downloads real portraits from Wikimedia Commons, with credits | Ready to run |

What to try on any page:
- **Business lens.** Switch between SME owner, Investor and Everything. Low-relevance items fold into "N items hidden for your lens".
- **Ask.** Answers link only to entries on the page. If nothing matches, it says so instead of guessing.
- **Follow.** Starts on "Major decisions only".

### Photos

The pages expect `assets/photos/<slug>.jpg` and show a monogram plate until a photo is there. To fetch real, freely licensed portraits with photographer and licence credits:

```
python3 scripts/fetch_photos.py
```

This needs network access to `en.wikipedia.org`, `commons.wikimedia.org` and `upload.wikimedia.org`. For production, swap in ET's licensed agency photos under the same file names.

Next steps: fact-check each `[verify]` item, add sourced quotes to "What he's saying", fetch photos, and wire the modules to the graph once the data model is agreed.
