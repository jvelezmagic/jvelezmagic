## Development

Use Bun, not npm (`bun.lock`, `bunfig.toml`). Run `bun run dev`. It wraps `astro dev --ignore-lock` with portless and serves https://jvelezmagic.localhost:1355.
Use `bun run dev:raw` if you need plain `astro dev`.

Content lives in `src/data/*.yaml` (schemas in `src/content.config.ts`); site constants in `src/lib/site.ts`.

## Documentation

Full documentation: https://docs.astro.build
