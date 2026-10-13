# Culinary Blog Web

Next.js 16 App Router application using React 19, TypeScript, and Tailwind CSS.

## Run locally

```powershell
npm ci
$env:API_BASE_URL = "http://localhost:5217"
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). `API_BASE_URL` is used by
server-side data fetching and the Next.js `/api/*` rewrite. The API must allow
the frontend origin through its `Cors:AllowedOrigins` configuration.

## Source layout

- `src/app/` — App Router pages, layouts, and global styles.
- `src/lib/api.ts` — typed API client for recipes and authentication.
- `src/types/` — shared API, recipe, and authentication contracts.
- `src/app/search/` — `/search` recipe discovery page backed by TanStack Query.

Run `npm run lint`, `npm run typecheck`, and `npm run build` before publishing.
See the repository [README](../../README.md) for backend setup and API security.
