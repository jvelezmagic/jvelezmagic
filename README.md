# jvelezmagic.com

Personal site of **Jesús Vélez Santiago**. The three circuit-trace J's of the logo are the site's
structure: each trace is a lane in a `git log --graph` of everything I've shipped (engineering, `main`),
studied (science) and taught (teaching).

- **Intro** — the logo draws in, its traces labelled as the three lanes
- **About** — `cat README.md`: bio + illustrated portrait
- **The story so far** — `git log --graph`, newest first, actual work only (jobs, papers, courses, talks):
  a dashed ghost commit on top as the call to action, then four chapters counting down from `HEAD` to
  `git init`, lanes that power on as you scroll, and `git show` diffs for each role
- **Side projects** — `gh repo list --pinned`: open source, hackathons and research as GitHub-style pins;
  star counts refresh from the GitHub API at build time (set `GITHUB_TOKEN` to avoid rate limits)
- **Links** — GitHub, LinkedIn, X (no email or phone published, on purpose). `public/jvelezmagic_cv.pdf` (March 2024) is kept for old URLs but no longer linked

## Stack

- [Astro 7](https://astro.build) — static output, content collections, Fonts API
- Tailwind CSS v4 via `@tailwindcss/vite` (design tokens live in `src/styles/global.css`)
- No UI framework; interactive bits are small vanilla scripts inside Astro components
- Fonts: Geist, Geist Mono
- [Bun](https://bun.sh) 1.4.4 as package manager and runtime (pinned in `mise.toml`; `bunfig.toml` runs every script on Bun)
- [portless](https://github.com/vercel-labs/portless) for local dev

## Develop

```sh
bun install
bun run dev        # → https://jvelezmagic.localhost:1355 (via portless)
bun run dev:raw    # plain `astro dev` on a random port, no proxy
bun run check && bun run build
```

`dev` passes `--ignore-lock` so Astro stays in the foreground under portless even when it detects an AI agent (Astro 7 otherwise auto-backgrounds and portless loses the child).

## Editing content

- `src/data/log.yaml` — every work entry (`lane`: engineering | science | teaching; `head: true` marks the current role; `diff` lines show in `git show`)
- `src/data/chapters.yaml` — the four story chapters and their copy
- `src/data/projects.yaml` — pinned side projects (`repo` enables live star counts)
- `src/lib/site.ts` — name, socials, lane colours/positions
- `src/components/Logo.astro` — the logo as inline SVG (one `<path>` per trace)

## Art

`src/assets/profile.jpg` is the portrait in the About section. The palette comes from the logo's three blues.
