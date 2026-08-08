# @codewave/wavekit

Shared UI foundation for Code Wave projects.

WaveKit owns visual primitives and application chrome:

- `ui`: reusable React components.
- `theme`: tokens, color helpers, theme providers, favicon helpers.
- `shell`: dashboard layout pieces such as sidebar, header, and mobile navigation.
- `charts`: chart wrappers and shared chart primitives.
- `tables`: reusable data table primitives.
- `stats`: dashboard metric cards, grids, metric lists, and progress lists.
- `icons`: shared icon map and icon types.
- `utils`: presentation helpers used by UI components.

WaveKit should not import product-specific auth, billing, tenant, database, or API code. Those belong in `@codewave/wavecore` or in the consuming app.

App-specific components that still belong outside WaveKit:

- `entity-avatar`: reads tenant/application helpers.
- `avatar-uptload`: composes app-specific avatar behavior around the generic upload dialog.

## Publish

Prepared for GitHub Packages under the `@codewave` scope.
Run `bun run build` before publishing and use `npm publish` after authenticating to
`https://npm.pkg.github.com`.

## Scripts

```bash
bun install
bun run test
bun run typecheck
bun run build
```
