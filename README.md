# @codewavebr/wavekit

Shared UI foundation for Code Wave projects, built on [HeroUI v3](https://www.heroui.com/).

WaveKit owns visual primitives and application chrome:

- `ui`: HeroUI primitives re-exported plus WaveKit composites (form, password input, upload/confirm dialogs, toaster, day picker).
- `theme`: tokens, color helpers, theme providers, favicon helpers.
- `shell`: dashboard layout pieces such as sidebar, header, and mobile navigation.
- `charts`: chart wrappers and shared chart primitives.
- `tables`: reusable data table primitives (TanStack Table + HeroUI).
- `stats`: dashboard metric cards, grids, metric lists, and progress lists.
- `icons`: shared icon map and icon types.
- `utils`: presentation helpers used by UI components.

WaveKit should not import product-specific auth, billing, tenant, database, or API code. Those belong in `@codewavebr/wavecore` or in the consuming app.

## Setup

Peer dependencies: React 19+, Tailwind CSS v4+, `@heroui/react`, `@heroui/styles`.

In your app CSS:

```css
@import "@codewavebr/wavekit/styles.css";
```

Or compose yourself:

```css
@import "tailwindcss";
@import "@heroui/styles";
```

Mount the toast host once near the app root:

```tsx
import { Toaster } from "@codewavebr/wavekit/ui";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
```

## Usage

```tsx
import { Button, Card, CardHeader, CardTitle, Modal } from "@codewavebr/wavekit/ui";
```

WaveKit follows HeroUI compound APIs (`Card.Header`, `Modal.Dialog`, `Tabs.List`, …). Named exports such as `CardHeader` / `CardTitle` are also available where HeroUI provides them.

## Publish

Publishing happens automatically when a GitHub Release is published.
The workflow syncs `package.json` version from the release tag (e.g. `v0.2.0`)
and publishes `@codewavebr/wavekit` to the public npm registry
(`https://registry.npmjs.org`). No install auth is required for consumers.

The repository secret `NPM_TOKEN` (Automation token with publish rights on the
`@codewavebr` npm org) must be set for the publish workflow.

## Scripts

```bash
bun install
bun run test
bun run typecheck
bun run build
```
