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
- `src/components/common/` — shared recipe cards, pagination, loading, and error states.
- `src/components/layout/` — site-wide header and footer.
- `src/lib/api.ts` — typed API client, HTTP error handling, and search pagination mapping.
- `src/lib/auth-store.ts` — in-memory authentication state managed with Zustand.
- `src/types/` — shared API, recipe, and authentication contracts.
- `src/app/search/` — `/search` recipe discovery page backed by TanStack Query.
- `src/app/studio/recipes/` — author recipe list, editor, image upload, and
  Draft/Published/Archived/Deleted lifecycle controls.
- `src/app/admin/users/` — role-protected admin user directory.

The interface is styled with Tailwind CSS 4 and Lucide icons. The root layout
provides the shared header and footer; the sign-in page keeps the access token
in the in-memory auth store for the current browser session.

Run `npm run lint`, `npm run typecheck`, and `npm run build` before publishing.
See the repository [README](../../README.md) for backend setup and API security.
